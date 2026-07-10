import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, DataTable } from "@/components/ui/empty-state";
import { SubmitInvoiceForm } from "@/components/invoices/SubmitInvoiceForm";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { formatRelativeDate, formatDate } from "@/lib/utils/cn";
import { INVOICE_WORKFLOW_TYPE, defaultInvoiceApprovalDueDate } from "@/lib/invoices/constants";
import { getModuleBySlug } from "@/lib/modules/modules";
import { DIRECTORY } from "@/lib/terminology/directory";

async function listApprovers(organizationId: string) {
  const supabase = createServiceClient();
  const { data: members } = await supabase
    .from("organization_members")
    .select("id, user_id, invited_email, status")
    .eq("organization_id", organizationId)
    .eq("status", "active");

  const approvers = await Promise.all(
    (members ?? []).map(async (m) => {
      if (m.invited_email) return { id: m.id, label: m.invited_email };
      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(m.user_id);
      return { id: m.id, label: user?.email ?? "Team member" };
    })
  );

  return approvers;
}

export async function InvoicesModulePage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const mod = getModuleBySlug("invoices")!;

  const [{ data: workflows }, { data: vendors }, approvers] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id, title, status, due_date, updated_at, metadata, vendors(name)")
      .eq("organization_id", ctx.organization.id)
      .eq("type", INVOICE_WORKFLOW_TYPE)
      .neq("status", "cancelled")
      .order("updated_at", { ascending: false }),
    supabase
      .from("vendors")
      .select("id, name")
      .eq("organization_id", ctx.organization.id)
      .neq("status", "archived")
      .order("name"),
    listApprovers(ctx.organization.id),
  ]);

  const items = workflows ?? [];
  const pending = items.filter((w) => ["submitted", "overdue"].includes(w.status)).length;
  const draft = items.filter((w) => ["draft", "review_needed"].includes(w.status)).length;
  const approved = items.filter((w) => w.status === "approved").length;
  const rejected = items.filter((w) => w.status === "rejected").length;

  const Icon = mod.icon;

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
        <p className="flex-1 text-body-sm text-primary">{mod.paidWorkflowDescription}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Awaiting approval", value: pending },
          { label: "In progress", value: draft },
          { label: "Approved", value: approved },
          { label: "Rejected", value: rejected },
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
        <Card>
          <CardHeader>
            <CardTitle>{mod.primaryAction}</CardTitle>
          </CardHeader>
          <CardContent>
            {approvers.length ? (
              <SubmitInvoiceForm
                vendors={vendors ?? []}
                approvers={approvers}
                defaultApprovalDueDate={defaultInvoiceApprovalDueDate().toISOString()}
              />
            ) : (
              <div className="space-y-3 text-body-sm">
                <p className="text-secondary">
                  Invite a teammate in Settings → Members before routing invoice approvals.
                </p>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/app/settings/members">Manage members</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-h4 text-primary">Invoices</h2>
          {!items.length ? (
            <EmptyState title={mod.emptyStateTitle} description={mod.emptyStateDescription} />
          ) : (
            <DataTable
              columns={[
                { key: "vendor", label: "Vendor" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
                { key: "due", label: "Approval due" },
                { key: "updated", label: "Updated" },
              ]}
              rows={items.map((w) => {
                const meta = (w.metadata ?? {}) as Record<string, string | null>;
                const vendorRow = Array.isArray(w.vendors) ? w.vendors[0] : w.vendors;
                const vendorName =
                  (vendorRow as { name?: string } | null)?.name ?? meta.vendor_name ?? w.title;
                return {
                  vendor: (
                    <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                      {vendorName}
                    </Link>
                  ),
                  amount: meta.invoice_amount ? `$${meta.invoice_amount}` : "—",
                  status: <StatusBadge status={w.status} />,
                  due: w.due_date ? formatDate(w.due_date) : "—",
                  updated: formatRelativeDate(w.updated_at),
                };
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
