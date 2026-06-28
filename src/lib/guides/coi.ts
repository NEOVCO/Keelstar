import { guide } from "./helpers";

export const coiGuides = [
  guide({
    slug: "how-to-read-an-acord-25-certificate",
    title: "How to Read an ACORD 25 Certificate",
    summary:
      "A field-by-field guide to the ACORD 25 certificate of insurance for U.S. construction, property, and healthcare operations teams reviewing vendor coverage.",
    answer:
      "The ACORD 25 is a standardized summary of a vendor's insurance — not the policy itself. Read it top to bottom: confirm the named insured matches your vendor, check each policy's expiration date and limits, verify additional insured and certificate holder boxes, and note the producer contact for renewals. If a field is blank or unclear, treat the certificate as incomplete until the broker clarifies.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: [
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-verify-coverage-limits-on-a-coi",
      "how-to-track-coi-expirations",
    ],
    relatedGlossary: ["acord-25", "certificate-of-insurance", "coverage-limit"],
    faqs: [
      {
        q: "Is an ACORD 25 the same as an insurance policy?",
        a: "No. It is a snapshot summary issued by the broker or agent. Coverage can change after the certificate is printed. Always verify critical endorsements separately when your contract requires them.",
      },
      {
        q: "Why do some certificates list multiple expiration dates?",
        a: "General liability, automobile, workers compensation, and umbrella policies often renew on different dates. Track each line separately — one current policy does not mean all coverage is active.",
      },
    ],
    sections: [
      {
        heading: "What the ACORD 25 is — and is not",
        body: "The ACORD 25 is the most common certificate format in the United States. It tells you what policies a vendor carries, their limits, and key dates — but it does not guarantee coverage will respond to a claim. Policies can cancel mid-term, endorsements may be missing, and the certificate may not reflect your contract's additional insured requirements. Treat it as the starting point for review, not the finish line.",
      },
      {
        heading: "Header: date, producer, and insured",
        body: "Start at the top. The certificate date shows when the form was issued — not when coverage began. The producer (broker or agent) contact is who you call for renewals and corrections. The named insured must match the legal entity on your vendor agreement. In construction and facilities work, DBAs are common; confirm the relationship if the name on the certificate differs from the name on your contract or W-9.",
      },
      {
        heading: "Policy lines: types, limits, and expirations",
        body: "Each row represents a policy type. For U.S. vendor compliance, you typically care about commercial general liability, automobile liability, workers compensation, and umbrella or excess coverage.",
        bullets: [
          "Policy number and effective/expiration dates — track each line separately",
          "Per-occurrence and general aggregate limits for liability policies",
          "Claims-made vs occurrence basis — matters for tail coverage on professional lines",
          "Workers comp statutory limits and employers liability where listed",
          "Umbrella limits that sit above underlying policies",
        ],
      },
      {
        heading: "Description of operations and locations",
        body: "The description box summarizes the work or project the certificate supports. In property management, you want your building or portfolio referenced. In healthcare vendor relationships, the scope should align with services performed on your premises or with your patients' data. Vague language like 'ongoing operations' makes it harder to defend coverage scope if a claim arises.",
      },
      {
        heading: "Certificate holder and additional insured",
        body: "The certificate holder box shows who received the certificate — often your organization. Additional insured status appears in the remarks or a dedicated endorsement reference. A checked box or generic language may not satisfy your contract; many U.S. construction and lease agreements require specific additional insured endorsements (such as CG 20 10 or CG 20 37). When in doubt, request a copy of the endorsement.",
      },
      {
        heading: "Red flags that stop approval",
        body: "Do not accept a certificate for work authorization until these are resolved: expired policy dates, limits below your requirements, named insured mismatch, missing workers comp where state law requires it, or additional insured language that does not match your agreement. Record the deficiency, notify the vendor and broker, and set a follow-up date.",
      },
    ],
  }),

  guide({
    slug: "how-to-set-vendor-insurance-requirements",
    title: "How to Set Vendor Insurance Requirements",
    summary:
      "How U.S. risk, procurement, and operations teams define minimum insurance requirements for construction subcontractors, property vendors, and healthcare suppliers.",
    answer:
      "Document required coverage types, minimum limits, additional insured status, waiver of subrogation, and notice of cancellation in your master agreement — then translate those requirements into a checklist your team validates on every ACORD 25. Requirements should match the risk of the work: a janitorial vendor on a healthcare campus needs different limits than a crane operator on a construction site.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: [
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-verify-coverage-limits-on-a-coi",
      "what-additional-insured-means-for-your-business",
    ],
    relatedGlossary: ["coverage-limit", "additional-insured", "certificate-of-insurance"],
    faqs: [
      {
        q: "Where should insurance requirements live?",
        a: "In the master services agreement, lease exhibit, or subcontract — not only in a COI request email. Contract language is what you enforce; the certificate is evidence of compliance.",
      },
      {
        q: "Should all vendors have the same limits?",
        a: "No. Tier requirements by risk: low-risk office suppliers, medium-risk trades on premises, and high-risk construction or life-safety work should carry different minimums.",
      },
    ],
    sections: [
      {
        heading: "Start with the risk, not a template",
        body: "Generic one-size-fits-all insurance schedules create two problems: you over-require low-risk vendors and under-protect high-risk work. Map vendors by what they do on your premises — construction trades, HVAC and electrical maintenance, cleaning crews in a hospital, security guards, IT installers with physical access — and assign tiers with escalating limits.",
      },
      {
        heading: "Coverage types to specify",
        body: "Most U.S. vendor programs require commercial general liability at minimum. Add automobile liability when vehicles enter your sites. Workers compensation is mandatory in most states for employers; require it even when your contract is with a sole proprietor where permitted. Umbrella or excess liability bridges gaps for catastrophic claims. Professional liability applies when vendors give design, engineering, or consulting advice.",
        bullets: [
          "Commercial general liability — per occurrence and general aggregate",
          "Automobile liability — owned, hired, and non-owned if applicable",
          "Workers compensation and employers liability",
          "Umbrella or excess — often $1M–$5M+ for construction and healthcare",
          "Professional / E&O — for design-build and IT services",
        ],
      },
      {
        heading: "Contract language beyond limits",
        body: "Limits alone do not protect you. Standard U.S. construction and property contracts also require additional insured status, primary and non-contributory wording where applicable, waiver of subrogation on workers comp and general liability, and 30-day notice of cancellation. Spell these out in the agreement so reviewers know what to verify on the certificate and endorsements.",
      },
      {
        heading: "Build a review checklist from your contract",
        body: "Turn contract insurance exhibits into a repeatable intake checklist: named insured match, each policy expiration, limit comparison by line, endorsement references, certificate holder address, and description of operations. Operations teams should not re-interpret the contract on every certificate — the checklist encodes the decision.",
      },
      {
        heading: "Communicate requirements before work starts",
        body: "Send insurance requirements with the vendor packet at onboarding — alongside W-9 and banking details. Include sample endorsement language and your certificate holder address. Vendors who understand requirements upfront renew faster; vendors surprised at the job trailer often delay projects.",
      },
      {
        heading: "Review requirements annually",
        body: "Limits that made sense three years ago may not match current project values, lease requirements, or customer audit standards. Healthcare systems responding to payer audits and general contractors managing owner-controlled insurance programs should revisit tiers when contracts renew or when you enter new states.",
      },
    ],
  }),

  guide({
    slug: "what-additional-insured-means-for-your-business",
    title: "What Additional Insured Means for Your Business",
    summary:
      "What additional insured status on a vendor's policy actually gives U.S. property owners, general contractors, and healthcare operators — and what it does not.",
    answer:
      "Additional insured status extends certain coverages from your vendor's policy to you — typically general liability — so their insurer may defend and indemnify you for claims arising from the vendor's work. It is not blanket protection: scope depends on the endorsement, your contract, and who caused the loss. Always confirm the endorsement matches your agreement, not just a checkbox on the ACORD 25.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: [
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-read-an-acord-25-certificate",
      "what-a-waiver-of-subrogation-does",
    ],
    relatedGlossary: ["additional-insured", "acord-25", "certificate-of-insurance"],
    faqs: [
      {
        q: "Does additional insured make us immune from lawsuits?",
        a: "No. It gives you access to the vendor's liability coverage for qualifying claims — often with defense costs — but exclusions, limits, and fault still apply.",
      },
      {
        q: "Why do certificates and contracts disagree on additional insured?",
        a: "Brokers sometimes issue certificates with generic language before endorsements are processed. Request the endorsement form when the contract requires specific ISO wording.",
      },
    ],
    sections: [
      {
        heading: "The plain-English definition",
        body: "When you are named as an additional insured on a vendor's liability policy, you share in that policy's protection for certain claims — usually those connected to the vendor's work for you. If a visitor slips on a wet floor after your cleaning contractor mopped, or a subcontractor's work damages a tenant unit, their insurer may cover your organization alongside the vendor — subject to policy terms.",
      },
      {
        heading: "Why U.S. contracts require it",
        body: "Property owners, general contractors, and healthcare systems require additional insured status because vendors create third-party liability on your premises and under your brand. Without it, your own policies absorb defense costs and settlements that the vendor's carrier might otherwise pay. Lenders, landlords, and upstream owners often mandate it in lease and subcontract flow-downs.",
      },
      {
        heading: "What the endorsement actually covers",
        body: "Coverage scope lives in the endorsement — not the certificate checkbox. Common ISO forms cover liability arising out of your ongoing operations or completed operations performed for you. 'Your work' endorsements in construction tie coverage to the project. Primary and non-contributory wording affects whether the vendor's policy pays before yours. Read the endorsement or have risk management review it for high-exposure relationships.",
      },
      {
        heading: "Additional insured vs certificate holder",
        body: "Certificate holder means you received the ACORD 25 — informational only. Additional insured means you may have rights under the policy. Teams confuse these constantly. A certificate listing you as certificate holder without a valid additional insured endorsement does not meet typical U.S. construction or property management requirements.",
      },
      {
        heading: "Healthcare and facilities context",
        body: "Hospitals and clinic operators often require additional insured status from medical waste haulers, biomedical equipment servicers, and facility contractors who work near patients. The goal is to align vendor liability with incidents on campus — not to replace the organization's own medical professional liability program.",
      },
      {
        heading: "How to verify compliance",
        body: "Compare the contract's insurance exhibit to the certificate remarks and the actual endorsement PDF. Confirm your legal name, the correct policy (usually general liability), and project or location language where required. Store the endorsement with the certificate so auditors and claims counsel can access it without chasing the broker.",
      },
    ],
  }),

  guide({
    slug: "how-to-collect-cois-from-subcontractors",
    title: "How to Collect COIs from Subcontractors",
    summary:
      "A practical process for U.S. general contractors and property operators collecting certificates of insurance from subcontractors and downstream trades.",
    answer:
      "Before any subcontractor steps on site, send your insurance requirements with a certificate holder address, validate the ACORD 25 against your checklist, collect missing endorsements, and store everything in the subcontractor file with expiration tracking. Do not rely on the GC's certificate alone — collect directly from each tier you are responsible for under your contract.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    relatedGuides: [
      "how-to-track-coi-expirations",
      "how-to-set-vendor-insurance-requirements",
      "how-to-build-a-coi-renewal-process",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "additional-insured"],
    faqs: [
      {
        q: "Do I need COIs from subcontractors I do not pay directly?",
        a: "Often yes. Construction and property contracts flow insurance requirements down the chain. If your agreement makes you responsible for downstream compliance, collect certificates from every tier that performs work on your project or premises.",
      },
      {
        q: "Can I accept a COI from the general contractor on behalf of a sub?",
        a: "Only if your contract allows it — and even then, direct collection gives you broker contact info and renewal control. Relying on forwarded PDFs is a common gap when coverage lapses.",
      },
    ],
    sections: [
      {
        heading: "Why subcontractor COI collection is harder",
        body: "Subcontractors churn frequently, work multiple jobs under different entities, and may not read your insurance exhibit until mobilization. Certificates arrive incomplete — wrong limits, missing additional insured endorsements, expired dates, or a named insured that does not match the sub on your agreement. Email attachments get lost between the field office and AP.",
      },
      {
        heading: "Collect before mobilization, not after",
        body: "Gate site access and payment on compliant insurance — same as W-9 collection. Send requirements at contract execution: minimum limits, additional insured forms, waiver of subrogation, primary/non-contributory language, and your certificate holder block. Include a sample ACORD 25 with your address pre-filled. No COI, no start date.",
      },
      {
        heading: "Validate every certificate on intake",
        body: "Review each ACORD 25 against your tier checklist before filing it.",
        bullets: [
          "Named insured matches the subcontractor legal entity",
          "General liability, auto, workers comp, and umbrella limits meet requirements",
          "Each policy expiration date captured separately",
          "Additional insured and waiver endorsements attached when required",
          "Description of operations references your project or location",
        ],
      },
      {
        heading: "Track tiers and flow-down",
        body: "On large construction projects, you may require subs to collect COIs from their subs. Document who is responsible for downstream compliance in your subcontract. Property managers hiring a general maintenance contractor should clarify whether the GC will provide sub COIs or whether you collect from named trades directly.",
      },
      {
        heading: "Renewals and mid-project swaps",
        body: "When a sub is replaced or adds a new trade mid-project, restart collection. Do not assume a predecessor's certificate covers the new entity. Set 30–60 day expiration reminders and require updated certificates before policies lapse — especially on long healthcare renovations or multi-phase construction.",
      },
      {
        heading: "Keep an auditable subcontractor file",
        body: "Store each certificate with received date, reviewer, deficiencies noted, and endorsement PDFs. Owners and lenders ask whether subs were insured when work occurred — not whether they are insured today. A monitored workflow beats a shared folder that nobody updates after closeout.",
      },
    ],
  }),

  guide({
    slug: "how-to-handle-an-expired-certificate-of-insurance",
    title: "How to Handle an Expired Certificate of Insurance",
    summary:
      "What U.S. operations teams should do when a vendor's COI expires — before work continues or a claim exposes a coverage gap.",
    answer:
      "Treat an expired COI as a stop-work and payment-hold event until a current certificate and any required endorsements are on file. Notify the vendor and broker immediately, document the lapse in the vendor record, and do not backdate approval. If work continued uninsured, escalate to risk management and legal — retroactive coverage is not guaranteed.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    relatedGuides: [
      "how-to-track-coi-expirations",
      "how-to-build-a-coi-renewal-process",
      "what-to-check-on-a-certificate-of-insurance",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "coverage-limit"],
    faqs: [
      {
        q: "Can we keep paying a vendor with an expired COI?",
        a: "Most U.S. compliance programs say no — payment and site access should pause until coverage is restored. Your contract may explicitly allow suspension for insurance default.",
      },
      {
        q: "What if the vendor says coverage never actually lapsed?",
        a: "A renewed certificate proves it. Verbal assurance from the sub or broker is not evidence. Request the updated ACORD 25 and confirm new expiration dates before releasing the hold.",
      },
    ],
    sections: [
      {
        heading: "Why expiration is an operational event",
        body: "An expired certificate means you cannot confirm active coverage on that date. The underlying policy may have cancelled for non-payment, non-renewed, or reduced limits — the certificate will not tell you which. Continuing work or payments while expired shifts uninsured risk to your organization, especially on construction sites and healthcare campuses where third-party injury claims are costly.",
      },
      {
        heading: "Immediate steps when you detect expiration",
        body: "Act in order: suspend site access or service authorization if your contract allows; place AP on hold for new invoices; notify the vendor and copy the broker listed on the last certificate; log the lapse with date discovered and actions taken. Automated monitoring should flag expiration 30–60 days ahead — handling expiration on the due date is already late.",
      },
      {
        heading: "Request renewal the right way",
        body: "Send your insurance requirements again — not just 'send updated COI.' Ask for a current ACORD 25 showing new expiration dates, confirmation of unchanged limits, and re-attached endorsements for additional insured and waiver of subrogation. Brokers sometimes issue a certificate without re-processing endorsements; verify remarks match your contract.",
      },
      {
        heading: "Work that happened during the lapse",
        body: "If a vendor performed work while expired, document dates and scope. Risk management and legal should assess exposure — you may need evidence of retroactive reinstatement, a new certificate showing continuous coverage, or contract remedies. Do not assume a renewed certificate covers the gap period without broker confirmation in writing.",
      },
      {
        heading: "Property and healthcare specifics",
        body: "Property managers with tenants on site cannot ignore expired maintenance vendor COIs — elevator, fire alarm, and HVAC vendors often work unattended. Healthcare operators should tie expired COIs to vendor master file holds so purchasing systems block new POs until compliance clears.",
      },
      {
        heading: "Prevent repeat lapses",
        body: "Single lapses happen; patterns signal process failure. Review whether reminders went to the wrong contact, whether the vendor changed brokers, or whether your team approved exceptions too often. A renewal workflow with automated reminders, broker CC, and approval gates reduces repeat expiration.",
      },
    ],
  }),

  guide({
    slug: "how-to-verify-coverage-limits-on-a-coi",
    title: "How to Verify Coverage Limits on a COI",
    summary:
      "How to compare ACORD 25 limit boxes to your contractual minimums for U.S. construction, property, and healthcare vendors.",
    answer:
      "Extract per-occurrence, aggregate, and umbrella limits from each policy line on the ACORD 25 and compare them line by line to your insurance exhibit — not to memory. A vendor can have valid insurance that still fails your program because limits are too low or umbrella sits below required thresholds. Document pass/fail in the vendor record before approving work.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: [
      "how-to-read-an-acord-25-certificate",
      "how-to-set-vendor-insurance-requirements",
      "what-to-check-on-a-certificate-of-insurance",
    ],
    relatedGlossary: ["coverage-limit", "acord-25", "certificate-of-insurance"],
    faqs: [
      {
        q: "Are limits shown in thousands on the ACORD 25?",
        a: "Yes. A '1,000' in the limits column typically means $1,000,000. Train reviewers to read the column header — misreading units is a common approval error.",
      },
      {
        q: "Does umbrella always apply on top of general liability?",
        a: "Usually, but follow-through matters. Confirm umbrella exists when your contract requires it and that underlying limits meet umbrella carrier requirements — low underlying limits can void excess coverage.",
      },
    ],
    sections: [
      {
        heading: "Limits are contractual, not optional",
        body: "U.S. owner and operator contracts specify minimum limits for a reason: they reflect asset value, foot traffic, and downstream indemnity exposure. 'They have insurance' is not the standard — 'they meet our stated minimums' is. A cleaning vendor with $300,000 general liability fails a $1,000,000 requirement even if every date is current.",
      },
      {
        heading: "Which numbers to compare",
        body: "On general liability, compare each occurrence and general aggregate limits. Automobile liability has its own per-accident limits. Employers liability under workers comp has separate bodily injury and disease limits. Umbrella or excess policies show their own occurrence and aggregate — confirm they meet your tier, not just that a policy exists.",
        bullets: [
          "GL each occurrence vs your contract minimum",
          "GL general aggregate — watch 'project' or 'location' aggregates on large jobs",
          "Auto combined single limit or split limits",
          "Employers liability on the workers comp line",
          "Umbrella/excess occurrence and aggregate",
        ],
      },
      {
        heading: "Watch combined single limits vs split limits",
        body: "Some certificates show a combined single limit (CSL) for automobile liability; others split bodily injury and property damage. Convert to your contract's language before approving. Construction fleets and healthcare courier services often trigger auto limit review because vehicles operate on public roads and patient campuses.",
      },
      {
        heading: "Aggregates and large projects",
        body: "General aggregate caps total payouts in a policy term. On multi-year construction or portfolio-wide property contracts, project-specific or location-specific aggregates may apply through endorsements. If your contract requires a dedicated project aggregate, a standard certificate may not prove compliance — request the endorsement.",
      },
      {
        heading: "Automate the comparison",
        body: "Manual comparison works for a handful of vendors; it fails at scale. Encode your tier limits once and validate each intake certificate against them. Flag shortfalls before a human approves — especially when limits differ by trade on the same job site.",
      },
      {
        heading: "When limits fail review",
        body: "Reject the certificate and notify the vendor to obtain increased limits or an umbrella policy. Do not accept 'we'll fix it later' while work proceeds — uninsured gaps rarely fix themselves. Record the deficiency and follow up with the broker copied on the thread.",
      },
    ],
  }),

  guide({
    slug: "how-to-build-a-coi-renewal-process",
    title: "How to Build a COI Renewal Process",
    summary:
      "How U.S. operations teams design a repeatable certificate of insurance renewal workflow that prevents lapses across vendor portfolios.",
    answer:
      "Define who owns renewals, when reminders fire (30 and 60 days before expiration), what you send vendors and brokers, and how updated certificates get reviewed and filed. Tie renewal status to site access and payment holds. A good process runs before expiration — not in response to a lapse discovered on the job site.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    relatedGuides: [
      "how-to-track-coi-expirations",
      "how-to-handle-an-expired-certificate-of-insurance",
      "how-to-collect-cois-from-subcontractors",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "coverage-limit"],
    faqs: [
      {
        q: "How far in advance should we start renewals?",
        a: "Most U.S. teams begin at 60 days and escalate at 30 and 14 days. Brokers need time to process endorsements — last-day requests fail often.",
      },
      {
        q: "Who should receive renewal reminders?",
        a: "Both the vendor operations contact and the producer on the certificate. Vendors forget; brokers process renewals daily.",
      },
    ],
    sections: [
      {
        heading: "Assign ownership",
        body: "Every active vendor needs a named owner in operations, risk, or AP — someone accountable for renewal status. On construction projects, the project administrator often owns subs while corporate AP owns master service vendors. Healthcare systems may split clinical vendor COIs from facilities vendors. Ambiguity is why certificates expire unnoticed.",
      },
      {
        heading: "Build the renewal calendar",
        body: "Pull expiration dates from each policy line on the ACORD 25 — not just the certificate issue date. General liability, auto, workers comp, and umbrella may renew on different days. Your calendar should list the earliest upcoming expiration that gates compliance, plus each line for complete monitoring.",
      },
      {
        heading: "Standardize the renewal request",
        body: "Use one email or portal template: vendor name, expiring policy lines, your insurance requirements PDF, certificate holder address, and a secure upload link. Include endorsement requirements so brokers return a complete package, not a bare certificate with missing additional insured forms.",
      },
      {
        heading: "Review and approve on intake",
        body: "Renewed certificates go through the same validation as onboarding — limits, named insured, endorsements, dates. Do not auto-accept because you had a good certificate last year. Entities merge, limits drop, and endorsements drop off at renewal.",
      },
      {
        heading: "Connect renewals to controls",
        body: "Link renewal status to business rules: block new POs, suspend badge access, or withhold payment when coverage is expired or pending review. Property managers and GCs with safety programs already gate site badges — insurance status should feed the same control.",
      },
      {
        heading: "Measure and improve",
        body: "Track renewal completion rate, average days before expiration, and repeat offenders. If the same HVAC vendor lapses every year, fix the contact list or escalate contractually. Portfolio dashboards beat inbox searches when you manage hundreds of COIs across states.",
      },
    ],
  }),

  guide({
    slug: "what-a-waiver-of-subrogation-does",
    title: "What a Waiver of Subrogation Does",
    summary:
      "What waiver of subrogation means on U.S. vendor insurance — and why construction, property, and healthcare contracts require it.",
    answer:
      "A waiver of subrogation prevents an insurer from suing your organization to recover claim payments related to the vendor's work. It protects the business relationship after a loss: the carrier pays the claim but gives up the right to seek reimbursement from you. It is commonly required on general liability and workers compensation in U.S. construction and lease agreements — verify it with an endorsement, not certificate boilerplate alone.",
    product: "coi-tracker",
    workflow: "review-acord-certificates",
    relatedGuides: [
      "what-additional-insured-means-for-your-business",
      "how-to-set-vendor-insurance-requirements",
      "what-to-check-on-a-certificate-of-insurance",
    ],
    relatedGlossary: ["waiver-of-subrogation", "additional-insured", "certificate-of-insurance"],
    faqs: [
      {
        q: "Is waiver of subrogation the same as additional insured?",
        a: "No. Additional insured gives you access to the vendor's coverage. Waiver of subrogation stops the insurer from suing you after paying a claim. Contracts often require both.",
      },
      {
        q: "Does every state allow workers comp waivers?",
        a: "Rules vary. Some states restrict or regulate waivers of subrogation on workers compensation. Confirm with counsel when you operate across multiple states.",
      },
    ],
    sections: [
      {
        heading: "Subrogation in plain language",
        body: "After an insurer pays a claim, it often seeks reimbursement from other parties who contributed to the loss — subrogation. Example: a subcontractor's employee is injured on your construction site; workers comp pays the employee, then looks to recover from other responsible parties. Without a waiver, your organization can be in the insurer's crosshairs even when you thought the vendor's policy handled the incident.",
      },
      {
        heading: "What the waiver changes",
        body: "A waiver of subrogation endorsement instructs the insurer to waive its right to subrogate against specified parties — typically you, the owner, or upstream contractor. The carrier still pays covered claims, but it gives up seeking repayment from you for losses arising from the vendor's work. That aligns with mutual indemnity language common in U.S. construction subcontracts and commercial leases.",
      },
      {
        heading: "Where you see the requirement",
        body: "General contractors flow waivers down to subcontractors. Commercial landlords require them from tenants' contractors altering premises. Healthcare facilities may require them from major construction and renovation trades working in occupied buildings. The requirement appears in insurance exhibits alongside additional insured and minimum limits.",
      },
      {
        heading: "How to verify on a COI",
        body: "The ACORD 25 may note 'waiver of subrogation' in the remarks or policy checkboxes — that is not proof. Request the endorsement for general liability and workers compensation when your contract requires it. Confirm the waiver names your organization or uses blanket language acceptable to your risk team.",
      },
      {
        heading: "Interaction with additional insured",
        body: "Additional insured and waiver of subrogation solve different problems — coverage access vs post-claim recovery. Many U.S. contracts require both on the same policies. Review them together during certificate intake so you do not approve a certificate with strong limits but missing waiver language.",
      },
      {
        heading: "When a waiver is missing",
        body: "Treat a missing waiver like a limit shortfall: do not approve for work until the endorsement is issued. Vendors may need to pay a small premium charge for waiver endorsements — that is normal. Document the hold and notify the broker early; endorsements take longer than reprinting a certificate.",
      },
    ],
  }),
];
