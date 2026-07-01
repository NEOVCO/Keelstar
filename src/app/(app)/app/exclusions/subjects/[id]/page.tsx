import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectRightRail } from "@/components/objects";
import { AuditTimeline } from "@/components/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExclusionSubjectActions } from "@/components/exclusions/ExclusionSubjectActions";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatRelativeDate } from "@/lib/utils/cn";
import { EXCLUSION_MONITOR_TYPE } from "@/lib/exclusions/constants";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/types";

export default async function ExclusionSubjectPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: subject } = await supabase
    .from("screening_subjects")
    .select("*, vendors(name)")
    .eq("id", params.id)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!subject) notFound();

  const [{ data: runs }, { data: monitors }, { data: auditEvents }] = await Promise.all([
    supabase
      .from("screening_runs")
      .select("id, run_type, status, sources, completed_at, screening_results(id, source, result_status, review_status)")
      .eq("screening_subject_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("monitors")
      .select("id, status, next_run_at, last_run_at")
      .eq("organization_id", ctx.organization.id)
      .eq("monitor_type", EXCLUSION_MONITOR_TYPE)
      .eq("target_id", params.id),
    supabase
      .from("audit_logs")
      .select("id, action, created_at, actor_email")
      .eq("organization_id", ctx.organization.id)
      .eq("target_id", params.id)
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  const canMonitor = can(ctx.permissions, PERMISSIONS.MONITORS_MANAGE);
  const vendor = subject.vendors as { name?: string } | null;

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
        title={subject.display_name}
        status={subject.status}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-body-sm">
              <p><span className="text-secondary">Type:</span> {subject.subject_type}</p>
              {vendor?.name && <p><span className="text-secondary">Vendor:</span> {vendor.name}</p>}
              {subject.npi && <p><span className="text-secondary">NPI:</span> {subject.npi}</p>}
              <p><span className="text-secondary">Updated:</span> {formatDate(subject.updated_at)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Screening history</CardTitle></CardHeader>
            <CardContent>
              {!runs?.length ? (
                <p className="text-body-sm text-secondary">No screenings yet.</p>
              ) : (
                <ul className="space-y-3">
                  {runs.map((run) => {
                    const results = (run.screening_results ?? []) as Array<{
                      id: string;
                      source: string;
                      result_status: string;
                      review_status: string;
                    }>;
                    return (
                      <li key={run.id} className="rounded-md border border-border p-3 text-body-sm">
                        <p className="text-secondary">{run.run_type} — {formatRelativeDate(run.completed_at ?? run.id)}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {results.map((r) => (
                            <Link key={r.id} href={`/app/exclusions/results/${r.id}`}>
                              <StatusBadge status={r.result_status} />
                            </Link>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {monitors?.length ? (
            <Card>
              <CardHeader><CardTitle>Monitors</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-body-sm">
                {monitors.map((m) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <Link href={`/app/monitors/${m.id}`} className="text-accent hover:underline">
                      Monthly exclusion monitor
                    </Link>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : canMonitor ? (
            <Card>
              <CardHeader><CardTitle>Monitoring</CardTitle></CardHeader>
              <CardContent>
                <ExclusionSubjectActions subjectId={params.id} />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <ObjectRightRail>
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
