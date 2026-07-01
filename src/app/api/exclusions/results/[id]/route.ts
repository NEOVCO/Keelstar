import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireOrganization } from "@/lib/tenant/context";
import { reviewScreeningResult } from "@/lib/exclusions/reviewResult";
import { handleApiError, apiSuccess } from "@/lib/errors/api";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requireOrganization();
    const supabase = await createClient();
    const { data: result, error } = await supabase
      .from("screening_results")
      .select("*, screening_matches(*), screening_subjects(*), screening_runs(*)")
      .eq("id", params.id)
      .eq("organization_id", ctx.organization.id)
      .single();

    if (error || !result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (body.action === "review") {
      const result = await reviewScreeningResult(params.id, {
        action: body.reviewAction,
        reviewNotes: body.reviewNotes,
      });
      return apiSuccess(result);
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return handleApiError(err);
  }
}
