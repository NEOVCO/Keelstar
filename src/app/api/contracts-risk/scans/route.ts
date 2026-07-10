import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createRiskScan } from "@/lib/contracts-risk/createScan";
import { uploadContractRiskDocument } from "@/lib/contracts-risk/uploadContract";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const contractName = formData.get("contractName") as string;
      const counterparty = (formData.get("counterparty") as string) || undefined;
      const vendorId = (formData.get("vendorId") as string) || undefined;
      const notes = (formData.get("notes") as string) || undefined;
      const scanImmediately = formData.get("scanImmediately") !== "false";

      if (!contractName) {
        return apiError("contractName is required", 400);
      }

      const result = await createRiskScan({ contractName, counterparty, vendorId, notes });

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const scanResult = await uploadContractRiskDocument(
          result.workflow.id,
          {
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: buffer.length,
            buffer,
          },
          { runScan: scanImmediately }
        );
        return apiSuccess({ ...result, scan: scanResult });
      }

      return apiSuccess(result);
    }

    const body = await request.json();
    const result = await createRiskScan(body);
    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
