import { PageHeader, EmptyState, DataTable } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/cn";

export default async function MonitorsPage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: monitors } = await supabase
    .from("monitors")
    .select("id, name, monitor_type, status, next_run_at, last_run_at")
    .eq("organization_id", ctx.organization.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="Monitors"
        description="Scheduled monitoring and reminder rules."
        action={<Button>Create monitor</Button>}
      />
      {!monitors?.length ? (
        <EmptyState
          title="No monitors yet"
          description="Monitors track deadlines and trigger reminders automatically."
        />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
            { key: "next", label: "Next run" },
          ]}
          rows={monitors.map((m) => ({
            name: m.name,
            type: m.monitor_type,
            status: <StatusBadge status={m.status} />,
            next: m.next_run_at ? formatDate(m.next_run_at) : "—",
          }))}
        />
      )}
    </div>
  );
}
