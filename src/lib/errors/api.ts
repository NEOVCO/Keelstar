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
      const code = "code" in err ? String((err as { code?: string }).code) : "FORBIDDEN";
      const status = code === "NO_ENTITLEMENT" ? 402 : 403;
      return apiError(err.message, status, code);
    }
    if (err.message.includes("Usage limit") || err.message.includes("limit reached")) {
      return apiError(err.message, 402, "USAGE_LIMIT");
    }
    return apiError(err.message, 500, "INTERNAL_ERROR");
  }
  return apiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
}
