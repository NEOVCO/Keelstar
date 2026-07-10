import { describe, expect, it } from "vitest";
import { createPolicyRequestSchema } from "@/lib/policies/createRequest";
import { POLICY_WORKFLOW_TYPE, POLICY_ENTITLEMENT } from "@/lib/policies/constants";

describe("policy acknowledgement module", () => {
  it("exports stable workflow constants", () => {
    expect(POLICY_WORKFLOW_TYPE).toBe("policy_acknowledgement");
    expect(POLICY_ENTITLEMENT).toBe("policy_acknowledgement");
  });

  it("validates create request input", () => {
    const parsed = createPolicyRequestSchema.parse({
      vendorId: "550e8400-e29b-41d4-a716-446655440000",
      policyTitle: "Code of Conduct",
      policyVersion: "2026-01",
      recipientEmail: "employee@example.com",
    });
    expect(parsed.policyTitle).toBe("Code of Conduct");
  });

  it("rejects missing policy title", () => {
    expect(() =>
      createPolicyRequestSchema.parse({
        vendorId: "550e8400-e29b-41d4-a716-446655440000",
        policyTitle: "",
      })
    ).toThrow();
  });
});
