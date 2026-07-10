import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOrganization } from "@/lib/tenant/context";
import { getUsageStats } from "@/lib/billing/usage";
import { listOrgEntitlements, listOrgModuleSubscriptions } from "@/lib/billing/syncEntitlements";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";
import { BillingUpgradePanel } from "@/components/billing/BillingUpgradePanel";
import { DIRECTORY } from "@/lib/terminology/directory";
import { site } from "@/lib/site";

function UsageRow({ label, current, max }: { label: string; current: number; max: number }) {
  const atLimit = Number.isFinite(max) && current >= max;
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-body-sm text-secondary">{label}</span>
      <span className={`text-body-sm font-medium ${atLimit ? "text-error" : "text-primary"}`}>
        {current} / {Number.isFinite(max) ? max : "∞"}
      </span>
    </div>
  );
}

export default async function BillingSettingsPage() {
  const ctx = await requireOrganization();
  const [usage, entitlements, subscriptions] = await Promise.all([
    getUsageStats(ctx.organization.id),
    listOrgEntitlements(ctx.organization.id),
    listOrgModuleSubscriptions(ctx.organization.id),
  ]);

  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Billing" }]} />
        }
        title="Billing"
        description="Subscribe per module — $49/month or $490/year (2 months free)."
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{usage.plan === "paid" ? "Active subscriptions" : "Free plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageRow label={DIRECTORY.usageLabel} current={usage.vendors.current} max={usage.vendors.max} />
          <UsageRow
            label="W-9 requests (this month)"
            current={usage.w9Requests.current}
            max={usage.w9Requests.max}
          />
          <UsageRow label="Team members" current={usage.teamMembers.current} max={usage.teamMembers.max} />
          {usage.plan === "free" && (
            <p className="mt-4 text-caption text-secondary">
              Free tier includes up to {FREE_TIER_LIMITS.vendors} directory records and{" "}
              {FREE_TIER_LIMITS.w9RequestsPerMonth} W-9 requests per month. Subscribe to a module for unlimited
              usage on that module.
            </p>
          )}
        </CardContent>
      </Card>
      <BillingUpgradePanel entitlements={entitlements as never} subscriptions={subscriptions as never} />
      <p className="mt-6 text-body-sm text-secondary">
        Billing questions? Email{" "}
        <a href={`mailto:${site.contactEmail}`} className="text-accent hover:underline">
          {site.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
