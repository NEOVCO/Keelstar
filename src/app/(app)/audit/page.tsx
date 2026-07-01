import { PageHeader, EmptyState, DataTable } from "@/components/ui/empty-state";
import { requirePermission } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/cn";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export default async function AuditPage() {
  const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, action, actor_type, actor_email, target_type, created_at")
    .eq("organization_id", ctx.organization.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Append-only record of all important actions."
      />
      {!logs?.length ? (
        <EmptyState title="No audit entries yet" description="Actions will appear here as they occur." />
      ) : (
        <DataTable
          columns={[
            { key: "action", label: "Action" },
            { key: "actor", label: "Actor" },
            { key: "target", label: "Target" },
            { key: "time", label: "Time" },
          ]}
          rows={logs.map((l) => ({
            action: l.action,
            actor: l.actor_email ?? l.actor_type,
            target: l.target_type ?? "—",
            time: formatDate(l.created_at),
          }))}
        />
      )}
    </div>
  );
}
