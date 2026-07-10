import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { hashToken } from "@/lib/magic-links/createMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { inviteMemberSchema } from "@/lib/validation/schemas";
import { inviteAcceptUrl } from "@/lib/auth/urls";

export async function listOrganizationMembers(organizationId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      user_id,
      invited_email,
      status,
      created_at,
      member_roles (roles (key, name))
    `
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listPendingInvitations(organizationId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("organization_invitations")
    .select("id, email, status, expires_at, created_at, roles (key, name)")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function inviteOrganizationMember(input: {
  email: string;
  roleKey: "admin" | "manager" | "member" | "viewer";
}) {
  const ctx = await requirePermission(PERMISSIONS.MEMBERS_INVITE);
  const data = inviteMemberSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "team_members", ctx.user.id);

  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", ctx.organization.id)
    .eq("invited_email", data.email)
    .eq("status", "active")
    .maybeSingle();

  if (existingMember) throw new Error("This person is already a member");

  const { data: existingInvite } = await supabase
    .from("organization_invitations")
    .select("id")
    .eq("organization_id", ctx.organization.id)
    .eq("email", data.email)
    .eq("status", "pending")
    .maybeSingle();

  if (existingInvite) throw new Error("An invitation is already pending for this email");

  const { data: role } = await supabase.from("roles").select("id").eq("key", data.roleKey).single();
  if (!role) throw new Error("Invalid role");

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: invitation, error } = await supabase
    .from("organization_invitations")
    .insert({
      organization_id: ctx.organization.id,
      email: data.email,
      role_id: role.id,
      invited_by: ctx.user.id,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;

  const url = inviteAcceptUrl(rawToken);

  try {
    await sendEmail({
      organizationId: ctx.organization.id,
      to: data.email,
      templateKey: "invitation",
      subject: `Join ${ctx.organization.name} on Keelstar`,
      variables: {
        organizationName: ctx.organization.name,
        inviteUrl: url,
      },
    });
  } catch {
    // Invitation record exists; email may fail without Resend
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "member.invited",
    targetType: "organization_invitation",
    targetId: invitation.id,
    metadata: { email: data.email, roleKey: data.roleKey },
  });

  return { invitationId: invitation.id, inviteUrl: url };
}

export async function revokeInvitation(invitationId: string) {
  const ctx = await requirePermission(PERMISSIONS.MEMBERS_MANAGE);
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("organization_invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId)
    .eq("organization_id", ctx.organization.id)
    .eq("status", "pending");

  if (error) throw error;
}

export async function getInvitationByToken(rawToken: string) {
  const supabase = createServiceClient();
  const tokenHash = hashToken(rawToken);

  const { data } = await supabase
    .from("organization_invitations")
    .select("id, email, status, expires_at, organization_id, role_id, organizations (name)")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!data || data.status !== "pending") return null;
  if (new Date(data.expires_at) < new Date()) return null;
  return data;
}

export async function acceptInvitation(rawToken: string, userId: string, userEmail: string) {
  const invitation = await getInvitationByToken(rawToken);
  if (!invitation) throw new Error("Invitation is invalid or expired");
  if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error("Sign in with the email address that received the invitation");
  }

  const supabase = createServiceClient();

  const { data: member, error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: invitation.organization_id,
      user_id: userId,
      invited_email: userEmail,
      status: "active",
    })
    .select("id")
    .single();

  if (memberError) throw memberError;

  await supabase.from("member_roles").insert({
    organization_id: invitation.organization_id,
    member_id: member.id,
    role_id: invitation.role_id,
    assigned_by: userId,
  });

  await supabase
    .from("organization_invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  await createAuditLog({
    organizationId: invitation.organization_id,
    actorType: "user",
    actorId: userId,
    actorEmail: userEmail,
    action: "member.invitation_accepted",
    targetType: "organization_member",
    targetId: member.id,
    metadata: { invitationId: invitation.id },
  });

  return { organizationId: invitation.organization_id, memberId: member.id };
}
