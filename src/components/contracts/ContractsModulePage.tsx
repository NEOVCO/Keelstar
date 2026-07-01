import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { AddContractForm } from "@/components/contracts/AddContractForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { CONTRACT_WORKFLOW_TYPE } from "@/lib/contracts/constants";
import { normalizeContractStatus } from "@/lib/contracts/renewalMonitor";
import { getModuleBySlug } from "@/lib/modules/modules";

export async function ContractsModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("contracts")!;

  const { data: workflows } = await supabase
    .from("workflow_instances")
    .select("id, title, status, updated_at, metadata, owner_id")
    .eq("organization_id", ctx.organization.id)
    .eq("type", CONTRACT_WORKFLOW_TYPE)
    .not("status", "in", '("archived","cancelled")')
    .order("updated_at", { ascending: false });

  const items = (workflows ?? []).map((w) => ({
    ...w,
    status: normalizeContractStatus(w.status),
  }));

  const active = items.filter((w) =>
    ["renewal_monitoring", "active_monitoring"].includes(w.status)
  ).length;
  const noticeOpen = items.filter((w) => w.status === "notice_window_open").length;
  const approaching = items.filter((w) =>
    ["renewal_approaching", "expiring_soon"].includes(w.status)
  ).length;
  const autoRenewRisk = items.filter((w) => w.status === "auto_renew_risk").length;
  const expired = items.filter((w) => w.status === "expired").length;

  const upcoming = items
    .filter((w) =>
      ["renewal_approaching", "notice_window_open", "renewal_monitoring", "expiring_soon", "active_monitoring"].includes(
        w.status
      )
    )
    .slice(0, 6);

  const Icon = mod.icon;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="flex-1 text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Active", value: active },
          { label: "Notice window open", value: noticeOpen },
          { label: "Renewal approaching", value: approaching },
          { label: "Auto-renew risk", value: autoRenewRisk },
          { label: "Expired", value: expired },
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
          <h2 className="mb-3 text-h4 text-primary">Contracts</h2>
          {!items.length ? (
            <EmptyState
              title="Track your first contract renewal"
              description="Upload a contract, confirm renewal dates, and get reminders before notice windows close."
            />
          ) : (
            <DataTable
              columns={[
                { key: "name", label: "Contract" },
                { key: "counterparty", label: "Counterparty" },
                { key: "status", label: "Status" },
                { key: "renewal", label: "Renewal" },
                { key: "notice", label: "Latest notice" },
                { key: "updated", label: "Updated" },
              ]}
              rows={items.map((w) => {
                const meta = (w.metadata ?? {}) as Record<string, string | null>;
                return {
                  name: (
                    <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                      {w.title}
                    </Link>
                  ),
                  counterparty: meta.counterparty ?? "—",
                  status: <StatusBadge status={w.status} />,
                  renewal: meta.renewal_date ? formatDate(meta.renewal_date) : "—",
                  notice: meta.latest_notice_date ? formatDate(meta.latest_notice_date) : "—",
                  updated: formatRelativeDate(w.updated_at),
                };
              })}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-body font-medium text-primary">Upload contract</h3>
              <AddContractForm />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-body font-medium text-primary">Upcoming renewals</h3>
              {!upcoming.length ? (
                <p className="text-body-sm text-secondary">No renewals approaching.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {upcoming.map((w) => {
                    const meta = (w.metadata ?? {}) as Record<string, string | null>;
                    return (
                      <li key={w.id} className="flex justify-between gap-2">
                        <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                          {w.title}
                        </Link>
                        <span className="shrink-0 text-secondary">
                          {meta.renewal_date ? formatDate(meta.renewal_date) : "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
