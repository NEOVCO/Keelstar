import { guide } from "./helpers";

export const coreGuides = [
  guide({
    slug: "how-to-collect-w9s-from-vendors",
    title: "How to Collect W-9s from Vendors",
    summary:
      "A practical, IRS-aligned process for collecting complete W-9s from U.S. vendors before you pay them — without email attachments or spreadsheet chaos.",
    answer:
      "Before you pay a U.S. vendor, send a single secure W-9 request, validate the TIN and signature on receipt, and store the signed form with a timestamp. Do not rely on email attachments or shared folders — they go stale, get overwritten, and fail audits. Request, validate, store, and re-collect on a schedule.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: ["w9-vs-w8-which-form", "how-to-validate-a-vendor-tin", "when-to-issue-a-1099-to-a-vendor"],
    relatedGlossary: ["w-9", "tin", "backup-withholding"],
    faqs: [
      { q: "Do I need a W-9 before the first payment?", a: "Yes. You need the payee's TIN and certification before you pay them, so you can report correctly and avoid backup withholding where it applies." },
      { q: "Can I accept a W-9 by email?", a: "You can receive it electronically if your process captures a valid signature and you can prove what was on file on a given date. Email attachments alone are hard to audit." },
    ],
    sections: [
      {
        heading: "Why W-9 collection breaks down",
        body: "Most AP and vendor onboarding teams start by emailing a blank IRS Form W-9. The form comes back incomplete — missing TIN, wrong entity type, no signature, or an outdated revision. It lands in someone's inbox, gets forwarded, and disappears when that person leaves. At year-end, finance scrambles for TINs before 1099 filing, or worse, discovers gaps after filing.",
      },
      {
        heading: "Who needs a W-9 in the U.S.",
        body: "U.S. persons and U.S. entities you pay for services, rent, or other reportable amounts generally complete Form W-9. Foreign persons and entities use the W-8 series instead. If you are unsure, confirm tax status before the first payment — the wrong form drives incorrect 1099 reporting and withholding.",
        bullets: [
          "Domestic LLCs, corporations, partnerships, and sole proprietors → W-9",
          "Foreign vendors → W-8BEN or W-8BEN-E (not W-9)",
          "Individuals paid as independent contractors → W-9 with SSN or ITIN",
        ],
      },
      {
        heading: "A reliable W-9 collection process",
        body: "Make collection repeatable so it survives volume, turnover, and audits.",
        bullets: [
          "Send one secure request link per vendor — never a blank PDF attachment.",
          "Validate TIN format, legal name, federal tax classification, and signature before accepting.",
          "Store the signed W-9 with a received date and version history.",
          "Block or flag payment if W-9 is missing, incomplete, or stale.",
          "Re-request when the entity changes, the form ages out, or IRS rules update.",
        ],
      },
      {
        heading: "What to validate on every W-9",
        body: "A signed PDF is not enough if the fields are wrong. At minimum confirm: legal name matches how you will pay and report; TIN type (SSN vs EIN) matches entity type; address is current; signature and date are present; and exempt payee / FATCA codes are completed when applicable.",
      },
      {
        heading: "How this connects to 1099 filing",
        body: "The W-9 is the source of truth for Box names and TINs on Form 1099-NEC and 1099-MISC. Gaps discovered in January are expensive — corrected filings, B-notices, and vendor friction. Collecting clean W-9s at onboarding is cheaper than fixing TIN mismatches after payments are made.",
      },
      {
        heading: "When to move off manual collection",
        body: "If you onboard more than a handful of vendors per month, operate in a regulated industry, or need to prove you held a valid W-9 on a specific payment date, spreadsheets and inbox searches will fail. A monitored workflow validates on intake, reminds owners before payments, and exports an audit trail on demand.",
      },
    ],
  }),

  guide({
    slug: "w9-vs-w8-which-form",
    title: "W-9 vs W-8: Which Form Does Your Vendor Need?",
    summary:
      "A decision guide for U.S. accounts payable teams: W-9 for domestic payees, W-8 for foreign — and what happens if you choose wrong.",
    answer:
      "U.S. persons and U.S. businesses complete Form W-9. Foreign persons and foreign entities complete a Form W-8 (typically W-8BEN for individuals or W-8BEN-E for entities). If status is unclear, ask before the first payment — the form determines 1099 reporting, FATCA reporting, and whether withholding applies.",
    product: "w9-collector",
    workflow: "request-tax-documents-from-vendors",
    relatedGuides: ["how-to-collect-w9s-from-vendors", "what-is-backup-withholding-and-how-to-avoid-it"],
    relatedGlossary: ["w-9", "w-8ben", "tin"],
    sections: [
      {
        heading: "The short answer",
        body: "Domestic vendor → W-9. Foreign vendor → W-8. The W-8 family has several variants depending on whether the payee is an individual or entity and whether they claim treaty benefits.",
      },
      {
        heading: "W-9: who files it",
        body: "Form W-9 is for U.S. persons — including U.S. citizens, resident aliens, and entities formed under U.S. law. The vendor certifies their TIN and that they are not subject to backup withholding (unless they are). You use it to prepare information returns such as 1099-NEC.",
      },
      {
        heading: "W-8: who files it",
        body: "Form W-8BEN is commonly used by foreign individuals. Form W-8BEN-E is used by foreign entities. These forms establish foreign status and may document reduced withholding under an income tax treaty. They are not substitutes for a W-9.",
      },
      {
        heading: "Why getting it wrong matters",
        body: "Using a W-9 for a foreign payee can lead to incorrect 1099 reporting and failure to withhold when required. Using a W-8 for a domestic payee delays onboarding and creates filing errors. The cost shows up at year-end or in an audit — not on day one.",
      },
      {
        heading: "What to do when unsure",
        body: "Ask the vendor to confirm tax residency and entity type before payment. If they operate internationally, request the appropriate W-8 with a completed treaty claim when applicable. Document the decision in the vendor file.",
      },
      {
        heading: "Operational tip",
        body: "Route vendors through a single onboarding packet that branches by tax status — W-9 path vs W-8 path — so AP never has to guess which attachment to send.",
      },
    ],
  }),

  guide({
    slug: "how-to-track-coi-expirations",
    title: "How to Track COI Expirations",
    summary:
      "How U.S. operations teams monitor certificates of insurance so vendor coverage never lapses unnoticed.",
    answer:
      "For every vendor, record each policy's expiration date and required limits from the ACORD certificate, then set reminders well before expiration — not on the expiration date. Spreadsheets work for a few vendors; ongoing monitoring needs automated warnings and a historical record of what was on file when.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    relatedGuides: ["what-to-check-on-a-certificate-of-insurance", "how-to-read-an-acord-25-certificate", "how-to-handle-an-expired-certificate-of-insurance"],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "additional-insured"],
    sections: [
      {
        heading: "Why COI expiration tracking matters",
        body: "A certificate of insurance is a snapshot, not a policy. Coverage can cancel or lapse after the certificate is issued. If a vendor is uninsured when work happens or a claim arises, your organization may absorb liability that insurance was meant to cover — especially in construction, facilities, and healthcare vendor relationships.",
      },
      {
        heading: "What to capture for each certificate",
        body: "Track enough to answer: is this vendor covered right now, to the limits we require?",
        bullets: [
          "Expiration date for each policy line on the ACORD 25",
          "Coverage types: general liability, auto, workers comp, umbrella",
          "Per-occurrence and aggregate limits vs your requirements",
          "Additional insured status where required",
          "Certificate holder name and address",
          "Producer contact for renewal requests",
        ],
      },
      {
        heading: "Set reminders before, not after",
        body: "A reminder on the expiration date is too late — the policy may already be expired. Most teams warn 30–60 days ahead and again at 14 days. Optionally notify the vendor automatically with a renewal request link.",
      },
      {
        heading: "Subcontractors and downstream vendors",
        body: "In construction and property management, COI tracking often extends to subcontractors you do not pay directly but who work on your premises. Require certificates that meet your contract's additional insured and waiver requirements, and track them the same way as primary vendors.",
      },
      {
        heading: "Keep the history",
        body: "Claims and audits ask whether a vendor was insured on a specific date — not whether they are insured today. Store superseded certificates with received dates so you can reconstruct coverage at any point in time.",
      },
      {
        heading: "When spreadsheets stop working",
        body: "Spreadsheets do not send reminders, do not flag limit shortfalls, and do not preserve who changed a date. Once you exceed roughly a dozen active vendors or face audit scrutiny, move COI monitoring into a workflow with validation on intake and alerts before lapses.",
      },
    ],
  }),

  guide({
    slug: "what-to-check-on-a-certificate-of-insurance",
    title: "What to Check on a Certificate of Insurance",
    summary:
      "The ACORD 25 fields U.S. risk and operations teams should verify before accepting a vendor's certificate.",
    answer:
      "Verify expiration dates, coverage types and limits against your requirements, additional insured status, certificate holder details, and that the named insured matches the vendor you are paying. A current certificate that fails your limits is still non-compliant.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: ["how-to-track-coi-expirations", "how-to-read-an-acord-25-certificate", "what-additional-insured-means-for-your-business"],
    relatedGlossary: ["acord-25", "certificate-of-insurance", "coverage-limit"],
    sections: [
      {
        heading: "Start with the named insured",
        body: "The named insured on the certificate should match the legal entity on your vendor agreement and W-9. DBAs are common — confirm the relationship if names differ.",
      },
      {
        heading: "Expiration date",
        body: "Note the expiration date for every policy listed. Commercial general liability, automobile, umbrella, and workers compensation may expire on different dates — track each separately.",
      },
      {
        heading: "Coverage types and limits",
        body: "Confirm each required coverage is present and meets your minimum limits. 'Has insurance' is not the standard — 'meets our contractual requirement' is.",
        bullets: [
          "General liability per occurrence and aggregate",
          "Automobile liability if vehicles are on site",
          "Workers compensation where required by state law",
          "Umbrella or excess limits for high-risk work",
        ],
      },
      {
        heading: "Additional insured and certificate holder",
        body: "Many U.S. contracts require you to be named as additional insured on the vendor's general liability policy. Verify the endorsement language matches your contract — the certificate alone may not be sufficient for complex requirements.",
      },
      {
        heading: "Description of operations",
        body: "The box describing the project or location should align with the work the vendor performs for you. Vague descriptions make it harder to defend coverage scope later.",
      },
      {
        heading: "When a certificate fails review",
        body: "Do not approve the vendor for work or payment until a corrected certificate or endorsement is received. Record the deficiency, notify the vendor, and set a follow-up date — do not let exceptions become the default.",
      },
    ],
  }),

  guide({
    slug: "how-to-track-contract-renewals",
    title: "How to Track Contract Renewals",
    summary:
      "How U.S. finance and operations teams avoid accidental auto-renewals and missed notice windows.",
    answer:
      "For each contract, extract the renewal date and notice period, calculate the last day you can give notice without auto-renewing, and set reminders well before that deadline. The renewal date is informational; the notice deadline is operational.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: ["how-to-find-a-contract-notice-period", "how-to-avoid-accidental-auto-renewals", "what-an-evergreen-contract-means"],
    relatedGlossary: ["auto-renewal-clause", "notice-period", "evergreen-contract"],
    sections: [
      {
        heading: "The dates that matter",
        body: "Contracts typically include an initial term, a renewal term, and a notice window. Auto-renewal clauses extend the agreement unless one party gives written notice within a defined period — often 30, 60, or 90 days before the renewal date.",
      },
      {
        heading: "Calculate the decision deadline",
        body: "Decision deadline = renewal date minus notice period. That is the last day you can elect non-renewal or renegotiate without being locked into another term. Build in a buffer — do not act on the final day.",
      },
      {
        heading: "Build a renewal calendar",
        body: "Centralize contracts in one register: counterparty, owner, effective date, term end, renewal date, notice period, decision deadline, and status. Review monthly for the next 90 days of deadlines.",
      },
      {
        heading: "SaaS and vendor agreements",
        body: "Software subscriptions often auto-renew annually with short notice windows buried in order forms. Treat order forms and MSAs as one portfolio — a missed SaaS renewal is still a budget and vendor lock-in problem.",
      },
      {
        heading: "Document non-renewal decisions",
        body: "When you give notice, keep proof of delivery and the exact clause cited. When you renew, capture the new term and updated notice period — the cycle restarts.",
      },
      {
        heading: "Monitor the whole portfolio",
        body: "One missed notice window can commit you to another 12–36 months. Portfolio monitoring with automated reminders is the difference between proactive vendor management and surprise renewals.",
      },
    ],
  }),

  guide({
    slug: "how-to-find-a-contract-notice-period",
    title: "How to Find a Contract Notice Period",
    summary:
      "Where to locate notice language in U.S. commercial contracts and how to turn it into an actionable deadline.",
    answer:
      "Look in the Term, Renewal, and Termination sections for language requiring written notice at least N days before renewal or expiration. Subtract that period from the renewal date to get your last day to act. If language conflicts, capture the clause text and escalate before relying on a single date.",
    product: "contract-renewal-tracker",
    workflow: "track-contract-notice-periods",
    relatedGuides: ["how-to-track-contract-renewals", "how-to-give-notice-of-non-renewal"],
    relatedGlossary: ["notice-period", "termination-for-convenience"],
    sections: [
      {
        heading: "Where to look",
        body: "Search for headings such as Term, Renewal, Extension, Termination, or Survival. Phrases like 'automatically renew unless either party provides written notice at least sixty (60) days prior' are what you need.",
      },
      {
        heading: "Notice vs renewal date",
        body: "The renewal date is when the next term begins if you do nothing. The notice period is how far in advance you must act. Teams that only calendar renewal dates miss the real deadline.",
      },
      {
        heading: "Turn it into a date",
        body: "Example: renewal on December 31 with 90 days' notice means you must give notice by October 2. Store both dates and set reminders at 120, 90, and 30 days before the notice deadline.",
      },
      {
        heading: "Ambiguous language",
        body: "Contracts sometimes count days differently (calendar vs business) or reference 'anniversary of the effective date.' When ambiguous, record the clause verbatim, document your interpretation, and get sign-off from legal or finance before monitoring a single date.",
      },
      {
        heading: "Order forms and MSAs",
        body: "Notice terms may live in the MSA while dates live in the order form. Read both — auto-renewal in the MSA still binds you even if the order form is silent.",
      },
    ],
  }),

  guide({
    slug: "how-to-set-up-invoice-approvals",
    title: "How to Set Up Invoice Approvals",
    summary:
      "Design an accounts payable approval matrix that is fast, enforces segregation of duties, and survives audit.",
    answer:
      "Define who approves invoices by amount, department, and vendor type; route every invoice through that matrix automatically; and record each approval with an actor and timestamp. Email approvals do not scale and are weak evidence under SOX-style scrutiny.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: ["how-to-design-an-approval-matrix", "what-segregation-of-duties-means-in-ap"],
    relatedGlossary: ["approval-matrix", "segregation-of-duties"],
    sections: [
      {
        heading: "Start with the approval matrix",
        body: "Document thresholds: who approves under $5,000, who joins above $25,000, when CFO sign-off is required, and which cost centers map to which managers. The matrix should be written, versioned, and known to AP — not tribal knowledge.",
      },
      {
        heading: "Segregation of duties",
        body: "The person who approves an invoice should not be the only person who can add the vendor or change bank details. Separation between intake, approval, and payment reduces fraud risk — a core expectation in U.S. internal controls.",
      },
      {
        heading: "Route automatically",
        body: "Apply the matrix on every invoice so routing is not a manual decision. Exception queues handle out-of-policy items; they should not be the default path.",
      },
      {
        heading: "Keep the trail",
        body: "Store invoice image or PDF, approval chain, any rejection reason, and payment date together. Auditors ask who approved what and when — not whether someone replied 'OK' on email.",
      },
      {
        heading: "Reduce delays without skipping controls",
        body: "Escalation rules, delegation during PTO, and mobile-friendly approval for managers cut cycle time. Speed and control are not opposites if the matrix is clear.",
      },
    ],
  }),

  guide({
    slug: "what-makes-a-good-audit-trail",
    title: "What Makes a Good Audit Trail",
    summary:
      "What U.S. auditors and compliance reviewers expect when they ask for evidence of document workflows.",
    answer:
      "A credible audit trail is complete, chronological, attributable, and exportable: every meaningful action recorded in order, tied to a user and timestamp, available without reconstruction. If you assemble evidence after the request, it is documentation — not an audit trail.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-prepare-for-a-compliance-audit", "how-to-export-compliance-evidence"],
    relatedGlossary: ["audit-trail", "version-history"],
    sections: [
      {
        heading: "Complete and chronological",
        body: "Capture requests, uploads, edits, approvals, reminders sent, exports, and permission changes. Gaps invite questions about what happened in between.",
      },
      {
        heading: "Attributable",
        body: "Each event needs a user or system identity and a timestamp. Shared login accounts destroy attribution — avoid them in compliance workflows.",
      },
      {
        heading: "Immutable enough for purpose",
        body: "Users may need to correct data, but corrections should append — not silently overwrite — prior values. Version history shows what changed and why it matters in disputes.",
      },
      {
        heading: "Exportable on demand",
        body: "Evidence should be producible in common formats without a services project. Built-in export is a product requirement, not a nice-to-have, for finance and compliance teams.",
      },
      {
        heading: "Covers the full workflow",
        body: "An audit trail for W-9 collection should show request, vendor submission, validation, and any re-collection — not just the final PDF on disk.",
      },
    ],
  }),

  guide({
    slug: "why-spreadsheets-fail-for-compliance-tracking",
    title: "Why Spreadsheets Fail for Compliance Tracking",
    summary:
      "Why Excel and Google Sheets break down for W-9, COI, contract, and policy compliance in U.S. companies.",
    answer:
      "Spreadsheets do not remind anyone, validate fields, record who changed a cell, or prove what was true on a past date. For recurring compliance — expirations, renewals, acknowledgments — those gaps are the entire job. Monitored workflows exist to close them.",
    product: "platform",
    workflow: "replace-spreadsheets-with-operational-workflows",
    relatedGuides: ["how-to-move-off-shared-folders", "how-to-standardize-operational-workflows"],
    sections: [
      {
        heading: "No reminders",
        body: "A spreadsheet will not tell you a COI expires next Tuesday. Someone must remember to sort by date — until they do not.",
      },
      {
        heading: "No validation",
        body: "Any cell can hold any value. TINs, dates, and limits are not validated at entry, so bad data propagates to 1099s and payment holds.",
      },
      {
        heading: "Weak audit trail",
        body: "Collaboration features show some edit history, but they are not designed for compliance evidence. Overwrites, copies, and offline edits break the chain of custody.",
      },
      {
        heading: "Ownership drift",
        body: "The spreadsheet lives on one person's drive. When they leave, continuity depends on handoff quality — not system design.",
      },
      {
        heading: "What works instead",
        body: "Use spreadsheets for analysis and one-time models. Use monitored workflows for anything with a deadline, a document, and an auditor.",
      },
    ],
  }),

  guide({
    slug: "vendor-compliance-checklist",
    title: "The Vendor Compliance Checklist",
    summary:
      "A U.S. vendor onboarding and monitoring checklist for finance, procurement, and risk teams.",
    answer:
      "Before first payment: W-9 or W-8, insurance certificate meeting your limits, signed agreement, and exclusion screening where required. After onboarding: monitor COI expirations, re-screen exclusions on a schedule, and re-collect tax forms when stale. Hold everything in one auditable vendor record.",
    product: "vendor-packet",
    workflow: "build-vendor-onboarding-packets",
    relatedGuides: ["how-to-collect-w9s-from-vendors", "how-to-track-coi-expirations", "how-to-screen-vendors-against-the-oig-list", "how-to-add-exclusion-screening-to-vendor-onboarding", "oig-sam-and-ofac-what-healthcare-providers-must-screen"],
    sections: [
      {
        heading: "Before the first payment",
        body: "Gate payment until required documents are complete and validated.",
        bullets: [
          "W-9 (domestic) or appropriate W-8 (foreign)",
          "Certificate of insurance vs your contractual limits",
          "Signed MSA, SOW, or purchase terms",
          "OIG / SAM / OFAC screening where applicable",
          "Banking details verified through a controlled process",
        ],
      },
      {
        heading: "During onboarding",
        body: "Assign a vendor owner in operations or AP. Set insurance and contract renewal reminders at intake — not after the first lapse.",
      },
      {
        heading: "After onboarding",
        body: "Compliance is recurring. Monitor COI expirations, re-screen exclusions quarterly or per policy, and refresh W-9s when entities change or forms age.",
      },
      {
        heading: "Construction and facilities add-ons",
        body: "Subcontractor COIs, additional insured endorsements, and waiver of subrogation requirements are common in U.S. construction and property contracts — track them explicitly.",
      },
      {
        heading: "Keep it auditable",
        body: "One vendor record should link every document, check, and reminder with dates. Export the full history when legal, finance, or a customer audit asks.",
      },
    ],
  }),
];
