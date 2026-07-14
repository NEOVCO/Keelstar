import type { ColonyLink, ColonyPage } from "./types";
import { VENDOR_HEAD_SOLUTION, VENDOR_HEAD_TOOL, VENDOR_HUB, VENDOR_PRODUCT } from "./vendor";
import { VENDOR_PAGES } from "./vendor-colony";

const VENDOR_GUIDE_SLUGS = new Set(
  VENDOR_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getVendorColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return VENDOR_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isVendorColonyGuide(slug: string): boolean {
  return VENDOR_GUIDE_SLUGS.has(slug);
}

export function getVendorColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isVendorColonyGuide(slug)) return [];
  return [
    { label: "Vendor onboarding hub", href: VENDOR_HUB },
    { label: "Vendor packet software", href: VENDOR_HEAD_SOLUTION },
    { label: "Vendor Packet", href: VENDOR_PRODUCT },
    { label: "Vendor information form template", href: VENDOR_HEAD_TOOL },
  ];
}
