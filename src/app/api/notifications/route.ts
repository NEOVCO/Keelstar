import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  fetchInAppNotifications,
  markAllNotificationsRead,
} from "@/lib/notifications/inbox";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.NOTIFICATIONS_VIEW);
    if (!ctx.user.email) return apiSuccess({ notifications: [] });

    const notifications = await fetchInAppNotifications(
      ctx.organization.id,
      ctx.user.email,
      50
    );
    return apiSuccess({ notifications });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await requirePermission(PERMISSIONS.NOTIFICATIONS_VIEW);
    if (!ctx.user.email) return apiSuccess({ ok: true });

    const body = (await request.json().catch(() => ({}))) as { markAllRead?: boolean };
    if (body.markAllRead) {
      await markAllNotificationsRead(ctx.organization.id, ctx.user.email);
    }
    return apiSuccess({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
