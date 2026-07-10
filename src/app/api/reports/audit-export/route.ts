import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { buildAuditExportCsv } from "@/lib/reports/exports";
import { handleApiError } from "@/lib/errors/api";

export async function GET(request: Request) {
  try {
    const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const csv = await buildAuditExportCsv(ctx.organization.id, { from, to });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="audit-export.csv"',
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
