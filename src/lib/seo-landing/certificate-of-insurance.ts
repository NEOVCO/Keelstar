import type { SeoLandingPageData } from "./types";

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
  faqs: [
    {
      q: "What is a certificate of insurance?",
      a: "A certificate of insurance is a summary document—often ACORD 25—that shows a vendor's liability coverage, policy numbers, and expiration dates. It is not the policy itself.",
    },
    {
      q: "What is an ACORD certificate of insurance?",
      a: "ACORD 25 is the standard form brokers use to evidence general liability, auto, workers compensation, and umbrella coverage. Keelstar stores the document and key dates from each submission.",
    },
    {
      q: "How often should we collect updated certificates?",
      a: "At minimum before expiration. Many teams also require updated certificates when coverage limits change or when a vendor starts work at a new location.",
    },
    {
      q: "Can we track contractor insurance certificates the same way?",
      a: "Yes. The same workflow applies to contractors, subcontractors, and any vendor where you need proof of insurance on file.",
    },
  ],
  ctaTitle: "Track certificates of insurance",
  ctaBody: "Start with one vendor. Scale when ready.",
  relatedLinks: [
    { label: "COI Tracker", href: "/products/coi-tracker/" },
    { label: "Vendor compliance", href: "/vendor-compliance/" },
  ],
};
