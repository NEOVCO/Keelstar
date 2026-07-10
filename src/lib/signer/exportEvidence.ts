import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { SIGNER_DOCUMENT_TYPE, SIGNER_WORKFLOW_TYPE } from "./constants";

export async function exportSignerEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", SIGNER_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Request not found");

  const vendor = workflow.vendors as { name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, string | null>;

  const { data: document } = await supabase
    .from("documents")
    .select("id, title, status, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", SIGNER_DOCUMENT_TYPE)
    .maybeSingle();

  let documentDownloadUrl = "";
  let documentFilename = metadata.document_filename ?? "";
  const parsedFields: Record<string, string> = {};

  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("*")
      .eq("id", document.current_version_id)
      .single();

    if (version) {
      documentFilename = version.filename;
      try {
        documentDownloadUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        documentDownloadUrl = version.storage_path;
      }
    }

    const { data: fields } = await supabase
      .from("document_parsed_fields")
      .select("field_key, field_value")
      .eq("document_version_id", document.current_version_id);

    for (const f of fields ?? []) {
      parsedFields[f.field_key] = f.field_value ?? "";
    }
  }

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("action, created_at, actor_email, actor_type")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${workflowId},metadata->>workflowId.eq.${workflowId}`)
    .like("action", "signer_%")
    .order("created_at", { ascending: true });

  const rows: string[][] = [
    ["field", "value"],
    ["workflow_id", workflowId],
    ["signer_name", metadata.signer_name ?? vendor?.name ?? ""],
    ["signer_email", metadata.signer_email ?? metadata.recipient_email ?? vendor?.email ?? ""],
    ["document_title", metadata.document_title ?? document?.title ?? ""],
    ["status", workflow.status],
    ["due_date", workflow.due_date ?? ""],
    ["sent_at", metadata.sent_at ?? ""],
    ["signed_name", metadata.signed_name ?? parsedFields.signed_name ?? ""],
    ["signed_at", metadata.signed_at ?? parsedFields.signed_at ?? ""],
    ["document_filename", documentFilename],
    ["document_download_url", documentDownloadUrl],
    ["", ""],
    ["audit_action", "audit_timestamp", "actor"],
    ...(auditEvents ?? []).map((e) => [e.action, e.created_at, e.actor_email ?? e.actor_type ?? ""]),
  ];

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "signer_evidence.exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("signer_evidence_exported", { workflowId });

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
