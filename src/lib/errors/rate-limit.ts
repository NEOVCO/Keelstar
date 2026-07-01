import { type NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  limit = 60,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - entry.count };
}
