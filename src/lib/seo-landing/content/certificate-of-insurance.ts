import type { SeoContentSection } from "../types";

export const certificateOfInsuranceSections: SeoContentSection[] = [
  {
    title: "What is a certificate of insurance?",
    eyebrow: "Definition",
    paragraphs: [
      "A certificate of insurance is a summary document—most commonly ACORD 25—that evidences a party's liability coverage. It shows policy numbers, carriers, coverage types, limits, and expiration dates. It is not the insurance policy itself; it is proof that coverage existed on the date the certificate was issued.",
      "General contractors, property managers, and procurement teams require certificates of insurance from vendors and subcontractors before work begins. The certificate must be current—not a PDF from project start that expired months ago.",
    ],
  },
  {
    title: "Tracking certificates of insurance",
    eyebrow: "Operational reality",
    paragraphs: [
      "Collecting a certificate once is easy. Knowing when it expires, whether limits meet contract requirements, and whether additional insured endorsements are in place—that is where teams fail. Certificate of insurance tracking means recording key metadata, monitoring expiration dates, and re-collecting before coverage lapses.",
    ],
    bullets: [
      "Record expiration date, carrier, and policy number for every certificate",
      "Flag vendors with coverage below contract minimums",
      "Remind vendors and brokers before expiration—not after an incident",
      "Maintain dated records showing insurance was current when work occurred",
      "Link certificates to vendor records shared across operations and risk teams",
    ],
  },
  {
    title: "ACORD certificates and contractor compliance",
    eyebrow: "Common format",
    paragraphs: [
      "ACORD 25 is the standard certificate form used by U.S. brokers. It summarizes general liability, automobile, workers compensation, and umbrella coverage. When reviewing a contractor insurance certificate, confirm the named insured matches the vendor legal entity, dates are valid, and limits satisfy your contract or site requirements.",
      "Keelstar stores the uploaded certificate and captures expiration and limit fields for monitoring. Your team spends less time opening PDFs in email and more time acting on vendors who are actually uninsured.",
    ],
  },
];

export const certificateOfInsuranceWhoItsFor = {
  title: "Who tracks certificates of insurance",
  items: [
    "General contractors managing subcontractor insurance by project",
    "Property and facilities teams requiring vendor liability coverage on site",
    "Risk managers maintaining insurance evidence for audits and claims",
    "Procurement teams verifying coverage before contract execution",
  ],
};

export const certificateOfInsuranceChecklist = {
  title: "Certificate of insurance review checklist",
  items: [
    "Named insured matches vendor legal entity on contract and W-9",
    "Expiration date is in the future and recorded in your system",
    "General liability limits meet contract or site minimums",
    "Workers compensation listed where required by jurisdiction",
    "Additional insured endorsement present if contract requires it",
    "Certificate collected through a dated, auditable submission record",
  ],
};
