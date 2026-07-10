import { describe, expect, it } from "vitest";

// Mirror the template keys used by vendor packet emails — must exist in sendEmail TEMPLATES.
const VENDOR_PACKET_TEMPLATE_KEYS = [
  "vendor-packet-portal-request",
  "vendor-packet-reminder",
  "vendor-packet-overdue",
  "vendor-packet-item-uploaded",
  "vendor-packet-complete",
] as const;

describe("vendor packet email templates", () => {
  it("registers all vendor packet template keys in sendEmail", async () => {
    const { sendEmail } = await import("@/lib/email/sendEmail");
    // sendEmail imports TEMPLATES internally; smoke-test via dynamic import of module
    // and a lightweight render by calling sendEmail's dependency — we test keys via file content.
    const source = await import("fs/promises").then((fs) =>
      fs.readFile(new URL("../src/lib/email/sendEmail.ts", import.meta.url), "utf8")
    );
    for (const key of VENDOR_PACKET_TEMPLATE_KEYS) {
      expect(source).toContain(`"${key}"`);
    }
    expect(sendEmail).toBeTypeOf("function");
  });
});
