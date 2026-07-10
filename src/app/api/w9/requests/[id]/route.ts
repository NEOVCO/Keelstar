import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { sendW9RequestEmail } from "@/lib/w9/sendRequest";
import { resendW9Request, revokeW9MagicLink } from "@/lib/w9/resendRevoke";
import { approveW9Document, rejectW9Document } from "@/lib/w9/review";
import { exportW9Evidence } from "@/lib/w9/exportEvidence";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ccMe, ...payload } = await request.json();
    const workflowId = params.id;

    switch (action) {
      case "send":
        return apiSuccess(await sendW9RequestEmail(workflowId, { ccMe }));
      case "resend":
        return apiSuccess(await resendW9Request(workflowId, { ccMe }));
      case "revoke":
        return apiSuccess(await revokeW9MagicLink(workflowId));
      case "approve":
        return apiSuccess(await approveW9Document(workflowId, payload.notes));
      case "reject":
        return apiSuccess(await rejectW9Document(workflowId, payload));
      case "export":
        const csv = await exportW9Evidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="w9-evidence-${workflowId}.csv"`,
          },
        });
      default:
        return apiError("Unknown action", 400);
    }
  } catch (err) {
    return handleApiError(err);
  }
}

const rejectSchema = z.object({
  action: z.literal("reject"),
  reason: z.string().min(1),
  resendLink: z.boolean().optional(),
});
