import { describe, it, expect } from "vitest";
import {
  VENDOR_PACKET_WORKFLOW_TYPE,
  VENDOR_PACKET_MAGIC_LINK_PURPOSE,
  VENDOR_PACKET_MONITOR_TYPE,
  PACKET_CHECKLIST_ITEMS,
  defaultPacketDueDate,
} from "@/lib/vendor-packets/constants";
import { buildPacketStoragePath } from "@/lib/vendor-packets/uploadExternal";
import { computePacketProgress } from "@/lib/vendor-packets/completion";
import { FREE_TIER_LIMITS, VENDOR_PACKET_ENTITLEMENT } from "@/lib/billing/limits";

describe("Vendor packet constants", () => {
  it("defines workflow and monitor types", () => {
    expect(VENDOR_PACKET_WORKFLOW_TYPE).toBe("vendor_packet");
    expect(VENDOR_PACKET_MAGIC_LINK_PURPOSE).toBe("vendor_packet_portal");
    expect(VENDOR_PACKET_MONITOR_TYPE).toBe("vendor_packet_incomplete");
  });

  it("includes default checklist items", () => {
    expect(PACKET_CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(2);
    expect(PACKET_CHECKLIST_ITEMS.find((i) => i.key === "w9")?.required).toBe(true);
    expect(PACKET_CHECKLIST_ITEMS.find((i) => i.key === "coi")?.required).toBe(true);
  });

  it("default due date is in the future", () => {
    expect(defaultPacketDueDate().getTime()).toBeGreaterThan(Date.now());
  });
});

describe("Vendor packet storage path", () => {
  it("builds tenant-scoped path", () => {
    const path = buildPacketStoragePath("org", "vendor", "wf", "doc", 1, "w9.pdf");
    expect(path).toContain("organizations/org/vendors/vendor");
    expect(path).toContain("packets");
  });
});

describe("Packet progress computation", () => {
  it("exports computePacketProgress function", () => {
    expect(typeof computePacketProgress).toBe("function");
  });
});

describe("Vendor packet billing", () => {
  it("defines free tier limits", () => {
    expect(FREE_TIER_LIMITS.vendorPacketRequestsPerMonth).toBe(3);
    expect(FREE_TIER_LIMITS.vendorPacketActive).toBe(3);
    expect(VENDOR_PACKET_ENTITLEMENT).toBe("vendor_packet");
  });
});
