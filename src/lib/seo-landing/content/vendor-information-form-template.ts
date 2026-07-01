import type { SeoContentSection } from "../types";

export const vendorInformationFormSections: SeoContentSection[] = [
  {
    title: "What is a vendor information form?",
    eyebrow: "Definition",
    paragraphs: [
      "A vendor information form collects the baseline data your organization needs to set up a supplier: legal entity name, tax identification, primary contacts, business address, insurance status, and payment details. It is often the first document in a vendor onboarding packet—before or alongside the W-9 and certificate of insurance.",
      "Without a standard form, each vendor sends different fields in different formats. AP cannot match banking details to the legal entity on the W-9. Risk cannot confirm insurance status. A template creates consistency.",
    ],
  },
  {
    title: "Vendor information form fields",
    eyebrow: "Standard template",
    paragraphs: [
      "Use the checklist above as a starting template. Adjust fields for your industry—construction teams may add license numbers; healthcare vendors may add NPI or screening attestations.",
    ],
    bullets: [
      "Vendor name (DBA) and legal entity name",
      "Federal tax ID or SSN (often collected via W-9 separately)",
      "Primary contact name, email, and phone",
      "Business address and remit-to address if different",
      "Certificate of insurance on file (yes/no) and expiration if known",
      "W-9 on file (yes/no) and date collected",
      "Payment terms and banking details for approved vendors",
    ],
  },
  {
    title: "From template to tracked vendor portal",
    eyebrow: "Operational next step",
    paragraphs: [
      "A static template helps define requirements. Keelstar turns each line item into a tracked submission through a secure vendor link—with reminders, validation, and audit history. See vendor onboarding for the full workflow or create a workspace to collect this form alongside W-9 and insurance documents.",
    ],
  },
];

export const vendorInformationFormFaqs = [
  { q: "What is a vendor information form?", a: "A standard template to collect legal entity name, tax ID, contacts, insurance status, and payment details from a new vendor." },
  { q: "Can this become a tracked portal?", a: "Yes. Keelstar turns checklists into secure vendor links with reminders, validation, and audit history." },
  { q: "What is the difference between legal entity and vendor name?", a: "The vendor name is often a DBA or trade name. The legal entity is the name on tax and insurance documents—both belong on your vendor record." },
  { q: "How does this relate to vendor registration?", a: "Vendor registration is the process; the information form is one of the documents collected during registration and onboarding." },
  { q: "Should banking details be on the same form?", a: "Many teams collect banking on a separate secure step. At minimum, track whether banking is on file and complete before first payment." },
];
