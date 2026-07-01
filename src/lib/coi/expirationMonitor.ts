import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { trackEvent } from "@/lib/analytics/track";
import {
  COI_MONITOR_TYPE,
  COI_ENTITLEMENT,
  COI_EXPIRATION_REMINDER_WINDOWS,
  COI_EXPIRING_SOON_DAYS,
} from "./constants";

export function daysUntilExpiration(expirationDate: Date, from = new Date()): number {
  const ms = expirationDate.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function computeCoiMonitoringStatus(
  expirationDate: Date,
  from = new Date()
): "active_monitoring" | "expiring_soon" | "expired" {
  const days = daysUntilExpiration(expirationDate, from);
  if (days < 0) return "expired";
  if (days <= COI_EXPIRING_SOON_DAYS) return "expiring_soon";
  return "active_monitoring";
}

export async function completeOtherCoiMonitors(
  organizationId: string,
  vendorId: string,
  exceptWorkflowId: string
): Promise<void> {
  const supabase = createServiceClient();
  const { data: monitors } = await supabase
    .from("monitors")
    .select("id, workflow_instance_id")
    .eq("organization_id", organizationId)
    .eq("vendor_id", vendorId)
    .eq("monitor_type", COI_MONITOR_TYPE)
    .eq("status", "active")
    .neq("workflow_instance_id", exceptWorkflowId);

  for (const monitor of monitors ?? []) {
    await supabase.from("monitors").update({ status: "completed" }).eq("id", monitor.id);
    await supabase
      .from("workflow_instances")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", monitor.workflow_instance_id)
      .in("status", ["active_monitoring", "expiring_soon", "expired"]);
    await createAuditLog({
      organizationId,
      actorType: "system",
      action: "coi_monitor.completed",
      targetType: "monitor",
      targetId: monitor.id,
      metadata: { reason: "replacement_approved" },
    });
  }
}

export async function createCoiExpirationMonitor(
  workflowId: string,
  organizationId: string,
  documentId: string,
  vendorId: string,
  expirationDate: Date,
  ownerId: string
): Promise<string> {
  const supabase = createServiceClient();

  await completeOtherCoiMonitors(organizationId, vendorId, workflowId);

  const monitoringStatus = computeCoiMonitoringStatus(expirationDate);
  const nextRun = new Date();
  nextRun.setHours(6, 0, 0, 0);
  if (nextRun <= new Date()) nextRun.setDate(nextRun.getDate() + 1);

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: organizationId,
      name: `COI expiration — ${expirationDate.toISOString().slice(0, 10)}`,
      monitor_type: COI_MONITOR_TYPE,
      target_type: "document",
      target_id: documentId,
      workflow_instance_id: workflowId,
      document_id: documentId,
      vendor_id: vendorId,
      monitored_date: expirationDate.toISOString(),
      status: "active",
      next_run_at: nextRun.toISOString(),
      created_by: ownerId,
      config: { expirationDate: expirationDate.toISOString() },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("workflow_instances")
    .update({
      status: monitoringStatus,
      metadata: {
        approved_at: new Date().toISOString(),
        expiration_date: expirationDate.toISOString(),
      },
    })
    .eq("id", workflowId);

  await supabase.from("documents").update({ status: monitoringStatus }).eq("id", documentId);

  await scheduleCoiExpirationReminders(
    workflowId,
    organizationId,
    documentId,
    expirationDate,
    ownerId
  );

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "coi_monitor.created",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { workflowId, expirationDate: expirationDate.toISOString() },
  });

  trackEvent("coi_monitor_created", { workflowId, monitorId: monitor.id });
  trackEvent("first_coi_monitor_created", { workflowId });

  return monitor.id;
}

export async function scheduleCoiExpirationReminders(
  workflowId: string,
  organizationId: string,
  documentId: string,
  expirationDate: Date,
  ownerId: string
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, COI_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(ownerId);
  const ownerEmail = user?.email;
  if (!ownerEmail) return;

  const now = new Date();

  for (const { window, daysBefore, type } of COI_EXPIRATION_REMINDER_WINDOWS) {
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
      metadata: { category: "coi_expiration", documentId, internal: true },
    });

    if (!error) {
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "coi_reminder.created",
        targetType: "workflow_instance",
        targetId: workflowId,
        metadata: { window, scheduledAt: scheduledAt.toISOString(), category: "expiration" },
      });
    }
  }
}

export async function runCoiExpirationMonitor(): Promise<{
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
    .select("*, workflow_instances(id, status, owner_id, organization_id)")
    .eq("monitor_type", COI_MONITOR_TYPE)
    .eq("status", "active")
    .limit(200);

  for (const monitor of monitors ?? []) {
    try {
      if (!monitor.monitored_date || !monitor.workflow_instance_id) continue;

      const expirationDate = new Date(monitor.monitored_date);
      const newStatus = computeCoiMonitoringStatus(expirationDate, now);
      const workflow = monitor.workflow_instances as {
        id: string;
        status: string;
        owner_id: string;
        organization_id: string;
      } | null;

      if (!workflow) continue;

      if (workflow.status !== newStatus) {
        await supabase
          .from("workflow_instances")
          .update({ status: newStatus })
          .eq("id", workflow.id);

        if (monitor.document_id) {
          await supabase.from("documents").update({ status: newStatus }).eq("id", monitor.document_id);
        }

        const auditAction =
          newStatus === "expired" ? "coi_status.expired" : "coi_status.expiring_soon";
        await createAuditLog({
          organizationId: monitor.organization_id,
          actorType: "system",
          action: auditAction,
          targetType: "workflow_instance",
          targetId: workflow.id,
          metadata: { expirationDate: monitor.monitored_date },
        });

        if (newStatus === "expiring_soon") {
          trackEvent("coi_expiring_soon", { workflowId: workflow.id });
        }
        if (newStatus === "expired") {
          trackEvent("coi_expired", { workflowId: workflow.id });
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
    .in("type", ["coi_expiration_internal"])
    .lte("scheduled_at", now.toISOString())
    .limit(100);

  const { internalCoiExpirationReminderEmail } = await import("@/lib/email/templates/coi");
  const { sendEmail } = await import("@/lib/email/sendEmail");

  for (const reminder of dueReminders ?? []) {
    try {
      const { data: workflow } = await supabase
        .from("workflow_instances")
        .select("id, organization_id, vendor_id, metadata, status")
        .eq("id", reminder.workflow_instance_id)
        .single();

      if (!workflow || ["cancelled", "completed"].includes(workflow.status)) {
        await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
        continue;
      }

      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", reminder.organization_id)
        .single();
      const { data: vendor } = workflow.vendor_id
        ? await supabase.from("vendors").select("name").eq("id", workflow.vendor_id).single()
        : { data: null };

      const metadata = workflow.metadata as Record<string, string | null>;
      const expirationDate = metadata.expiration_date ?? "";

      if (reminder.recipient_email) {
        const email = internalCoiExpirationReminderEmail({
          organizationName: org?.name ?? "",
          vendorName: vendor?.name ?? "Vendor",
          expirationDate: expirationDate
            ? new Date(expirationDate).toLocaleDateString()
            : "—",
          workflowUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflow.id}`,
        });
        await sendEmail({
          organizationId: reminder.organization_id,
          to: reminder.recipient_email,
          templateKey: email.templateKey,
          subject: email.subject,
          variables: {
            organizationName: org?.name ?? "",
            vendorName: vendor?.name ?? "",
            expirationDate,
            workflowUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflow.id}`,
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
        action: "coi_reminder.sent",
        targetType: "reminder",
        targetId: reminder.id,
        metadata: { window: reminder.reminder_window },
      });

      trackEvent("coi_reminder_sent", { workflowId: workflow.id });
      remindersSent++;
    } catch {
      await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
      errors++;
    }
  }

  return { updated, remindersSent, errors };
}

function getNextDailyRun(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(6, 0, 0, 0);
  return d;
}
