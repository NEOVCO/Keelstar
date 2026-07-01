import type { Faq } from "@/lib/products";

export const w9CollectionFaqs: Faq[] = [
  {
    q: "How do I request a W-9 from a vendor?",
    a: "Send a Keelstar secure link that walks the vendor through Form W-9, or use our free W-9 request generator to draft a professional email with your company and vendor names.",
  },
  {
    q: "What is a vendor W-9?",
    a: "Form W-9 is the IRS document vendors complete to provide their legal name, tax classification, and taxpayer identification number for 1099 reporting.",
  },
  {
    q: "When should we re-collect a W-9?",
    a: "When a vendor changes legal entity, address, or tax ID—or when your records are older than your policy allows. Keelstar can flag stale W-9s automatically.",
  },
  {
    q: "Does Keelstar file 1099s?",
    a: "No. Keelstar collects and stores W-9 records. Your accounting system or payroll provider handles 1099 filing.",
  },
  {
    q: "Can vendors submit W-9 without creating an account?",
    a: "Yes. Keelstar secure links work in the browser. Vendors complete Form W-9 and submit—no login required.",
  },
  {
    q: "What if a vendor sends an incomplete W-9?",
    a: "Keelstar validates required fields before acceptance. Incomplete forms are rejected with guidance so vendors can correct and resubmit.",
  },
  {
    q: "Is there a free W-9 request template?",
    a: "Yes. Use the W-9 request generator to draft a professional email. Upgrade to tracked W-9 collection when you need reminders and audit history.",
  },
];
