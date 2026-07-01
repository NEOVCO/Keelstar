import { createServiceClient } from "@/lib/supabase/service";
import { checkEntitlement } from "@/lib/billing/checkEntitlement";

const REMINDER_WINDOWS = [
  { window: "before_7d", daysOffset: -7, type: "w9_reminder" },
  { window: "on_due", daysOffset: 0, type: "w9_reminder" },
  { window: "after_7d", daysOffset: 7, type: "w9_overdue" },
] as const;

const TERMINAL_STATUSES = ["approved", "completed", "cancelled"];

export async function scheduleW9Reminders(
  workflowInstanceId: string,
  organizationId: string,
  recipientEmail: string,
  dueDate: Date
): Promise<void> {
  const hasPaid = await checkEntitlement(organizationId);
  if (!hasPaid) return; // Free tier: manual reminders only

  const supabase = createServiceClient();
  const now = new Date();

  for (const { window, daysOffset, type } of REMINDER_WINDOWS) {
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
    });

    if (!error) {
      const { createAuditLog } = await import("@/lib/audit/createAuditLog");
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "reminder.created",
        targetType: "workflow_instance",
        targetId: workflowInstanceId,
        metadata: { window, scheduledAt: scheduledAt.toISOString() },
      });
    }
  }
}

export async function cancelReminders(workflowInstanceId: string, organizationId: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled");
}

export { TERMINAL_STATUSES, REMINDER_WINDOWS };
