import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { checkModuleEntitlement } from "./checkEntitlement";
import {
  FREE_TIER_LIMITS,
  W9_ENTITLEMENT,
  COI_ENTITLEMENT,
  CONTRACT_ENTITLEMENT,
  VENDOR_PACKET_ENTITLEMENT,
} from "./limits";

export type UsageLimitKey =
  | "vendors"
  | "w9_requests"
  | "coi_requests"
  | "coi_active_records"
  | "contract_active_records"
  | "vendor_packet_requests"
  | "vendor_packet_active"
  | "team_members";

export type LimitCheckResult =
  | { allowed: true }
  | { allowed: false; limit: UsageLimitKey; current: number; max: number };

function monthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

async function getUsageCount(organizationId: string, metricKey: string): Promise<number> {
  const supabase = createServiceClient();
  const periodStart = metricKey === "w9_requests" ? monthStart() : monthStart();

  const { data } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("organization_id", organizationId)
    .eq("metric_key", metricKey)
    .eq("period_start", periodStart)
    .maybeSingle();

  return data?.count ?? 0;
}

async function countVendors(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("vendors")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .neq("status", "archived");
  return count ?? 0;
}

async function countActiveContractRecords(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("workflow_instances")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("type", "contract_renewal")
    .in("status", [
      "draft",
      "uploaded",
      "metadata_needed",
      "review_needed",
      "renewal_monitoring",
      "notice_window_open",
      "renewal_approaching",
      "auto_renew_risk",
      "expired",
      "active_monitoring",
      "expiring_soon",
    ]);
  return count ?? 0;
}

async function countActiveCoiRecords(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("workflow_instances")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("type", "coi_tracking")
    .in("status", ["active_monitoring", "expiring_soon", "approved", "review_needed", "submitted"]);
  return count ?? 0;
}

async function countActiveVendorPackets(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("workflow_instances")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("type", "vendor_packet")
    .in("status", ["draft", "sent", "opened", "in_progress", "review_needed", "overdue"]);
  return count ?? 0;
}

async function countMembers(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("organization_members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("status", "active");
  return count ?? 0;
}

const LIMIT_ENTITLEMENT: Partial<Record<UsageLimitKey, string>> = {
  w9_requests: W9_ENTITLEMENT,
  coi_requests: COI_ENTITLEMENT,
  coi_active_records: COI_ENTITLEMENT,
  contract_active_records: CONTRACT_ENTITLEMENT,
  vendor_packet_requests: VENDOR_PACKET_ENTITLEMENT,
  vendor_packet_active: VENDOR_PACKET_ENTITLEMENT,
};

async function hasActiveSubscription(organizationId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .maybeSingle();
  return !!subscription;
}

async function bypassesFreeLimits(
  organizationId: string,
  limitKey: UsageLimitKey
): Promise<boolean> {
  if (await hasActiveSubscription(organizationId)) return true;

  const productKey = LIMIT_ENTITLEMENT[limitKey];
  if (productKey) return checkModuleEntitlement(organizationId, productKey);

  if (limitKey === "vendors") {
    return (
      (await checkModuleEntitlement(organizationId, W9_ENTITLEMENT)) ||
      (await checkModuleEntitlement(organizationId, COI_ENTITLEMENT))
    );
  }

  return false;
}

export async function incrementUsage(
  organizationId: string,
  metricKey: "w9_requests" | "coi_requests" | "vendor_packet_requests"
): Promise<void> {
  const supabase = createServiceClient();
  const periodStart = monthStart();

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, count")
    .eq("organization_id", organizationId)
    .eq("metric_key", metricKey)
    .eq("period_start", periodStart)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      organization_id: organizationId,
      metric_key: metricKey,
      period_start: periodStart,
      count: 1,
    });
  }
}

export async function checkUsageLimit(
  organizationId: string,
  limitKey: UsageLimitKey
): Promise<LimitCheckResult> {
  const hasPaid = await bypassesFreeLimits(organizationId, limitKey);
  if (hasPaid) return { allowed: true };

  if (limitKey === "vendors") {
    const current = await countVendors(organizationId);
    if (current >= FREE_TIER_LIMITS.vendors) {
      return { allowed: false, limit: "vendors", current, max: FREE_TIER_LIMITS.vendors };
    }
  }

  if (limitKey === "w9_requests") {
    const current = await getUsageCount(organizationId, "w9_requests");
    if (current >= FREE_TIER_LIMITS.w9RequestsPerMonth) {
      return {
        allowed: false,
        limit: "w9_requests",
        current,
        max: FREE_TIER_LIMITS.w9RequestsPerMonth,
      };
    }
  }

  if (limitKey === "coi_requests") {
    const current = await getUsageCount(organizationId, "coi_requests");
    if (current >= FREE_TIER_LIMITS.coiRequestsPerMonth) {
      return {
        allowed: false,
        limit: "coi_requests",
        current,
        max: FREE_TIER_LIMITS.coiRequestsPerMonth,
      };
    }
  }

  if (limitKey === "coi_active_records") {
    const current = await countActiveCoiRecords(organizationId);
    if (current >= FREE_TIER_LIMITS.coiActiveRecords) {
      return {
        allowed: false,
        limit: "coi_active_records",
        current,
        max: FREE_TIER_LIMITS.coiActiveRecords,
      };
    }
  }

  if (limitKey === "contract_active_records") {
    const current = await countActiveContractRecords(organizationId);
    if (current >= FREE_TIER_LIMITS.contractActiveRecords) {
      return {
        allowed: false,
        limit: "contract_active_records",
        current,
        max: FREE_TIER_LIMITS.contractActiveRecords,
      };
    }
  }

  if (limitKey === "vendor_packet_requests") {
    const current = await getUsageCount(organizationId, "vendor_packet_requests");
    if (current >= FREE_TIER_LIMITS.vendorPacketRequestsPerMonth) {
      return {
        allowed: false,
        limit: "vendor_packet_requests",
        current,
        max: FREE_TIER_LIMITS.vendorPacketRequestsPerMonth,
      };
    }
  }

  if (limitKey === "vendor_packet_active") {
    const current = await countActiveVendorPackets(organizationId);
    if (current >= FREE_TIER_LIMITS.vendorPacketActive) {
      return {
        allowed: false,
        limit: "vendor_packet_active",
        current,
        max: FREE_TIER_LIMITS.vendorPacketActive,
      };
    }
  }

  if (limitKey === "team_members") {
    const current = await countMembers(organizationId);
    if (current >= FREE_TIER_LIMITS.teamMembers) {
      return { allowed: false, limit: "team_members", current, max: FREE_TIER_LIMITS.teamMembers };
    }
  }

  return { allowed: true };
}

export async function assertUsageLimit(
  organizationId: string,
  limitKey: UsageLimitKey,
  actorId?: string
): Promise<void> {
  const result = await checkUsageLimit(organizationId, limitKey);
  if (result.allowed) return;

  await createAuditLog({
    organizationId,
    actorType: actorId ? "user" : "system",
    actorId,
    action: "billing.limit_reached",
    targetType: "organization",
    targetId: organizationId,
    metadata: { limit: result.limit, current: result.current, max: result.max },
  });

  trackEvent("billing_limit_reached", { limit: result.limit, current: result.current });

  throw new Error(
    `Usage limit reached: ${result.limit} (${result.current}/${result.max}). Upgrade to continue.`
  );
}
