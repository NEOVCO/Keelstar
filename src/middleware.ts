import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/app/:path*",
    "/dashboard/:path*",
    "/documents/:path*",
    "/workflows/:path*",
    "/tasks/:path*",
    "/monitors/:path*",
    "/audit/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/vendors/:path*",
    "/requests/:path*",
    "/onboarding",
    "/w9/:path*",
    "/coi/:path*",
    "/contracts/:path*",
    "/exclusions/:path*",
    "/vendor-packets/:path*",
    "/policies/:path*",
    "/training/:path*",
    "/invoices/:path*",
    "/signer/:path*",
    "/login",
    "/signup",
    "/external/:path*",
  ],
};
