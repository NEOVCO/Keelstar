import { createServiceClient } from "@/lib/supabase/service";
import { AuthorizationError } from "@/lib/rbac/types";
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

  const { data: moduleSub } = await supabase
    .from("module_subscriptions")
    .select("status")
    .eq("organization_id", organizationId)
    .eq("product_id", product.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  if (moduleSub) return true;

  const { data: entitlement } = await supabase
    .from("organization_entitlements")
    .select("is_enabled, source")
    .eq("organization_id", organizationId)
    .eq("product_id", product.id)
    .maybeSingle();

  return !!(entitlement?.is_enabled && entitlement.source === "subscription");
}

export async function requireModuleEntitlement(
  organizationId: string,
  productKey: string
): Promise<void> {
  const entitled = await checkModuleEntitlement(organizationId, productKey);
  if (!entitled) {
    throw new AuthorizationError(
      `Active subscription required for this module. Upgrade at billing settings.`,
      "NO_ENTITLEMENT"
    );
  }
}

/** @deprecated Use checkModuleEntitlement(orgId, W9_ENTITLEMENT) */
export async function checkEntitlement(organizationId: string): Promise<boolean> {
  return checkModuleEntitlement(organizationId, W9_ENTITLEMENT);
}

export async function hasAnyPaidModule(organizationId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("module_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .in("status", ["active", "trialing"]);
  return (count ?? 0) > 0;
}
