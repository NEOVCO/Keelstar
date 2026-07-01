import type { Faq } from "@/lib/products";

export const vendorPortalFaqs: Faq[] = [
  {
    q: "What is a vendor portal?",
    a: "A vendor portal is a secure page where suppliers submit required documents—W-9s, certificates of insurance, banking details, and agreements—without emailing attachments back and forth. Your team tracks completion, sends reminders, and retains dated records.",
  },
  {
    q: "What is a supplier self-service portal?",
    a: "A supplier self-service portal is the same concept from the vendor's perspective: one link to see what you need, upload documents, and confirm submission. Keelstar does not require vendors to create accounts for one-time or recurring document requests.",
  },
  {
    q: "How is a supplier portal different from a vendor management system?",
    a: "A full VMS handles sourcing, contracts, performance scorecards, and spend analytics. A vendor portal focuses on document collection and compliance records—the layer most mid-market teams still run in email and spreadsheets.",
  },
  {
    q: "Do vendors need an account?",
    a: "No. Keelstar secure links work in the browser. Vendors complete what you request and move on. Your team keeps the persistent record and monitoring.",
  },
  {
    q: "Can we use a vendor portal alongside our ERP?",
    a: "Yes. Keelstar is the document and compliance layer. Export vendor records when you need to sync with accounts payable, procurement, or your ERP vendor master.",
  },
  {
    q: "How is this different from sharing a Google Drive folder?",
    a: "Shared drives lack validation, reminders, expiration tracking, and audit logs. A vendor portal records who submitted what and when—and chases what is missing automatically.",
  },
  {
    q: "Can one portal handle onboarding and renewals?",
    a: "Yes. The same vendor record supports initial onboarding and later re-collection when W-9s go stale or insurance certificates expire.",
  },
];
