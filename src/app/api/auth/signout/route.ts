import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { ACTIVE_ORG_COOKIE } from "@/lib/utils";

async function signOut() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
  await supabase.auth.signOut();
}

export async function POST() {
  await signOut();
  const response = NextResponse.redirect(new URL("/login", process.env.APP_URL ?? "http://localhost:3000"));
  response.cookies.delete(ACTIVE_ORG_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  await signOut();
  const response = NextResponse.redirect(new URL("/login?signed_out=1", request.url));
  response.cookies.delete(ACTIVE_ORG_COOKIE);
  return response;
}
