import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { markNotificationRead } from "@/lib/notifications/inbox";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await requirePermission(PERMISSIONS.NOTIFICATIONS_VIEW);
    if (!ctx.user.email) return apiSuccess({ ok: true });

    await markNotificationRead(ctx.organization.id, params.id, ctx.user.email);
    return apiSuccess({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
