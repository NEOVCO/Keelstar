import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { ResponsiveTable } from "@/components/tables/RowActions";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { formatDate } from "@/lib/utils/cn";

export default async function VendorsPage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: vendors } = await supabase
    .from("vendors")
    .select("*")
    .eq("organization_id", ctx.organization.id)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  const vendorIds = (vendors ?? []).map((v) => v.id);
  const { data: workflows } = vendorIds.length
    ? await supabase
        .from("workflow_instances")
        .select("id, vendor_id, status")
        .eq("organization_id", ctx.organization.id)
        .eq("type", W9_WORKFLOW_TYPE)
        .in("vendor_id", vendorIds)
    : { data: [] };

  const latestByVendor = new Map<string, string>();
  for (const w of workflows ?? []) {
    if (w.vendor_id && !latestByVendor.has(w.vendor_id)) {
      latestByVendor.set(w.vendor_id, w.status);
    }
  }

  const rows = (vendors ?? []).map((v) => ({
    name: (
      <Link href={`/app/vendors/${v.id}`} className="font-medium text-primary hover:text-accent">
        {v.name}
      </Link>
    ),
    email: v.email ?? "—",
    status: <StatusBadge status={v.status} />,
    w9: latestByVendor.has(v.id) ? <StatusBadge status={latestByVendor.get(v.id)!} /> : "—",
    updated: formatDate(v.updated_at),
  }));

  const mobileCards = (vendors ?? []).map((v) => (
    <Link key={v.id} href={`/app/vendors/${v.id}`} className="block rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-primary">{v.name}</p>
      <p className="text-caption text-secondary">{v.email}</p>
    </Link>
  ));

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Vendor directory and document compliance posture."
        action={
          <Link href="/app/vendors/new">
            <Button>Add vendor</Button>
          </Link>
        }
      />
      {!vendors?.length ? (
        <EmptyState
          title="No vendors yet"
          description="Add vendors to collect W-9s, track insurance, and manage onboarding documents."
          primaryAction={{ label: "Add vendor", href: "/app/vendors/new" }}
        />
      ) : (
        <ResponsiveTable mobileCards={mobileCards}>
          <DataTable
            columns={[
              { key: "name", label: "Vendor" },
              { key: "email", label: "Email" },
              { key: "status", label: "Status" },
              { key: "w9", label: "W-9" },
              { key: "updated", label: "Updated" },
            ]}
            rows={rows}
          />
        </ResponsiveTable>
      )}
    </div>
  );
}
