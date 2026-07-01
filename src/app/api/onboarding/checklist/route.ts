import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requireOrganization } from "@/lib/tenant/context";
import { parseOrgOnboardingSettings } from "@/lib/onboarding/org-settings";

const schema = z.object({
  dismissed: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const ctx = await requireOrganization();
    const body = schema.parse(await request.json());

    const service = createServiceClient();
    const current = parseOrgOnboardingSettings(ctx.organization.settings);

    const settings = {
      ...(ctx.organization.settings ?? {}),
      ...current,
      checklist_dismissed: body.dismissed,
    };

    const { error } = await service
      .from("organizations")
      .update({ settings })
      .eq("id", ctx.organization.id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: { dismissed: body.dismissed } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update checklist";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
