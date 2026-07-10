import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { completeTask, getTask } from "@/lib/workflow/tasks";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
    const task = await getTask(ctx.organization.id, params.id);
    return apiSuccess({ task });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const result = await completeTask({ taskId: params.id, metadata: body.metadata });
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
