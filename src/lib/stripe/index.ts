import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { syncModuleSubscription, deactivateModuleSubscription } from "@/lib/billing/syncEntitlements";

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
}

export async function getOrCreateStripeCustomer(
  organizationId: string,
  organizationName: string,
  email: string
): Promise<string> {
  const supabase = createServiceClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", organizationId)
    .single();

  if (org?.stripe_customer_id) return org.stripe_customer_id;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    name: organizationName,
    email,
    metadata: { organizationId },
  });

  await supabase
    .from("organizations")
    .update({ stripe_customer_id: customer.id })
    .eq("id", organizationId);

  return customer.id;
}

export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<void> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id, status")
    .eq("event_id", event.id)
    .single();

  if (existing?.status === "processed") return;

  if (!existing) {
    await supabase.from("webhook_events").insert({
      source: "stripe",
      event_id: event.id,
      event_type: event.type,
      payload: event as unknown as Record<string, unknown>,
      status: "received",
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organizationId;
        const subscriptionId = session.subscription as string | null;
        if (orgId && subscriptionId) {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncModuleSubscription(subscription, orgId);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata.organizationId;
        if (!orgId) break;

        await supabase.from("subscriptions").upsert(
          {
            organization_id: orgId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status === "active" ? "active" : subscription.status === "past_due" ? "past_due" : subscription.status === "trialing" ? "trialing" : "cancelled",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
          },
          { onConflict: "stripe_subscription_id" }
        );

        await syncModuleSubscription(subscription, orgId);

        await createAuditLog({
          organizationId: orgId,
          actorType: "system",
          action: "billing.subscription_updated",
          targetType: "subscription",
          targetId: subscription.id,
          metadata: { status: subscription.status },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata.organizationId;
        if (!orgId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        await deactivateModuleSubscription(subscription, orgId);

        await createAuditLog({
          organizationId: orgId,
          actorType: "system",
          action: "billing.subscription_cancelled",
          targetType: "subscription",
          targetId: subscription.id,
        });
        break;
      }
    }

    await supabase
      .from("webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("event_id", event.id);
  } catch (err) {
    await supabase
      .from("webhook_events")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : "Processing failed",
      })
      .eq("event_id", event.id);
    throw err;
  }
}

export async function hasEntitlement(
  organizationId: string,
  productKey: string
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("organization_entitlements")
    .select("is_enabled, products!inner(key)")
    .eq("organization_id", organizationId)
    .eq("products.key", productKey)
    .eq("is_enabled", true)
    .single();

  return !!data;
}
