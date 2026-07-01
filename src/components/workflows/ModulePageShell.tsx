import Link from "next/link";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { type ProductModule, getModuleBySlug } from "@/lib/modules/modules";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/utils/cn";

export async function ModulePageShell({ module: mod }: { module: ProductModule }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const [{ data: workflows }, { data: documents }, { data: tasks }] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id, title, status, due_date, created_at")
      .eq("organization_id", ctx.organization.id)
      .eq("type", mod.workflowType)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("documents")
      .select("id, title, status, created_at")
      .eq("organization_id", ctx.organization.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("tasks")
      .select("id, title, status, due_date")
      .eq("organization_id", ctx.organization.id)
      .order("due_date", { ascending: true })
      .limit(5),
  ]);

  const Icon = mod.icon;
  const primaryHref = mod.routes.new ?? mod.routes.app;
  const crossSellMods = mod.crossSell.map((s) => getModuleBySlug(s)).filter(Boolean).slice(0, 2);

  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />
        }
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <Link href={primaryHref}>
            <Button>{mod.primaryAction}</Button>
          </Link>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-body-sm font-medium text-primary">{mod.paidWorkflowDescription}</p>
        </div>
        {mod.freeUtility && (
          <Link href={`/tools/${mod.freeUtility}`}>
            <Button variant="secondary" size="sm">
              Free tool
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h4 text-primary">Active workflows</h2>
          {!workflows?.length ? (
            <EmptyState
              title={mod.emptyStateTitle}
              description={mod.emptyStateDescription}
              action={
                <Link href={primaryHref}>
                  <Button size="sm">{mod.primaryAction}</Button>
                </Link>
              }
            />
          ) : (
            <DataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "status", label: "Status" },
                { key: "due", label: "Due" },
              ]}
              rows={workflows.map((w) => ({
                title: (
                  <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                    {w.title}
                  </Link>
                ),
                status: <StatusBadge status={w.status} />,
                due: w.due_date ? formatRelativeDate(w.due_date) : "—",
              }))}
            />
          )}
        </div>

        <div>
          <h2 className="mb-3 text-h4 text-primary">Upcoming reminders</h2>
          {!tasks?.length ? (
            <EmptyState title="No upcoming reminders" description="Tasks and monitor reminders appear here." />
          ) : (
            <DataTable
              columns={[
                { key: "title", label: "Task" },
                { key: "status", label: "Status" },
                { key: "due", label: "Due" },
              ]}
              rows={tasks.map((t) => ({
                title: t.title,
                status: <StatusBadge status={t.status} />,
                due: t.due_date ? formatRelativeDate(t.due_date) : "—",
              }))}
            />
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent documents</CardTitle>
          </CardHeader>
          <CardContent>
            {!documents?.length ? (
              <p className="text-body-sm text-secondary">No documents yet.</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between text-body-sm">
                    <Link href={`/app/documents/${d.id}`} className="text-primary hover:text-accent">
                      {d.title}
                    </Link>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {crossSellMods.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related apps</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {crossSellMods.map((m) => (
                <Link key={m!.id} href={m!.routes.app}>
                  <Button variant="secondary" size="sm">
                    {m!.name}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
