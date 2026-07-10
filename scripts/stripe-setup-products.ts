/**
 * Create Keelstar module products on Stripe (live or test per STRIPE_SECRET_KEY).
 * Run: npx tsx scripts/stripe-setup-products.ts
 * Then updates Supabase products table with stripe IDs.
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const MODULES = [
  { key: "w9_collector", name: "W-9 Collector" },
  { key: "coi_tracker", name: "COI Tracker" },
  { key: "contract_renewal", name: "Contract Renewal Tracker" },
  { key: "contract_risk_scanner", name: "Contract Risk Scanner" },
  { key: "exclusion_monitor", name: "Exclusion Monitor" },
  { key: "vendor_packet", name: "Vendor Packet Portal" },
  { key: "policy_acknowledgement", name: "Policy Acknowledgement Tracker" },
  { key: "training_record", name: "Training Record Tracker" },
  { key: "invoice_approval", name: "Invoice Approval Lite" },
  { key: "simple_signer", name: "Simple Signer" },
] as const;

const MONTHLY_CENTS = 4900;
const YEARLY_CENTS = 49000;

async function main() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey) {
    console.error("Set STRIPE_SECRET_KEY (sk_live_... for production).");
    process.exit(1);
  }
  if (!supabaseUrl || !serviceKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const mode = stripeKey.startsWith("sk_live_") ? "LIVE" : "TEST";
  console.log(`Stripe mode: ${mode}`);

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const supabase = createClient(supabaseUrl, serviceKey);

  for (const mod of MODULES) {
    const { data: row } = await supabase
      .from("products")
      .select("id, stripe_product_id, stripe_price_id_monthly, stripe_price_id_yearly")
      .eq("key", mod.key)
      .single();

    if (!row) {
      console.warn(`Skip ${mod.key}: not in products table`);
      continue;
    }

    let productId = row.stripe_product_id;
    if (!productId) {
      const product = await stripe.products.create({
        name: `Keelstar — ${mod.name}`,
        description: `${mod.name} module subscription`,
        metadata: { productKey: mod.key },
      });
      productId = product.id;
      console.log(`Created product ${mod.key}: ${productId}`);
    }

    let monthlyPriceId = row.stripe_price_id_monthly;
    if (!monthlyPriceId) {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: MONTHLY_CENTS,
        currency: "usd",
        recurring: { interval: "month" },
        metadata: { productKey: mod.key, interval: "month" },
      });
      monthlyPriceId = price.id;
      console.log(`  monthly price: ${monthlyPriceId}`);
    }

    let yearlyPriceId = row.stripe_price_id_yearly;
    if (!yearlyPriceId) {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: YEARLY_CENTS,
        currency: "usd",
        recurring: { interval: "year" },
        metadata: { productKey: mod.key, interval: "year" },
      });
      yearlyPriceId = price.id;
      console.log(`  yearly price: ${yearlyPriceId}`);
    }

    await supabase
      .from("products")
      .update({
        stripe_product_id: productId,
        stripe_price_id_monthly: monthlyPriceId,
        stripe_price_id_yearly: yearlyPriceId,
      })
      .eq("id", row.id);
  }

  console.log("Done. Stripe product/price IDs saved to Supabase products table.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
