import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { POLICY_DOCUMENT_TYPE, POLICY_WORKFLOW_TYPE } from "./constants";

export async function exportPolicyEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", POLICY_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Request not found");

  const person = workflow.vendors as { name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, string | null>;

  const { data: document } = await supabase
    .from("documents")
    .select("id, title, status, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", POLICY_DOCUMENT_TYPE)
    .maybeSingle();

  let policyDownloadUrl = "";
  let policyFilename = metadata.policy_filename ?? "";
  const parsedFields: Record<string, string> = {};

  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("*")
      .eq("id", document.current_version_id)
      .single();

    if (version) {
      policyFilename = version.filename;
      try {
        policyDownloadUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        policyDownloadUrl = version.storage_path;
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
    .like("action", "policy_%")
    .order("created_at", { ascending: true });

  const rows: string[][] = [
    ["field", "value"],
    ["workflow_id", workflowId],
    ["person_name", person?.name ?? ""],
    ["person_email", person?.email ?? metadata.recipient_email ?? ""],
    ["policy_title", metadata.policy_title ?? document?.title ?? ""],
    ["policy_version", metadata.policy_version ?? ""],
    ["status", workflow.status],
    ["due_date", workflow.due_date ?? ""],
    ["sent_at", metadata.sent_at ?? ""],
    ["acknowledged_name", metadata.acknowledged_name ?? parsedFields.acknowledged_name ?? ""],
    ["acknowledged_at", metadata.acknowledged_at ?? parsedFields.acknowledged_at ?? ""],
    ["policy_filename", policyFilename],
    ["policy_download_url", policyDownloadUrl],
    ["", ""],
    ["audit_action", "audit_timestamp", "actor"],
    ...(auditEvents ?? []).map((e) => [e.action, e.created_at, e.actor_email ?? e.actor_type ?? ""]),
  ];

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "policy_evidence.exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("policy_evidence_exported", { workflowId });

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
