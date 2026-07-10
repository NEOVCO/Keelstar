import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createW9Request, sendW9Request } from "@/lib/w9/createRequest";
import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  vendorId: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  message: z.string().optional(),
  requesterName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  replaceExisting: z.boolean().optional(),
  sendImmediately: z.boolean().default(true),
  ccMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const { sendImmediately, ccMe, ...requestInput } = body;
    const result = await createW9Request(requestInput);

    if (sendImmediately) {
      const sendResult = await sendW9Request(result.workflow.id, { ccMe });
      return apiSuccess({
        workflow: result.workflow,
        document: result.document,
        magicLinkUrl: sendResult.magicLinkUrl,
      });
    }

    return apiSuccess({ workflow: result.workflow, document: result.document });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
