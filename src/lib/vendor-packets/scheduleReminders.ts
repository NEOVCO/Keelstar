import { createServiceClient } from "@/lib/supabase/service";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import { VENDOR_PACKET_ENTITLEMENT, PACKET_REQUEST_REMINDER_WINDOWS } from "./constants";

export async function scheduleVendorPacketReminders(
  workflowInstanceId: string,
  organizationId: string,
  recipientEmail: string,
  dueDate: Date
): Promise<void> {
  const hasPaid = await checkModuleEntitlement(organizationId, VENDOR_PACKET_ENTITLEMENT);
  if (!hasPaid) return;

  const supabase = createServiceClient();
  const now = new Date();

  for (const { window, daysOffset, type } of PACKET_REQUEST_REMINDER_WINDOWS) {
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
      metadata: { category: "vendor_packet_request" },
    });

    if (!error) {
      const { createAuditLog } = await import("@/lib/audit/createAuditLog");
      await createAuditLog({
        organizationId,
        actorType: "system",
        action: "vendor_packet.reminder_created",
        targetType: "workflow_instance",
        targetId: workflowInstanceId,
        metadata: { window, scheduledAt: scheduledAt.toISOString() },
      });
    }
  }
}

export async function cancelVendorPacketReminders(
  workflowInstanceId: string,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled")
    .in("type", ["vendor_packet_reminder", "vendor_packet_overdue"]);
}
