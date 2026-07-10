import { createServiceClient } from "@/lib/supabase/service";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { SIGNER_ENTITLEMENT, SIGNER_REMINDER_WINDOWS } from "./constants";

const TERMINAL_SIGNER_STATUSES = ["completed", "cancelled"];

export async function scheduleSignerReminders(
  workflowInstanceId: string,
  organizationId: string,
  recipientEmail: string,
  dueDate: Date
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, SIGNER_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const now = new Date();

  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled")
    .in("type", ["signer_reminder", "signer_overdue"]);

  for (const { window, daysOffset, type } of SIGNER_REMINDER_WINDOWS) {
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
      metadata: { category: "signer_request" },
    });

    if (!error) {
      const { createAuditLog } = await import("@/lib/audit/createAuditLog");
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "signer_reminder.created",
        targetType: "workflow_instance",
        targetId: workflowInstanceId,
        metadata: { window, scheduledAt: scheduledAt.toISOString() },
      });
    }
  }
}

export async function cancelSignerReminders(
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

export { TERMINAL_SIGNER_STATUSES };
