import type { GuideArticleSpec } from "../create-guide";

export const oigPhase1Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-search-the-oig-leie-database",
    cluster: "oig",
    title: "How to Search the OIG LEIE Database",
    summary:
      "Step-by-step guidance for U.S. healthcare compliance teams searching the OIG List of Excluded Individuals and Entities (LEIE) online.",
    answer:
      "The OIG LEIE database is the authoritative federal source for healthcare program exclusions. Search using each party's legal name first, then repeat with known aliases, DBAs, and maiden names. OIG matching is name-based — partial or misspelled names miss hits. Record the search date, the list download date shown on the site, every name variant checked, and the result. A single clear search at onboarding is not sufficient; exclusions are added continuously, so tie each search to your re-screening schedule and retain evidence auditors can reconstruct months later.",
    primaryKeyword: "oig leie database search",
    relatedGuideSlugs: [
      "what-is-the-oig-leie-list",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-document-exclusion-screening",
      "how-to-resolve-an-oig-list-match",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Is the OIG LEIE search free?",
        a: "Yes. The OIG publishes the LEIE online at no cost. You can search individual names or download the full list for batch screening. Many organizations supplement manual searches with automated tools that log results.",
      },
      {
        q: "Should I search by first name only?",
        a: "No. Search the full legal name as it appears on the W-9, contract, or credentialing file. Repeat with aliases and variations. First-name-only searches produce excessive false positives and miss entity matches.",
      },
      {
        q: "How often is the LEIE updated?",
        a: "OIG updates the LEIE monthly, but exclusions can be effective before the list reflects them. Search at onboarding and re-screen on your defined schedule — monthly or quarterly is common for healthcare providers.",
      },
      {
        q: "Can I rely on a third-party vendor's OIG check?",
        a: "You can accept vendor attestation as a starting point, but CMS and payer auditors typically expect your organization to maintain its own dated search records. Verify rather than assume.",
      },
    ],
    sections: [
      {
        heading: "Where to access the LEIE",
        body: "The U.S. Department of Health and Human Services Office of Inspector General hosts the LEIE on its public website. You can run individual name searches or download the full exclusion file for offline or batch matching. Bookmark the official OIG URL — not third-party mirrors — so your audit trail references the correct source.",
      },
      {
        heading: "Names and identifiers to search",
        body: "Start with the legal name on tax and contract documents. Then search known DBAs, former names, and common misspellings. For individuals, include suffixes and maiden names when applicable. For entities, search the registered business name and any trade names. When available, cross-reference NPI, date of birth, or address against a potential match to resolve false positives.",
        bullets: [
          "Legal name from W-9 or contract",
          "DBAs and trade names",
          "Former or maiden names for individuals",
          "Key owners and officers for small entities when policy requires",
        ],
      },
      {
        heading: "Individual search vs. full list download",
        body: "Individual online searches work for onboarding one vendor or employee at a time. Downloading the full LEIE file supports batch screening across your vendor master or payroll roster. Either approach is valid — what matters is consistent methodology, dated results, and retained evidence. Many compliance teams combine both: download for scheduled re-screens, individual search for ad hoc checks.",
      },
      {
        heading: "Common search mistakes",
        body: "Teams miss exclusions when they search nicknames instead of legal names, skip alias variations, or assume a prior clear result still holds. Another frequent gap: screening the company name but not individual owners of sole proprietorships or small LLCs who perform billable work. Document every name variant you checked, not just the final disposition.",
      },
      {
        heading: "What to record for each search",
        body: "Each LEIE search should produce an audit-ready record: party screened, date and time of search, LEIE list version or download date, names searched, result (clear, potential match, confirmed match), and reviewer identity. Manual screenshots in email fail at scale — use a structured log or screening workflow that captures these fields automatically.",
      },
      {
        heading: "Integrate LEIE search into your workflow",
        body: "Do not treat OIG database search as a one-off compliance task. Embed it in vendor onboarding, contractor credentialing, and employee hire checklists. Block payment or system access until the initial search completes. Schedule recurring re-searches so exclusions added after onboarding are caught before claims or payments flow.",
      },
    ],
  },
  {
    slug: "what-is-the-oig-leie-list",
    cluster: "oig",
    title: "What Is the OIG LEIE List?",
    summary:
      "What the OIG List of Excluded Individuals and Entities (LEIE) is, who appears on it, and why U.S. healthcare providers must screen against it.",
    answer:
      "The LEIE — List of Excluded Individuals and Entities — is the federal register of parties excluded from participating in Medicare, Medicaid, and other HHS-funded programs. OIG maintains it under authority of sections 1128 and 1156 of the Social Security Act. Exclusions result from convictions, licensing actions, program-related fraud, and other conduct OIG determines warrants barring federal healthcare program participation. Appearing on the LEIE means a party cannot furnish items or services billed to federal programs, and providers who employ or contract with excluded parties face civil monetary penalties. Screening the LEIE before engagement and on a recurring schedule is a baseline compliance obligation for U.S. healthcare organizations.",
    primaryKeyword: "oig leie list",
    relatedGuideSlugs: [
      "how-to-search-the-oig-leie-database",
      "how-to-screen-vendors-against-the-oig-list",
      "what-are-civil-monetary-penalties-for-excluded-parties",
      "oig-sam-and-ofac-what-healthcare-providers-must-screen",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "What does LEIE stand for?",
        a: "LEIE stands for List of Excluded Individuals and Entities. It is maintained by the HHS Office of Inspector General and is the primary federal healthcare exclusion list.",
      },
      {
        q: "Is the LEIE the same as a state Medicaid exclusion list?",
        a: "No. State Medicaid programs maintain separate exclusion lists. A party can appear on a state list but not the LEIE, or vice versa. Healthcare providers typically screen both.",
      },
      {
        q: "How long does an OIG exclusion last?",
        a: "Mandatory minimum exclusion periods apply for certain offenses — often five years for many convictions. Some exclusions are permanent. Reinstatement requires applying to OIG after the exclusion term ends.",
      },
      {
        q: "Does LEIE cover non-healthcare businesses?",
        a: "The LEIE covers exclusions from HHS-funded programs, which is primarily healthcare. However, any vendor or contractor your organization pays to perform services tied to Medicare or Medicaid billing should be screened.",
      },
    ],
    sections: [
      {
        heading: "What the LEIE is and who maintains it",
        body: "The U.S. Department of Health and Human Services Office of Inspector General publishes and maintains the LEIE. It lists individuals and entities OIG has excluded from participation in federal healthcare programs. The list is public, updated regularly, and searchable online or via downloadable file.",
      },
      {
        heading: "Why parties are excluded",
        body: "Exclusions follow convictions for program-related crimes, patient abuse, licensing board actions, default on health education loans, and other grounds defined in statute and regulation. OIG can exclude providers who pose a risk to beneficiaries or program integrity. The LEIE is not a criminal database — it is an administrative bar on federal healthcare program participation.",
        bullets: [
          "Medicare or Medicaid fraud convictions",
          "Patient abuse or neglect",
          "Licensing revocations or suspensions",
          "Controlled substance violations",
          "Default on federal health education loans",
        ],
      },
      {
        heading: "What exclusion means in practice",
        body: "An excluded party cannot furnish items or services payable by federal healthcare programs. That includes direct patient care, billing services, administrative work tied to claims, and subcontracted services performed on your behalf. Your organization cannot employ or contract with an excluded party for work connected to federal program funds without triggering significant penalty exposure.",
      },
      {
        heading: "LEIE vs. other screening lists",
        body: "The LEIE is specific to HHS healthcare program exclusions. It does not cover OFAC sanctions, SAM debarments, or state Medicaid exclusions. A comprehensive healthcare compliance program screens multiple lists because a party can appear on one and not others. See also guidance on combined OIG, SAM, and OFAC screening requirements.",
      },
      {
        heading: "Who must screen against the LEIE",
        body: "Medicare and Medicaid providers, managed care organizations, hospitals, physician groups, home health agencies, and any entity receiving or administering federal healthcare funds should screen employees, contractors, vendors, and subcontractors against the LEIE. Payer credentialing agreements and CMS conditions of participation reinforce this obligation.",
      },
    ],
  },
  {
    slug: "how-to-screen-contractors-for-oig-exclusions",
    cluster: "oig",
    title: "How to Screen Contractors for OIG Exclusions",
    summary:
      "How U.S. healthcare organizations screen independent contractors and 1099 workers against the OIG LEIE at hire and on a recurring schedule.",
    answer:
      "Independent contractors who perform billable or program-connected work are subject to the same OIG exclusion rules as employees. Screen every contractor before engagement using legal name and aliases against the LEIE and applicable state Medicaid lists. Medical directors, locum tenens, billing consultants, and IT contractors with claims system access all require screening — not just clinicians at the bedside. Document each check with date, list source, and result. Re-screen on your organization's schedule because a contractor cleared at contract signing can be excluded later. Treat agency attestations as supplemental, not a substitute for your own dated search records.",
    primaryKeyword: "screen contractors oig",
    relatedGuideSlugs: [
      "how-to-screen-employees-for-exclusions",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-subcontractors-against-oig",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Are 1099 contractors treated the same as employees for OIG screening?",
        a: "Yes, for exclusion purposes. If a contractor performs services connected to federal healthcare program billing or operations, you must screen them regardless of employment classification.",
      },
      {
        q: "Do I need to screen contractors who only work remotely?",
        a: "Remote work does not reduce exclusion exposure. If the contractor touches billing, coding, care delivery, or systems tied to federal programs, screen them.",
      },
      {
        q: "What if the contractor is placed through a staffing agency?",
        a: "Request exclusion clearance documentation from the agency, but verify with your own LEIE search. Ultimate compliance responsibility often remains with the hiring organization.",
      },
      {
        q: "When should contractor screening happen?",
        a: "Before contract execution or first payment — whichever comes first. Re-screen on the schedule defined in your compliance policy, typically monthly or quarterly for high-risk roles.",
      },
    ],
    sections: [
      {
        heading: "Why contractors are in scope",
        body: "Federal law prohibits payment for items or services furnished by excluded individuals — regardless of whether they are W-2 employees or 1099 contractors. Medical directors paid as contractors, per-diem nurses, coding consultants, and revenue cycle freelancers all create exclusion exposure if not screened.",
      },
      {
        heading: "Which contractors to prioritize",
        body: "Apply risk-based prioritization but do not assume non-clinical contractors are exempt.",
        bullets: [
          "Physicians and advanced practice providers on contract",
          "Locum tenens and per-diem clinical staff",
          "Billing, coding, and revenue cycle consultants",
          "IT contractors with EHR or claims system access",
          "Administrative contractors supporting enrollment or credentialing",
        ],
      },
      {
        heading: "How to search contractors on the LEIE",
        body: "Use the contractor's legal name as it appears on the contract and tax documents. Search aliases, former names, and professional names used in practice. For contractors operating through an entity, search both the business name and the individual performing the work when your policy requires principal screening.",
      },
      {
        heading: "Contractor onboarding checklist",
        body: "Embed OIG screening in your contractor intake process alongside credentialing, contract review, and system provisioning. Block system access and payment until screening completes and is documented. Include re-screening obligations in contract language so contractors expect periodic checks throughout the relationship.",
      },
      {
        heading: "Handling confirmed exclusions",
        body: "Do not allow an excluded contractor to perform services connected to federal healthcare programs. Terminate or suspend the engagement immediately, notify compliance and legal, and document the timeline. Retain all screening records showing when the exclusion appeared relative to the contract start date.",
      },
      {
        heading: "Re-screening contractors on schedule",
        body: "Contractors excluded after onboarding are a common audit finding. Schedule recurring LEIE checks aligned with your employee screening cadence — monthly or quarterly for high-risk contractors. Automated re-screening prevents gaps when compliance teams turnover or contractor rosters grow.",
      },
    ],
  },
  {
    slug: "how-to-screen-billing-vendors-for-oig-exclusions",
    cluster: "oig",
    title: "How to Screen Billing Vendors for OIG Exclusions",
    summary:
      "How U.S. healthcare providers screen revenue cycle, coding, and billing vendors against the OIG LEIE before engagement and on a recurring basis.",
    answer:
      "Billing vendors — including coding companies, revenue cycle outsourcers, clearinghouses, and claims submission services — sit at the center of federal healthcare program payment flows. Screen every billing vendor and its key principals against the OIG LEIE before contract execution and first payment. Search legal entity names, DBAs, and individual owners or officers when your policy requires. Billing vendors excluded after onboarding can taint every claim they touch, creating civil monetary penalty exposure for your organization. Document each search with date, list version, and result, then re-screen monthly or quarterly depending on your risk tier. A billing vendor's own attestation does not replace your dated search evidence.",
    primaryKeyword: "screen billing vendors oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-document-exclusion-screening",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do clearinghouses need OIG screening?",
        a: "Yes, if they handle claims submission or payment data for Medicare or Medicaid. Any vendor in the claims chain that could be excluded creates compliance exposure for the provider.",
      },
      {
        q: "Should I screen offshore billing vendors?",
        a: "Yes. Geographic location does not exempt a vendor from exclusion rules if they perform services connected to U.S. federal healthcare program billing.",
      },
      {
        q: "What about software vendors with billing modules?",
        a: "Screen vendors whose staff access your claims systems, perform coding services, or submit claims on your behalf. Pure SaaS licensing without service delivery may sit in a lower tier — document your risk assessment.",
      },
      {
        q: "How often should billing vendors be re-screened?",
        a: "Monthly or quarterly is standard for billing vendors given their direct claims exposure. Align frequency with your highest-risk vendor tier.",
      },
    ],
    sections: [
      {
        heading: "Why billing vendors carry high exclusion risk",
        body: "Revenue cycle vendors submit claims, assign codes, and interact with payers on your behalf. An excluded billing vendor performing these services violates federal payment rules and can expose your organization to civil monetary penalties for each claim affected. Billing vendor screening is among the highest-priority checks in a healthcare exclusion program.",
      },
      {
        heading: "Which billing vendors to screen",
        body: "Screen any third party that touches the claims lifecycle.",
        bullets: [
          "Revenue cycle management companies",
          "Medical coding and audit firms",
          "Claims clearinghouses and submission vendors",
          "Denial management and appeals services",
          "Prior authorization and utilization management vendors",
        ],
      },
      {
        heading: "Entity and principal screening",
        body: "Search the vendor's legal business name and all known DBAs. For small coding shops and sole proprietorships, also screen the individual owner. OIG exclusions attach to both individuals and entities — a clean entity name with an excluded principal still creates exposure if that person performs billable work.",
      },
      {
        heading: "Vendor onboarding controls",
        body: "Include OIG screening in your vendor onboarding packet alongside W-9 collection and business associate agreements. Do not grant access to billing systems or PHI until screening completes. Contract language should require vendors to notify you of any exclusion action against the entity or its personnel.",
      },
      {
        heading: "Ongoing monitoring for billing relationships",
        body: "Initial clearance at contract signing is the floor, not the ceiling. Re-screen billing vendors on your defined schedule and immediately upon ownership changes, mergers, or key personnel turnover. Exclusions added mid-contract are a leading source of audit findings in outsourced billing relationships.",
      },
    ],
  },
  {
    slug: "what-to-do-when-oig-screening-finds-a-match",
    cluster: "oig",
    title: "What to Do When OIG Screening Finds a Match",
    summary:
      "How U.S. healthcare compliance teams investigate, escalate, and resolve potential OIG LEIE matches without creating payment or employment exposure.",
    answer:
      "A name match on the OIG LEIE is not automatic confirmation of exclusion — common names produce false positives. Stop payment and engagement activities while you investigate. Compare identifiers: date of birth, address, NPI, specialty, and exclusion effective date against your party records. If identifiers align, treat it as a confirmed match: do not employ, contract with, or pay the party for federal program-connected work, escalate to compliance and legal, and document every step. If identifiers clearly differ, document the false-positive disposition with the evidence you compared. Never proceed on verbal assurance alone — auditors expect a written resolution trail tied to the screening record.",
    primaryKeyword: "oig screening match",
    relatedGuideSlugs: [
      "how-to-resolve-an-oig-list-match",
      "how-to-document-exclusion-screening",
      "what-are-civil-monetary-penalties-for-excluded-parties",
      "how-to-search-the-oig-leie-database",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Should I terminate someone based on a name match alone?",
        a: "No. Investigate first. A name match requires identifier comparison before you confirm exclusion. However, hold payment and billable work during investigation to limit exposure.",
      },
      {
        q: "What identifiers help resolve false positives?",
        a: "Date of birth, home or business address, NPI, UPIN, general or specialty type, and exclusion effective date are the most useful LEIE fields for comparison.",
      },
      {
        q: "Who should investigate a potential match?",
        a: "Compliance or a designated screening analyst performs initial review. Confirmed matches escalate to compliance leadership and legal. HR or vendor management executes holds on employment or payment.",
      },
      {
        q: "Do we need to self-disclose if we find a confirmed exclusion?",
        a: "Self-disclosure obligations depend on circumstances, payer contracts, and how long the excluded party performed services. Legal counsel should assess promptly — do not delay the hold while deciding.",
      },
      {
        q: "Can we keep an excluded employee in a non-billable role?",
        a: "Possibly, with legal guidance — but the role must have zero connection to federal healthcare program items or services. Document the role restriction and monitor compliance.",
      },
    ],
    sections: [
      {
        heading: "First response: hold, do not ignore",
        body: "When screening returns a potential LEIE match, place an immediate hold on payment, onboarding completion, or system access for billable roles. Continuing to pay or engage while you figure it out later creates daily penalty exposure. Notify the compliance owner and document the hold timestamp.",
      },
      {
        heading: "Investigating false positives",
        body: "Compare LEIE entry fields against your vendor or employee record. Different dates of birth, states, NPIs, or addresses often confirm a false positive. Capture screenshots or export the LEIE entry and your internal record side by side. Write a disposition note explaining why the match was rejected.",
      },
      {
        heading: "Confirming a true match",
        body: "When identifiers align, treat the match as confirmed. Cease all federal program-connected work immediately. Do not wait for OIG written confirmation — the LEIE publication is the authoritative source. Escalate to legal for assessment of self-disclosure, payer notification, and claim impact.",
      },
      {
        heading: "Documentation auditors expect",
        body: "Every match investigation needs a record independent of the initial search: match date, LEIE entry reviewed, identifiers compared, disposition (false positive or confirmed), reviewer name, and date closed. 'We checked and it was fine' without detail fails under CMS or payer audit scrutiny.",
      },
      {
        heading: "Preventing repeat match confusion",
        body: "After resolving a false positive, link the disposition to the party's master record so future re-screens do not trigger redundant investigations. For confirmed exclusions, flag the record permanently and block re-engagement unless OIG reinstatement is documented.",
      },
    ],
  },
  {
    slug: "how-to-schedule-monthly-oig-screening",
    cluster: "oig",
    title: "How to Schedule Monthly OIG Screening",
    summary:
      "How U.S. healthcare compliance teams set up and enforce monthly OIG LEIE re-screening for employees, vendors, and contractors.",
    answer:
      "Monthly OIG screening is the standard cadence for high-risk healthcare relationships — employees, billing vendors, clinical contractors, and anyone touching federal program claims. Define monthly re-screening in your written compliance policy, assign responsible owners, and automate execution so the schedule survives staff turnover. Build a roster of all in-scope parties with last-screened dates, tier assignments, and overdue flags. Run LEIE checks against the current list version each cycle and log results to each party's master record. When a screen is overdue, enforce consequences: hold payment, suspend access, or escalate to compliance leadership. Manual calendar reminders fail at scale — use a workflow that triggers monthly batches and produces audit-ready evidence automatically.",
    primaryKeyword: "monthly oig screening",
    relatedGuideSlugs: [
      "how-often-to-re-screen-for-exclusions",
      "how-often-should-healthcare-providers-screen-oig",
      "how-to-document-exclusion-screening",
      "how-to-screen-vendors-against-the-oig-list",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Is monthly OIG screening required by CMS?",
        a: "CMS does not mandate a specific frequency in all contexts, but monthly screening is widely expected for providers subject to payer credentialing and CMS audit scrutiny. Your payer contracts may specify frequency.",
      },
      {
        q: "Can lower-risk vendors re-screen less often?",
        a: "Yes. Risk-based tiers are standard — monthly for high-risk, quarterly or semi-annually for lower tiers. Document the rationale for each tier in your policy.",
      },
      {
        q: "What happens if a monthly screen is missed?",
        a: "Treat overdue screens as a compliance gap. Hold payment or access for overdue high-risk parties until screening completes. Track and report overdue rates to compliance leadership.",
      },
      {
        q: "How do I screen hundreds of parties monthly?",
        a: "Download the LEIE file and batch-match against your roster, or use an automated exclusion monitoring tool that runs scheduled screens and logs results.",
      },
    ],
    sections: [
      {
        heading: "Why monthly screening matters",
        body: "OIG updates the LEIE monthly, and exclusions can be effective before list publication. A party cleared 90 days ago may now be excluded. Monthly re-screening closes the gap between list updates and your organization's exposure — especially for employees and vendors in direct claims or care delivery roles.",
      },
      {
        heading: "Define who gets monthly screens",
        body: "Assign monthly frequency to your highest-risk tier.",
        bullets: [
          "All employees in billable or patient-facing roles",
          "Billing and revenue cycle vendors",
          "Clinical contractors and locum staff",
          "Medical staffing agency placements",
          "Subcontractors performing services on your behalf",
        ],
      },
      {
        heading: "Build the screening calendar",
        body: "Pick a consistent day each month — for example, the first business day — and run all Tier 1 screens on that date. Align with LEIE publication timing when possible so you screen against the freshest list. Document the calendar in your compliance policy so auditors see a defined schedule, not ad hoc checks.",
      },
      {
        heading: "Assign ownership and escalation",
        body: "Name a compliance owner responsible for monthly execution and overdue escalation. Backup ownership prevents gaps during PTO or turnover. Define what happens when screens are late: automatic holds on payment, compliance committee notification, or vendor suspension.",
      },
      {
        heading: "Automate monthly batch screening",
        body: "Spreadsheet due dates and Outlook reminders depend on someone remembering. Automated exclusion monitoring runs monthly batches against your full roster, attaches results to each record, and flags overdue parties before they become audit findings. That is the difference between a policy and an operating control.",
      },
    ],
  },
  {
    slug: "how-to-export-oig-screening-evidence-for-auditors",
    cluster: "oig",
    title: "How to Export OIG Screening Evidence for Auditors",
    summary:
      "How U.S. healthcare compliance teams prepare and export OIG LEIE screening records for CMS, payer, and internal audits.",
    answer:
      "Auditors request proof that exclusion screening occurred on schedule — not verbal assurances. Export a structured report covering the audit period: every party screened, search dates, list sources, names searched, results, match dispositions, and reviewer identity. Tie each record to the vendor or employee master so reviewers can trace onboarding checks through recurring re-screens. Include overdue-screen exceptions and how they were resolved. CSV or PDF export from a screening log or monitoring tool is stronger than scattered email screenshots. Organize by date range, party type, or risk tier depending on the auditor's sample request. Retain exports with the audit response package and keep source records accessible for follow-up samples.",
    primaryKeyword: "oig screening evidence export",
    relatedGuideSlugs: [
      "how-to-document-exclusion-screening",
      "how-to-prepare-for-a-cms-exclusion-screening-audit",
      "how-to-schedule-monthly-oig-screening",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "What format do auditors prefer for screening evidence?",
        a: "Structured logs — CSV, PDF, or system-generated reports — beat unstructured email attachments. Include consistent fields across every record so reviewers can validate completeness.",
      },
      {
        q: "How far back should export cover?",
        a: "Match the auditor sample period, typically 12 to 36 months. Many healthcare organizations retain exclusion screening records for at least six years.",
      },
      {
        q: "Do I need to export match investigation records separately?",
        a: "Yes. Potential and confirmed matches should include disposition documentation — identifiers compared, outcome, and reviewer — as part of the export or as linked attachments.",
      },
      {
        q: "Can I redact employee or vendor data in exports?",
        a: "Provide enough identifying information for the auditor to verify the sample — usually legal name, role or vendor category, and screening dates. Follow your organization's data sharing policy policy for sensitive fields.",
      },
    ],
    sections: [
      {
        heading: "What auditors request",
        body: "CMS, state surveyors, and payer auditors typically ask for a sample of exclusion checks during a defined period. They want to verify screening happened before engagement, re-screening occurred on schedule, potential matches were investigated, and records are complete. Expect requests segmented by employees, vendors, or high-risk categories.",
      },
      {
        heading: "Minimum fields for export",
        body: "Every exported record should answer who, when, against what, with what result, and by whom.",
        bullets: [
          "Party name and identifier (employee ID or vendor number)",
          "Legal names and aliases searched",
          "Search date and time",
          "List source and version (OIG LEIE download date)",
          "Result: clear, potential match, or confirmed match",
          "Reviewer or system identity",
          "Match disposition notes when applicable",
        ],
      },
      {
        heading: "Organizing exports by audit scope",
        body: "Structure exports to match the auditor sample methodology. Date-range exports work for period-based reviews. Party-type exports (employees vs. vendors) work for targeted samples. Risk-tier exports demonstrate your risk-based program. Include a summary cover sheet with total parties screened, overdue exceptions, and confirmed matches during the period.",
      },
      {
        heading: "Common export failures",
        body: "Teams lose credibility when exports are incomplete: missing re-screens, no list version dates, only clear results without names searched, or evidence stored outside the system of record. Gaps in a sample often trigger expanded review — prepare complete exports the first time.",
      },
      {
        heading: "Using automated export from screening tools",
        body: "Manual assembly from spreadsheets and inbox screenshots does not scale and introduces errors. Exclusion monitoring tools that log every check produce one-click exports by date range, party, or result type. Use these for audit responses and internal compliance reporting.",
      },
    ],
  },
  {
    slug: "oig-exclusion-screening-for-medicaid-managed-care",
    cluster: "oig",
    title: "OIG Exclusion Screening for Medicaid Managed Care",
    summary:
      "How Medicaid managed care organizations (MCOs) screen employees, providers, and vendors against the OIG LEIE and state exclusion lists.",
    answer:
      "Medicaid managed care organizations sit at the intersection of federal funding and state program rules — exclusion screening obligations apply to the MCO, its network providers, downstream subcontractors, and vendors touching member care or claims. Screen all employees and contractors against the OIG LEIE and every state Medicaid exclusion list where the MCO operates or enrolls members. Provider network credentialing must include initial and recurring exclusion checks, not just license verification. Downstream entities — TPAs, care management vendors, transportation brokers — require the same screening rigor as direct employees. Document every check and export evidence for state contract compliance reviews and CMS audit requests. MCO-specific contracts often specify screening frequency — align your program with the strictest applicable requirement.",
    primaryKeyword: "medicaid managed care oig screening",
    relatedGuideSlugs: [
      "how-to-check-state-medicaid-exclusion-lists",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-prepare-for-a-cms-exclusion-screening-audit",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do MCOs screen network providers or rely on credentialing?",
        a: "MCOs must screen network providers as part of credentialing and re-credentialing. Relying on attestation without your own dated LEIE search creates contract and audit exposure.",
      },
      {
        q: "Which state lists must an MCO check?",
        a: "At minimum, every state where the MCO holds a Medicaid contract. Multi-state MCOs often screen 40 or more state lists in addition to the federal LEIE.",
      },
      {
        q: "Are downstream subcontractors the MCO's responsibility?",
        a: "Yes. MCOs are accountable for exclusion screening across their subcontractor chain when those parties perform services connected to the Medicaid contract.",
      },
      {
        q: "How often do state MCO contracts require re-screening?",
        a: "Varies by state — monthly, quarterly, or at re-credentialing cycles. Review each state contract and apply the most frequent requirement across your footprint.",
      },
    ],
    sections: [
      {
        heading: "MCO exclusion screening obligations",
        body: "Medicaid managed care organizations administer billions in federal-state funding. State Medicaid agencies and CMS expect MCOs to maintain exclusion screening programs covering employees, network providers, vendors, and downstream entities. Contractual terms often exceed generic healthcare provider expectations — read each state agreement carefully.",
      },
      {
        heading: "Who MCOs must screen",
        body: "Screen broadly across the managed care operation.",
        bullets: [
          "MCO employees and contractors",
          "Network physicians, hospitals, and ancillary providers",
          "Care management and utilization review vendors",
          "Pharmacy benefit managers and specialty pharmacies",
          "Transportation, home health, and DME network partners",
          "Downstream administrative and IT subcontractors",
        ],
      },
      {
        heading: "Federal LEIE plus state Medicaid lists",
        body: "OIG LEIE screening is necessary but not sufficient for MCOs. State Medicaid programs maintain separate exclusion lists that do not automatically sync with OIG. A provider excluded in one state may not yet appear on the LEIE. Multi-state MCOs need a matrix mapping each party to applicable state lists based on service location and member enrollment.",
      },
      {
        heading: "Integrating screening into credentialing",
        body: "Provider network credentialing and re-credentialing are natural checkpoints for exclusion screening. Initial credentialing should block enrollment until LEIE and state list checks complete. Re-credentialing cycles — typically every 24 to 36 months — must include fresh exclusion searches, not just license renewal verification.",
      },
      {
        heading: "Audit and state contract compliance",
        body: "State Medicaid agencies audit MCO exclusion programs regularly. Prepare exports covering network providers, employees, and vendors for each contract period. Document screening frequency, overdue exceptions, and confirmed match resolutions. Gaps in downstream subcontractor screening are a frequent finding — extend your program to the full chain.",
      },
    ],
  },
  {
    slug: "how-to-screen-subcontractors-against-oig",
    cluster: "oig",
    title: "How to Screen Subcontractors Against OIG",
    summary:
      "How U.S. healthcare providers screen downstream subcontractors and tier-2 vendors against the OIG LEIE before work begins.",
    answer:
      "Your organization remains exposed when an excluded party performs work through a subcontractor — even if your direct vendor cleared screening. Require every prime vendor to flow down exclusion screening obligations to subcontractors, and independently verify high-risk downstream parties against the OIG LEIE yourself. Screen subcontractor's legal names, DBAs, and key principals before they perform any federal program-connected work. Include screening and notification clauses in prime vendor contracts: subcontractors must be cleared before engagement, prime vendors must notify you of exclusion events, and you retain audit rights to subcontractor screening records. Re-screen subcontractors on the same schedule as direct vendors in the same risk tier. Prime vendor attestation alone does not satisfy CMS audit expectations.",
    primaryKeyword: "screen subcontractors oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-contractors-for-oig-exclusions",
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Am I liable if my vendor's subcontractor is excluded?",
        a: "Yes, potentially. Federal rules prohibit payment for services furnished by excluded parties, including through subcontractors. Your organization should verify downstream screening for high-risk relationships.",
      },
      {
        q: "Should I maintain a subcontractor roster?",
        a: "Yes, for vendors where subcontractors perform billable or patient-facing work. Request subcontractor names from prime vendors and screen or verify screening before work starts.",
      },
      {
        q: "What contract language flows down screening requirements?",
        a: "Require prime vendors to screen all subcontractors against the LEIE before engagement, re-screen on your schedule, notify you of matches, and provide screening evidence upon request.",
      },
      {
        q: "Do staffing agency subcontractors need separate screening?",
        a: "Screen the agency and verify the individual placed worker. Agency-level clearance does not automatically cover every placement — re-screen individuals on your employee cadence.",
      },
    ],
    sections: [
      {
        heading: "Why subcontractor screening matters",
        body: "Excluded parties often reach federal healthcare programs through layers of contracting. A cleared billing vendor may subcontract coding work to an excluded individual. CMS and OIG expect providers to look through the chain — especially when subcontractors perform services that would be billable if performed directly.",
      },
      {
        heading: "Identify in-scope subcontractors",
        body: "Focus on downstream parties performing work connected to federal program items or services.",
        bullets: [
          "Subcontractors performing clinical or billing services",
          "IT subcontractors with claims or EHR access",
          "Cleaning or facilities vendors in clinical areas when tied to program requirements",
          "Transportation and home health subcontractors in your network",
          "Offshore subcontractors supporting revenue cycle work",
        ],
      },
      {
        heading: "Flow-down contract requirements",
        body: "Prime vendor contracts should require subcontractors to complete OIG LEIE screening before performing work, re-screen on the schedule defined in your policy, and notify the prime vendor and your organization of any exclusion match. Include your right to audit subcontractor screening records and to terminate for screening failures.",
      },
      {
        heading: "Independent verification vs. attestation",
        body: "Prime vendor attestation that subcontractors were screened is a starting point, not the finish line. For high-risk subcontractors, run your own LEIE search and retain dated evidence. Request subcontractor names and ownership details during vendor onboarding — do not wait until an audit sample request.",
      },
      {
        heading: "Re-screening subcontractors on schedule",
        body: "Subcontractors excluded after initial clearance create the same exposure as direct vendor exclusions. Include known subcontractors in your monthly or quarterly re-screen batches alongside direct vendors. When prime vendors change subcontractors, treat it as a trigger event requiring immediate screening before work continues.",
      },
    ],
  },
  {
    slug: "how-often-should-healthcare-providers-screen-oig",
    cluster: "oig",
    title: "How Often Should Healthcare Providers Screen OIG?",
    summary:
      "How U.S. healthcare providers set OIG LEIE screening frequency for employees, vendors, and contractors based on risk and regulatory expectations.",
    answer:
      "Healthcare providers should screen against the OIG LEIE at onboarding and re-screen on a risk-based schedule — monthly or quarterly for employees, billing vendors, and clinical contractors; semi-annually or annually for lower-risk administrative vendors with documented rationale. OIG updates the LEIE monthly, and exclusions take effect continuously — a clear result today expires the moment a party is added to the list. CMS, state Medicaid agencies, and payer credentialing agreements increasingly expect documented recurring screening, not one-time checks. Put frequencies in your written compliance policy, assign tier definitions, enforce overdue consequences, and automate re-screening so the schedule survives staff changes. Annual-only screening for high-risk relationships is a common audit finding.",
    primaryKeyword: "how often screen oig",
    relatedGuideSlugs: [
      "how-often-to-re-screen-for-exclusions",
      "how-to-schedule-monthly-oig-screening",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-employees-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Is once-a-year OIG screening enough?",
        a: "Annual screening may suffice for low-risk, non-healthcare vendors with documented risk assessment. High-risk employees and billing vendors typically require monthly or quarterly re-screening.",
      },
      {
        q: "Does CMS specify an OIG screening frequency?",
        a: "CMS expectations vary by provider type and audit context, but surveyors and RAC reviewers increasingly ask for evidence of recurring screening. Payer contracts often specify frequency explicitly.",
      },
      {
        q: "Should employees and vendors use the same schedule?",
        a: "Not necessarily. Use risk-based tiers — employees and billing vendors often re-screen more frequently than general administrative vendors.",
      },
      {
        q: "When should I re-screen outside the regular schedule?",
        a: "Immediately upon legal name changes, ownership transfers, mergers, new subcontractor engagement, or adverse compliance news about a vendor or employee.",
      },
      {
        q: "How does OIG list update timing affect frequency?",
        a: "OIG publishes LEIE updates monthly. Screening less frequently than monthly means you may operate with an outdated clearance for weeks — a gap auditors and payers notice.",
      },
    ],
    sections: [
      {
        heading: "Onboarding screening is only the start",
        body: "Every employee, vendor, and contractor should be screened against the OIG LEIE before engagement or first payment. But onboarding clearance has a shelf life. Exclusions are added to the LEIE continuously. Without recurring re-screening, your program develops a growing blind spot that auditors specifically test.",
      },
      {
        heading: "Risk-based frequency tiers",
        body: "Define tiers in your compliance policy and assign a re-screen frequency to each based on federal program exposure.",
        bullets: [
          "Tier 1 — employees, billing vendors, clinical contractors: monthly or quarterly",
          "Tier 2 — general vendors with system or facility access: quarterly or semi-annually",
          "Tier 3 — low-risk, non-healthcare vendors: annually with documented risk assessment",
          "Ad hoc — re-screen on name changes, mergers, or new subcontractor engagement",
        ],
      },
      {
        heading: "What regulators and payers expect",
        body: "CMS surveyors, state Medicaid agencies, and commercial payer credentialing teams increasingly request evidence of recurring OIG screening — not just initial checks. Managed care contracts and provider agreements may specify monthly or quarterly frequency. Apply the strictest requirement across your payer mix.",
      },
      {
        heading: "Align frequency with LEIE update cycles",
        body: "OIG updates the LEIE monthly. Organizations screening quarterly accept up to three months of exposure after an exclusion is published. Monthly screening for high-risk tiers aligns your program with list publication and reduces the window between exclusion and detection.",
      },
      {
        heading: "Put the schedule in writing and enforce it",
        body: "Verbal assurances that 'we check quarterly' fail audits when overdue screens have no consequences. Document frequencies by tier, responsible owners, and enforcement actions for overdue checks — payment holds, access suspension, or compliance escalation. Automated re-screening with overdue alerts turns policy language into an operating control.",
      },
      {
        heading: "Automate so frequency survives turnover",
        body: "Calendar reminders and spreadsheet due dates depend on individuals who leave. Automated exclusion monitoring runs on your defined cadence, logs every result, and flags overdue parties before they become findings. That consistency is what separates a defensible program from a binder on a shelf.",
      },
    ],
  },
];
