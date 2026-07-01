import type { SeoLandingPageData } from "./types";

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
  faqs: [
    {
      q: "How do I request a W-9 from a vendor?",
      a: "Send a Keelstar secure link that walks the vendor through Form W-9, or use our free W-9 request generator to draft a professional email.",
    },
    {
      q: "What is a vendor W-9?",
      a: "Form W-9 is the IRS document vendors complete to provide their legal name, tax classification, and taxpayer identification number for 1099 reporting.",
    },
    {
      q: "When should we re-collect a W-9?",
      a: "When a vendor changes legal entity, address, or tax ID—or when your records are older than your policy allows. Keelstar can flag stale W-9s automatically.",
    },
    {
      q: "Does Keelstar file 1099s?",
      a: "No. Keelstar collects and stores W-9 records. Your accounting system or payroll provider handles 1099 filing.",
    },
  ],
  ctaTitle: "Collect your first W-9",
  ctaBody: "Start free. Go live the same day.",
  relatedLinks: [
    { label: "W-9 Collector", href: "/products/w9-collector/" },
    { label: "W-9 request generator", href: "/tools/w9-request-generator/" },
  ],
};
