import type { SeoLandingPageData } from "./types";

export const vendorCompliance: SeoLandingPageData = {
  path: "/vendor-compliance/",
  metaTitle: "Vendor Compliance Software",
  metaDescription:
    "Vendor compliance software to collect W-9s and certificates of insurance, send reminders, and maintain audit trails for supplier compliance.",
  breadcrumb: "Vendor Compliance",
  eyebrow: "Vendor compliance",
  h1: "Vendor compliance records your team can defend",
  hero:
    "Collect required documents, track expirations, and keep dated records for every vendor. Keelstar replaces spreadsheet trackers and inbox searches with monitored workflows.",
  problemTitle: "The common problem",
  problem:
    "Spreadsheets do not send reminders. Email is not evidence. When an auditor or insurer asks whether a vendor was compliant on a specific date, teams scramble through inboxes instead of pulling a record.",
  howTitle: "How Keelstar supports vendor compliance",
  how: [
    {
      title: "W-9 collection",
      body: "Request and re-collect IRS Form W-9 through secure links. Validate required fields and store version history when vendors update their information.",
    },
    {
      title: "Certificates of insurance",
      body: "Collect ACORD certificates, record expiration dates and coverage limits, and flag vendors before coverage lapses.",
    },
    {
      title: "Audit trail and reminders",
      body: "Every request, submission, and reminder is logged with timestamps. Automated follow-ups run until documents are current.",
    },
  ],
  benefitsTitle: "What you get",
  benefits: [
    "Central vendor compliance records",
    "Expiration monitoring for insurance certificates",
    "Automated reminders for missing or stale documents",
    "Exports for audits and due diligence",
  ],
  faqs: [
    {
      q: "What is vendor compliance?",
      a: "Vendor compliance means maintaining required documents—tax forms, insurance certificates, exclusion screenings, and agreements—with proof they were current when you paid or engaged the supplier.",
    },
    {
      q: "What documents should we track?",
      a: "Most teams start with W-9s and certificates of insurance. Healthcare and government contractors often add OIG and SAM exclusion screening.",
    },
    {
      q: "How do reminders work?",
      a: "Keelstar sends follow-ups on a schedule you set until vendors submit outstanding documents or renew expiring certificates.",
    },
    {
      q: "Is this supplier compliance software or accounts payable?",
      a: "Both teams use it. AP needs W-9s for 1099 reporting. Risk and operations need insurance and screening records. Keelstar keeps one vendor record both sides trust.",
    },
  ],
  ctaTitle: "Start tracking vendor compliance",
  ctaBody: "Begin with W-9 collection or certificate of insurance tracking.",
  relatedLinks: [
    { label: "W-9 collection", href: "/w9-collection/" },
    { label: "Certificate of insurance", href: "/certificate-of-insurance/" },
    { label: "Vendor portal", href: "/vendor-portal/" },
  ],
};
