import { describe, it, expect } from "vitest";
import { hashToken } from "@/lib/magic-links/hashToken";
import {
  COI_WORKFLOW_TYPE,
  COI_DOCUMENT_TYPE,
  COI_MAGIC_LINK_PURPOSE,
  COI_POLICY_TYPES,
  COI_REQUIRED_FIELDS,
  COI_EXPIRING_SOON_DAYS,
} from "@/lib/coi/constants";
import { buildCoiStoragePath } from "@/lib/coi/uploadExternal";
import {
  daysUntilExpiration,
  computeCoiMonitoringStatus,
} from "@/lib/coi/expirationMonitor";
import { FREE_TIER_LIMITS, COI_ENTITLEMENT } from "@/lib/billing/limits";
import { PERMISSIONS } from "@/lib/rbac/permissions";

describe("COI constants", () => {
  it("defines workflow and document types", () => {
    expect(COI_WORKFLOW_TYPE).toBe("coi_tracking");
    expect(COI_DOCUMENT_TYPE).toBe("coi");
    expect(COI_MAGIC_LINK_PURPOSE).toBe("coi_upload");
  });

  it("defines policy types and required fields", () => {
    expect(COI_POLICY_TYPES).toContain("general_liability");
    expect(COI_REQUIRED_FIELDS).toContain("expiration_date");
    expect(COI_REQUIRED_FIELDS).toContain("insured_name");
    expect(COI_REQUIRED_FIELDS).toContain("policy_type");
  });
});

describe("COI storage path", () => {
  it("builds tenant-scoped path", () => {
    const path = buildCoiStoragePath(
      "org-1",
      "vendor-1",
      "wf-1",
      "doc-1",
      1,
      "coi.pdf"
    );
    expect(path).toContain("organizations/org-1");
    expect(path).toContain("coi.pdf");
  });
});

describe("COI expiration status", () => {
  it("marks expiring soon within 30 days", () => {
    const exp = new Date();
    exp.setDate(exp.getDate() + COI_EXPIRING_SOON_DAYS - 5);
    expect(computeCoiMonitoringStatus(exp)).toBe("expiring_soon");
  });

  it("marks expired after date", () => {
    const exp = new Date();
    exp.setDate(exp.getDate() - 1);
    expect(computeCoiMonitoringStatus(exp)).toBe("expired");
    expect(daysUntilExpiration(exp)).toBeLessThan(0);
  });

  it("marks active monitoring when far from expiration", () => {
    const exp = new Date();
    exp.setDate(exp.getDate() + 90);
    expect(computeCoiMonitoringStatus(exp)).toBe("active_monitoring");
  });
});

describe("COI magic link security", () => {
  it("hashes tokens consistently", () => {
    const a = hashToken("test-token-123");
    const b = hashToken("test-token-123");
    expect(a).toBe(b);
    expect(a).not.toBe("test-token-123");
  });
});

describe("COI billing", () => {
  it("defines free tier COI limits", () => {
    expect(FREE_TIER_LIMITS.coiRequestsPerMonth).toBe(3);
    expect(FREE_TIER_LIMITS.coiActiveRecords).toBe(3);
    expect(COI_ENTITLEMENT).toBe("coi_tracker");
  });
});

describe("COI permissions", () => {
  it("requires workflows.create for requests", () => {
    expect(PERMISSIONS.WORKFLOWS_CREATE).toBe("workflows.create");
  });

  it("requires workflows.approve for review", () => {
    expect(PERMISSIONS.WORKFLOWS_APPROVE).toBe("workflows.approve");
  });
});

describe("COI email templates", () => {
  it("uses template keys registered in sendEmail", async () => {
    const { vendorCoiRequestEmail } = await import("@/lib/email/templates/coi");
    const email = vendorCoiRequestEmail({
      organizationName: "Acme",
      vendorName: "Vendor",
      dueDate: "2026-12-31",
      magicLinkUrl: "https://example.com/token",
    });
    expect(email.templateKey).toBe("vendor_coi_request");
  });
});

describe("COI evidence export", () => {
  it("exports module function", async () => {
    const mod = await import("@/lib/coi/exportEvidence");
    expect(typeof mod.exportCoiEvidence).toBe("function");
  });
});
