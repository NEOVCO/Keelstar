import { getModuleBySlug, type ProductModule } from "@/lib/modules/modules";

export type OrgOnboardingSettings = {
  first_goal?: string | null;
  checklist_dismissed?: boolean;
};

export function parseOrgOnboardingSettings(
  settings: Record<string, unknown> | null | undefined
): OrgOnboardingSettings {
  const raw = (settings ?? {}) as OrgOnboardingSettings;
  return {
    first_goal: typeof raw.first_goal === "string" ? raw.first_goal : null,
    checklist_dismissed: raw.checklist_dismissed === true,
  };
}

/** First meaningful action after goal selection — not the module marketing home. */
export function getModuleFirstActionRoute(mod: ProductModule): string {
  if (mod.routes.new) return mod.routes.new;
  switch (mod.slug) {
    case "coi":
    case "contracts":
    case "contracts-risk":
      return "/app/documents?action=upload";
    case "invoices":
      return "/app/workflows?action=create&type=invoice_approval";
    case "signer":
      return "/app/workflows?action=create&type=simple_signer";
    default:
      return mod.routes.app;
  }
}

export function getFirstActionRouteForSlug(slug: string | null | undefined): string {
  if (!slug) return "/app";
  const mod = getModuleBySlug(slug);
  if (!mod) return "/app";
  return getModuleFirstActionRoute(mod);
}

export function getGoalModule(slug: string | null | undefined): ProductModule | undefined {
  if (!slug) return undefined;
  return getModuleBySlug(slug);
}
