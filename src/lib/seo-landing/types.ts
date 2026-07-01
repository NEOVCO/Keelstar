import type { Faq } from "@/lib/products";

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
  howTitle: string;
  how: { title: string; body: string }[];
  benefitsTitle: string;
  benefits: string[];
  faqs: Faq[];
  ctaTitle: string;
  ctaBody: string;
  relatedLinks?: { label: string; href: string }[];
  comingSoon?: boolean;
};
