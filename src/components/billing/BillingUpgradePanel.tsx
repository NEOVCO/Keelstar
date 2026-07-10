"use client";

import { useState } from "react";
import { MODULES } from "@/lib/modules/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrgEntitlementRow, OrgModuleSubscriptionRow } from "@/lib/billing/syncEntitlements";

export function BillingUpgradePanel({
  entitlements,
  subscriptions,
}: {
  entitlements: OrgEntitlementRow[];
  subscriptions: OrgModuleSubscriptionRow[];
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const entitledKeys = new Set(
    entitlements.filter((e) => e.is_enabled && e.source === "subscription").map((e) => e.products.key)
  );

  const subsByKey = new Map(
    subscriptions.map((s) => [s.products.key, s] as const)
  );

  async function checkout(productKey: string, interval: "month" | "year") {
    setLoading(`${productKey}-${interval}`);
    setError("");
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productKey, interval }),
    });
    const json = await res.json();
    setLoading(null);
    if (!json.success) {
      setError(json.error ?? "Checkout failed");
      return;
    }
    window.location.href = json.data.url;
  }

  async function openPortal() {
    setLoading("portal");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json();
    setLoading(null);
    if (!json.success) {
      setError(json.error ?? "Could not open billing portal");
      return;
    }
    window.location.href = json.data.url;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-body-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={loading === "portal"} onClick={openPortal}>
          Manage / cancel in Stripe
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((mod) => {
          const entitled = entitledKeys.has(mod.requiredEntitlement);
          const sub = subsByKey.get(mod.requiredEntitlement);

          const intervalLabel =
            sub?.billing_interval === "year"
              ? "Yearly"
              : sub?.billing_interval === "month"
                ? "Monthly"
                : null;

          const renewLabel =
            sub?.current_period_end != null
              ? new Date(sub.current_period_end).toLocaleDateString()
              : null;

          const subscribedLine = sub
            ? [
                "Subscribed",
                intervalLabel ? `· ${intervalLabel}` : null,
                renewLabel ? `· Renews ${renewLabel}` : null,
              ]
                .filter(Boolean)
                .join(" ")
            : "Subscribed";

          return (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle className="text-h4">{mod.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-body-sm text-secondary">
                  {entitled ? subscribedLine : "$49/mo or $490/yr (2 months free)"}
                </p>
                {!entitled && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={!!loading}
                      onClick={() => checkout(mod.requiredEntitlement, "month")}
                    >
                      {loading === `${mod.requiredEntitlement}-month` ? "…" : "$49/mo"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={!!loading}
                      onClick={() => checkout(mod.requiredEntitlement, "year")}
                    >
                      {loading === `${mod.requiredEntitlement}-year` ? "…" : "$490/yr"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
