import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getProductKeyByStripePriceId } from "./products";

export type OrgEntitlementRow = {
  is_enabled: boolean;
  source: string;
  products: { key: string; name: string };
};

export type OrgModuleSubscriptionRow = {
  status: string;
  billing_interval: "month" | "year" | null;
  current_period_end: string | null;
  products: { key: string; name: string };
};

export async function syncModuleSubscription(
  subscription: Stripe.Subscription,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();
  const active = ["active", "trialing"].includes(subscription.status);
  const item = subscription.items.data[0];
  if (!item?.price?.id) return;

  const productKey =
    subscription.metadata.productKey ?? (await getProductKeyByStripePriceId(item.price.id));
  if (!productKey) return;

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("key", productKey)
    .single();
  if (!product) return;

  const interval: OrgModuleSubscriptionRow["billing_interval"] =
    item.price.recurring?.interval === "year"
      ? "year"
      : item.price.recurring?.interval === "month"
        ? "month"
        : null;

  await supabase.from("module_subscriptions").upsert(
    {
      organization_id: organizationId,
      product_id: product.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: active ? (subscription.status === "trialing" ? "trialing" : "active") : "cancelled",
      billing_interval: interval,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );

  await supabase.from("organization_entitlements").upsert(
    {
      organization_id: organizationId,
      product_id: product.id,
      is_enabled: active,
      source: "subscription",
      enabled_at: active ? new Date().toISOString() : undefined,
      disabled_at: active ? null : new Date().toISOString(),
    },
    { onConflict: "organization_id,product_id" }
  );

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: active ? "billing.module_activated" : "billing.module_deactivated",
    targetType: "product",
    targetId: product.id,
    metadata: { productKey, subscriptionId: subscription.id, status: subscription.status },
  });
}

export async function deactivateModuleSubscription(
  subscription: Stripe.Subscription,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();
  const productKey = subscription.metadata.productKey;

  await supabase
    .from("module_subscriptions")
    .update({ status: "cancelled" })
    .eq("stripe_subscription_id", subscription.id);

  if (productKey) {
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("key", productKey)
      .single();
    if (product) {
      await supabase
        .from("organization_entitlements")
        .update({ is_enabled: false, disabled_at: new Date().toISOString(), source: "subscription" })
        .eq("organization_id", organizationId)
        .eq("product_id", product.id);
    }
  }
}

export async function listOrgEntitlements(organizationId: string): Promise<OrgEntitlementRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("organization_entitlements")
    .select("is_enabled, source, products!inner(key, name)")
    .eq("organization_id", organizationId);
  return (data as unknown as OrgEntitlementRow[]) ?? [];
}

export async function listOrgModuleSubscriptions(
  organizationId: string
): Promise<OrgModuleSubscriptionRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("module_subscriptions")
    .select("status, billing_interval, current_period_end, products!inner(key, name)")
    .eq("organization_id", organizationId);
  return (data as unknown as OrgModuleSubscriptionRow[]) ?? [];
}
