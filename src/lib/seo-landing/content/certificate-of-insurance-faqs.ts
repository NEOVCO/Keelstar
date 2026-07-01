import type { Faq } from "@/lib/products";

export const certificateOfInsuranceFaqs: Faq[] = [
  {
    q: "What is a certificate of insurance?",
    a: "A certificate of insurance is a summary document—often ACORD 25—that shows a vendor's liability coverage, policy numbers, and expiration dates. It is not the policy itself.",
  },
  {
    q: "What is an ACORD certificate of insurance?",
    a: "ACORD 25 is the standard form brokers use to evidence general liability, auto, workers compensation, and umbrella coverage. Keelstar stores the document and key dates from each submission.",
  },
  {
    q: "How often should we collect updated certificates?",
    a: "At minimum before expiration. Many teams also require updated certificates when coverage limits change or when a vendor starts work at a new location.",
  },
  {
    q: "Can we track contractor insurance certificates the same way?",
    a: "Yes. The same workflow applies to contractors, subcontractors, and any vendor where you need proof of insurance on file.",
  },
  {
    q: "What happens when a certificate expires?",
    a: "Keelstar flags expired and expiring certificates and can send reminders to vendors or brokers until a current certificate is on file.",
  },
  {
    q: "Do we need the full policy or just the certificate?",
    a: "Most operational programs rely on the certificate for evidence of coverage. Contracts may require additional insured endorsements—confirm those requirements separately.",
  },
  {
    q: "How is this different from a COI spreadsheet?",
    a: "Spreadsheets do not collect documents, send renewal reminders, or log submission history. Keelstar connects the certificate file to monitored expiration dates and vendor records.",
  },
];
