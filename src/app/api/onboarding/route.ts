import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUserProfile, setOnboardingCompleted } from "@/lib/onboarding/profile";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateUserProfile(user.id);
  return NextResponse.json({
    success: true,
    data: { onboardingCompleted: profile.onboarding_completed },
  });
}

const patchSchema = z.object({
  onboardingCompleted: z.boolean(),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const profile = await setOnboardingCompleted(user.id, parsed.data.onboardingCompleted);
  return NextResponse.json({
    success: true,
    data: { onboardingCompleted: profile.onboarding_completed },
  });
}
