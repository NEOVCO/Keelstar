import type { SeoContentSection } from "../types";

export const w9RequestGeneratorSections: SeoContentSection[] = [
  {
    title: "When to send a W-9 request",
    eyebrow: "Timing",
    paragraphs: [
      "Request a W-9 before first payment to a new vendor, when a vendor changes legal entity or tax ID, and during annual vendor master cleanup before 1099 season. Waiting until December creates unnecessary risk—missing TINs delay filings and can trigger backup withholding questions.",
      "A clear W-9 request email sets expectations: why you need the form, how to submit it, and who to contact. Vendors respond faster when the request looks professional and specific—not a generic accounts payable blast.",
    ],
  },
  {
    title: "What belongs in a W-9 request email",
    eyebrow: "Template structure",
    paragraphs: [
      "Use the generator above to draft a starting point. Customize the secure submission link when you move to tracked W-9 collection in Keelstar.",
    ],
    bullets: [
      "Subject line with your company name and 'W-9 request'",
      "Vendor contact name and the legal name you have on file",
      "Brief reason: payment setup, 1099 reporting, or vendor master update",
      "Secure link or instructions for returning the completed Form W-9",
      "Deadline and AP contact for questions",
    ],
  },
  {
    title: "From email template to tracked collection",
    eyebrow: "Next step",
    paragraphs: [
      "This generator helps with the first email. When you need reminders, field validation, version history, and audit exports, move to Keelstar W-9 Collector. Send secure links instead of attachments, validate TIN and signature fields automatically, and see which vendors have not responded.",
    ],
  },
];

export const w9RequestGeneratorFaqs = [
  { q: "Is this a legally binding W-9?", a: "No. This tool generates a request email. The vendor still completes and signs IRS Form W-9." },
  { q: "Can Keelstar track responses?", a: "Yes. Create a free workspace to send secure links, validate submissions, and monitor who has not responded." },
  { q: "What should a W-9 request email include?", a: "A clear subject line, what you need, how to submit securely, and a contact for questions. This generator drafts that structure—you add your secure link." },
  { q: "When should I request a W-9?", a: "Before first payment, after entity changes, and during annual vendor cleanup before 1099 filing season." },
  { q: "Can I request W-9s in bulk?", a: "Yes, in Keelstar W-9 Collector. This free tool is for drafting a single professional email." },
];
