import type { SeoContentSection } from "../types";

export const vendorOnboardingSections: SeoContentSection[] = [
  {
    title: "What is vendor onboarding?",
    eyebrow: "Definition",
    paragraphs: [
      "Vendor onboarding is the process of collecting required documents and setup information before—or shortly after—you engage a new supplier. It bridges procurement approval and accounts payable readiness: legal entity confirmed, tax form on file, insurance verified, payment details captured.",
      "Supplier onboarding often fails because ownership is unclear. Procurement approves the vendor, AP needs a W-9, risk needs insurance, and nobody tracks the full packet. A structured onboarding workflow assigns clear requirements and follows up until every item is complete.",
    ],
  },
  {
    title: "A typical vendor onboarding workflow",
    eyebrow: "Process",
    paragraphs: [
      "Strong onboarding programs define a standard packet per vendor type. A contractor might need a W-9, certificate of insurance, and safety attestation. A software vendor might need W-9 and banking only. Keelstar lets you template requirements and send one secure link that shows vendors exactly what is outstanding.",
    ],
    bullets: [
      "Create a vendor record with legal name, contacts, and vendor type",
      "Define required documents: W-9, insurance, information form, banking",
      "Send a secure vendor link with a visible progress checklist",
      "Validate submissions before marking items complete",
      "Automate reminders until the packet is closed",
      "Continue monitoring expirations after onboarding ends",
    ],
  },
  {
    title: "Vendor registration vs. ongoing compliance",
    eyebrow: "After day one",
    paragraphs: [
      "Onboarding is the first mile. W-9s go stale when vendors merge or change tax ID. Insurance certificates expire. Keelstar treats onboarding as the start of a vendor record—not a one-time upload. The same portal pattern supports re-collection and renewal without rebuilding the process.",
    ],
  },
];

export const vendorOnboardingWhoItsFor = {
  title: "Who runs vendor onboarding",
  items: [
    "Procurement teams standardizing supplier setup across business units",
    "AP teams that cannot pay new vendors without a validated W-9",
    "Operations managers onboarding contractors before site access",
    "Finance leaders replacing ad-hoc email packets with a tracked process",
  ],
};

export const vendorOnboardingChecklist = {
  title: "Vendor onboarding document checklist",
  items: [
    "Vendor information form: legal entity, DBA, address, primary contacts",
    "IRS Form W-9 with validated taxpayer identification number",
    "Certificate of insurance meeting contract or site requirements",
    "Banking and payment details for approved vendors",
    "Signed master agreement or policy acknowledgment if required",
    "Exclusion screening attestation for regulated industries",
  ],
};
