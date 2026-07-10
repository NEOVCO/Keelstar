import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { uploadContractRiskDocument } from "@/lib/contracts-risk/uploadContract";
import { runContractRiskScan } from "@/lib/contracts-risk/scanContract";
import { approveRiskScan, rejectRiskScan, cancelRiskScan } from "@/lib/contracts-risk/review";
import { exportContractRiskEvidence } from "@/lib/contracts-risk/exportEvidence";
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
      const result = await uploadContractRiskDocument(workflowId, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ...payload } = await request.json();

    switch (action) {
      case "scan":
        return apiSuccess(await runContractRiskScan(workflowId));
      case "approve":
        return apiSuccess(await approveRiskScan(workflowId, payload.notes));
      case "reject":
        return apiSuccess(await rejectRiskScan(workflowId, payload.reason));
      case "cancel":
        return apiSuccess(await cancelRiskScan(workflowId, payload.reason));
      case "export": {
        const csv = await exportContractRiskEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="contract-risk-evidence-${workflowId}.csv"`,
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
