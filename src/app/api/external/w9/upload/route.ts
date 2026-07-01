import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { uploadExternalW9 } from "@/lib/w9/uploadExternal";
import { rateLimit } from "@/lib/errors/rate-limit";
import { apiSuccess, apiError, handleApiError } from "@/lib/errors/api";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(request, 5, 60_000);
    if (!limit.allowed) return apiError("Too many requests", 429);

    const formData = await request.formData();
    const token = formData.get("token") as string;
    const file = formData.get("file") as File;

    if (!token || !file) return apiError("Token and file required", 400);

    const validation = await validateMagicLink(token);
    if (!validation.valid) return apiError("Invalid or expired link", 403);

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadExternalW9(token, {
      filename: file.name,
      mimeType: file.type,
      sizeBytes: buffer.length,
      buffer,
    });

    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
