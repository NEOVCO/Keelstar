import { createServiceClient } from "@/lib/supabase/service";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { INVOICE_ENTITLEMENT, INVOICE_APPROVAL_REMINDER_WINDOWS } from "./constants";

const TERMINAL_INVOICE_STATUSES = ["approved", "rejected", "cancelled"];

export async function scheduleInvoiceApprovalReminders(
  workflowInstanceId: string,
  organizationId: string,
  approverEmail: string,
  approvalDueDate: Date
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, INVOICE_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const now = new Date();

  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled")
    .in("type", ["invoice_reminder", "invoice_overdue"]);

  for (const { window, daysOffset, type } of INVOICE_APPROVAL_REMINDER_WINDOWS) {
    const scheduledAt = new Date(approvalDueDate);
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
      recipient_email: approverEmail,
      metadata: { category: "invoice_approval" },
    });

    if (!error) {
      const { createAuditLog } = await import("@/lib/audit/createAuditLog");
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "invoice_reminder.created",
        targetType: "workflow_instance",
        targetId: workflowInstanceId,
        metadata: { window, scheduledAt: scheduledAt.toISOString() },
      });
    }
  }
}

export async function cancelInvoiceReminders(
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

export { TERMINAL_INVOICE_STATUSES };
