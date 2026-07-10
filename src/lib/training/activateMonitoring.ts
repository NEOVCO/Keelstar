import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { getTrainingFieldsForWorkflow } from "./saveFields";
import { createTrainingExpirationMonitor } from "./expirationMonitor";
import { TRAINING_REQUIRED_FIELDS } from "./constants";

export async function activateTrainingMonitoring(workflowId: string, notes?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Training record not found");
  if (!["review_needed"].includes(workflow.status)) {
    throw new Error("Upload a certificate and enter training details before activating monitoring");
  }

  const fields = await getTrainingFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  for (const required of TRAINING_REQUIRED_FIELDS) {
    if (!fieldMap[required]?.trim()) {
      throw new Error(`Required field missing: ${required.replace(/_/g, " ")}`);
    }
  }

  const expirationDate = new Date(fieldMap.expiration_date);
  if (Number.isNaN(expirationDate.getTime())) {
    throw new Error("Invalid expiration date");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "training_certificate")
    .maybeSingle();

  if (!document) throw new Error("Certificate document not found");

  const courseName = fieldMap.course_name ?? workflow.title;
  const vendorId = workflow.vendor_id as string | null;

  await createTrainingExpirationMonitor(
    workflowId,
    ctx.organization.id,
    document.id,
    vendorId,
    expirationDate,
    workflow.owner_id ?? ctx.user.id,
    courseName
  );

  const meta = (workflow.metadata ?? {}) as Record<string, unknown>;
  await supabase
    .from("workflow_instances")
    .update({
      due_date: expirationDate.toISOString(),
      metadata: {
        ...meta,
        course_name: courseName,
        certification_name: courseName,
        provider: fieldMap.provider ?? null,
        certification_number: fieldMap.certification_number ?? null,
        completion_date: fieldMap.completion_date ?? null,
        expiration_date: expirationDate.toISOString(),
        activation_notes: notes ?? null,
        activated_at: new Date().toISOString(),
        activated_by: ctx.user.id,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "training_monitor.created",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { expirationDate: expirationDate.toISOString(), notes },
  });

  trackEvent("training_monitor_created", { workflowId });
  return { success: true, expirationDate: expirationDate.toISOString() };
}

export { markTrainingRenewed, cancelTrainingRecord } from "./lifecycle";
