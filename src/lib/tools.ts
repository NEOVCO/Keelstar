import type { Faq } from "./products";

export type Tool = {
  slug: string;
  name: string;
  outcome: string; // one-sentence utility outcome
  inputLabel: string;
  inputKind: "paste" | "upload" | "search" | "form";
  privacy: string;
  examples: string[];
  faqs: Faq[];
  product: string; // related product slug
  workflow: string; // related workflow slug
  glossary: string[];
  template?: string;
  fullCopy?: boolean;
};

const defaultPrivacy =
  "Your first run happens in your browser. Nothing is saved to a Keelstar account until you choose to monitor it — and shared results are private by default.";

const t = (
  slug: string,
  name: string,
  outcome: string,
  inputKind: Tool["inputKind"],
  inputLabel: string,
  product: string,
  workflow: string,
  extra?: Partial<Tool>
): Tool => ({
  slug,
  name,
  outcome,
  inputKind,
  inputLabel,
  privacy: extra?.privacy ?? defaultPrivacy,
  examples: extra?.examples ?? [],
  faqs: extra?.faqs ?? [],
  product,
  workflow,
  glossary: extra?.glossary ?? [],
  template: extra?.template,
  fullCopy: extra?.fullCopy,
});

export const tools: Tool[] = [
  t("w9-request-generator", "W-9 Request Generator", "Generate a clean, professional W-9 request you can send a vendor in seconds.", "form", "Vendor name and email", "w9-collector", "collect-w9s", {
    fullCopy: true,
    examples: ["A new vendor can't be paid until you have their W-9 on file.", "You need to re-request a W-9 because the one on file is years old.", "You're onboarding ten vendors at once and want a consistent request."],
    glossary: ["w-9", "tin-matching", "backup-withholding"],
    template: "vendor-w9-request",
    faqs: [
      { q: "Is the generated request legally binding?", a: "It's a request for the vendor to complete an IRS Form W-9. The W-9 itself is the document of record; this tool just produces a clean, consistent request." },
      { q: "Can I send to many vendors at once?", a: "This free tool generates one request at a time. To bulk-request and then monitor responses, move the workflow into W-9 Collector." },
    ],
  }),
  t("w9-completion-checker", "W-9 Completion Checker", "Check whether a W-9 is complete and signed before you file it.", "upload", "Upload a W-9 PDF", "w9-collector", "collect-w9s", { glossary: ["w-9", "tin-matching"] }),
  t("w9-vs-w8-guide-tool", "W-9 vs W-8 Guide", "Answer a few questions and find out whether a vendor needs a W-9 or a W-8.", "form", "A few questions about the vendor", "w9-collector", "request-tax-documents-from-vendors", { glossary: ["w-9"] }),
  t("acord-analyzer", "ACORD Analyzer", "Read coverage, limits, and the expiration date off an ACORD certificate instantly.", "upload", "Upload an ACORD 25 certificate", "coi-tracker", "review-acord-certificates", {
    fullCopy: true,
    examples: ["A vendor just sent a certificate and you need to confirm it meets your limits.", "You want the expiration date without reading the whole form.", "You're checking whether your company is listed as additional insured."],
    glossary: ["acord-25", "certificate-of-insurance", "additional-insured", "coverage-limit"],
    template: "coi-tracking-log",
    faqs: [
      { q: "What does the analyzer read?", a: "Expiration date, coverage types, limits, and the insured and certificate holder. You can correct any field before saving." },
      { q: "Can it monitor expirations for me?", a: "The free tool reads one certificate. To track expirations continuously and get reminders, move it into COI Tracker." },
    ],
  }),
  t("coi-expiration-extractor", "COI Expiration Extractor", "Pull the expiration date off a certificate of insurance in one step.", "upload", "Upload a certificate", "coi-tracker", "track-coi-expirations", { glossary: ["certificate-of-insurance", "acord-25"] }),
  t("vendor-onboarding-packet-generator", "Vendor Onboarding Packet Generator", "Build a checklist of the documents a new vendor needs to provide.", "form", "Vendor type and requirements", "vendor-packet", "build-vendor-onboarding-packets", { glossary: ["vendor-onboarding"], template: "vendor-onboarding-checklist" }),
  t("oig-search", "OIG Exclusion Search", "Search the OIG List of Excluded Individuals and Entities for a name.", "search", "Name to screen", "exclusion-monitor", "screen-vendors-against-exclusion-lists", {
    fullCopy: true,
    examples: ["You're onboarding a healthcare vendor and must confirm they aren't excluded.", "You need a dated record of an OIG check for your compliance file.", "You're spot-checking an employee before a placement."],
    glossary: ["oig-exclusion"],
    template: "exclusion-screening-log",
    faqs: [
      { q: "Is one search enough for compliance?", a: "Exclusion screening is meant to be continuous. A single search is a point-in-time check — to re-screen on a schedule and keep dated evidence, use Exclusion Monitor." },
      { q: "What does a potential match mean?", a: "Names can collide. A potential match needs review and a recorded disposition before you rely on it — that review is part of a defensible audit trail." },
    ],
  }),
  t("ofac-search", "OFAC Search", "Search the OFAC Specially Designated Nationals (SDN) list for a name.", "search", "Name to screen", "exclusion-monitor", "screen-vendors-against-exclusion-lists", { glossary: ["ofac-sdn-list"], template: "exclusion-screening-log" }),
  t("sam-search", "SAM Search", "Search SAM.gov exclusions for a name or entity.", "search", "Name or entity to screen", "exclusion-monitor", "screen-vendors-against-exclusion-lists", { glossary: ["sam-exclusion"], template: "exclusion-screening-log" }),
  t("exclusion-report-builder", "Exclusion Report Builder", "Compile your exclusion checks into one shareable, dated report.", "form", "Select checks to include", "exclusion-monitor", "build-audit-trails", { glossary: ["audit-trail"], template: "exclusion-screening-log" }),
  t("contract-renewal-extractor", "Contract Renewal Extractor", "Extract the renewal date, term, and notice period from a contract.", "upload", "Upload a contract PDF", "contract-renewal-tracker", "monitor-contract-renewals", {
    fullCopy: true,
    examples: ["A contract is about to auto-renew and you need the notice deadline.", "You're building a renewal calendar from a stack of agreements.", "You want to confirm the term length before a budget review."],
    glossary: ["auto-renewal-clause", "notice-period", "evergreen-contract"],
    template: "contract-renewal-log",
    faqs: [
      { q: "Which dates does it find?", a: "Effective date, term length, renewal date, and notice period — and it calculates the decision deadline you must act by." },
      { q: "Can it remind me?", a: "The free tool reads one contract. To monitor a whole portfolio with reminders before each notice window, use Contract Renewal Tracker." },
    ],
  }),
  t("notice-period-calculator", "Notice Period Calculator", "Work back from a renewal date to the last day you can give notice.", "form", "Renewal date and notice period", "contract-renewal-tracker", "track-contract-notice-periods", { glossary: ["notice-period"] }),
  t("termination-clause-scanner", "Termination Clause Scanner", "Find and summarize the termination clause in a contract.", "upload", "Upload a contract", "contract-risk-scanner", "review-contract-risk", { glossary: ["termination-for-convenience"] }),
  t("contract-risk-clause-scanner", "Contract Risk Clause Scanner", "Surface the clauses in a contract that carry commercial risk.", "upload", "Upload a contract", "contract-risk-scanner", "review-contract-risk", { glossary: ["indemnification", "limitation-of-liability"], template: "contract-review-checklist" }),
  t("pdf-signer", "PDF Signer", "Add a signature to a PDF and download the signed copy.", "upload", "Upload a PDF to sign", "simple-signer", "send-documents-for-signature", { glossary: ["electronic-signature"], template: "signature-request" }),
  t("policy-acknowledgment-link-maker", "Policy Acknowledgment Link Maker", "Create a link that collects a signed acknowledgment of a policy.", "upload", "Upload a policy document", "policy-acknowledgment-tracker", "send-policy-acknowledgments", { glossary: ["policy-acknowledgment", "attestation"], template: "policy-acknowledgment" }),
  t("training-expiration-calculator", "Training Expiration Calculator", "Calculate when a certification expires from its completion date.", "form", "Completion date and validity period", "training-record-tracker", "monitor-certification-expirations", { glossary: ["certification-expiration"], template: "training-record-log" }),
  t("invoice-field-extractor", "Invoice Field Extractor", "Pull vendor, amount, date, and invoice number from an invoice.", "upload", "Upload an invoice", "invoice-approval", "route-invoice-approvals", { glossary: ["approval-matrix"] }),
  t("approval-matrix-builder", "Approval Matrix Builder", "Design an approval matrix by amount, department, or vendor.", "form", "Define your approval thresholds", "invoice-approval", "route-invoice-approvals", { glossary: ["approval-matrix", "segregation-of-duties"], template: "invoice-approval-matrix" }),
  t("audit-trail-export-preview", "Audit Trail Export Preview", "See what a Keelstar audit-trail export looks like before you commit.", "form", "Choose a workflow to preview", "platform", "export-compliance-evidence", { glossary: ["audit-trail", "version-history"], template: "audit-evidence-pack" }),
];

export function getTool(slug: string) {
  return tools.find((x) => x.slug === slug);
}
