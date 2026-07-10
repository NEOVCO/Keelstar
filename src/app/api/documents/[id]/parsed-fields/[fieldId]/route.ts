import { z } from "zod";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { overrideParsedField } from "@/lib/documents/extraction";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

const patchFieldSchema = z.object({
  value: z.string().max(5000),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const ctx = await requirePermission(PERMISSIONS.DOCUMENTS_UPDATE);
    const body = patchFieldSchema.parse(await request.json());
    await overrideParsedField(params.fieldId, body.value, ctx.organization.id, ctx.user.id);
    return apiSuccess({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
