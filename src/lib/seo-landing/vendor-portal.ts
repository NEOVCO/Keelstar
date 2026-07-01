import type { SeoLandingPageData } from "./types";

export const vendorPortal: SeoLandingPageData = {
  path: "/vendor-portal/",
  metaTitle: "Vendor Portal",
  metaDescription:
    "A vendor self-service portal to collect W-9s, certificates of insurance, and compliance documents through secure links—with reminders and audit records.",
  breadcrumb: "Vendor Portal",
  eyebrow: "Vendor portal",
  h1: "A vendor portal for document collection and compliance",
  hero:
    "Give vendors a single secure link to submit required documents. Your team tracks status, sends reminders, and exports dated records—without email attachments or shared drives.",
  problemTitle: "The common problem",
  problem:
    "Vendor documents arrive over email with no version history. AP and compliance teams cannot tell who submitted what, when it was last updated, or what is still missing. A supplier portal should fix that—not add another login vendors forget.",
  howTitle: "How Keelstar works",
  how: [
    {
      title: "Send a request",
      body: "Choose the documents you need and send a secure link. Vendors complete forms in the browser—no account required.",
    },
    {
      title: "Collect and validate",
      body: "Submissions land in one vendor record. Required fields are checked before acceptance so incomplete W-9s and insurance certificates do not slip through.",
    },
    {
      title: "Monitor and export",
      body: "Automated reminders chase outstanding items. Every action is logged for audits and exports when finance or legal asks for proof.",
    },
  ],
  benefitsTitle: "Benefits",
  benefits: [
    "One link instead of scattered email threads",
    "Version history when vendors re-submit",
    "Automated reminders until documents are complete",
    "Audit trail your team can defend",
  ],
  faqs: [
    {
      q: "What is a vendor portal?",
      a: "A vendor portal is a secure page where suppliers submit required documents—W-9s, certificates of insurance, banking details, and agreements—without emailing attachments back and forth.",
    },
    {
      q: "How is a supplier portal different from a vendor management system?",
      a: "A full VMS handles sourcing, contracts, and performance. A vendor portal focuses on document collection and compliance records—the operational layer most teams still run in spreadsheets.",
    },
    {
      q: "Do vendors need an account?",
      a: "No. Keelstar links work in the browser. Vendors complete what you request and move on.",
    },
    {
      q: "Can we use this alongside our ERP?",
      a: "Yes. Keelstar is the document and compliance layer. Export vendor records when you need to sync with accounts payable or procurement systems.",
    },
  ],
  ctaTitle: "Set up your vendor portal",
  ctaBody: "Start free. Send your first request the same day.",
  relatedLinks: [
    { label: "Vendor compliance", href: "/vendor-compliance/" },
    { label: "Vendor onboarding", href: "/vendor-onboarding/" },
  ],
};
