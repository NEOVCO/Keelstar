import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createVendorPacket, sendVendorPacket } from "@/lib/vendor-packets/createPacket";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sendImmediately = true, ...input } = body;
    const result = await createVendorPacket(input);

    if (sendImmediately) {
      const sendResult = await sendVendorPacket(result.workflow.id);
      return apiSuccess({
        workflow: result.workflow,
        portalUrl: sendResult.portalUrl,
        checklist: result.checklist,
      });
    }

    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
