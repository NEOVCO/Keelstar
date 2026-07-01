import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { cancelCoiReminders } from "./scheduleReminders";
import { createCoiExpirationMonitor } from "./expirationMonitor";
import { getCoiFieldsForWorkflow } from "./saveFields";
import { COI_REQUIRED_FIELDS } from "./constants";
import { trackEvent } from "@/lib/analytics/track";

export async function approveCoi(workflowId: string, notes?: string) {
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

  const fields = await getCoiFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value]));

  for (const required of COI_REQUIRED_FIELDS) {
    if (!fieldMap[required]?.trim()) {
      throw new Error(`Required field missing: ${required.replace(/_/g, " ")}`);
    }
  }

  const expirationDate = new Date(fieldMap.expiration_date!);
  if (Number.isNaN(expirationDate.getTime())) {
    throw new Error("Invalid expiration date");
  }

  const approvedAt = new Date().toISOString();

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "coi")
    .maybeSingle();

  if (!document) throw new Error("COI document not found");

  await supabase.from("documents").update({ status: "approved" }).eq("id", document.id);

  await cancelCoiReminders(workflowId, ctx.organization.id);

  await createCoiExpirationMonitor(
    workflowId,
    ctx.organization.id,
    document.id,
    workflow.vendor_id as string,
    expirationDate,
    workflow.owner_id ?? ctx.user.id
  );

  await supabase
    .from("workflow_instances")
    .update({
      metadata: {
        ...(workflow.metadata as object),
        approved_at: approvedAt,
        approval_notes: notes ?? null,
        expiration_date: expirationDate.toISOString(),
        insured_name: fieldMap.insured_name,
        policy_type: fieldMap.policy_type,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "coi_document.approved",
    targetType: "document",
    targetId: document.id,
    metadata: { notes, expirationDate: expirationDate.toISOString() },
  });

  trackEvent("coi_approved", { workflowId });
  trackEvent("first_coi_approved", { workflowId });

  return { success: true };
}

const rejectSchema = z.object({
  reason: z.string().min(1).max(2000),
  resendLink: z.boolean().default(true),
});

export async function rejectCoi(workflowId: string, input: z.infer<typeof rejectSchema>) {
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
    action: "coi_document.rejected",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason: data.reason },
  });

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "coi_correction.requested",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason: data.reason },
  });

  trackEvent("coi_rejected", { workflowId });
  trackEvent("coi_correction_requested", { workflowId });

  if (data.resendLink) {
    const { sendCoiCorrectionEmail } = await import("./requestCorrection");
    await sendCoiCorrectionEmail(workflowId, data.reason);
  }

  return { success: true };
}

export { rejectSchema };
