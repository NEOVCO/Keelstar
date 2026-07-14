import type { ColonyLink, ColonyPage } from "./types";
import { W9_HEAD_SOLUTION, W9_HEAD_TOOL, W9_HUB, W9_PRODUCT } from "./w9";
import { W9_PAGES } from "./w9-colony";

const W9_GUIDE_SLUGS = new Set(
  W9_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getW9ColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return W9_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isW9ColonyGuide(slug: string): boolean {
  return W9_GUIDE_SLUGS.has(slug);
}

export function getW9ColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isW9ColonyGuide(slug)) return [];
  return [
    { label: "W-9 collection hub", href: W9_HUB },
    { label: "Request W-9 from vendor", href: W9_HEAD_SOLUTION },
    { label: "W-9 Collector", href: W9_PRODUCT },
    { label: "Free W-9 request generator", href: W9_HEAD_TOOL },
  ];
}
