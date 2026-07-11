import type { GuideArticleSpec } from "../create-guide";

export const w9Phase1Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-send-a-w9-request-email",
    cluster: "w9",
    title: "How to Send a W-9 Request Email",
    summary:
      "Email templates and sending practices U.S. accounts payable teams use to request Form W-9 — clear, compliant, and trackable without exposing SSNs in reply threads.",
    answer:
      "Send a W-9 request email that explains why you need the form, links to a secure submission portal instead of attaching a blank PDF, states your deadline relative to first payment, and names a contact for entity-structure questions. Keep the email short, professional, and free of unnecessary tax jargon. Never ask vendors to reply with completed W-9s containing SSNs in plain email if your policy prohibits it — route them to a secure upload or e-signature flow and log when the request was sent, opened, and completed.",
    primaryKeyword: "w9 request email",
    relatedGuideSlugs: [
      "how-to-request-a-w-9-from-a-new-vendor",
      "how-to-collect-w9s-from-vendors",
      "how-to-bulk-request-w9s-from-vendors",
    ],
    relatedGlossary: ["w-9", "tin", "audit-trail"],
    faqs: [
      {
        q: "Should I attach a blank W-9 PDF to the email?",
        a: "Avoid blank PDF attachments when you can send a secure request link instead. Attachments get lost, completed incorrectly, and cannot be tracked. If you must attach the IRS form, pair it with a portal link and clear instructions.",
      },
      {
        q: "What subject line works best for a W-9 request?",
        a: "Use a direct subject that names your company and the action required — for example, 'Action required: W-9 for [Vendor Name] — [Your Company].' Avoid vague subjects like 'Tax form' that vendors ignore or route to spam.",
      },
      {
        q: "How many follow-up emails should AP send?",
        a: "Send an initial request at onboarding, a reminder at seven days if incomplete, and an escalation at fourteen days tied to payment hold policy. Log every send so year-end audits show documented outreach, not ad-hoc chasing.",
      },
      {
        q: "Can procurement send the W-9 request instead of AP?",
        a: "Yes, if procurement owns vendor onboarding — but the email should come from a monitored mailbox or system address so submissions and reminders are not lost when a buyer leaves. AP should still validate the returned form.",
      },
    ],
    sections: [
      {
        heading: "What a good W-9 request email includes",
        body: "The email should answer three vendor questions in plain language: why you need the form, how to submit it, and what happens if they miss the deadline. Reference your company name, the vendor's legal name as you have it on file, and the relationship — new vendor, annual refresh, or corrected form after a TIN mismatch.",
        bullets: [
          "One-sentence explanation of 1099 reporting and IRS requirements",
          "Secure link to complete and sign the W-9",
          "Deadline tied to first invoice or payment release",
          "Contact email or phone for entity-type questions",
          "Statement that incomplete forms delay payment",
        ],
      },
      {
        heading: "Sample structure (not legal advice)",
        body: "Open with context, state the requirement, provide the link, set the deadline, and close with a contact. Example framing: 'Before we can process payment, we need a completed IRS Form W-9 for [Legal Name]. Use the secure link below to submit — it takes about five minutes. We need this by [date] to release your first invoice.' Adjust tone for your vendor base but keep the compliance requirement explicit.",
      },
      {
        heading: "Security rules for email-based collection",
        body: "W-9s contain SSNs and EINs. If your information security policy restricts tax data in email, do not invite vendors to reply with completed forms attached. Use a portal that encrypts uploads, captures e-signatures, and timestamps receipt. CC'ing multiple internal recipients on vendor replies spreads SSN exposure — route submissions to a controlled system instead.",
      },
      {
        heading: "Coordinating with payment holds",
        body: "The request email should align with your AP policy: if payment is blocked until W-9 validation passes, say so upfront. Vendors take the request more seriously when the consequence is concrete. Coordinate wording with procurement so buyers do not promise payment while AP is still waiting on tax documentation.",
      },
      {
        heading: "Tracking sends and responses",
        body: "Manual Outlook threads do not scale. Use a workflow that records send date, reminder count, submission date, and validation status per vendor ID. When December arrives, you should run a report — not search inboxes — to see who was contacted and who never opened the request.",
      },
      {
        heading: "When to escalate beyond email",
        body: "High-dollar vendors, law firms, and sole proprietors with SSNs on the line may need a phone call after two unanswered emails. Document the call. For vendors with a history of non-response, escalate to tax leadership before year-end — not after the 1099 filing window closes.",
      },
    ],
  },
  {
    slug: "what-is-irs-form-w9",
    cluster: "w9",
    title: "What Is IRS Form W-9?",
    summary:
      "What Form W-9 is, who completes it, what each section means, and why U.S. accounts payable teams treat it as the foundation for 1099 reporting and backup withholding compliance.",
    answer:
      "IRS Form W-9, Request for Taxpayer Identification Number and Certification, is the standard form U.S. persons and U.S. entities use to provide their taxpayer identification number (TIN) and certify their tax status to a payer. You collect it before making reportable payments so you have the legal name, address, federal tax classification, and TIN needed for Form 1099 filing. The payee certifies under penalties of perjury that the TIN is correct, they are a U.S. person, and whether they are subject to backup withholding. A complete, signed W-9 on file is your primary evidence for correct information return reporting.",
    primaryKeyword: "irs form w9",
    relatedGuideSlugs: [
      "how-to-collect-w9s-from-vendors",
      "how-to-validate-a-vendor-tin",
      "what-is-exempt-payee-certification",
      "w9-vs-w8-which-form",
    ],
    relatedGlossary: ["w-9", "tin", "backup-withholding"],
    faqs: [
      {
        q: "Who must complete Form W-9?",
        a: "U.S. persons — including citizens, resident aliens, and entities formed under U.S. law — provide a W-9 to payers who will report payments on Form 1099 or other information returns. Foreign persons use the W-8 series instead.",
      },
      {
        q: "Is Form W-9 submitted to the IRS?",
        a: "No. The payee completes the W-9 and returns it to you, the payer. You retain it for your records and use the TIN and certification when filing information returns. Do not send completed W-9s to the IRS unless specifically requested in an audit.",
      },
      {
        q: "What TIN goes on line 1 of the W-9?",
        a: "Line 1 is the name as shown on the income tax return — the legal name for entities or the individual name for sole proprietors. Line 2 is for a business or disregarded entity name if different. The TIN (SSN or EIN) goes in Part I.",
      },
      {
        q: "How long should we keep W-9s on file?",
        a: "Retain W-9s for at least four years after the year the related 1099 was filed, though many U.S. finance teams keep them longer — often for the life of the vendor relationship plus the retention period. Store them securely with access controls.",
      },
    ],
    sections: [
      {
        heading: "Purpose of Form W-9",
        body: "Form W-9 exists so payers can obtain a payee's correct taxpayer identification number and tax certifications before making reportable payments. You use the data to prepare Forms 1099-NEC, 1099-MISC, and other information returns. Without a W-9, you lack the legal name, address, TIN, and federal tax classification needed to file accurately — and you may face backup withholding obligations if the payee does not certify correctly.",
      },
      {
        heading: "Key sections of the form",
        body: "The current W-9 collects the payee's name, business name if applicable, federal tax classification, exemptions from backup withholding and FATCA reporting, address, and TIN. Part II is the certification under penalties of perjury — signature and date are required. A form missing any of these fields is incomplete and should not be treated as valid for payment release.",
        bullets: [
          "Line 1: Legal name as shown on tax return",
          "Line 3: Federal tax classification (individual, LLC, C-corp, etc.)",
          "Part I: SSN or EIN",
          "Part II: Signature, date, and backup withholding certification",
        ],
      },
      {
        heading: "Who provides a W-9 vs a W-8",
        body: "U.S. persons and U.S. entities complete Form W-9. Foreign individuals and entities use Form W-8BEN, W-8BEN-E, or other W-8 variants depending on their status. If a vendor operates outside the U.S. and claims foreign status, do not accept a W-9 — route them to the correct W-8 form and document your determination.",
      },
      {
        heading: "Why AP teams collect W-9s before payment",
        body: "Collecting the W-9 at onboarding — not at year-end — prevents a cascade of problems: unreportable payments, TIN mismatches on filed 1099s, emergency vendor outreach in January, and backup withholding triggered by missing or incorrect data. Treat the W-9 as a payment prerequisite alongside banking details and purchase order setup.",
      },
      {
        heading: "Common W-9 errors AP should catch",
        body: "Incomplete forms are the norm when vendors self-complete without guidance. Watch for missing signatures, blank TIN fields, wrong entity classification (especially LLCs), trade names on line 1 instead of legal names, and outdated form revisions. Validate at intake rather than discovering errors when the IRS sends a CP2100 notice.",
        bullets: [
          "Unsigned or undated forms",
          "SSN provided where an EIN is expected for an LLC or corporation",
          "Disregarded entity status not indicated when required",
          "Exempt payee box checked without supporting documentation",
        ],
      },
      {
        heading: "How W-9 connects to 1099 filing",
        body: "The name and TIN on your 1099 must match what the payee certified on the W-9 and what IRS records show. Federal tax classification on the W-9 tells you whether a payment is reportable at all — corporations are often exempt from 1099-NEC, while sole proprietors and LLCs taxed as partnerships generally are not. Your W-9 file is the source document for every information return you issue.",
      },
    ],
  },
{
    slug: "how-to-collect-w9s-before-first-payment",
    cluster: "w9",
    title: "How to Collect W-9s Before First Payment",
    summary:
      "Why U.S. accounts payable teams should block first payment until a validated W-9 is on file — and the onboarding steps that make pre-payment collection routine.",
    answer:
      "Collect Form W-9 before releasing the first dollar to any new U.S. vendor. Configure your vendor onboarding workflow so W-9 submission, validation, and approval are mandatory gates — not optional follow-ups after invoices arrive. Send the request when the vendor record is created, validate TIN format, legal name, classification, signature, and date on receipt, and hold payment until status shows complete. Vendors who cannot provide a W-9 before payment are a compliance risk you should escalate before year-end, not after 1099 filing deadlines pass.",
    primaryKeyword: "collect w9 before payment",
    relatedGuideSlugs: [
      "how-to-request-a-w-9-from-a-new-vendor",
      "how-to-send-a-w9-request-email",
      "how-to-set-w9-collection-deadlines",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9", "tin", "audit-trail"],
    faqs: [
      {
        q: "Can we pay a vendor once and collect the W-9 later?",
        a: "Some teams do, but it creates reporting risk if the vendor never responds and makes year-end reconciliation harder. Best practice is to hold payment until the W-9 is validated — especially for reportable payees like contractors and sole proprietors.",
      },
      {
        q: "What if procurement needs an emergency payment?",
        a: "Define an exception process with tax leadership approval, a hard deadline for W-9 submission, and automatic payment block if the form is not received within a set number of days. Document every exception — auditors will ask about them.",
      },
      {
        q: "Do corporations need a W-9 before payment?",
        a: "Yes. Even though many corporate payments are not reportable on 1099-NEC, you still need the W-9 for TIN verification, backup withholding compliance, and CP2100 response. Do not skip collection based on assumed entity type.",
      },
      {
        q: "How does pre-payment collection reduce backup withholding?",
        a: "A complete, signed W-9 with a validated TIN gives you the certification needed to avoid backup withholding. Without it, you may be required to withhold 24% on future payments after IRS notice periods if the TIN is missing or incorrect.",
      },
    ],
    sections: [
      {
        heading: "Why first payment is the right deadline",
        body: "Once money leaves your account, vendors have less incentive to complete tax paperwork. Payments made without a W-9 may be reportable on 1099s using incomplete data — or not reportable at all if you never obtain a TIN. Blocking first payment converts W-9 collection from a year-end fire drill into a standard onboarding step vendors expect.",
      },
      {
        heading: "Build the W-9 gate into vendor setup",
        body: "Add W-9 status to your vendor master alongside banking and insurance requirements. Procurement creates the record; AP or a compliance workflow owns validation. Payment terms should reference tax documentation — vendors see the requirement before they invoice.",
        bullets: [
          "W-9 request sent automatically when vendor record is created",
          "Validation checklist runs on submission",
          "Payment hold flag until status is 'validated'",
          "Exception path requires manager or tax approval",
        ],
      },
      {
        heading: "Coordinate with procurement and AP",
        body: "Buyers sometimes onboard vendors and promise quick payment without mentioning tax forms. Align messaging: the purchase order, vendor portal welcome email, and first invoice instructions should all reference W-9 requirements. When AP holds payment, procurement should not override without following the exception process.",
      },
      {
        heading: "Validate before you release payment",
        body: "Receiving a W-9 is not the same as accepting it. Check legal name, TIN format, federal tax classification, signature, and date. Reject incomplete forms immediately with specific correction instructions — do not let a blank TIN or missing signature sit in 'pending' while invoices process.",
      },
      {
        heading: "Handle vendors who push back",
        body: "Some vendors — especially small sole proprietors — hesitate to share SSNs. Explain that the W-9 is standard for U.S. business relationships, offer a secure submission method, and reference your payment hold policy. If they refuse, escalate to tax leadership before making an exception — not after payments accumulate.",
      },
      {
        heading: "Measure compliance at onboarding",
        body: "Track percentage of new vendors with validated W-9s before first payment, average days to completion, and exception count. A rising exception rate signals procurement bypassing the gate or vendors routed through informal channels. Fix the process in Q1 — not in January when 1099 filing starts.",
      },
    ],
  },
{
    slug: "how-to-bulk-request-w9s-from-vendors",
    cluster: "w9",
    title: "How to Bulk Request W-9s from Vendors",
    summary:
      "How U.S. AP teams run mass W-9 collection campaigns — segmentation, secure delivery, tracking, and follow-up without drowning in email threads.",
    answer:
      "Bulk W-9 requests work when you segment vendors by priority, use a secure portal instead of individual email attachments, and track completion status in a central system. Start with vendors missing W-9s or with stale forms, then expand to annual refresh cycles. Send an initial batch request with a clear deadline, automate reminders at seven and fourteen days, and escalate non-responders with payment holds where policy allows. Export a completion report weekly so tax leadership sees progress — not an inbox search in December.",
    primaryKeyword: "bulk w9 request",
    relatedGuideSlugs: [
      "how-to-send-a-w9-request-email",
      "how-to-collect-w9s-from-vendors",
      "how-to-set-w9-collection-deadlines",
      "how-to-re-collect-stale-w-9s",
    ],
    relatedGlossary: ["w-9", "tin", "audit-trail"],
    faqs: [
      {
        q: "How many vendors can we request W-9s from at once?",
        a: "There is no IRS limit — the constraint is your ability to track responses. Portals and W-9 collection tools handle hundreds or thousands of concurrent requests. Avoid blasting every vendor annually if most forms are current; prioritize gaps first.",
      },
      {
        q: "Should bulk requests go out before year-end?",
        a: "Yes. September through November is the standard window for pre-filing campaigns. Vendors respond more slowly in December. Starting early gives time for follow-ups, TIN corrections, and B-notices if needed.",
      },
      {
        q: "Can we import our vendor list into a W-9 tool?",
        a: "Most dedicated collection platforms accept CSV or ERP exports with vendor ID, legal name, email, and payment history. Match on vendor ID — not display name — to avoid duplicate requests.",
      },
      {
        q: "What if a vendor already submitted a W-9 this year?",
        a: "Exclude validated vendors from the bulk campaign. Re-request only when the form is missing, failed validation, exceeds your refresh threshold, or the vendor notified you of an entity change.",
      },
    ],
    sections: [
      {
        heading: "When bulk collection makes sense",
        body: "Bulk W-9 campaigns fit three scenarios: initial cleanup when migrating off spreadsheets, annual refresh before 1099 season, and targeted outreach after a CP2100 notice or audit finding. Do not bulk-request every vendor on the same schedule if your data shows most forms are current — focus effort where gaps exist.",
      },
      {
        heading: "Segment your vendor list",
        body: "Prioritize vendors who received reportable payments, lack a W-9 on file, have failed TIN validation, or have forms older than your policy threshold. Secondary tier: low-dollar vendors with current forms due for refresh. Exclude inactive vendors with no payments in the past two years unless your policy requires otherwise.",
        bullets: [
          "Tier 1: Missing W-9, reportable payments YTD",
          "Tier 2: Stale W-9 or failed TIN match",
          "Tier 3: Annual refresh for active vendors",
          "Exclude: Validated W-9 within policy window",
        ],
      },
      {
        heading: "Use secure batch delivery",
        body: "Emailing hundreds of vendors individually from Outlook does not scale and cannot prove delivery. Use a platform that sends personalized secure links, tracks opens and completions, and stores submissions with timestamps. Each vendor should receive a link tied to their vendor ID — not a generic form anyone can submit.",
      },
      {
        heading: "Template and timing for bulk emails",
        body: "Keep bulk request emails consistent with your single-vendor template: company name, why you need the form, secure link, deadline, and contact for questions. Send Tuesday through Thursday mornings for best open rates. Schedule reminder one at seven days and reminder two at fourteen days; escalate tier-one non-responders to payment hold after reminder two.",
      },
      {
        heading: "Track completion and exceptions",
        body: "Run a weekly report: sent, opened, submitted, validated, failed, no response. Assign owners for failed validations and non-responders. Document every outreach attempt — initial send, reminders, phone calls — so year-end audits show systematic effort, not ad-hoc chasing.",
      },
      {
        heading: "Close the loop before 1099 filing",
        body: "Set a hard cutoff date — typically mid-November — after which non-responders trigger B-notice procedures or payment holds for the next cycle. Do not wait until January to discover fifty vendors never opened your bulk request. Export final status and hand unresolved cases to tax leadership with payment totals attached.",
      },
    ],
  },
{
    slug: "how-to-fix-a-tin-mismatch-on-a-w9",
    cluster: "w9",
    title: "How to Fix a TIN Mismatch on a W-9",
    summary:
      "Steps U.S. accounts payable teams take when a vendor W-9 TIN fails IRS matching — from vendor outreach to B-notices and corrected filings.",
    answer:
      "When a W-9 TIN fails IRS matching or you receive a CP2100 notice, stop using the bad combination for 1099 filing. Contact the vendor immediately, request a corrected W-9 with the legal name and TIN exactly as IRS records show them, and send a B-notice if required under IRS procedures. Validate the corrected form before filing or making additional reportable payments. Document every outreach attempt, the date you received the correction, and whether backup withholding began. A fixed W-9 today prevents corrected 1099 filings and penalty exposure tomorrow.",
    primaryKeyword: "tin mismatch w9",
    relatedGuideSlugs: [
      "how-to-validate-a-vendor-tin",
      "what-is-backup-withholding-and-how-to-avoid-it",
      "how-to-re-collect-stale-w-9s",
      "how-to-prepare-for-1099-filing-season",
    ],
    relatedGlossary: ["tin", "w-9", "backup-withholding"],
    faqs: [
      {
        q: "What causes a TIN mismatch?",
        a: "Common causes: transposed digits, legal name on the W-9 does not match IRS records, vendor provided a DBA instead of legal name, LLC changed structure without updating the W-9, or an old EIN was used after a merger. IRS matching compares TIN to the name combination on file with the IRS.",
      },
      {
        q: "Should we file a 1099 with a known mismatch?",
        a: "No. Filing with a combination the IRS has flagged produces B-notices and may trigger penalties. Request a corrected W-9 first. If the vendor does not respond within IRS timeframes, follow backup withholding and B-notice procedures.",
      },
      {
        q: "How do we send a B-notice to a vendor?",
        a: "Use IRS Form 2106 or 2106-A (or equivalent notice meeting IRS requirements) to solicit corrected TIN information. Send within the timeframe specified in your CP2100 notice. Retain proof of mailing and the vendor's response or non-response.",
      },
      {
        q: "Can TIN matching prevent mismatches before filing?",
        a: "Yes. Run IRS TIN matching on your vendor file before 1099 filing season. Proactive matching catches errors weeks before the filing deadline — when you still have time to collect corrected W-9s without emergency escalation.",
      },
    ],
    sections: [
      {
        heading: "How you discover a mismatch",
        body: "TIN mismatches surface in three ways: your pre-filing TIN matching run flags a bad combination, the IRS sends a CP2100 or CP2100A notice listing proposed mismatches from prior filings, or your intake validation catches an obvious format or name inconsistency on a new W-9. Each path requires the same response — do not ignore or defer.",
      },
      {
        heading: "Immediate steps when a mismatch is flagged",
        body: "Mark the vendor record as 'TIN mismatch — do not file.' Pull the W-9 on file and compare line 1 name and Part I TIN against what the vendor's invoices and contracts show. Contact the vendor with specific instructions: provide a corrected W-9 with the exact legal name and TIN registered with the IRS.",
        bullets: [
          "Stop 1099 filing for that vendor until corrected",
          "Review payment history for reportable amounts",
          "Send secure W-9 re-request with mismatch explanation",
          "Log date discovered and all outreach",
        ],
      },
      {
        heading: "Vendor outreach that gets corrections",
        body: "Generic emails ('please resend your W-9') get ignored. Tell the vendor their name/TIN combination failed IRS matching, specify whether the issue is likely the name, the number, or both, and link to a secure submission portal. Give a deadline — ten business days is common — and note that unresolved mismatches may trigger backup withholding on future payments.",
      },
      {
        heading: "B-notice obligations after CP2100",
        body: "When the IRS notifies you of mismatches from prior-year filings, you must send affected payees a B-notice soliciting corrected information within the required window. If the payee does not respond with a corrected W-9 within the specified period, begin backup withholding on future reportable payments and document the start date. Coordinate with tax leadership — B-notice timing is statutory.",
      },
      {
        heading: "Validate and update systems",
        body: "When the corrected W-9 arrives, re-run TIN matching before accepting. Update the vendor master with the new legal name, TIN, and classification. If you already filed a 1099 with the bad combination, prepare a corrected 1099 (Form 1099 correction process). Retain both the original and corrected W-9 with timestamps.",
      },
      {
        heading: "Prevent repeat mismatches",
        body: "Root-cause analysis matters. If mismatches cluster around LLC vendors, sole proprietors using DBAs, or vendors onboarded without validation, fix the intake process — not just the individual vendor. Run TIN matching at W-9 receipt for high-volume payees and always before bulk 1099 filing.",
      },
    ],
  },
{
    slug: "what-is-a-disregarded-entity-on-w9",
    cluster: "w9",
    title: "What Is a Disregarded Entity on Form W-9?",
    summary:
      "How single-member LLCs and other disregarded entities complete Form W-9 — and what U.S. AP teams must verify for correct 1099 reporting.",
    answer:
      "A disregarded entity is a business entity that the IRS treats as separate from its owner for legal purposes but not for federal tax purposes — most commonly a single-member LLC owned by an individual. On Form W-9, the entity checks the LLC box, indicates single-member LLC status, and provides the owner's name and TIN (typically the owner's SSN) unless the LLC has its own EIN and elects to be treated differently. AP teams must confirm the classification box, the name on line 1, and whether the TIN belongs to the individual owner or the entity — mismatches here are a leading source of 1099 errors.",
    primaryKeyword: "disregarded entity w9",
    relatedGuideSlugs: [
      "how-to-handle-w9-for-llc-vendors",
      "how-to-handle-w9-for-sole-proprietors",
      "how-to-validate-a-vendor-tin",
      "what-is-irs-form-w9",
    ],
    relatedGlossary: ["w-9", "tin", "disregarded-entity"],
    faqs: [
      {
        q: "Does a single-member LLC use the owner's SSN or its own EIN?",
        a: "Either can apply. A single-member LLC may use the owner's SSN on the W-9, or it may obtain an EIN and use that instead. The key is consistency — the name on line 1 and the TIN must match IRS records for the chosen reporting identity.",
      },
      {
        q: "What box does a disregarded LLC check on the W-9?",
        a: "Check 'Limited liability company' and enter the tax classification — typically 'S' for a single-member LLC owned by an individual (disregarded entity) or 'P' if the LLC has multiple members taxed as a partnership.",
      },
      {
        q: "Is a disregarded entity exempt from 1099 reporting?",
        a: "No. Payments to a disregarded entity are generally reportable on Form 1099-NEC or 1099-MISC using the name and TIN on the W-9. The entity's disregarded status affects how the owner reports income on their return — not whether you issue an information return.",
      },
      {
        q: "What if the LLC later adds a member?",
        a: "A multi-member LLC is taxed as a partnership by default and must update its W-9 accordingly — new classification, and often a new EIN. Request an updated W-9 before the next reportable payment.",
      },
    ],
    sections: [
      {
        heading: "What 'disregarded entity' means for tax purposes",
        body: "Under IRS rules, a single-member LLC is generally disregarded — meaning the entity itself does not file a separate federal income tax return. Income passes through to the owner, who reports it on Schedule C or other applicable forms. For W-9 purposes, the LLC still completes the form, but the TIN and name may reflect the individual owner rather than a separate corporate identity.",
      },
      {
        heading: "How disregarded entities complete the W-9",
        body: "Line 1 should show the owner's name as required by the form instructions — or the LLC's legal name if the LLC has an EIN and uses it. Line 2 can show the LLC name. Check the LLC box in line 3 and enter the tax classification code. Part I carries the TIN — SSN of the individual owner or the LLC's EIN, depending on what the vendor uses for tax filing.",
        bullets: [
          "LLC box checked with classification code",
          "Owner name or LLC legal name on line 1 per instructions",
          "LLC name on line 2 when applicable",
          "SSN or EIN in Part I matching IRS records",
        ],
      },
      {
        heading: "Common AP mistakes with disregarded entities",
        body: "Teams often treat a single-member LLC like a corporation — skipping 1099 reporting — or report payments under the DBA on invoices instead of the W-9 legal name. Another error: accepting an EIN on the W-9 but filing the 1099 under a name that does not match that EIN in IRS records. Always file using the name/TIN combination on the validated W-9.",
      },
      {
        heading: "When to request clarification",
        body: "If the W-9 shows an LLC name on line 1 with an individual's SSN, or an EIN with a name that does not match your vendor master, ask the vendor to confirm their federal tax classification before payment. A two-minute email at onboarding prevents a B-notice at year-end.",
      },
      {
        heading: "Disregarded entities owned by corporations",
        body: "A single-member LLC owned by a corporation (not an individual) is disregarded for tax purposes but the TIN is typically the corporate owner's EIN. Classification and reporting differ from the individual-owned case. Review the W-9 classification box carefully — do not assume every single-member LLC uses the owner's SSN.",
      },
      {
        heading: "Document and validate at intake",
        body: "Flag LLC vendors in your vendor master and apply a validation checklist: LLC box checked, classification code present, name/TIN consistency verified. Run TIN matching before 1099 filing. When entity structure changes — new member, S-corp election — trigger an automatic W-9 re-collection request.",
      },
    ],
  },
{
    slug: "how-to-handle-w9-for-sole-proprietors",
    cluster: "w9",
    title: "How to Handle W-9 for Sole Proprietors",
    summary:
      "W-9 collection and validation for sole proprietor vendors — SSN handling, DBA names, and 1099 reporting rules U.S. AP teams should follow.",
    answer:
      "Sole proprietors complete Form W-9 as individuals: their legal name on line 1, business or DBA name on line 2 if applicable, 'Individual/sole proprietor' checked on line 3, and their SSN in Part I unless they have obtained an EIN for the business. Payments to sole proprietors for services are reportable on Form 1099-NEC. Treat SSN data with strict access controls, validate name/TIN matching before filing, and never request SSNs via unsecured email. A complete sole proprietor W-9 is among the most common — and most mismatch-prone — forms AP teams handle.",
    primaryKeyword: "w9 sole proprietor",
    relatedGuideSlugs: [
      "how-to-collect-w9-from-contractors",
      "what-is-a-disregarded-entity-on-w9",
      "how-to-validate-a-vendor-tin",
      "when-to-issue-a-1099-to-a-vendor",
    ],
    relatedGlossary: ["w-9", "tin", "1099-nec"],
    faqs: [
      {
        q: "Should a sole proprietor provide an SSN or EIN?",
        a: "Most sole proprietors use their SSN. Some obtain an EIN for banking or privacy reasons — either is valid if the name and TIN match IRS records. Accept what the vendor provides on a correctly completed W-9.",
      },
      {
        q: "What name goes on the 1099 for a sole proprietor with a DBA?",
        a: "Use the name on line 1 of the W-9 — the individual's legal name — unless the vendor listed the business name on line 1 per form instructions. The DBA on line 2 is supplementary. TIN matching uses the line 1 name.",
      },
      {
        q: "Are sole proprietor payments always reportable?",
        a: "Payments for services totaling $600 or more in a calendar year are generally reportable on Form 1099-NEC. Rent, royalties, and other payment types may use different 1099 forms. Review payment type and amount against IRS thresholds.",
      },
      {
        q: "How do we protect sole proprietor SSNs?",
        a: "Collect via a secure portal with encryption and role-based access — not email attachments. Limit who can view full SSNs in your ERP. Mask TINs in reports and store W-9s in a controlled repository per your data security policy.",
      },
    ],
    sections: [
      {
        heading: "Identifying sole proprietor vendors",
        body: "Sole proprietors operate without a separate legal entity — the individual and the business are the same for tax purposes. They may invoice under a trade name or DBA. Do not assume a vendor is a corporation because their invoices look polished. Ask during onboarding and verify the federal tax classification on the W-9.",
      },
      {
        heading: "Correct W-9 completion for sole proprietors",
        body: "Line 1: individual's legal name as shown on their tax return. Line 2: business name or DBA if different from line 1. Line 3: check 'Individual/sole proprietor or single-member LLC.' Part I: SSN or EIN. Part II: signature and date required. Reject forms that list only the DBA on line 1 without the individual's legal name.",
      },
      {
        heading: "1099 reporting requirements",
        body: "Report payments of $600 or more for services on Form 1099-NEC. Use the name and TIN from the validated W-9. Sole proprietors are not exempt from information reporting — unlike C-corporations in most cases. Track cumulative payments throughout the year so no one crosses the threshold without a W-9 on file.",
      },
      {
        heading: "SSN security in AP workflows",
        body: "Sole proprietor W-9s carry SSNs — among the most sensitive data AP handles. Route collection through encrypted portals, restrict ERP field visibility, and train staff not to forward completed W-9s in email chains. Your W-9 storage policy should meet the same standard as HR personnel files.",
      },
      {
        heading: "TIN mismatch risks with sole proprietors",
        body: "Mismatches often occur when the vendor's legal name differs from the name they use professionally — married name changes, middle initials omitted, or DBA confusion. Run TIN matching before filing. If matching fails, contact the vendor with the exact name combination that failed — not a generic resend request.",
      },
      {
        heading: "Sole proprietor vs single-member LLC",
        body: "A single-member LLC is not a sole proprietorship for W-9 purposes — it checks the LLC box with a classification code. Some vendors confuse the two. If an LLC sends a W-9 marked as sole proprietor, or vice versa, request correction before payment. Misclassification affects both 1099 reporting and TIN matching.",
      },
    ],
  },
{
    slug: "how-to-handle-w9-for-llc-vendors",
    cluster: "w9",
    title: "How to Handle W-9 for LLC Vendors",
    summary:
      "Federal tax classification rules for LLC vendors on Form W-9 — single-member, multi-member, and electing corporations — for U.S. accounts payable teams.",
    answer:
      "LLC vendors must check the 'Limited liability company' box on Form W-9 and enter their federal tax classification: C, S, or P for corporations and partnerships, or S for a single-member LLC disregarded as owned by an individual. The TIN may be the LLC's EIN or the owner's SSN depending on structure. AP teams should never assume an LLC is a corporation exempt from 1099 reporting — default classification and elections determine reportability. Validate the classification code, name, and TIN together at intake and re-collect when the vendor elects a new tax status.",
    primaryKeyword: "w9 llc vendor",
    relatedGuideSlugs: [
      "what-is-a-disregarded-entity-on-w9",
      "how-to-handle-w9-for-sole-proprietors",
      "how-to-validate-a-vendor-tin",
      "how-to-fix-a-tin-mismatch-on-a-w9",
    ],
    relatedGlossary: ["w-9", "tin", "disregarded-entity"],
    faqs: [
      {
        q: "Is an LLC automatically a corporation for 1099 purposes?",
        a: "No. A multi-member LLC is taxed as a partnership by default. A single-member LLC is disregarded. An LLC can elect to be taxed as a C-corporation or S-corporation. The W-9 classification box tells you how to treat the vendor.",
      },
      {
        q: "What if an LLC vendor checks 'Other' or leaves classification blank?",
        a: "Reject the form. The LLC classification letter (C, S, or P) is required. Without it, you cannot determine 1099 reportability or validate the TIN against the correct name.",
      },
      {
        q: "Do we report payments to LLCs taxed as C-corps?",
        a: "Generally, payments to C-corporations are exempt from 1099-NEC reporting for services, with limited exceptions. S-corps, partnerships, and disregarded LLCs are typically reportable. Read the classification box — not the 'LLC' label on the invoice.",
      },
      {
        q: "When should we re-collect an LLC's W-9?",
        a: "Re-collect when the LLC elects new tax status, adds or removes members, converts to a corporation, or merges. Each change can alter the TIN, name, and 1099 reporting treatment.",
      },
    ],
    sections: [
      {
        heading: "LLC tax classifications on the W-9",
        body: "The W-9 LLC line requires a one-letter classification after checking the LLC box. 'C' means taxed as a C-corporation. 'S' means taxed as an S-corporation — or, for a single-member LLC, that it is disregarded as owned by an individual. 'P' means taxed as a partnership. This single character drives your 1099 reporting decision.",
      },
      {
        heading: "Single-member LLC handling",
        body: "Single-member LLCs are the most common source of W-9 confusion. They may use the owner's SSN or an LLC EIN. Line 1 may show the owner's name or the LLC name depending on which TIN is used. Cross-reference with our disregarded entity guidance and validate name/TIN consistency before first payment.",
      },
      {
        heading: "Multi-member LLC handling",
        body: "Multi-member LLCs taxed as partnerships check LLC with 'P' and provide the partnership EIN. Payments for services are generally reportable on 1099-NEC. The legal name on line 1 should match IRS records for the partnership EIN — not individual member names.",
      },
      {
        heading: "LLCs electing corporate status",
        body: "An LLC that filed Form 8832 or 2553 to be taxed as a C-corp or S-corp checks the corresponding letter. S-corp LLCs receive reportable 1099-NEC payments for services. C-corp LLCs are generally exempt from 1099-NEC for services. Verify the election on the W-9 — do not rely on what the vendor told your buyer.",
        bullets: [
          "C-corp election: generally exempt from 1099-NEC for services",
          "S-corp election: reportable on 1099-NEC",
          "Partnership default: reportable on 1099-NEC",
          "Disregarded single-member: reportable on 1099-NEC",
        ],
      },
      {
        heading: "Validation checklist for LLC W-9s",
        body: "At intake, confirm: LLC box is checked, classification letter is present and plausible, line 1 name matches TIN type, signature and date are complete. Flag any LLC marked as C-corp for 1099 exemption review. Run TIN matching before year-end filing — LLC name/TIN mismatches are among the top CP2100 triggers.",
      },
      {
        heading: "Educate vendors during collection",
        body: "Many LLC owners complete the W-9 incorrectly because they do not know their federal tax classification. Include a one-line explanation in your W-9 request email: 'If your LLC has one owner, check LLC and enter S. If it has multiple owners, check LLC and enter P.' Reducing errors at submission saves AP correction cycles later.",
      },
    ],
  },
{
    slug: "how-to-collect-w9-from-contractors",
    cluster: "w9",
    title: "How to Collect W-9 from Contractors",
    summary:
      "W-9 collection workflow for independent contractors and freelancers — timing, validation, and 1099-NEC reporting for U.S. AP teams.",
    answer:
      "Collect Form W-9 from every U.S. independent contractor before their first payment — not after project completion. Contractors are almost always reportable on Form 1099-NEC when payments reach $600 in a calendar year, and most operate as sole proprietors or single-member LLCs. Send a secure W-9 request at contract signing or vendor setup, validate the TIN and classification on receipt, and track cumulative payments against the reporting threshold. Treat contractor W-9 collection as non-negotiable — the IRS expects payers to have TIN certification before making reportable payments.",
    primaryKeyword: "w9 from contractors",
    relatedGuideSlugs: [
      "how-to-handle-w9-for-sole-proprietors",
      "how-to-collect-w9s-before-first-payment",
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-send-a-w9-request-email",
    ],
    relatedGlossary: ["w-9", "1099-nec", "tin"],
    faqs: [
      {
        q: "Do we need a W-9 from every contractor?",
        a: "Collect from every U.S. contractor you may pay — even if individual payments are small. Cumulative payments can exceed $600 quickly. Without a W-9 on file, you lack the TIN needed for 1099-NEC filing.",
      },
      {
        q: "What about contractors paid through a platform like Upwork?",
        a: "If the platform is the payer of record and issues the 1099, you may not need a separate W-9. If you pay the contractor directly, you are the payer and must collect the W-9. Clarify the payment flow before onboarding.",
      },
      {
        q: "Can a contractor refuse to provide an SSN?",
        a: "Some hesitate, but without a certified TIN you cannot file correctly and may face backup withholding obligations. Offer secure submission and explain the legal requirement. Escalate refusals before payments accumulate.",
      },
      {
        q: "Should HR or AP collect contractor W-9s?",
        a: "Whoever owns the contractor relationship can send the request, but AP or a centralized compliance function should validate and store the form. Avoid scattered collection in individual managers' email folders.",
      },
    ],
    sections: [
      {
        heading: "Why contractors are high-priority W-9 payees",
        body: "Independent contractors, freelancers, and consultants typically receive service payments reportable on Form 1099-NEC. Unlike large corporations, they rarely qualify for 1099 exemptions. Most are sole proprietors or disregarded LLCs providing SSNs. Missing contractor W-9s are the single largest source of year-end filing gaps in many AP departments.",
      },
      {
        heading: "When to request the W-9",
        body: "Request at the earliest relationship touchpoint: contract execution, vendor setup in your ERP, or before the first purchase order — whichever comes first. Do not wait until the contractor submits their final invoice. By then, you may already owe reportable payments with no TIN on file.",
      },
      {
        heading: "Contractor-specific validation",
        body: "Verify the name matches the contract signatory and the TIN type matches classification. Contractors often invoice under a DBA — the W-9 line 1 legal name must still match IRS records for the TIN provided. Check for signature and date; unsigned contractor W-9s are incomplete.",
        bullets: [
          "Legal name on W-9 matches contract or engagement letter",
          "Classification is individual, LLC, or partnership — not corporation unless verified",
          "TIN format validated at intake",
          "Secure storage with SSN access controls",
        ],
      },
      {
        heading: "Track payments against the $600 threshold",
        body: "Monitor cumulative contractor payments throughout the year. When a contractor approaches $600, confirm a validated W-9 is on file. If payments already exceeded $600 without a W-9, escalate immediately — retroactive collection is harder and may require B-notice procedures.",
      },
      {
        heading: "1099-NEC filing for contractors",
        body: "File Form 1099-NEC by the IRS deadline (typically January 31) for each contractor paid $600 or more for services. Use the name and TIN from the validated W-9. Send Copy B to the contractor. If the W-9 was collected late or corrected, run TIN matching before filing.",
      },
      {
        heading: "Integrate with contractor onboarding systems",
        body: "If HR or procurement manages contractor onboarding, embed W-9 collection in the same workflow as background checks and contract signatures. Block system access or payment until W-9 status shows validated. Centralize storage so AP does not chase individual hiring managers in December.",
      },
    ],
  },
{
    slug: "how-to-collect-w9-from-international-vendors",
    cluster: "w9",
    title: "How to Collect W-9 from International Vendors",
    summary:
      "When international vendors need Form W-9 vs W-8 — and how U.S. AP teams determine tax documentation for cross-border payees.",
    answer:
      "International vendors do not automatically complete Form W-9. U.S. persons and U.S. entities use W-9; foreign persons use the W-8 series. Before requesting any form, determine whether the vendor is a U.S. person for tax purposes — U.S. citizens, green card holders, and entities formed under U.S. law file W-9 even if they operate abroad. Foreign individuals and entities file W-8BEN or W-8BEN-E. Requesting the wrong form wastes time and creates compliance gaps. Document your determination and store the correct form before making cross-border payments.",
    primaryKeyword: "w9 international vendor",
    relatedGuideSlugs: [
      "when-to-use-w9-vs-w8ben",
      "w9-vs-w8-which-form",
      "how-to-request-a-w-9-from-a-new-vendor",
      "how-to-collect-w9s-before-first-payment",
    ],
    relatedGlossary: ["w-9", "w-8ben", "fatca"],
    faqs: [
      {
        q: "Does a foreign company ever complete a W-9?",
        a: "A foreign company that is not a U.S. person uses W-8BEN-E, not W-9. However, a U.S. subsidiary or U.S.-formed LLC owned by foreign parents is a U.S. person and completes W-9. Entity formation jurisdiction matters — not where the vendor operates day to day.",
      },
      {
        q: "What if a vendor with a foreign address sends a W-9?",
        a: "A foreign address alone does not disqualify W-9 use. U.S. citizens abroad and U.S. entities with overseas offices may legitimately complete W-9. Verify U.S. person status — do not reject a valid W-9 solely because the address is outside the U.S.",
      },
      {
        q: "Do we need tax forms for small international software subscriptions?",
        a: "Payment type and amount matter. Many routine business purchases to foreign vendors do not require W-8 if no U.S.-source income withholding applies — but your tax advisor should confirm. Document the determination for audit purposes.",
      },
      {
        q: "How long is a W-8 valid compared to a W-9?",
        a: "W-8 forms generally expire after three calendar years from the signature date, or when the vendor's circumstances change. W-9s do not expire by statute but should be refreshed on entity changes or your internal policy schedule.",
      },
    ],
    sections: [
      {
        heading: "Determine U.S. person status first",
        body: "Before sending a W-9 request to an international vendor, ask: is this payee a U.S. person under IRS rules? U.S. citizens, resident aliens, and entities organized under U.S. law (including U.S. LLCs and corporations) are U.S. persons — they complete W-9 regardless of where they perform work. Foreign individuals and foreign entities complete W-8 forms.",
      },
      {
        heading: "When international vendors use W-9",
        body: "Common W-9 scenarios with international flavor: a U.S. citizen freelancer living abroad, a U.S.-formed LLC with a foreign owner (disregarded or corporate), or a U.S. branch of a foreign company billing as a U.S. entity. The W-9 certification includes a statement that the payee is a U.S. person — review it carefully for cross-border vendors.",
      },
      {
        heading: "When to request W-8 instead",
        body: "Foreign individuals provide Form W-8BEN. Foreign entities provide Form W-8BEN-E. These forms certify foreign status and may claim treaty benefits reducing or eliminating U.S. withholding on certain U.S.-source income. Do not accept a W-9 from a vendor who certifies foreign status — the forms serve different purposes.",
      },
      {
        heading: "Cross-border payment and withholding considerations",
        body: "Payments to foreign vendors may trigger U.S. withholding on U.S.-source income depending on payment type and treaty provisions. The W-8 series documents foreign status and any treaty claim. W-9 establishes U.S. person status and TIN for domestic reporting. Coordinate with your tax team on withholding rules — AP should not guess.",
        bullets: [
          "U.S. person → W-9, domestic 1099 rules apply",
          "Foreign person → W-8, evaluate withholding and reporting",
          "Hybrid structures → tax team review before first payment",
          "Document determination in vendor record",
        ],
      },
      {
        heading: "Practical onboarding for international vendors",
        body: "Add a 'U.S. person status' question to your vendor intake form. Route affirmative answers to W-9 collection; negative answers to W-8 collection with tax team review. Include the question in your vendor portal — do not rely on AP to infer status from a foreign mailing address.",
      },
      {
        heading: "Avoid common cross-border mistakes",
        body: "Teams sometimes accept W-9s from foreign entities to 'keep things simple,' or request W-8 from U.S. LLCs because the owner lives overseas. Both errors create filing and withholding exposure. Train procurement to flag international vendors for tax review at setup, not at year-end.",
      },
    ],
  },
{
    slug: "when-to-use-w9-vs-w8ben",
    cluster: "w9",
    title: "When to Use W-9 vs W-8BEN",
    summary:
      "Decision guide for U.S. payers choosing between Form W-9 and Form W-8BEN — U.S. person vs foreign person rules for accounts payable.",
    answer:
      "Use Form W-9 when the payee is a U.S. person — U.S. citizen, resident alien, or entity formed under U.S. law — and you need their TIN for 1099 reporting. Use Form W-8BEN when the payee is a foreign individual who is not a U.S. person and may need to certify foreign status for withholding and reporting purposes. The payee's tax status determines the form — not their mailing address, currency preference, or where they perform work. When in doubt, ask the vendor to confirm U.S. person status in writing before selecting a form.",
    primaryKeyword: "w9 vs w8ben",
    relatedGuideSlugs: [
      "w9-vs-w8-which-form",
      "how-to-collect-w9-from-international-vendors",
      "what-is-irs-form-w9",
      "how-to-request-a-w-9-from-a-new-vendor",
    ],
    relatedGlossary: ["w-9", "w-8ben", "tin"],
    faqs: [
      {
        q: "Can a vendor choose which form to submit?",
        a: "The vendor certifies their status, but you are responsible for requesting the correct form. A foreign person should not submit W-9. A U.S. person should not submit W-8BEN. Reject incorrect forms and request the appropriate one.",
      },
      {
        q: "Does a nonresident alien ever use W-9?",
        a: "Resident aliens for tax purposes are U.S. persons and use W-9. Nonresident aliens who are not U.S. persons use W-8BEN. The green card test and substantial presence test determine residency — not the vendor's preference.",
      },
      {
        q: "What about foreign entities?",
        a: "Foreign entities use Form W-8BEN-E, not W-8BEN or W-9. W-8BEN is for foreign individuals. U.S. entities — including U.S. LLCs — use W-9 regardless of foreign ownership.",
      },
      {
        q: "Do we file 1099s for foreign persons with W-8BEN?",
        a: "Reporting rules differ. U.S. persons with W-9s receive 1099s for reportable payments. Foreign persons may be subject to different reporting and withholding rules depending on payment type and treaty status. Consult your tax advisor for specific payment scenarios.",
      },
    ],
    sections: [
      {
        heading: "The core distinction",
        body: "Form W-9 is for U.S. persons providing a TIN for domestic information return reporting. Form W-8BEN is for foreign individuals certifying non-U.S. status and claiming treaty benefits where applicable. Using the wrong form means you lack the correct certification for withholding and reporting — a problem auditors and the IRS both flag.",
      },
      {
        heading: "Who completes Form W-9",
        body: "U.S. citizens, resident aliens, partnerships organized in the U.S., U.S. corporations, U.S. LLCs, trusts and estates under U.S. law, and other U.S. persons. The payee certifies under penalties of perjury that they are a U.S. person. Cross-border workers who meet the U.S. person definition still use W-9.",
      },
      {
        heading: "Who completes Form W-8BEN",
        body: "Foreign individuals who are not U.S. persons — nonresident aliens performing services, foreign consultants, and individuals receiving U.S.-source income that may be subject to withholding. The form certifies foreign status, country of residence, and applicable treaty benefits. It is not a substitute for a TIN on domestic 1099 reporting.",
      },
      {
        heading: "Decision flowchart for AP",
        body: "At vendor onboarding, ask: Is the payee a U.S. person? If yes → W-9. If no and the payee is an individual → W-8BEN. If no and the payee is an entity → W-8BEN-E. If the answer is unclear → tax team review before first payment. Document the determination in the vendor record.",
        bullets: [
          "U.S. citizen or resident alien → W-9",
          "U.S.-formed entity → W-9",
          "Foreign individual → W-8BEN",
          "Foreign entity → W-8BEN-E",
          "Uncertain → escalate to tax",
        ],
      },
      {
        heading: "Address and banking are not deciding factors",
        body: "A vendor with a London address may be a U.S. LLC filing W-9. A vendor with a Miami address may be a foreign individual filing W-8BEN if they are a nonresident alien. Do not infer tax status from geography — rely on the vendor's certification and entity formation documents.",
      },
      {
        heading: "Store and refresh correctly",
        body: "W-9s should be refreshed on entity changes or per your internal policy. W-8BEN forms expire after three calendar years from signature (generally December 31 of the third year). Track expiration dates for W-8 forms and re-request before making payments with an expired certification.",
      },
    ],
  },
{
    slug: "how-to-prepare-for-1099-filing-season",
    cluster: "w9",
    title: "How to Prepare for 1099 Filing Season",
    summary:
      "A U.S. AP checklist for 1099 filing season — W-9 completeness, TIN matching, payment reconciliation, and deadline management.",
    answer:
      "Start 1099 filing season preparation in September, not January. Reconcile reportable payments against validated W-9s, run IRS TIN matching on your full payee file, resolve mismatches and missing forms before the filing deadline, and confirm name/TIN combinations match W-9 certifications exactly. Export a gap report weekly: vendors paid over threshold without a validated W-9, failed TIN matches, and unsigned forms. Coordinate with tax leadership on B-notice candidates and backup withholding status. A structured pre-season workflow turns January filing from a crisis into a confirmation exercise.",
    primaryKeyword: "1099 filing season",
    relatedGuideSlugs: [
      "when-to-issue-a-1099-to-a-vendor",
      "how-to-validate-a-vendor-tin",
      "how-to-handle-a-missing-w-9-at-year-end",
      "how-to-bulk-request-w9s-from-vendors",
    ],
    relatedGlossary: ["1099-nec", "w-9", "tin"],
    faqs: [
      {
        q: "When should AP start 1099 season prep?",
        a: "Begin in September or October. This gives time for bulk W-9 requests, TIN matching, vendor follow-up, and B-notice procedures before the January 31 filing deadline for 1099-NEC.",
      },
      {
        q: "What payments require a 1099-NEC?",
        a: "Generally, payments of $600 or more for services to non-corporate payees — sole proprietors, partnerships, LLCs taxed as partnerships or S-corps, and attorneys. Corporations are typically exempt except for attorneys and certain other payments.",
      },
      {
        q: "Can we file 1099s without TIN matching?",
        a: "You can file, but unmatched combinations generate CP2100 notices and may require corrected filings and B-notices. Run matching before filing — proactive correction is far cheaper than reactive cleanup.",
      },
      {
        q: "What is the 1099-NEC filing deadline?",
        a: "Copy A must be filed with the IRS and Copy B furnished to payees by January 31 for the prior calendar year. State deadlines may differ. Missing the deadline triggers IRS penalties that scale with lateness.",
      },
    ],
    sections: [
      {
        heading: "September–October: W-9 completeness audit",
        body: "Pull a report of all vendors who received reportable payments year-to-date. Flag anyone without a validated W-9, with a stale form, or with failed TIN validation. Launch a bulk W-9 collection campaign for gaps. Set a November 15 target for 95% completeness on tier-one payees.",
      },
      {
        heading: "November: TIN matching run",
        body: "Submit your payee file to IRS TIN matching — online for smaller lists, bulk matching for larger filers. Review every failure immediately. Send corrected W-9 requests and B-notices as required. Do not proceed to filing with known bad combinations.",
        bullets: [
          "Match legal name from W-9 to TIN",
          "Resolve failures before December payment cutoff",
          "Document B-notice sends for non-responders",
          "Update vendor master with corrections",
        ],
      },
      {
        heading: "December: Payment reconciliation",
        body: "Reconcile ERP payment totals to 1099 reportable amounts. Confirm entity classifications on W-9s still match reality — vendors may have converted entities mid-year. Process final W-9 corrections before year-end if possible. Hold December payments to vendors with unresolved TIN issues when policy allows.",
      },
      {
        heading: "January: Filing execution",
        body: "Generate 1099-NEC and 1099-MISC forms using W-9 name and TIN data. Furnish Copy B to payees and file Copy A with the IRS by January 31. Use IRS FIRE system or authorized e-file provider. Retain filing confirmations and vendor delivery proof.",
      },
      {
        heading: "Roles and handoffs",
        body: "AP owns payment data and W-9 completeness. Tax owns filing execution and B-notice procedures. Define who runs TIN matching, who contacts vendors, and who signs off on the final filing file. Ambiguous ownership is why 1099 season fails in many organizations.",
      },
      {
        heading: "Post-filing: CP2100 response readiness",
        body: "Even with good prep, CP2100 notices arrive for prior-year mismatches. Maintain your W-9 audit trail, outreach logs, and B-notice records so you can respond within IRS timeframes. Schedule a post-season retrospective: how many gaps remained, what caused them, and what process change prevents recurrence.",
      },
    ],
  },
{
    slug: "what-is-exempt-payee-certification",
    cluster: "w9",
    title: "What Is Exempt Payee Certification on Form W-9?",
    summary:
      "What the exempt payee and FATCA exemption codes on Form W-9 mean — and when U.S. AP teams can rely on them for backup withholding.",
    answer:
      "The exempt payee certification on Form W-9 (Line 4) lets certain payees claim exemption from backup withholding under IRC §3406. Exempt payees include corporations, tax-exempt organizations, IRAs, the U.S. government, and other categories listed in the form instructions. The payee enters a code (1 through 13) indicating their exemption category. AP teams should verify the code matches the vendor's entity type — a sole proprietor cannot claim corporate exemption. FATCA exemption codes on Line 4 apply separately to FATCA reporting, not backup withholding. Incorrect exemption claims do not relieve you of matching and reporting obligations.",
    primaryKeyword: "exempt payee certification",
    relatedGuideSlugs: [
      "what-is-irs-form-w9",
      "what-is-backup-withholding-and-how-to-avoid-it",
      "how-to-handle-w9-for-llc-vendors",
      "how-to-validate-a-vendor-tin",
    ],
    relatedGlossary: ["w-9", "backup-withholding", "fatca"],
    faqs: [
      {
        q: "Are all corporations exempt payees?",
        a: "Generally yes for backup withholding purposes — code 1 applies to corporations. However, corporations can still receive CP2100 mismatch notices, and certain corporate payments remain reportable on 1099s. Exempt from withholding is not the same as exempt from reporting.",
      },
      {
        q: "Should a sole proprietor claim exempt payee status?",
        a: "No. Sole proprietors and most LLCs are not exempt payees. If a contractor checks an exemption code incorrectly, request a corrected W-9. Do not assume exemption without verifying entity type.",
      },
      {
        q: "What is the FATCA exemption code on Line 4?",
        a: "FATCA codes (A through M) certify exemption from FATCA reporting requirements. They are separate from backup withholding exemption codes. Most domestic vendors leave FATCA codes blank because FATCA applies primarily to foreign financial institutions and certain foreign entities.",
      },
      {
        q: "Does exempt payee status eliminate the need for a W-9?",
        a: "No. Exempt payees still complete W-9 to provide their TIN and certification. You need the form for TIN matching, 1099 reporting where applicable, and audit documentation — even when backup withholding does not apply.",
      },
    ],
    sections: [
      {
        heading: "Backup withholding vs exempt payee status",
        body: "Backup withholding requires payers to withhold 24% when a payee fails to provide a correct TIN or certifies they are subject to withholding. Exempt payees — listed in W-9 instructions — are not subject to backup withholding under normal circumstances. The exemption code on Line 4 documents that status. You still collect and validate the W-9.",
      },
      {
        heading: "Exempt payee codes explained",
        body: "Codes 1 through 13 identify exemption categories: corporations, financial institutions, tax-exempt organizations under 501(a), the U.S. government, state governments, foreign governments, dealers in securities, futures commission merchants, real estate investment trusts, entities under Investment Company Act, common trust funds, trusts exempt from tax, and entities under Uniform Gift to Minors Act. Match the code to the vendor's actual entity type.",
        bullets: [
          "Code 1: Corporation (most common for corporate vendors)",
          "Code 2: Financial institution",
          "Code 3: Tax-exempt organization",
          "Codes 4–13: Government, trust, and specialized entities",
        ],
      },
      {
        heading: "When AP should question an exemption claim",
        body: "Flag W-9s where a sole proprietor, individual contractor, or partnership checks a corporate exemption code. Flag LLCs taxed as partnerships claiming code 1. These are common vendor errors — not necessarily fraud — but accepting them without review creates documentation gaps if backup withholding is later required.",
      },
      {
        heading: "FATCA reporting exemption codes",
        body: "The second part of Line 4 addresses FATCA (Foreign Account Tax Compliance Act) reporting exemptions. Most domestic U.S. vendors leave this section blank. Foreign financial institutions and certain foreign entities use FATCA codes. If a domestic vendor completes FATCA codes unexpectedly, escalate to tax for review.",
      },
      {
        heading: "Exempt payee and 1099 reporting",
        body: "Exempt payee status affects backup withholding — not necessarily 1099 filing. Corporations are exempt payees but attorneys and medical and health care payments to corporations may still be reportable. Read the exemption code alongside federal tax classification to determine your full reporting obligation.",
      },
      {
        heading: "Document exemption review in your workflow",
        body: "Add exemption code validation to your W-9 intake checklist. Auto-flag mismatches between entity classification and exemption code. Store the validated W-9 with the exemption code visible in your audit trail. When CP2100 notices arrive, exemption status does not override the need to correct TIN mismatches.",
      },
    ],
  },
{
    slug: "how-to-validate-w9-signature-and-date",
    cluster: "w9",
    title: "How to Validate W-9 Signature and Date",
    summary:
      "Signature and date requirements on Form W-9 — what U.S. AP teams must verify before accepting a vendor tax form.",
    answer:
      "A Form W-9 is not valid without a signature and date in Part II — the certification under penalties of perjury. Validate that the signature is present, appears intentional (not a typed placeholder), and is dated. Accept wet signatures, electronic signatures where your policy permits, and digital signatures from approved e-signature platforms. Reject unsigned forms, forms with blank date fields, and forms where the signature date predates the current IRS form revision by many years without a refresh. Signature validation is a binary gate — no signature means no payment release in controlled environments.",
    primaryKeyword: "w9 signature validation",
    relatedGuideSlugs: [
      "what-is-irs-form-w9",
      "how-to-validate-a-vendor-tin",
      "how-to-collect-w9s-before-first-payment",
      "how-to-store-w-9s-securely",
    ],
    relatedGlossary: ["w-9", "audit-trail", "tin"],
    faqs: [
      {
        q: "Is an electronic signature valid on a W-9?",
        a: "Yes, when captured through a compliant e-signature process that identifies the signer and timestamps the certification. Many W-9 collection platforms provide IRS-acceptable e-signatures. Typed names without a signature platform may not meet your policy or audit standards.",
      },
      {
        q: "Can someone else sign the W-9 for the vendor?",
        a: "The form should be signed by an authorized person — the individual named, a corporate officer, or a partner with authority to bind the entity. If a third party signed, request confirmation of signing authority for high-dollar vendors.",
      },
      {
        q: "What if the date is missing but the signature is present?",
        a: "Reject the form and request correction. The date establishes when the certification was made. Undated forms fail most AP validation checklists and audit reviews.",
      },
      {
        q: "Does a very old signature date make the W-9 invalid?",
        a: "IRS rules do not expire W-9s by age alone, but many organizations require refresh when the form exceeds one to three years or when entity details change. An old date is a signal to re-collect — not an automatic rejection under IRS rules.",
      },
    ],
    sections: [
      {
        heading: "Why signature and date matter",
        body: "Part II of Form W-9 is a certification under penalties of perjury. The payee attests that the TIN is correct, they are not subject to backup withholding (unless indicated), they are a U.S. person, and FATCA codes are correct if provided. Without a signature and date, there is no valid certification — you have a data collection sheet, not a compliant W-9.",
      },
      {
        heading: "What to check on receipt",
        body: "Confirm Part II contains a signature — handwritten, electronic, or digital depending on submission method. Confirm the date field is completed with a plausible date (not a placeholder like '00/00/0000'). Verify the signature name is consistent with the person or entity on line 1. Flag forms signed before major entity changes that post-date the signature.",
        bullets: [
          "Signature present in Part II",
          "Date field completed",
          "Signature method meets company policy",
          "Signer appears authorized for the entity type",
        ],
      },
      {
        heading: "Electronic and digital signatures",
        body: "W-9 collection platforms typically capture e-signatures with audit trails showing signer identity, IP address, and timestamp. These meet most organizational standards. PDFs returned via email with a typed '/s/ Name' may or may not satisfy your policy — define acceptable methods in your tax documentation procedure.",
      },
      {
        heading: "Common signature failures",
        body: "Unsigned forms submitted through vendor portals where the vendor skipped the final step. Scanned forms with signature lines blank. Forms where someone typed the name in the signature field without an e-signature platform. Auto-reject these at intake with a specific message: 'Part II requires your signature and today's date.'",
      },
      {
        heading: "Signature validation in your workflow",
        body: "Make signature and date checks automated in your W-9 intake pipeline — not a manual eyeball test at year-end. Set vendor status to 'incomplete' when signature or date is missing. Block payment until status moves to 'validated.' Report incomplete rate monthly to catch portal or process issues.",
      },
      {
        heading: "Retain signature evidence for audits",
        body: "Store the signed W-9 — or e-signature audit log — with the received timestamp. Auditors ask whether you had a valid certification on the date of payment. A workflow that captures and preserves signature metadata is stronger evidence than a shared drive of unsigned PDFs renamed at filing time.",
      },
    ],
  },
{
    slug: "how-to-set-w9-collection-deadlines",
    cluster: "w9",
    title: "How to Set W-9 Collection Deadlines",
    summary:
      "How U.S. AP teams define W-9 collection deadlines tied to onboarding, payment holds, and 1099 filing season — with escalation paths.",
    answer:
      "Set W-9 collection deadlines at three levels: before first payment (hard gate), during bulk refresh campaigns (typically 14–21 days with reminders), and before 1099 filing season (November cutoff for gap closure). Publish deadlines in your vendor policy, reference them in request emails, and enforce them with payment holds when vendors miss them. Escalate non-responders through a defined sequence — reminder email, second reminder, phone call, payment block, tax leadership review — and log every step. Deadlines only work when consequences are real and consistently applied.",
    primaryKeyword: "w9 collection deadline",
    relatedGuideSlugs: [
      "how-to-send-a-w9-request-email",
      "how-to-collect-w9s-before-first-payment",
      "how-to-bulk-request-w9s-from-vendors",
      "how-to-handle-a-missing-w-9-at-year-end",
    ],
    relatedGlossary: ["w-9", "audit-trail", "tin"],
    faqs: [
      {
        q: "What is a reasonable W-9 response deadline?",
        a: "Ten business days for new vendor onboarding is standard. Bulk refresh campaigns typically allow 14–21 days with automated reminders at seven and fourteen days. Shorten deadlines for vendors approaching payment release.",
      },
      {
        q: "Should the deadline appear in the W-9 request email?",
        a: "Yes. State the specific date and tie it to a consequence — payment hold, invoice processing delay, or 1099 reporting risk. Vague 'please respond soon' language gets ignored.",
      },
      {
        q: "What happens when a vendor misses the deadline?",
        a: "Follow your escalation path: second request, phone outreach, payment hold, and tax leadership notification. Document every step. For year-end gaps, initiate B-notice procedures if required.",
      },
      {
        q: "Can executives override W-9 deadlines?",
        a: "Define a formal exception process requiring tax or finance leadership approval with a backdated hard deadline for submission. Ad-hoc overrides without documentation create audit exposure and train vendors that deadlines are optional.",
      },
    ],
    sections: [
      {
        heading: "Three deadline types AP teams need",
        body: "First-payment deadline: W-9 validated before any disbursement — no exceptions without approval. Campaign deadline: vendors in bulk refresh have 14–21 days to respond before escalation. Filing-season deadline: all tier-one payees complete by mid-November so TIN matching and 1099 prep can finish before January.",
      },
      {
        heading: "Tie deadlines to consequences",
        body: "Deadlines without enforcement are suggestions. Link each deadline to a concrete action: payment hold, PO block, or escalation to vendor management. Communicate the consequence in the initial request email so vendors understand the deadline is operational — not administrative.",
        bullets: [
          "Day 0: Initial W-9 request with deadline date",
          "Day 7: First reminder if incomplete",
          "Day 14: Second reminder with payment hold warning",
          "Day 21: Payment hold activated; tax team notified",
        ],
      },
      {
        heading: "Align deadlines across departments",
        body: "Procurement, AP, and tax must share the same deadline calendar. If procurement promises payment in five days but AP's W-9 deadline is ten, vendors arrive angry and forms arrive late. Publish the policy in your vendor onboarding guide and train buyers on the payment gate.",
      },
      {
        heading: "Seasonal deadline adjustments",
        body: "Move filing-season deadlines earlier — September launch, November 15 completion target — because vendor response rates drop in December. Avoid setting bulk campaign deadlines over major holidays. Give tier-one payees (high dollar, reportable) tighter timelines than low-dollar incidental vendors.",
      },
      {
        heading: "Track deadline performance",
        body: "Measure average days to W-9 completion, percentage meeting first-payment deadline, and overdue vendor count weekly. Rising overdue counts signal process breakdown — not vendor bad faith. Dashboard metrics help tax leadership allocate resources before filing crunch.",
      },
      {
        heading: "Document deadline enforcement for audits",
        body: "Auditors and IRS inquiries ask what you did when vendors did not respond. Your audit trail should show: request sent, deadline stated, reminders sent, hold applied, escalation date. Manual inbox searches fail this test. Use a system that timestamps every action against the vendor record.",
      },
    ],
  },
];