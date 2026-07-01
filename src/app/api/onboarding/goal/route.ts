import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requireOrganization } from "@/lib/tenant/context";
import { parseOrgOnboardingSettings } from "@/lib/onboarding/org-settings";
import { getModuleBySlug } from "@/lib/modules/modules";
import { createAuditLog } from "@/lib/audit/createAuditLog";

const schema = z.object({
  firstGoal: z.string().min(1).nullable(),
});

export async function POST(request: Request) {
  try {
    const ctx = await requireOrganization();
    const body = schema.parse(await request.json());

    if (body.firstGoal && !getModuleBySlug(body.firstGoal)) {
      return NextResponse.json({ success: false, error: "Unknown module" }, { status: 400 });
    }

    const service = createServiceClient();
    const current = parseOrgOnboardingSettings(ctx.organization.settings);

    const settings = {
      ...(ctx.organization.settings ?? {}),
      ...current,
      first_goal: body.firstGoal,
    };

    const { error } = await service
      .from("organizations")
      .update({ settings })
      .eq("id", ctx.organization.id);

    if (error) throw error;

    if (body.firstGoal) {
      await createAuditLog({
        organizationId: ctx.organization.id,
        actorType: "user",
        actorId: ctx.user.id,
        actorEmail: ctx.user.email,
        action: "onboarding.goal_selected",
        targetType: "organization",
        targetId: ctx.organization.id,
        metadata: { firstGoal: body.firstGoal },
      });
    }

    return NextResponse.json({ success: true, data: { firstGoal: body.firstGoal } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save goal";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
