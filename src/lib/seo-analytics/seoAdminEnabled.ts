export function isSeoAdminUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SEO_ADMIN === "true";
}
