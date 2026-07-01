import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable, TableToolbar, OwnerCell } from "@/components/tables";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchOrgMembers } from "@/lib/app-queries";

export default async function PeoplePage() {
  const ctx = await requireOrganization();
  const members = await fetchOrgMembers(ctx.organization.id);

  const rows = members.map((m) => ({
    name: (
      <span className="font-medium text-primary">{m.email}</span>
    ),
    email: m.email,
    type: <StatusBadge status="active" />,
    pending: "—",
    owner: <OwnerCell name={m.email} initials={m.email.charAt(0).toUpperCase()} />,
    actions: (
      <Link href="/app/settings/members">
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </Link>
    ),
  }));

  return (
    <div>
      <PageHeader
        title="People"
        description="Team members and contacts for acknowledgements and training."
        action={
          <Link href="/app/settings/members">
            <Button>Manage members</Button>
          </Link>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No people yet"
          description="Invite teammates from settings to collaborate on workflows."
          primaryAction={{ label: "Invite members", href: "/app/settings/members" }}
        />
      ) : (
        <>
          <TableToolbar searchPlaceholder="Search people…" />
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "type", label: "Type" },
              { key: "pending", label: "Pending tasks" },
              { key: "owner", label: "Owner" },
              { key: "actions", label: "" },
            ]}
            rows={rows}
          />
        </>
      )}
    </div>
  );
}
