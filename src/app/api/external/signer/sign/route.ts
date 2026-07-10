import { handleApiError, apiSuccess } from "@/lib/errors/api";
import { signDocumentExternal } from "@/lib/signer/signExternal";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, signedName, agreed } = await request.json();
    const result = await signDocumentExternal(token, { signedName, agreed });
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
