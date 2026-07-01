import { switchOrganizationSchema } from "@/lib/validation/schemas";
import { setActiveOrganization, requireOrganization } from "@/lib/tenant/context";
import { createServiceClient } from "@/lib/supabase/service";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function POST(request: Request) {
  try {
    const ctx = await requireOrganization();
    const { organizationId } = switchOrganizationSchema.parse(await request.json());

    const supabase = createServiceClient();
    const { data: membership } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("user_id", ctx.user.id)
      .eq("status", "active")
      .single();

    if (!membership) {
      return Response.json({ success: false, error: "Not a member of this organization" }, { status: 403 });
    }

    await setActiveOrganization(organizationId);
    return apiSuccess({ organizationId });
  } catch (err) {
    return handleApiError(err);
  }
}
