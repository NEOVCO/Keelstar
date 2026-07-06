import { z } from "zod";
import { SUBJECT_TYPES } from "./constants";

const MAX_ROWS = 200;

const rowSchema = z.object({
  subject_type: z.enum(SUBJECT_TYPES),
  display_name: z.string().min(1).max(300),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  organization_name: z.string().max(300).optional(),
  npi: z.string().max(20).optional(),
  vendor_name: z.string().max(200).optional(),
});

export type BulkImportRow = z.infer<typeof rowSchema>;

export const BULK_IMPORT_CSV_HEADERS =
  "subject_type,display_name,first_name,last_name,organization_name,npi,vendor_name";

export const BULK_IMPORT_MAX_ROWS = MAX_ROWS;

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

export function parseBulkImportCsv(text: string): BulkImportRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("display_name") || first.startsWith("subject_type");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: BulkImportRow[] = [];
  const validTypes = SUBJECT_TYPES as readonly string[];

  for (const line of dataLines) {
    const cols = parseCsvLine(line);
    if (!cols.length) continue;

    const col0 = (cols[0] ?? "").trim();
    const col0Lower = col0.toLowerCase();
    let subjectType: BulkImportRow["subject_type"];
    let displayName: string;

    if (validTypes.includes(col0Lower) && cols[1]?.trim()) {
      subjectType = col0Lower as BulkImportRow["subject_type"];
      displayName = cols[1].trim();
    } else {
      subjectType = "person";
      displayName = col0;
    }

    if (!displayName) continue;

    const parsed = rowSchema.safeParse({
      subject_type: subjectType,
      display_name: displayName,
      first_name: cols[2]?.trim() || undefined,
      last_name: cols[3]?.trim() || undefined,
      organization_name: cols[4]?.trim() || undefined,
      npi: cols[5]?.trim() || undefined,
      vendor_name: cols[6]?.trim() || undefined,
    });

    if (parsed.success) rows.push(parsed.data);
  }

  return rows.slice(0, MAX_ROWS);
}
