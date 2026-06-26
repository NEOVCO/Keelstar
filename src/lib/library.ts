import type { Faq } from "./products";

/* ----------------------------- Glossary ----------------------------- */
export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string; // direct definition, answer-first
  why: string; // why it matters operationally
  examples?: string;
  product?: string;
  workflow?: string;
  guide?: string;
  related: string[]; // related term slugs
};

const g = (slug: string, term: string, definition: string, why: string, extra?: Partial<GlossaryTerm>): GlossaryTerm => ({
  slug,
  term,
  definition,
  why,
  examples: extra?.examples,
  product: extra?.product,
  workflow: extra?.workflow,
  guide: extra?.guide,
  related: extra?.related ?? [],
});

const coreGlossary: GlossaryTerm[] = [
  g("w-9", "W-9", "A W-9 (IRS Form W-9, Request for Taxpayer Identification Number and Certification) is the form a U.S. business asks a vendor or contractor to complete so it can report payments to the IRS.", "You generally can't issue a 1099 — or, in many cases, make a payment cleanly — without a current W-9 on file. A missing or stale W-9 can trigger backup withholding and creates audit risk.", { product: "w9-collector", workflow: "collect-w9s", guide: "how-to-collect-w9s-from-vendors", examples: "A marketing agency you pay $4,000 needs to be issued a 1099, which requires their W-9.", related: ["tin-matching", "backup-withholding"] }),
  g("certificate-of-insurance", "Certificate of Insurance (COI)", "A certificate of insurance is a one-page summary, usually on an ACORD form, that proves a party carries specific insurance coverage with stated limits and dates.", "A COI is only useful while it's current. If a vendor's coverage lapses and an incident occurs, the liability can land on you. Tracking expirations and required limits is the recurring job.", { product: "coi-tracker", workflow: "track-coi-expirations", guide: "what-to-check-on-a-certificate-of-insurance", examples: "A facilities vendor provides an ACORD 25 showing $1M general liability expiring in eight months.", related: ["acord-25", "additional-insured", "coverage-limit"] }),
  g("auto-renewal-clause", "Auto-Renewal Clause", "An auto-renewal (evergreen) clause causes a contract to renew automatically for another term unless one party gives notice to cancel within a defined window.", "Auto-renewal turns inattention into commitment. Miss the notice window and you're locked in for another term — the recurring risk Contract Renewal Tracker exists to monitor.", { product: "contract-renewal-tracker", workflow: "monitor-contract-renewals", guide: "how-to-track-contract-renewals", examples: "A SaaS contract renews for 12 months unless you give 60 days' notice before the renewal date.", related: ["notice-period", "evergreen-contract", "termination-for-convenience"] }),
  g("notice-period", "Notice Period", "A notice period is the amount of time before a contract's renewal or end date by which you must give notice to cancel or change it.", "The notice period — not the renewal date — is your real deadline. Working back from renewal through the notice period gives the date you must act by.", { product: "contract-renewal-tracker", workflow: "track-contract-notice-periods", guide: "how-to-find-a-contract-notice-period", examples: "A renewal date of December 31 with a 90-day notice period means the real deadline is October 2.", related: ["auto-renewal-clause", "evergreen-contract"] }),
  g("audit-trail", "Audit Trail", "An audit trail is a chronological record of who did what, and when, to a document or record — requests, edits, approvals, and exports.", "When finance, legal, or an auditor asks what happened, an audit trail is the answer. Keelstar builds one into every workflow so evidence is ready before it's requested.", { product: "platform", workflow: "build-audit-trails", guide: "what-makes-a-good-audit-trail", examples: "An invoice shows it was submitted, approved by two managers, and paid — each step stamped with a time and actor.", related: ["version-history", "role-based-access-control", "operational-workflow"] }),
  g("oig-exclusion", "OIG Exclusion", "An OIG exclusion means a person or entity has been barred by the U.S. Office of Inspector General from participating in federal healthcare programs, and appears on the LEIE list.", "Employing or contracting with an excluded party can carry significant penalties. Screening must be continuous, with dated evidence of each check.", { product: "exclusion-monitor", workflow: "screen-vendors-against-exclusion-lists", examples: "A clinic screens a new billing vendor against the OIG LEIE before granting system access.", related: ["ofac-sdn-list", "sam-exclusion"] }),
  g("acord-25", "ACORD 25", "ACORD 25 is the standard certificate of liability insurance form used to summarize a party's coverage, limits, and policy dates.", "Most COIs you receive are ACORD 25s. Knowing where to read coverage types, limits, and the expiration date is what makes tracking possible.", { product: "coi-tracker", workflow: "review-acord-certificates", examples: "An ACORD 25 lists general liability, auto, and umbrella coverage with each policy's expiration.", related: ["certificate-of-insurance", "additional-insured", "coverage-limit"] }),
  g("approval-matrix", "Approval Matrix", "An approval matrix defines who must approve a transaction based on criteria like amount, department, or vendor.", "Without a clear matrix, approvals happen ad hoc over email and break under audit. A defined matrix makes routing automatic and the trail defensible.", { product: "invoice-approval", workflow: "route-invoice-approvals", examples: "Invoices under $1,000 need one approver; over $10,000 need a director and the CFO.", related: ["segregation-of-duties", "audit-trail"] }),
  g("policy-acknowledgement", "Policy Acknowledgement", "A policy acknowledgement is a record that a person received, read, and accepted a specific version of a policy.", "Acknowledgement isn't one-and-done — new hires and policy revisions restart the cycle. The evidence that matters is which version each person accepted, and when.", { product: "policy-acknowledgement-tracker", workflow: "send-policy-acknowledgements", examples: "Every employee acknowledges v3 of the security policy after it's updated.", related: ["version-history", "attestation"] }),
  g("operational-workflow", "Operational Workflow", "An operational workflow is a recurring, document-driven business process — collecting, approving, monitoring, and auditing the records that keep a company running.", "These workflows usually live in spreadsheets, shared folders, and email reminders. Turning them into monitored workflows with audit trails is the core of what Keelstar does.", { product: "platform", workflow: "replace-spreadsheets-with-operational-workflows", related: ["audit-trail", "version-history"] }),
];

const briefGlossary: [string, string, string][] = [
  ["tin-matching", "TIN Matching", "Verifying that a vendor's Taxpayer Identification Number and name match IRS records."],
  ["backup-withholding", "Backup Withholding", "A required withholding on payments when a payee's TIN is missing or incorrect."],
  ["additional-insured", "Additional Insured", "A party added to another's insurance policy so it's covered under that policy."],
  ["coverage-limit", "Coverage Limit", "The maximum an insurer will pay under a policy for a covered loss."],
  ["evergreen-contract", "Evergreen Contract", "A contract that renews automatically and indefinitely until cancelled."],
  ["termination-for-convenience", "Termination for Convenience", "A clause letting a party end a contract without cause, usually with notice."],
  ["role-based-access-control", "Role-Based Access Control (RBAC)", "Granting system access based on a person's role rather than individually."],
  ["version-history", "Version History", "A record of each version of a document and the changes between them."],
  ["vendor-onboarding", "Vendor Onboarding", "The process of collecting the documents and details needed to do business with a new vendor."],
  ["ofac-sdn-list", "OFAC SDN List", "The U.S. Treasury list of Specially Designated Nationals subject to sanctions."],
  ["sam-exclusion", "SAM Exclusion", "A record in SAM.gov barring a party from federal contracts or assistance."],
  ["indemnification", "Indemnification", "A contractual promise by one party to cover certain losses of another."],
  ["limitation-of-liability", "Limitation of Liability", "A clause capping how much one party can owe the other under a contract."],
  ["electronic-signature", "Electronic Signature", "A legally recognized signature applied to a document electronically."],
  ["attestation", "Attestation", "A formal statement confirming something is true, such as reading a policy."],
  ["certification-expiration", "Certification Expiration", "The date a training certification or credential is no longer valid."],
  ["segregation-of-duties", "Segregation of Duties", "Splitting a process across people so no one controls every step."],
];

function makeGlossaryFiller(): GlossaryTerm[] {
  const extras: [string, string, string][] = [
    ["1099-nec", "1099-NEC", "The IRS form used to report nonemployee compensation paid to contractors."],
    ["beneficial-ownership", "Beneficial Ownership", "The individuals who ultimately own or control a legal entity."],
    ["coi-tracking", "COI Tracking", "Monitoring certificates of insurance for expirations and coverage requirements."],
    ["counterparty", "Counterparty", "The other party to a contract or transaction."],
    ["data-retention", "Data Retention", "How long records are kept before being archived or deleted."],
    ["due-diligence", "Due Diligence", "The review of a party or document before entering an agreement."],
    ["effective-date", "Effective Date", "The date a contract's terms begin to apply."],
    ["force-majeure", "Force Majeure", "A clause excusing performance due to extraordinary events."],
    ["governing-law", "Governing Law", "The jurisdiction whose laws interpret a contract."],
    ["indemnitee", "Indemnitee", "The party protected by an indemnification clause."],
    ["renewal-date", "Renewal Date", "The date a contract renews for a new term."],
    ["sanctions-screening", "Sanctions Screening", "Checking parties against sanctions and exclusion lists."],
    ["statement-of-work", "Statement of Work (SOW)", "A document defining deliverables, scope, and timelines."],
    ["taxpayer-identification-number", "Taxpayer Identification Number (TIN)", "An IRS number identifying a taxpayer, such as an EIN or SSN."],
    ["termination-clause", "Termination Clause", "Contract language defining how and when an agreement can end."],
    ["umbrella-coverage", "Umbrella Coverage", "Excess liability insurance above primary policy limits."],
    ["waiver-of-subrogation", "Waiver of Subrogation", "A clause preventing an insurer from recovering from a third party."],
    ["workflow-owner", "Workflow Owner", "The person accountable for a given operational workflow."],
    ["audit-evidence", "Audit Evidence", "The records that demonstrate a control or process was followed."],
    ["expiration-monitoring", "Expiration Monitoring", "Continuously tracking documents for upcoming expiration dates."],
    ["onboarding-packet", "Onboarding Packet", "The set of documents collected when bringing on a vendor or hire."],
    ["compliance-control", "Compliance Control", "A defined step that keeps a process within policy or regulation."],
    ["records-management", "Records Management", "The practice of organizing and retaining business records."],
  ];
  return extras.map(([slug, term, def]) =>
    g(slug, term, def, `Understanding ${term.toLowerCase()} helps teams keep the underlying documents accurate, current, and audit-ready.`, { related: [] })
  );
}

export const glossary: GlossaryTerm[] = [
  ...coreGlossary,
  ...briefGlossary.map(([slug, term, def]) =>
    g(slug, term, def, `Getting ${term.toLowerCase()} right keeps the related records accurate and reduces audit and compliance risk.`)
  ),
  ...makeGlossaryFiller(),
];

export function getTerm(slug: string) {
  return glossary.find((x) => x.slug === slug);
}

/* ----------------------------- Comparisons ----------------------------- */
export type Compare = {
  slug: string;
  title: string;
  alt: string; // what Keelstar is compared against
  forKeelstar: string;
  forAlt: string;
  keelstarStronger: string[];
  altStronger: string[];
  bestFit: string;
  migration: string;
  cta: string; // product slug
  fullCopy?: boolean;
};

const c = (slug: string, title: string, alt: string, cta: string, extra?: Partial<Compare>): Compare => ({
  slug,
  title,
  alt,
  cta,
  forKeelstar: extra?.forKeelstar ?? `Teams that need ${alt.toLowerCase()} to become a monitored workflow with reminders and an audit trail, not a manual chore.`,
  forAlt: extra?.forAlt ?? `Teams with very low volume or a one-time need, where ${alt.toLowerCase()} is occasional and monitoring isn't required.`,
  keelstarStronger: extra?.keelstarStronger ?? ["Continuous monitoring with reminders before deadlines", "A complete, exportable audit trail", "Validation so you stop collecting incomplete records", "Role-based access across the whole team"],
  altStronger: extra?.altStronger ?? ["No new tool to adopt for a true one-off", "Familiar to anyone already using it", "Zero cost for a single, low-stakes instance"],
  bestFit: extra?.bestFit ?? `Choose Keelstar when this is recurring and the evidence matters. Stick with ${alt.toLowerCase()} only when it's genuinely a one-time, low-risk task.`,
  migration: extra?.migration ?? `Migration is incremental: import what you already have, and start monitoring from day one. There's no rip-and-replace and no implementation project.`,
  fullCopy: extra?.fullCopy,
});

const coreCompare: Compare[] = [
  c("keelstar-vs-spreadsheets-for-w9-collection", "Keelstar vs Spreadsheets for W-9 Collection", "spreadsheets", "w9-collector", { fullCopy: true }),
  c("keelstar-vs-spreadsheets-for-coi-tracking", "Keelstar vs Spreadsheets for COI Tracking", "spreadsheets", "coi-tracker", { fullCopy: true }),
  c("keelstar-vs-spreadsheets-for-contract-renewals", "Keelstar vs Spreadsheets for Contract Renewals", "spreadsheets", "contract-renewal-tracker", { fullCopy: true }),
  c("keelstar-vs-erp-suites", "Keelstar vs ERP Suites", "an ERP suite", "platform", {
    fullCopy: true,
    forKeelstar: "Teams that need a specific workflow solved well today, without a six-figure implementation or a consultant.",
    forAlt: "Large enterprises standardizing finance, supply chain, and HR on a single system of record and willing to fund the rollout.",
    keelstarStronger: ["Live the same day, no implementation project", "Affordable and self-serve", "Focused tools that do one job extremely well", "Audit trails built into every workflow"],
    altStronger: ["Deep, integrated system of record", "Broad functional coverage in one place", "Fits organizations already committed to the suite"],
    bestFit: "Choose Keelstar to fix a specific operational gap now. Choose an ERP when you're consolidating an entire enterprise onto one platform.",
  }),
  c("keelstar-vs-docusign", "Keelstar vs DocuSign", "a standalone e-signature tool", "simple-signer", {
    fullCopy: true,
    forKeelstar: "Teams that send documents for signature and also want those documents monitored — for renewals, acknowledgements, and audit — on one platform.",
    forAlt: "Teams whose only need is high-volume, feature-rich electronic signature with deep integrations.",
    keelstarStronger: ["Signature plus monitoring on one platform", "Audit trail shared with your other workflows", "Simple, affordable, no enterprise tier required"],
    altStronger: ["Specialized, mature e-signature feature set", "Very broad third-party integrations", "Advanced signing workflows at scale"],
    bestFit: "Choose Keelstar when signature is one step in a monitored document workflow. Choose a dedicated e-signature tool when signing at scale is the whole job.",
  }),
];

function makeCompareFiller(): Compare[] {
  const items: [string, string, string, string][] = [
    ["keelstar-vs-email-for-vendor-documents", "Keelstar vs Email for Vendor Documents", "email", "vendor-packet"],
    ["keelstar-vs-certificate-tracking-services", "Keelstar vs Certificate Tracking Services", "outsourced certificate tracking services", "coi-tracker"],
    ["keelstar-vs-calendar-reminders-for-contracts", "Keelstar vs Calendar Reminders for Contracts", "calendar reminders", "contract-renewal-tracker"],
    ["keelstar-vs-spreadsheets-for-operational-workflows", "Keelstar vs Spreadsheets for Operational Workflows", "spreadsheets", "platform"],
    ["keelstar-vs-spreadsheets-for-vendor-onboarding", "Keelstar vs Spreadsheets for Vendor Onboarding", "spreadsheets", "vendor-packet"],
    ["keelstar-vs-manual-exclusion-screening", "Keelstar vs Manual Exclusion Screening", "manual exclusion screening", "exclusion-monitor"],
    ["keelstar-vs-spreadsheets-for-exclusion-screening", "Keelstar vs Spreadsheets for Exclusion Screening", "spreadsheets", "exclusion-monitor"],
    ["keelstar-vs-manual-contract-review", "Keelstar vs Manual Contract Review", "manual contract review", "contract-risk-scanner"],
    ["keelstar-vs-clm-suites", "Keelstar vs CLM Suites", "a contract-lifecycle-management suite", "contract-renewal-tracker"],
    ["keelstar-vs-email-for-policy-acknowledgements", "Keelstar vs Email for Policy Acknowledgements", "email", "policy-acknowledgement-tracker"],
    ["keelstar-vs-spreadsheets-for-policy-tracking", "Keelstar vs Spreadsheets for Policy Tracking", "spreadsheets", "policy-acknowledgement-tracker"],
    ["keelstar-vs-spreadsheets-for-training-records", "Keelstar vs Spreadsheets for Training Records", "spreadsheets", "training-record-tracker"],
    ["keelstar-vs-lms-for-compliance-tracking", "Keelstar vs an LMS for Compliance Tracking", "a learning management system", "training-record-tracker"],
    ["keelstar-vs-email-for-invoice-approvals", "Keelstar vs Email for Invoice Approvals", "email", "invoice-approval"],
    ["keelstar-vs-shared-folders-for-documents", "Keelstar vs Shared Folders for Documents", "shared folders", "platform"],
    ["keelstar-vs-outlook-reminders-for-renewals", "Keelstar vs Outlook Reminders for Renewals", "Outlook reminders", "contract-renewal-tracker"],
    ["keelstar-vs-manual-coi-collection", "Keelstar vs Manual COI Collection", "manual collection", "coi-tracker"],
    ["keelstar-vs-spreadsheets-for-audit-evidence", "Keelstar vs Spreadsheets for Audit Evidence", "spreadsheets", "platform"],
    ["keelstar-vs-diy-google-forms", "Keelstar vs DIY Google Forms", "do-it-yourself Google Forms", "w9-collector"],
    ["keelstar-vs-accounts-payable-modules", "Keelstar vs AP Modules", "a standalone accounts-payable module", "invoice-approval"],
  ];
  return items.map(([slug, title, alt, cta]) => c(slug, title, alt, cta));
}

export const compares: Compare[] = [...coreCompare, ...makeCompareFiller()];

export function getCompare(slug: string) {
  return compares.find((x) => x.slug === slug);
}

/* ----------------------------- Templates ----------------------------- */
export type Template = {
  slug: string;
  name: string;
  category: "Vendor Compliance" | "Contract Operations" | "HR Compliance" | "Finance Operations" | "Audits";
  forWhat: string;
  who: string;
  workflow: string;
  product: string;
  glossary: string[];
  guide?: string;
  fullCopy?: boolean;
};

const tpl = (slug: string, name: string, category: Template["category"], forWhat: string, who: string, workflow: string, product: string, extra?: Partial<Template>): Template => ({
  slug,
  name,
  category,
  forWhat,
  who,
  workflow,
  product,
  glossary: extra?.glossary ?? [],
  guide: extra?.guide,
  fullCopy: extra?.fullCopy,
});

export const templates: Template[] = [
  tpl("vendor-w9-request", "Vendor W-9 Request", "Vendor Compliance", "A clean, professional request to collect a W-9 from a new or existing vendor.", "AP and onboarding teams who need W-9s on file before paying.", "collect-w9s", "w9-collector", { glossary: ["w-9"], guide: "how-to-collect-w9s-from-vendors", fullCopy: true }),
  tpl("coi-tracking-log", "COI Tracking Log", "Vendor Compliance", "A structured log to track certificates of insurance, limits, and expiration dates.", "Risk and procurement teams tracking vendor insurance.", "track-coi-expirations", "coi-tracker", { glossary: ["certificate-of-insurance", "acord-25"], guide: "how-to-track-coi-expirations", fullCopy: true }),
  tpl("contract-renewal-log", "Contract Renewal Log", "Contract Operations", "A renewal calendar that captures renewal dates, notice periods, and decision deadlines.", "Operations and finance teams managing a contract portfolio.", "monitor-contract-renewals", "contract-renewal-tracker", { glossary: ["auto-renewal-clause", "notice-period"], guide: "how-to-track-contract-renewals", fullCopy: true }),
  tpl("invoice-approval-matrix", "Invoice Approval Matrix", "Finance Operations", "A matrix that defines who approves invoices by amount, department, and vendor.", "Finance and AP teams formalizing approvals.", "route-invoice-approvals", "invoice-approval", { glossary: ["approval-matrix", "segregation-of-duties"], fullCopy: true }),
  tpl("audit-evidence-pack", "Audit Evidence Pack", "Audits", "A structure for assembling audit evidence from your operational workflows.", "Compliance teams preparing for an audit or review.", "export-compliance-evidence", "platform", { glossary: ["audit-trail"], guide: "what-makes-a-good-audit-trail", fullCopy: true }),
  tpl("vendor-onboarding-checklist", "Vendor Onboarding Checklist", "Vendor Compliance", "A checklist of every document a new vendor must provide before going live.", "Procurement and onboarding teams.", "build-vendor-onboarding-packets", "vendor-packet", { glossary: ["vendor-onboarding"] }),
  tpl("insurance-requirements-checklist", "Insurance Requirements Checklist", "Vendor Compliance", "Define the coverage types and limits a vendor must carry.", "Risk teams setting insurance requirements.", "track-coi-expirations", "coi-tracker", { glossary: ["coverage-limit", "additional-insured"] }),
  tpl("notice-period-tracker", "Notice Period Tracker", "Contract Operations", "Track the real decision deadline for every contract by notice period.", "Teams avoiding accidental auto-renewals.", "track-contract-notice-periods", "contract-renewal-tracker", { glossary: ["notice-period"] }),
  tpl("contract-review-checklist", "Contract Review Checklist", "Contract Operations", "A checklist of the clauses to review before signing a contract.", "Anyone signing contracts without counsel in the room.", "review-contract-risk", "contract-risk-scanner", { glossary: ["indemnification", "limitation-of-liability"] }),
  tpl("signature-request", "Signature Request", "Contract Operations", "A clean request to send a document for signature.", "Teams collecting signatures regularly.", "send-documents-for-signature", "simple-signer", { glossary: ["electronic-signature"] }),
  tpl("policy-acknowledgement", "Policy Acknowledgement", "HR Compliance", "Distribute a policy and collect signed acknowledgements with versioning.", "HR and compliance teams.", "send-policy-acknowledgements", "policy-acknowledgement-tracker", { glossary: ["policy-acknowledgement", "version-history"] }),
  tpl("training-record-log", "Training Record Log", "HR Compliance", "Track training, certifications, and their expiration dates per person.", "HR, safety, and compliance teams.", "track-training-records", "training-record-tracker", { glossary: ["certification-expiration"] }),
  tpl("exclusion-screening-log", "Exclusion Screening Log", "Audits", "Record exclusion-list checks with dates, list versions, and dispositions.", "Compliance teams screening vendors and staff.", "screen-vendors-against-exclusion-lists", "exclusion-monitor", { glossary: ["oig-exclusion", "ofac-sdn-list"] }),
  tpl("permissions-matrix", "Permissions Matrix", "Audits", "Document who can access and act on each workflow.", "Admins setting role-based access.", "build-audit-trails", "platform", { glossary: ["role-based-access-control"] }),
];

export const templateCategories = ["Vendor Compliance", "Contract Operations", "HR Compliance", "Finance Operations", "Audits"] as const;

export function getTemplate(slug: string) {
  return templates.find((x) => x.slug === slug);
}
