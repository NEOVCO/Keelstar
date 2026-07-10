import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { runMonitorById } from "@/lib/monitoring/runMonitors";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requirePermission(PERMISSIONS.MONITORS_MANAGE);
    const result = await runMonitorById(params.id, ctx.organization.id);
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
