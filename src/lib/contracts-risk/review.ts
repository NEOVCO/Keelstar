import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { CONTRACT_RISK_WORKFLOW_TYPE, CONTRACT_RISK_DOCUMENT_TYPE } from "./constants";

export async function approveRiskScan(workflowId: string, notes?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", CONTRACT_RISK_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Risk scan not found");
  if (workflow.status !== "review_needed") {
    throw new Error("Risk scan is not awaiting review");
  }

  const approvedAt = new Date().toISOString();

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: approvedAt,
      completed_by_type: "user",
      completed_by_id: ctx.user.id,
    })
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress"]);

  await supabase
    .from("workflow_instances")
    .update({
      status: "approved",
      completed_at: approvedAt,
      metadata: {
        ...(workflow.metadata as object),
        approved_at: approvedAt,
        approved_by: ctx.user.email,
        approval_notes: notes ?? null,
      },
    })
    .eq("id", workflowId);

  await supabase
    .from("documents")
    .update({ status: "approved" })
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", CONTRACT_RISK_DOCUMENT_TYPE);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract_risk.approved",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { notes },
  });

  trackEvent("contract_risk_approved", { workflowId });
  return { success: true };
}

export async function rejectRiskScan(workflowId: string, reason: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  if (!reason?.trim()) throw new Error("Rejection reason is required");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", CONTRACT_RISK_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Risk scan not found");
  if (workflow.status !== "review_needed") {
    throw new Error("Risk scan is not awaiting review");
  }

  const rejectedAt = new Date().toISOString();

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: rejectedAt,
      completed_by_type: "user",
      completed_by_id: ctx.user.id,
      metadata: { outcome: "rejected", reason },
    })
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress"]);

  await supabase
    .from("workflow_instances")
    .update({
      status: "rejected",
      metadata: {
        ...(workflow.metadata as object),
        rejected_at: rejectedAt,
        rejected_by: ctx.user.email,
        rejection_reason: reason,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract_risk.rejected",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  trackEvent("contract_risk_rejected", { workflowId });
  return { success: true };
}

export async function cancelRiskScan(workflowId: string, reason?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Risk scan not found");

  await supabase
    .from("tasks")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowId)
    .in("status", ["pending", "in_progress"]);

  await supabase
    .from("workflow_instances")
    .update({
      status: "cancelled",
      metadata: {
        ...(workflow.metadata as object),
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason ?? null,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract_risk.cancelled",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  return { success: true };
}
