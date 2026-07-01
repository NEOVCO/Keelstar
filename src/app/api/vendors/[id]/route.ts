import { handleApiError, apiSuccess } from "@/lib/errors/api";
import { updateVendor, archiveVendor } from "@/lib/vendors";
import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = schema.parse(await request.json());
    const vendor = await updateVendor(params.id, body);
    return apiSuccess({ vendor });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await archiveVendor(params.id);
    return apiSuccess({ vendor });
  } catch (err) {
    return handleApiError(err);
  }
}
