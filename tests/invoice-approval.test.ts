import { describe, expect, it } from "vitest";
import { createInvoiceSchema } from "@/lib/invoices/createInvoice";
import {
  INVOICE_WORKFLOW_TYPE,
  INVOICE_ENTITLEMENT,
  INVOICE_REQUIRED_FIELDS,
  INVOICE_FIELD_KEYS,
  defaultInvoiceApprovalDueDate,
} from "@/lib/invoices/constants";

describe("invoice approval module", () => {
  it("exports stable workflow constants", () => {
    expect(INVOICE_WORKFLOW_TYPE).toBe("invoice_approval");
    expect(INVOICE_ENTITLEMENT).toBe("invoice_approval");
    expect(INVOICE_REQUIRED_FIELDS).toContain("vendor_name");
    expect(INVOICE_REQUIRED_FIELDS).toContain("invoice_amount");
    expect(INVOICE_FIELD_KEYS).toContain("invoice_number");
  });

  it("validates create invoice input", () => {
    const parsed = createInvoiceSchema.parse({
      vendorName: "Acme Supplies",
      approverMemberId: "550e8400-e29b-41d4-a716-446655440000",
      invoiceNumber: "INV-1001",
    });
    expect(parsed.vendorName).toBe("Acme Supplies");
    expect(parsed.invoiceNumber).toBe("INV-1001");
  });

  it("defaults approval due date in the future", () => {
    const due = defaultInvoiceApprovalDueDate();
    expect(due.getTime()).toBeGreaterThan(Date.now());
  });
});
