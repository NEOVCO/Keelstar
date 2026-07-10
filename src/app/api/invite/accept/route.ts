import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { acceptInvitation } from "@/lib/organizations/members";
import { setActiveOrganization } from "@/lib/tenant/context";
import { apiSuccess, handleApiError, apiError } from "@/lib/errors/api";

const schema = z.object({ token: z.string().min(16) });

export async function POST(request: Request) {
  try {
    const { token } = schema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return apiError("Sign in to accept this invitation", 401);

    const result = await acceptInvitation(token, user.id, user.email);
    await setActiveOrganization(result.organizationId);
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
