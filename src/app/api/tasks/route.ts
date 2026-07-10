import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { listTasks } from "@/lib/workflow/tasks";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function GET(request: Request) {
  try {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const status = statusParam ? statusParam.split(",") : ["pending", "in_progress", "overdue"];
    const tasks = await listTasks(ctx.organization.id, { status });
    return apiSuccess({ tasks });
  } catch (err) {
    return handleApiError(err);
  }
}
