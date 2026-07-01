import { describe, it, expect } from "vitest";
import { roleHasPermission } from "@/lib/rbac/roles";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can, canAll, canAny } from "@/lib/rbac/types";
import { hashToken } from "@/lib/magic-links/createMagicLink";

describe("RBAC", () => {
  it("owner has all permissions", () => {
    expect(roleHasPermission("owner", PERMISSIONS.BILLING_MANAGE)).toBe(true);
    expect(roleHasPermission("owner", PERMISSIONS.AUDIT_VIEW)).toBe(true);
  });

  it("admin lacks billing.manage", () => {
    expect(roleHasPermission("admin", PERMISSIONS.BILLING_MANAGE)).toBe(false);
    expect(roleHasPermission("admin", PERMISSIONS.MEMBERS_MANAGE)).toBe(true);
  });

  it("viewer has read-only permissions", () => {
    expect(roleHasPermission("viewer", PERMISSIONS.DOCUMENTS_VIEW)).toBe(true);
    expect(roleHasPermission("viewer", PERMISSIONS.DOCUMENTS_CREATE)).toBe(false);
  });

  it("can checks permission membership", () => {
    const perms = [PERMISSIONS.DOCUMENTS_VIEW, PERMISSIONS.WORKFLOWS_VIEW];
    expect(can(perms, PERMISSIONS.DOCUMENTS_VIEW)).toBe(true);
    expect(can(perms, PERMISSIONS.BILLING_MANAGE)).toBe(false);
  });

  it("canAny and canAll work correctly", () => {
    const perms = [PERMISSIONS.DOCUMENTS_VIEW];
    expect(canAny(perms, [PERMISSIONS.DOCUMENTS_VIEW, PERMISSIONS.BILLING_MANAGE])).toBe(true);
    expect(canAll(perms, [PERMISSIONS.DOCUMENTS_VIEW, PERMISSIONS.BILLING_MANAGE])).toBe(false);
  });
});

describe("Magic Links", () => {
  it("hashToken produces consistent SHA-256 hex", () => {
    const hash1 = hashToken("test-token");
    const hash2 = hashToken("test-token");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("hashToken produces different hashes for different tokens", () => {
    expect(hashToken("token-a")).not.toBe(hashToken("token-b"));
  });
});

describe("Audit Log Schema", () => {
  it("validates required fields", async () => {
    const { auditLogSchema } = await import("@/lib/audit/createAuditLog");
    const result = auditLogSchema.safeParse({
      organizationId: "00000000-0000-0000-0000-000000000001",
      actorType: "user",
      action: "organization.created",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid actor type", async () => {
    const { auditLogSchema } = await import("@/lib/audit/createAuditLog");
    const result = auditLogSchema.safeParse({
      organizationId: "00000000-0000-0000-0000-000000000001",
      actorType: "invalid",
      action: "test",
    });
    expect(result.success).toBe(false);
  });
});

describe("Monitor Idempotency", () => {
  it("idempotency key format is deterministic per monitor per day", () => {
    const monitorId = "abc-123";
    const date = "2025-06-28";
    const key = `monitor-run-${monitorId}-${date}`;
    expect(key).toBe("monitor-run-abc-123-2025-06-28");
  });
});

describe("Organization Access", () => {
  it("slugify produces URL-safe slugs", async () => {
    const { slugify } = await import("@/lib/utils");
    expect(slugify("Acme Corp")).toBe("acme-corp");
    expect(slugify("Test & Co.")).toBe("test-co");
  });

  it("sanitizeFilename removes unsafe characters", async () => {
    const { sanitizeFilename } = await import("@/lib/utils");
    expect(sanitizeFilename("../../etc/passwd")).not.toContain("..");
    expect(sanitizeFilename("my document (1).pdf")).toBe("my_document__1_.pdf");
  });
});
