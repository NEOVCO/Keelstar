import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { cancelReminders } from "./scheduleReminders";
import { trackEvent } from "@/lib/analytics/track";

export async function approveW9Document(workflowId: string, notes?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Request not found");
  if (!["submitted", "review_needed"].includes(workflow.status)) {
    throw new Error("Request is not ready for approval");
  }

  const approvedAt = new Date().toISOString();

  await supabase
    .from("workflow_instances")
    .update({
      status: "completed",
      completed_at: approvedAt,
      metadata: { ...(workflow.metadata as object), approved_at: approvedAt, approval_notes: notes ?? null },
    })
    .eq("id", workflowId);

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .maybeSingle();

  if (document) {
    await supabase.from("documents").update({ status: "approved" }).eq("id", document.id);
    await createAuditLog({
      organizationId: ctx.organization.id,
      actorType: "user",
      actorId: ctx.user.id,
      actorEmail: ctx.user.email,
      action: "document.approved",
      targetType: "document",
      targetId: document.id,
      metadata: { notes },
    });
  }

  await cancelReminders(workflowId, ctx.organization.id);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "document.review_started",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("w9_approved", { workflowId });

  return { success: true };
}

const rejectSchema = z.object({
  reason: z.string().min(1).max(2000),
  resendLink: z.boolean().default(true),
});

export async function rejectW9Document(workflowId: string, input: z.infer<typeof rejectSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const data = rejectSchema.parse(input);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Request not found");

  const rejectedAt = new Date().toISOString();

  await supabase
    .from("workflow_instances")
    .update({
      status: "needs_correction",
      metadata: {
        ...(workflow.metadata as object),
        rejected_at: rejectedAt,
        rejection_reason: data.reason,
      },
    })
    .eq("id", workflowId);

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .maybeSingle();

  if (document) {
    await supabase.from("documents").update({ status: "rejected" }).eq("id", document.id);
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "document.rejected",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason: data.reason },
  });

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "correction.requested",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason: data.reason },
  });

  trackEvent("w9_rejected", { workflowId });
  trackEvent("correction_requested", { workflowId });

  if (data.resendLink) {
    const { sendCorrectionEmail } = await import("./requestCorrection");
    await sendCorrectionEmail(workflowId, data.reason);
  }

  return { success: true };
}
