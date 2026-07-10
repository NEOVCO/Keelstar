import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { buildAuditExportPdf } from "@/lib/reports/auditPdf";
import { handleApiError } from "@/lib/errors/api";

export async function GET(request: Request) {
  try {
    const ctx = await requirePermission(PERMISSIONS.AUDIT_VIEW);
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;

    const pdf = await buildAuditExportPdf(ctx.organization.id, { from, to });
    const dateStamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="audit-trail-${dateStamp}.pdf"`,
        "Content-Length": String(pdf.length),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
