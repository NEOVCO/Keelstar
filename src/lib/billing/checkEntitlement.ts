import { createServiceClient } from "@/lib/supabase/service";
import { W9_ENTITLEMENT } from "./limits";

export async function checkModuleEntitlement(
  organizationId: string,
  productKey: string
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("key", productKey)
    .single();

  if (!product) return false;

  const { data: entitlement } = await supabase
    .from("organization_entitlements")
    .select("is_enabled, source")
    .eq("organization_id", organizationId)
    .eq("product_id", product.id)
    .single();

  if (entitlement?.is_enabled) return true;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .maybeSingle();

  return !!subscription;
}

/** @deprecated Use checkModuleEntitlement(orgId, W9_ENTITLEMENT) */
export async function checkEntitlement(organizationId: string): Promise<boolean> {
  return checkModuleEntitlement(organizationId, W9_ENTITLEMENT);
}
