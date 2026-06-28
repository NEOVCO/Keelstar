export type GuideSection = { heading: string; body: string; bullets?: string[] };

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  answer: string;
  sections: GuideSection[];
  product: string;
  workflow: string;
  updated: string;
  author: string;
  relatedGuides?: string[];
  relatedGlossary?: string[];
  faqs?: GuideFaq[];
};
