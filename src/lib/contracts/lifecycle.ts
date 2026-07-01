import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { cancelContractReminders } from "./scheduleReminders";
import { CONTRACT_MONITOR_TYPE } from "./constants";

async function completeActiveMonitors(workflowId: string, status: "completed" | "cancelled") {
  const supabase = createServiceClient();
  await supabase
    .from("monitors")
    .update({ status })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", CONTRACT_MONITOR_TYPE)
    .eq("status", "active");
}

const markRenewedSchema = z.object({
  workflowId: z.string().uuid(),
  newRenewalDate: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

export async function markContractRenewed(input: z.infer<typeof markRenewedSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = markRenewedSchema.parse(input);
  const supabase = createServiceClient();

  const renewalDate = new Date(data.newRenewalDate);
  if (Number.isNaN(renewalDate.getTime())) throw new Error("Invalid renewal date");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Contract not found");

  await cancelContractReminders(data.workflowId, ctx.organization.id);
  await completeActiveMonitors(data.workflowId, "completed");

  await supabase
    .from("workflow_instances")
    .update({
      status: "renewed",
      due_date: renewalDate.toISOString(),
      metadata: {
        ...(workflow.metadata as object),
        renewal_date: renewalDate.toISOString(),
        renewed_at: new Date().toISOString(),
        renewal_notes: data.notes ?? null,
      },
    })
    .eq("id", data.workflowId);

  await supabase
    .from("documents")
    .update({ status: "archived" })
    .eq("workflow_instance_id", data.workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.renewed",
    targetType: "workflow_instance",
    targetId: data.workflowId,
    metadata: { newRenewalDate: renewalDate.toISOString() },
  });

  trackEvent("contract_marked_renewed", { workflowId: data.workflowId });
  return { success: true };
}

export async function markContractTerminated(workflowId: string, reason?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  await cancelContractReminders(workflowId, ctx.organization.id);
  await completeActiveMonitors(workflowId, "cancelled");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Contract not found");

  await supabase
    .from("workflow_instances")
    .update({
      status: "terminated",
      completed_at: new Date().toISOString(),
      metadata: {
        ...(workflow.metadata as object),
        terminated_at: new Date().toISOString(),
        termination_reason: reason ?? null,
      },
    })
    .eq("id", workflowId);

  await supabase
    .from("documents")
    .update({ status: "archived" })
    .eq("workflow_instance_id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.terminated",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  trackEvent("contract_marked_terminated", { workflowId });
  return { success: true };
}

export async function archiveContract(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  await cancelContractReminders(workflowId, ctx.organization.id);
  await completeActiveMonitors(workflowId, "completed");

  await supabase
    .from("workflow_instances")
    .update({ status: "archived", completed_at: new Date().toISOString() })
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id);

  await supabase
    .from("documents")
    .update({ status: "archived" })
    .eq("workflow_instance_id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.archived",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("contract_archived", { workflowId });
  return { success: true };
}

export async function cancelContract(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  await cancelContractReminders(workflowId, ctx.organization.id);
  await completeActiveMonitors(workflowId, "cancelled");

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
    action: "contract.cancelled",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  return { success: true };
}

/** @deprecated use markContractRenewed */
export async function completeContract(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  const meta = (workflow?.metadata ?? {}) as Record<string, string | null>;
  const renewalDate = meta.renewal_date;
  if (!renewalDate) {
    return markContractTerminated(workflowId, "Marked complete without new renewal date");
  }

  return markContractRenewed({ workflowId, newRenewalDate: renewalDate });
}

export { markRenewedSchema };
