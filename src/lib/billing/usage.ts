import { createServiceClient } from "@/lib/supabase/service";
import { FREE_TIER_LIMITS } from "./limits";
import { checkEntitlement } from "./checkEntitlement";
import { checkUsageLimit, type UsageLimitKey } from "./checkUsageLimit";

export type UsageStats = {
  plan: "free" | "paid";
  vendors: { current: number; max: number };
  w9Requests: { current: number; max: number };
  teamMembers: { current: number; max: number };
};

async function countVendors(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("vendors")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .neq("status", "archived");
  return count ?? 0;
}

async function countW9Requests(organizationId: string): Promise<number> {
  const supabase = createServiceClient();
  const d = new Date();
  const periodStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  const { data } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("organization_id", organizationId)
    .eq("metric_key", "w9_requests")
    .eq("period_start", periodStart)
    .maybeSingle();
  return data?.count ?? 0;
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

export async function getUsageStats(organizationId: string): Promise<UsageStats> {
  const paid = await checkEntitlement(organizationId);
  const [vendors, w9Requests, teamMembers] = await Promise.all([
    countVendors(organizationId),
    countW9Requests(organizationId),
    countMembers(organizationId),
  ]);

  if (paid) {
    return {
      plan: "paid",
      vendors: { current: vendors, max: Infinity },
      w9Requests: { current: w9Requests, max: Infinity },
      teamMembers: { current: teamMembers, max: Infinity },
    };
  }

  return {
    plan: "free",
    vendors: { current: vendors, max: FREE_TIER_LIMITS.vendors },
    w9Requests: { current: w9Requests, max: FREE_TIER_LIMITS.w9RequestsPerMonth },
    teamMembers: { current: teamMembers, max: FREE_TIER_LIMITS.teamMembers },
  };
}

export function formatLimitError(limitKey: UsageLimitKey, message: string): {
  title: string;
  description: string;
  href: string;
} {
  const labels: Record<UsageLimitKey, string> = {
    vendors: "vendor limit",
    w9_requests: "W-9 request limit",
    coi_requests: "COI request limit",
    coi_active_records: "active COI limit",
    contract_active_records: "active contract limit",
    vendor_packet_requests: "vendor packet request limit",
    vendor_packet_active: "active vendor packet limit",
    team_members: "team member limit",
  };
  return {
    title: `${labels[limitKey]} reached`,
    description: message,
    href: "/app/settings/billing",
  };
}
