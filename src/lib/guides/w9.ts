import { guide } from "./helpers";

export const w9Guides = [
  guide({
    slug: "how-to-re-collect-stale-w-9s",
    title: "How to Re-collect Stale W-9s",
    summary:
      "When and how U.S. accounts payable teams should refresh outdated W-9s — before a name change, entity conversion, or year-end scramble triggers TIN mismatches.",
    answer:
      "Re-collect a W-9 when the vendor's legal name or tax classification changes, when the form on file is an old IRS revision, when TIN validation fails, or on a defined refresh cycle (often annually for high-volume payees). Send a new secure request, compare the updated form to what you have on file, and retain both versions with timestamps in your audit trail.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "how-to-validate-a-vendor-tin",
      "how-to-handle-a-missing-w-9-at-year-end",
    ],
    relatedGlossary: ["w-9", "tin", "audit-trail"],
    faqs: [
      {
        q: "How often should we refresh W-9s?",
        a: "IRS rules do not mandate a fixed refresh interval, but many U.S. finance teams re-collect annually for active vendors or whenever legal entity details change. High-risk or high-dollar payees warrant tighter schedules.",
      },
      {
        q: "Do we need a new W-9 after an LLC elects S-corp status?",
        a: "Yes. A change in federal tax classification changes how you report payments. Request an updated W-9 reflecting the new classification before the next reportable payment.",
      },
    ],
    sections: [
      {
        heading: "What makes a W-9 stale",
        body: "A W-9 is stale when the information on file no longer matches reality — not simply because it is old. Common triggers: the vendor rebranded or merged; an LLC converted to a corporation; the payee moved and the address changed; the IRS issued a new form revision your policy requires; or your TIN/name match check failed against IRS records.",
        bullets: [
          "Legal name on invoices no longer matches the W-9",
          "EIN replaced an SSN after entity formation",
          "Vendor was acquired and now bills under a parent company",
          "Form revision predates your internal compliance policy",
          "CP2100 or B-notice indicated a TIN mismatch",
        ],
      },
      {
        heading: "Why stale W-9s create year-end risk",
        body: "Form 1099-NEC and 1099-MISC must report the payee name and TIN exactly as IRS records show them. A stale W-9 collected years ago may carry a DBA that no longer matches the EIN, or an SSN for someone who now bills through an LLC. Mismatches generate IRS B-notices, require corrected filings, and can force backup withholding on future payments.",
      },
      {
        heading: "A re-collection workflow AP teams can run",
        body: "Treat re-collection like onboarding — same validation, same storage, same audit trail.",
        bullets: [
          "Flag vendors whose W-9 exceeds your age threshold or failed validation",
          "Send a secure request link — do not rely on 'please resend your W-9' email threads",
          "Validate TIN format, legal name, classification, signature, and date on receipt",
          "Compare new vs prior form; document what changed and when",
          "Hold or escalate payments if the vendor does not respond before your deadline",
        ],
      },
      {
        heading: "Entity changes that always require a new W-9",
        body: "Re-collect immediately when a vendor notifies you of a legal entity change — merger, acquisition, conversion to LLC or corporation, or change in disregarded-entity status. Update your ERP vendor master and 1099 reporting name at the same time. Waiting until January invites filing errors on payments already made under the old identity.",
      },
      {
        heading: "Preserve history for audits",
        body: "Keep superseded W-9s with received dates — auditors and dispute resolution often ask what TIN and certification you held on a specific payment date. A workflow that versions documents automatically is stronger evidence than overwriting a file in a shared drive.",
      },
      {
        heading: "Automate the refresh cycle",
        body: "Once you exceed a few dozen active vendors, manual calendar reminders fail. Schedule automated re-collection requests, track open vs completed, and export a log showing who was contacted, when they submitted, and what was validated. That is the difference between proactive compliance and a December emergency.",
      },
    ],
  }),

  guide({
    slug: "what-is-backup-withholding-and-how-to-avoid-it",
    title: "What Is Backup Withholding and How to Avoid It",
    summary:
      "How U.S. payers apply IRS backup withholding on vendor payments — and the W-9 practices that keep your AP team out of the 24% withholding trap.",
    answer:
      "Backup withholding requires you to withhold 24% of certain payments when a payee fails to provide a correct TIN, certifies they are subject to backup withholding, or when the IRS notifies you of a TIN mismatch. Avoid it by collecting a complete, signed W-9 before payment, validating the TIN, acting on IRS CP2100 notices promptly, and withholding only when the law requires — not as a default AP policy.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "how-to-validate-a-vendor-tin",
      "how-to-handle-a-missing-w-9-at-year-end",
    ],
    relatedGlossary: ["backup-withholding", "w-9", "tin"],
    faqs: [
      {
        q: "What is the current backup withholding rate?",
        a: "The backup withholding rate is 24% of reportable payments. It applies to the payment itself, not just the taxable portion, when withholding is required under IRS rules.",
      },
      {
        q: "Can a vendor refuse to give a TIN?",
        a: "A vendor may hesitate, but without a certified TIN you generally cannot report correctly and may be required to begin backup withholding on future payments after IRS notice periods are met.",
      },
    ],
    sections: [
      {
        heading: "What backup withholding is",
        body: "Under IRC §3406, payers must withhold 24% from certain payments when a payee does not provide a correct taxpayer identification number, when the IRS notifies you of a TIN/name mismatch (CP2100 or related notices), or when the payee checks the box on Form W-9 certifying they are subject to backup withholding. It is not optional penalty withholding — it is a statutory obligation once conditions are met.",
      },
      {
        heading: "Payments subject to backup withholding",
        body: "Backup withholding commonly applies to reportable payments such as rents, royalties, commissions, fees for services, and other amounts you would report on Form 1099. It generally does not apply to wages (reported on W-2) or to payments to corporations in many cases, though exceptions exist — including when the corporation is subject to notification of mismatched TINs.",
        bullets: [
          "Independent contractor payments (1099-NEC)",
          "Rent and royalty payments (1099-MISC and related)",
          "Broker and barter exchange transactions in scope",
          "Interest and dividends in certain payer contexts",
        ],
      },
      {
        heading: "How the W-9 prevents withholding",
        body: "Form W-9 collects the payee's TIN and their certification under penalties of perjury that the TIN is correct, they are not subject to backup withholding (unless the box is checked), and they are a U.S. person. A complete, signed W-9 on file before payment is your primary defense — provided the TIN and name actually match IRS records.",
      },
      {
        heading: "CP2100 and B-notice obligations",
        body: "When the IRS identifies TIN/name combinations that do not match its database, you may receive a CP2100 or CP2100A notice listing payees with proposed mismatches. You must send a B-notice (solicitation for corrected information) to affected payees and begin backup withholding if they do not respond within the required timeframe. Document every notice, vendor outreach, and withholding start date — auditors will ask.",
      },
      {
        heading: "Operational mistakes that trigger withholding",
        body: "AP teams sometimes create their own exposure: accepting W-9s with missing TINs 'temporarily,' ignoring failed TIN matches, using invoice DBA names on 1099s instead of W-9 legal names, or continuing payments after a B-notice deadline without withholding. Each of these turns a fixable onboarding gap into a withholding and reporting problem.",
      },
      {
        heading: "Building backup withholding into your process",
        body: "Validate TINs at W-9 intake, block payments when certification is incomplete, maintain a B-notice response log, and configure ERP or AP systems to flag payees under active withholding. When withholding applies, remit deposits on schedule and report on Form 945. A monitored W-9 workflow catches gaps before the IRS does.",
      },
    ],
  }),

  guide({
    slug: "how-to-validate-a-vendor-tin",
    title: "How to Validate a Vendor TIN",
    summary:
      "Practical TIN validation steps for U.S. accounts payable — format checks, name matching, IRS tools, and when to escalate before you pay or file 1099s.",
    answer:
      "Validate every vendor TIN in two layers: first, confirm format and consistency with entity type (SSN vs EIN) and the legal name on the W-9; second, run IRS TIN matching before filing 1099s or after receiving a mismatch notice. Reject or escalate incomplete W-9s at intake — do not let unvalidated TINs reach year-end reporting.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "what-is-backup-withholding-and-how-to-avoid-it",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["tin", "w-9", "backup-withholding"],
    faqs: [
      {
        q: "Can I verify a TIN before paying a vendor?",
        a: "You can perform format validation and consistency checks immediately at W-9 intake. IRS TIN matching programs are typically used before information return filing, though proactive matching reduces year-end surprises.",
      },
      {
        q: "What if the name on the W-9 differs from the invoice?",
        a: "Report the name shown on the W-9 unless the vendor provides a written explanation and updated form. DBAs are common — the legal name on line 1 must still align with IRS records for the TIN provided.",
      },
    ],
    sections: [
      {
        heading: "TIN types and format basics",
        body: "A taxpayer identification number on Form W-9 is either a Social Security Number (SSN) for individuals and sole proprietors or an Employer Identification Number (EIN) for most entities. Format validation catches transposed digits and invalid ranges before bad data enters your vendor master.",
        bullets: [
          "SSN: XXX-XX-XXXX (individuals, sole props, some single-member LLCs)",
          "EIN: XX-XXXXXXX (corporations, partnerships, most LLCs)",
          "ITIN: begins with 9 — used by certain resident aliens",
        ],
      },
      {
        heading: "Match TIN to entity classification",
        body: "Cross-check the TIN type against the federal tax classification on the W-9. A corporation should not normally provide only an individual's SSN unless the entity is a sole proprietorship or disregarded entity taxed to an individual. Mismatches between LLC classification and TIN type are a leading cause of 1099 reporting errors.",
      },
      {
        heading: "Name matching rules",
        body: "IRS matching compares the TIN to the name combination IRS records associate with that TIN — for individuals, generally first and last name; for businesses, the legal name on line 1 of the W-9. Trade names on line 2 do not replace line 1 for matching purposes. If invoices use a DBA, your 1099 must still reflect the correct legal name unless you have documentation supporting a different reporting name.",
      },
      {
        heading: "IRS TIN matching programs",
        body: "The IRS offers TIN On-Line Matching (TINM) and the Interactive TIN Matching (TINM) platform for payers to verify name/TIN combinations before filing information returns. Bulk matching is available for larger filers. Use these tools in the window before 1099 filing — and immediately when you receive CP2100 notices listing proposed mismatches.",
      },
      {
        heading: "What to do when validation fails",
        body: "Do not file a 1099 with a known bad combination. Contact the vendor, send a B-notice when appropriate, request a corrected W-9, and document the outreach. If the vendor does not respond within IRS timeframes, backup withholding rules may apply to future payments. Keep a failure log tied to vendor ID and payment history.",
      },
      {
        heading: "Bake validation into onboarding",
        body: "Manual spot checks do not scale. Validate at the moment the vendor submits a W-9 — format, required fields, signature, classification — and store the validation result in the vendor record. AP should see a clear status: validated, pending, or failed. That status should gate payment in high-control environments.",
      },
    ],
  }),

  guide({
    slug: "how-to-request-a-w-9-from-a-new-vendor",
    title: "How to Request a W-9 from a New Vendor",
    summary:
      "A U.S. vendor onboarding playbook for requesting Form W-9 before first payment — clear, secure, and auditable from day one.",
    answer:
      "Before you pay a new U.S. vendor, send a single secure W-9 request tied to their vendor record — not a blank PDF attachment. Explain why you need it (1099 reporting and IRS compliance), specify the legal name and TIN you need on the form, and validate the completed W-9 before activating payment. Document the request, submission, and approval in one audit trail.",
    product: "w9-collector",
    workflow: "request-tax-documents-from-vendors",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "w9-vs-w8-which-form",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9", "tin", "w-8ben"],
    faqs: [
      {
        q: "Should W-9 collection happen before or after the contract is signed?",
        a: "Best practice is to collect the W-9 during vendor onboarding, alongside insurance and banking setup, and before the first invoice is approved. Waiting until payment is queued creates rush exceptions.",
      },
      {
        q: "What if the vendor is foreign?",
        a: "Foreign persons and entities generally complete Form W-8, not W-9. Confirm tax residency first — see the W-9 vs W-8 guide before sending the wrong form.",
      },
    ],
    sections: [
      {
        heading: "Request the W-9 before first payment",
        body: "IRS rules expect you to obtain the payee's TIN and certification before making reportable payments. In practice, that means the W-9 request is part of vendor setup — not a year-end afterthought. AP, procurement, and legal should agree: no payment until tax documentation is complete or a documented exception is approved.",
      },
      {
        heading: "What to send (and what to avoid)",
        body: "Send a secure link to a structured W-9 request prefilled with your company as the requester. Avoid emailing blank IRS PDFs — they get lost, completed incorrectly, and cannot be tracked.",
        bullets: [
          "Use a secure portal or request link per vendor",
          "Include a short explanation of why the form is required",
          "State the deadline relative to first invoice or work start",
          "Provide a contact for vendors who have entity-structure questions",
          "Never collect SSNs via unencrypted email if your policy prohibits it",
        ],
      },
      {
        heading: "Information to confirm on the returned W-9",
        body: "When the vendor submits, verify: line 1 legal name matches your vendor master and contract; address is current; federal tax classification is marked; TIN is present and formatted correctly; exempt payee and FATCA codes are completed if applicable; and the form is signed and dated. Reject incomplete submissions with specific feedback — not a generic 'please fix.'",
      },
      {
        heading: "Coordinate with procurement and AP",
        body: "Procurement may onboard the vendor in your ERP before AP sees an invoice. Align systems so vendor status shows 'W-9 pending' until validated. Invoice approval workflows should surface the tax document status — especially for new vendors under SOX or grant-compliance scrutiny.",
      },
      {
        heading: "Vendor master setup",
        body: "Enter the legal name and TIN from the W-9 into your ERP — not from the first invoice header. Mismatches between vendor master, W-9, and 1099 are a top cause of CP2100 notices. Link the stored W-9 PDF or submission record to the vendor ID.",
      },
      {
        heading: "Keep the audit trail from request to approval",
        body: "Record when the request was sent, when the vendor opened or submitted, who validated the form, and when payment was released. If a auditor asks whether you had a valid W-9 before a specific payment, you should answer from system history — not from someone's inbox search.",
      },
    ],
  }),

  guide({
    slug: "how-to-store-w-9s-securely",
    title: "How to Store W-9s Securely",
    summary:
      "How U.S. finance and compliance teams should store Form W-9 files containing SSNs and EINs — access control, retention, and audit-ready organization.",
    answer:
      "Store W-9s in a access-controlled system — not public shared drives or email — with encryption in transit and at rest, role-based permissions, version history, and retention aligned to your tax record policy (often seven years or longer). Link each W-9 to a vendor ID, log who accessed or exported it, and never use W-9 folders as general document dumping grounds.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "what-makes-a-good-audit-trail",
      "how-to-request-a-w-9-from-a-new-vendor",
    ],
    relatedGlossary: ["w-9", "audit-trail", "tin"],
    faqs: [
      {
        q: "How long should we keep W-9s?",
        a: "Align with your information return and federal tax record retention policy — many U.S. organizations retain W-9s for at least seven years after the last reportable payment, or longer if state law or industry rules require it.",
      },
      {
        q: "Is a shared Google Drive folder acceptable?",
        a: "Shared folders without access logging, versioning, or role boundaries are weak for documents containing SSNs. If you use cloud storage, restrict permissions narrowly and prohibit ad-hoc sharing links.",
      },
    ],
    sections: [
      {
        heading: "Why W-9 storage is a security issue",
        body: "Form W-9 contains sensitive taxpayer data — often a full SSN for sole proprietors and individuals. Treat W-9s like financial identity documents, not like generic vendor paperwork. A leaked folder is a data breach; an uncontrolled folder is a compliance failure.",
      },
      {
        heading: "Minimum storage requirements",
        body: "Your storage approach should meet both IRS audit needs and data-protection expectations.",
        bullets: [
          "Access limited to AP, finance, and compliance roles — not all employees",
          "Encryption in transit (TLS) and at rest",
          "Unique vendor linkage — one authoritative W-9 per payee identity",
          "Version history when forms are updated or re-collected",
          "Export capability for audits without manual reassembly",
          "No storage on personal drives, local downloads, or public links",
        ],
      },
      {
        heading: "Organization that survives turnover",
        body: "Name files systematically: vendor legal name, vendor ID, and received date — or better, let a system assign IDs so renaming does not break links. When AP staff leave, access should revoke automatically. The next person should find every W-9 from a vendor record, not from a departed colleague's inbox.",
      },
      {
        heading: "Segregation from unrelated documents",
        body: "Do not mix W-9s with invoices, contracts, and COIs in unstructured folders. Co-mingling makes permissioning harder and increases the chance tax documents are emailed casually. A vendor compliance record should reference each document type but store tax forms under controls appropriate to SSN data.",
      },
      {
        heading: "Logging access and exports",
        body: "Auditors and security reviewers increasingly ask who viewed or exported tax documents. Systems built for compliance workflows log requests, submissions, validations, and exports by user and timestamp. That log is part of your evidence — not an optional feature.",
      },
      {
        heading: "Retention and destruction",
        body: "Define retention in writing: how long W-9s stay active, when archived copies may be destroyed, and who approves destruction. Destroy securely — shredding paper, secure deletion for electronic files. Do not keep obsolete W-9s in active folders without marking them superseded; confusion drives reporting errors.",
      },
    ],
  }),

  guide({
    slug: "when-to-issue-a-1099-to-a-vendor",
    title: "When to Issue a 1099 to a Vendor",
    summary:
      "Which U.S. vendor payments require Form 1099-NEC or 1099-MISC — thresholds, exceptions, and how your W-9 file drives filing.",
    answer:
      "Issue Form 1099-NEC to report nonemployee compensation of $600 or more paid in the tax year to a U.S. person who is not an exempt corporation. Use 1099-MISC for other reportable categories such as rents and royalties. The W-9 on file supplies the name and TIN for filing — if it is missing or wrong, you cannot file correctly and may face penalties and backup withholding obligations.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "how-to-validate-a-vendor-tin",
      "how-to-handle-a-missing-w-9-at-year-end",
    ],
    relatedGlossary: ["tin", "w-9", "backup-withholding"],
    faqs: [
      {
        q: "Do I send a 1099 to corporations?",
        a: "Generally, payments to C corporations are exempt from 1099-NEC reporting. Exceptions exist — including medical and health care payments, attorneys' fees, and certain other categories. S-corps, partnerships, and LLCs taxed as partnerships typically receive 1099s for reportable payments.",
      },
      {
        q: "What is the 1099 reporting threshold?",
        a: "The common federal threshold is $600 in reportable payments per payee per year. Some categories have different rules — confirm the payment type against current IRS instructions each filing season.",
      },
    ],
    sections: [
      {
        heading: "1099-NEC: nonemployee compensation",
        body: "Form 1099-NEC reports payments to independent contractors, freelancers, and other nonemployees for services. If you paid a U.S. vendor $600 or more in nonemployee compensation during the calendar year, you generally must file 1099-NEC unless an exception applies. This is the form that replaced the old Box 7 reporting on 1099-MISC for most service payments.",
      },
      {
        heading: "1099-MISC: rents, royalties, and other categories",
        body: "Form 1099-MISC still covers reportable payments such as rents, royalties, prizes and awards, certain medical and health care payments, and other amounts listed in IRS instructions. Know which box your payment type maps to before year-end — AP coding during the year saves January rework.",
      },
      {
        heading: "Who typically does not get a 1099",
        body: "Common exceptions include payments to C corporations (for many payment types), payments made via credit card or third-party network (reported on 1099-K by the processor), and payments to foreign persons (different forms and withholding rules apply). When in doubt, confirm entity type on the W-9 before assuming exemption.",
        bullets: [
          "C corporations — often exempt from 1099-NEC for services",
          "Payments to foreign vendors — W-8 series, not 1099-NEC in most cases",
          "Credit card / PayPal / similar — often reported by payment settlement entity",
          "Employees — wages on W-2, not 1099",
        ],
      },
      {
        heading: "How the W-9 drives filing",
        body: "The name and TIN on the 1099 must match the payee's W-9 certification. Your filing software pulls from vendor master data that should originate from the W-9 — not from invoice headers or check payee lines typed manually. Gaps in W-9 collection surface in January as non-filings, incorrect filings, or frantic vendor outreach.",
      },
      {
        heading: "Deadlines and penalties",
        body: "1099-NEC copies generally go to recipients and the IRS by January 31 for the prior tax year. Late or incorrect filings can trigger IRS penalties per return. State filing requirements may apply separately. Build a year-end runbook: W-9 completeness check in November, TIN matching in December, filing in January.",
      },
      {
        heading: "Operational checklist before you file",
        body: "Reconcile AP payments to 1099 candidates, confirm entity type and exemptions, validate TINs, aggregate by payee, and document vendors below threshold you intentionally excluded. Export evidence showing the W-9 on file for each filed 1099 — auditors connect payments, forms, and certifications.",
      },
    ],
  }),

  guide({
    slug: "how-to-handle-a-missing-w-9-at-year-end",
    title: "How to Handle a Missing W-9 at Year-End",
    summary:
      "What U.S. accounts payable and tax teams should do when December arrives and vendor W-9s are still missing — without guessing TINs or missing filing deadlines.",
    answer:
      "Do not invent or guess TINs. Run a completeness report immediately, prioritize vendors above the 1099 threshold, send urgent secure W-9 requests with a hard internal deadline well before January 31, validate submissions as they arrive, and escalate unresolved payees to tax leadership for backup withholding and filing decisions. Document every outreach attempt — the audit trail matters as much as the form.",
    product: "w9-collector",
    workflow: "collect-w9s",
    relatedGuides: [
      "how-to-collect-w9s-from-vendors",
      "how-to-re-collect-stale-w-9s",
      "when-to-issue-a-1099-to-a-vendor",
      "what-is-backup-withholding-and-how-to-avoid-it",
    ],
    relatedGlossary: ["w-9", "tin", "backup-withholding"],
    faqs: [
      {
        q: "Can we file a 1099 without a W-9?",
        a: "You must report payments with the best available payee information, but filing with an incorrect or missing TIN risks penalties and B-notices. Exhaust documented outreach to obtain the W-9 before filing — and involve tax advisors when payees are unresponsive.",
      },
      {
        q: "Should we hold January payments until W-9s arrive?",
        a: "Many teams hold or flag payments to vendors missing W-9s, especially if prior payments were reportable. Coordinate with legal and tax before instituting holds — but do not continue paying indefinitely without tax documentation.",
      },
    ],
    sections: [
      {
        heading: "Why missing W-9s surface in December",
        body: "Throughout the year, AP processes invoices with informal exceptions — 'we'll get the W-9 later.' Later becomes December when finance runs 1099 prep and discovers hundreds of gaps. Vendors acquired mid-year, one-time contractors, and new suppliers onboarded outside procurement are frequent culprits.",
      },
      {
        heading: "Step 1: Quantify the gap",
        body: "Pull a report of vendors with reportable payments year-to-date and no validated W-9 on file. Sort by payment amount descending — the top of the list is your risk concentration. Separate domestic vs foreign payees; foreign vendors need W-8 forms, not W-9s.",
      },
      {
        heading: "Step 2: Urgent, tracked outreach",
        body: "Send secure W-9 requests with a clear deadline — not a passive email blast. Use templates that explain 1099 reporting obligations and what happens if the vendor does not respond. Log sends, opens, and submissions. Phone follow-up for high-dollar payees is appropriate.",
        bullets: [
          "Prioritize payees at or above $600 in reportable payments",
          "Request corrected forms for failed TIN validations, not just missing ones",
          "Set internal cutoff at least two weeks before filing software lock",
          "Escalate unresponsive vendors to tax and legal",
        ],
      },
      {
        heading: "Step 3: Validate before you file",
        body: "As W-9s return, validate immediately — do not batch them for January 30. Run TIN matching where available. Update vendor master before generating 1099 drafts. A last-minute W-9 with a typo is as bad as no W-9 if you do not validate.",
      },
      {
        heading: "When vendors still do not respond",
        body: "If a payee will not provide a TIN, consult your tax advisor on filing obligations, backup withholding on future payments, and whether you have sufficient documentation for reasonable cause relief from penalties. Continue documenting outreach — IRS penalty abatement often hinges on good-faith efforts shown in records.",
      },
      {
        heading: "Fix the root cause before next year",
        body: "Year-end fire drills are expensive. Gate new vendor payments on W-9 completion, monitor stale forms, and give AP visibility into tax document status year-round. The January pain is a symptom; the disease is unmonitored collection.",
      },
    ],
  }),
];
