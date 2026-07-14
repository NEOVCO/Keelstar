import type { ColonyLink, ColonyPage } from "./types";
import { COI_HEAD_SOLUTION, COI_HEAD_TOOL, COI_HUB, COI_PRODUCT } from "./coi";
import { COI_PAGES } from "./coi-colony";

const COI_GUIDE_SLUGS = new Set(
  COI_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getCoiColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return COI_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isCoiColonyGuide(slug: string): boolean {
  return COI_GUIDE_SLUGS.has(slug);
}

export function getCoiColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isCoiColonyGuide(slug)) return [];
  return [
    { label: "Certificate of insurance hub", href: COI_HUB },
    { label: "COI tracking software", href: COI_HEAD_SOLUTION },
    { label: "COI Tracker", href: COI_PRODUCT },
    { label: "Free ACORD analyzer", href: COI_HEAD_TOOL },
  ];
}
