import type { SeoLandingPageData } from "./types";

export const vendorOnboarding: SeoLandingPageData = {
  path: "/vendor-onboarding/",
  metaTitle: "Vendor Onboarding",
  metaDescription:
    "Vendor and supplier onboarding to collect W-9s, certificates of insurance, and setup documents—with reminders until every item is complete.",
  breadcrumb: "Vendor Onboarding",
  eyebrow: "Vendor onboarding",
  h1: "Vendor onboarding without the email chase",
  hero:
    "Define what you need from a new supplier, send one secure link, and track progress until onboarding is complete. No more partial packets sitting in someone's inbox.",
  problemTitle: "The common problem",
  problem:
    "Vendors submit partial packets and onboarding stalls with no clear owner. W-9s arrive without insurance certificates. Banking details show up weeks after the vendor is already working. Supplier registration should not depend on who remembers to follow up.",
  howTitle: "How onboarding works",
  how: [
    {
      title: "Define requirements",
      body: "List W-9, certificate of insurance, vendor information, banking, and any agreements. Vendors see a checklist—not a vague email asking for 'everything we need.'",
    },
    {
      title: "Send one link",
      body: "Vendors complete items in any order. Progress is visible to your team so nothing sits unnoticed.",
    },
    {
      title: "Close the packet",
      body: "Reminders run until every required document is received. Once onboarded, monitoring continues for expirations and re-certifications.",
    },
  ],
  benefitsTitle: "Benefits",
  benefits: [
    "Faster time-to-pay for approved vendors",
    "Consistent onboarding process across suppliers",
    "Clear handoff from procurement to AP",
    "Ongoing monitoring after day one",
  ],
  faqs: [
    {
      q: "What is vendor onboarding?",
      a: "Vendor onboarding is the process of collecting required documents and setup information before or shortly after you engage a new supplier—tax forms, insurance, contacts, and payment details.",
    },
    {
      q: "What documents are typically required?",
      a: "Most packets include a W-9, certificate of insurance, vendor information form, and banking details. Regulated industries may add exclusion screening or additional attestations.",
    },
    {
      q: "How does vendor registration work in Keelstar?",
      a: "You create a vendor record, define required documents, and send a secure link. Vendors submit through the link; your team tracks completion without manual follow-up.",
    },
    {
      q: "Can we reuse onboarding for annual renewals?",
      a: "Yes. The same workflow re-collects updated W-9s and insurance certificates when records expire.",
    },
  ],
  ctaTitle: "Onboard your next vendor",
  ctaBody: "Start with W-9 collection or a full vendor packet.",
  relatedLinks: [
    { label: "W-9 collection", href: "/w9-collection/" },
    { label: "Vendor information form template", href: "/tools/vendor-information-form-template/" },
  ],
};
