import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { COI_WORKFLOW_TYPE } from "@/lib/coi/constants";
import { getModuleBySlug } from "@/lib/modules/modules";
import { COI_DIRECTORY } from "@/lib/terminology/directory";

export async function CoiModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("coi")!;

  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, title, status, due_date, updated_at, vendor_id, metadata, vendors(name)")
    .eq("organization_id", ctx.organization.id)
    .eq("type", COI_WORKFLOW_TYPE)
    .order("updated_at", { ascending: false });

  const items = workflows ?? [];
  const missing = items.filter((w) => ["draft"].includes(w.status)).length;
  const pending = items.filter((w) => ["sent", "opened", "overdue"].includes(w.status)).length;
  const review = items.filter((w) => ["submitted", "review_needed"].includes(w.status)).length;
  const expiring = items.filter((w) => w.status === "expiring_soon").length;
  const expired = items.filter((w) => w.status === "expired").length;

  const upcoming = items
    .filter((w) => w.status === "expiring_soon" || w.status === "active_monitoring")
    .slice(0, 5);

  const { data: recentAudit } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, actor_email")
    .eq("organization_id", ctx.organization.id)
    .like("action", "coi_%")
    .order("created_at", { ascending: false })
    .limit(8);

  const Icon = mod.icon;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <Link href="/app/vendors">
            <Button>Request COI</Button>
          </Link>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="flex-1 text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Missing", value: missing },
          { label: COI_DIRECTORY.pendingLabel, value: pending },
          { label: "Review needed", value: review },
          { label: "Expiring soon", value: expiring },
          { label: "Expired", value: expired },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-h3 text-primary">{s.value}</p>
              <p className="text-caption text-secondary">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h4 text-primary">Certificates</h2>
          {!items.length ? (
            <EmptyState
              title="Track your first certificate of insurance"
              description={COI_DIRECTORY.emptyDescription}
              action={
                <Link href="/app/vendors">
                  <Button size="sm">Request COI</Button>
                </Link>
              }
            />
          ) : (
            <DataTable
              columns={[
                { key: "vendor", label: COI_DIRECTORY.partyColumn },
                { key: "status", label: "Status" },
                { key: "expiration", label: "Expiration" },
                { key: "updated", label: "Updated" },
              ]}
              rows={items.map((w) => {
                const meta = (w.metadata ?? {}) as Record<string, string | null>;
                const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                const vendorName = (vendorRow as { name?: string } | null)?.name;
                return {
                  vendor: (
                    <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                      {vendorName ?? w.title}
                    </Link>
                  ),
                  status: <StatusBadge status={w.status} />,
                  expiration: meta.expiration_date ? formatDate(meta.expiration_date) : "—",
                  updated: formatRelativeDate(w.updated_at),
                };
              })}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming expirations</CardTitle>
            </CardHeader>
            <CardContent>
              {!upcoming.length ? (
                <p className="text-body-sm text-secondary">No certificates approaching expiration.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {upcoming.map((w) => {
                    const meta = (w.metadata ?? {}) as Record<string, string | null>;
                    const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                    const vendorName = (vendorRow as { name?: string } | null)?.name;
                    return (
                      <li key={w.id} className="flex justify-between">
                        <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                          {vendorName ?? w.title}
                        </Link>
                        <span className="text-secondary">
                          {meta.expiration_date ? formatDate(meta.expiration_date) : "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              {!recentAudit?.length ? (
                <p className="text-body-sm text-secondary">No COI activity yet.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {recentAudit.map((e) => (
                    <li key={e.id} className="flex justify-between gap-2">
                      <span className="text-primary">{e.action.replace(/_/g, " ")}</span>
                      <span className="shrink-0 text-caption text-tertiary">
                        {formatRelativeDate(e.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
