import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireOrganization } from "@/lib/tenant/context";
import { createExclusionMonitor } from "@/lib/exclusions/createMonitor";
import { exportExclusionEvidence } from "@/lib/exclusions/exportEvidence";
import { handleApiError, apiSuccess } from "@/lib/errors/api";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requireOrganization();
    const supabase = await createClient();
    const { data: subject, error } = await supabase
      .from("screening_subjects")
      .select("*, vendors(name, email)")
      .eq("id", params.id)
      .eq("organization_id", ctx.organization.id)
      .single();

    if (error || !subject) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: runs } = await supabase
      .from("screening_runs")
      .select("*, screening_results(*, screening_matches(*))")
      .eq("screening_subject_id", params.id)
      .order("created_at", { ascending: false });

    return apiSuccess({ subject, runs: runs ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (body.action === "create_monitor") {
      const monitor = await createExclusionMonitor({
        screeningSubjectId: params.id,
        ownerId: body.ownerId,
      });
      return apiSuccess(monitor);
    }
    if (body.action === "export") {
      const csv = await exportExclusionEvidence(params.id);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="exclusion-evidence-${params.id}.csv"`,
        },
      });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return handleApiError(err);
  }
}
