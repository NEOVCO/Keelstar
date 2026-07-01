import { PageHeader, EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/modules/modules";

export default async function BillingPage() {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const [{ data: subscription }, { data: entitlements }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*")
      .eq("organization_id", ctx.organization.id)
      .maybeSingle(),
    supabase
      .from("organization_entitlements")
      .select("is_enabled, products(key, name)")
      .eq("organization_id", ctx.organization.id),
  ]);

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription and module entitlements."
        action={<Button>Manage subscription</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {!subscription ? (
              <EmptyState
                title="No active subscription"
                description="Start a trial or subscribe to enable paid workflows."
                action={<Button size="sm">Start trial</Button>}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={subscription.status} />
                </div>
                {subscription.current_period_end && (
                  <p className="text-body-sm text-secondary">
                    Current period ends{" "}
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Module entitlements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {MODULES.map((mod) => {
                const ent = entitlements?.find(
                  (e) => (e.products as { key?: string })?.key === mod.requiredEntitlement
                );
                const enabled = ent?.is_enabled ?? false;
                return (
                  <li
                    key={mod.id}
                    className="flex items-center justify-between rounded-md px-2 py-2 text-body-sm"
                  >
                    <span className="text-primary">{mod.name}</span>
                    <StatusBadge status={enabled ? "active" : "cancelled"} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
