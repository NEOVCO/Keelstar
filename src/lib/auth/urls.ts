import { getAppUrl } from "@/lib/site";

/** Base path for Supabase PKCE email links (signup confirm, password reset, magic link). */
export function authCallbackUrl(next = "/app"): string {
  const base = getAppUrl();
  const path = next.startsWith("/") ? next : `/${next}`;
  return `${base}/auth/callback?next=${encodeURIComponent(path)}`;
}

export function signupConfirmRedirectUrl(): string {
  return authCallbackUrl("/onboarding");
}

export function passwordResetRedirectUrl(): string {
  return authCallbackUrl("/reset-password");
}

export function inviteAcceptUrl(token: string): string {
  return `${getAppUrl()}/invite/${token}`;
}

export function inviteSignupRedirectUrl(token: string): string {
  return authCallbackUrl(`/invite/${token}`);
}

/** Redirect URLs to allow in Supabase Dashboard → Authentication → URL configuration. */
export const SUPABASE_REDIRECT_URLS = [
  "http://localhost:3000/auth/callback",
  "http://localhost:3000/auth/callback?next=%2Fonboarding",
  "http://localhost:3000/auth/callback?next=%2Freset-password",
  "http://localhost:3000/auth/callback?next=%2Fapp",
  "https://www.keelstar.com/auth/callback",
  "https://www.keelstar.com/auth/callback?next=%2Fonboarding",
  "https://www.keelstar.com/auth/callback?next=%2Freset-password",
  "https://www.keelstar.com/auth/callback?next=%2Fapp",
  "https://keelstar.com/auth/callback",
  "https://keelstar.com/auth/callback?next=%2Fonboarding",
  "https://keelstar.com/auth/callback?next=%2Freset-password",
] as const;
