import type { ColonyLink, ColonyPage } from "./types";
import {
  CONTRACT_HEAD_TOOL,
  CONTRACT_HUB,
  CONTRACT_NOTICE_PERIOD_CALCULATOR,
  CONTRACT_PRODUCT,
} from "./contract";
import { CONTRACT_PAGES } from "./contract-colony";

const CONTRACT_GUIDE_SLUGS = new Set(
  CONTRACT_PAGES.filter((p) => p.tier === "guide").map((p) => p.slug),
);

export function getContractColonyPage(pathOrSlug: string): ColonyPage | undefined {
  const trimmed = pathOrSlug.replace(/\/$/, "");
  return CONTRACT_PAGES.find(
    (p) => p.slug === pathOrSlug || p.path.replace(/\/$/, "") === trimmed,
  );
}

export function isContractColonyGuide(slug: string): boolean {
  return CONTRACT_GUIDE_SLUGS.has(slug);
}

export function getContractColonyFunnelForGuide(slug: string): ColonyLink[] {
  if (!isContractColonyGuide(slug)) return [];
  const links: ColonyLink[] = [
    { label: "Contract renewal tracking", href: CONTRACT_HUB },
    { label: "Contract Renewal Tracker", href: CONTRACT_PRODUCT },
    { label: "Contract renewal extractor", href: CONTRACT_HEAD_TOOL },
  ];
  if (
    slug.includes("notice") ||
    slug === "how-to-avoid-accidental-auto-renewals" ||
    slug === "how-to-negotiate-before-auto-renewal"
  ) {
    links.push({ label: "Notice period calculator", href: CONTRACT_NOTICE_PERIOD_CALCULATOR });
  }
  return links;
}
