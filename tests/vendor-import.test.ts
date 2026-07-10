import { describe, expect, it } from "vitest";
import { buildVendorImportTemplate, parseVendorImportCsv } from "@/lib/vendors/importCsv";

describe("parseVendorImportCsv", () => {
  it("parses legacy headered CSV rows without type column", () => {
    const rows = parseVendorImportCsv(
      "name,email,phone\nAcme LLC,billing@acme.example,555-0100\nBeta Co,,"
    );
    expect(rows).toHaveLength(2);
    expect(rows[0].data).toEqual({
      name: "Acme LLC",
      recordType: "company",
      email: "billing@acme.example",
      phone: "555-0100",
      firstName: "",
      lastName: "",
      npi: "",
    });
    expect(rows[1].data).toEqual({
      name: "Beta Co",
      recordType: "company",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      npi: "",
    });
  });

  it("parses individual rows with person fields", () => {
    const rows = parseVendorImportCsv(
      "name,type,email,phone,first_name,last_name,npi\nJane Smith,individual,jane@example.com,,Jane,Smith,1234567893"
    );
    expect(rows[0].data).toEqual({
      name: "Jane Smith",
      recordType: "individual",
      email: "jane@example.com",
      phone: "",
      firstName: "Jane",
      lastName: "Smith",
      npi: "1234567893",
    });
  });

  it("accepts person as alias for individual", () => {
    const rows = parseVendorImportCsv("name,type\nAlex Lee,person");
    expect(rows[0].data?.recordType).toBe("individual");
  });

  it("flags invalid email rows", () => {
    const rows = parseVendorImportCsv("name,email\nBad Vendor,not-an-email");
    expect(rows[0].error).toMatch(/Invalid email/i);
  });

  it("builds a downloadable template with company and individual examples", () => {
    const template = buildVendorImportTemplate();
    expect(template).toContain("name,type,email,phone,first_name,last_name,npi");
    expect(template).toContain("Acme Supplies LLC,company");
    expect(template).toContain("Jane Smith,individual");
  });
});
