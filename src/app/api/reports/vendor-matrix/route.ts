import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { buildVendorComplianceMatrixCsv } from "@/lib/reports/exports";
import { handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
    const csv = await buildVendorComplianceMatrixCsv(ctx.organization.id);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="vendor-compliance-matrix.csv"',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
