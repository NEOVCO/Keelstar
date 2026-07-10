import { createServiceClient } from "@/lib/supabase/service";
import { fetchAuditLogEntries } from "./auditData";

function csvEscape(value: string | null | undefined): string {
  const v = value ?? "";
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(","));
  }
  return lines.join("\n");
}

export async function buildVendorComplianceMatrixCsv(organizationId: string): Promise<string> {
  const supabase = createServiceClient();

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, name, email, status")
    .eq("organization_id", organizationId)
    .neq("status", "archived")
    .order("name");

  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, vendor_id, type, status, updated_at")
    .eq("organization_id", organizationId)
    .in("type", ["w9_collection", "coi_tracking", "vendor_packet"]);

  const byVendor = new Map<string, Record<string, string>>();
  for (const wf of workflows ?? []) {
    if (!wf.vendor_id) continue;
    const existing = byVendor.get(wf.vendor_id) ?? {};
    const key =
      wf.type === "w9_collection" ? "w9_status" : wf.type === "coi_tracking" ? "coi_status" : "packet_status";
    existing[key] = wf.status;
    existing[`${key}_updated`] = wf.updated_at;
    byVendor.set(wf.vendor_id, existing);
  }

  const headers = ["Vendor", "Email", "Status", "W-9", "COI", "Vendor packet"];
  const rows = (vendors ?? []).map((v) => {
    const compliance = byVendor.get(v.id) ?? {};
    return [
      v.name,
      v.email ?? "",
      v.status,
      compliance.w9_status ?? "—",
      compliance.coi_status ?? "—",
      compliance.packet_status ?? "—",
    ];
  });

  return toCsv(headers, rows);
}

export async function buildAuditExportCsv(
  organizationId: string,
  options?: { from?: string; to?: string }
): Promise<string> {
  const entries = await fetchAuditLogEntries(organizationId, options);

  const headers = ["Timestamp", "Action", "Actor type", "Actor email", "Target type", "Target ID"];
  const rows = entries.map((e) => [
    e.created_at,
    e.action,
    e.actor_type ?? "",
    e.actor_email ?? "",
    e.target_type ?? "",
    e.target_id ?? "",
  ]);

  return toCsv(headers, rows);
}

export async function buildTrainingMatrixCsv(organizationId: string): Promise<string> {
  const supabase = createServiceClient();
  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("title, status, due_date, metadata, updated_at, vendors(name, email)")
    .eq("organization_id", organizationId)
    .eq("type", "training_record")
    .neq("status", "cancelled")
    .order("updated_at", { ascending: false });

  const headers = [
    "Person",
    "Email",
    "Course",
    "Provider",
    "Status",
    "Completion date",
    "Expiration date",
    "Updated",
  ];
  const rows = (workflows ?? []).map((w) => {
    const meta = (w.metadata ?? {}) as Record<string, string | null>;
    const vendor = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
    const person = vendor as { name?: string; email?: string | null } | null;
    return [
      person?.name ?? meta.person_name ?? "",
      person?.email ?? "",
      meta.course_name ?? w.title,
      meta.provider ?? "",
      w.status,
      meta.completion_date ?? "",
      meta.expiration_date ?? w.due_date ?? "",
      w.updated_at,
    ];
  });

  return toCsv(headers, rows);
}

export async function buildEvidenceIndexCsv(organizationId: string): Promise<string> {
  const supabase = createServiceClient();
  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, title, type, status, vendor_id, updated_at, vendors(name)")
    .eq("organization_id", organizationId)
    .in("status", ["approved", "active_monitoring", "completed", "active"])
    .order("updated_at", { ascending: false })
    .limit(500);

  const headers = ["Workflow ID", "Title", "Type", "Status", "Vendor", "Evidence API"];
  const rows = (workflows ?? []).map((w) => {
    const vendor = w.vendors as { name?: string } | null;
    const evidencePath =
      w.type === "w9_collection"
        ? `/api/w9/requests/${w.id}`
        : w.type === "coi_tracking"
          ? `/api/coi/requests/${w.id}`
          : w.type === "contract_renewal"
            ? `/api/contracts/requests/${w.id}`
            : w.type === "training_record"
              ? `/api/training/records/${w.id}`
              : w.type === "policy_acknowledgement"
                ? `/api/policies/requests/${w.id}`
                : w.type === "invoice_approval"
                  ? `/api/invoices/requests/${w.id}`
                  : w.type === "simple_signer"
                    ? `/api/signer/requests/${w.id}`
                    : w.type === "contract_risk_scan"
                      ? `/api/contracts-risk/scans/${w.id}`
                      : `/api/workflows/${w.id}`;
    return [w.id, w.title, w.type, w.status, vendor?.name ?? "", evidencePath];
  });

  return toCsv(headers, rows);
}
