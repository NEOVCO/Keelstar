import { handleApiError, apiSuccess } from "@/lib/errors/api";
import { uploadVendorPacketItem } from "@/lib/vendor-packets/uploadExternal";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    const itemKey = formData.get("itemKey") as string;
    const file = formData.get("file") as File;

    if (!token || !itemKey || !file) {
      return apiSuccess({ success: false, error: "token, itemKey, and file required" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadVendorPacketItem(token, itemKey, {
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
