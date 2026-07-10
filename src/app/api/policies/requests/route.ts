import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createPolicyRequest, sendPolicyRequest } from "@/lib/policies/createRequest";
import { uploadPolicyDocument } from "@/lib/policies/uploadPolicy";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const sendImmediately = formData.get("sendImmediately") !== "false";
      const ccMe = formData.get("ccMe") === "true";
      const vendorId = formData.get("vendorId") as string;
      const policyTitle = formData.get("policyTitle") as string;
      const policyVersion = (formData.get("policyVersion") as string) || undefined;
      const dueDate = (formData.get("dueDate") as string) || undefined;
      const message = (formData.get("message") as string) || undefined;
      const recipientEmail = (formData.get("recipientEmail") as string) || undefined;

      if (!vendorId || !policyTitle) {
        return apiError("vendorId and policyTitle are required", 400);
      }

      const result = await createPolicyRequest({
        vendorId,
        policyTitle,
        policyVersion,
        dueDate,
        message,
        recipientEmail,
      });

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadPolicyDocument(result.workflow.id, {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: buffer.length,
          buffer,
        });
      } else if (sendImmediately) {
        return apiError("Policy document file is required before sending", 400);
      }

      if (sendImmediately) {
        const sendResult = await sendPolicyRequest(result.workflow.id, { ccMe });
        return apiSuccess({
          workflow: result.workflow,
          document: result.document,
          magicLinkUrl: sendResult.magicLinkUrl,
        });
      }

      return apiSuccess(result);
    }

    const body = await request.json();
    const { sendImmediately = false, ccMe, ...input } = body;
    const result = await createPolicyRequest(input);

    if (sendImmediately) {
      const sendResult = await sendPolicyRequest(result.workflow.id, { ccMe });
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
