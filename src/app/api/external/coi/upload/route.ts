import { handleApiError, apiSuccess } from "@/lib/errors/api";
import { uploadExternalCoi } from "@/lib/coi/uploadExternal";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    const file = formData.get("file") as File;

    if (!token || !file) {
      throw new Error("Token and file are required");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadExternalCoi(token, {
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
      buffer,
    });

    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
