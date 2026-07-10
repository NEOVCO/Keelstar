import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createTrainingRecord } from "@/lib/training/createRecord";
import { uploadTrainingCertificate } from "@/lib/training/uploadCertificate";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const vendorId = formData.get("vendorId") as string;
      const courseName = formData.get("courseName") as string;
      const provider = (formData.get("provider") as string) || undefined;
      const notes = (formData.get("notes") as string) || undefined;

      if (!vendorId || !courseName) {
        return apiError("vendorId and courseName are required", 400);
      }

      const result = await createTrainingRecord({ vendorId, courseName, provider, notes });

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadTrainingCertificate(result.workflow.id, {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: buffer.length,
          buffer,
        });
      }

      return apiSuccess(result);
    }

    const body = await request.json();
    const result = await createTrainingRecord(body);
    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
