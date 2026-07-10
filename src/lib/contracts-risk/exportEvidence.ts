import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { CONTRACT_RISK_DOCUMENT_TYPE, CONTRACT_RISK_WORKFLOW_TYPE } from "./constants";
import { parseRiskFlagsFromMetadata } from "./scanContract";

export async function exportContractRiskEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", CONTRACT_RISK_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Risk scan not found");

  const metadata = workflow.metadata as Record<string, unknown>;
  const vendor = workflow.vendors as { name?: string } | null;
  const flags = parseRiskFlagsFromMetadata(metadata);

  const { data: document } = await supabase
    .from("documents")
    .select("id, title, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", CONTRACT_RISK_DOCUMENT_TYPE)
    .maybeSingle();

  let documentDownloadUrl = "";
  let documentFilename = (metadata.document_filename as string) ?? "";

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
  }

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("action, created_at, actor_email, actor_type")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${workflowId},metadata->>workflowId.eq.${workflowId}`)
    .like("action", "contract_risk%")
    .order("created_at", { ascending: true });

  const rows: string[][] = [
    ["field", "value"],
    ["workflow_id", workflowId],
    ["contract_name", (metadata.contract_name as string) ?? document?.title ?? ""],
    ["counterparty", (metadata.counterparty as string) ?? vendor?.name ?? ""],
    ["status", workflow.status],
    ["risk_summary", (metadata.risk_summary as string) ?? ""],
    ["risk_flag_count", String(metadata.risk_flag_count ?? flags.length)],
    ["risk_scan_source", (metadata.risk_scan_source as string) ?? ""],
    ["scanned_at", (metadata.scanned_at as string) ?? ""],
    ["approved_at", (metadata.approved_at as string) ?? ""],
    ["rejected_at", (metadata.rejected_at as string) ?? ""],
    ["document_filename", documentFilename],
    ["document_download_url", documentDownloadUrl],
    ["", ""],
    ["flag_category", "severity", "excerpt", "recommendation", "source"],
    ...flags.map((f) => [f.category, f.severity, f.excerpt, f.recommendation, f.source]),
    ["", ""],
    ["audit_action", "audit_timestamp", "actor"],
    ...(auditEvents ?? []).map((e) => [e.action, e.created_at, e.actor_email ?? e.actor_type ?? ""]),
  ];

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract_risk.evidence_exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("contract_risk_evidence_exported", { workflowId });

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
