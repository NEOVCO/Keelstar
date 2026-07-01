import { site } from "@/lib/site";

export function isSeoAnalyticsEnabled(): boolean {
  const v = (process.env.ENABLE_SEO_ANALYTICS ?? "").toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

export function isSeoAdminUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SEO_ADMIN === "true";
}

export function getGscPropertyUrl(): string {
  return (process.env.GSC_PROPERTY_URL ?? "").trim();
}

export function getGa4PropertyId(): string {
  return (process.env.GA4_PROPERTY_ID ?? "").trim().replace(/^properties\//, "");
}

export function getSeoPublicBaseUrl(): string {
  return (process.env.SEO_PUBLIC_BASE_URL ?? site.url).replace(/\/$/, "");
}

export function getAdminEmails(): Set<string> {
  const raw = (process.env.ADMIN_EMAILS ?? "").trim();
  if (!raw) return new Set();
  return new Set(raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export function getGoogleCredentialsPath(): string | null {
  const file = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE ?? "").trim();
  if (file) return file;
  const gac = (process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "").trim();
  return gac || null;
}
