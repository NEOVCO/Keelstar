import { createServiceClient } from "@/lib/supabase/service";

export type BillingInterval = "month" | "year";

export type ProductRow = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  stripe_product_id: string | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
};

export async function getProductByKey(productKey: string): Promise<ProductRow | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, key, name, description, stripe_product_id, stripe_price_id_monthly, stripe_price_id_yearly")
    .eq("key", productKey)
    .eq("is_active", true)
    .single();
  return data;
}

export async function getStripePriceId(
  productKey: string,
  interval: BillingInterval
): Promise<string | null> {
  const product = await getProductByKey(productKey);
  if (!product) return null;
  return interval === "year" ? product.stripe_price_id_yearly : product.stripe_price_id_monthly;
}

export async function getProductKeyByStripePriceId(priceId: string): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("key, stripe_price_id_monthly, stripe_price_id_yearly")
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
    .maybeSingle();
  return data?.key ?? null;
}

export async function listActiveProducts(): Promise<ProductRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, key, name, description, stripe_product_id, stripe_price_id_monthly, stripe_price_id_yearly")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}
