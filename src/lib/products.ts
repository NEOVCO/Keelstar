export type Step = { title: string; body: string };
export type Faq = { q: string; a: string };

export type Product = {
  slug: string;
  name: string;
  cluster: "Vendor Compliance" | "Contract Operations" | "HR Compliance" | "Finance Operations" | "Platform";
  node: "Collect" | "Extract" | "Approve" | "Monitor" | "Audit";
  job: string; // hero headline — the job-to-be-done
  sub: string; // hero subhead
  who: string; // who it's for
  whatItDoes: string[];
  how: Step[];
  monitoring: string; // recurring monitored value
  audit: string; // evidence / audit output
  utility?: { label: string; href: string }; // embedded tool launcher
  faqs: Faq[];
  relatedWorkflows: string[];
  relatedTools: string[];
  relatedGlossary: string[];
  relatedTemplates: string[];
  relatedCompare: string[];
};

export const products: Product[] = [
  {
    slug: "w9-collector",
    name: "W-9 Collector",
    cluster: "Vendor Compliance",
    node: "Collect",
    job: "Collect W-9s without email chains.",
    sub: "Send a request, get a clean, validated W-9 back, and keep every version on file — without chasing anyone over email.",
    who: "Accounts payable, vendor onboarding, and finance teams who need a current W-9 on file before they can cut a payment.",
    whatItDoes: [
      "Sends a branded request link a vendor can complete in their browser — no account required on their end.",
      "Validates the TIN format, legal name, and signature fields before the form is accepted, so you stop collecting incomplete W-9s.",
      "Stores every submission with a timestamp, version history, and a complete record of who requested what and when.",
      "Reminds non-responders automatically so collection doesn't stall in someone's inbox.",
    ],
    how: [
      { title: "Request", body: "Paste a list of vendors or add one by hand. Keelstar sends each a secure request link." },
      { title: "Collect", body: "The vendor fills out the W-9 in their browser. Required fields are validated before submission." },
      { title: "Keep", body: "The signed W-9 lands in your workspace with a full audit trail and is monitored for re-collection when it goes stale." },
    ],
    monitoring:
      "A W-9 isn't a one-time task. Legal names change, entities reorganize, and a W-9 on file from four years ago may no longer match what's on the payment. Keelstar tracks the age and status of every W-9 and flags the ones that need re-collection — so you're never cutting a payment against a stale record.",
    audit:
      "Every request, reminder, submission, and download is logged with a timestamp and actor. Export the full W-9 packet plus its history as evidence whenever finance, an auditor, or the IRS asks.",
    utility: { label: "Generate a W-9 request", href: "/tools/w9-request-generator/" },
    faqs: [
      { q: "Does the vendor need a Keelstar account?", a: "No. The vendor completes the W-9 through a secure link in their browser. Accounts are only for the team collecting and monitoring the records." },
      { q: "Can I bulk-request from a vendor list?", a: "Yes. Paste or upload a list and Keelstar sends each vendor an individual secure request, then tracks responses and reminders for the whole batch." },
      { q: "What happens when a W-9 goes out of date?", a: "Keelstar tracks the age of every W-9 and flags records for re-collection based on the rules you set, so stale forms surface before they cause a payment problem." },
      { q: "Where are the W-9s stored?", a: "In your Keelstar workspace, with version history and role-based access. You can export any record or the full set at any time." },
    ],
    relatedWorkflows: ["collect-w9s", "request-tax-documents-from-vendors", "build-vendor-onboarding-packets"],
    relatedTools: ["w9-request-generator", "w9-completion-checker", "w9-vs-w8-guide-tool"],
    relatedGlossary: ["w-9", "tin-matching", "backup-withholding"],
    relatedTemplates: ["vendor-w9-request", "vendor-onboarding-checklist"],
    relatedCompare: ["keelstar-vs-spreadsheets-for-w9-collection", "keelstar-vs-email-for-vendor-documents"],
  },
  {
    slug: "coi-tracker",
    name: "COI Tracker",
    cluster: "Vendor Compliance",
    node: "Monitor",
    job: "Track insurance certificates before they expire.",
    sub: "Collect certificates of insurance, read the expiration and coverage details automatically, and get warned before a vendor goes uninsured.",
    who: "Risk, procurement, and operations teams who require vendors, subcontractors, or tenants to carry insurance and can't afford a lapse.",
    whatItDoes: [
      "Collects ACORD certificates through a request link or accepts uploads from your team.",
      "Reads the expiration date, coverage types, and limits off the certificate so you don't re-key them into a spreadsheet.",
      "Tracks every certificate against your requirements and flags coverage that is expiring, expired, or below the limit you require.",
      "Notifies the right person — and optionally the vendor — before the certificate lapses.",
    ],
    how: [
      { title: "Collect", body: "Request certificates from vendors or upload the ones you already have." },
      { title: "Extract", body: "Keelstar reads expiration dates, coverage types, and limits from the ACORD form." },
      { title: "Monitor", body: "Each certificate is tracked against your requirements, with reminders before anything expires." },
    ],
    monitoring:
      "Insurance is the definition of recurring value: a certificate is only useful while it's current. Keelstar watches every expiration date and coverage requirement continuously, so the moment a vendor's policy is about to lapse — or already has — the right person knows, with time to act.",
    audit:
      "Keep a dated record of every certificate you held, when it was valid, and what it covered. When a claim or audit asks 'was this vendor insured on the day of the incident?', you have the evidence on file.",
    utility: { label: "Analyze an ACORD certificate", href: "/tools/acord-analyzer/" },
    faqs: [
      { q: "Which certificate formats are supported?", a: "Standard ACORD 25 certificates of liability insurance and common variants. Keelstar reads expiration dates, coverage types, and limits, and lets you correct anything by hand." },
      { q: "Can I set coverage requirements per vendor?", a: "Yes. Define required coverage types and minimum limits, and Keelstar flags any certificate that falls short, not just the expired ones." },
      { q: "Who gets notified before expiration?", a: "You choose. Notify an internal owner, a team, and optionally the vendor, on a schedule you control ahead of the expiration date." },
      { q: "Can I see historical coverage?", a: "Yes. Every certificate is retained with its valid dates, so you can answer coverage questions about any point in the past." },
    ],
    relatedWorkflows: ["track-coi-expirations", "review-acord-certificates", "build-vendor-onboarding-packets"],
    relatedTools: ["acord-analyzer", "coi-expiration-extractor", "vendor-onboarding-packet-generator"],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "additional-insured", "coverage-limit"],
    relatedTemplates: ["coi-tracking-log", "insurance-requirements-checklist"],
    relatedCompare: ["keelstar-vs-spreadsheets-for-coi-tracking", "keelstar-vs-certificate-tracking-services"],
  },
  {
    slug: "contract-renewal-tracker",
    name: "Contract Renewal Tracker",
    cluster: "Contract Operations",
    node: "Monitor",
    job: "Monitor contract renewals before notice periods pass.",
    sub: "Extract renewal and notice-period dates from your contracts and get warned in time to renew, renegotiate, or cancel on purpose — not by default.",
    who: "Operations, finance, and legal-adjacent teams who manage a portfolio of vendor, software, and service contracts and keep getting surprised by auto-renewals.",
    whatItDoes: [
      "Reads renewal dates, term lengths, and notice periods out of uploaded contracts.",
      "Calculates the real decision deadline — the date you must act by to hit the notice window — not just the renewal date.",
      "Tracks every contract on one timeline so nothing auto-renews silently.",
      "Notifies the owner ahead of each notice deadline with enough lead time to actually decide.",
    ],
    how: [
      { title: "Add", body: "Upload contracts or forward them in. Keelstar extracts the key dates and clauses." },
      { title: "Calculate", body: "Keelstar works back from the renewal date through the notice period to find your real deadline." },
      { title: "Monitor", body: "Each contract sits on a renewal timeline with reminders before the decision window closes." },
    ],
    monitoring:
      "An auto-renewing contract is a recurring liability, not a one-time signature. The value isn't knowing the renewal date once — it's being reminded, every cycle, before the notice period closes. Keelstar monitors the whole portfolio continuously so a renewal is always a decision you made, never one that happened to you.",
    audit:
      "Keep a record of every renewal date, notice deadline, and the decision made each cycle. When someone asks why a contract renewed — or didn't — the timeline answers it.",
    utility: { label: "Extract renewal dates from a contract", href: "/tools/contract-renewal-extractor/" },
    faqs: [
      { q: "What dates does Keelstar extract?", a: "Effective date, term length, renewal date, and notice period. From those it calculates the decision deadline — the last day you can give notice." },
      { q: "What if the contract language is ambiguous?", a: "Keelstar surfaces the clause it read and lets you confirm or correct the dates, so the monitored deadline is always one you've verified." },
      { q: "How far ahead are reminders sent?", a: "You set the lead time per contract or as a default, so high-value agreements can warn you months before the notice window closes." },
      { q: "Can multiple people own different contracts?", a: "Yes. Assign an owner per contract; reminders route to them, and the full portfolio stays visible to the team with the right permissions." },
    ],
    relatedWorkflows: ["monitor-contract-renewals", "track-contract-notice-periods", "review-contract-risk"],
    relatedTools: ["contract-renewal-extractor", "notice-period-calculator", "termination-clause-scanner"],
    relatedGlossary: ["auto-renewal-clause", "notice-period", "evergreen-contract", "termination-for-convenience"],
    relatedTemplates: ["contract-renewal-log", "notice-period-tracker"],
    relatedCompare: ["keelstar-vs-spreadsheets-for-contract-renewals", "keelstar-vs-calendar-reminders-for-contracts"],
  },
  {
    slug: "platform",
    name: "Keelstar Platform",
    cluster: "Platform",
    node: "Audit",
    job: "One platform. Many focused applications.",
    sub: "Every Keelstar application sits on shared infrastructure for audit logging, permissions, notifications, exports, and security — so you standardize once and add workflows as you need them.",
    who: "Teams that want focused tools that solve one problem each, on a common foundation they can trust and grow into — without an enterprise implementation project.",
    whatItDoes: [
      "Gives every application the same audit logging, so evidence looks identical whether it's a W-9 or an invoice approval.",
      "Applies role-based permissions consistently across workflows, so access is one decision, not ten.",
      "Sends notifications and reminders from one reliable system instead of a patchwork of inboxes and calendars.",
      "Exports records and history from any workflow in formats you can hand to finance, legal, or an auditor.",
    ],
    how: [
      { title: "Start with one", body: "Adopt a single application — say W-9 Collector — and get value the same day." },
      { title: "Add workflows", body: "Turn on COI Tracking, contract renewals, or approvals when you need them. Same platform, same login." },
      { title: "Standardize", body: "Audit trails, permissions, and exports work the same everywhere, so the whole operation runs on one credible foundation." },
    ],
    monitoring:
      "The platform's job is to make monitoring the default. Audit logs, version history, and notifications aren't features you bolt on — they're built into every workflow from the first day, so recurring value compounds as you add applications.",
    audit:
      "Audit logging is built into every workflow. Every action across every application is recorded with an actor and timestamp and can be exported as evidence. Security documentation is available on request.",
    faqs: [
      { q: "Do I have to adopt everything at once?", a: "No. Keelstar is one platform made of focused applications. Start with one, add more when you need them — there's no implementation project." },
      { q: "How do permissions work across applications?", a: "Role-based permissions are applied consistently platform-wide, so granting or revoking access is a single, auditable decision rather than per-tool configuration." },
      { q: "Can we export our data?", a: "Yes. Every workflow supports exporting records and their full history. Your evidence is portable by design." },
      { q: "What about security and compliance?", a: "Audit logging is built into every workflow, access is role-based, and security documentation is available on request. See the Security and Trust pages for detail." },
    ],
    relatedWorkflows: ["build-audit-trails", "export-compliance-evidence", "replace-spreadsheets-with-operational-workflows"],
    relatedTools: ["audit-trail-export-preview", "approval-matrix-builder", "exclusion-report-builder"],
    relatedGlossary: ["audit-trail", "role-based-access-control", "version-history", "operational-workflow"],
    relatedTemplates: ["audit-evidence-pack", "permissions-matrix"],
    relatedCompare: ["keelstar-vs-erp-suites", "keelstar-vs-spreadsheets-for-operational-workflows"],
  },
];

// Remaining products — scaffolded with consistent voice, ready to expand to full copy.
const scaffoldProducts: Product[] = [
  {
    slug: "vendor-packet",
    name: "Vendor Packet",
    cluster: "Vendor Compliance",
    node: "Collect",
    job: "Collect every vendor document in one secure flow.",
    sub: "Request W-9s, insurance certificates, banking details, and signed agreements as a single onboarding packet — and know exactly what's still outstanding.",
    who: "Vendor onboarding and procurement teams who collect several documents per vendor and lose track of what's missing.",
    whatItDoes: [
      "Bundles every required document into one request a vendor completes in a single session.",
      "Shows a live checklist of what's received, validated, and still outstanding per vendor.",
      "Validates each document as it arrives so incomplete packets don't slip through.",
      "Keeps the whole packet together with one audit trail.",
    ],
    how: [
      { title: "Define", body: "Choose the documents this vendor type must provide." },
      { title: "Request", body: "Send one packet link; the vendor completes everything in order." },
      { title: "Track", body: "Watch the checklist complete and monitor each document for expiration." },
    ],
    monitoring:
      "Onboarding is the start, not the end. Keelstar keeps monitoring each document in the packet — insurance that expires, W-9s that go stale — so an onboarded vendor stays compliant, not just compliant on day one.",
    audit: "Every document, validation, and reminder is logged together as one vendor record you can export on demand.",
    faqs: [
      { q: "Can packets differ by vendor type?", a: "Yes. Define different required-document sets and apply the right packet to each vendor." },
      { q: "What if a vendor only completes part of the packet?", a: "Keelstar shows exactly what's outstanding and reminds the vendor until the packet is complete." },
    ],
    relatedWorkflows: ["build-vendor-onboarding-packets", "collect-w9s", "track-coi-expirations"],
    relatedTools: ["vendor-onboarding-packet-generator", "w9-request-generator", "acord-analyzer"],
    relatedGlossary: ["vendor-onboarding", "certificate-of-insurance", "w-9"],
    relatedTemplates: ["vendor-onboarding-checklist", "vendor-w9-request"],
    relatedCompare: ["keelstar-vs-spreadsheets-for-vendor-onboarding", "keelstar-vs-email-for-vendor-documents"],
  },
  {
    slug: "exclusion-monitor",
    name: "Exclusion Monitor",
    cluster: "Vendor Compliance",
    node: "Monitor",
    job: "Monitor exclusion lists and keep the audit record.",
    sub: "Screen vendors and employees against OIG and OFAC exclusion lists on a schedule — and keep dated evidence of every check.",
    who: "Compliance teams in healthcare, government contracting, and finance who must screen parties against exclusion and sanctions lists.",
    whatItDoes: [
      "Screens names against OIG LEIE and OFAC (SDN) exclusion lists.",
      "Re-runs checks on a schedule so screening is continuous, not a one-time event.",
      "Records the result, list version, and date of every check as evidence.",
      "Flags potential matches for review with a clear disposition trail.",
    ],
    how: [
      { title: "Add parties", body: "Import the vendors or employees you need to screen." },
      { title: "Screen", body: "Keelstar checks each against the exclusion lists and flags potential matches." },
      { title: "Monitor", body: "Checks re-run on schedule and every result is kept as dated evidence." },
    ],
    monitoring:
      "A clean screen today says nothing about next month. Keelstar re-screens on a schedule and keeps the running record, so exclusion monitoring is continuous and provable.",
    audit: "Every check is stamped with the list version, date, and disposition — the exact evidence auditors ask for.",
    faqs: [
      { q: "Which lists are covered?", a: "OIG LEIE and OFAC SDN exclusions, with a dated record of each screen." },
      { q: "How are potential matches handled?", a: "Possible matches are flagged for review and you record a disposition, which becomes part of the audit trail." },
    ],
    relatedWorkflows: ["screen-vendors-against-exclusion-lists", "screen-employees-against-exclusion-lists", "build-audit-trails"],
    relatedTools: ["oig-search", "ofac-search", "exclusion-report-builder"],
    relatedGlossary: ["oig-exclusion", "ofac-sdn-list", "oig-exclusion"],
    relatedTemplates: ["exclusion-screening-log", "audit-evidence-pack"],
    relatedCompare: ["keelstar-vs-manual-exclusion-screening", "keelstar-vs-spreadsheets-for-exclusion-screening"],
  },
  {
    slug: "contract-risk-scanner",
    name: "Contract Risk Scanner",
    cluster: "Contract Operations",
    node: "Extract",
    job: "Review contract clauses and flag commercial risk.",
    sub: "Scan a contract for the clauses that carry commercial risk — auto-renewal, liability, indemnification, termination — and get a structured review in minutes.",
    who: "Operations and finance teams who sign contracts without a lawyer in the room and need a fast, consistent risk read.",
    whatItDoes: [
      "Identifies high-impact clauses and surfaces them for review.",
      "Flags terms that commonly carry commercial risk.",
      "Produces a consistent, structured summary you can act on or escalate.",
      "Keeps the review attached to the contract record.",
    ],
    how: [
      { title: "Upload", body: "Add the contract you're about to sign." },
      { title: "Scan", body: "Keelstar surfaces the clauses that matter and flags risk." },
      { title: "Decide", body: "Act on the summary or route it to counsel with the risks already isolated." },
    ],
    monitoring: "Pair risk scanning with renewal tracking so the clauses you flagged at signing are monitored through every renewal cycle.",
    audit: "Each scan is saved with the contract, so there's a record of what was reviewed and when.",
    faqs: [
      { q: "Does this replace a lawyer?", a: "No. It gives a fast, consistent first read so you know what to escalate. It does not provide legal advice." },
      { q: "Which clauses are flagged?", a: "Common commercial-risk clauses including auto-renewal, liability, indemnification, and termination terms." },
    ],
    relatedWorkflows: ["review-contract-risk", "monitor-contract-renewals", "track-contract-notice-periods"],
    relatedTools: ["contract-risk-clause-scanner", "termination-clause-scanner", "contract-renewal-extractor"],
    relatedGlossary: ["indemnification", "limitation-of-liability", "auto-renewal-clause"],
    relatedTemplates: ["contract-review-checklist", "contract-renewal-log"],
    relatedCompare: ["keelstar-vs-manual-contract-review", "keelstar-vs-clm-suites"],
  },
  {
    slug: "simple-signer",
    name: "Simple Signer",
    cluster: "Contract Operations",
    node: "Approve",
    job: "Send documents for signature without the enterprise suite.",
    sub: "Send a document, collect a legally sound signature, and keep the signed copy with its audit trail — without paying for a heavyweight e-signature platform.",
    who: "Small and mid-size teams who send documents for signature regularly and don't need an enterprise contract-lifecycle suite.",
    whatItDoes: [
      "Sends documents for signature with a clear, simple signer experience.",
      "Collects signatures with a timestamped completion record.",
      "Stores the executed document with its audit trail.",
      "Reminds signers who haven't completed.",
    ],
    how: [
      { title: "Prepare", body: "Upload the document and mark where signatures go." },
      { title: "Send", body: "Signers complete in their browser, no account required." },
      { title: "Keep", body: "The executed copy is stored with a completion certificate and audit trail." },
    ],
    monitoring: "Connect signed agreements to renewal tracking so what you executed is monitored for renewal and notice periods.",
    audit: "Each signature includes a timestamped completion record retained with the document.",
    faqs: [
      { q: "Is the signature legally valid?", a: "Signatures are collected with a timestamped audit record. For specific legal requirements, confirm with your counsel." },
      { q: "Do signers need an account?", a: "No. They sign through a secure link in the browser." },
    ],
    relatedWorkflows: ["send-documents-for-signature", "send-policy-acknowledgments", "build-vendor-onboarding-packets"],
    relatedTools: ["pdf-signer", "policy-acknowledgment-link-maker", "vendor-onboarding-packet-generator"],
    relatedGlossary: ["electronic-signature", "audit-trail", "version-history"],
    relatedTemplates: ["signature-request", "vendor-onboarding-checklist"],
    relatedCompare: ["keelstar-vs-docusign", "keelstar-vs-email-for-vendor-documents"],
  },
  {
    slug: "policy-acknowledgment-tracker",
    name: "Policy Acknowledgment Tracker",
    cluster: "HR Compliance",
    node: "Collect",
    job: "Send policies, collect acknowledgments, and keep version history.",
    sub: "Distribute a policy, collect signed acknowledgments from everyone who needs to read it, and keep a version-controlled record of who accepted which version when.",
    who: "HR and compliance teams who must prove that employees received and acknowledged policies — and re-acknowledged them when the policy changed.",
    whatItDoes: [
      "Sends a policy to a defined group and collects acknowledgments.",
      "Tracks who has and hasn't acknowledged, with reminders.",
      "Versions the policy so a change triggers re-acknowledgment.",
      "Keeps a dated record of which version each person accepted.",
    ],
    how: [
      { title: "Publish", body: "Upload the policy and select who must acknowledge it." },
      { title: "Collect", body: "Employees acknowledge in their browser; reminders chase the stragglers." },
      { title: "Version", body: "Update the policy and Keelstar requests re-acknowledgment of the new version." },
    ],
    monitoring:
      "Policy acceptance is recurring by nature — every new hire and every policy revision restarts the cycle. Keelstar monitors coverage continuously so you always know who's current on which version.",
    audit: "Every acknowledgment is recorded against a specific policy version with a timestamp, ready to export as proof.",
    faqs: [
      { q: "What happens when a policy changes?", a: "Keelstar versions the policy and requests re-acknowledgment from the group, keeping each person's accepted version on record." },
      { q: "Can I see who hasn't acknowledged?", a: "Yes. Coverage is visible at a glance, and reminders go to anyone outstanding." },
    ],
    relatedWorkflows: ["send-policy-acknowledgments", "track-policy-version-acceptance", "build-audit-trails"],
    relatedTools: ["policy-acknowledgment-link-maker", "audit-trail-export-preview", "training-expiration-calculator"],
    relatedGlossary: ["policy-acknowledgment", "version-history", "attestation"],
    relatedTemplates: ["policy-acknowledgment", "audit-evidence-pack"],
    relatedCompare: ["keelstar-vs-email-for-policy-acknowledgments", "keelstar-vs-spreadsheets-for-policy-tracking"],
  },
  {
    slug: "training-record-tracker",
    name: "Training Record Tracker",
    cluster: "HR Compliance",
    node: "Monitor",
    job: "Track training and certification expirations.",
    sub: "Keep a record of who has completed which training or certification, and get warned before any of them expire.",
    who: "HR, safety, and compliance teams who must keep staff certifications current and prove it.",
    whatItDoes: [
      "Records completed training and certifications per person.",
      "Tracks expiration dates and renewal requirements.",
      "Flags certifications that are expiring or expired.",
      "Notifies owners and staff before deadlines.",
    ],
    how: [
      { title: "Record", body: "Log certifications and completion dates per employee." },
      { title: "Track", body: "Keelstar calculates expirations from each certification's validity." },
      { title: "Monitor", body: "Reminders fire before anything lapses." },
    ],
    monitoring:
      "Certifications expire on a rolling basis across your whole team. Keelstar monitors every expiration continuously so no one is working on a lapsed credential.",
    audit: "Maintain a dated record of every certification and its validity window for inspections and audits.",
    faqs: [
      { q: "Can I track different certification types?", a: "Yes. Define certification types with their own validity periods and renewal rules." },
      { q: "Who gets reminded?", a: "Both the record owner and, optionally, the employee, ahead of each expiration." },
    ],
    relatedWorkflows: ["track-training-records", "monitor-certification-expirations", "build-audit-trails"],
    relatedTools: ["training-expiration-calculator", "audit-trail-export-preview", "policy-acknowledgment-link-maker"],
    relatedGlossary: ["certification-expiration", "attestation", "audit-trail"],
    relatedTemplates: ["training-record-log", "audit-evidence-pack"],
    relatedCompare: ["keelstar-vs-spreadsheets-for-training-records", "keelstar-vs-lms-for-compliance-tracking"],
  },
  {
    slug: "invoice-approval",
    name: "Invoice Approval",
    cluster: "Finance Operations",
    node: "Approve",
    job: "Route invoice approvals and keep the audit trail.",
    sub: "Send invoices through the right approval chain, chase the approvers who are holding things up, and keep a clean record of who approved what.",
    who: "Finance and AP teams who route invoices for approval over email and lose the thread on who signed off.",
    whatItDoes: [
      "Routes each invoice to the right approvers based on rules you set.",
      "Tracks where every invoice is in the approval chain.",
      "Reminds approvers who are holding up payment.",
      "Records every approval with an actor and timestamp.",
    ],
    how: [
      { title: "Submit", body: "Add the invoice and Keelstar applies your approval matrix." },
      { title: "Route", body: "Approvers act in order; the invoice's status is always visible." },
      { title: "Record", body: "Each decision is logged, producing a clean approval trail." },
    ],
    monitoring:
      "Approvals stall. Keelstar continuously surfaces overdue approvals and the bottleneck behind each one, so payment timelines stay predictable instead of disappearing into inboxes.",
    audit: "Every approval, rejection, and reminder is recorded, giving finance a defensible trail for every payment.",
    utility: { label: "Build an approval matrix", href: "/tools/approval-matrix-builder/" },
    faqs: [
      { q: "Can approval rules vary by amount?", a: "Yes. Define an approval matrix by amount, department, or vendor, and Keelstar routes accordingly." },
      { q: "How do I find stuck invoices?", a: "Overdue approvals surface automatically, with the responsible approver shown so you can unblock them." },
    ],
    relatedWorkflows: ["route-invoice-approvals", "track-overdue-approvals", "build-audit-trails"],
    relatedTools: ["invoice-field-extractor", "approval-matrix-builder", "audit-trail-export-preview"],
    relatedGlossary: ["approval-matrix", "segregation-of-duties", "audit-trail"],
    relatedTemplates: ["invoice-approval-matrix", "audit-evidence-pack"],
    relatedCompare: ["keelstar-vs-email-for-invoice-approvals", "keelstar-vs-erp-suites"],
  },
];

export const allProducts: Product[] = [...products, ...scaffoldProducts];

export function getProduct(slug: string) {
  return allProducts.find((p) => p.slug === slug);
}
