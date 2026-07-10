import { handleApiError, apiSuccess } from "@/lib/errors/api";
import { acknowledgePolicyExternal } from "@/lib/policies/acknowledgeExternal";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, acknowledgedName, agreed } = body;

    if (!token) throw new Error("Token is required");

    const result = await acknowledgePolicyExternal(token, {
      acknowledgedName,
      agreed,
    });

    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
