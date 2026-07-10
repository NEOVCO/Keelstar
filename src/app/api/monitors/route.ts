import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createMonitor, listMonitors } from "@/lib/monitors/createMonitor";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.MONITORS_VIEW);
    const monitors = await listMonitors(ctx.organization.id);
    return apiSuccess({ monitors });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const monitor = await createMonitor(body);
    return apiSuccess({ monitor }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
