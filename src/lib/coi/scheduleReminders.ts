import { createServiceClient } from "@/lib/supabase/service";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { COI_ENTITLEMENT } from "./constants";

const REQUEST_REMINDER_WINDOWS = [
  { window: "before_7d", daysOffset: -7, type: "coi_reminder" },
  { window: "on_due", daysOffset: 0, type: "coi_reminder" },
  { window: "after_7d", daysOffset: 7, type: "coi_overdue" },
] as const;

const TERMINAL_COI_STATUSES = [
  "approved",
  "active_monitoring",
  "expiring_soon",
  "expired",
  "completed",
  "cancelled",
];

export async function scheduleCoiRequestReminders(
  workflowInstanceId: string,
  organizationId: string,
  recipientEmail: string,
  dueDate: Date
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, COI_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const now = new Date();

  for (const { window, daysOffset, type } of REQUEST_REMINDER_WINDOWS) {
    const scheduledAt = new Date(dueDate);
    scheduledAt.setDate(scheduledAt.getDate() + daysOffset);
    scheduledAt.setHours(9, 0, 0, 0);
    if (scheduledAt <= now) continue;

    const { error } = await supabase.from("reminders").insert({
      organization_id: organizationId,
      workflow_instance_id: workflowInstanceId,
      type,
      scheduled_at: scheduledAt.toISOString(),
      status: "scheduled",
      reminder_window: window,
      recipient_email: recipientEmail,
      metadata: { category: "coi_request" },
    });

    if (!error) {
      const { createAuditLog } = await import("@/lib/audit/createAuditLog");
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "coi_reminder.created",
        targetType: "workflow_instance",
        targetId: workflowInstanceId,
        metadata: { window, scheduledAt: scheduledAt.toISOString(), category: "request" },
      });
    }
  }
}

export async function cancelCoiReminders(
  workflowInstanceId: string,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled");
}

export { TERMINAL_COI_STATUSES, REQUEST_REMINDER_WINDOWS };
