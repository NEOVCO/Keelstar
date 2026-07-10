import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { getTrainingFieldsForWorkflow } from "./saveFields";
import { TRAINING_DOCUMENT_TYPE, TRAINING_WORKFLOW_TYPE } from "./constants";

export async function exportTrainingEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", TRAINING_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Training record not found");

  const person = workflow.vendors as { name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, string | null>;
  const fields = await getTrainingFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", TRAINING_DOCUMENT_TYPE)
    .maybeSingle();

  let certificateUrl = "";
  let certificateFilename = metadata.certificate_filename ?? "";

  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("filename, storage_path")
      .eq("id", document.current_version_id)
      .single();
    if (version) {
      certificateFilename = version.filename;
      try {
        certificateUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        certificateUrl = version.storage_path;
      }
    }
  }

  const rows: string[][] = [
    ["field", "value"],
    ["workflow_id", workflowId],
    ["person_name", person?.name ?? metadata.person_name ?? ""],
    ["person_email", person?.email ?? ""],
    ["course_name", metadata.course_name ?? fieldMap.course_name ?? ""],
    ["provider", metadata.provider ?? fieldMap.provider ?? ""],
    ["certification_number", metadata.certification_number ?? fieldMap.certification_number ?? ""],
    ["completion_date", metadata.completion_date ?? fieldMap.completion_date ?? ""],
    ["expiration_date", metadata.expiration_date ?? fieldMap.expiration_date ?? ""],
    ["status", workflow.status],
    ["certificate_filename", certificateFilename],
    ["certificate_download_url", certificateUrl],
  ];

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "training_evidence.exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("training_evidence_exported", { workflowId });

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
