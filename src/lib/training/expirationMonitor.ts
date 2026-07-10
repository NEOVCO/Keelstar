import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { trackEvent } from "@/lib/analytics/track";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  TRAINING_MONITOR_TYPE,
  TRAINING_ENTITLEMENT,
  TRAINING_EXPIRATION_REMINDER_WINDOWS,
  TRAINING_EXPIRING_SOON_DAYS,
} from "./constants";
import { internalTrainingExpirationReminderEmail } from "@/lib/email/templates/training";

export function daysUntilExpiration(expirationDate: Date, from = new Date()): number {
  const ms = expirationDate.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function computeTrainingMonitoringStatus(
  expirationDate: Date,
  from = new Date()
): "active_monitoring" | "expiring_soon" | "expired" {
  const days = daysUntilExpiration(expirationDate, from);
  if (days < 0) return "expired";
  if (days <= TRAINING_EXPIRING_SOON_DAYS) return "expiring_soon";
  return "active_monitoring";
}

export async function createTrainingExpirationMonitor(
  workflowId: string,
  organizationId: string,
  documentId: string,
  vendorId: string | null,
  expirationDate: Date,
  ownerId: string,
  courseName: string
): Promise<string> {
  const supabase = createServiceClient();
  const monitoringStatus = computeTrainingMonitoringStatus(expirationDate);
  const nextRun = new Date();
  nextRun.setHours(6, 0, 0, 0);
  if (nextRun <= new Date()) nextRun.setDate(nextRun.getDate() + 1);

  await supabase
    .from("monitors")
    .update({ status: "completed" })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", TRAINING_MONITOR_TYPE)
    .eq("status", "active");

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: organizationId,
      name: `Training expiration — ${courseName}`,
      monitor_type: TRAINING_MONITOR_TYPE,
      target_type: "document",
      target_id: documentId,
      workflow_instance_id: workflowId,
      document_id: documentId,
      vendor_id: vendorId,
      monitored_date: expirationDate.toISOString(),
      status: "active",
      next_run_at: nextRun.toISOString(),
      created_by: ownerId,
      config: { expirationDate: expirationDate.toISOString(), courseName },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("workflow_instances")
    .update({ status: monitoringStatus })
    .eq("id", workflowId);

  await supabase.from("documents").update({ status: monitoringStatus }).eq("id", documentId);

  await scheduleTrainingExpirationReminders(
    workflowId,
    organizationId,
    documentId,
    expirationDate,
    ownerId,
    courseName
  );

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "training_monitor.activated",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { workflowId, expirationDate: expirationDate.toISOString() },
  });

  trackEvent("training_expiration_monitor_created", { workflowId, monitorId: monitor.id });
  return monitor.id;
}

export async function scheduleTrainingExpirationReminders(
  workflowId: string,
  organizationId: string,
  documentId: string,
  expirationDate: Date,
  ownerId: string,
  courseName: string
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, TRAINING_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(ownerId);
  const ownerEmail = user?.email;
  if (!ownerEmail) return;

  const now = new Date();

  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled")
    .in("type", ["training_expiration_internal"]);

  for (const { window, daysBefore, type } of TRAINING_EXPIRATION_REMINDER_WINDOWS) {
    const scheduledAt = new Date(expirationDate);
    scheduledAt.setDate(scheduledAt.getDate() - daysBefore);
    scheduledAt.setHours(9, 0, 0, 0);
    if (scheduledAt <= now) continue;

    const { error } = await supabase.from("reminders").insert({
      organization_id: organizationId,
      workflow_instance_id: workflowId,
      type,
      scheduled_at: scheduledAt.toISOString(),
      status: "scheduled",
      reminder_window: window,
      recipient_email: ownerEmail,
      metadata: { category: "training_expiration", documentId, courseName, internal: true },
    });

    if (!error) {
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "training_reminder.created",
        targetType: "workflow_instance",
        targetId: workflowId,
        metadata: { window, scheduledAt: scheduledAt.toISOString(), category: "expiration" },
      });
    }
  }
}

export async function runTrainingExpirationMonitor(): Promise<{
  updated: number;
  remindersSent: number;
  errors: number;
}> {
  const supabase = createServiceClient();
  const now = new Date();
  let updated = 0;
  let remindersSent = 0;
  let errors = 0;

  const { data: monitors } = await supabase
    .from("monitors")
    .select("*, workflow_instances(id, status, owner_id, organization_id, metadata, title)")
    .eq("monitor_type", TRAINING_MONITOR_TYPE)
    .eq("status", "active")
    .limit(200);

  for (const monitor of monitors ?? []) {
    try {
      if (!monitor.monitored_date || !monitor.workflow_instance_id) continue;

      const expirationDate = new Date(monitor.monitored_date);
      const newStatus = computeTrainingMonitoringStatus(expirationDate, now);
      const workflow = monitor.workflow_instances as {
        id: string;
        status: string;
        organization_id: string;
        metadata: Record<string, string | null>;
        title: string;
      } | null;

      if (!workflow) continue;
      if (["cancelled", "renewed", "completed"].includes(workflow.status)) continue;

      if (workflow.status !== newStatus) {
        await supabase.from("workflow_instances").update({ status: newStatus }).eq("id", workflow.id);
        if (monitor.document_id) {
          await supabase.from("documents").update({ status: newStatus }).eq("id", monitor.document_id);
        }

        const auditAction =
          newStatus === "expired" ? "training_status.expired" : "training_status.expiring_soon";
        await createAuditLog({
          organizationId: monitor.organization_id,
          actorType: "system",
          action: auditAction,
          targetType: "workflow_instance",
          targetId: workflow.id,
          metadata: { expirationDate: monitor.monitored_date },
        });

        if (newStatus === "expiring_soon") trackEvent("training_expiring_soon", { workflowId: workflow.id });
        if (newStatus === "expired") {
          trackEvent("training_expired", { workflowId: workflow.id });
          await supabase.from("monitors").update({ status: "expired" }).eq("id", monitor.id);
        }
        updated++;
      }

      await supabase
        .from("monitors")
        .update({ last_run_at: now.toISOString(), next_run_at: getNextDailyRun().toISOString() })
        .eq("id", monitor.id);
    } catch {
      errors++;
      await supabase.from("monitors").update({ status: "failed" }).eq("id", monitor.id);
    }
  }

  const { data: dueReminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("status", "scheduled")
    .eq("type", "training_expiration_internal")
    .lte("scheduled_at", now.toISOString())
    .limit(100);

  for (const reminder of dueReminders ?? []) {
    try {
      const { data: workflow } = await supabase
        .from("workflow_instances")
        .select("id, organization_id, metadata, status, title, vendor_id")
        .eq("id", reminder.workflow_instance_id)
        .single();

      if (!workflow || ["cancelled", "renewed", "completed"].includes(workflow.status)) {
        await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
        continue;
      }

      const metadata = workflow.metadata as Record<string, string | null>;
      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", reminder.organization_id)
        .single();

      const { data: person } = workflow.vendor_id
        ? await supabase.from("vendors").select("name").eq("id", workflow.vendor_id).single()
        : { data: null };

      const workflowUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflow.id}`;
      const courseName = metadata.course_name ?? workflow.title;
      const expirationDate = metadata.expiration_date ?? monitorDateFromReminder(reminder);

      if (reminder.recipient_email) {
        const email = internalTrainingExpirationReminderEmail({
          organizationName: org?.name ?? "",
          personName: person?.name ?? metadata.person_name ?? "Team member",
          courseName,
          expirationDate: expirationDate ? new Date(expirationDate).toLocaleDateString() : "—",
          workflowUrl,
        });

        await sendEmail({
          organizationId: reminder.organization_id,
          to: reminder.recipient_email,
          templateKey: email.templateKey,
          subject: email.subject,
          variables: {
            organizationName: org?.name ?? "",
            personName: person?.name ?? "",
            courseName,
            expirationDate: expirationDate ?? "",
            workflowUrl,
          },
        });
      }

      await supabase
        .from("reminders")
        .update({ status: "sent", sent_at: now.toISOString() })
        .eq("id", reminder.id);

      await createAuditLog({
        organizationId: reminder.organization_id,
        actorType: "system",
        action: "training_reminder.sent",
        targetType: "reminder",
        targetId: reminder.id,
        metadata: { window: reminder.reminder_window },
      });

      remindersSent++;
    } catch {
      await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
      errors++;
    }
  }

  return { updated, remindersSent, errors };
}

function monitorDateFromReminder(reminder: { metadata?: unknown }): string {
  const meta = (reminder.metadata ?? {}) as Record<string, string>;
  return meta.expirationDate ?? "";
}

function getNextDailyRun(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(6, 0, 0, 0);
  return d;
}
