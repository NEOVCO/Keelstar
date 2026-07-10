import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createVendor, listVendors } from "@/lib/vendors";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  recordType: z.enum(["company", "individual", "tenant", "contractor", "employee"]).optional().default("company"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  npi: z.string().optional(),
  registerForScreening: z.boolean().optional(),
});

export async function GET() {
  try {
    await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
    const vendors = await listVendors();
    return apiSuccess({
      vendors: vendors.map((v) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        status: v.status,
        metadata: v.metadata,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const vendor = await createVendor(body);
    return apiSuccess({ vendor });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
