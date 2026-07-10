import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { sendCoiRequestEmail } from "@/lib/coi/sendRequest";
import { resendCoiRequest, revokeCoiMagicLink } from "@/lib/coi/resendRevoke";
import { approveCoi, rejectCoi } from "@/lib/coi/review";
import { saveCoiFields } from "@/lib/coi/saveFields";
import { exportCoiEvidence } from "@/lib/coi/exportEvidence";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ccMe, ...payload } = await request.json();
    const workflowId = params.id;

    switch (action) {
      case "send":
        return apiSuccess(await sendCoiRequestEmail(workflowId, { ccMe }));
      case "resend":
        return apiSuccess(await resendCoiRequest(workflowId, { ccMe }));
      case "revoke":
        return apiSuccess(await revokeCoiMagicLink(workflowId));
      case "save_fields":
        return apiSuccess(await saveCoiFields({ workflowId, fields: payload.fields ?? {} }));
      case "approve":
        return apiSuccess(await approveCoi(workflowId, payload.notes));
      case "reject":
        return apiSuccess(await rejectCoi(workflowId, payload));
      case "export": {
        const csv = await exportCoiEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="coi-evidence-${workflowId}.csv"`,
          },
        });
      }
      default:
        return apiError("Unknown action", 400);
    }
  } catch (err) {
    return handleApiError(err);
  }
}
