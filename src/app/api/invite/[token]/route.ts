import { getInvitationByToken } from "@/lib/organizations/members";
import { apiSuccess, apiError } from "@/lib/errors/api";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const invitation = await getInvitationByToken(params.token);
  if (!invitation) {
    return apiError("Invitation is invalid or expired", 404);
  }

  const orgRow = invitation.organizations as { name: string } | { name: string }[] | null;
  const organizationName = Array.isArray(orgRow) ? orgRow[0]?.name : orgRow?.name;

  return apiSuccess({
    email: invitation.email,
    organizationName: organizationName ?? "Organization",
    expiresAt: invitation.expires_at,
  });
}
