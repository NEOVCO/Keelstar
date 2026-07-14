import type { SeoLandingPageData } from "./types";
import { COI_HUB_COLONY_GUIDES } from "@/lib/seo-colonies";
import {
  certificateOfInsuranceSections,
  certificateOfInsuranceWhoItsFor,
  certificateOfInsuranceChecklist,
} from "./content/certificate-of-insurance";
import { certificateOfInsuranceFaqs } from "./content/certificate-of-insurance-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

export const certificateOfInsurance: SeoLandingPageData = {
  path: "/certificate-of-insurance/",
  metaTitle: "Certificate of Insurance Tracking",
  metaDescription:
    "Track certificates of insurance, monitor expiration dates, and collect ACORD certificates from contractors and vendors before coverage lapses.",
  breadcrumb: "Certificate of Insurance",
  eyebrow: "Certificate of insurance",
  h1: "Track certificates of insurance before coverage lapses",
  hero:
    "Collect ACORD certificates, record expiration dates and coverage limits, and get warned before a vendor goes uninsured. One record per vendor—not a folder of PDFs with no dates.",
  problemTitle: "The common problem",
  problem:
    "Certificates expire quietly until someone notices—often too late. Contractors send ACORD forms once at onboarding, and teams have no system to track renewals or inadequate limits.",
  problemBullets: [
    "Expiration dates buried in PDFs nobody re-opens until after a lapse",
    "Coverage limits not compared against contract minimums",
    "Brokers and vendors cc'd on email with no central record of what is current",
    "Auditors ask for proof of insurance on a date—and teams cannot produce it quickly",
  ],
  howTitle: "How tracking works",
  how: [
    {
      title: "Collect",
      body: "Request certificates of insurance through a secure link. Vendors upload ACORD 25 or equivalent documents directly to the vendor record.",
    },
    {
      title: "Record",
      body: "Capture expiration date, carrier, policy number, and coverage limits. Flag missing additional insured endorsements when your contracts require them.",
    },
    {
      title: "Monitor",
      body: "Remind vendors and brokers before certificates expire. Your team sees who is uninsured before work continues on site.",
    },
  ],
  benefitsTitle: "Benefits",
  benefits: [
    "Prove insurance was current on a specific date",
    "Flag inadequate limits before incidents",
    "Automated renewal reminders",
    "Export evidence for contracts and audits",
  ],
  sections: certificateOfInsuranceSections,
  whoItsFor: certificateOfInsuranceWhoItsFor,
  checklist: certificateOfInsuranceChecklist,
  faqs: certificateOfInsuranceFaqs,
  ctaTitle: "Track certificates of insurance",
  ctaBody: "Start with one vendor. Scale when ready.",
  relatedLinks: [
    { label: "COI Tracker", href: "/products/coi-tracker/" },
    { label: "Vendor compliance", href: "/vendor-compliance/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("certificate-of-insurance"),
  colonyGuideLinks: COI_HUB_COLONY_GUIDES,
  colonyGuideTitle: "COI tracking guides",
  lastUpdated: "2026-07-10",
};
