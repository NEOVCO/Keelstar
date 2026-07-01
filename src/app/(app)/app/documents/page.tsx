import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { DataTable } from "@/components/tables";
import { ResponsiveTable } from "@/components/tables/RowActions";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchDocuments } from "@/lib/app-queries";
import { formatDate } from "@/lib/utils/cn";

export default async function DocumentsPage() {
  const ctx = await requireOrganization();
  const documents = await fetchDocuments(ctx.organization.id);

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "updated", label: "Updated" },
  ];

  const rows = documents.map((d) => ({
    name: (
      <Link href={`/app/documents/${d.id}`} className="font-medium text-primary hover:text-accent">
        {d.title}
      </Link>
    ),
    type: d.document_type ?? "—",
    status: <StatusBadge status={d.status} />,
    updated: formatDate(d.updated_at),
  }));

  const mobileCards = documents.map((d) => (
    <Link key={d.id} href={`/app/documents/${d.id}`} className="block rounded-lg border border-border bg-surface p-4">
      <p className="font-medium text-primary">{d.title}</p>
      <div className="mt-2 flex gap-2">
        <StatusBadge status={d.status} />
        <span className="text-caption text-secondary">{d.document_type}</span>
      </div>
    </Link>
  ));

  return (
    <div>
      <PageHeader
        title="Documents"
        description="All documents across workflows and modules."
        action={<Button disabled>Upload document</Button>}
      />
      {!documents.length ? (
        <EmptyState
          title="No documents yet"
          description="Upload a document to extract key fields, create reminders, and keep an audit trail."
          primaryAction={{ label: "Request W-9", href: "/app/apps/w9" }}
          secondaryAction={{ label: "View vendors", href: "/app/vendors" }}
        />
      ) : (
        <ResponsiveTable mobileCards={mobileCards}>
          <DataTable columns={columns} rows={rows} />
        </ResponsiveTable>
      )}
    </div>
  );
}
