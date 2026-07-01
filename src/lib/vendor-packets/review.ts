import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { cancelVendorPacketReminders } from "./scheduleReminders";
import { VENDOR_PACKET_MONITOR_TYPE } from "./constants";

export async function completeVendorPacket(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  await cancelVendorPacketReminders(workflowId, ctx.organization.id);

  await supabase
    .from("monitors")
    .update({ status: "completed" })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", VENDOR_PACKET_MONITOR_TYPE);

  await supabase
    .from("workflow_instances")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor_packet.completed",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("vendor_packet_completed", { workflowId });
  return { success: true };
}

export async function cancelVendorPacket(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  await cancelVendorPacketReminders(workflowId, ctx.organization.id);

  await supabase
    .from("monitors")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", VENDOR_PACKET_MONITOR_TYPE);

  await supabase
    .from("workflow_instances")
    .update({ status: "cancelled", completed_at: new Date().toISOString() })
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor_packet.cancelled",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  return { success: true };
}
