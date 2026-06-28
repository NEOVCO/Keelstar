import type { Guide } from "./types";
import { coreGuides } from "./core";
import { w9Guides } from "./w9";
import { coiGuides } from "./coi";
import { contractRenewalGuides } from "./contracts-renewal";
import { contractRiskGuides } from "./contracts-risk";
import { signerGuides, policyGuides, trainingGuides, invoiceGuides } from "./hr-finance";
import { exclusionGuides } from "./exclusion";
import { healthcareExclusionGuides } from "./healthcare-exclusion";
import { platformGuides } from "./platform";

export type { Guide, GuideSection, GuideFaq } from "./types";

export const guides: Guide[] = [
  ...coreGuides,
  ...w9Guides,
  ...coiGuides,
  ...contractRenewalGuides,
  ...contractRiskGuides,
  ...signerGuides,
  ...policyGuides,
  ...trainingGuides,
  ...invoiceGuides,
  ...exclusionGuides,
  ...healthcareExclusionGuides,
  ...platformGuides,
];

export function getGuide(slug: string) {
  return guides.find((x) => x.slug === slug);
}

export function getRelatedGuides(slug: string, limit = 5): Guide[] {
  const g = getGuide(slug);
  if (!g?.relatedGuides?.length) return [];
  return g.relatedGuides
    .map((s) => getGuide(s))
    .filter((x): x is Guide => x != null && x.slug !== slug)
    .slice(0, limit);
}
