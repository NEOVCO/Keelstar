import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { getContractFieldsForWorkflow } from "./saveFields";
import { MONITORED_CONTRACT_STATUSES, TERMINAL_CONTRACT_STATUSES } from "./constants";

export async function exportContractEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, owner_id")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Contract not found");

  const metadata = workflow.metadata as Record<string, string | null>;
  const fields = await getContractFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  let ownerEmail = "";
  if (workflow.owner_id) {
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(workflow.owner_id);
    ownerEmail = user?.email ?? "";
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id, status")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "contract")
    .maybeSingle();

  const versions: Array<{ version: number; filename: string; created_at: string }> = [];
  if (document) {
    const { data: versionRows } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", document.id)
      .order("version_number", { ascending: true });

    for (const v of versionRows ?? []) {
      versions.push({ version: v.version_number, filename: v.filename, created_at: v.created_at });
    }
  }

  const { data: monitors } = await supabase
    .from("monitors")
    .select("id, status, monitored_date, last_run_at, created_at")
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", "contract_renewal")
    .order("created_at", { ascending: true });

  const { data: reminders } = await supabase
    .from("reminders")
    .select("type, reminder_window, status, scheduled_at, sent_at, recipient_email")
    .eq("workflow_instance_id", workflowId)
    .order("scheduled_at", { ascending: true });

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("action, actor_type, actor_email, created_at, metadata")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${workflowId},target_id.eq.${document?.id ?? workflowId}`)
    .order("created_at", { ascending: true });

  const lines: string[] = [];
  lines.push("section,field,value");
  lines.push(
    [
      "contract",
      "contract_name",
      csvEscape(fieldMap.contract_name ?? metadata.contract_name ?? workflow.title),
    ].join(",")
  );
  lines.push(["contract", "counterparty", csvEscape(fieldMap.counterparty ?? metadata.counterparty ?? "")].join(","));
  lines.push(["contract", "contract_type", csvEscape(fieldMap.contract_type ?? metadata.contract_type ?? "")].join(","));
  lines.push(["contract", "effective_date", csvEscape(fieldMap.effective_date ?? metadata.effective_date ?? "")].join(","));
  lines.push(["contract", "renewal_date", csvEscape(fieldMap.renewal_date ?? metadata.renewal_date ?? "")].join(","));
  lines.push(
    [
      "contract",
      "notice_period_days",
      csvEscape(fieldMap.notice_period_days ?? fieldMap.termination_notice_days ?? String(metadata.notice_period_days ?? "")),
    ].join(",")
  );
  lines.push(
    ["contract", "latest_notice_date", csvEscape(metadata.latest_notice_date ?? "")].join(",")
  );
  lines.push(["contract", "auto_renewal", csvEscape(fieldMap.auto_renewal ?? String(metadata.auto_renewal ?? ""))].join(","));
  lines.push(["contract", "renewal_term", csvEscape(fieldMap.renewal_term ?? metadata.renewal_term ?? "")].join(","));
  lines.push(["contract", "contract_value", csvEscape(fieldMap.contract_value ?? metadata.contract_value ?? "")].join(","));
  lines.push(["contract", "currency", csvEscape(fieldMap.currency ?? metadata.currency ?? "")].join(","));
  lines.push(["contract", "status", workflow.status].join(","));
  lines.push(["contract", "owner_email", csvEscape(ownerEmail)].join(","));

  lines.push("");
  lines.push("document_versions,version,filename,uploaded_at");
  for (const v of versions) {
    lines.push(`document_versions,${v.version},${csvEscape(v.filename)},${v.created_at}`);
  }

  lines.push("");
  lines.push("monitors,id,status,monitored_date,last_run_at");
  for (const m of monitors ?? []) {
    lines.push(`monitors,${m.id},${m.status},${m.monitored_date ?? ""},${m.last_run_at ?? ""}`);
  }

  lines.push("");
  lines.push("reminders,type,window,status,scheduled_at,sent_at,recipient");
  for (const r of reminders ?? []) {
    lines.push(
      `reminders,${r.type},${r.reminder_window ?? ""},${r.status},${r.scheduled_at},${r.sent_at ?? ""},${csvEscape(r.recipient_email ?? "")}`
    );
  }

  lines.push("");
  lines.push("audit,action,actor,created_at");
  for (const e of auditEvents ?? []) {
    lines.push(`audit,${e.action},${csvEscape(e.actor_email ?? e.actor_type)},${e.created_at}`);
  }

  const csv = lines.join("\n");

  await supabase.from("evidence_exports").insert({
    organization_id: ctx.organization.id,
    workflow_instance_id: workflowId,
    exported_by: ctx.user.id,
    format: "csv",
    metadata: { versionCount: versions.length, reminderCount: reminders?.length ?? 0 },
  });

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.evidence_exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("contract_evidence_exported", { workflowId });
  return csv;
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export { MONITORED_CONTRACT_STATUSES, TERMINAL_CONTRACT_STATUSES };
