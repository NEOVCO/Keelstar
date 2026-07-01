import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { EXCLUSION_WORKFLOW_TYPE } from "./constants";
import type { ExclusionSource } from "./constants";
import { getProvider } from "./providers";
import type { ScreeningSubjectInput } from "./providers/types";

export const screenInputSchema = z.object({
  subjectType: z.enum(["vendor", "person", "organization", "contractor", "employee", "other"]),
  vendorId: z.string().uuid().optional(),
  displayName: z.string().min(1).max(300),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  organizationName: z.string().max(300).optional(),
  dateOfBirth: z.string().optional(),
  npi: z.string().max(20).optional(),
  sources: z.array(z.enum(["oig", "sam"])).min(1).default(["oig"]),
  saveSubject: z.boolean().optional().default(true),
  createMonthlyMonitor: z.boolean().optional().default(false),
  runType: z.enum(["ad_hoc", "scheduled", "manual_rerun"]).optional().default("ad_hoc"),
  monitorId: z.string().uuid().optional(),
  screeningSubjectId: z.string().uuid().optional(),
});

export type RunScreeningInput = z.infer<typeof screenInputSchema> & {
  skipAuth?: boolean;
  organizationId?: string;
  userId?: string | null;
  userEmail?: string;
};

export async function executeProviderScreening(args: {
  orgId: string;
  runId: string;
  subjectId: string;
  sources: ExclusionSource[];
  subjectInput: ScreeningSubjectInput;
}) {
  const supabase = createServiceClient();
  let hasPotentialMatch = false;
  const resultIds: string[] = [];

  for (const source of args.sources) {
    const provider = getProvider(source);
    const providerResult = await provider.screen(args.subjectInput);
    const reviewStatus =
      providerResult.status === "potential_match" ? "review_needed" : "not_required";
    if (providerResult.status === "potential_match") hasPotentialMatch = true;

    const { data: resultRow, error: resErr } = await supabase
      .from("screening_results")
      .insert({
        organization_id: args.orgId,
        screening_run_id: args.runId,
        screening_subject_id: args.subjectId,
        source,
        result_status: providerResult.status,
        match_count: providerResult.matches.length,
        review_status: reviewStatus,
        raw_response: providerResult.rawResponse,
      })
      .select("id")
      .single();

    if (resErr) throw new Error(resErr.message);
    resultIds.push(resultRow.id);

    for (const match of providerResult.matches) {
      await supabase.from("screening_matches").insert({
        organization_id: args.orgId,
        screening_result_id: resultRow.id,
        source,
        matched_name: match.matchedName,
        matched_identifier: match.matchedIdentifier,
        matched_program: match.matchedProgram,
        matched_date: match.matchedDate,
        match_score: match.matchScore,
        match_reason: match.matchReason,
        raw_match: match.raw,
      });
    }

    const auditAction =
      providerResult.status === "potential_match"
        ? "exclusion_result.potential_match"
        : providerResult.status === "not_configured"
          ? "exclusion_result.not_configured"
          : providerResult.status === "failed"
            ? "exclusion_check.failed"
            : "exclusion_result.no_match";

    await createAuditLog({
      organizationId: args.orgId,
      actorType: "system",
      action: auditAction,
      targetType: "screening_result",
      targetId: resultRow.id,
      metadata: { source, matchCount: providerResult.matches.length },
    });
  }

  return { hasPotentialMatch, resultIds };
}

export async function createScreeningWorkflow(orgId: string, displayName: string, vendorId?: string, userId?: string | null, sources?: string[], runType?: string) {
  const supabase = createServiceClient();
  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: orgId,
      type: EXCLUSION_WORKFLOW_TYPE,
      title: `Exclusion — ${displayName}`,
      status: "active",
      vendor_id: vendorId ?? null,
      owner_id: userId,
      created_by: userId,
      metadata: { sources, run_type: runType },
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return workflow.id;
}
