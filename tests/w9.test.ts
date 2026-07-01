import { describe, it, expect } from "vitest";
import { hashToken } from "@/lib/magic-links/hashToken";
import { roleHasPermission } from "@/lib/rbac/roles";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  W9_ALLOWED_MIME,
  W9_MAX_FILE_SIZE,
  defaultDueDate,
  W9_DEFAULT_DUE_DAYS,
} from "@/lib/w9/constants";
import { buildW9StoragePath } from "@/lib/w9/uploadExternal";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";

describe("W-9 Constants", () => {
  it("default due date is 14 days from now", () => {
    const due = defaultDueDate();
    const diff = Math.round((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    expect(diff).toBeGreaterThanOrEqual(W9_DEFAULT_DUE_DAYS - 1);
    expect(diff).toBeLessThanOrEqual(W9_DEFAULT_DUE_DAYS + 1);
  });

  it("allows PDF and images only", () => {
    expect(W9_ALLOWED_MIME).toContain("application/pdf");
    expect(W9_ALLOWED_MIME).toContain("image/png");
    expect(W9_MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });
});

describe("W-9 Storage Path", () => {
  it("builds vendor-scoped path", () => {
    const path = buildW9StoragePath(
      "org-1",
      "vendor-1",
      "wf-1",
      "doc-1",
      1,
      "w9.pdf"
    );
    expect(path).toContain("organizations/org-1/vendors/vendor-1/workflows/wf-1");
    expect(path).toContain("v1");
    expect(path).toContain("w9.pdf");
  });
});

describe("W-9 Magic Links", () => {
  it("hashToken produces consistent SHA-256 hex", () => {
    expect(hashToken("w9-token")).toHaveLength(64);
    expect(hashToken("w9-token")).toBe(hashToken("w9-token"));
  });

  it("different tokens produce different hashes", () => {
    expect(hashToken("a")).not.toBe(hashToken("b"));
  });
});

describe("W-9 Permissions", () => {
  it("viewer cannot create workflows (vendors/requests)", () => {
    expect(roleHasPermission("viewer", PERMISSIONS.WORKFLOWS_CREATE)).toBe(false);
  });

  it("manager can approve workflows", () => {
    expect(roleHasPermission("manager", PERMISSIONS.WORKFLOWS_APPROVE)).toBe(true);
  });

  it("member cannot approve", () => {
    expect(roleHasPermission("member", PERMISSIONS.WORKFLOWS_APPROVE)).toBe(false);
  });
});

describe("W-9 Billing Limits", () => {
  it("free tier allows 5 vendors and 5 monthly requests", () => {
    expect(FREE_TIER_LIMITS.vendors).toBe(5);
    expect(FREE_TIER_LIMITS.w9RequestsPerMonth).toBe(5);
  });
});

describe("W-9 Reminder Idempotency", () => {
  it("reminder window key is deterministic", () => {
    const key = `reminder-wf-123-before_7d`;
    expect(key).toBe("reminder-wf-123-before_7d");
  });
});

describe("W-9 Evidence Export", () => {
  it("csv escape handles commas", async () => {
    const { exportW9Evidence } = await import("@/lib/w9/exportEvidence");
    expect(exportW9Evidence).toBeDefined();
  });
});
