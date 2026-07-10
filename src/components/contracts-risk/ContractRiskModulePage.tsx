import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { ScanContractForm } from "@/components/contracts-risk/ScanContractForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/utils/cn";
import { CONTRACT_RISK_WORKFLOW_TYPE } from "@/lib/contracts-risk/constants";
import { getModuleBySlug } from "@/lib/modules/modules";
import { DIRECTORY } from "@/lib/terminology/directory";
import { isOpenAiConfigured } from "@/lib/contracts-risk/openaiScan";

export async function ContractRiskModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("contracts-risk")!;

  const [{ data: workflows }, { data: vendors }] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id, title, status, updated_at, metadata, vendors(name)")
      .eq("organization_id", ctx.organization.id)
      .eq("type", CONTRACT_RISK_WORKFLOW_TYPE)
      .neq("status", "cancelled")
      .order("updated_at", { ascending: false }),
    supabase
      .from("vendors")
      .select("id, name")
      .eq("organization_id", ctx.organization.id)
      .neq("status", "archived")
      .order("name"),
  ]);

  const items = workflows ?? [];
  const review = items.filter((w) => w.status === "review_needed").length;
  const processing = items.filter((w) => w.status === "processing").length;
  const approved = items.filter((w) => w.status === "approved").length;
  const highRisk = items.filter((w) => {
    const meta = (w.metadata ?? {}) as Record<string, number | null>;
    return (meta.risk_high_count ?? 0) > 0;
  }).length;

  const Icon = mod.icon;
  const aiEnabled = isOpenAiConfigured();

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Apps", href: "/app" }, { label: mod.name }]} />}
        title={mod.name}
        description={mod.jobToBeDone}
        action={
          <Link href="/app/vendors">
            <Button variant="secondary">{DIRECTORY.nav}</Button>
          </Link>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <p className="flex-1 text-body-sm text-primary">
          {mod.paidWorkflowDescription}
          {aiEnabled ? " AI scanning enabled (gpt-4o-mini)." : " Using heuristic scanning — set OPENAI_API_KEY for AI."}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Awaiting review", value: review },
          { label: "Processing", value: processing },
          { label: "High-risk flags", value: highRisk },
          { label: "Approved", value: approved },
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{mod.primaryAction}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScanContractForm vendors={vendors ?? []} />
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 text-h4 text-primary">Risk scans</h2>
            {!items.length ? (
              <EmptyState title={mod.emptyStateTitle} description={mod.emptyStateDescription} />
            ) : (
              <DataTable
                columns={[
                  { key: "contract", label: "Contract" },
                  { key: "flags", label: "Flags" },
                  { key: "status", label: "Status" },
                  { key: "updated", label: "Updated" },
                ]}
                rows={items.map((w) => {
                  const meta = (w.metadata ?? {}) as Record<string, string | number | null>;
                  const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                  return {
                    contract: (
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        {(meta.contract_name as string) ?? (vendorRow as { name?: string } | null)?.name ?? w.title}
                      </Link>
                    ),
                    flags: meta.risk_flag_count != null ? String(meta.risk_flag_count) : "—",
                    status: <StatusBadge status={w.status} />,
                    updated: formatRelativeDate(w.updated_at),
                  };
                })}
              />
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What we flag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-body-sm text-secondary">
            <p>Auto-renewal and notice periods</p>
            <p>Termination for convenience</p>
            <p>Indemnification scope</p>
            <p>Liability caps and unlimited liability</p>
            <p>Assignment restrictions</p>
            <p className="pt-2 text-caption text-tertiary">Not legal advice — escalate flagged items to counsel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
