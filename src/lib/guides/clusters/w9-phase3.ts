import type { GuideArticleSpec } from "../create-guide";

export const w9Phase3Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-handle-w9-for-s-corps",
    cluster: "w9",
    title: "How to Handle W-9 for S-Corps",
    summary:
      "Federal tax classification and 1099 reporting rules for S-corporation vendors on Form W-9 — what U.S. accounts payable teams must verify before payment and filing.",
    answer:
      "S-corporation vendors check the S corporation box on Form W-9 line 3 and provide the entity EIN in Part I. Unlike C-corporations, S-corps are generally reportable on Form 1099-NEC for service payments of $600 or more in a calendar year. AP teams must collect a complete, signed W-9 before first payment, validate that the S-corp box is checked — not the C-corp or LLC boxes — and confirm the legal name on line 1 matches IRS records for the EIN provided. Do not skip W-9 collection because the vendor is incorporated; S-corp status does not exempt service payments from 1099-NEC reporting. Run TIN matching before filing and re-collect when the entity converts to or from S-corp status.",
    primaryKeyword: "w9 s corp",
    relatedGuideSlugs: [
      "how-to-handle-w9-for-llc-vendors",
      "what-is-irs-form-w9",
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9","tin","1099-nec"],
    faqs: [
      {
        q: "Are S-corporation payments reportable on 1099-NEC?",
        a: "Yes, for services. S-corporations are reportable on Form 1099-NEC when payments for services reach $600 in a calendar year. They are not exempt like C-corporations for most service payments.",
      },
      {
        q: "What box should an S-corp check on line 3?",
        a: "Check S corporation. Do not check C corporation or LLC unless the entity actually changed tax classification.",
      },
      {
        q: "Can an LLC be taxed as an S-corp on the W-9?",
        a: "Yes. An LLC that elected S-corp treatment checks the LLC box and enters S as the classification code — not the standalone S corporation box.",
      },
      {
        q: "Do we need a W-9 from an S-corp even if payments are below $600?",
        a: "Collect at onboarding regardless of amount. Cumulative payments may exceed the threshold, and you need TIN certification for backup withholding compliance.",
      },
    ],
    sections: [
      {
        heading: "Why S-corp W-9 handling differs from C-corp",
        body: "C-corporations are generally exempt from 1099-NEC reporting for services. S-corporations are not. AP teams accustomed to skipping 1099s for incorporated vendors must read line 3 carefully — an Inc. on the invoice does not tell you the federal tax classification. The W-9 is the source document.",
      },
      {
        heading: "Correct W-9 completion for S-corporations",
        body: "Line 1 should show the legal name as shown on the S-corp tax return. Line 3: S corporation checked. Part I: EIN — not the shareholder SSN unless the entity is a disregarded entity owned by an individual. Part II: signature and date required.",
        bullets: [
          "Legal entity name on line 1",
          "S corporation box checked on line 3",
          "EIN in Part I matching IRS records",
          "Signed and dated Part II certification",
        ],
      },
      {
        heading: "1099-NEC reporting for S-corp vendors",
        body: "Report service payments of $600 or more using the name and TIN from the validated W-9. Track cumulative payments throughout the year. S-corp attorneys and medical corporations may have different rules — consult your tax advisor for edge cases.",
      },
      {
        heading: "Common S-corp W-9 errors",
        body: "Vendors check C corporation when they are S-corp, provide a shareholder SSN instead of the corporate EIN, or list a DBA on line 1 without the legal entity name. Reject incomplete forms and request correction before payment release.",
      },
      {
        heading: "When to re-collect S-corp W-9s",
        body: "Re-collect when the entity converts from LLC to S-corp, merges, changes legal name, or receives a new EIN. Entity changes mid-year may require splitting 1099 reporting across two TINs — coordinate with tax leadership.",
      },
      {
        heading: "Validate and document at intake",
        body: "Add S-corp classification to your validation checklist. Run TIN matching before 1099 filing. Store the W-9 with entity type flagged in the vendor master so filing software applies the correct reportability rules automatically.",
      },
    ],
  },
  {
    slug: "how-to-collect-w9-from-1099-vendors",
    cluster: "w9",
    title: "How to Collect W-9 from 1099 Vendors",
    summary:
      "How U.S. AP teams identify reportable 1099 vendors and collect validated W-9s before payments accumulate — segmentation, timing, and follow-up practices.",
    answer:
      "Every vendor who may receive reportable payments needs a validated W-9 on file before money flows — not after year-end reconciliation. Segment your vendor master by federal tax classification: sole proprietors, partnerships, LLCs taxed as partnerships or S-corps, and attorneys are typically reportable; C-corporations are often exempt for services but still need W-9s for TIN verification. Send secure W-9 requests at vendor setup, validate TIN, legal name, classification, signature, and date on receipt, and track cumulative payments against the $600 threshold throughout the year. Run a quarterly gap report of vendors paid without validated W-9s and escalate before December. Treat 1099 vendor W-9 collection as a continuous program, not a January filing task.",
    primaryKeyword: "collect w9 1099 vendors",
    relatedGuideSlugs: [
      "how-to-collect-w9s-from-vendors",
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-prepare-for-1099-filing-season",
      "how-to-collect-w9s-before-first-payment",
    ],
    relatedGlossary: ["w-9","1099-nec","tin"],
    faqs: [
      {
        q: "Which vendors need a W-9 for 1099 purposes?",
        a: "Generally sole proprietors, partnerships, LLCs not taxed as C-corps, S-corporations, and attorneys. Collect from all U.S. vendors at onboarding — do not wait to determine reportability.",
      },
      {
        q: "What if we paid a vendor all year without a W-9?",
        a: "Stop additional payments if possible, request the W-9 immediately, and follow B-notice or backup withholding procedures if the vendor does not respond. Document all outreach.",
      },
      {
        q: "How do we identify 1099 vendors in our ERP?",
        a: "Use federal tax classification from the W-9, not vendor category labels. Flag sole proprietors, LLCs, and partnerships automatically; review C-corp exemptions at filing.",
      },
      {
        q: "Should we collect W-9s from corporate vendors?",
        a: "Yes. Even exempt C-corps need W-9s for TIN matching and CP2100 response. Skipping collection based on assumed entity type creates year-end gaps.",
      },
    ],
    sections: [
      {
        heading: "Define your 1099 vendor population",
        body: "Reportable payees are not always obvious from invoice branding. A consultant operating as a single-member LLC, a law firm partnership, and a freelance designer are 1099 candidates. Build your list from W-9 classification data — not procurement categories.",
      },
      {
        heading: "Collect at onboarding, not at filing",
        body: "Configure vendor setup so W-9 submission is mandatory before first payment. Waiting until November means chasing vendors who no longer respond and filing with incomplete TIN data.",
        bullets: [
          "W-9 request at vendor record creation",
          "Validation before payment release",
          "Payment type and GL coding for reportability tracking",
          "Quarterly gap reports for missing forms",
        ],
      },
      {
        heading: "Track payments against thresholds",
        body: "Monitor cumulative service payments by vendor throughout the year. When a vendor approaches $600, confirm a validated W-9 exists. Vendors who cross the threshold without a W-9 are your highest-priority escalation cases.",
      },
      {
        heading: "Segment bulk collection campaigns",
        body: "Before 1099 season, pull vendors with reportable payments YTD and missing or stale W-9s. Tier by payment amount — high-dollar gaps first. Use secure portal links and automated reminders rather than individual email threads.",
      },
      {
        heading: "Validate classification drives reporting",
        body: "The W-9 federal tax classification determines whether you issue 1099-NEC, 1099-MISC, or no information return. A vendor marked as C-corp on a validated W-9 may be exempt; an LLC with partnership classification is reportable. File using W-9 data — not assumptions.",
      },
      {
        heading: "Close gaps before TIN matching",
        body: "Run TIN matching in October or November on your full 1099 vendor file. Resolve mismatches and missing forms before the filing deadline. Every gap you close in Q4 is one fewer corrected 1099 in February.",
      },
    ],
  },
  {
    slug: "what-is-line-3-on-form-w9",
    cluster: "w9",
    title: "What Is Line 3 on Form W-9?",
    summary:
      "What federal tax classification on Form W-9 line 3 means — and how U.S. AP teams use it to determine 1099 reportability and TIN validation.",
    answer:
      "Line 3 on Form W-9 is where the payee indicates federal tax classification — individual/sole proprietor, C corporation, S corporation, partnership, trust/estate, LLC with a classification code, or other. This single field drives whether payments are reportable on Form 1099-NEC, whether backup withholding exemption codes apply, and how you validate the TIN against IRS records. AP teams must read line 3 on every W-9 at intake: a vendor labeled LLC on invoices may check partnership, S-corp, or C-corp classification. LLC vendors must also enter C, S, or P after checking the LLC box. Misread line 3 causes both filing errors — skipping reportable vendors or reporting exempt C-corps — and TIN mismatches when the name does not match the classification on file with the IRS.",
    primaryKeyword: "w9 line 3",
    relatedGuideSlugs: [
      "what-is-irs-form-w9",
      "how-to-handle-w9-for-llc-vendors",
      "what-is-a-disregarded-entity-on-w9",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["w-9","tin","disregarded-entity"],
    faqs: [
      {
        q: "What if line 3 is blank?",
        a: "Reject the form. Federal tax classification is required for LLCs and essential for determining 1099 reportability. Request a corrected W-9 before payment release.",
      },
      {
        q: "What does LLC with S mean on line 3?",
        a: "The vendor checked Limited liability company and entered S — typically a single-member LLC disregarded as owned by an individual, or an LLC electing S-corp treatment. Both patterns affect reporting differently — validate name and TIN accordingly.",
      },
      {
        q: "Does line 3 determine 1099 reporting?",
        a: "Yes, in most cases. C-corporations are generally exempt from 1099-NEC for services. Sole proprietors, partnerships, S-corps, and most LLCs are reportable. Line 3 is your primary classification signal.",
      },
      {
        q: "Can a vendor change line 3 without notifying us?",
        a: "Entity elections and structural changes alter line 3. Re-collect W-9s when vendors merge, convert entity type, or elect new tax status — do not assume onboarding data stays current forever.",
      },
    ],
    sections: [
      {
        heading: "Purpose of line 3",
        body: "Line 3 tells the payer how the IRS classifies the payee for federal tax purposes. You use it alongside Part I TIN data to file information returns correctly and to apply backup withholding rules. It is not decorative — it is the classification field AP teams reference at filing time.",
      },
      {
        heading: "Classification options explained",
        body: "Individual/sole proprietor: reportable on 1099-NEC for services. C corporation: generally exempt from 1099-NEC for services. S corporation: reportable. Partnership: reportable. Trust/estate: context-dependent. LLC: must include C, S, or P code.",
        bullets: [
          "Individual/sole proprietor — typically reportable",
          "C corporation — generally exempt for services",
          "S corporation — reportable",
          "Partnership — reportable",
          "LLC — requires C, S, or P classification letter",
        ],
      },
      {
        heading: "LLC line 3 patterns AP must recognize",
        body: "LLC vendors check the LLC box and enter one letter. C means taxed as C-corp — often 1099 exempt for services. S means S-corp or disregarded single-member LLC. P means partnership — reportable. Vendors who check LLC without a letter submitted an incomplete form.",
      },
      {
        heading: "How line 3 connects to TIN validation",
        body: "IRS TIN matching compares the name on line 1 to the TIN in Part I for the entity type implied by line 3. A partnership EIN with an individual name on line 1 fails matching. Validate name, TIN, and line 3 together — not in isolation.",
      },
      {
        heading: "Common line 3 errors from vendors",
        body: "Sole proprietors check corporation boxes. Multi-member LLCs leave the classification letter blank. Vendors check multiple boxes. S-corps check C-corp by mistake. Reject ambiguous forms and provide one-line guidance in your W-9 request email explaining which box applies.",
      },
      {
        heading: "Store line 3 in your vendor master",
        body: "Capture line 3 classification in your ERP or vendor compliance system at W-9 validation. Use it to auto-flag 1099 reportability, drive filing exports, and trigger re-collection when classification changes. Manual re-reading of PDFs every January does not scale.",
      },
    ],
  },
  {
    slug: "how-to-handle-w9-for-partnerships",
    cluster: "w9",
    title: "How to Handle W-9 for Partnerships",
    summary:
      "W-9 collection and 1099 reporting for partnership vendors — legal names, EINs, and what U.S. AP teams verify at intake.",
    answer:
      "Partnership vendors check the Partnership box on Form W-9 line 3 and provide the partnership EIN in Part I. Line 1 must show the partnership legal name exactly as it appears on IRS records — not individual partner names. Payments to partnerships for services of $600 or more in a calendar year are generally reportable on Form 1099-NEC using the partnership name and EIN from the validated W-9. Collect a complete, signed W-9 before first payment, validate name/TIN consistency, and run TIN matching before filing. Law firm partnerships, medical group partnerships, and consulting partnerships are common AP payees — treat partnership W-9s as high-priority for both collection and 1099 reporting.",
    primaryKeyword: "w9 partnership",
    relatedGuideSlugs: [
      "how-to-handle-w9-for-llc-vendors",
      "what-is-line-3-on-form-w9",
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9","tin","1099-nec"],
    faqs: [
      {
        q: "Do we report payments to partnerships on 1099-NEC?",
        a: "Yes, for services totaling $600 or more in a calendar year. Use the partnership legal name and EIN from the W-9.",
      },
      {
        q: "What if a partner sends a W-9 with their SSN?",
        a: "Reject it. Partnerships should provide the partnership EIN unless the entity is a disregarded entity — which uses different W-9 rules.",
      },
      {
        q: "Can a partnership be exempt from 1099 reporting?",
        a: "Generally no for service payments. Partnerships are reportable payees unlike C-corporations in most service scenarios.",
      },
      {
        q: "What name goes on the 1099 for a law firm LLP?",
        a: "Use line 1 of the W-9 — the legal partnership name matching the EIN provided.",
      },
    ],
    sections: [
      {
        heading: "Identifying partnership vendors",
        body: "Partnerships include general partnerships, limited partnerships, and many LLPs. Invoices may show partner names — the W-9 line 1 legal entity name controls 1099 filing.",
      },
      {
        heading: "Correct W-9 completion for partnerships",
        body: "Line 1: partnership legal name. Line 3: Partnership checked. Part I: partnership EIN. Part II: authorized partner or officer signature required.",
        bullets: [
          "Partnership box checked on line 3",
          "Partnership EIN in Part I",
          "Legal name on line 1 — not individual partner names",
          "Signed and dated Part II certification",
        ],
      },
      {
        heading: "1099-NEC reporting rules",
        body: "Report service payments of $600 or more to the partnership EIN. Track cumulative payments throughout the year. Attorneys in partnership form are reportable even when other corporate rules might suggest exemption.",
      },
      {
        heading: "TIN mismatch risks with partnerships",
        body: "Partnerships often operate under shortened names or DBA labels on invoices. TIN matching uses the legal name on line 1 — mismatches trigger CP2100 notices.",
      },
      {
        heading: "Partnership vs multi-member LLC",
        body: "Multi-member LLCs taxed as partnerships check LLC with P classification — not the standalone Partnership box. Both are generally reportable but the W-9 pattern differs.",
      },
      {
        heading: "Re-collect on structural changes",
        body: "New partners, conversions to LLP, mergers, and name changes require updated W-9s. Trigger re-collection when vendor master shows entity change notifications.",
      },
    ],
  },
  {
    slug: "how-to-store-w9-records-for-irs-audit",
    cluster: "w9",
    title: "How to Store W-9 Records for IRS Audit",
    summary:
      "Retention, access controls, and audit trail practices U.S. AP teams use to store Form W-9 records so IRS and internal auditors can verify 1099 compliance.",
    answer:
      "Store W-9 records in a secure, centralized repository with role-based access — not in shared email folders or unsecured network drives. Retain each W-9 for at least four years after the year the related 1099 was filed, though many organizations keep forms for the life of the vendor relationship plus the statutory period. Each record should include the signed form, date received, validation status, TIN match results, and any corrected or superseded versions. Link W-9s to vendor master IDs so auditors can trace from payment data to TIN certification. Mask SSNs in reports and restrict full TIN visibility to authorized tax personnel. When the IRS requests documentation during an audit or CP2100 response, export records by vendor, tax year, and filing batch — not ad-hoc inbox searches.",
    primaryKeyword: "store w9 records audit",
    relatedGuideSlugs: [
      "how-to-store-w-9s-securely",
      "how-to-validate-a-vendor-tin",
      "how-to-prepare-for-1099-filing-season",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["w-9","audit-trail","tin"],
    faqs: [
      {
        q: "How long must we keep W-9s?",
        a: "At least four years after the year the related 1099 was filed. Many U.S. finance teams retain W-9s longer — often for the duration of the vendor relationship plus the statutory retention period.",
      },
      {
        q: "Can we store W-9s in our ERP attachment field?",
        a: "Yes, if access is controlled and retention meets policy. Dedicated tax document repositories with audit logging are stronger for IRS examination.",
      },
      {
        q: "Should we keep superseded W-9s after a correction?",
        a: "Yes. Retain both the original and corrected W-9 with timestamps. Auditors may ask why a TIN or name changed between filing years.",
      },
      {
        q: "What do IRS auditors request for W-9 evidence?",
        a: "Completed W-9s for sample payees, proof of TIN matching, B-notice records, and documentation of outreach when vendors failed to respond.",
      },
    ],
    sections: [
      {
        heading: "Retention requirements and best practice",
        body: "IRS rules require payers to retain W-9s and related documentation supporting information return filing. Four years from filing is the minimum for many records; your internal policy may require longer retention aligned with state statutes or industry requirements.",
      },
      {
        heading: "Centralize storage with access controls",
        body: "W-9s contain SSNs and EINs. Store them in a system with encryption, role-based access, and audit logging — not on individual laptops or open shared drives.",
        bullets: [
          "Central repository linked to vendor ID",
          "Role-based access limiting SSN visibility",
          "Encryption at rest and in transit",
          "Audit log of who viewed or exported records",
        ],
      },
      {
        heading: "Metadata auditors expect on each record",
        body: "The PDF alone is insufficient at scale. Capture date received, validation outcome, TIN match date, who approved the form, and whether the record was superseded by a correction.",
      },
      {
        heading: "Link W-9s to payments and 1099 filings",
        body: "Auditors trace from payment register to information return to source W-9. Vendor master linkage lets you pull all documentation for a payee and tax year in one export.",
      },
      {
        heading: "Handling corrected and stale W-9s",
        body: "When a vendor submits a corrected W-9 after a TIN mismatch, retain the original with the correction. Mark stale forms that exceeded your refresh policy even if not yet replaced.",
      },
      {
        heading: "Export for IRS and internal audit requests",
        body: "Build export capability by vendor, date range, and validation status before an auditor asks. Structured exports with cover sheets beat scrambling through email attachments during a field examination.",
      },
    ],
  },
  {
    slug: "how-to-handle-w9-for-trusts-and-estates",
    cluster: "w9",
    title: "How to Handle W-9 for Trusts and Estates",
    summary:
      "How U.S. AP teams collect and validate Form W-9 from trust and estate vendors — classification, TIN rules, and 1099 reporting considerations.",
    answer:
      "Trust and estate vendors check the Trust/estate box on Form W-9 line 3 and provide the trust or estate EIN in Part I. Line 1 should show the legal name of the trust or estate as it appears on IRS records — not the trustee's personal name alone. Reportability depends on payment type and trust classification: many service payments to trusts are reportable on Form 1099-MISC or 1099-NEC when thresholds are met, while some grantor trust scenarios require careful tax review. Collect a complete, signed W-9 before first payment, confirm an authorized trustee or fiduciary signed Part II, and validate the EIN through TIN matching. Trust and estate W-9s are less common in AP but appear in real estate, legal, and investment vendor populations — handle them with the same validation rigor as corporate and individual payees.",
    primaryKeyword: "w9 trust estate",
    relatedGuideSlugs: [
      "what-is-line-3-on-form-w9",
      "what-is-irs-form-w9",
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9","tin","1099-misc"],
    faqs: [
      {
        q: "Does a trust use an EIN or the trustee's SSN?",
        a: "Most trusts use a trust EIN. Grantor trusts may use the grantor's SSN in specific situations — escalate to tax if the TIN type seems inconsistent with the trust name.",
      },
      {
        q: "Are payments to trusts reportable on 1099?",
        a: "Often yes for rents, services, and other reportable payment types meeting IRS thresholds. Classification and payment type determine the specific form — consult tax for complex trust structures.",
      },
      {
        q: "Who should sign the W-9 for a trust?",
        a: "An authorized trustee, executor, or fiduciary with authority to bind the trust or estate should sign Part II.",
      },
      {
        q: "What if the vendor name includes 'Trust' but checks individual on line 3?",
        a: "Request clarification. A trust operating as a vendor should generally check Trust/estate and provide the trust EIN — not individual/sole proprietor.",
      },
    ],
    sections: [
      {
        heading: "When AP encounters trust and estate payees",
        body: "Trust and estate vendors appear in property management, legal settlements, investment administration, and family office payments. Invoices may reference a trustee by name — the W-9 line 1 trust or estate legal name controls TIN matching and 1099 filing.",
      },
      {
        heading: "Correct W-9 completion",
        body: "Line 1: legal trust or estate name. Line 3: Trust/estate checked. Part I: trust or estate EIN. Part II: fiduciary signature and date.",
        bullets: [
          "Trust/estate box checked on line 3",
          "Trust or estate EIN in Part I",
          "Fiduciary signature on Part II",
          "Legal entity name — not trustee personal name on line 1",
        ],
      },
      {
        heading: "1099 reporting considerations",
        body: "Reportable payment types include rents, royalties, and services depending on amount and character. Grantor trusts and complex estate structures may need tax team review before you determine reportability.",
      },
      {
        heading: "Validation checklist for trust W-9s",
        body: "Confirm EIN format, trust name consistency with contract and invoice, authorized signatory, and signature date. Run TIN matching before filing — trust names with punctuation variations often fail matching.",
      },
      {
        heading: "Grantor trust edge cases",
        body: "Some grantor trusts use the grantor's SSN while listing a trust name. These scenarios are uncommon in standard AP but require tax review — do not auto-accept without classification confirmation.",
      },
      {
        heading: "Document and retain for audit",
        body: "Store trust W-9s with the same security and retention standards as other tax documents. Link to vendor ID and note any tax team review outcome in the vendor master for future filing reference.",
      },
    ],
  },
  {
    slug: "how-to-chase-vendors-for-missing-w9s",
    cluster: "w9",
    title: "How to Chase Vendors for Missing W-9s",
    summary:
      "Escalation paths, reminder cadences, and payment holds U.S. AP teams use when vendors fail to return Form W-9 before deadlines.",
    answer:
      "Chasing missing W-9s requires a defined escalation sequence — not ad-hoc emails in December. Send an initial secure request at onboarding with a stated deadline tied to first payment. If incomplete after seven days, send reminder one referencing the payment hold policy. At fourteen days, send reminder two with an explicit hold date and copy procurement if they own the relationship. At twenty-one days, activate the payment hold and notify tax leadership for high-dollar or reportable payees. Log every send, open, and bounce in your W-9 collection system — auditors ask what you did when vendors did not respond, not whether you tried once. Phone escalation works for strategic vendors after two unanswered emails. Document the call. For chronic non-responders before year-end, initiate B-notice procedures rather than filing with missing TINs.",
    primaryKeyword: "chase missing w9",
    relatedGuideSlugs: [
      "how-to-send-a-w9-request-email",
      "how-to-set-w9-collection-deadlines",
      "how-to-handle-a-missing-w-9-at-year-end",
      "how-to-bulk-request-w9s-from-vendors",
    ],
    relatedGlossary: ["w-9","audit-trail","tin"],
    faqs: [
      {
        q: "How many reminders should AP send?",
        a: "Standard cadence: initial request, reminder at seven days, second reminder at fourteen days with hold warning, payment hold at twenty-one days. Adjust for your policy but document every step.",
      },
      {
        q: "Should procurement help chase missing W-9s?",
        a: "Yes, for vendors they onboarded. Buyers often get faster responses than AP. Coordinate messaging so vendors receive consistent requirements.",
      },
      {
        q: "Can we pay a vendor while chasing the W-9?",
        a: "Define exceptions with tax approval. Default should be hold until validated — especially for reportable payees approaching the $600 threshold.",
      },
      {
        q: "What if the vendor says they already submitted?",
        a: "Check your portal and vendor record first. If truly missing, resend the secure link. If rejected for validation errors, tell the vendor specifically what to fix.",
      },
    ],
    sections: [
      {
        heading: "Why structured chasing beats year-end panic",
        body: "Vendors ignore one vague email. A documented sequence with escalating consequences produces higher completion rates and gives auditors evidence of systematic outreach — not last-minute scrambling.",
      },
      {
        heading: "Standard reminder cadence",
        body: "Publish the cadence in your vendor policy and reference it in every W-9 request email.",
        bullets: [
          "Day 0: Initial secure W-9 request with deadline",
          "Day 7: First reminder",
          "Day 14: Second reminder with hold warning",
          "Day 21: Payment hold activated",
          "Day 30+: Tax leadership escalation for reportable payees",
        ],
      },
      {
        heading: "Payment holds that vendors take seriously",
        body: "Reminders without consequences get deprioritized. Tie the deadline to invoice release and state the hold date explicitly. Coordinate with procurement so buyers do not promise payment while AP is waiting on tax documentation.",
      },
      {
        heading: "Phone and executive escalation",
        body: "High-dollar vendors, law firms, and sole proprietors hesitant about SSN sharing may need a phone call after two unanswered emails. Document date, contact, and outcome. Escalate to vendor management or legal for chronic non-responders.",
      },
      {
        heading: "Track outreach in a system of record",
        body: "Manual Outlook threads do not prove delivery at audit time. Use a W-9 collection platform that logs sends, opens, submissions, and reminder counts per vendor ID.",
      },
      {
        heading: "When chasing fails before year-end",
        body: "For reportable payees who never respond, follow B-notice and backup withholding procedures. Do not file 1099s with guessed TINs. Hand unresolved cases to tax leadership with payment totals attached before the filing deadline.",
      },
    ],
  },
  {
    slug: "how-to-validate-w9-address-fields",
    cluster: "w9",
    title: "How to Validate W-9 Address Fields",
    summary:
      "Address validation on Form W-9 — what U.S. AP teams check on lines 5 and 6 and why correct payee addresses matter for 1099 filing.",
    answer:
      "Form W-9 lines 5 and 6 collect the payee's address — line 5 for the street address and line 6 for city, state, and ZIP. Validate that both lines are complete, formatted plausibly, and consistent with the vendor master and remittance address on file. The W-9 address is the default mailing address for 1099 Copy B — incorrect addresses cause returned mail, vendor disputes, and IRS penalties for failure to furnish. AP teams should reject W-9s with blank address fields, P.O. Box-only entries where street address is required by your policy, or obvious typos in ZIP codes. Cross-check against USPS-validated addresses when your system supports it. Address validation is secondary to TIN and classification checks but should not be skipped — a perfect TIN with an undeliverable 1099 address still creates filing season problems.",
    primaryKeyword: "validate w9 address",
    relatedGuideSlugs: [
      "how-to-validate-a-vendor-tin",
      "what-is-irs-form-w9",
      "how-to-validate-w9-signature-and-date",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["w-9","tin","1099-nec"],
    faqs: [
      {
        q: "Is address required on a W-9?",
        a: "Yes. Lines 5 and 6 should be completed. An address missing or incomplete may indicate a rushed submission and should be corrected before acceptance.",
      },
      {
        q: "Can vendors use a P.O. Box on the W-9?",
        a: "P.O. Boxes are acceptable on Form W-9 in many cases. Confirm the address can receive 1099 Copy B mail — some organizations require a physical address for certain vendor types.",
      },
      {
        q: "What if the W-9 address differs from the remittance address?",
        a: "Flag the discrepancy. The W-9 address controls 1099 mailing unless the vendor provides a corrected form. Update vendor master notes and request clarification for significant differences.",
      },
      {
        q: "Does a foreign address invalidate a W-9?",
        a: "No. U.S. persons abroad may have foreign addresses. Verify U.S. person status separately — address alone does not determine W-9 vs W-8 eligibility.",
      },
    ],
    sections: [
      {
        heading: "Why W-9 address fields matter",
        body: "The IRS requires payers to furnish Copy B of information returns to payees. The W-9 address is your primary source for that mailing. Returned 1099 mail triggers vendor complaints and may indicate you failed to furnish statements correctly.",
      },
      {
        heading: "What to validate on lines 5 and 6",
        body: "Confirm line 5 has a street address or acceptable P.O. Box. Confirm line 6 has city, state, and ZIP in a recognizable format. Reject forms with blank lines, placeholder text, or incomplete ZIP codes.",
        bullets: [
          "Line 5: street or P.O. Box present",
          "Line 6: city, state, ZIP complete",
          "ZIP format valid for U.S. addresses",
          "No placeholder values like TBD or N/A",
        ],
      },
      {
        heading: "Cross-check against vendor master",
        body: "Compare W-9 address to remittance and corporate addresses in your ERP. Minor suite number differences are common; different states or countries warrant review — especially for vendors claiming U.S. person status with foreign addresses.",
      },
      {
        heading: "USPS validation and standardization",
        body: "If your W-9 collection platform supports address validation, run it at submission. Standardized addresses reduce 1099 mail returns and keep vendor master data clean.",
      },
      {
        heading: "When to request address correction",
        body: "Request a corrected W-9 when address fields are blank, clearly wrong, or inconsistent with contract documents. Do not silently overwrite W-9 address with remittance data — the certified address on the form is your filing source.",
      },
      {
        heading: "Include address in validation checklist",
        body: "Add address completeness to your W-9 intake checklist alongside TIN, classification, and signature checks. Address failures are quick to catch at onboarding and expensive to fix during 1099 mail merge in January.",
      },
    ],
  },
  {
    slug: "how-to-onboard-vendors-with-w9-and-oig-together",
    cluster: "w9",
    title: "How to Onboard Vendors with W-9 and OIG Together",
    summary:
      "Combined vendor onboarding workflow for U.S. healthcare and finance teams collecting Form W-9 and OIG LEIE screening in a single packet.",
    answer:
      "Onboard vendors with W-9 collection and OIG LEIE screening in the same workflow — not as separate requests weeks apart. Healthcare providers paying vendors for services connected to Medicare or Medicaid need both tax documentation and exclusion clearance before first payment. Configure your vendor packet to send a secure link covering W-9 submission, LEIE search execution, and any COI or contract requirements in one branded experience. Block payment until W-9 validation passes and OIG screening shows clear or resolved match disposition. Record W-9 receipt date, TIN validation status, LEIE search date, list version, and screening result on the vendor master. Combined onboarding reduces vendor fatigue, eliminates gaps where AP has a W-9 but compliance never ran OIG, and produces audit-ready evidence for CMS and IRS reviews from day one.",
    primaryKeyword: "w9 oig vendor onboarding",
    relatedGuideSlugs: [
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-collect-w9s-before-first-payment",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-request-a-w-9-from-a-new-vendor",
    ],
    relatedGlossary: ["w-9","oig-exclusion","audit-trail"],
    faqs: [
      {
        q: "Should W-9 or OIG screening happen first?",
        a: "Run both in parallel during onboarding. Neither should block the other from starting, but payment should remain on hold until both complete successfully.",
      },
      {
        q: "Do non-healthcare vendors need OIG screening?",
        a: "OIG LEIE screening applies when vendors perform services connected to federal healthcare programs. Pure non-healthcare vendors may need W-9 only — document your scope determination.",
      },
      {
        q: "Can one portal collect W-9 and run OIG search?",
        a: "Yes. Unified vendor packets reduce incomplete onboarding and give auditors one record showing tax and exclusion compliance at setup.",
      },
      {
        q: "What if OIG finds a match during onboarding?",
        a: "Hold onboarding, investigate the match, and do not release payment until compliance clears or confirms false positive. See match resolution guidance for investigation steps.",
      },
    ],
    sections: [
      {
        heading: "Why combine W-9 and OIG at onboarding",
        body: "Separate workflows create gaps: AP collects W-9 while compliance never screens, or screening runs before you have the legal name from the W-9 for accurate LEIE search. A unified packet ensures both complete before first payment.",
      },
      {
        heading: "Build the combined vendor packet",
        body: "Include W-9 request, LEIE screening trigger, business associate agreement if applicable, and COI collection in one onboarding link. Vendors complete everything once; your team validates each component.",
        bullets: [
          "Secure W-9 submission with validation",
          "LEIE search using W-9 legal name",
          "Screening result logged on vendor record",
          "Payment hold until both pass",
        ],
      },
      {
        heading: "Use W-9 data to drive OIG search",
        body: "The legal name on line 1 of the W-9 should feed your LEIE search — reducing name mismatches from invoice DBAs. Search aliases and trade names after the primary legal name check.",
      },
      {
        heading: "Validation gates before payment release",
        body: "Define pass criteria: W-9 validated with TIN format check, signature present, and OIG clear or false positive documented. Partial completion should not trigger payment release.",
      },
      {
        heading: "Re-screening after onboarding",
        body: "Initial combined onboarding is the floor. Schedule recurring OIG re-screens per your compliance policy and W-9 refresh on entity changes or your internal staleness threshold.",
      },
      {
        heading: "Audit evidence from unified onboarding",
        body: "Export onboarding packets showing W-9 timestamp, validation checklist, LEIE search date, and result. CMS and payer auditors expect both tax and exclusion documentation for healthcare vendor relationships.",
      },
    ],
  },
  {
    slug: "how-to-set-w9-refresh-reminders",
    cluster: "w9",
    title: "How to Set W-9 Refresh Reminders",
    summary:
      "How U.S. AP teams schedule W-9 refresh reminders when forms go stale, entity details change, or annual re-collection policy requires updated certifications.",
    answer:
      "W-9 forms do not expire by IRS statute, but stale certifications create TIN mismatch and filing risk when vendors change entity structure, legal names, or EINs without notifying you. Set W-9 refresh reminders based on your internal policy — commonly one to three years — and trigger immediate re-collection on entity change events. Configure your vendor compliance system to flag forms older than the threshold, send automated refresh requests with secure submission links, and block payment if the vendor does not respond before the next reportable payment. Also refresh after CP2100 notices, failed TIN matching, and mergers. Reminder emails should explain why refresh is required — not just ask for a new form. Track refresh completion rates and overdue vendors monthly so tax leadership sees gaps before 1099 filing season, not during it.",
    primaryKeyword: "w9 refresh reminders",
    relatedGuideSlugs: [
      "how-to-re-collect-stale-w-9s",
      "how-to-set-w9-collection-deadlines",
      "how-to-bulk-request-w9s-from-vendors",
      "how-to-fix-a-tin-mismatch-on-a-w9",
    ],
    relatedGlossary: ["w-9","audit-trail","tin"],
    faqs: [
      {
        q: "How often should we refresh W-9s?",
        a: "Common policies: annual refresh for high-volume reportable payees, or every one to three years for stable vendor relationships. Document your threshold in tax procedure.",
      },
      {
        q: "What triggers immediate W-9 refresh outside the schedule?",
        a: "Entity changes, mergers, new EIN, legal name change, failed TIN matching, CP2100 notice, or vendor notification of reclassification.",
      },
      {
        q: "Should refresh reminders include a deadline?",
        a: "Yes. Tie refresh deadlines to continued payment eligibility — vendors respond faster when the consequence is explicit.",
      },
      {
        q: "Do we discard the old W-9 after refresh?",
        a: "No. Retain superseded forms with timestamps for audit trail. The new W-9 becomes active; the old form stays in history.",
      },
    ],
    sections: [
      {
        heading: "Why refresh reminders matter",
        body: "A W-9 collected three years ago may no longer reflect the vendor's current legal name, EIN, or tax classification. Filing 1099s against stale data produces mismatches, corrected filings, and vendor disputes.",
      },
      {
        heading: "Define your refresh policy",
        body: "Document staleness thresholds by vendor tier. High-dollar reportable payees may refresh annually; stable low-risk vendors every three years. Event-driven refresh applies regardless of age.",
        bullets: [
          "Policy threshold: 1, 2, or 3 years",
          "Event triggers: merger, name change, new EIN",
          "Immediate refresh after TIN mismatch",
          "Annual refresh option for all active reportable payees",
        ],
      },
      {
        heading: "Configure automated reminders",
        body: "Set system alerts when W-9 age exceeds policy. Send automated refresh requests with secure links — not blank PDF attachments. Schedule reminder two if no response within fourteen days.",
      },
      {
        heading: "Coordinate refresh with 1099 season",
        body: "Run a bulk refresh campaign in September for vendors with forms older than threshold and reportable payments YTD. Early refresh gives time for corrections before TIN matching.",
      },
      {
        heading: "Payment consequences for overdue refresh",
        body: "Link refresh deadlines to payment holds for vendors with reportable payment history. Exceptions require tax leadership approval with a hard submission deadline.",
      },
      {
        heading: "Track refresh metrics",
        body: "Report monthly: vendors due for refresh, completed, overdue, and blocked. Rising overdue counts signal process gaps — fix in Q3, not January when filing starts.",
      },
    ],
  },
  {
    slug: "how-to-handle-w9-for-rental-payments",
    cluster: "w9",
    title: "How to Handle W-9 for Rental Payments",
    summary:
      "W-9 collection and Form 1099-MISC reporting for rent payments to U.S. landlords and property vendors — thresholds and validation for AP teams.",
    answer:
      "Rent payments to U.S. landlords generally require Form W-9 collection and may be reportable on Form 1099-MISC when total rent paid reaches $600 or more in a calendar year — including payments to individuals, partnerships, LLCs, and trusts. Collect a validated W-9 before the first rent disbursement, confirm the legal name and TIN on line 1 and Part I, and verify federal tax classification on line 3. Real estate payments to C-corporations may be exempt from 1099 reporting in many cases, but you still need the W-9 for TIN verification. Track cumulative rent by payee throughout the year. Property managers paying on behalf of multiple owners must ensure each landlord payee has a W-9 on file. Rent reporting uses 1099-MISC box 1 — not 1099-NEC — so coordinate with tax on correct form selection and filing.",
    primaryKeyword: "w9 rental payments",
    relatedGuideSlugs: [
      "when-to-issue-a-1099-to-a-vendor",
      "what-is-irs-form-w9",
      "how-to-collect-w9s-before-first-payment",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9","1099-misc","tin"],
    faqs: [
      {
        q: "Is rent reported on 1099-NEC or 1099-MISC?",
        a: "Rent is generally reported on Form 1099-MISC, box 1 — not 1099-NEC. Confirm with your tax team for your specific payment scenarios.",
      },
      {
        q: "Do we need a W-9 from corporate landlords?",
        a: "Yes. Collect W-9 for TIN verification even when the landlord may be exempt from 1099 reporting as a C-corporation.",
      },
      {
        q: "What is the reporting threshold for rent?",
        a: "Generally $600 or more in rent paid during the calendar year to a single payee.",
      },
      {
        q: "Does rent paid to a property manager require a W-9 from the owner?",
        a: "If you pay the owner directly, collect the owner's W-9. If you pay a property manager who is the payee of record, collect from the manager — clarify the payment flow in your lease or management agreement.",
      },
    ],
    sections: [
      {
        heading: "Rent payments and information reporting",
        body: "IRS rules treat rent as a reportable payment category distinct from services. AP teams handling facility leases, equipment rentals, and property payments must collect W-9s and track rent separately from service payments for correct 1099 form selection.",
      },
      {
        heading: "Collect W-9 before first rent payment",
        body: "Landlords and property vendors should complete W-9 at lease execution or vendor setup — before the first disbursement. Rent often continues for years; starting without a W-9 means reporting risk accumulates silently.",
        bullets: [
          "W-9 at lease signing or vendor setup",
          "Validate landlord legal name and TIN",
          "Track rent payments separately from services",
          "Confirm 1099-MISC reporting with tax",
        ],
      },
      {
        heading: "Entity types common in rental payments",
        body: "Individual landlords use SSN or EIN with sole proprietor classification. LLC property owners follow LLC line 3 rules. Trusts holding real estate check Trust/estate. Each pattern affects TIN matching and reportability.",
      },
      {
        heading: "1099-MISC filing for rent",
        body: "Report rent of $600 or more on Form 1099-MISC using the name and TIN from the validated W-9. Furnish Copy B to the landlord and file Copy A by the IRS deadline. Run TIN matching before filing.",
      },
      {
        heading: "Property manager and multi-owner scenarios",
        body: "When a management company collects rent on behalf of owners, clarify who receives the 1099. Document the payment flow and collect W-9s from the correct payee of record — not every intermediate party.",
      },
      {
        heading: "Validate and retain rental W-9s",
        body: "Store landlord W-9s with the same security and retention standards as service vendor forms. Link to property ID or lease record for audit traceability from rent payment to information return.",
      },
    ],
  },
  {
    slug: "how-to-collect-w9-from-marketplace-vendors",
    cluster: "w9",
    title: "How to Collect W-9 from Marketplace Vendors",
    summary:
      "W-9 obligations when paying vendors through Amazon, freelance platforms, or other marketplaces — payer of record rules for U.S. AP teams.",
    answer:
      "Marketplace and platform payments create confusion about who collects the W-9 and files the 1099. If your organization pays the vendor directly — outside the platform's payment system — you are the payer and must collect Form W-9 and file information returns when thresholds are met. If the platform is the payer of record and issues the 1099, you may not need a duplicate W-9 for the same payments — but document the payment flow in writing. Many organizations pay marketplace vendors directly while also using the platform for discovery; in that case W-9 collection at your vendor onboarding is mandatory. Collect W-9 before first direct payment, validate TIN and classification, and clarify in procurement policy that platform membership does not replace your tax documentation requirements. When in doubt, collect the W-9 — duplicate collection is cheaper than unreportable payments.",
    primaryKeyword: "w9 marketplace vendors",
    relatedGuideSlugs: [
      "how-to-collect-w9-from-contractors",
      "how-to-collect-w9-from-freelancers",
      "how-to-request-a-w-9-from-a-new-vendor",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["w-9","1099-nec","tin"],
    faqs: [
      {
        q: "If Upwork or Fiverr pays the contractor, do we need a W-9?",
        a: "If the platform is the payer of record and issues the 1099, you may not need a separate W-9 for those platform-processed payments. If you pay the contractor directly, you must collect W-9.",
      },
      {
        q: "What about Amazon Marketplace sellers we pay directly?",
        a: "Direct payments to sellers require W-9 collection from your organization when you are the payer. Marketplace facilitation rules vary — confirm payment flow with tax.",
      },
      {
        q: "Should procurement require W-9 before approving marketplace vendors?",
        a: "Yes, when your AP team will pay the vendor directly. Add W-9 to marketplace vendor setup alongside banking and contract requirements.",
      },
      {
        q: "Can we rely on the platform's tax documentation?",
        a: "Request confirmation of who files the 1099. Do not assume — document the payer of record for each relationship.",
      },
    ],
    sections: [
      {
        heading: "Determine payer of record first",
        body: "Before skipping W-9 collection, answer: who actually disburses funds to the vendor? If your AP system sends payment, you are likely the payer regardless of how you found the vendor. Platform-facilitated payments where the platform issues 1099 may shift obligation — get it in writing.",
      },
      {
        heading: "Direct pay despite marketplace origin",
        body: "Teams often hire through a platform but pay via ACH or check outside it. That makes you the payer. Collect W-9 at onboarding the same as any other contractor or supplier.",
        bullets: [
          "Document payment flow in vendor record",
          "Collect W-9 when your AP disburses funds",
          "Do not assume platform handled tax forms",
          "Track cumulative payments for 1099 thresholds",
        ],
      },
      {
        heading: "W-9 collection for marketplace-sourced vendors",
        body: "Send secure W-9 requests when the vendor record is created — before first invoice. Marketplace vendors may not expect W-9 requirements; explain the obligation clearly in onboarding email.",
      },
      {
        heading: "1099 filing when you are the payer",
        body: "File 1099-NEC or other applicable forms using W-9 data when your direct payments exceed IRS thresholds. Do not double-report payments already reported by a platform — reconcile payment sources at year-end.",
      },
      {
        heading: "Procurement policy alignment",
        body: "Update vendor policy to state that marketplace origin does not exempt vendors from W-9 when your organization pays directly. Train buyers who source through platforms to route vendors through standard AP onboarding.",
      },
      {
        heading: "When platform and direct payments mix",
        body: "Some vendors receive both platform-processed and direct payments. Track each stream separately. You report only payments you made — but you need W-9 on file for your direct disbursements regardless of platform activity.",
      },
    ],
  },
  {
    slug: "how-to-handle-w9-for-freelancers",
    cluster: "w9",
    title: "How to Handle W-9 for Freelancers",
    summary:
      "W-9 collection, SSN security, and 1099-NEC reporting for freelance vendors — practices U.S. AP and procurement teams should follow.",
    answer:
      "Freelancers are almost always U.S. persons completing Form W-9 as sole proprietors or single-member LLCs — and service payments of $600 or more per calendar year are reportable on Form 1099-NEC. Collect a validated W-9 before the freelancer's first payment, not after project delivery. Validate legal name on line 1, federal tax classification, TIN, signature, and date. Route collection through a secure portal — never request SSNs via plain email. Track cumulative payments across multiple small invoices; freelancers often cross the $600 threshold mid-year. Treat freelance W-9s as high-priority because they carry SSNs, have high mismatch rates from DBA confusion, and are a top source of year-end filing gaps when collected late. Integrate W-9 collection into freelance onboarding alongside contract signature and payment setup.",
    primaryKeyword: "w9 freelancers",
    relatedGuideSlugs: [
      "how-to-collect-w9-from-contractors",
      "how-to-handle-w9-for-sole-proprietors",
      "how-to-collect-w9s-before-first-payment",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["w-9","1099-nec","tin"],
    faqs: [
      {
        q: "Do all freelancers need a W-9?",
        a: "Collect from every U.S. freelancer you may pay. Even small projects can accumulate to $600 across the year.",
      },
      {
        q: "What if a freelancer is an LLC?",
        a: "LLC freelancers follow LLC W-9 rules — check the LLC box with classification code. Do not accept sole proprietor classification from an LLC without correction.",
      },
      {
        q: "How do we protect freelancer SSNs?",
        a: "Use encrypted W-9 collection portals, restrict ERP visibility, and never forward completed W-9s in email chains.",
      },
      {
        q: "Should HR or AP collect freelancer W-9s?",
        a: "Whoever owns the engagement can send the request, but AP or a central compliance function should validate and store the form — not individual hiring managers.",
      },
    ],
    sections: [
      {
        heading: "Why freelancers are high-priority W-9 payees",
        body: "Freelancers typically operate as sole proprietors or disregarded LLCs with service payments reportable on 1099-NEC. They are among the most common payees missing W-9s at year-end because onboarding was informal.",
      },
      {
        heading: "Collect W-9 at engagement start",
        body: "Request W-9 when the freelance contract is signed or the vendor record is created — before the first invoice. Waiting until project completion means you may already owe reportable payments without a TIN on file.",
      },
      {
        heading: "Freelancer W-9 validation checklist",
        body: "Confirm individual or LLC classification, legal name matching IRS records, TIN format, signature, and date. Reject forms listing only a trade name on line 1.",
        bullets: [
          "Legal name on line 1 — not DBA alone",
          "Correct sole proprietor or LLC classification",
          "SSN or EIN in Part I",
          "Secure portal submission — not email reply",
        ],
      },
      {
        heading: "Track cumulative freelance payments",
        body: "Multiple small invoices add up. Monitor year-to-date totals by freelancer and confirm W-9 on file before crossing $600. Flag freelancers approaching threshold in monthly AP reports.",
      },
      {
        heading: "1099-NEC filing for freelancers",
        body: "File Form 1099-NEC by the IRS deadline using W-9 name and TIN. Run TIN matching before filing. Send Copy B to the freelancer at the address on the W-9.",
      },
      {
        heading: "Integrate into freelance onboarding workflow",
        body: "Embed W-9 in the same workflow as contract e-signature and payment setup. Block payment until validation passes. Centralize storage so AP does not chase individual managers in December.",
      },
    ],
  },
];
