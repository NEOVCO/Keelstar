import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { getInvoiceFieldsForWorkflow } from "./saveFields";
import { INVOICE_DOCUMENT_TYPE, INVOICE_WORKFLOW_TYPE } from "./constants";

export async function exportInvoiceEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", INVOICE_WORKFLOW_TYPE)
    .single();

  if (error || !workflow) throw new Error("Invoice not found");

  const metadata = workflow.metadata as Record<string, string | null>;
  const fields = await getInvoiceFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", INVOICE_DOCUMENT_TYPE)
    .maybeSingle();

  let invoiceUrl = "";
  let filename = metadata.invoice_filename ?? "";

  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("filename, storage_path")
      .eq("id", document.current_version_id)
      .single();
    if (version) {
      filename = version.filename;
      try {
        invoiceUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        invoiceUrl = version.storage_path;
      }
    }
  }

  const rows: string[][] = [
    ["field", "value"],
    ["workflow_id", workflowId],
    ["vendor_name", metadata.vendor_name ?? fieldMap.vendor_name ?? ""],
    ["invoice_number", metadata.invoice_number ?? fieldMap.invoice_number ?? ""],
    ["invoice_amount", metadata.invoice_amount ?? fieldMap.invoice_amount ?? ""],
    ["due_date", metadata.due_date ?? fieldMap.due_date ?? ""],
    ["status", workflow.status],
    ["submitted_at", metadata.submitted_at ?? ""],
    ["approved_at", metadata.approved_at ?? ""],
    ["approved_by", metadata.approved_by ?? ""],
    ["rejected_at", metadata.rejected_at ?? ""],
    ["rejection_reason", metadata.rejection_reason ?? ""],
    ["invoice_filename", filename],
    ["invoice_download_url", invoiceUrl],
  ];

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice_evidence.exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("invoice_evidence_exported", { workflowId });

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
