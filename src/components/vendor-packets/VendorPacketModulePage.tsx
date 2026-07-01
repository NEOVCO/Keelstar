import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { VENDOR_PACKET_WORKFLOW_TYPE } from "@/lib/vendor-packets/constants";
import { computePacketProgress } from "@/lib/vendor-packets/completion";
import { getModuleBySlug } from "@/lib/modules/modules";

export async function VendorPacketModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("vendor-packets")!;

  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, title, status, due_date, updated_at, vendor_id, metadata, vendors(name)")
    .eq("organization_id", ctx.organization.id)
    .eq("type", VENDOR_PACKET_WORKFLOW_TYPE)
    .order("updated_at", { ascending: false });

  const items = workflows ?? [];
  const draft = items.filter((w) => w.status === "draft").length;
  const pending = items.filter((w) => ["sent", "opened", "in_progress"].includes(w.status)).length;
  const review = items.filter((w) => w.status === "review_needed").length;
  const overdue = items.filter((w) => w.status === "overdue").length;
  const completed = items.filter((w) => w.status === "completed").length;

  const progressRows = await Promise.all(
    items
      .filter((w) => !["completed", "cancelled"].includes(w.status))
      .slice(0, 8)
      .map(async (w) => ({
        workflow: w,
        progress: await computePacketProgress(w.id),
      }))
  );

  const Icon = mod.icon;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <Link href="/app/vendors">
            <Button>Send vendor packet</Button>
          </Link>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="flex-1 text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Draft", value: draft },
          { label: "In progress", value: pending },
          { label: "Review needed", value: review },
          { label: "Overdue", value: overdue },
          { label: "Completed", value: completed },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-h3 text-primary">{s.value}</p>
              <p className="text-caption text-secondary">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h4 text-primary">Vendor packets</h2>
          {!items.length ? (
            <EmptyState
              title="Send your first vendor packet"
              description="Collect W-9, COI, and other onboarding documents through one secure portal link."
              action={
                <Link href="/app/vendors">
                  <Button size="sm">Choose a vendor</Button>
                </Link>
              }
            />
          ) : (
            <DataTable
              columns={[
                { key: "vendor", label: "Vendor" },
                { key: "status", label: "Status" },
                { key: "due", label: "Due" },
                { key: "updated", label: "Updated" },
              ]}
              rows={items.map((w) => {
                const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                const vendorName = (vendorRow as { name?: string } | null)?.name;
                return {
                  vendor: (
                    <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                      {vendorName ?? w.title}
                    </Link>
                  ),
                  status: <StatusBadge status={w.status} />,
                  due: w.due_date ? formatDate(w.due_date) : "—",
                  updated: formatRelativeDate(w.updated_at),
                };
              })}
            />
          )}
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 text-body font-medium text-primary">Packet progress</h3>
            {!progressRows.length ? (
              <p className="text-body-sm text-secondary">No active packets.</p>
            ) : (
              <ul className="space-y-3 text-body-sm">
                {progressRows.map(({ workflow: w, progress }) => {
                  const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                  const vendorName = (vendorRow as { name?: string } | null)?.name ?? w.title;
                  return (
                    <li key={w.id}>
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        {vendorName}
                      </Link>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-sunken">
                        <div
                          className="h-1.5 rounded-full bg-accent"
                          style={{ width: `${progress.percentComplete}%` }}
                        />
                      </div>
                      <p className="mt-1 text-caption text-secondary">
                        {progress.completed}/{progress.total} documents · {progress.percentComplete}%
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
