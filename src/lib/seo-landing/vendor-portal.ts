import type { SeoLandingPageData } from "./types";
import {
  vendorPortalSections,
  vendorPortalWhoItsFor,
  vendorPortalChecklist,
} from "./content/vendor-portal";
import { vendorPortalFaqs } from "./content/vendor-portal-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

export const vendorPortal: SeoLandingPageData = {
  path: "/vendor-portal/",
  metaTitle: "Vendor Portal",
  metaDescription:
    "A vendor self-service portal to collect W-9s, certificates of insurance, and compliance documents through secure links—with reminders, version history, and audit records for AP and procurement teams.",
  breadcrumb: "Vendor Portal",
  eyebrow: "Vendor portal",
  h1: "A vendor portal for document collection and compliance",
  hero:
    "Give vendors a single secure link to submit required documents. Your team tracks status, sends reminders, and exports dated records—without email attachments, shared drives, or another password vendors will forget.",
  problemTitle: "The common problem",
  problem:
    "Most organizations still collect vendor documents over email. A W-9 arrives from one contact, a certificate of insurance from another, and banking details in a separate thread six weeks later. Nothing is dated. Nothing is validated. When finance, legal, or an auditor asks for proof that a vendor was compliant on a specific date, the answer is a folder search—not a record.",
  problemBullets: [
    "Email threads do not show which version of a W-9 or insurance certificate is current",
    "Shared drives become graveyards of PDFs with no expiration dates or ownership",
    "Vendor portals bundled inside large ERP suites are expensive and slow to roll out",
    "Vendors resist creating yet another login for a one-time document upload",
  ],
  howTitle: "How Keelstar works",
  how: [
    {
      title: "Send a request",
      body: "Choose the documents you need—W-9, certificate of insurance, vendor information, banking—and send a secure link. Vendors complete forms in the browser. No account required.",
    },
    {
      title: "Collect and validate",
      body: "Submissions land in one vendor record. Required fields are checked before acceptance so incomplete tax forms and insurance certificates do not enter your files.",
    },
    {
      title: "Monitor and export",
      body: "Automated reminders chase outstanding items. Every request, submission, and follow-up is logged. Export dated records when audits or contract renewals require evidence.",
    },
  ],
  benefitsTitle: "Benefits",
  benefits: [
    "One link instead of scattered email threads across AP, procurement, and legal",
    "Version history when vendors re-submit after entity changes or coverage updates",
    "Automated reminders until every required document is complete",
    "Audit trail your team can defend—not screenshots of inboxes",
    "Works alongside your ERP; Keelstar is the document layer, not a replacement for payment systems",
  ],
  sections: vendorPortalSections,
  whoItsFor: vendorPortalWhoItsFor,
  checklist: vendorPortalChecklist,
  faqs: vendorPortalFaqs,
  ctaTitle: "Set up your vendor portal",
  ctaBody: "Start free. Send your first request the same day.",
  relatedLinks: [
    { label: "Vendor compliance", href: "/vendor-compliance/" },
    { label: "Vendor onboarding", href: "/vendor-onboarding/" },
    { label: "W-9 collection", href: "/w9-collection/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("vendor-portal"),
  lastUpdated: "2026-07-10",
};
