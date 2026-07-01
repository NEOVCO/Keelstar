import type { SeoContentSection } from "../types";

export const vendorPortalSections: SeoContentSection[] = [
  {
    title: "What is a vendor portal?",
    eyebrow: "Definition",
    paragraphs: [
      "A vendor portal—sometimes called a supplier portal or vendor self-service portal—is a secure page where external suppliers submit documents your organization requires before or during the relationship. Unlike a full vendor management system (VMS), the portal's job is operational: collect, validate, and retain proof—not run sourcing events or scorecard performance.",
      "The best vendor portals minimize friction for suppliers. A contractor should upload a certificate of insurance in two minutes, not create credentials they will never use again. Keelstar uses tokenized links: your team sends a request, the vendor completes it in the browser, and the record attaches to that vendor automatically.",
    ],
  },
  {
    title: "Vendor portal vs. email and spreadsheets",
    eyebrow: "Why teams switch",
    paragraphs: [
      "Spreadsheets work until they do not—usually the week before an audit or when a certificate expires on a job site nobody remembered to check. Email does not send reminders, does not validate fields, and does not prove a document was on file on a specific date.",
      "A lightweight vendor portal replaces the manual loop: request, chase, file, forget, chase again. Keelstar keeps the loop visible. Your team sees who has not responded, which documents expire soon, and what changed when a vendor updates their W-9 after a merger.",
    ],
    bullets: [
      "Replace manual W-9 follow-ups with tracked requests and automatic reminders",
      "Stop maintaining parallel trackers in Excel that nobody trusts after the original owner leaves",
      "Give procurement and AP the same vendor record instead of two conflicting folders",
    ],
  },
  {
    title: "What documents belong in a supplier portal",
    eyebrow: "Typical scope",
    paragraphs: [
      "Most teams start with tax and insurance: IRS Form W-9 and certificates of insurance (often ACORD 25). Vendor onboarding packets add legal entity details, primary contacts, payment terms, and banking information. Regulated industries may add exclusion screening attestations or policy acknowledgments.",
      "Keelstar handles each document type as a monitored workflow. You can start with W-9 collection only and expand to insurance tracking or full onboarding packets when the process matures—without re-platforming.",
    ],
  },
];

export const vendorPortalWhoItsFor = {
  title: "Who uses a vendor portal",
  items: [
    "Accounts payable teams that need clean W-9 records before year-end 1099 reporting",
    "Procurement and operations teams onboarding suppliers across multiple locations",
    "Construction and facilities teams tracking contractor insurance certificates by job",
    "Healthcare and government contractors maintaining vendor compliance documentation",
  ],
};

export const vendorPortalChecklist = {
  title: "Documents commonly collected through a vendor portal",
  items: [
    "IRS Form W-9 (legal name, tax classification, taxpayer ID)",
    "Certificate of insurance with expiration date and coverage limits",
    "Vendor information form (legal entity, DBA, contacts, address)",
    "Banking and payment details for approved vendors",
    "Signed agreements or policy acknowledgments where required",
  ],
};
