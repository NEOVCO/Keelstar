import type { ColonyLink, ColonyPage } from "./types";
import { PORTAL_HEAD_SOLUTION, PORTAL_HEAD_TOOL, PORTAL_HUB, PORTAL_PRODUCT } from "./portal";
import { PORTAL_PAGES } from "./portal-colony";

const PORTAL_GUIDE_SLUGS = new Set(
  PORTAL_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getPortalColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return PORTAL_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isPortalColonyGuide(slug: string): boolean {
  return PORTAL_GUIDE_SLUGS.has(slug);
}

export function getPortalColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isPortalColonyGuide(slug)) return [];
  return [
    { label: "Vendor portal hub", href: PORTAL_HUB },
    { label: "Vendor setup portal", href: PORTAL_HEAD_SOLUTION },
    { label: "Vendor Packet", href: PORTAL_PRODUCT },
    { label: "Vendor onboarding packet generator", href: PORTAL_HEAD_TOOL },
  ];
}
