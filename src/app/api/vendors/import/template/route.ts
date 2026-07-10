import { NextResponse } from "next/server";
import { buildVendorImportTemplate } from "@/lib/vendors/importCsv";

export async function GET() {
  const csv = buildVendorImportTemplate();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="vendor-import-template.csv"',
    },
  });
}
