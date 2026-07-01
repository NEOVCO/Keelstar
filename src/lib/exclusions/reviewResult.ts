import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";

const reviewSchema = z.object({
  action: z.enum(["clear", "confirm"]),
  reviewNotes: z.string().min(3).max(2000),
});

export async function reviewScreeningResult(resultId: string, input: z.infer<typeof reviewSchema>) {
  const data = reviewSchema.parse(input);
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: result, error } = await supabase
    .from("screening_results")
    .select("*, screening_subjects(id, display_name)")
    .eq("id", resultId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !result) throw new Error("Result not found");
  if (result.review_status !== "review_needed") {
    throw new Error("This result does not require review");
  }

  const reviewStatus = data.action === "clear" ? "false_positive" : "confirmed";
  const resultStatus = data.action === "confirm" ? "confirmed_match" : result.result_status;

  await supabase
    .from("screening_results")
    .update({
      review_status: reviewStatus,
      result_status: resultStatus,
      reviewed_by: ctx.user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: data.reviewNotes,
    })
    .eq("id", resultId);

  const subjectStatus = data.action === "confirm" ? "matched" : "cleared";
  await supabase
    .from("screening_subjects")
    .update({ status: subjectStatus })
    .eq("id", result.screening_subject_id);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    action: data.action === "clear" ? "exclusion_match.cleared" : "exclusion_match.confirmed",
    targetType: "screening_result",
    targetId: resultId,
    metadata: { reviewNotes: data.reviewNotes },
  });

  trackEvent(
    data.action === "clear" ? "exclusion_match_cleared" : "exclusion_match_confirmed",
    { organizationId: ctx.organization.id }
  );

  return { resultId, reviewStatus };
}
