import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { DueDateCell } from "@/components/tables";
import { ResponsiveTable } from "@/components/tables/RowActions";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchTasks } from "@/lib/app-queries";

export default async function InboxPage() {
  const ctx = await requireOrganization();
  const tasks = await fetchTasks(ctx.organization.id);

  const columns = [
    { key: "title", label: "Task" },
    { key: "status", label: "Status" },
    { key: "due", label: "Due" },
    { key: "workflow", label: "Workflow" },
    { key: "actions", label: "" },
  ];

  const rows = tasks.map((t) => {
    const wf = t.workflow_instances as { title?: string } | null;
    return {
      title: t.title,
      status: <StatusBadge status={t.status} />,
      due: t.due_date ? <DueDateCell date={t.due_date} overdue={t.status === "overdue"} /> : "—",
      workflow: wf?.title ?? "—",
      actions: (
        <Link href={`/app/workflows/${t.workflow_instance_id}`}>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </Link>
      ),
    };
  });

  const mobileCards = tasks.map((t) => (
    <Link
      key={t.id}
      href={`/app/workflows/${t.workflow_instance_id}`}
      className="block rounded-lg border border-border bg-surface p-4"
    >
      <p className="font-medium text-primary">{t.title}</p>
      <StatusBadge status={t.status} />
    </Link>
  ));

  return (
    <div>
      <PageHeader title="Inbox" description="Tasks and items waiting on action." />
      {!tasks.length ? (
        <EmptyState
          title="Inbox is clear"
          description="New tasks and reviews will appear here when assigned to you."
          primaryAction={{ label: "View workflows", href: "/app/workflows" }}
        />
      ) : (
        <ResponsiveTable mobileCards={mobileCards}>
          <DataTable columns={columns} rows={rows} />
        </ResponsiveTable>
      )}
    </div>
  );
}
