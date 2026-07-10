import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { RunScreeningForm } from "@/components/exclusions/RunScreeningForm";
import { BulkImportSubjectsForm } from "@/components/exclusions/BulkImportSubjectsForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/utils/cn";
import { getModuleBySlug } from "@/lib/modules/modules";
import { getExclusionDataMode, EXCLUSION_MONITOR_TYPE } from "@/lib/exclusions/constants";

type ScreeningResult = {
  id: string;
  screening_subject_id: string;
  source: string;
  result_status: string;
  review_status: string;
  created_at: string;
};

export async function ExclusionsModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("exclusions")!;
  const dataMode = getExclusionDataMode();

  const [{ data: subjects }, { data: vendors }, { data: monitors }, { data: recentAudit }] =
    await Promise.all([
      supabase
        .from("screening_subjects")
        .select("id, display_name, subject_type, status, updated_at")
        .eq("organization_id", ctx.organization.id)
        .order("updated_at", { ascending: false }),
      supabase.from("vendors").select("id, name").eq("organization_id", ctx.organization.id).order("name"),
      supabase
        .from("monitors")
        .select("id, target_id, status")
        .eq("organization_id", ctx.organization.id)
        .eq("monitor_type", EXCLUSION_MONITOR_TYPE),
      supabase
        .from("audit_logs")
        .select("id, action, created_at")
        .eq("organization_id", ctx.organization.id)
        .like("action", "exclusion_%")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const subjectIds = (subjects ?? []).map((s) => s.id);
  const { data: latestResults } = subjectIds.length
    ? await supabase
        .from("screening_results")
        .select("id, screening_subject_id, source, result_status, review_status, created_at")
        .in("screening_subject_id", subjectIds)
        .order("created_at", { ascending: false })
    : { data: [] as ScreeningResult[] };

  const resultBySubject = new Map<string, ScreeningResult>();
  for (const r of latestResults ?? []) {
    if (!resultBySubject.has(r.screening_subject_id)) resultBySubject.set(r.screening_subject_id, r);
  }

  const monitorBySubject = new Map((monitors ?? []).map((m) => [m.target_id, m]));
  const items = subjects ?? [];
  const Icon = mod.icon;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title="OIG Exclusion Monitoring"
        description="Screen directory entries and people against exclusion sources, review potential matches and keep audit-ready proof."
      />
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
          <p className="mt-1 text-caption text-secondary">
            Data mode: {dataMode}
            {dataMode === "demo" && " — demo dataset, not live government data."}
            {dataMode === "live" && (
              <>
                {" "}
                — official OIG LEIE CSV (
                <a
                  href="https://oig.hhs.gov/exclusions/leie-database-supplement-downloads/"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  source
                </a>
                ). Verify matches at{" "}
                <a
                  href="https://exclusions.oig.hhs.gov/"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  exclusions.oig.hhs.gov
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-h4 text-primary">Run exclusion check</h2>
            <RunScreeningForm vendors={vendors ?? []} />
          </div>
          <div>
            <h2 className="mb-3 text-h4 text-primary">Bulk import subjects</h2>
            <BulkImportSubjectsForm vendorCount={(vendors ?? []).length} />
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-h4 text-primary">Recent activity</h2>
          <Card>
            <CardContent className="pt-6">
              {!recentAudit?.length ? (
                <p className="text-body-sm text-secondary">No screening activity yet.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {recentAudit.map((e) => (
                    <li key={e.id} className="flex justify-between gap-2">
                      <span className="text-primary">{e.action.replace(/_/g, " ")}</span>
                      <span className="text-secondary">{formatRelativeDate(e.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <h2 className="mb-3 text-h4 text-primary">Screening subjects</h2>
      {!items.length ? (
        <EmptyState title={mod.emptyStateTitle} description={mod.emptyStateDescription} />
      ) : (
        <DataTable
          columns={[
            { key: "subject", label: "Subject" },
            { key: "type", label: "Type" },
            { key: "last", label: "Last screening" },
            { key: "result", label: "Result" },
            { key: "actions", label: "Actions" },
          ]}
          rows={items.map((s) => {
            const latest = resultBySubject.get(s.id);
            const monitor = monitorBySubject.get(s.id);
            return {
              subject: (
                <Link href={`/app/exclusions/subjects/${s.id}`} className="text-accent hover:underline">
                  {s.display_name}
                </Link>
              ),
              type: s.subject_type,
              last: latest ? formatRelativeDate(latest.created_at) : "—",
              result: latest ? <StatusBadge status={latest.result_status} /> : "—",
              actions: latest ? (
                <Link href={`/app/exclusions/results/${latest.id}`}>
                  <Button size="sm" variant="secondary">View</Button>
                </Link>
              ) : monitor ? (
                <StatusBadge status={monitor.status} />
              ) : (
                "—"
              ),
            };
          })}
        />
      )}
    </div>
  );
}
