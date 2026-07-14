import type { Faq } from "@/lib/products";

export type SeoContentSection = {
  title: string;
  eyebrow?: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoLandingPageData = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow?: string;
  h1: string;
  hero: string;
  problemTitle: string;
  problem: string;
  problemBullets?: string[];
  howTitle: string;
  how: { title: string; body: string }[];
  benefitsTitle: string;
  benefits: string[];
  sections?: SeoContentSection[];
  whoItsFor?: { title: string; items: string[] };
  checklist?: { title: string; items: string[] };
  faqs: Faq[];
  ctaTitle: string;
  ctaBody: string;
  relatedLinks?: { label: string; href: string }[];
  /** Deep links to /solutions/ guides (hub pages) */
  solutionLinks?: { label: string; href: string }[];
  /** Colony guide spokes surfaced on hub landings */
  colonyGuideLinks?: { label: string; href: string }[];
  /** ISO date for freshness signals (LLM + search) */
  lastUpdated?: string;
  comingSoon?: boolean;
};
