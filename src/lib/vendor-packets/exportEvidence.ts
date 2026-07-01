import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { computePacketProgress } from "./completion";

export async function exportVendorPacketEvidence(workflowId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Vendor packet not found");

  const metadata = workflow.metadata as Record<string, unknown>;
  const progress = await computePacketProgress(workflowId);
  const vendor = workflow.vendors as { name?: string; email?: string } | null;

  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, document_type, status, metadata")
    .eq("workflow_instance_id", workflowId);

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("action, actor_type, actor_email, created_at")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${workflowId}`)
    .order("created_at", { ascending: true });

  const lines: string[] = [];
  lines.push("section,field,value");
  lines.push(["packet", "vendor", csvEscape(vendor?.name ?? "")].join(","));
  lines.push(["packet", "vendor_email", csvEscape(vendor?.email ?? String(metadata.recipient_email ?? ""))].join(","));
  lines.push(["packet", "status", workflow.status].join(","));
  lines.push(["packet", "due_date", workflow.due_date ?? ""].join(","));
  lines.push(["packet", "progress_percent", String(progress.percentComplete)].join(","));
  lines.push(["packet", "required_complete", progress.allRequiredComplete ? "yes" : "no"].join(","));

  lines.push("");
  lines.push("checklist,item,required,status,submitted_at");
  for (const item of progress.items) {
    lines.push(
      `checklist,${item.key},${item.required},${item.status},${item.submittedAt ?? ""}`
    );
  }

  lines.push("");
  lines.push("documents,id,type,status");
  for (const doc of documents ?? []) {
    lines.push(`documents,${doc.id},${doc.document_type},${doc.status}`);
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
    metadata: { itemCount: progress.total },
  });

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor_packet.evidence_exported",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  trackEvent("vendor_packet_evidence_exported", { workflowId });
  return csv;
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"')) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
