import { type NextRequest } from "next/server";
import { z } from "zod";
import { bulkCreateVendors } from "@/lib/vendors";
import { VENDOR_RECORD_TYPES } from "@/lib/vendors/types";
import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";

const vendorRowSchema = z.object({
  name: z.string().min(1),
  recordType: z.enum(VENDOR_RECORD_TYPES).optional().default("company"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  npi: z.string().optional().or(z.literal("")),
});

const schema = z.object({
  vendors: z.array(vendorRowSchema).min(1).max(200),
  registerForScreening: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const result = await bulkCreateVendors(body.vendors, {
      registerForScreening: body.registerForScreening,
    });
    return apiSuccess({
      count: result.vendors.length,
      vendorIds: result.vendors.map((v) => v.id),
      screeningRegistered: result.screeningRegistered,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    if (err instanceof Error && err.message.includes("Can import at most")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
