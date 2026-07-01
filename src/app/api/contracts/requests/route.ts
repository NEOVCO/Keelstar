import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createContract } from "@/lib/contracts/createContract";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createContract(body);
    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
