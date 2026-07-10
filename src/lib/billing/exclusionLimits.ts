import { createServiceClient } from "@/lib/supabase/service";
import { FREE_TIER_LIMITS, EXCLUSION_ENTITLEMENT } from "./limits";
import { checkModuleEntitlement } from "./checkEntitlement";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";

function monthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

async function getUsageCount(organizationId: string, metricKey: string): Promise<number> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("organization_id", organizationId)
    .eq("metric_key", metricKey)
    .eq("period_start", monthStart())
    .maybeSingle();
  return data?.count ?? 0;
}

async function countActiveExclusionMonitors(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("monitors")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("monitor_type", "exclusion_monitoring")
    .eq("status", "active");
  return count ?? 0;
}

export async function assertExclusionCheckLimit(organizationId: string, actorId?: string) {
  if (await checkModuleEntitlement(organizationId, EXCLUSION_ENTITLEMENT)) return;

  const current = await getUsageCount(organizationId, "exclusion_checks");
  if (current >= FREE_TIER_LIMITS.exclusionChecksPerMonth) {
    await createAuditLog({
      organizationId,
      actorType: actorId ? "user" : "system",
      actorId,
      action: "exclusion_billing.limit_reached",
      targetType: "organization",
      targetId: organizationId,
      metadata: { limit: "exclusion_checks", current, max: FREE_TIER_LIMITS.exclusionChecksPerMonth },
    });
    trackEvent("exclusion_limit_reached", { limit: "exclusion_checks" });
    throw new Error("Exclusion check limit reached. Upgrade to continue.");
  }
}

export async function incrementExclusionCheckUsage(organizationId: string) {
  const supabase = createServiceClient();
  const periodStart = monthStart();
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, count")
    .eq("organization_id", organizationId)
    .eq("metric_key", "exclusion_checks")
    .eq("period_start", periodStart)
    .maybeSingle();

  if (existing) {
    await supabase.from("usage_tracking").update({ count: existing.count + 1 }).eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      organization_id: organizationId,
      metric_key: "exclusion_checks",
      period_start: periodStart,
      count: 1,
    });
  }
}

export async function assertExclusionMonitorLimit(organizationId: string, actorId?: string) {
  if (await checkModuleEntitlement(organizationId, EXCLUSION_ENTITLEMENT)) return;

  const current = await countActiveExclusionMonitors(organizationId);
  if (current >= FREE_TIER_LIMITS.exclusionActiveMonitors) {
    await createAuditLog({
      organizationId,
      actorType: actorId ? "user" : "system",
      actorId,
      action: "exclusion_billing.limit_reached",
      targetType: "organization",
      targetId: organizationId,
      metadata: { limit: "exclusion_active_monitors", current, max: FREE_TIER_LIMITS.exclusionActiveMonitors },
    });
    throw new Error("Active exclusion monitor limit reached. Upgrade to continue.");
  }
}
