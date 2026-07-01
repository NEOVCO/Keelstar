import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createVendor } from "@/lib/vendors";
import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

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
