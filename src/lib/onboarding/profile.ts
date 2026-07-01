import { createClient } from "@/lib/supabase/server";

export type UserProfile = {
  id: string;
  user_id: string;
  onboarding_completed: boolean;
};

export async function getOrCreateUserProfile(userId: string): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("user_profiles")
    .select("id, user_id, onboarding_completed")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("user_profiles")
    .insert({ user_id: userId, onboarding_completed: false })
    .select("id, user_id, onboarding_completed")
    .single();

  if (error) {
    // Race: another request may have inserted the row
    const { data: retry } = await supabase
      .from("user_profiles")
      .select("id, user_id, onboarding_completed")
      .eq("user_id", userId)
      .single();
    if (retry) return retry;
    throw error;
  }

  return created;
}

export async function setOnboardingCompleted(userId: string, completed: boolean): Promise<UserProfile> {
  await getOrCreateUserProfile(userId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ onboarding_completed: completed })
    .eq("user_id", userId)
    .select("id, user_id, onboarding_completed")
    .single();

  if (error) throw error;
  return data;
}
