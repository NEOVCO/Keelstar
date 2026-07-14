import type { SeoLandingPageData } from "./types";
import { COMPLIANCE_HUB_COLONY_GUIDES } from "@/lib/seo-colonies";
import {
  vendorComplianceSections,
  vendorComplianceWhoItsFor,
  vendorComplianceChecklist,
} from "./content/vendor-compliance";
import { vendorComplianceFaqs } from "./content/vendor-compliance-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

export const vendorCompliance: SeoLandingPageData = {
  path: "/vendor-compliance/",
  metaTitle: "Vendor Compliance Software",
  metaDescription:
    "Vendor compliance software to collect W-9s and certificates of insurance, automate reminders, and maintain audit trails—built for finance, risk, and operations teams.",
  breadcrumb: "Vendor Compliance",
  eyebrow: "Vendor compliance",
  h1: "Vendor compliance records your team can defend",
  hero:
    "Collect required documents, track expirations, and keep dated records for every vendor. Keelstar replaces spreadsheet trackers and inbox searches with monitored workflows.",
  problemTitle: "The common problem",
  problem:
    "Vendor compliance fails quietly. A W-9 on file from three years ago still shows complete in a spreadsheet nobody updates. A certificate of insurance expires mid-project. When an auditor, insurer, or customer asks whether a vendor was compliant on a specific date, teams reconstruct history from email—not from a system of record.",
  problemBullets: [
    "Spreadsheets do not send reminders when documents expire or go missing",
    "Email is not evidence—attachments lack timestamps, validation, and version control",
    "AP, procurement, and risk teams maintain separate lists that disagree",
    "Point tools solve one document type but leave gaps across the vendor lifecycle",
  ],
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
    "Central vendor compliance records shared across finance and operations",
    "Expiration monitoring for insurance certificates and stale tax forms",
    "Automated reminders for missing, rejected, or expiring documents",
    "Exports and audit logs for diligence, renewals, and regulatory review",
    "Modular workflows—start with W-9s, add insurance, expand to screening when ready",
  ],
  sections: vendorComplianceSections,
  whoItsFor: vendorComplianceWhoItsFor,
  checklist: vendorComplianceChecklist,
  faqs: vendorComplianceFaqs,
  ctaTitle: "Start tracking vendor compliance",
  ctaBody: "Begin with W-9 collection or certificate of insurance tracking.",
  relatedLinks: [
    { label: "W-9 collection", href: "/w9-collection/" },
    { label: "Certificate of insurance", href: "/certificate-of-insurance/" },
    { label: "Vendor portal", href: "/vendor-portal/" },
    { label: "Exclusion monitoring", href: "/exclusion-monitoring/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("vendor-compliance"),
  colonyGuideLinks: COMPLIANCE_HUB_COLONY_GUIDES,
  colonyGuideTitle: "Vendor compliance guides",
  lastUpdated: "2026-07-10",
};
