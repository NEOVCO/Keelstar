import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, error: message, code }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof Error) {
    if (err.name === "AuthenticationError") {
      return apiError(err.message, 401, "UNAUTHENTICATED");
    }
    if (err.name === "AuthorizationError") {
      return apiError(err.message, 403, "FORBIDDEN");
    }
    return apiError(err.message, 500, "INTERNAL_ERROR");
  }
  return apiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
}
