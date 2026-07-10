import type { SeoLandingPageData } from "./types";
import {
  vendorOnboardingSections,
  vendorOnboardingWhoItsFor,
  vendorOnboardingChecklist,
} from "./content/vendor-onboarding";
import { vendorOnboardingFaqs } from "./content/vendor-onboarding-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

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
  problemBullets: [
    "No single checklist—each department requests documents ad hoc over email",
    "Partial submissions marked complete because someone stopped chasing",
    "Vendor master data in the ERP does not match documents on file",
    "Renewals and re-certifications restart the same manual chase every year",
  ],
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
    "Consistent onboarding process across suppliers and locations",
    "Clear handoff from procurement to AP with one vendor record",
    "Ongoing monitoring after day one for expirations and re-certifications",
  ],
  sections: vendorOnboardingSections,
  whoItsFor: vendorOnboardingWhoItsFor,
  checklist: vendorOnboardingChecklist,
  faqs: vendorOnboardingFaqs,
  ctaTitle: "Onboard your next vendor",
  ctaBody: "Start with W-9 collection or a full vendor packet.",
  relatedLinks: [
    { label: "W-9 collection", href: "/w9-collection/" },
    { label: "Vendor information form template", href: "/tools/vendor-information-form-template/" },
    { label: "Vendor portal", href: "/vendor-portal/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("vendor-onboarding"),
  lastUpdated: "2026-07-10",
};
