import { inviteMemberSchema } from "@/lib/validation/schemas";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  listOrganizationMembers,
  listPendingInvitations,
  inviteOrganizationMember,
} from "@/lib/organizations/members";
import { apiSuccess, handleApiError, apiError } from "@/lib/errors/api";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.MEMBERS_INVITE);
    const [members, invitations] = await Promise.all([
      listOrganizationMembers(ctx.organization.id),
      listPendingInvitations(ctx.organization.id),
    ]);
    return apiSuccess({ members, invitations });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = inviteMemberSchema.parse(await request.json());
    const result = await inviteOrganizationMember(body);
    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402, "USAGE_LIMIT");
    }
    return handleApiError(err);
  }
}
