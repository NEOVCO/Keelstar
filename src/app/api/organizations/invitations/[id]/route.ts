import { revokeInvitation } from "@/lib/organizations/members";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await revokeInvitation(params.id);
    return apiSuccess({ revoked: true });
  } catch (err) {
    return handleApiError(err);
  }
}
