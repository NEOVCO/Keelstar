import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createBillingPortalSession } from "@/lib/stripe/checkout";
import { apiSuccess, handleApiError, apiError } from "@/lib/errors/api";

export async function POST() {
  try {
    const ctx = await requirePermission(PERMISSIONS.BILLING_MANAGE);
    if (!ctx.organization.stripe_customer_id) {
      return apiError("No billing account yet. Subscribe to a module first.", 400);
    }

    const session = await createBillingPortalSession(ctx.organization.stripe_customer_id);
    return apiSuccess({ url: session.url });
  } catch (err) {
    return handleApiError(err);
  }
}
