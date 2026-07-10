import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { RequestPolicyForm } from "@/components/policies/RequestPolicyForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { POLICY_WORKFLOW_TYPE, defaultPolicyDueDate } from "@/lib/policies/constants";
import { getModuleBySlug } from "@/lib/modules/modules";
import { PEOPLE } from "@/lib/terminology/people";
import { isWorkforceVendor } from "@/lib/vendors/workforce";

export async function PolicyModulePage({
  defaultPersonId,
}: {
  defaultPersonId?: string;
}) {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("policies")!;

  const [{ data: workflows }, { data: vendors }] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id, title, status, due_date, updated_at, vendor_id, metadata, vendors(name)")
      .eq("organization_id", ctx.organization.id)
      .eq("type", POLICY_WORKFLOW_TYPE)
      .order("updated_at", { ascending: false }),
    supabase
      .from("vendors")
      .select("id, name, email, metadata")
      .eq("organization_id", ctx.organization.id)
      .neq("status", "archived")
      .order("name"),
  ]);

  const people = (vendors ?? []).filter(isWorkforceVendor);
  const items = workflows ?? [];
  const draft = items.filter((w) => w.status === "draft").length;
  const pending = items.filter((w) => ["sent", "opened"].includes(w.status)).length;
  const overdue = items.filter((w) => w.status === "overdue").length;
  const completed = items.filter((w) => w.status === "completed").length;

  const { data: recentAudit } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, actor_email")
    .eq("organization_id", ctx.organization.id)
    .like("action", "policy_%")
    .order("created_at", { ascending: false })
    .limit(8);

  const Icon = mod.icon;
  const defaultDue = defaultPolicyDueDate().toISOString();

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <Link href="/app/people">
            <Button variant="secondary">{PEOPLE.nav}</Button>
          </Link>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="flex-1 text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Draft", value: draft },
          { label: "Awaiting ack", value: pending },
          { label: "Overdue", value: overdue },
          { label: "Completed", value: completed },
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{mod.primaryAction}</CardTitle>
            </CardHeader>
            <CardContent>
              {people.length ? (
                <RequestPolicyForm
                  people={people}
                  defaultPersonId={defaultPersonId}
                  defaultDueDate={defaultDue}
                  senderEmail={ctx.user.email}
                />
              ) : (
                <div className="space-y-3 text-body-sm">
                  <p className="text-secondary">
                    Add employees or contractors to your People roster before sending acknowledgement requests.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/app/people/new">Add person</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 text-h4 text-primary">Acknowledgement requests</h2>
            {!items.length ? (
              <EmptyState
                title={mod.emptyStateTitle}
                description={mod.emptyStateDescription}
              />
            ) : (
              <DataTable
                columns={[
                  { key: "person", label: "Person" },
                  { key: "policy", label: "Policy" },
                  { key: "status", label: "Status" },
                  { key: "due", label: "Due" },
                  { key: "updated", label: "Updated" },
                ]}
                rows={items.map((w) => {
                  const meta = (w.metadata ?? {}) as Record<string, string | null>;
                  const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                  const personName = (vendorRow as { name?: string } | null)?.name;
                  return {
                    person: (
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        {personName ?? w.title}
                      </Link>
                    ),
                    policy: meta.policy_title ?? "—",
                    status: <StatusBadge status={w.status} />,
                    due: w.due_date ? formatDate(w.due_date) : "—",
                    updated: formatRelativeDate(w.updated_at),
                  };
                })}
              />
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentAudit?.length ? (
              <p className="text-body-sm text-secondary">No policy activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentAudit.map((e) => (
                  <li key={e.id} className="text-body-sm">
                    <p className="text-primary">{e.action.replace(/_/g, " ")}</p>
                    <p className="text-caption text-secondary">
                      {e.actor_email ?? "System"} · {formatRelativeDate(e.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
