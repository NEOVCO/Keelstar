import type { Guide, GuideFaq, GuideSection } from "./types";

export const AUTHOR = "Keelstar Team";
export const UPDATED = "2026-06-01";

type GuideInput = {
  slug: string;
  title: string;
  summary: string;
  answer: string;
  product: string;
  workflow: string;
  sections: GuideSection[];
  relatedGuides?: string[];
  relatedGlossary?: string[];
  faqs?: GuideFaq[];
};

export function guide(input: GuideInput): Guide {
  return {
    ...input,
    updated: UPDATED,
    author: AUTHOR,
  };
}
