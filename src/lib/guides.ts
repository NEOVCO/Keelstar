export type GuideSection = { heading: string; body: string; bullets?: string[] };
export type Guide = {
  slug: string;
  title: string;
  summary: string;
  answer: string; // answer-first block near the top
  sections: GuideSection[];
  product: string;
  workflow: string;
  updated: string; // ISO date
  author: string;
  fullCopy?: boolean;
};

const AUTHOR = "Keelstar Team";
const UPDATED = "2026-06-01";

const guide = (slug: string, title: string, summary: string, answer: string, product: string, workflow: string, sections: GuideSection[], fullCopy = true): Guide => ({
  slug,
  title,
  summary,
  answer,
  sections,
  product,
  workflow,
  updated: UPDATED,
  author: AUTHOR,
  fullCopy,
});

const coreGuides: Guide[] = [
  guide(
    "how-to-collect-w9s-from-vendors",
    "How to Collect W-9s from Vendors",
    "A step-by-step approach to collecting complete, validated W-9s without endless email chains.",
    "Send each vendor a single secure request for their W-9, validate the form before you accept it, and keep every version on file with a timestamp. Don't collect W-9s as email attachments — they go stale and scatter. Request, validate, store, and monitor.",
    "w9-collector",
    "collect-w9s",
    [
      { heading: "Why W-9 collection breaks down", body: "Most teams collect W-9s by emailing a blank form and hoping it comes back complete. It often doesn't: the TIN is missing, the signature is blank, or the form is the wrong year. Then it lives as an attachment in one person's inbox, impossible to find when finance or an auditor asks." },
      { heading: "A reliable W-9 collection process", body: "Make the process repeatable so it survives volume and turnover.", bullets: ["Send one secure request link per vendor — no blank attachments.", "Validate the TIN format, legal name, and signature before accepting.", "Store the signed W-9 with a timestamp and version history.", "Re-request when the form goes stale or the entity changes."] },
      { heading: "When to move off manual collection", body: "If you collect more than a handful of W-9s, or you need to prove you held a valid W-9 on a given date, move the workflow into a tool that monitors and audits it for you. That's exactly what W-9 Collector does." },
    ]
  ),
  guide(
    "w9-vs-w8-which-form",
    "W-9 vs W-8: Which Form Does Your Vendor Need?",
    "A quick decision guide for whether a vendor should complete a W-9 or a W-8.",
    "U.S. persons and U.S. businesses complete a W-9. Foreign persons and foreign entities complete a W-8 (most commonly a W-8BEN or W-8BEN-E). If you're unsure of a vendor's status, ask before you pay — the form determines your reporting and withholding obligations.",
    "w9-collector",
    "request-tax-documents-from-vendors",
    [
      { heading: "The short answer", body: "Domestic vendor → W-9. Foreign vendor → W-8. The W-8 family has several variants depending on whether the payee is an individual or entity and whether they're claiming treaty benefits." },
      { heading: "Why it matters", body: "Collecting the wrong form can lead to incorrect reporting and withholding. The form establishes the payee's tax status, which drives whether you issue a 1099 and whether backup or treaty withholding applies." },
      { heading: "What to do when unsure", body: "Don't guess. Ask the vendor to confirm their status, and route them to the correct form before the first payment." },
    ]
  ),
  guide(
    "how-to-track-coi-expirations",
    "How to Track COI Expirations",
    "Keep every vendor's certificate of insurance current — and know before one lapses.",
    "Record the expiration date and required coverage for every COI, then set a reminder well before each expiration. Tracking by hand in a spreadsheet works until you have more than a few vendors; after that, you need monitoring that warns you automatically.",
    "coi-tracker",
    "track-coi-expirations",
    [
      { heading: "What to capture for each certificate", body: "Track enough to answer 'is this vendor covered, and to what limit, right now?'", bullets: ["Expiration date for each policy on the certificate", "Coverage types and limits versus your requirements", "Whether you're listed as additional insured", "The vendor and certificate holder"] },
      { heading: "Set reminders before, not after", body: "A reminder on the expiration date is too late. Warn the owner — and optionally the vendor — far enough ahead to collect a renewed certificate before coverage lapses." },
      { heading: "Keep the history", body: "When a claim or audit asks whether a vendor was insured on a specific date, you need the historical record, not just the current certificate." },
    ]
  ),
  guide(
    "what-to-check-on-a-certificate-of-insurance",
    "What to Check on a Certificate of Insurance",
    "The fields that actually matter when you receive an ACORD certificate.",
    "Check the expiration date, the coverage types and limits against your requirements, whether you're named as additional insured, and that the certificate holder is correct. A certificate that's current but under your required limit still fails your requirement.",
    "coi-tracker",
    "review-acord-certificates",
    [
      { heading: "Expiration date", body: "The single most important field for monitoring. Note it and set a reminder ahead of it." },
      { heading: "Coverage types and limits", body: "Confirm each required coverage is present and meets your minimum limit. 'Has insurance' isn't the bar — 'meets our requirement' is." },
      { heading: "Additional insured and certificate holder", body: "Verify you're named correctly where your requirements call for it, and that the certificate holder details match your records." },
    ]
  ),
  guide(
    "how-to-track-contract-renewals",
    "How to Track Contract Renewals",
    "Stop letting contracts auto-renew by accident.",
    "For every contract, record the renewal date and notice period, then calculate the real deadline — the last day you can give notice — and set a reminder ahead of it. The renewal date alone is not your deadline; the notice period is.",
    "contract-renewal-tracker",
    "monitor-contract-renewals",
    [
      { heading: "Find the dates that matter", body: "Pull the effective date, term length, renewal date, and notice period from each contract." },
      { heading: "Calculate the decision deadline", body: "Work back from the renewal date through the notice period. That date — not the renewal date — is when you must decide to renew, renegotiate, or cancel." },
      { heading: "Monitor the whole portfolio", body: "One missed notice window can lock you into another term. Track every contract together with reminders well ahead of each deadline." },
    ]
  ),
  guide(
    "how-to-find-a-contract-notice-period",
    "How to Find a Contract Notice Period",
    "Where to look for the notice period and how to turn it into a deadline.",
    "The notice period is usually in the term, renewal, or termination clause, stated as a number of days before the renewal or end date. Subtract it from the renewal date to get the last day you can give notice.",
    "contract-renewal-tracker",
    "track-contract-notice-periods",
    [
      { heading: "Where to look", body: "Check the 'Term', 'Renewal', and 'Termination' sections. Look for phrases like 'unless either party provides written notice at least N days prior'." },
      { heading: "Turn it into a date", body: "Renewal date minus notice period equals your decision deadline. Add a buffer so you're not acting on the final day." },
      { heading: "When language is ambiguous", body: "If the clause is unclear, capture the clause text alongside your interpretation so the deadline you monitor is one you've verified." },
    ]
  ),
  guide(
    "how-to-set-up-invoice-approvals",
    "How to Set Up Invoice Approvals",
    "Design an approval process that's fast, clear, and audit-ready.",
    "Define an approval matrix — who approves what, based on amount and department — then route every invoice through it automatically and record each approval. Approvals over email don't scale and don't survive an audit.",
    "invoice-approval",
    "route-invoice-approvals",
    [
      { heading: "Start with the matrix", body: "Decide thresholds: which amounts need one approver, which need two, and who's required for high-value or unusual invoices." },
      { heading: "Route automatically", body: "Apply the matrix to every invoice so routing isn't a manual decision and nothing skips a required approver." },
      { heading: "Keep the trail", body: "Record every approval and rejection with an actor and timestamp so each payment is defensible." },
    ]
  ),
  guide(
    "what-makes-a-good-audit-trail",
    "What Makes a Good Audit Trail",
    "The qualities that make audit evidence credible and easy to produce.",
    "A good audit trail is complete, chronological, attributable, and exportable: it records every meaningful action, in order, with who did it and when, and you can hand it over without reconstructing it. If you have to assemble evidence after the fact, it isn't an audit trail.",
    "platform",
    "build-audit-trails",
    [
      { heading: "Complete and chronological", body: "Every meaningful action — request, edit, approval, export — is captured in order. Gaps undermine the whole record." },
      { heading: "Attributable", body: "Each action is tied to a specific actor and timestamp. 'Someone changed this' isn't evidence; 'this person changed this at this time' is." },
      { heading: "Exportable on demand", body: "The trail should be ready to hand over without reconstruction. Built-in audit logging makes evidence a download, not a project." },
    ]
  ),
  guide(
    "why-spreadsheets-fail-for-compliance-tracking",
    "Why Spreadsheets Fail for Compliance Tracking",
    "Spreadsheets are great for analysis and poor for monitoring. Here's the difference.",
    "Spreadsheets don't remind you, don't validate input, don't record who changed what, and don't notify anyone when a date passes. For recurring compliance work — expirations, renewals, acknowledgments — those gaps are exactly the job. That's why monitored workflows replace them.",
    "platform",
    "replace-spreadsheets-with-operational-workflows",
    [
      { heading: "No reminders", body: "A spreadsheet won't tell you a certificate expires next week. Someone has to remember to look — and eventually they don't." },
      { heading: "No validation or audit trail", body: "Anyone can overwrite a cell, and nothing records who did it or when. That's fine for a model and disqualifying for compliance evidence." },
      { heading: "What to use instead", body: "Move recurring document work into a workflow that monitors dates, validates input, and keeps an audit trail automatically." },
    ]
  ),
  guide(
    "vendor-compliance-checklist",
    "The Vendor Compliance Checklist",
    "Everything to collect and monitor before and after onboarding a vendor.",
    "Before paying a vendor, collect a W-9, a current certificate of insurance that meets your limits, and any required agreements — and screen them against exclusion lists. After onboarding, monitor the COI for expiration and re-screen on a schedule.",
    "vendor-packet",
    "build-vendor-onboarding-packets",
    [
      { heading: "Before the first payment", body: "Collect the documents that gate payment and risk.", bullets: ["W-9 (or W-8 for foreign vendors)", "Certificate of insurance meeting your required limits", "Signed agreement or order terms", "Exclusion-list screening where required"] },
      { heading: "After onboarding", body: "Compliance is recurring. Monitor insurance expirations, re-screen against exclusion lists on a schedule, and re-collect tax forms when they go stale." },
      { heading: "Keep it auditable", body: "Hold every document and check together as one vendor record you can export on demand." },
    ]
  ),
];

// Generate the remaining guides to reach 100, grouped by theme with real titles.
function makeGuideFiller(): Guide[] {
  const themes: { product: string; workflow: string; titles: string[] }[] = [
    { product: "w9-collector", workflow: "collect-w9s", titles: ["How to Re-collect Stale W-9s", "What Is Backup Withholding and How to Avoid It", "How to Validate a Vendor TIN", "How to Request a W-9 from a New Vendor", "How to Store W-9s Securely", "When to Issue a 1099 to a Vendor", "How to Handle a Missing W-9 at Year End"] },
    { product: "coi-tracker", workflow: "track-coi-expirations", titles: ["How to Read an ACORD 25 Certificate", "How to Set Vendor Insurance Requirements", "What Additional Insured Means for Your Business", "How to Collect COIs from Subcontractors", "How to Handle an Expired Certificate of Insurance", "How to Verify Coverage Limits on a COI", "How to Build a COI Renewal Process", "What a Waiver of Subrogation Does"] },
    { product: "contract-renewal-tracker", workflow: "monitor-contract-renewals", titles: ["How to Avoid Accidental Auto-Renewals", "How to Read a Contract Term and Renewal Clause", "How to Build a Contract Renewal Calendar", "How to Give Notice of Non-Renewal", "What an Evergreen Contract Means", "How to Track Notice Periods Across a Portfolio", "How to Prepare for a Contract Renegotiation"] },
    { product: "contract-risk-scanner", workflow: "review-contract-risk", titles: ["How to Review a Contract Before Signing", "What to Look for in an Indemnification Clause", "How to Read a Limitation of Liability Clause", "How to Spot Risk in a Termination Clause", "What Governing Law Means in a Contract", "How to Review a Statement of Work"] },
    { product: "simple-signer", workflow: "send-documents-for-signature", titles: ["How to Send a Document for Signature", "Are Electronic Signatures Legally Valid", "How to Store Signed Documents", "How to Chase a Pending Signature"] },
    { product: "policy-acknowledgment-tracker", workflow: "send-policy-acknowledgments", titles: ["How to Collect Policy Acknowledgments", "How to Handle Policy Version Changes", "How to Prove Employees Read a Policy", "How to Roll Out a New Policy"] },
    { product: "training-record-tracker", workflow: "track-training-records", titles: ["How to Track Certification Expirations", "How to Build a Training Record System", "How to Prepare Training Records for an Audit", "How to Set Certification Renewal Reminders"] },
    { product: "invoice-approval", workflow: "route-invoice-approvals", titles: ["How to Design an Approval Matrix", "What Segregation of Duties Means in AP", "How to Reduce Invoice Approval Delays", "How to Audit Invoice Approvals", "How to Handle Out-of-Policy Invoices"] },
    { product: "exclusion-monitor", workflow: "screen-vendors-against-exclusion-lists", titles: ["How to Screen Vendors Against the OIG List", "What OFAC Screening Requires", "How to Screen Employees for Exclusions", "How to Document Exclusion Screening", "How Often to Re-screen for Exclusions"] },
    { product: "platform", workflow: "build-audit-trails", titles: ["How to Prepare for a Compliance Audit", "What Role-Based Access Control Is", "How to Export Compliance Evidence", "How to Set a Document Retention Policy", "How to Standardize Operational Workflows", "How to Move Off Shared Folders", "How to Set Up Notifications That Actually Fire", "How to Choose What to Monitor", "How to Replace Email Chains with Workflows", "How to Roll Out a New Workflow to Your Team"] },
  ];
  const out: Guide[] = [];
  for (const theme of themes) {
    for (const title of theme.titles) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      out.push(
        guide(
          slug,
          title,
          `${title}: a clear, practical answer for operations and compliance teams.`,
          `${title.replace(/^How to /, "To ").replace(/^What /, "Here is what ")} — the short version is below, with the steps and what to watch for underneath.`,
          theme.product,
          theme.workflow,
          [
            { heading: "The short answer", body: `This guide gives a direct, answer-first explanation of "${title}", then the practical steps to apply it. The goal is to be useful in under a minute and complete if you read on.` },
            { heading: "Step by step", body: "Follow a repeatable process so the result survives volume and staff turnover.", bullets: ["Bring the documents or records into one place.", "Capture the dates and details that matter.", "Assign an owner and set reminders before deadlines.", "Keep an exportable audit trail."] },
            { heading: "When to automate it", body: "Once this becomes recurring, move it into a monitored Keelstar workflow so reminders and audit trails happen automatically." },
          ],
          false
        )
      );
    }
  }
  return out;
}

export const guides: Guide[] = [...coreGuides, ...makeGuideFiller()];

export function getGuide(slug: string) {
  return guides.find((x) => x.slug === slug);
}
