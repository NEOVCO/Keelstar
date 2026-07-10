import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { AddTrainingRecordForm } from "@/components/training/AddTrainingRecordForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { TRAINING_WORKFLOW_TYPE } from "@/lib/training/constants";
import { getModuleBySlug } from "@/lib/modules/modules";
import { PEOPLE } from "@/lib/terminology/people";
import { isWorkforceVendor } from "@/lib/vendors/workforce";

export async function TrainingModulePage({ defaultPersonId }: { defaultPersonId?: string }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("training")!;

  const [{ data: workflows }, { data: vendors }] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id, title, status, due_date, updated_at, vendor_id, metadata, vendors(name)")
      .eq("organization_id", ctx.organization.id)
      .eq("type", TRAINING_WORKFLOW_TYPE)
      .neq("status", "cancelled")
      .order("updated_at", { ascending: false }),
    supabase
      .from("vendors")
      .select("id, name, metadata")
      .eq("organization_id", ctx.organization.id)
      .neq("status", "archived")
      .order("name"),
  ]);

  const people = (vendors ?? []).filter(isWorkforceVendor);
  const items = workflows ?? [];
  const draft = items.filter((w) => ["draft", "review_needed"].includes(w.status)).length;
  const active = items.filter((w) => w.status === "active_monitoring").length;
  const expiring = items.filter((w) => w.status === "expiring_soon").length;
  const expired = items.filter((w) => w.status === "expired").length;

  const upcoming = items
    .filter((w) => ["expiring_soon", "active_monitoring"].includes(w.status))
    .slice(0, 6);

  const Icon = mod.icon;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <div className="flex gap-2">
            <a href="/api/reports/training-matrix">
              <Button variant="secondary">Export matrix</Button>
            </a>
            <Link href="/app/people">
              <Button variant="secondary">{PEOPLE.nav}</Button>
            </Link>
          </div>
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
          { label: "Needs setup", value: draft },
          { label: "Active", value: active },
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{mod.primaryAction}</CardTitle>
            </CardHeader>
            <CardContent>
              {people.length ? (
                <AddTrainingRecordForm people={people} defaultPersonId={defaultPersonId} />
              ) : (
                <div className="space-y-3 text-body-sm">
                  <p className="text-secondary">Add people to your roster before tracking training records.</p>
                  <Button asChild size="sm">
                    <Link href="/app/people/new">Add person</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 text-h4 text-primary">Training records</h2>
            {!items.length ? (
              <EmptyState title={mod.emptyStateTitle} description={mod.emptyStateDescription} />
            ) : (
              <DataTable
                columns={[
                  { key: "person", label: "Person" },
                  { key: "course", label: "Course" },
                  { key: "status", label: "Status" },
                  { key: "expires", label: "Expires" },
                  { key: "updated", label: "Updated" },
                ]}
                rows={items.map((w) => {
                  const meta = (w.metadata ?? {}) as Record<string, string | null>;
                  const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                  const personName = (vendorRow as { name?: string } | null)?.name;
                  return {
                    person: (
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        {personName ?? meta.person_name ?? w.title}
                      </Link>
                    ),
                    course: meta.course_name ?? "—",
                    status: <StatusBadge status={w.status} />,
                    expires: meta.expiration_date ? formatDate(meta.expiration_date) : w.due_date ? formatDate(w.due_date) : "—",
                    updated: formatRelativeDate(w.updated_at),
                  };
                })}
              />
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expiring soon</CardTitle>
          </CardHeader>
          <CardContent>
            {!upcoming.length ? (
              <p className="text-body-sm text-secondary">No certifications approaching expiration.</p>
            ) : (
              <ul className="space-y-2 text-body-sm">
                {upcoming.map((w) => {
                  const meta = (w.metadata ?? {}) as Record<string, string | null>;
                  return (
                    <li key={w.id} className="flex justify-between gap-2">
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        {meta.course_name ?? w.title}
                      </Link>
                      <span className="shrink-0 text-secondary">
                        {meta.expiration_date ? formatDate(meta.expiration_date) : "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
