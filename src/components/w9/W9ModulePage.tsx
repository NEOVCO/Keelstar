import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { getModuleBySlug } from "@/lib/modules/modules";

export async function W9ModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("w9")!;

  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, title, status, due_date, updated_at, vendor_id, metadata, vendors(name)")
    .eq("organization_id", ctx.organization.id)
    .eq("type", W9_WORKFLOW_TYPE)
    .order("updated_at", { ascending: false });

  const items = workflows ?? [];
  const missing = items.filter((w) => w.status === "draft").length;
  const pending = items.filter((w) => ["sent", "opened", "overdue"].includes(w.status)).length;
  const review = items.filter((w) => ["submitted", "review_needed", "needs_correction"].includes(w.status)).length;
  const approved = items.filter((w) => ["approved", "completed"].includes(w.status)).length;
  const rejected = items.filter((w) => ["rejected", "cancelled"].includes(w.status)).length;

  const overdue = items.filter((w) => w.status === "overdue").slice(0, 5);

  const { data: recentAudit } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, actor_email")
    .eq("organization_id", ctx.organization.id)
    .like("action", "w9_%")
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
            <Button>Request W-9</Button>
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
          { label: "Draft", value: missing },
          { label: "Awaiting vendor", value: pending },
          { label: "Review needed", value: review },
          { label: "Approved", value: approved },
          { label: "Rejected / cancelled", value: rejected },
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
          <h2 className="mb-3 text-h4 text-primary">W-9 requests</h2>
          {!items.length ? (
            <EmptyState
              title="Collect your first W-9"
              description="Send a secure request link to vendors instead of chasing attachments over email."
              action={
                <Link href="/app/vendors">
                  <Button size="sm">Request W-9</Button>
                </Link>
              }
            />
          ) : (
            <DataTable
              columns={[
                { key: "vendor", label: "Vendor" },
                { key: "status", label: "Status" },
                { key: "due", label: "Due" },
                { key: "updated", label: "Updated" },
              ]}
              rows={items.map((w) => {
                const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                const vendorName = (vendorRow as { name?: string } | null)?.name;
                return {
                  vendor: (
                    <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                      {vendorName ?? w.title}
                    </Link>
                  ),
                  status: <StatusBadge status={w.status} />,
                  due: w.due_date ? formatDate(w.due_date) : "—",
                  updated: formatRelativeDate(w.updated_at),
                };
              })}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overdue requests</CardTitle>
            </CardHeader>
            <CardContent>
              {!overdue.length ? (
                <p className="text-body-sm text-secondary">No overdue W-9 requests.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {overdue.map((w) => {
                    const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                    const vendorName = (vendorRow as { name?: string } | null)?.name;
                    return (
                      <li key={w.id} className="flex justify-between">
                        <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                          {vendorName ?? w.title}
                        </Link>
                        <span className="text-error">{w.due_date ? formatDate(w.due_date) : "—"}</span>
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
                <p className="text-body-sm text-secondary">No W-9 activity yet.</p>
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
