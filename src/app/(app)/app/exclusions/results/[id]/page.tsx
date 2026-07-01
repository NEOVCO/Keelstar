import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectRightRail } from "@/components/objects";
import { AuditTimeline } from "@/components/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ExclusionResultReview } from "@/components/exclusions/ExclusionResultReview";
import { ExclusionSubjectActions } from "@/components/exclusions/ExclusionSubjectActions";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/cn";
import { getExclusionDataMode } from "@/lib/exclusions/constants";

export default async function ExclusionResultPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: result } = await supabase
    .from("screening_results")
    .select("*, screening_matches(*), screening_subjects(*), screening_runs(*)")
    .eq("id", params.id)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!result) notFound();

  const subject = result.screening_subjects as {
    id: string;
    display_name: string;
    subject_type: string;
  };
  const run = result.screening_runs as { sources?: string[]; run_type?: string; completed_at?: string };
  const matches = (result.screening_matches ?? []) as Array<{
    id: string;
    matched_name: string | null;
    matched_identifier: string | null;
    matched_program: string | null;
    match_reason: string | null;
  }>;

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, actor_email")
    .eq("organization_id", ctx.organization.id)
    .or(`target_id.eq.${params.id},target_id.eq.${subject.id}`)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Exclusions", href: "/app/apps/exclusions" },
              { label: subject.display_name },
            ]}
          />
        }
        title={`Screening result — ${subject.display_name}`}
        status={result.result_status}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-body-sm">
              <p><span className="text-secondary">Source:</span> {result.source.toUpperCase()}</p>
              <p><span className="text-secondary">Data mode:</span> {getExclusionDataMode()}</p>
              <p><span className="text-secondary">Screened:</span> {formatDate(result.created_at)}</p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">Review:</span>
                <StatusBadge status={result.review_status} />
              </p>
              {result.review_notes && (
                <p><span className="text-secondary">Notes:</span> {result.review_notes}</p>
              )}
            </CardContent>
          </Card>

          {matches.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Potential matches ({matches.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {matches.map((m) => (
                  <div key={m.id} className="rounded-md border border-border p-3 text-body-sm">
                    <p className="font-medium">{m.matched_name}</p>
                    {m.matched_identifier && <p className="text-secondary">ID: {m.matched_identifier}</p>}
                    {m.matched_program && <p className="text-secondary">Program: {m.matched_program}</p>}
                    {m.match_reason && <p className="text-caption text-secondary">{m.match_reason}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Review decision</CardTitle></CardHeader>
            <CardContent>
              <ExclusionResultReview resultId={result.id} reviewStatus={result.review_status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Raw response</CardTitle></CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-auto rounded-md bg-sunken/50 p-3 text-caption">
                {JSON.stringify(result.raw_response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <ObjectRightRail>
          <ExclusionSubjectActions subjectId={subject.id} />
          <AuditTimeline
            events={(auditEvents ?? []).map((e) => ({
              id: e.id,
              action: e.action.replace(/\./g, " "),
              actor: e.actor_email ?? "System",
              timestamp: e.created_at,
            }))}
          />
        </ObjectRightRail>
      </div>
    </div>
  );
}
