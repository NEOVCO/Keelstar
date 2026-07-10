import { describe, expect, it } from "vitest";
import { buildVendorImportTemplate } from "@/lib/vendors/importCsv";
import { filterWorkforceVendors } from "@/lib/vendors/workforce";

describe("workforce people roster", () => {
  it("builds a workforce-only CSV template", () => {
    const template = buildVendorImportTemplate({ workforceOnly: true });
    expect(template).toContain("Jane Smith,employee");
    expect(template).toContain("Alex Rivera,contractor");
    expect(template).not.toContain(",company,");
  });

  it("filters directory rows to employees and contractors", () => {
    const rows = filterWorkforceVendors([
      { metadata: { record_type: "employee" } },
      { metadata: { record_type: "tenant" } },
      { metadata: { record_type: "contractor" } },
      { metadata: {} },
    ]);
    expect(rows).toHaveLength(2);
  });
});
