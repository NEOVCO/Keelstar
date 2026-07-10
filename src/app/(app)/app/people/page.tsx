import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { ResponsiveTable } from "@/components/tables/RowActions";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/cn";
import { PEOPLE } from "@/lib/terminology/people";
import { filterWorkforceVendors, workforceRecordTypeLabel } from "@/lib/vendors/workforce";
import { VENDOR_RECORD_TYPE_LABELS, recordTypeFromMetadata } from "@/lib/vendors/types";

export default async function PeoplePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: allVendors } = await supabase
    .from("vendors")
    .select("id, name, email, status, metadata, updated_at")
    .eq("organization_id", ctx.organization.id)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  const people = filterWorkforceVendors(allVendors ?? []);
  const personIds = people.map((p) => p.id);

  const { data: screeningSubjects } = personIds.length
    ? await supabase
        .from("screening_subjects")
        .select("id, vendor_id, status, updated_at")
        .eq("organization_id", ctx.organization.id)
        .in("vendor_id", personIds)
    : { data: [] };

  const screeningByVendor = new Map(
    (screeningSubjects ?? []).map((s) => [s.vendor_id, s])
  );

  const rows = people.map((p) => {
    const screening = screeningByVendor.get(p.id);
    const recordType = recordTypeFromMetadata(p.metadata);
    return {
      name: (
        <Link href={`/app/people/${p.id}`} className="font-medium text-primary hover:text-accent">
          {p.name}
        </Link>
      ),
      type: VENDOR_RECORD_TYPE_LABELS[recordType],
      email: p.email ?? "—",
      screening: screening ? <StatusBadge status={screening.status} /> : "—",
      status: <StatusBadge status={p.status} />,
      updated: formatDate(p.updated_at),
    };
  });

  const mobileCards = people.map((p) => (
    <Link key={p.id} href={`/app/people/${p.id}`} className="block rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-primary">{p.name}</p>
      <p className="text-caption text-secondary">
        {workforceRecordTypeLabel(p.metadata)}
        {p.email ? ` · ${p.email}` : ""}
      </p>
    </Link>
  ));

  return (
    <div>
      <PageHeader
        title={PEOPLE.title}
        description={PEOPLE.description}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/app/people/new?mode=import">
              <Button variant="secondary">{PEOPLE.importCsv}</Button>
            </Link>
            <Link href="/app/people/new">
              <Button>{PEOPLE.add}</Button>
            </Link>
          </div>
        }
      />
      <p className="mb-6 text-caption text-secondary">
        {PEOPLE.teamMembersHint}{" "}
        <Link href="/app/settings/members" className="text-accent hover:underline">
          {PEOPLE.teamMembersLink}
        </Link>
        .
      </p>
      {!people.length ? (
        <EmptyState
          title={PEOPLE.emptyTitle}
          description={PEOPLE.emptyDescription}
          primaryAction={{ label: PEOPLE.add, href: "/app/people/new" }}
          secondaryAction={{ label: PEOPLE.importCsv, href: "/app/people/new?mode=import" }}
        />
      ) : (
        <ResponsiveTable mobileCards={mobileCards}>
          <DataTable
            columns={[
              { key: "name", label: PEOPLE.columnName },
              { key: "type", label: PEOPLE.columnType },
              { key: "email", label: "Email" },
              { key: "screening", label: PEOPLE.columnScreening },
              { key: "status", label: "Status" },
              { key: "updated", label: "Updated" },
            ]}
            rows={rows}
          />
        </ResponsiveTable>
      )}
    </div>
  );
}
