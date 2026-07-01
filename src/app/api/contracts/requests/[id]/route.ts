import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { uploadContractDocument } from "@/lib/contracts/uploadContract";
import { saveContractFields } from "@/lib/contracts/saveFields";
import {
  activateContractMonitoring,
  markContractRenewed,
  markContractTerminated,
  archiveContract,
  cancelContract,
  completeContract,
} from "@/lib/contracts/review";
import { assignContractOwner } from "@/lib/contracts/assignOwner";
import { exportContractEvidence } from "@/lib/contracts/exportEvidence";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) return apiError("File required", 400);
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadContractDocument(params.id, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ...payload } = await request.json();
    const workflowId = params.id;

    switch (action) {
      case "save_fields":
        return apiSuccess(await saveContractFields({ workflowId, fields: payload.fields ?? {} }));
      case "activate":
        return apiSuccess(await activateContractMonitoring(workflowId, payload.notes));
      case "assign_owner":
        return apiSuccess(
          await assignContractOwner({ workflowId, ownerId: payload.ownerId })
        );
      case "mark_renewed":
        return apiSuccess(
          await markContractRenewed({
            workflowId,
            newRenewalDate: payload.newRenewalDate,
            notes: payload.notes,
          })
        );
      case "mark_terminated":
        return apiSuccess(await markContractTerminated(workflowId, payload.reason));
      case "archive":
        return apiSuccess(await archiveContract(workflowId));
      case "cancel":
        return apiSuccess(await cancelContract(workflowId));
      case "complete":
        return apiSuccess(await completeContract(workflowId));
      case "export": {
        const csv = await exportContractEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="contract-evidence-${workflowId}.csv"`,
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
