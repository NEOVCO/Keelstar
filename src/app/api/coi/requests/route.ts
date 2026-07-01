import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createCoiRequest, sendCoiRequest } from "@/lib/coi/createRequest";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sendImmediately = true, ...input } = body;
    const result = await createCoiRequest(input);

    if (sendImmediately) {
      const sendResult = await sendCoiRequest(result.workflow.id);
      return apiSuccess({
        workflow: result.workflow,
        document: result.document,
        magicLinkUrl: sendResult.magicLinkUrl,
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
