import { describe, it, expect } from "vitest";
import { FREE_TIER_LIMITS, W9_ENTITLEMENT, COI_ENTITLEMENT, CONTRACT_ENTITLEMENT } from "@/lib/billing/limits";

describe("Billing limits", () => {
  it("defines consistent free tier caps per module", () => {
    expect(FREE_TIER_LIMITS.vendors).toBe(5);
    expect(FREE_TIER_LIMITS.w9RequestsPerMonth).toBe(5);
    expect(FREE_TIER_LIMITS.coiRequestsPerMonth).toBe(3);
    expect(FREE_TIER_LIMITS.coiActiveRecords).toBe(3);
    expect(FREE_TIER_LIMITS.contractActiveRecords).toBe(3);
  });

  it("maps entitlements to module keys", () => {
    expect(W9_ENTITLEMENT).toBe("w9_collector");
    expect(COI_ENTITLEMENT).toBe("coi_tracker");
    expect(CONTRACT_ENTITLEMENT).toBe("contract_renewal");
  });
});
