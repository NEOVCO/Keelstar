import type { SeoContentSection } from "../types";

export const w9CollectionSections: SeoContentSection[] = [
  {
    title: "Why W-9 collection matters",
    eyebrow: "Context",
    paragraphs: [
      "IRS Form W-9 provides the legal name, federal tax classification, and taxpayer identification number (TIN) your organization needs for 1099 reporting and backup withholding decisions. Without a current W-9, AP cannot confidently process payments or prepare year-end tax filings.",
      "W-9 collection is deceptively simple: send a form, get it back. In practice, vendors delay, submit incomplete forms, or send outdated versions after entity changes. A structured W-9 request process validates submissions and keeps version history.",
    ],
  },
  {
    title: "How to request a W-9 from a vendor",
    eyebrow: "Best practice",
    paragraphs: [
      "A professional W-9 request should explain why you need the form, how to submit it securely, and who to contact with questions. Avoid generic 'send your W-9' emails with no context—vendors deprioritize them.",
    ],
    bullets: [
      "Use a clear subject line: W-9 request from [Your company] for payment setup",
      "Link to a secure submission method—not an open email attachment if you can avoid it",
      "State the legal name you have on file and ask vendors to confirm or correct it",
      "Set a deadline and send reminders until the form is complete",
      "Validate TIN and signature fields before accepting the submission",
    ],
  },
  {
    title: "W-9 collection at scale",
    eyebrow: "Beyond one vendor",
    paragraphs: [
      "Teams managing dozens or hundreds of vendors cannot chase W-9s manually each January. Bulk W-9 requests, automated reminders, and stale-record flags keep tax documentation current year-round—not in a pre-1099 panic.",
      "Keelstar W-9 Collector stores each submission with timestamps and supports re-collection when vendors update their information. Start with our free W-9 request generator if you need a email template today.",
    ],
  },
];

export const w9CollectionWhoItsFor = {
  title: "Who needs W-9 collection workflows",
  items: [
    "Accounts payable teams preparing for 1099 reporting season",
    "Controllers requiring validated TINs before first payment to new vendors",
    "Finance operations cleaning up vendor master data after acquisitions",
    "Staffing and professional services firms with high contractor volume",
  ],
};

export const w9CollectionChecklist = {
  title: "W-9 quality checklist",
  items: [
    "Legal name matches payment and contract records",
    "Federal tax classification selected (individual, LLC, corporation, etc.)",
    "Taxpayer identification number present and formatted correctly",
    "Address current for information reporting",
    "Form signed and dated by an authorized person",
    "Stored with submission date and version history",
  ],
};
