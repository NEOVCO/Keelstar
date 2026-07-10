import { getStripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getStripePriceId, type BillingInterval } from "@/lib/billing/products";

export async function createModuleCheckoutSession(input: {
  organizationId: string;
  organizationName: string;
  userEmail: string;
  productKey: string;
  interval: BillingInterval;
}) {
  const ctx = await requirePermission(PERMISSIONS.BILLING_MANAGE);
  if (ctx.organization.id !== input.organizationId) {
    throw new Error("Organization mismatch");
  }

  const priceId = await getStripePriceId(input.productKey, input.interval);
  if (!priceId) {
    throw new Error(
      "Stripe price not configured for this module. Run scripts/stripe-setup-products.ts."
    );
  }

  const customerId = await getOrCreateStripeCustomer(
    input.organizationId,
    input.organizationName,
    input.userEmail
  );

  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app/settings/billing?checkout=success&product=${input.productKey}`,
    cancel_url: `${appUrl}/app/settings/billing?checkout=cancelled`,
    subscription_data: {
      metadata: {
        organizationId: input.organizationId,
        productKey: input.productKey,
      },
    },
    metadata: {
      organizationId: input.organizationId,
      productKey: input.productKey,
    },
    allow_promotion_codes: true,
  });
}

export async function createBillingPortalSession(customerId: string) {
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/app/settings/billing`,
  });
}
