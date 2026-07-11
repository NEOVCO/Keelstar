import type { GuideArticleSpec } from "../create-guide";

export const coiPhase2Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-request-a-certificate-of-insurance",
    cluster: "coi",
    title: "How to Request a Certificate of Insurance",
    summary:
      "How U.S. risk, procurement, and facilities teams request certificates of insurance from vendors — what to include, when to send, and how to track responses before work starts.",
    answer:
      "Request a certificate of insurance by sending your vendor a written requirements document that lists required coverage types, minimum limits, additional insured and waiver of subrogation language, your certificate holder address, and the deadline before site access or payment. Ask for an ACORD 25 issued by the vendor's broker, not a policy declaration page. Include your project or location in the description of operations when scope matters. Route requests through a tracked workflow — email alone loses renewals and follow-ups. Construction supers, property managers, and healthcare compliance teams should treat the COI request as a standard onboarding step alongside tax and banking forms, not a last-minute gate at the job trailer.",
    primaryKeyword: "request certificate of insurance",
    relatedGuideSlugs: [
      "how-to-set-vendor-insurance-requirements",
      "how-to-collect-cois-from-subcontractors",
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-read-an-acord-25-certificate",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "coverage-limit"],
    faqs: [
      {
        q: "Who should send the COI request — procurement or risk?",
        a: "Either can initiate, but the request should come from a monitored address or system so submissions are not lost when staff change. Risk or compliance should own the requirements template; procurement often triggers the send at vendor onboarding.",
      },
      {
        q: "Should we attach our insurance requirements to the request?",
        a: "Yes. Attach or link your insurance exhibit, sample endorsement language, and certificate holder mailing address. Vendors and brokers process requests faster when requirements are specific — not a generic 'send your COI' email.",
      },
      {
        q: "Can we accept a COI directly from the vendor instead of their broker?",
        a: "Vendors often forward broker-issued certificates, which is fine. Be cautious of vendor-created PDFs that look like certificates but lack producer contact information. Valid ACORD 25 forms list the insurance producer or agency.",
      },
      {
        q: "How soon before work starts should we request the COI?",
        a: "Request at contract execution or vendor setup — ideally two to three weeks before go-live. Rush requests the day before mobilization delay construction, tenant improvements, and healthcare vendor activations.",
      },
    ],
    sections: [
      {
        heading: "What to include in a COI request",
        body: "A complete request answers four vendor questions: what coverage you require, what limits apply, what endorsements your contract demands, and where to send the certificate. Reference your master agreement or insurance exhibit by name so brokers pull the right policies.",
        bullets: [
          "Coverage types: GL, auto, workers comp, umbrella, professional if applicable",
          "Minimum limits by line — per occurrence and aggregate",
          "Additional insured and waiver of subrogation requirements",
          "Certificate holder name and address",
          "Deadline tied to site access or first invoice",
        ],
      },
      {
        heading: "Use a standard request template",
        body: "Build a template your construction, property, and healthcare teams reuse. Include your legal entity name as certificate holder, a contact email for deficiencies, and language requesting ACORD 25 format. Templates reduce back-and-forth when brokers call to clarify whether you need CG 20 10 or CG 20 37 additional insured wording.",
      },
      {
        heading: "Timing relative to onboarding",
        body: "Send the COI request when the vendor record is created — in parallel with W-9 and banking collection. Vendors who receive requirements upfront submit compliant certificates faster than vendors surprised at orientation. For subcontractors, tie the request to subcontract execution and schedule of values approval.",
      },
      {
        heading: "Track requests and responses",
        body: "Manual email threads do not scale across hundreds of vendors. Log send date, response date, review status, and deficiency notes per vendor ID. When a certificate arrives, route it to review against your checklist before marking the vendor active. Operations teams should see COI status in the same system they check for payment readiness.",
      },
      {
        heading: "Follow up on non-responses",
        body: "Send a reminder at seven days and escalate at fourteen days with a clear consequence — no site badge, no PO release, or payment hold. Document every outreach attempt. Construction projects with hard mobilization dates cannot afford vendors who treat insurance paperwork as optional.",
      },
      {
        heading: "Coordinate with contract language",
        body: "Your COI request should mirror what the contract actually requires. If the agreement demands 30-day notice of cancellation, primary and non-contributory wording, or specific ISO endorsements, say so in the request. Reviewers should not discover contract gaps when the certificate arrives — requirements should be settled before the request goes out.",
      },
    ],
  },
  {
    slug: "what-is-an-acord-25-form",
    cluster: "coi",
    title: "What Is an ACORD 25 Form?",
    summary:
      "What the ACORD 25 certificate of liability insurance form is, who issues it, and why U.S. construction, property, and healthcare teams rely on it for vendor compliance.",
    answer:
      "The ACORD 25 is a standardized certificate of liability insurance form published by ACORD, the insurance industry organization. Brokers and agents use it to summarize a policyholder's coverage — policy types, numbers, effective and expiration dates, limits, and key endorsements — for third parties who need proof of insurance. It is not an insurance policy and does not amend coverage; it is evidence that certain policies existed on the certificate date. U.S. construction general contractors, commercial property managers, and healthcare compliance teams encounter ACORD 25 certificates daily when onboarding subcontractors, service vendors, and suppliers. Understanding the form's sections is the foundation for every COI review workflow.",
    primaryKeyword: "acord 25 form",
    relatedGuideSlugs: [
      "how-to-read-an-acord-25-certificate",
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-verify-coverage-limits-on-a-coi",
      "how-to-handle-an-expired-certificate-of-insurance",
    ],
    relatedGlossary: ["acord-25", "certificate-of-insurance", "coverage-limit"],
    faqs: [
      {
        q: "Is the ACORD 25 the only certificate format?",
        a: "ACORD 25 is the most common liability certificate in the United States. Some insurers issue proprietary formats, but most brokers standardize on ACORD forms. Accept alternatives only if they contain equivalent policy detail.",
      },
      {
        q: "Does the ACORD 25 guarantee coverage?",
        a: "No. It reflects information reported by the broker on the certificate date. Policies can cancel, limits can exhaust, and endorsements may be missing. Treat the form as a starting point for verification, not a binding coverage promise.",
      },
      {
        q: "Who fills out the ACORD 25?",
        a: "The vendor's insurance broker or agent completes the form based on the policyholder's coverage. Vendors should not self-complete certificates unless they are licensed producers.",
      },
      {
        q: "Are there different ACORD 25 versions?",
        a: "ACORD periodically updates form editions. The core fields remain consistent: insured, policies, limits, certificate holder, and description of operations. Reviewers should focus on content accuracy, not edition year alone.",
      },
    ],
    sections: [
      {
        heading: "Purpose of the ACORD 25",
        body: "The form exists so third parties — project owners, general contractors, property landlords, healthcare systems — can quickly see what liability coverage a vendor carries without reading full policy documents. It standardizes fields across carriers so reviewers know where to find limits, dates, and endorsement references.",
      },
      {
        heading: "Key sections of the form",
        body: "The ACORD 25 organizes information into predictable blocks: producer contact, named insured, insurers and policy numbers, coverage types and limits, certificate holder, description of operations, and remarks for endorsements like additional insured status.",
        bullets: [
          "Header: certificate number and date issued",
          "Producer: broker name, phone, and email",
          "Named insured: legal entity holding the policies",
          "Policy table: GL, auto, umbrella, workers comp rows",
          "Certificate holder and cancellation notice box",
        ],
      },
      {
        heading: "What the form does not show",
        body: "Full policy exclusions, complete endorsement text, and claims history do not appear on the ACORD 25. When your contract requires specific additional insured or waiver of subrogation language, the remarks box may reference an endorsement — but you often need the actual endorsement form to confirm compliance.",
      },
      {
        heading: "Why U.S. industries standardized on ACORD 25",
        body: "Construction subcontracts, commercial leases, and healthcare vendor agreements routinely require evidence of insurance. Without a standard form, every carrier would use a different layout and comparison would be slow. ACORD 25 lets a property manager review fifty vendor certificates in an afternoon using the same field map.",
      },
      {
        heading: "ACORD 25 vs other ACORD certificates",
        body: "ACORD publishes certificates for different lines — property, workers compensation-only, and professional liability among them. ACORD 25 specifically covers commercial liability programs. If a vendor performs professional services, you may also need an ACORD certificate for professional liability or a separate evidence of property coverage.",
      },
      {
        heading: "Build your review process around the form",
        body: "Train reviewers to read the ACORD 25 top to bottom: insured match, each policy date, limits against your requirements, certificate holder accuracy, and endorsement references. A checklist mapped to form sections reduces missed expirations and limit deficiencies — the two most common compliance failures in vendor insurance programs.",
      },
    ],
  },
  {
    slug: "how-to-verify-general-liability-on-a-coi",
    cluster: "coi",
    title: "How to Verify General Liability on a COI",
    summary:
      "Steps U.S. risk and operations teams take to verify commercial general liability coverage on a certificate of insurance — limits, dates, and endorsement gaps.",
    answer:
      "Verify general liability on a COI by confirming the commercial general liability row shows active policy dates, per-occurrence and general aggregate limits meeting your contract minimums, and the named insured matches your vendor's legal entity. Check whether coverage is occurrence-based or claims-made — claims-made policies need current retroactive dates and tail coverage at project close. Compare limits to your tier requirements: a janitorial vendor on a healthcare campus and a structural steel subcontractor should not share the same minimums. If the ACORD 25 remarks reference additional insured endorsements, request copies when your agreement requires them. Record pass/fail status and deficiency notes before authorizing work or releasing payment.",
    primaryKeyword: "verify general liability coi",
    relatedGuideSlugs: [
      "how-to-verify-coverage-limits-on-a-coi",
      "how-to-read-an-acord-25-certificate",
      "how-to-set-vendor-insurance-requirements",
      "what-additional-insured-means-for-your-business",
    ],
    relatedGlossary: ["coverage-limit", "acord-25", "certificate-of-insurance"],
    faqs: [
      {
        q: "What GL limits do most U.S. contracts require?",
        a: "Low-risk vendors often need $1M per occurrence / $2M aggregate. Construction and healthcare frequently require $2M / $4M or higher, with umbrella sitting above GL. Your contract exhibit is the source — not industry habit.",
      },
      {
        q: "Does a blank GL row mean no coverage?",
        a: "Usually yes — or the broker omitted the line. Treat a blank commercial general liability row as a deficiency unless the vendor has a valid reason and alternative evidence. Do not authorize on-site work without confirmed GL.",
      },
      {
        q: "What is the difference between occurrence and claims-made GL?",
        a: "Occurrence policies cover incidents during the policy period regardless of when the claim is filed. Claims-made policies cover claims filed during the period — retroactive date and extended reporting period matter at project completion.",
      },
      {
        q: "Should aggregate limits include products-completed operations?",
        a: "Many construction contracts require separate or sufficient completed operations aggregate. Check whether your agreement specifies completed operations limits distinct from the general aggregate on the certificate.",
      },
    ],
    sections: [
      {
        heading: "Locate the GL row on the ACORD 25",
        body: "Commercial general liability appears in the standard policy table — typically letter code CGL or GL. Read policy number, effective date, expiration date, and both per-occurrence and general aggregate limits. Each field should be populated; dashes or blanks trigger a deficiency.",
      },
      {
        heading: "Compare limits to your requirements",
        body: "Pull limits from your contract insurance exhibit or vendor tier matrix. Verify per-occurrence meets minimum, general aggregate meets minimum, and products-completed operations aggregate satisfies construction close-out requirements where applicable. Limits below contract minimums are a hard stop.",
        bullets: [
          "Per-occurrence limit vs contract minimum",
          "General aggregate limit vs contract minimum",
          "Products-completed operations aggregate if required",
          "Umbrella or excess sitting above GL limits",
        ],
      },
      {
        heading: "Validate policy dates",
        body: "GL must be active on the work date — not just on the certificate issue date. A certificate printed yesterday can list a GL policy that expired last month. Track expiration separately and tie it to your renewal workflow.",
      },
      {
        heading: "Check additional insured on GL",
        body: "Most U.S. construction and property contracts require additional insured status on the vendor's general liability policy. The ACORD 25 may show a checkbox or remarks reference. Generic language may not satisfy ISO endorsement requirements — request the endorsement when your contract specifies CG 20 10, CG 20 37, or equivalent wording.",
      },
      {
        heading: "Named insured must match the vendor",
        body: "The GL policy insures the named insured at the top of the certificate. That entity should match your subcontractor, service agreement counterparty, or DBA relationship documented in your vendor file. Mismatches between certificate insured and contract party create coverage gaps in a claim.",
      },
      {
        heading: "Document verification outcome",
        body: "Record reviewer, date, pass/fail by field, and notes on deficiencies sent to the broker. GL verification should be repeatable — the same checklist for every certificate. Operations teams approving site access should see GL status without re-reading the full ACORD 25.",
      },
    ],
  },
  {
    slug: "how-to-track-workers-comp-certificates",
    cluster: "coi",
    title: "How to Track Workers Comp Certificates",
    summary:
      "How U.S. construction, property, and healthcare teams track workers compensation certificates — state requirements, expiration dates, and exemption pitfalls.",
    answer:
      "Track workers compensation certificates by capturing policy or statutory coverage status, employers liability limits, effective and expiration dates, and the named insured for every vendor who brings employees onto your sites. Workers comp renewals often differ from general liability dates — treat the workers comp row as its own tracking record, not a footnote to GL. Flag vendors claiming exemption: sole proprietors, partners, and corporate officers may be exempt in some states but not others. Construction owners and property managers face stop-work and indemnity exposure when uninsured workers are injured on premises. Store certificates in a central system with expiration alerts at 30 and 60 days, and block site access when workers comp lapses.",
    primaryKeyword: "workers comp certificate tracking",
    relatedGuideSlugs: [
      "how-to-track-coi-expirations",
      "how-to-build-a-coi-renewal-process",
      "how-to-read-an-acord-25-certificate",
      "what-to-check-on-a-certificate-of-insurance",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "coverage-limit"],
    faqs: [
      {
        q: "Is workers comp required on every vendor COI?",
        a: "Require it when the vendor has employees who work on your premises or project. State law governs whether the vendor must carry workers comp. In construction, upstream parties often contractually require it regardless of exemption claims.",
      },
      {
        q: "What if a vendor says they are workers comp exempt?",
        a: "Request written exemption documentation acceptable in your state — owner exemption forms, state filings, or carrier waivers. Exemption rules vary; a valid exemption in Texas may not apply in California.",
      },
      {
        q: "Why do workers comp dates differ from GL dates?",
        a: "Policies renew on independent schedules. A vendor can have current GL and expired workers comp simultaneously. Track each policy line with its own expiration date.",
      },
      {
        q: "What employers liability limits should we require?",
        a: "Many contracts require employers liability of $500K/$500K/$500K or $1M/$1M/$1M alongside statutory workers comp. Verify the employers liability row on the ACORD 25 when your exhibit specifies it.",
      },
    ],
    sections: [
      {
        heading: "Why workers comp tracking is separate from GL",
        body: "General liability and workers compensation answer different risks. GL covers third-party bodily injury and property damage; workers comp covers the vendor's employees injured on the job. A certificate with robust GL limits but missing workers comp leaves a gap that surfaces immediately when a worker is hurt on a construction site or in a hospital loading dock.",
      },
      {
        heading: "What to capture from the certificate",
        body: "From the workers compensation row on the ACORD 25, record policy number, effective and expiration dates, statutory limits notation, and employers liability limits if listed. Note the state of coverage when vendors work across multiple jurisdictions.",
        bullets: [
          "Policy number and carrier",
          "Effective and expiration dates — unique alert per line",
          "Statutory limits or state fund notation",
          "Employers liability limits per contract",
          "Exemption documentation if no policy listed",
        ],
      },
      {
        heading: "Handle exemption claims carefully",
        body: "Sole proprietors and small subcontractors frequently claim workers comp exemption. In many states, exemption requires a filed form and may not extend to employees the vendor later hires. Re-verify exemption annually — not just at initial onboarding. Healthcare and construction audits increasingly challenge exemption paperwork.",
      },
      {
        heading: "Set expiration alerts",
        body: "Workers comp lapses are a common stop-work trigger on construction projects. Configure reminders at 60 days, 30 days, and 7 days before expiration. When coverage expires, suspend site access and notify the broker and project superintendent the same day.",
      },
      {
        heading: "Multi-state vendor considerations",
        body: "Vendors working in multiple states may need coverage endorsements for each jurisdiction. A Texas workers comp policy may not cover employees dispatched to a Colorado job site. Ask brokers to confirm coverage territory when vendors mobilize across state lines.",
      },
      {
        heading: "Integrate with site access controls",
        body: "Badge systems, gate logs, and subcontractor sign-in sheets should check workers comp status — not just GL. Property management teams enabling HVAC or elevator vendors need the same gate as general contractors running subcontractor compliance meetings.",
      },
    ],
  },
  {
    slug: "how-to-handle-a-coi-with-wrong-named-insured",
    cluster: "coi",
    title: "How to Handle a COI With Wrong Named Insured",
    summary:
      "What U.S. risk and procurement teams do when a certificate of insurance lists the wrong named insured — DBA confusion, entity changes, and broker corrections.",
    answer:
      "When a COI lists the wrong named insured, stop work authorization until the broker reissues the certificate with the legal entity that matches your contract and W-9. Named insured errors are among the most common certificate deficiencies — DBAs on invoices while the policy covers a parent LLC, former company names after mergers, or individual names instead of corporate entities. Contact the vendor's broker directly with your contract party name and request a corrected ACORD 25. Do not accept handwritten edits on the certificate PDF. If the mismatch reveals the vendor is performing work under an uninsured entity, escalate to risk management and legal before allowing continued access. Document the deficiency, correction request date, and revised certificate receipt.",
    primaryKeyword: "wrong named insured coi",
    relatedGuideSlugs: [
      "how-to-read-an-acord-25-certificate",
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-collect-cois-from-subcontractors",
      "how-to-set-vendor-insurance-requirements",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "additional-insured"],
    faqs: [
      {
        q: "Is a DBA on the certificate acceptable if it differs from the legal name?",
        a: "The named insured should be the legal entity covered by the policy — often the LLC or corporation. DBAs may appear in the description of operations but should not replace the insured name unless the policy explicitly covers the DBA as an insured.",
      },
      {
        q: "Can we white-out and correct the named insured on a COI?",
        a: "No. Request a reissued certificate from the broker. Hand-edited certificates fail audits and may not reflect actual policy records.",
      },
      {
        q: "What if the vendor recently changed their company name?",
        a: "Request an updated certificate reflecting the new legal entity and confirm the underlying policies were endorsed for the name change. Contracts, W-9s, and COIs should align on the current legal name.",
      },
      {
        q: "Does named insured mismatch void all coverage?",
        a: "Potentially — if the entity performing work is not the insured on the policy, their insurer may deny claims. Treat mismatch as a critical deficiency, not a clerical typo.",
      },
    ],
    sections: [
      {
        heading: "How named insured mismatches happen",
        body: "Brokers sometimes pull certificates from outdated account records. Vendors operating under trade names confuse AP and risk reviewers. Subcontractors newly formed as LLCs may still have certificates under the owner's personal name. Construction tiers amplify the problem when lower-tier subs change entities mid-project without notifying upstream parties.",
      },
      {
        heading: "Compare three sources",
        body: "Cross-check the named insured against your executed contract, vendor master record, and W-9 legal name. All three should reconcile — or you should have documented why they differ, such as a parent-subsidiary guarantee arrangement.",
        bullets: [
          "Contract counterparty legal name",
          "W-9 line 1 legal name",
          "ACORD 25 named insured box",
          "Invoice header if DBA is used operationally",
        ],
      },
      {
        heading: "Immediate steps when insured is wrong",
        body: "Mark the certificate deficient. Notify the vendor and copy their broker with the correct legal name. Suspend site access or PO release until a corrected certificate arrives. Do not store the deficient certificate as 'approved with exception' without risk management sign-off.",
      },
      {
        heading: "Working with brokers on corrections",
        body: "Brokers reissue certificates quickly when given the contract entity name and policyholder account details. Provide the vendor's policy number if known and your certificate holder address. Most corrections turnaround in one to two business days — faster than disputing a denied claim later.",
      },
      {
        heading: "Entity structure red flags",
        body: "If the performing entity differs from the insured entity — for example, work performed by 'ABC Plumbing LLC' but insured shows 'John Smith' — ask whether a legal relationship exists and whether coverage follows. Uninsured shell arrangements create liability exposure for general contractors and property owners.",
      },
      {
        heading: "Prevent repeat mismatches at onboarding",
        body: "Collect legal entity name in your vendor intake form and pass it to COI request templates. Auto-compare incoming certificate insured names to vendor master data. Flag fuzzy matches for human review before approval.",
      },
    ],
  },
  {
    slug: "how-to-set-coi-expiration-reminders",
    cluster: "coi",
    title: "How to Set COI Expiration Reminders",
    summary:
      "How U.S. operations and risk teams configure certificate of insurance expiration reminders — timing, escalation, and integration with vendor access controls.",
    answer:
      "Set COI expiration reminders at 60, 30, and 7 days before each policy line expires — general liability, automobile, workers compensation, and umbrella renew on different dates and need separate alerts. Route reminders to the vendor, their broker, and your internal owner for that vendor relationship. Tie the final reminder to a consequence: site access suspension, invoice hold, or removal from approved vendor lists. Spreadsheet date columns fail at scale; use a tracker that stores each policy expiration independently and logs outreach. Construction projects should align reminders with subcontract compliance meetings; healthcare systems should align with annual vendor recredentialing cycles. Reminders only work when someone acts on them — assign owners, not distribution lists.",
    primaryKeyword: "coi expiration reminder",
    relatedGuideSlugs: [
      "how-to-track-coi-expirations",
      "how-to-build-a-coi-renewal-process",
      "how-to-handle-an-expired-certificate-of-insurance",
      "how-to-read-an-acord-25-certificate",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "coverage-limit"],
    faqs: [
      {
        q: "How far in advance should we remind vendors about COI expiration?",
        a: "First notice at 60 days gives brokers time to process renewals and endorsements. Second at 30 days and final at 7 days. High-risk construction subs may need 90-day lead time when additional insured endorsements are required.",
      },
      {
        q: "Should reminders go to the vendor or the broker?",
        a: "Both. Email the vendor contact and copy the producer listed on the ACORD 25. Brokers often control renewals; vendors may not know their GL expired until you tell them.",
      },
      {
        q: "What if only one policy line expires?",
        a: "Alert on that specific line. A vendor with current workers comp and expired GL still cannot work on most sites. Partial compliance is non-compliance for the expired line.",
      },
      {
        q: "Can calendar reminders replace a COI tracker?",
        a: "Calendar invites do not scale across hundreds of vendors and multiple policy lines. Use a system that tracks expirations per vendor per line and automates reminder sequences.",
      },
    ],
    sections: [
      {
        heading: "Track each policy line separately",
        body: "A single vendor may have four different expiration dates on one ACORD 25. Configure reminders per line — not one reminder per certificate. Operations teams get burned when GL renews but workers comp lapses unnoticed because only the certificate issue date was tracked.",
      },
      {
        heading: "Standard reminder cadence",
        body: "Adopt a consistent schedule across construction, property, and healthcare portfolios: 60-day advisory, 30-day action required, 7-day final notice with access or payment consequence. Document sends in the vendor record.",
        bullets: [
          "60 days: email vendor and broker with expiration date and required limits",
          "30 days: second notice; flag internal owner",
          "7 days: final warning; prepare access block",
          "Day after expiration: suspend until renewed certificate received",
        ],
      },
      {
        heading: "Assign internal owners",
        body: "Reminders to a shared inbox get ignored. Assign each vendor or project tier to a compliance coordinator, project accountant, or property manager who confirms follow-through. Construction supers need expired-sub reports before weekly safety meetings.",
      },
      {
        heading: "Integrate with renewal workflow",
        body: "Expiration reminders should trigger a renewal request template listing your current requirements — not a generic 'your COI expired' message. Include certificate holder address and endorsement requirements so brokers return compliant certificates on first resubmission.",
      },
      {
        heading: "Escalation when reminders fail",
        body: "If no response by expiration, execute your enforcement policy: stop work order, badge deactivation, or AP hold. Escalate to procurement and risk for vendors continuing to perform without valid coverage. Document enforcement for owner and payer audits.",
      },
      {
        heading: "Measure reminder effectiveness",
        body: "Track percentage of vendors renewed before expiration, average days overdue, and count of access blocks required. Rising overdue rates signal broker relationship problems or requirements too burdensome to meet — both deserve management attention before a claim occurs.",
      },
    ],
  },
  {
    slug: "what-is-a-certificate-holder-on-acord-25",
    cluster: "coi",
    title: "What Is a Certificate Holder on ACORD 25?",
    summary:
      "What the certificate holder field on ACORD 25 means for U.S. property owners, general contractors, and healthcare operators — and how it differs from additional insured.",
    answer:
      "The certificate holder on ACORD 25 is the person or organization listed as receiving the certificate — typically your company name and mailing address in the lower-left section of the form. Being named as certificate holder means you received proof of insurance; it does not automatically make you an additional insured on the vendor's policies. Certificate holder status may entitle you to notice of cancellation if the box is checked and the policy provides it, but coverage rights come from the policy and endorsements — not from the certificate holder label alone. U.S. construction owners, commercial landlords, and healthcare systems should require their correct legal entity and address in the certificate holder box while separately verifying additional insured endorsements required by contract.",
    primaryKeyword: "certificate holder acord 25",
    relatedGuideSlugs: [
      "how-to-read-an-acord-25-certificate",
      "what-additional-insured-means-for-your-business",
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-set-vendor-insurance-requirements",
    ],
    relatedGlossary: ["acord-25", "certificate-of-insurance", "additional-insured"],
    faqs: [
      {
        q: "Does certificate holder mean we are additional insured?",
        a: "No. Certificate holder identifies who received the form. Additional insured is a separate endorsement granting coverage rights. Many deficient reviews confuse the two.",
      },
      {
        q: "What address should appear as certificate holder?",
        a: "Use the legal entity name and address your contract specifies — often your project office, corporate risk department, or property management address. Consistent formatting speeds filing across vendor files.",
      },
      {
        q: "Can there be multiple certificate holders?",
        a: "ACORD 25 has one certificate holder box. Additional parties may be listed in remarks or receive separate certificates. Owner and general contractor often each require their own certificate.",
      },
      {
        q: "What is notice of cancellation?",
        a: "When the policy provides it and the box is checked, the insurer may notify the certificate holder before cancellation. Typical contract requirement is 30 days, except 10 days for nonpayment. Notice is not a substitute for tracking expirations yourself.",
      },
    ],
    sections: [
      {
        heading: "Where certificate holder appears on the form",
        body: "The certificate holder box sits in the lower portion of ACORD 25 — name and mailing address. Brokers enter the party who requested evidence of insurance: the general contractor, property owner, facility manager, or healthcare system compliance department.",
      },
      {
        heading: "Certificate holder vs additional insured",
        body: "Certificate holder is administrative — you hold the paper. Additional insured is a coverage grant on the vendor's liability policy. U.S. construction contracts routinely require both: correct certificate holder listing for notice purposes and ISO additional insured endorsements for claim protection.",
      },
      {
        heading: "Notice of cancellation checkbox",
        body: "Adjacent language addresses whether insurers will endeavor to notify the certificate holder of cancellation. Not all policies provide notice to certificate holders; the checkbox indicates intent, not a guarantee. Continue tracking expirations proactively.",
      },
      {
        heading: "Common certificate holder errors",
        body: "Brokers misspell owner names, use outdated addresses, or list the project manager instead of the legal entity required by contract. Wrong certificate holder formatting does not always block coverage but creates filing confusion and notice delivery failures.",
        bullets: [
          "Legal entity name mismatch with contract",
          "Outdated address after corporate relocation",
          "Subsidiary named when parent is contract party",
          "Missing d/b/a when lease requires specific landlord entity",
        ],
      },
      {
        heading: "Provide certificate holder info in vendor packets",
        body: "Include a standard certificate holder block in every COI request — legal name, attention line, street address, city, state, ZIP. Vendors forward it to brokers verbatim. Reduces reissuance cycles on busy construction and tenant improvement projects.",
      },
      {
        heading: "When to reject a certificate",
        body: "Reject when certificate holder name does not match your contract entity and the broker cannot reissue promptly. For healthcare and owner-controlled work, certificate holder accuracy is an audit checkpoint — fix it before the vendor is marked compliant.",
      },
    ],
  },
  {
    slug: "how-to-collect-cois-before-vendor-go-live",
    cluster: "coi",
    title: "How to Collect COIs Before Vendor Go-Live",
    summary:
      "Why U.S. operations teams block vendor go-live until a compliant certificate of insurance is on file — and the onboarding gates that make pre-mobilization collection routine.",
    answer:
      "Collect certificates of insurance before vendor go-live by making COI approval a mandatory gate in onboarding — same priority as W-9 and banking — not a post-mobilization cleanup task. Send insurance requirements at contract signing, review the ACORD 25 against your checklist before scheduling orientation or issuing site badges, and hold go-live until every required policy line passes. Construction supers should not mobilize subs without compliance clearance; property managers should not enable keys or access codes for maintenance vendors without current GL and workers comp; healthcare teams should block EHR interface work until vendor insurance is verified. Vendors who start work without approved COIs create stop-work risk, indemnity exposure, and audit findings that outlast the project.",
    primaryKeyword: "collect coi before vendor go live",
    relatedGuideSlugs: [
      "how-to-collect-cois-from-subcontractors",
      "how-to-set-vendor-insurance-requirements",
      "what-to-check-on-a-certificate-of-insurance",
      "how-to-read-an-acord-25-certificate",
    ],
    relatedGlossary: ["certificate-of-insurance", "acord-25", "additional-insured"],
    faqs: [
      {
        q: "Can we allow a vendor to start while COI is pending?",
        a: "Some teams allow it with an exception form — high risk on construction and healthcare sites. Best practice is no physical access until COI passes review. Exception policies should require risk management approval.",
      },
      {
        q: "What if the project schedule is urgent?",
        a: "Urgent schedules are when pre-collection matters most. Rush broker requests with complete requirements often return in 24–48 hours. Starting work uninsured to save two days is a poor trade.",
      },
      {
        q: "Who owns the go-live gate — procurement or operations?",
        a: "Shared ownership: procurement triggers collection, risk or compliance approves, operations controls site access. The gate should be visible in one system so supers and facility managers do not override silently.",
      },
      {
        q: "Do product-only vendors need COI before go-live?",
        a: "If they never enter your premises, requirements may differ. If they deliver to site, perform installation, or access systems, collect COI before that first visit — not after.",
      },
    ],
    sections: [
      {
        heading: "Define go-live and what it requires",
        body: "Go-live means the vendor's first day of physical access, system connectivity, or service delivery on your behalf. Document that COI approval is a prerequisite in your vendor policy and contract insurance exhibit. Ambiguous policy lets project managers create uninsured exposure under schedule pressure.",
      },
      {
        heading: "Build COI into vendor onboarding workflow",
        body: "Parallel-path COI collection with tax and banking: requirements sent at setup, certificate reviewed within SLA, deficiencies returned to broker before approval. Vendor status should read 'insurance approved' or 'blocked' — not 'in progress' indefinitely.",
        bullets: [
          "COI request sent at vendor record creation",
          "Review checklist completed by risk or designee",
          "Deficiencies cleared with broker",
          "Approval flag visible to site access and AP",
        ],
      },
      {
        heading: "Coordinate with construction mobilization",
        body: "General contractors should include COI clearance in subcontractor orientation checklists alongside safety training and signed subcontracts. Subs who arrive on site without approved certificates delay the entire job when compliance officers stop work.",
      },
      {
        heading: "Property and healthcare access controls",
        body: "Facility managers issuing badges, elevator keys, or after-hours access must verify COI status in the vendor system — not verbal assurance from the vendor rep. Healthcare compliance committees increasingly audit go-live evidence for business associates and on-site service providers.",
      },
      {
        heading: "Exception process for emergencies",
        body: "Emergency repairs happen — burst pipes, HVAC failures, security incidents. Define a narrow exception path: risk approval, temporary coverage verification, hard deadline for full certificate, and documented incident reference. Do not let emergency exceptions become standard practice.",
      },
      {
        heading: "Measure go-live compliance",
        body: "Track percentage of vendors with approved COI before first site day and average days from request to approval. Spikes in post-mobilization submissions signal procurement bypassing the gate — fix the workflow before an incident or audit.",
      },
    ],
  },
  {
    slug: "how-to-audit-vendor-insurance-compliance",
    cluster: "coi",
    title: "How to Audit Vendor Insurance Compliance",
    summary:
      "How U.S. risk and compliance teams audit vendor insurance programs — sampling, documentation, deficiency trends, and owner audit readiness.",
    answer:
      "Audit vendor insurance compliance by pulling a complete vendor population report, verifying each active vendor has a current ACORD 25 on file with documented review dates, and sampling certificates against contract requirements for limits, additional insured, waiver of subrogation, and expiration tracking. Compare your requirements matrix to actual certificates — not just presence of a PDF. Construction owners responding to lender and surety reviews, healthcare systems preparing for payer accreditation, and property managers facing tenant audits need evidence of systematic review, not ad-hoc folders. Document reviewer identity, pass/fail criteria, deficiency correspondence with brokers, and remediation dates. Run audits quarterly for high-risk tiers and annually for the full vendor base; escalate repeat offenders and systemic broker failures to procurement leadership.",
    primaryKeyword: "audit vendor insurance compliance",
    relatedGuideSlugs: [
      "how-to-set-vendor-insurance-requirements",
      "how-to-verify-coverage-limits-on-a-coi",
      "how-to-build-a-coi-renewal-process",
      "how-to-track-coi-expirations",
    ],
    relatedGlossary: ["certificate-of-insurance", "coverage-limit", "acord-25"],
    faqs: [
      {
        q: "How many vendor COIs should we sample in an audit?",
        a: "Audit 100% of active high-risk vendors — construction subs, life-safety contractors, healthcare clinical vendors. Sample 10–20% of low-risk active vendors. Increase sample size when prior audits found high deficiency rates.",
      },
      {
        q: "What documentation do external auditors want?",
        a: "Insurance requirements policy, review checklists, certificate files with review timestamps, deficiency letters, renewal tracking reports, and evidence of access blocks when coverage lapsed.",
      },
      {
        q: "How do we score compliance?",
        a: "Common metrics: percentage current on all required lines, percentage meeting limit requirements, percentage with required endorsements on file, average days deficient before cure.",
      },
      {
        q: "Should we audit brokers or vendors?",
        a: "Hold vendors contractually responsible; work with brokers operationally since they issue certificates. Track which brokers produce repeat deficiencies and adjust onboarding instructions.",
      },
    ],
    sections: [
      {
        heading: "Scope the audit population",
        body: "Start with all vendors marked active who had site access, invoices, or contract value in the audit period. Exclude terminated vendors unless their work continued into the period. Segment by risk tier so high-exposure relationships receive full file review.",
      },
      {
        heading: "Audit checklist per vendor",
        body: "For each sampled vendor, confirm: current ACORD 25 on file, review date within policy period, named insured match, each required line present and not expired, limits meet contract, additional insured and waiver requirements documented, certificate holder correct.",
        bullets: [
          "Certificate on file and dated within active policy",
          "Review log with reviewer and outcome",
          "Limits pass by line vs contract exhibit",
          "Endorsements attached when contract requires",
          "Expiration tracking with reminder evidence",
        ],
      },
      {
        heading: "Identify systemic trends",
        body: "Single-vendor deficiencies are operational; patterns are strategic. If 30% of certificates lack required umbrella limits, your requirements communication failed. If one broker repeatedly misnames certificate holders, escalate to vendor management.",
      },
      {
        heading: "Prepare for owner and payer audits",
        body: "Construction owners face OCIP/CCIP and lender insurance audits. Healthcare operators face accreditation and business associate scrutiny. Export a compliance summary: active vendors, percent compliant, open deficiencies, cure timeline. Ad-hoc spreadsheet hunts fail external audit requests.",
      },
      {
        heading: "Remediation and enforcement",
        body: "Assign deficiency cure deadlines — typically 10 business days for non-critical, immediate for lapsed coverage. Document broker correspondence. Vendors who cannot cure lose approved status. Repeat failures trigger contract review or termination.",
      },
      {
        heading: "Report results to leadership",
        body: "Present audit findings to risk, procurement, and operations leadership with trend comparison to prior quarters. Insurance compliance is a leading indicator — expired COIs predict where stop-work and claim disputes will occur next.",
      },
    ],
  },
  {
    slug: "how-to-read-policy-dates-on-a-coi",
    cluster: "coi",
    title: "How to Read Policy Dates on a COI",
    summary:
      "How to read effective and expiration dates on ACORD 25 policy lines — certificate date vs coverage period, and multi-policy tracking for U.S. vendor programs.",
    answer:
      "Read policy dates on a COI by examining each policy row's effective and expiration dates — not the certificate issue date at the top of the ACORD 25. The certificate date shows when the broker printed the form; coverage is active only when today's date falls between the effective and expiration dates for that specific line. General liability, automobile, workers compensation, and umbrella policies often expire on different days; track each independently. Effective dates confirm when coverage began — important for mid-term vendor onboarding and backdated work claims. If dates are blank, expired, or show a future effective date without evidence of prior coverage, treat the line as deficient until the broker clarifies. Misread dates are the leading cause of unintentionally allowing uninsured vendors on site.",
    primaryKeyword: "coi policy dates",
    relatedGuideSlugs: [
      "how-to-read-an-acord-25-certificate",
      "how-to-handle-an-expired-certificate-of-insurance",
      "how-to-track-coi-expirations",
      "how-to-build-a-coi-renewal-process",
    ],
    relatedGlossary: ["acord-25", "certificate-of-insurance", "coverage-limit"],
    faqs: [
      {
        q: "Is the certificate date the same as the expiration date?",
        a: "No. Certificate date is when the form was issued. Expiration date is when the underlying policy ends. A certificate issued yesterday can list policies that expired months ago.",
      },
      {
        q: "What if effective date is after our work start date?",
        a: "Coverage may not apply to work performed before the effective date. Request evidence of prior term coverage or adjust work start until the policy is active.",
      },
      {
        q: "Can policies have different expiration dates on one certificate?",
        a: "Yes — expected. Track GL, auto, workers comp, and umbrella separately. One renewed line does not mean full compliance.",
      },
      {
        q: "What date format do ACORD forms use?",
        a: "U.S. certificates typically use MM/DD/YYYY. Enter dates consistently in your tracker to avoid sort errors.",
      },
    ],
    sections: [
      {
        heading: "Certificate date vs policy dates",
        body: "The certificate date in the header shows when the broker generated the ACORD 25. Policy effective and expiration dates appear in each coverage row. Reviewers who only check the header miss expired policies listed below — a frequent compliance failure in busy property and construction portfolios.",
      },
      {
        heading: "Effective date: when coverage starts",
        body: "The effective date is the first day the policy term applies to that line. For newly onboarded vendors, confirm effective date is on or before their go-live. Mid-term policy changes may show a recent effective date with a new policy number — verify continuity from any prior term.",
      },
      {
        heading: "Expiration date: when coverage ends",
        body: "The expiration date is the last day of the policy term. Coverage typically ends at midnight on that date per policy terms. Configure alerts before expiration and block access the day after unless a renewal certificate is approved.",
        bullets: [
          "Compare expiration to today's date per line",
          "Track each line's expiration independently",
          "Treat blank dates as deficient",
          "Confirm renewal certificates show new term dates",
        ],
      },
      {
        heading: "Multi-policy date complexity",
        body: "A vendor might show GL expiring March 1, workers comp expiring June 1, and umbrella expiring December 1. Your tracker needs four date fields, not one. Operations teams approving a March project must confirm March-active lines — not just that a certificate exists.",
      },
      {
        heading: "Renewal and date gaps",
        body: "Renewal certificates should show consecutive terms — new effective date immediately following prior expiration, or same-day without gap. Gaps between terms mean uninsured days. Ask the broker for a reinstatement or evidence of continuous coverage when dates do not align.",
      },
      {
        heading: "Enter dates correctly in your system",
        body: "Transcription errors cause false compliance. Enter effective and expiration per policy line from the certificate into your COI tracker. Have a second reviewer spot-check high-risk vendors. Correct dates drive correct reminders — the backbone of expiration management.",
      },
    ],
  },
];
