import { guide } from "./helpers";

export const healthcareExclusionGuides = [
  guide({
    slug: "oig-sam-and-ofac-what-healthcare-providers-must-screen",
    title: "OIG, SAM, and OFAC: What Healthcare Providers Must Screen",
    summary:
      "A practical map of which U.S. exclusion and sanctions lists Medicare and Medicaid providers should check — and why checking only one list is not enough.",
    answer:
      "U.S. healthcare providers should screen vendors and staff against the OIG LEIE, SAM.gov exclusions, applicable state Medicaid exclusion lists, and OFAC sanctions — each list serves a different purpose and updates independently. A clear OIG result does not clear SAM or OFAC. Document every check with a date and tie it to the vendor or employee record.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "how-to-screen-vendors-against-the-oig-list",
      "what-ofac-screening-requires",
      "how-to-screen-vendors-against-sam-gov",
      "how-to-check-state-medicaid-exclusion-lists",
    ],
    relatedGlossary: ["oig-exclusion", "sam-exclusion", "ofac-sdn-list"],
    faqs: [
      {
        q: "Which list is most important for a clinic or medical practice?",
        a: "OIG LEIE and your state Medicaid exclusion list are usually the highest priority for patient-facing providers. SAM matters if you hold federal contracts or grants. OFAC applies to all U.S. persons regardless of industry.",
      },
      {
        q: "Can one screening tool cover all lists?",
        a: "Some platforms aggregate multiple lists, but your policy should name each source checked. Auditors may ask for evidence by list type, not just a single pass/fail result.",
      },
    ],
    sections: [
      {
        heading: "Four lists, four different risks",
        body: "Healthcare compliance teams often treat 'exclusion screening' as a single checkbox. In practice, U.S. providers navigate multiple federal and state sources. Each list reflects a different enforcement action — healthcare program ban, federal contract debarment, economic sanctions, or state Medicaid exclusion — and a party can appear on one list but not others.",
      },
      {
        heading: "OIG LEIE — federal healthcare program exclusions",
        body: "The List of Excluded Individuals and Entities is maintained by HHS OIG. Excluded parties cannot furnish items or services paid by Medicare, Medicaid, or other federal healthcare programs. This is the list CMS surveyors and payer auditors ask about most often for providers billing federal programs.",
      },
      {
        heading: "SAM.gov — federal contract and assistance debarment",
        body: "The System for Award Management tracks parties debarred, suspended, or otherwise excluded from receiving federal contracts or certain types of federal financial assistance. Hospitals with NIH grants, FQHCs, and vendors selling to government healthcare entities need SAM screening even when OIG is clear.",
      },
      {
        heading: "State Medicaid exclusion lists",
        body: "Most states maintain their own Medicaid exclusion or sanction lists. A provider can be excluded in Texas but not yet on the OIG LEIE — or vice versa. Multi-state operators and telehealth providers serving patients across state lines must define which state lists apply to each relationship.",
      },
      {
        heading: "OFAC — sanctions and blocked parties",
        body: "OFAC administers U.S. economic sanctions. Healthcare is not exempt: international medical device vendors, offshore billing partners, and wire payments to foreign entities all trigger OFAC obligations. OIG screening does not satisfy OFAC requirements.",
      },
      {
        heading: "Build a screening matrix",
        body: "Document which lists you check for each relationship type — employee, clinical contractor, billing vendor, facilities vendor — and at what frequency. A one-page matrix attached to your compliance policy prevents the common failure mode where AP screens OIG but HR never checks state lists.",
        bullets: [
          "Employees and clinical staff → OIG, state Medicaid, SAM (if applicable), OFAC",
          "Billing and RCM vendors → OIG, SAM, OFAC, state lists where they touch claims",
          "Pure facilities vendors → risk-based; often COI-heavy, exclusion-light unless contract requires",
          "Staffing agencies → screen agency and placed workers; verify agency's own program",
        ],
      },
      {
        heading: "Operational ownership",
        body: "Compliance usually owns the policy; HR owns employee screening; procurement or AP owns vendor screening. Without a named owner per list and relationship type, gaps appear at handoffs — especially for locums, agency nurses, and new billing companies added mid-year.",
      },
    ],
  }),

  guide({
    slug: "how-to-screen-vendors-against-sam-gov",
    title: "How to Screen Vendors Against SAM.gov",
    summary:
      "How U.S. healthcare and government-funded organizations search SAM.gov exclusions before engaging vendors and grant partners.",
    answer:
      "Search SAM.gov for the vendor's legal name and DUNS or UEI before contract execution or first payment. Review active exclusions, debarments, and suspensions — not just registration status. Record the search date and result, and re-screen on the same schedule as OIG checks for vendors touching federal funds.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "oig-sam-and-ofac-what-healthcare-providers-must-screen",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["sam-exclusion"],
    faqs: [
      {
        q: "Is SAM registration the same as SAM exclusion screening?",
        a: "No. Registration confirms an entity can do business with the federal government. Exclusion screening checks whether the entity is debarred or suspended — a vendor can be registered and still excluded.",
      },
    ],
    sections: [
      {
        heading: "What SAM.gov exclusions cover",
        body: "SAM.gov consolidates federal exclusion records from agencies that award contracts and certain assistance programs. A debarred vendor cannot receive federal contracts or subcontracts during the exclusion period. For healthcare, this matters for hospitals with federal grants, vendors subcontracting on government healthcare work, and nonprofits receiving HHS funding.",
      },
      {
        heading: "Who to screen",
        body: "Screen prime vendors, subcontractors, and individuals with substantial involvement in federally funded work. Billing companies, EHR implementers on grant-funded projects, and construction firms on federally financed hospital expansions are common SAM screening targets.",
      },
      {
        heading: "How to search",
        body: "Use the SAM.gov search and Exclusions API or the public search interface. Search legal entity name, former names, and — when available — UEI (Unique Entity Identifier). Entity records may list excluded persons linked to the organization. Document every name variant searched.",
      },
      {
        heading: "SAM vs OIG — do not conflate them",
        body: "A vendor cleared on OIG may still be debarred on SAM, and the reverse is also true. Healthcare providers focused only on LEIE miss SAM exposure on the federal contracting side. Your vendor compliance checklist should list both explicitly.",
      },
      {
        heading: "Flow-down to subcontractors",
        body: "Federal acquisition regulations require contractors to flow down exclusion certifications to subcontractors. If you are the prime, you are responsible for verifying subs — not accepting a one-line rep in a proposal. If you are a sub to a hospital or government entity, expect SAM certification requests in onboarding packets.",
      },
      {
        heading: "Evidence to retain",
        body: "Save search date, entity name, identifiers used, exclusion status, and screenshot or system export. Tie the record to the vendor master file and refresh on your re-screening calendar — typically monthly or quarterly for high-risk healthcare vendors.",
      },
    ],
  }),

  guide({
    slug: "how-to-check-state-medicaid-exclusion-lists",
    title: "How to Check State Medicaid Exclusion Lists",
    summary:
      "Why state Medicaid exclusion lists matter for U.S. providers — and how to screen employees and vendors when OIG alone is not enough.",
    answer:
      "Identify which state Medicaid programs your organization bills or where your patients and vendors operate, then search each applicable state exclusion or sanction list using legal names and aliases. State exclusions do not always appear on the OIG LEIE immediately. Document every search with date and result, and include state checks in your employee and vendor re-screening schedule.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "oig-sam-and-ofac-what-healthcare-providers-must-screen",
      "how-to-screen-employees-for-exclusions",
      "how-to-screen-vendors-against-the-oig-list",
    ],
    relatedGlossary: ["oig-exclusion", "sam-exclusion"],
    faqs: [
      {
        q: "Do I need every state if we only operate in one?",
        a: "Screen the state(s) where you bill Medicaid and where vendors perform services. Multi-state telehealth and locum programs often need multiple state lists.",
      },
      {
        q: "Where do I find state lists?",
        a: "Most states publish a Medicaid exclusion or provider sanction list on their health department or Medicaid agency site. Some participate in multistate data sharing, but do not assume one search covers all states.",
      },
    ],
    sections: [
      {
        heading: "Why state lists exist separately from OIG",
        body: "States administer Medicaid and can exclude providers for fraud, abuse, licensing violations, or patient harm — sometimes before or instead of federal action. Payer contracts and state survey requirements increasingly ask for proof of state list screening, not just OIG.",
      },
      {
        heading: "Which states to check",
        body: "At minimum, screen the state where your organization is licensed and bills Medicaid. Also consider states where remote staff are licensed, where agency nurses are placed, and where billing vendors process claims. Telehealth expanded this footprint for many practices.",
      },
      {
        heading: "Employees vs vendors",
        body: "Apply state screening to licensed clinicians, billing staff touching state claims, and vendors performing Medicaid-billable services. A physician excluded in one state may still hold privileges elsewhere until action propagates — state checks catch gaps OIG timing misses.",
      },
      {
        heading: "Operational challenges",
        body: "There is no single federal portal for all state lists. Formats vary — some states offer searchable databases, others publish PDF bulletins. Manual programs often skip states beyond the home state; that is a common audit finding for regional health systems and staffing firms.",
      },
      {
        heading: "Reduce false positives",
        body: "Like OIG, state lists are name-based. Compare NPI, license number, date of birth, or address when resolving potential matches. Document false-positive dispositions with the identifiers you compared.",
      },
      {
        heading: "Integrate with onboarding",
        body: "Add state list checks to the same vendor packet gate as OIG — no PO, no system access, no schedule until complete. For employees, run state checks at hire and on the same re-screen cadence as federal lists.",
      },
    ],
  }),

  guide({
    slug: "what-are-civil-monetary-penalties-for-excluded-parties",
    title: "What Are Civil Monetary Penalties for Excluded Parties?",
    summary:
      "What U.S. healthcare organizations risk when they employ or pay excluded individuals or entities — and why continuous screening is cheaper than a CMP.",
    answer:
      "Under federal law, healthcare organizations that employ or contract with excluded parties and bill federal programs can face civil monetary penalties of up to tens of thousands of dollars per item or service, plus program exclusion and repayments. Penalties apply per violation and per day in some cases. Continuous OIG and state screening with dated evidence is the primary operational defense.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "how-to-screen-employees-for-exclusions",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Can we bill if an excluded employee only does non-clinical work?",
        a: "If the excluded individual furnishes items or services — directly or indirectly — connected to federal program claims, exposure exists. Legal should assess role scope; many organizations prohibit any federal-program-tied work for excluded individuals.",
      },
    ],
    sections: [
      {
        heading: "The legal baseline",
        body: "The OIG has authority to exclude individuals and entities from federal healthcare programs. The Social Security Act prohibits payment for items or services furnished by excluded parties. When a provider knowingly employs or contracts with an excluded person, OIG can impose civil monetary penalties and assessments.",
      },
      {
        heading: "How penalties accumulate",
        body: "CMP exposure is often calculated per claim, per day of employment, or per service — not as a one-time fine. A billing specialist excluded but still processing Medicare claims for six months can generate substantial per-item liability. News releases on OIG enforcement routinely cite five- and six-figure settlements for excluded-employee situations.",
      },
      {
        heading: "Beyond fines — program risk",
        body: "CMPs are not the only consequence. Organizations may face mandatory repayments, corporate integrity agreements, loss of billing privileges, and reputational damage with payers. For small practices, a single enforcement action can threaten viability.",
      },
      {
        heading: "Knowingly vs neglect",
        body: "Enforcement considers whether the organization knew or should have known about the exclusion. 'We forgot to check' is not a defense that eliminates exposure — especially when payers and CMS expect monthly screening. Dated screening logs demonstrate reasonable diligence; absence of logs suggests neglect.",
      },
      {
        heading: "Vendor and staffing agency scenarios",
        body: "Using an excluded billing company, home health agency, or staffing firm creates similar exposure if their staff touch federal claims on your behalf. Contractual indemnities help but do not replace your screening obligation — payers hold the billing provider responsible.",
      },
      {
        heading: "What compliance programs should do",
        body: "Written policy, hire and vendor gates, monthly or quarterly re-screening, documented match resolution, and immediate remediation when a hit is confirmed. The cost of automated screening is trivial compared to a single CMP matter.",
      },
    ],
  }),

  guide({
    slug: "how-to-prepare-for-a-cms-exclusion-screening-audit",
    title: "How to Prepare for a CMS Exclusion Screening Audit",
    summary:
      "What Medicare and Medicaid providers should have ready when surveyors or payers ask for proof of OIG and exclusion screening.",
    answer:
      "Before a CMS or payer review, assemble dated screening records for a sample of employees and vendors, your written exclusion policy, re-screening schedule by risk tier, match-resolution documentation, and evidence that overdue checks trigger holds. Surveyors want proof the program runs continuously — not a folder of onboarding screenshots.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "how-to-document-exclusion-screening",
      "how-often-to-re-screen-for-exclusions",
      "how-to-screen-employees-for-exclusions",
      "how-to-prepare-for-a-compliance-audit",
    ],
    relatedGlossary: ["oig-exclusion", "audit-trail"],
    faqs: [
      {
        q: "What sample size will auditors use?",
        a: "Varies by survey type — expect requests for all new hires in a period plus a sample of active staff and high-risk vendors. Have the full population exportable, not just samples you curate.",
      },
    ],
    sections: [
      {
        heading: "What triggers the request",
        body: "CMS conditions of participation, accreditation surveys, Medicaid managed care audits, and corporate integrity agreements all reference exclusion screening. Requests may arrive as pre-survey document lists, desk reviews, or on-site interviews with HR and compliance.",
      },
      {
        heading: "Documents to prepare in advance",
        body: "Do not wait for the survey letter.",
        bullets: [
          "Written exclusion screening policy with list sources and frequencies",
          "Screening logs for employees and vendors with dates and dispositions",
          "Match investigation records for any potential hits",
          "Evidence of re-screening — not just initial hire checks",
          "Training records showing HR and procurement know the process",
          "Remediation records if an exclusion was discovered",
        ],
      },
      {
        heading: "Employee vs vendor samples",
        body: "Surveyors often split requests: all employees hired since the last survey, plus contractors and volunteers in patient care or billing roles. For vendors, expect billing companies, therapy agencies, locum firms, and IT vendors with claims access — not just janitorial services.",
      },
      {
        heading: "Common survey findings",
        body: "Gaps that generate deficiencies: screening only at hire, no state list checks, missing locum or agency workers, no policy, screening delegated to agencies without verification, and inability to produce logs within the requested date range.",
      },
      {
        heading: "Run an internal mock audit",
        body: "Thirty days before accreditation renewal, pull a random sample of 20 employees and 20 vendors. Can you produce a complete screening history for each within an hour? If not, fix the workflow before surveyors arrive.",
      },
      {
        heading: "Day-of survey logistics",
        body: "Assign one compliance owner to respond to screening requests. Use exports from your monitoring system — not ad-hoc email searches. If a record is missing, document corrective action taken and when screening was backfilled.",
      },
    ],
  }),

  guide({
    slug: "how-to-screen-medical-staffing-vendors-for-exclusions",
    title: "How to Screen Medical Staffing Vendors for Exclusions",
    summary:
      "How hospitals, clinics, and staffing firms screen agency placements against OIG, state, and SAM lists before they touch patients or claims.",
    answer:
      "Screen the staffing agency as a vendor and each placed clinician before start — OIG LEIE, applicable state Medicaid lists, and SAM where federal contracts apply. Do not accept agency attestations without your own dated checks. Re-screen travelers and locums on the same cadence as direct employees because exclusions can occur mid-assignment.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "how-to-screen-employees-for-exclusions",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-check-state-medicaid-exclusion-lists",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Whose job is it — the hospital or the agency?",
        a: "Both may have contractual obligations, but the billing provider and hiring facility typically retain survey liability. Hospitals should verify, not rely on agency PDFs alone.",
      },
    ],
    sections: [
      {
        heading: "Why staffing is high risk",
        body: "Travel nurses, locum physicians, and allied health contractors rotate frequently, often across states. Exclusions may post after credentialing. Agency workers touch patients and charts on day one — if they are excluded, federal program liability attaches to the facility using them.",
      },
      {
        heading: "Screen the agency and the individual",
        body: "The agency is a vendor — check OIG, SAM, and OFAC on the entity. Each placement is an individual — run LEIE and state lists on legal name, maiden names, and aliases before schedule release. Contract should require agency notification within 24 hours if a worker becomes excluded.",
      },
      {
        heading: "Credentialing vs exclusion screening",
        body: "Credentialing verifies licenses and training; exclusion screening verifies federal and state program eligibility. They are related but not interchangeable. A licensed nurse can still be OIG-excluded. Both checks must complete before patient contact.",
      },
      {
        heading: "High-volume onboarding",
        body: "Staffing firms placing hundreds of workers per month need automated screening at offer and monthly re-check — manual LEIE searches do not scale. Hospitals receiving agency workers should require screening certificates with search dates, not annual letters.",
      },
      {
        heading: "Mid-assignment exclusions",
        body: "OIG updates monthly. A traveler cleared in January can be excluded in March. Re-screen agency staff on the same monthly or quarterly cycle as employees. Immediate removal from schedule if a hit is confirmed.",
      },
      {
        heading: "Contract language to require",
        body: "Include obligations for pre-placement screening, continuous monitoring, immediate notification of exclusions, indemnification for false attestations, and right to audit agency screening logs. Operations only works if legal embeds these in the MSA.",
      },
    ],
  }),

  guide({
    slug: "how-to-add-exclusion-screening-to-vendor-onboarding",
    title: "How to Add Exclusion Screening to Vendor Onboarding",
    summary:
      "How U.S. healthcare operations teams gate vendor onboarding until OIG, SAM, and state exclusion checks are complete.",
    answer:
      "Add exclusion screening as a hard gate in your vendor packet — alongside W-9 and COI — before contract signature, system access, or first payment. Define which lists apply by vendor type, assign an owner, block PO creation until clear, and schedule re-screening at onboarding time. Document every check on the vendor record.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "vendor-compliance-checklist",
      "how-to-screen-vendors-against-the-oig-list",
      "oig-sam-and-ofac-what-healthcare-providers-must-screen",
    ],
    relatedGlossary: ["oig-exclusion", "sam-exclusion"],
    sections: [
      {
        heading: "Where screening fits in the packet",
        body: "Standard healthcare vendor onboarding collects W-9, COI, BAA for PHI vendors, and contracts. Exclusion screening should run in parallel — not after go-live. Billing vendors, labs, therapy companies, and software with claims access are Tier 1 and should not receive credentials until screening clears.",
      },
      {
        heading: "Define tiers by vendor type",
        body: "Not every office supply vendor needs monthly OIG checks. Tier vendors by federal program touchpoint.",
        bullets: [
          "Tier 1 — claims, PHI, clinical services: full OIG, state, SAM, OFAC before access",
          "Tier 2 — facilities with site access: OIG + COI, annual or quarterly re-screen",
          "Tier 3 — administrative, no patient contact: risk assessment documented annually",
        ],
      },
      {
        heading: "System gates that enforce policy",
        body: "Policy without system holds fails under volume. Configure ERP, vendor master, and identity tools to block new vendors in 'pending compliance' status. AP should not be able to issue a check to a vendor without a completed screening record.",
      },
      {
        heading: "Owners and SLAs",
        body: "Compliance or procurement typically owns screening; AP owns payment block. Set an SLA — for example, screening completes within two business days of vendor request — so clinical projects are not delayed by unclear ownership.",
      },
      {
        heading: "Set re-screening at intake",
        body: "When you onboard, schedule the next OIG and state check — do not wait until someone asks at audit time. The vendor record should show onboarding check plus every subsequent re-screen in one timeline.",
      },
      {
        heading: "Tie to the vendor compliance checklist",
        body: "Use one checklist for W-9, COI, exclusions, and contracts so nothing slips through because different teams own different attachments. Export the complete packet when legal or a payer requests vendor due diligence.",
      },
    ],
  }),

  guide({
    slug: "how-to-resolve-an-oig-list-match",
    title: "How to Resolve an OIG List Match",
    summary:
      "A step-by-step process for U.S. compliance teams when a vendor or employee name appears on the OIG LEIE.",
    answer:
      "Treat every OIG match as a hold — stop onboarding, payment, or scheduling until resolved. Compare identifiers such as date of birth, NPI, address, and SSN last four to rule out false positives. If the match is confirmed, do not engage the party in federal-program work, escalate to legal, document remediation, and retain all search and investigation records.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-document-exclusion-screening",
      "what-are-civil-monetary-penalties-for-excluded-parties",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "A common name matched — can we proceed?",
        a: "Only after documented false-positive resolution comparing available identifiers. 'Probably not the same person' without evidence is not sufficient for auditors.",
      },
    ],
    sections: [
      {
        heading: "Immediate actions",
        body: "Place the relationship on hold: no patient contact, no system access, no payments. Notify compliance and HR leadership. Preserve the search result exactly as it appeared — do not re-run and overwrite before saving evidence.",
      },
      {
        heading: "False positive investigation",
        body: "OIG LEIE entries include exclusion type, date, and sometimes general location. Compare against your subject's date of birth, NPI, UPIN legacy identifiers, address history, and employer at time of exclusion. Document each comparison in writing.",
      },
      {
        heading: "When the match is confirmed",
        body: "Terminate or decline engagement. For employees, follow HR termination procedures and legal review of self-disclosure obligations. For vendors, notify procurement and AP to block payment. Assess whether any federal claims were submitted during the exclusion period — repayments may apply.",
      },
      {
        heading: "Partial matches and entities",
        body: "Entity matches require checking owners and principals. A clean entity name with an excluded owner may still be problematic depending on role and federal program touchpoints. Legal should advise on ownership structures.",
      },
      {
        heading: "Communication",
        body: "Limit internal communication to need-to-know. Do not alert the subject in ways that create retaliation or evidence destruction risk before legal counsel advises. External communication with payers or OIG may be required in confirmed cases.",
      },
      {
        heading: "Close the loop in the audit trail",
        body: "Final record should include initial hit, investigation steps, disposition (false positive or confirmed), approver, and date. Future auditors will read this chain — make it complete.",
      },
    ],
  }),
];
