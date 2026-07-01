import type { Faq } from "@/lib/products";

export const vendorComplianceFaqs: Faq[] = [
  {
    q: "What is vendor compliance?",
    a: "Vendor compliance means maintaining required documents—tax forms, insurance certificates, exclusion screenings, and agreements—with proof they were current when you paid or engaged the supplier.",
  },
  {
    q: "What is supplier compliance software?",
    a: "Supplier compliance software helps organizations collect, validate, monitor, and retain vendor documents. Keelstar focuses on operational documents like W-9s and certificates of insurance with reminders and audit trails.",
  },
  {
    q: "What documents should we track?",
    a: "Most teams start with W-9s and certificates of insurance. Healthcare and government contractors often add OIG and SAM exclusion screening. Construction teams emphasize insurance limits and renewal timing.",
  },
  {
    q: "How do compliance reminders work?",
    a: "Keelstar sends follow-ups on a schedule you set until vendors submit outstanding documents or renew expiring certificates. Reminders stop when the record is current or you cancel the workflow.",
  },
  {
    q: "Is this for accounts payable or compliance teams?",
    a: "Both. AP needs W-9s for 1099 reporting. Risk and operations need insurance and screening records. Keelstar keeps one vendor record both sides trust.",
  },
  {
    q: "Can we export records for audits?",
    a: "Yes. Export vendor compliance history including submission dates, reminders sent, and document versions when auditors or customers request evidence.",
  },
  {
    q: "How is this different from a spreadsheet tracker?",
    a: "Spreadsheets do not validate submissions, send reminders, or log actions automatically. Keelstar replaces manual follow-up with monitored workflows.",
  },
];
