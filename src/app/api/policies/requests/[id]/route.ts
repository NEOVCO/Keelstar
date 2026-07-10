import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { sendPolicyRequestEmail } from "@/lib/policies/sendRequest";
import { resendPolicyRequest, revokePolicyMagicLink } from "@/lib/policies/resendRevoke";
import { uploadPolicyDocument } from "@/lib/policies/uploadPolicy";
import { exportPolicyEvidence } from "@/lib/policies/exportEvidence";
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
      const result = await uploadPolicyDocument(workflowId, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ccMe, ...payload } = await request.json();

    switch (action) {
      case "send":
        return apiSuccess(await sendPolicyRequestEmail(workflowId, { ccMe }));
      case "resend":
        return apiSuccess(await resendPolicyRequest(workflowId, { ccMe }));
      case "revoke":
        return apiSuccess(await revokePolicyMagicLink(workflowId));
      case "export": {
        const csv = await exportPolicyEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="policy-evidence-${workflowId}.csv"`,
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
