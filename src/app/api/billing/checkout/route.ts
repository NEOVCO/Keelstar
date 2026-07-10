import { z } from "zod";
import { requireOrganization } from "@/lib/tenant/context";
import { createModuleCheckoutSession, createBillingPortalSession } from "@/lib/stripe/checkout";
import { apiSuccess, handleApiError, apiError } from "@/lib/errors/api";

const schema = z.object({
  productKey: z.string().min(1),
  interval: z.enum(["month", "year"]),
});

export async function POST(request: Request) {
  try {
    const ctx = await requireOrganization();
    const body = schema.parse(await request.json());

    const session = await createModuleCheckoutSession({
      organizationId: ctx.organization.id,
      organizationName: ctx.organization.name,
      userEmail: ctx.user.email,
      productKey: body.productKey,
      interval: body.interval,
    });

    return apiSuccess({ url: session.url });
  } catch (err) {
    return handleApiError(err);
  }
}
