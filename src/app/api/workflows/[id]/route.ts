import { z } from "zod";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getWorkflow, updateWorkflow, cancelWorkflow } from "@/lib/workflow/createWorkflow";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.string().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
  cancel: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
    const workflow = await getWorkflow(ctx.organization.id, params.id);
    return apiSuccess({ workflow });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
    const body = patchSchema.parse(await request.json());

    if (body.cancel) {
      await cancelWorkflow(ctx.organization.id, ctx.user.id, params.id);
      return apiSuccess({ cancelled: true });
    }

    const workflow = await updateWorkflow(ctx.organization.id, ctx.user.id, params.id, {
      title: body.title,
      status: body.status,
      dueDate: body.dueDate,
      metadata: body.metadata,
    });
    return apiSuccess({ workflow });
  } catch (err) {
    return handleApiError(err);
  }
}
