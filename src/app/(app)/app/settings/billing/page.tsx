import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireOrganization } from "@/lib/tenant/context";
import { getUsageStats } from "@/lib/billing/usage";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";

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
  const usage = await getUsageStats(ctx.organization.id);

  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Billing" }]} />
        }
        title="Billing"
        description="Plan, usage limits, and upgrade."
        action={
          usage.plan === "free" ? (
            <Button disabled title="Stripe checkout coming soon">
              Upgrade plan
            </Button>
          ) : undefined
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>{usage.plan === "paid" ? "Paid plan" : "Free plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageRow label="Vendors" current={usage.vendors.current} max={usage.vendors.max} />
          <UsageRow
            label="W-9 requests (this month)"
            current={usage.w9Requests.current}
            max={usage.w9Requests.max}
          />
          <UsageRow label="Team members" current={usage.teamMembers.current} max={usage.teamMembers.max} />
          {usage.plan === "free" && (
            <p className="mt-4 text-caption text-secondary">
              Free tier includes up to {FREE_TIER_LIMITS.vendors} vendors and{" "}
              {FREE_TIER_LIMITS.w9RequestsPerMonth} W-9 requests per month.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
