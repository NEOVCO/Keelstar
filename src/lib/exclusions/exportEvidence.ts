import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { getExclusionDataMode } from "./constants";

export async function exportExclusionEvidence(subjectId: string): Promise<string> {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = createServiceClient();
  const orgId = ctx.organization.id;

  const { data: subject } = await supabase
    .from("screening_subjects")
    .select("*")
    .eq("id", subjectId)
    .eq("organization_id", orgId)
    .single();

  if (!subject) throw new Error("Subject not found");

  const { data: runs } = await supabase
    .from("screening_runs")
    .select("id, run_type, status, sources, started_at, completed_at")
    .eq("screening_subject_id", subjectId)
    .order("created_at", { ascending: false });

  const { data: results } = await supabase
    .from("screening_results")
    .select("*, screening_matches(*)")
    .eq("screening_subject_id", subjectId)
    .order("created_at", { ascending: false });

  const { data: monitors } = await supabase
    .from("monitors")
    .select("id, status, next_run_at, last_run_at")
    .eq("organization_id", orgId)
    .eq("target_id", subjectId);

  const rows: string[] = [
    "subject_name,subject_type,source,screening_date,run_status,result_status,match_count,review_status,review_notes,monitor_status,data_mode",
  ];

  for (const result of results ?? []) {
    const run = runs?.find((r) => r.id === result.screening_run_id);
    const monitor = monitors?.[0];
    rows.push(
      [
        subject.display_name,
        subject.subject_type,
        result.source,
        result.created_at,
        run?.status ?? "",
        result.result_status,
        result.match_count,
        result.review_status,
        (result.review_notes ?? "").replace(/,/g, ";"),
        monitor?.status ?? "",
        getExclusionDataMode(),
      ].join(",")
    );
  }

  const csv = rows.join("\n");

  const { data: runWithWorkflow } = await supabase
    .from("screening_runs")
    .select("workflow_instance_id")
    .eq("screening_subject_id", subjectId)
    .not("workflow_instance_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const workflowId = runWithWorkflow?.workflow_instance_id;
  if (!workflowId) throw new Error("No workflow found for evidence export");

  await supabase.from("evidence_exports").insert({
    organization_id: orgId,
    workflow_instance_id: workflowId,
    exported_by: ctx.user.id,
    format: "csv",
    metadata: { type: "exclusion", subjectId },
  });

  await createAuditLog({
    organizationId: orgId,
    actorType: "user",
    actorId: ctx.user.id,
    action: "exclusion_evidence.exported",
    targetType: "screening_subject",
    targetId: subjectId,
  });

  trackEvent("exclusion_evidence_exported", { organizationId: orgId });

  return csv;
}
