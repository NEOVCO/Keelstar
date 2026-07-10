import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { OwnerCell, DueDateCell } from "@/components/tables";
import { RowActions, ResponsiveTable } from "@/components/tables/RowActions";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { CreateWorkflowDialog } from "@/components/workflows/CreateWorkflowDialog";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchWorkflows, moduleLabelForType } from "@/lib/app-queries";
import { formatDate } from "@/lib/utils/cn";

export default async function WorkflowsPage({
  searchParams,
}: {
  searchParams: { action?: string; type?: string };
}) {
  const ctx = await requireOrganization();
  const workflows = await fetchWorkflows(ctx.organization.id);

  const columns = [
    { key: "title", label: "Workflow" },
    { key: "module", label: "Module" },
    { key: "status", label: "Status" },
    { key: "due", label: "Due" },
    { key: "external", label: "External" },
    { key: "actions", label: "" },
  ];

  const rows = workflows.map((w) => {
    const vendor = w.vendors as { email?: string } | null;
    return {
      title: (
        <Link href={`/app/workflows/${w.id}`} className="font-medium text-primary hover:text-accent">
          {w.title}
        </Link>
      ),
      module: moduleLabelForType(w.type),
      status: <StatusBadge status={w.status} />,
      due: w.due_date ? <DueDateCell date={w.due_date} overdue={w.status === "overdue"} /> : "—",
      external: vendor?.email ?? "—",
      actions: <RowActions items={[{ label: "View", href: `/app/workflows/${w.id}` }]} />,
    };
  });

  const mobileCards = workflows.map((w) => (
    <Link
      key={w.id}
      href={`/app/workflows/${w.id}`}
      className="block rounded-lg border border-border bg-surface p-4 md:hidden"
    >
      <p className="font-medium text-primary">{w.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <StatusBadge status={w.status} />
        <span className="text-caption text-secondary">{moduleLabelForType(w.type)}</span>
      </div>
    </Link>
  ));

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="All workflow instances across modules."
        action={
          <div className="flex gap-2">
            <CreateWorkflowDialog
              defaultOpen={searchParams.action === "create"}
              defaultType={searchParams.type}
              senderEmail={ctx.user.email}
            />
            <Link href="/app/apps/w9">
              <Button>Start workflow</Button>
            </Link>
          </div>
        }
      />
      {!workflows.length ? (
        <EmptyState
          title="Start your first workflow"
          description="Turn a document or request into a trackable process with owners, deadlines, and history."
          primaryAction={{ label: "Request W-9", href: "/app/apps/w9" }}
        />
      ) : (
        <ResponsiveTable mobileCards={mobileCards}>
          <DataTable columns={columns} rows={rows} />
        </ResponsiveTable>
      )}
    </div>
  );
}
