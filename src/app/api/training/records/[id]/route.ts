import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { uploadTrainingCertificate } from "@/lib/training/uploadCertificate";
import { saveTrainingFields } from "@/lib/training/saveFields";
import {
  activateTrainingMonitoring,
  markTrainingRenewed,
  cancelTrainingRecord,
} from "@/lib/training/activateMonitoring";
import { exportTrainingEvidence } from "@/lib/training/exportEvidence";
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
      if (!file) return apiError("File required", 400);
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadTrainingCertificate(workflowId, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ...payload } = await request.json();

    switch (action) {
      case "save_fields":
        return apiSuccess(await saveTrainingFields({ workflowId, fields: payload.fields ?? {} }));
      case "activate":
        return apiSuccess(await activateTrainingMonitoring(workflowId, payload.notes));
      case "mark_renewed":
        return apiSuccess(
          await markTrainingRenewed({
            workflowId,
            newExpirationDate: payload.newExpirationDate,
            newCompletionDate: payload.newCompletionDate,
            notes: payload.notes,
          })
        );
      case "cancel":
        return apiSuccess(await cancelTrainingRecord(workflowId, payload.reason));
      case "export": {
        const csv = await exportTrainingEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="training-evidence-${workflowId}.csv"`,
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
