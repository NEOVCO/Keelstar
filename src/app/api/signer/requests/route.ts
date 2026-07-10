import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createSignerRequest } from "@/lib/signer/createRequest";
import { sendSignerRequestEmail } from "@/lib/signer/sendRequest";
import { uploadSignerDocument } from "@/lib/signer/uploadDocument";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const sendImmediately = formData.get("sendImmediately") !== "false";
      const ccMe = formData.get("ccMe") === "true";
      const vendorId = (formData.get("vendorId") as string) || undefined;
      const signerName = (formData.get("signerName") as string) || undefined;
      const signerEmail = formData.get("signerEmail") as string;
      const documentTitle = formData.get("documentTitle") as string;
      const dueDate = (formData.get("dueDate") as string) || undefined;
      const message = (formData.get("message") as string) || undefined;

      if (!signerEmail || !documentTitle) {
        return apiError("signerEmail and documentTitle are required", 400);
      }

      const result = await createSignerRequest({
        vendorId,
        signerName,
        signerEmail,
        documentTitle,
        dueDate,
        message,
      });

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadSignerDocument(result.workflow.id, {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: buffer.length,
          buffer,
        });
      } else if (sendImmediately) {
        return apiError("Document file is required before sending", 400);
      }

      if (sendImmediately) {
        const sendResult = await sendSignerRequestEmail(result.workflow.id, { ccMe });
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
    const result = await createSignerRequest(input);

    if (sendImmediately) {
      const sendResult = await sendSignerRequestEmail(result.workflow.id, { ccMe });
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
