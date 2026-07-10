import { describe, expect, it } from "vitest";
import {
  parseStoredCcEmails,
  resolveOutboundCc,
  resolveVendorOutboundCc,
  withStoredCc,
} from "@/lib/email/outboundCc";

describe("outboundCc", () => {
  it("returns sender email when ccMe is true", () => {
    expect(resolveOutboundCc(true, "sender@example.com")).toEqual(["sender@example.com"]);
    expect(resolveOutboundCc(false, "sender@example.com")).toBeUndefined();
  });

  it("reads stored cc from workflow metadata", () => {
    expect(parseStoredCcEmails({ cc_sender_email: "ops@example.com" })).toEqual(["ops@example.com"]);
    expect(parseStoredCcEmails({ cc_emails: ["a@example.com", "b@example.com"] })).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("prefers explicit ccMe over stored metadata", () => {
    expect(
      resolveVendorOutboundCc({ cc_sender_email: "old@example.com" }, { ccMe: true }, "new@example.com")
    ).toEqual(["new@example.com"]);
  });

  it("persists cc on workflow metadata when opted in", () => {
    expect(withStoredCc({ message: "hi" }, true, "me@example.com")).toEqual({
      message: "hi",
      cc_emails: ["me@example.com"],
      cc_sender_email: "me@example.com",
    });
  });
});
