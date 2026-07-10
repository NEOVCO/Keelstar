import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { slugify } from "@/lib/utils";
import { createOrganizationSchema } from "@/lib/validation/schemas";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { setActiveOrganization } from "@/lib/tenant/context";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = createOrganizationSchema.parse(await request.json());
    const service = createServiceClient();

    let slug = slugify(body.name);
    const { data: existing } = await service.from("organizations").select("id").eq("slug", slug).maybeSingle();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const { data: org, error: orgError } = await service
      .from("organizations")
      .insert({ name: body.name, slug })
      .select("id")
      .single();

    if (orgError) throw orgError;

    const { data: member, error: memberError } = await service
      .from("organization_members")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        invited_email: user.email,
        status: "active",
      })
      .select("id")
      .single();

    if (memberError) throw memberError;

    const { data: ownerRole } = await service.from("roles").select("id").eq("key", "owner").single();
    if (ownerRole) {
      await service.from("member_roles").insert({
        organization_id: org.id,
        member_id: member.id,
        role_id: ownerRole.id,
        assigned_by: user.id,
      });
    }

    const { data: products } = await service.from("products").select("id");
    if (products?.length) {
      await service.from("organization_entitlements").insert(
        products.map((p) => ({
          organization_id: org.id,
          product_id: p.id,
          is_enabled: false,
          source: "trial",
        }))
      );
    }

    await createAuditLog({
      organizationId: org.id,
      actorType: "user",
      actorId: user.id,
      actorEmail: user.email,
      action: "organization.created",
      targetType: "organization",
      targetId: org.id,
      metadata: { name: body.name },
    });

    await setActiveOrganization(org.id);

    return apiSuccess({ organizationId: org.id, slug });
  } catch (err) {
    return handleApiError(err);
  }
}
