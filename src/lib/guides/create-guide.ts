import { guide } from "./helpers";
import type { Guide, GuideFaq, GuideSection } from "./types";

export type GuideCluster = "w9" | "oig" | "coi";

const CLUSTER_DEFAULTS: Record<
  GuideCluster,
  { product: string; workflow: string; defaultRelatedGlossary: string[] }
> = {
  w9: {
    product: "w9-collector",
    workflow: "collect-w9s",
    defaultRelatedGlossary: ["w-9", "tin"],
  },
  oig: {
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    defaultRelatedGlossary: ["oig-exclusion"],
  },
  coi: {
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    defaultRelatedGlossary: ["certificate-of-insurance"],
  },
};

/** Spec for programmatic guide generation (Phase 1+ SEO scale). */
export type GuideArticleSpec = {
  slug: string;
  cluster: GuideCluster;
  title: string;
  summary: string;
  answer: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedGuideSlugs?: string[];
  relatedGlossary?: string[];
  /** Target keyword for manifest tracking — not rendered on page. */
  primaryKeyword?: string;
};

export const PHASE1_UPDATED = "2026-07-11";

export function createGuide(spec: GuideArticleSpec): Guide {
  const defaults = CLUSTER_DEFAULTS[spec.cluster];
  return {
    ...guide({
      slug: spec.slug,
      title: spec.title,
      summary: spec.summary,
      answer: spec.answer,
      product: defaults.product,
      workflow: defaults.workflow,
      sections: spec.sections,
      faqs: spec.faqs,
      relatedGuides: spec.relatedGuideSlugs,
      relatedGlossary: spec.relatedGlossary ?? defaults.defaultRelatedGlossary,
    }),
    updated: PHASE1_UPDATED,
  };
}

export function buildGuidesFromSpecs(specs: GuideArticleSpec[]): Guide[] {
  return specs.map(createGuide);
}

/** Throws at build time if a programmatic slug collides with an existing guide. */
export function assertNoSlugCollisions(newGuides: Guide[], existingSlugs: Iterable<string>) {
  const seen = new Set(existingSlugs);
  for (const g of newGuides) {
    if (seen.has(g.slug)) {
      throw new Error(`Guide slug collision: ${g.slug}`);
    }
    seen.add(g.slug);
  }
}
