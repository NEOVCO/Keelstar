import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable, TableToolbar } from "@/components/tables";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchAuditLogs, moduleLabelForType } from "@/lib/app-queries";

export default async function AuditPage() {
  const ctx = await requireOrganization();
  const logs = await fetchAuditLogs(ctx.organization.id);

  const columns = [
    { key: "time", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "object", label: "Object" },
  ];

  const rows = logs.map((e) => ({
    time: new Date(e.created_at).toLocaleString(),
    actor: e.actor_email ?? e.actor_type ?? "System",
    action: e.action.replace(/\./g, " "),
    object: e.target_type
      ? `${e.target_type}${e.metadata && typeof e.metadata === "object" && "workflow_type" in e.metadata ? ` · ${moduleLabelForType(String((e.metadata as { workflow_type: string }).workflow_type))}` : ""}`
      : "—",
  }));

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Immutable record of important actions across your workspace."
        action={<Button variant="secondary">Export CSV</Button>}
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No audit activity yet"
          description="Important actions will appear here automatically as your team uses Keelstar."
          primaryAction={{ label: "Go to workflows", href: "/app/workflows" }}
        />
      ) : (
        <>
          <TableToolbar searchPlaceholder="Filter audit events…" />
          <DataTable columns={columns} rows={rows} />
        </>
      )}
    </div>
  );
}
