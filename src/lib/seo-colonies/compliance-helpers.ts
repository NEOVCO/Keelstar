import type { ColonyLink, ColonyPage } from "./types";
import { COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HEAD_TOOL, COMPLIANCE_HUB, COMPLIANCE_PRODUCT } from "./compliance";
import { COMPLIANCE_PAGES } from "./compliance-colony";

const COMPLIANCE_GUIDE_SLUGS = new Set(
  COMPLIANCE_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getComplianceColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return COMPLIANCE_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isComplianceColonyGuide(slug: string): boolean {
  return COMPLIANCE_GUIDE_SLUGS.has(slug);
}

export function getComplianceColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isComplianceColonyGuide(slug)) return [];
  return [
    { label: "Vendor compliance hub", href: COMPLIANCE_HUB },
    { label: "Third-party vendor compliance", href: COMPLIANCE_HEAD_SOLUTION },
    { label: "Vendor Packet", href: COMPLIANCE_PRODUCT },
    { label: "Vendor onboarding packet generator", href: COMPLIANCE_HEAD_TOOL },
  ];
}
