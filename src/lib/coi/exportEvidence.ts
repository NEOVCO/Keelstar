import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getSignedUrl } from "@/lib/documents/upload";
import { trackEvent } from "@/lib/analytics/track";
import { getCoiFieldsForWorkflow } from "./saveFields";

export async function exportCoiEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Request not found");

  const vendor = workflow.vendors as { name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, string | null>;
  const fields = await getCoiFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  const { data: document } = await supabase
    .from("documents")
    .select("id, status, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "coi")
    .maybeSingle();

  const versions: Array<{
    version: number;
    filename: string;
    created_at: string;
    download_url: string;
  }> = [];

  if (document) {
    const { data: versionRows } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", document.id)
      .order("version_number", { ascending: true });

    for (const v of versionRows ?? []) {
      let downloadUrl = "";
      try {
        downloadUrl = await getSignedUrl(v.storage_path, 3600);
      } catch {
        downloadUrl = v.storage_path;
      }
      versions.push({
        version: v.version_number,
        filename: v.filename,
        created_at: v.created_at,
        download_url: downloadUrl,
      });
    }
  }

  const { data: monitor } = await supabase
    .from("monitors")
    .select("id, status, monitored_date, last_run_at")
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", "coi_expiration")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: reminders } = await supabase
    .from("reminders")
    .select("type, reminder_window, status, scheduled_at, sent_at")
    .eq("workflow_instance_id", workflowId)
    .order("scheduled_at", { ascending: true });

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("action, actor_type, actor_email, target_type, target_id, metadata, created_at")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${workflowId},metadata->>workflowId.eq.${workflowId}`)
    .order("created_at", { ascending: true });

  const header = [
    "vendor_name",
    "vendor_email",
    "insured_name",
    "certificate_holder",
    "insurance_carrier",
    "policy_number",
    "policy_type",
    "effective_date",
    "expiration_date",
    "coverage_limit",
    "request_type",
    "current_status",
    "monitor_status",
    "document_versions",
  ].join(",");

  const row = [
    csvEscape(vendor?.name ?? ""),
    csvEscape(vendor?.email ?? ""),
    csvEscape(fieldMap.insured_name ?? ""),
    csvEscape(fieldMap.certificate_holder ?? ""),
    csvEscape(fieldMap.insurance_carrier ?? ""),
    csvEscape(fieldMap.policy_number ?? ""),
    csvEscape(fieldMap.policy_type ?? ""),
    csvEscape(fieldMap.effective_date ?? ""),
    csvEscape(fieldMap.expiration_date ?? metadata.expiration_date ?? ""),
    csvEscape(fieldMap.coverage_limit ?? ""),
    "coi_tracking",
    workflow.status,
    monitor?.status ?? "",
    csvEscape(JSON.stringify(versions)),
  ].join(",");

  const reminderHeader = "type,window,status,scheduled_at,sent_at";
  const reminderRows = (reminders ?? []).map((r) =>
    [r.type, r.reminder_window ?? "", r.status, r.scheduled_at, r.sent_at ?? ""].join(",")
  );

  const auditHeader = "action,actor_type,actor_email,target_type,target_id,created_at";
  const auditRows = (auditEvents ?? []).map((e) =>
    [e.action, e.actor_type, e.actor_email ?? "", e.target_type ?? "", e.target_id ?? "", e.created_at].join(",")
  );

  const csv = [
    header,
    row,
    "",
    "# Reminders",
    reminderHeader,
    ...reminderRows,
    "",
    "# Audit Events",
    auditHeader,
    ...auditRows,
  ].join("\n");

  await supabase.from("evidence_exports").insert({
    organization_id: ctx.organization.id,
    workflow_instance_id: workflowId,
    exported_by: ctx.user.id,
    format: "csv",
    metadata: { versionCount: versions.length, auditCount: auditEvents?.length ?? 0 },
  });

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "coi_evidence.exported",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { format: "csv" },
  });

  trackEvent("coi_evidence_exported", { workflowId });

  return csv;
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
