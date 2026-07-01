import { NextResponse } from "next/server";
import { runExclusionScreening } from "@/lib/exclusions/runScreening";
import { handleApiError, apiSuccess } from "@/lib/errors/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await runExclusionScreening(body);
    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
