import type { SeoLandingPageData } from "./types";
import { W9_HUB_COLONY_GUIDES } from "@/lib/seo-colonies";
import {
  w9CollectionSections,
  w9CollectionWhoItsFor,
  w9CollectionChecklist,
} from "./content/w9-collection";
import { w9CollectionFaqs } from "./content/w9-collection-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

export const w9Collection: SeoLandingPageData = {
  path: "/w9-collection/",
  metaTitle: "W-9 Collection",
  metaDescription:
    "Request a W-9 from a vendor with a secure link, validate required fields, and keep a dated audit record for tax reporting.",
  breadcrumb: "W-9 Collection",
  eyebrow: "W-9 collection",
  h1: "Request a W-9 from a vendor and keep it on file",
  hero:
    "Send a secure W-9 request, validate fields before acceptance, and maintain version history when vendors update their information. Built for AP teams that need clean 1099 records.",
  problemTitle: "The common problem",
  problem:
    "AP teams chase W-9s over email. Incomplete forms slip through. When year-end arrives, missing or outdated tax IDs create reporting risk and payment delays.",
  problemBullets: [
    "Vendors delay or ignore generic W-9 request emails with no secure submission path",
    "Incomplete forms accepted into vendor files create 1099 and backup withholding risk",
    "Entity changes after mergers leave outdated legal names on tax records",
    "January scramble to collect hundreds of W-9s that should have been current all year",
  ],
  howTitle: "How W-9 collection works",
  how: [
    {
      title: "Request",
      body: "Send a secure link for vendors to complete IRS Form W-9. No vendor account required.",
    },
    {
      title: "Validate",
      body: "Required fields are checked before acceptance so blank or unsigned forms do not enter your records.",
    },
    {
      title: "Monitor",
      body: "Re-collect when records go stale. Reminders run until every active vendor has a current W-9 on file.",
    },
  ],
  benefitsTitle: "Benefits",
  benefits: [
    "No vendor account required",
    "Bulk W-9 requests for vendor lists",
    "Full audit trail for tax and finance reviews",
    "Free email template if you are not ready for tracked collection",
  ],
  sections: w9CollectionSections,
  whoItsFor: w9CollectionWhoItsFor,
  checklist: w9CollectionChecklist,
  faqs: w9CollectionFaqs,
  ctaTitle: "Collect your first W-9",
  ctaBody: "Start free. Go live the same day.",
  relatedLinks: [
    { label: "W-9 Collector", href: "/products/w9-collector/" },
    { label: "W-9 request generator", href: "/tools/w9-request-generator/" },
    { label: "Vendor onboarding", href: "/vendor-onboarding/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("w9-collection"),
  colonyGuideLinks: W9_HUB_COLONY_GUIDES,
  colonyGuideTitle: "W-9 collection guides",
  lastUpdated: "2026-07-10",
};
