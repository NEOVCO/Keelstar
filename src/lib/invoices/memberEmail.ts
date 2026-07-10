import { createServiceClient } from "@/lib/supabase/service";

export async function getMemberEmail(
  organizationId: string,
  memberId: string
): Promise<string | null> {
  const supabase = createServiceClient();
  const { data: member } = await supabase
    .from("organization_members")
    .select("user_id, invited_email")
    .eq("id", memberId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!member) return null;
  if (member.invited_email) return member.invited_email;

  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(member.user_id);
  return user?.email ?? null;
}

export async function getMemberDisplayName(
  organizationId: string,
  memberId: string
): Promise<string> {
  const email = await getMemberEmail(organizationId, memberId);
  return email ?? "Team member";
}
