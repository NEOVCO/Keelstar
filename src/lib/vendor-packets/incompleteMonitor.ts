import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { VENDOR_PACKET_MONITOR_TYPE } from "./constants";
import { cancelVendorPacketReminders } from "./scheduleReminders";

export async function createVendorPacketMonitor(
  workflowId: string,
  organizationId: string,
  vendorId: string,
  dueDate: Date,
  ownerId: string,
  vendorName: string
): Promise<string> {
  const supabase = createServiceClient();
  const nextRun = new Date();
  nextRun.setHours(6, 0, 0, 0);
  if (nextRun <= new Date()) nextRun.setDate(nextRun.getDate() + 1);

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: organizationId,
      name: `Vendor packet — ${vendorName}`,
      monitor_type: VENDOR_PACKET_MONITOR_TYPE,
      target_type: "workflow_instance",
      target_id: workflowId,
      workflow_instance_id: workflowId,
      vendor_id: vendorId,
      monitored_date: dueDate.toISOString(),
      status: "active",
      next_run_at: nextRun.toISOString(),
      created_by: ownerId,
      config: { dueDate: dueDate.toISOString() },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "vendor_packet.monitor_created",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { workflowId },
  });

  return monitor.id;
}

export async function runVendorPacketMonitor(): Promise<{
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
    .select("*, workflow_instances(id, status, organization_id, metadata, owner_id, due_date)")
    .eq("monitor_type", VENDOR_PACKET_MONITOR_TYPE)
    .eq("status", "active")
    .limit(200);

  for (const monitor of monitors ?? []) {
    try {
      const workflow = monitor.workflow_instances as {
        id: string;
        status: string;
        organization_id: string;
        owner_id: string | null;
        due_date: string | null;
        metadata: Record<string, unknown>;
      } | null;

      if (!workflow) continue;
      if (["completed", "cancelled"].includes(workflow.status)) {
        await supabase.from("monitors").update({ status: "completed" }).eq("id", monitor.id);
        continue;
      }

      const dueDate = workflow.due_date ? new Date(workflow.due_date) : null;
      if (dueDate && dueDate < now && !["overdue", "review_needed", "completed"].includes(workflow.status)) {
        await supabase.from("workflow_instances").update({ status: "overdue" }).eq("id", workflow.id);
        await createAuditLog({
          organizationId: monitor.organization_id,
          actorType: "system",
          action: "vendor_packet.overdue",
          targetType: "workflow_instance",
          targetId: workflow.id,
        });
        trackEvent("vendor_packet_overdue", { workflowId: workflow.id });
        updated++;
      }

      await supabase
        .from("monitors")
        .update({
          last_run_at: now.toISOString(),
          next_run_at: getNextDailyRun().toISOString(),
        })
        .eq("id", monitor.id);
    } catch {
      errors++;
    }
  }

  const { data: dueReminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("status", "scheduled")
    .in("type", ["vendor_packet_reminder", "vendor_packet_overdue"])
    .lte("scheduled_at", now.toISOString())
    .limit(100);

  const templates = await import("@/lib/email/templates/vendor-packets");
  const { sendEmail } = await import("@/lib/email/sendEmail");
  const { parseStoredCcEmails } = await import("@/lib/email/outboundCc");

  for (const reminder of dueReminders ?? []) {
    try {
      const { data: workflow } = await supabase
        .from("workflow_instances")
        .select("id, status, title, metadata, organization_id, vendor_id, due_date")
        .eq("id", reminder.workflow_instance_id)
        .single();

      if (!workflow || ["completed", "cancelled"].includes(workflow.status)) {
        await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
        continue;
      }

      const metadata = workflow.metadata as Record<string, string | null>;
      const portalUrl = metadata.magic_link_url ?? "";
      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", reminder.organization_id)
        .single();

      const { data: vendor } = workflow.vendor_id
        ? await supabase.from("vendors").select("name").eq("id", workflow.vendor_id).single()
        : { data: null };

      if (reminder.recipient_email) {
        const isOverdue = reminder.type === "vendor_packet_overdue";
        const email = isOverdue
          ? templates.vendorPacketOverdueEmail({
              organizationName: org?.name ?? "",
              vendorName: vendor?.name ?? workflow.title,
              dueDate: workflow.due_date
                ? new Date(workflow.due_date).toLocaleDateString()
                : "—",
              portalUrl,
            })
          : templates.vendorPacketReminderEmail({
              organizationName: org?.name ?? "",
              vendorName: vendor?.name ?? workflow.title,
              dueDate: workflow.due_date
                ? new Date(workflow.due_date).toLocaleDateString()
                : "—",
              portalUrl,
            });

        await sendEmail({
          organizationId: reminder.organization_id,
          to: reminder.recipient_email,
          templateKey: email.templateKey,
          subject: email.subject,
          variables: {
            organizationName: org?.name ?? "",
            vendorName: vendor?.name ?? "",
            portalUrl,
          },
          cc: parseStoredCcEmails(metadata),
        });
      }

      await supabase
        .from("reminders")
        .update({ status: "sent", sent_at: now.toISOString() })
        .eq("id", reminder.id);

      await createAuditLog({
        organizationId: reminder.organization_id,
        actorType: "system",
        action: "vendor_packet.reminder_sent",
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

function getNextDailyRun(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(6, 0, 0, 0);
  return d;
}
