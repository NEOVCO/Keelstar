import type { SeoContentSection } from "../types";

export const vendorComplianceSections: SeoContentSection[] = [
  {
    title: "What is vendor compliance?",
    eyebrow: "Definition",
    paragraphs: [
      "Vendor compliance means maintaining the documents and screenings required to engage a supplier—and proving those records were current when you paid, contracted, or allowed work on site. For most organizations, that includes tax forms (W-9), proof of insurance, and basic vendor information. Healthcare providers and government contractors add exclusion list screening; construction firms emphasize insurance limits and additional insured endorsements.",
      "Compliance is not a one-time onboarding checkbox. Documents expire. Vendors change legal entities. Coverage limits shift. Supplier compliance software should treat compliance as an ongoing state, not a PDF filed once in a shared drive.",
    ],
  },
  {
    title: "What vendor compliance software should cover",
    eyebrow: "Core capabilities",
    paragraphs: [
      "Effective vendor compliance software connects collection, validation, monitoring, and evidence. Collection happens through secure vendor links—not email. Validation catches incomplete W-9s before they enter your records. Monitoring watches expiration dates and sends reminders. Evidence means audit trails and exports that answer what did we know, and when?",
    ],
    bullets: [
      "W-9 collection with field validation and re-collection when records go stale",
      "Certificate of insurance tracking with expiration dates and limit review",
      "Reminder schedules that persist until vendors respond or documents renew",
      "Audit trails for requests, submissions, corrections, and exports",
      "Single vendor record accessible to AP, procurement, and compliance owners",
    ],
  },
  {
    title: "Supplier compliance without enterprise overhead",
    eyebrow: "Practical rollout",
    paragraphs: [
      "Enterprise GRC platforms often bundle vendor compliance inside implementations measured in months. Many teams need a focused layer first: collect documents, monitor expirations, export proof. Keelstar is built for that job—operational workflows for business documents, not a full procurement suite.",
      "Teams typically start with one pain point (missing W-9s before 1099 season, or expired insurance on contractors) and expand to a unified vendor compliance program as adoption grows.",
    ],
  },
];

export const vendorComplianceWhoItsFor = {
  title: "Who needs vendor compliance software",
  items: [
    "Finance and AP teams responsible for 1099 reporting and vendor tax records",
    "Risk and compliance teams maintaining insurance and screening documentation",
    "Operations leaders standardizing supplier compliance across regions or business units",
    "Organizations replacing spreadsheet trackers after an audit or insurance incident",
  ],
};

export const vendorComplianceChecklist = {
  title: "Vendor compliance checklist",
  items: [
    "Current W-9 on file with validated taxpayer identification",
    "Certificate of insurance with expiration date within policy",
    "Coverage limits meeting contract or site requirements",
    "Vendor contact and legal entity details matching payment records",
    "Exclusion screening where industry or contract requires it",
    "Dated audit record of when each item was collected or renewed",
  ],
};
