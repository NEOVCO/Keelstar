import { z } from "zod";
import { VENDOR_RECORD_TYPES } from "@/lib/vendors/types";

export const VENDOR_IMPORT_MAX_ROWS = 200;

export const VENDOR_IMPORT_CSV_HEADERS =
  "name,type,email,phone,first_name,last_name,npi";

const recordTypeSchema = z.enum(VENDOR_RECORD_TYPES);

const rowSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  recordType: recordTypeSchema.default("company"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  firstName: z.string().max(100).optional().or(z.literal("")),
  lastName: z.string().max(100).optional().or(z.literal("")),
  npi: z.string().max(20).optional().or(z.literal("")),
});

export type VendorImportRow = z.infer<typeof rowSchema>;

export type ParsedVendorImportRow = {
  rowNumber: number;
  data?: VendorImportRow;
  error?: string;
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseRecordType(raw: string): z.infer<typeof recordTypeSchema> {
  const value = raw.trim().toLowerCase();
  if (!value) return "company";
  if (value === "person") return "individual";
  if ((VENDOR_RECORD_TYPES as readonly string[]).includes(value)) {
    return value as z.infer<typeof recordTypeSchema>;
  }
  return "company";
}

export function buildVendorImportTemplate(options?: { workforceOnly?: boolean }): string {
  if (options?.workforceOnly) {
    return [
      VENDOR_IMPORT_CSV_HEADERS,
      "Jane Smith,employee,jane.smith@example.com,,Jane,Smith,1234567893",
      "Alex Rivera,contractor,alex.rivera@example.com,,Alex,Rivera,",
    ].join("\n");
  }
  return [
    VENDOR_IMPORT_CSV_HEADERS,
    "Acme Supplies LLC,company,billing@acme.example,(555) 555-0100,,,",
    "Jane Smith,individual,jane.smith@example.com,,Jane,Smith,1234567893",
    "Sunrise Retail LLC,tenant,leasing@sunrise.example,(555) 555-0200,,,",
    "Rivera Consulting LLC,contractor,ops@rivera.example,,,,",
  ].join("\n");
}

export function parseVendorImportCsv(text: string): ParsedVendorImportRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headerCells = parseCsvLine(lines[0]).map(normalizeHeader);
  const hasHeader = headerCells.includes("name");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const col = (key: string, fallback: number) => {
    const idx = hasHeader ? headerCells.indexOf(key) : -1;
    return idx >= 0 ? idx : fallback;
  };

  const nameIdx = col("name", 0);
  const typeIdx = col("type", 1);
  const emailIdx = col("email", 2);
  const phoneIdx = col("phone", 3);
  const firstNameIdx = col("first_name", 4);
  const lastNameIdx = col("last_name", 5);
  const npiIdx = col("npi", 6);

  const parsed: ParsedVendorImportRow[] = [];

  for (let i = 0; i < dataLines.length && parsed.length < VENDOR_IMPORT_MAX_ROWS; i++) {
    const cols = parseCsvLine(dataLines[i]);
    if (!cols.some((column) => column.trim())) continue;

    const rowNumber = hasHeader ? i + 2 : i + 1;
    const raw = {
      name: (cols[nameIdx] ?? cols[0] ?? "").trim(),
      recordType: parseRecordType(cols[typeIdx] ?? cols[1] ?? ""),
      email: (cols[emailIdx] ?? "").trim(),
      phone: (cols[phoneIdx] ?? "").trim(),
      firstName: (cols[firstNameIdx] ?? "").trim(),
      lastName: (cols[lastNameIdx] ?? "").trim(),
      npi: (cols[npiIdx] ?? "").trim(),
    };

    const result = rowSchema.safeParse(raw);
    if (result.success) {
      parsed.push({ rowNumber, data: result.data });
    } else {
      const message = result.error.issues.map((issue) => issue.message).join("; ");
      parsed.push({ rowNumber, error: message });
    }
  }

  return parsed;
}
