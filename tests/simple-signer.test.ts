import { describe, expect, it } from "vitest";
import { createSignerRequestSchema } from "@/lib/signer/createRequest";
import {
  SIGNER_WORKFLOW_TYPE,
  SIGNER_ENTITLEMENT,
  SIGNER_MAGIC_LINK_PURPOSE,
  defaultSignerDueDate,
} from "@/lib/signer/constants";

describe("simple signer module", () => {
  it("exports stable workflow constants", () => {
    expect(SIGNER_WORKFLOW_TYPE).toBe("simple_signer");
    expect(SIGNER_ENTITLEMENT).toBe("simple_signer");
    expect(SIGNER_MAGIC_LINK_PURPOSE).toBe("document_signature");
  });

  it("validates create signer request input", () => {
    const parsed = createSignerRequestSchema.parse({
      signerEmail: "signer@example.com",
      documentTitle: "Engagement Letter",
      signerName: "Jane Doe",
    });
    expect(parsed.documentTitle).toBe("Engagement Letter");
    expect(parsed.signerEmail).toBe("signer@example.com");
  });

  it("defaults signature due date in the future", () => {
    const due = defaultSignerDueDate();
    expect(due.getTime()).toBeGreaterThan(Date.now());
  });
});
