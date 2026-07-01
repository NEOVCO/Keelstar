import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { ResponsiveTable } from "@/components/tables/RowActions";
import { MonitorCard } from "@/components/monitors";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchMonitors } from "@/lib/app-queries";
import { formatDate } from "@/lib/utils/cn";

export default async function MonitorsPage() {
  const ctx = await requireOrganization();
  const monitors = await fetchMonitors(ctx.organization.id);

  const columns = [
    { key: "name", label: "Monitored object" },
    { key: "type", label: "Rule" },
    { key: "status", label: "Status" },
    { key: "next", label: "Next run" },
  ];

  const rows = monitors.map((m) => ({
    name: (
      <Link href={`/app/monitors/${m.id}`} className="font-medium text-primary hover:text-accent">
        {m.name}
      </Link>
    ),
    type: m.monitor_type,
    status: <StatusBadge status={m.status} />,
    next: m.next_run_at ? formatDate(m.next_run_at) : "—",
  }));

  const mobileCards = monitors.map((m) => (
    <MonitorCard
      key={m.id}
      id={m.id}
      name={m.name}
      monitorType={m.monitor_type}
      status={m.status}
      nextRunAt={m.next_run_at}
    />
  ));

  return (
    <div>
      <PageHeader
        title="Monitors"
        description="Recurring rules that watch documents, contracts, and certificates."
        action={<Button disabled>Create monitor</Button>}
      />
      {!monitors.length ? (
        <EmptyState
          title="Nothing is being monitored yet"
          description="Create reminders for contracts, certificates, policies, or approvals before they become urgent."
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
