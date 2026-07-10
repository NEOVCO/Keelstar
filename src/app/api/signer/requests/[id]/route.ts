import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { sendSignerRequestEmail } from "@/lib/signer/sendRequest";
import { resendSignerRequest, revokeSignerMagicLink } from "@/lib/signer/resendRevoke";
import { uploadSignerDocument } from "@/lib/signer/uploadDocument";
import { exportSignerEvidence } from "@/lib/signer/exportEvidence";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const workflowId = params.id;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) return apiError("File is required", 400);

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadSignerDocument(workflowId, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ccMe } = await request.json();

    switch (action) {
      case "send":
        return apiSuccess(await sendSignerRequestEmail(workflowId, { ccMe }));
      case "resend":
        return apiSuccess(await resendSignerRequest(workflowId, { ccMe }));
      case "revoke":
        return apiSuccess(await revokeSignerMagicLink(workflowId));
      case "export": {
        const csv = await exportSignerEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="signer-evidence-${workflowId}.csv"`,
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
