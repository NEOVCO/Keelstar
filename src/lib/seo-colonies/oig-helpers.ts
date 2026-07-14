import type { ColonyLink, ColonyPage } from "./types";
import { OIG_HEAD_SOLUTION, OIG_HEAD_TOOL, OIG_HUB, OIG_PRODUCT } from "./oig";
import { OIG_PAGES } from "./oig-colony";

const OIG_GUIDE_SLUGS = new Set(
  OIG_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getOigColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return OIG_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isOigColonyGuide(slug: string): boolean {
  return OIG_GUIDE_SLUGS.has(slug);
}

export function getColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isOigColonyGuide(slug)) return [];
  return [
    { label: "Exclusion monitoring hub", href: OIG_HUB },
    { label: "OIG exclusion check", href: OIG_HEAD_SOLUTION },
    { label: "Exclusion Monitor", href: OIG_PRODUCT },
    { label: "Free OIG search tool", href: OIG_HEAD_TOOL },
  ];
}
