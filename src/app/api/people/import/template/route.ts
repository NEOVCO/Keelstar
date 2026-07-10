import { NextResponse } from "next/server";
import { buildVendorImportTemplate } from "@/lib/vendors/importCsv";

export async function GET() {
  const csv = buildVendorImportTemplate({ workforceOnly: true });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="people-import-template.csv"',
    },
  });
}
