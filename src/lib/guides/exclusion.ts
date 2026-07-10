import { guide } from "./helpers";

export const exclusionGuides = [
  guide({
    slug: "how-to-screen-vendors-against-the-oig-list",
    title: "How to Screen Vendors Against the OIG List",
    summary:
      "How U.S. healthcare and government-funded organizations screen vendors against the OIG LEIE before engagement and on a recurring schedule.",
    answer:
      "Before you engage a vendor who touches federal healthcare programs, search the OIG List of Excluded Individuals and Entities (LEIE) using the vendor's legal name and any known aliases. Record the search date, list version, and result. A clear search at onboarding is not enough — re-screen on a schedule because exclusions are added continuously.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: ["what-ofac-screening-requires", "how-to-document-exclusion-screening", "how-often-to-re-screen-for-exclusions", "oig-sam-and-ofac-what-healthcare-providers-must-screen", "how-to-resolve-an-oig-list-match"],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      { q: "Who must be screened against the OIG list?", a: "Any individual or entity you pay or contract with who could bill or participate in Medicare, Medicaid, or other federal healthcare programs — including billing companies, staffing agencies, and subcontractors." },
      { q: "Is a one-time OIG check sufficient?", a: "No. The LEIE is updated regularly. A vendor cleared at onboarding can be excluded later. Continuous or scheduled re-screening with dated evidence is the standard." },
    ],
    sections: [
      {
        heading: "What the OIG LEIE is",
        body: "The U.S. Department of Health and Human Services Office of Inspector General maintains the List of Excluded Individuals and Entities (LEIE). Parties on the list are barred from participating in federal healthcare programs. Contracting with or employing an excluded party can trigger civil monetary penalties and program exclusion for your organization.",
      },
      {
        heading: "Who to screen",
        body: "Screen every vendor, contractor, and individual who performs services tied to federal healthcare funding — not just clinical staff.",
        bullets: [
          "Billing and revenue cycle vendors",
          "Medical staffing and locum agencies",
          "IT and software vendors with access to PHI or claims systems",
          "Subcontractors performing work on your behalf",
          "Owners and principals when the entity is a small business or sole proprietorship",
        ],
      },
      {
        heading: "How to search effectively",
        body: "Search using the legal name on the W-9 or contract, then repeat with known DBAs and variations. OIG matching is name-based — typos and partial names miss hits. For entities, also search key owners and officers when your policy requires it. Document which names you searched and the disposition of each.",
      },
      {
        heading: "What to do with a potential match",
        body: "A name match is not automatic guilt — common names produce false positives. Compare date of birth, address, NPI, or other identifiers when available. If the match is credible, do not engage or pay until resolved. Escalate to compliance or legal, document the hold, and retain the search record.",
      },
      {
        heading: "When to screen in the vendor lifecycle",
        body: "Screen before contract execution or first payment — whichever comes first in your process. Block onboarding in your vendor packet until screening completes. After go-live, re-screen on the schedule defined in your compliance policy — monthly or quarterly is common for high-risk healthcare vendors.",
      },
      {
        heading: "Keep evidence auditors expect",
        body: "An auditor or CMS reviewer will ask for dated proof of each check, not a verbal assurance. Store the search date, list source, names searched, result, and reviewer. Manual screenshots in email fail at scale — use a workflow that logs every check automatically.",
      },
      {
        heading: "NPI and identifier cross-checks",
        body: "When screening clinical vendors or individual practitioners, cross-reference National Provider Identifier (NPI) data against the name on the LEIE entry. NPI registry confirmation strengthens false-positive resolution and speeds true-match escalation. Include NPI in your vendor master for all billable providers.",
      },
      {
        heading: "Healthcare-specific vendor categories",
        body: "Prioritize screening for categories with direct federal program exposure: revenue cycle and coding vendors, DME suppliers, home health partners, laboratory services, pharmacy benefit managers, and medical device reps with chart access. Facilities-only vendors may sit in a lower tier — but your policy should say so explicitly.",
      },
    ],
  }),

  guide({
    slug: "what-ofac-screening-requires",
    title: "What OFAC Screening Requires",
    summary:
      "What U.S. organizations must know about OFAC sanctions screening — SDN lists, ownership rules, and how it differs from healthcare exclusion checks.",
    answer:
      "OFAC screening checks parties against U.S. Treasury sanctions lists — primarily the Specially Designated Nationals (SDN) list — before you engage them in business. You must screen vendors, customers, and counterparties using legal names and aliases, investigate potential matches, and re-screen on a schedule. OFAC is separate from OIG; healthcare exclusion screening does not satisfy sanctions obligations.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: ["how-to-screen-vendors-against-the-oig-list", "how-to-document-exclusion-screening", "how-often-to-re-screen-for-exclusions"],
    relatedGlossary: ["ofac-sdn-list", "sanctions-screening"],
    faqs: [
      { q: "Does OFAC apply to small U.S. businesses?", a: "Yes. OFAC sanctions apply broadly to U.S. persons and entities. Size does not exempt you from screening vendors and business partners." },
      { q: "Is OIG screening enough for OFAC?", a: "No. OIG covers healthcare program exclusions. OFAC covers economic and trade sanctions. Most regulated organizations screen both." },
    ],
    sections: [
      {
        heading: "What OFAC regulates",
        body: "The Office of Foreign Assets Control, part of the U.S. Department of the Treasury, administers economic and trade sanctions against targeted foreign countries, regimes, terrorists, and narcotics traffickers. U.S. persons — including companies — generally may not engage in transactions with parties on OFAC lists unless authorized by a license.",
      },
      {
        heading: "The lists that matter most",
        body: "The Specially Designated Nationals and Blocked Persons (SDN) list is the primary screening target for most U.S. operations teams. Depending on your industry and geography, you may also screen consolidated non-SDN lists, sectoral sanctions, and country-based programs. Your compliance policy should name which lists you check and how often.",
      },
      {
        heading: "Who to screen",
        body: "Screen vendors, customers, contractors, payment recipients, and — under the 50 Percent Rule — entities owned 50% or more in aggregate by one or more blocked persons. Ownership screening is where manual name-only checks often fall short.",
        bullets: [
          "New vendors before first payment or contract signature",
          "Existing vendors on a recurring schedule",
          "Customers in high-risk industries or geographies",
          "Wire transfer beneficiaries and international counterparties",
        ],
      },
      {
        heading: "Handling potential matches",
        body: "Sanctions screening produces false positives — especially on common names. Your process must define how analysts resolve matches: compare addresses, dates of birth, country, and other identifiers; escalate true hits; and document the disposition. Blocking a payment or relationship without a documented review trail creates its own compliance risk.",
      },
      {
        heading: "How OFAC differs from OIG",
        body: "OIG LEIE covers federal healthcare program exclusions. OFAC covers sanctions and blocked parties globally. A vendor can appear on one list and not others. Healthcare providers typically screen all three; other industries may emphasize OFAC.",
      },
      {
        heading: "Building a defensible program",
        body: "Regulators and banking partners expect a risk-based program: documented policy, screening before engagement, periodic re-screening, match resolution procedures, and retained evidence. Point-in-time searches without logs are difficult to defend. Automated screening with an audit trail closes the gap between policy and proof.",
      },
    ],
  }),

  guide({
    slug: "how-to-screen-employees-for-exclusions",
    title: "How to Screen Employees for Exclusions",
    summary:
      "How U.S. healthcare and human services employers screen employees and contractors against OIG and state exclusion lists.",
    answer:
      "Screen every employee, contractor, and volunteer who could bill or interact with federal healthcare programs at hire and on a recurring schedule. Search the OIG LEIE and applicable state Medicaid exclusion lists using legal name and aliases. Document each check with a date and result — hiring someone who is excluded exposes your organization to significant penalties.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: ["how-to-screen-vendors-against-the-oig-list", "how-to-document-exclusion-screening", "how-often-to-re-screen-for-exclusions"],
    relatedGlossary: ["oig-exclusion"],
    sections: [
      {
        heading: "Why employee screening is non-negotiable in healthcare",
        body: "Federal law prohibits payment for items or services furnished by excluded individuals. That includes employees who submit claims, provide billable care, or support billing operations — not just licensed clinicians. An excluded employee working in any capacity tied to federal programs can trigger civil monetary penalties for each day of employment or engagement.",
      },
      {
        heading: "When to screen",
        body: "Screen at offer acceptance or before start date — before system access, credentialing, or patient contact. Re-screen all active staff on your organization's schedule, typically monthly or quarterly. Also screen when legal names change, after extended leave in regulated roles, and when state licensing boards flag an issue.",
      },
      {
        heading: "Which lists to check",
        body: "At minimum, search the OIG LEIE. Many states maintain separate Medicaid exclusion lists that do not sync automatically with OIG. If you operate in or serve patients from multiple states, your policy should define which state lists apply to each employee based on work location and payer mix.",
        bullets: [
          "OIG LEIE — federal healthcare program exclusions",
          "State Medicaid exclusion lists where applicable",
          "OFAC SDN when employees handle international payments or vendors",
        ],
      },
      {
        heading: "Contractors, locums, and volunteers",
        body: "Apply the same screening standard to temporary staff, agency placements, medical directors paid as contractors, and volunteers in billable or patient-facing roles. Staffing agencies should provide exclusion clearance documentation — but ultimate responsibility often remains with the hiring organization. Verify agency checks rather than accepting a blanket attestation.",
      },
      {
        heading: "Responding to a confirmed exclusion",
        body: "Do not allow an excluded individual to perform services billable to federal programs. Terminate or reassign immediately, notify compliance and legal, and document the timeline. Self-disclosure obligations may apply depending on the circumstances. Retain all screening records showing when the exclusion appeared relative to hire date.",
      },
      {
        heading: "Integrate with HR workflows",
        body: "Exclusion screening should not live in a compliance silo HR forgets to trigger. Embed checks in onboarding checklists, credentialing workflows, and periodic compliance audits. Automated re-screening catches exclusions that occur after hire — the most common gap in manual programs.",
      },
    ],
  }),

  guide({
    slug: "how-to-document-exclusion-screening",
    title: "How to Document Exclusion Screening",
    summary:
      "What evidence U.S. compliance teams should retain for OIG and OFAC screening — and what auditors reject.",
    answer:
      "For every exclusion check, record who was screened, which lists were searched, the search date, list version or source, names and identifiers used, the result, and who performed the review. Potential matches need a documented disposition. Spreadsheets without timestamps or inbox screenshots do not survive CMS, payer, or internal audits.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: ["how-to-screen-vendors-against-the-oig-list", "what-ofac-screening-requires", "how-often-to-re-screen-for-exclusions", "what-makes-a-good-audit-trail"],
    relatedGlossary: ["oig-exclusion", "ofac-sdn-list"],
    faqs: [
      { q: "How long should we keep screening records?", a: "Retention periods vary by regulator and contract, but many healthcare organizations retain exclusion screening evidence for at least six years — often aligned with federal healthcare record retention expectations. Confirm with your compliance policy." },
      { q: "Is a screenshot of a clear search enough?", a: "It is better than nothing, but weak on attribution and continuity. A structured log with date, searcher, names checked, and disposition is stronger. Automated workflows produce this by default." },
    ],
    sections: [
      {
        heading: "What auditors actually ask for",
        body: "Auditors and surveyors do not ask whether you screen — they ask you to prove it. Expect requests for a sample of vendors or employees screened during a specific period, evidence that re-screening occurred on schedule, and documentation of how potential matches were resolved.",
      },
      {
        heading: "Minimum fields for each screening record",
        body: "Every check should answer: who was screened, when, against what, with what result, and by whom.",
        bullets: [
          "Legal name and aliases or DBAs searched",
          "Date and time of the search",
          "List source (OIG LEIE, OFAC SDN, state list)",
          "Result: clear, potential match, or confirmed match",
          "Reviewer name or system identity",
          "Disposition notes for any match investigation",
        ],
      },
      {
        heading: "Documenting match resolution",
        body: "Potential matches require a separate record: why the hit was a false positive or why the relationship was blocked. Include identifiers compared — date of birth, address, EIN, NPI — and the escalation path if a true match was confirmed. 'We looked and it was fine' without detail fails under scrutiny.",
      },
      {
        heading: "Tie screening to the vendor or employee record",
        body: "Screening evidence scattered across email, shared drives, and personal downloads is unusable at audit time. Attach each check to the vendor or employee master record so anyone with appropriate access can reconstruct the full history — onboarding check, quarterly re-screens, and any holds.",
      },
      {
        heading: "Common documentation failures",
        body: "Teams lose audits on process gaps, not intent: screening happened but was not dated; only the final 'clear' was saved, not the names searched; re-screening was informal; staffing agency attestation replaced your own check. Each gap creates exposure.",
      },
      {
        heading: "Use a screening log or monitored workflow",
        body: "A standardized exclusion screening log — or a tool that writes one automatically — ensures every check produces the same evidence format. Export the log by date range, vendor, or employee when legal, compliance, or a payer requests proof.",
      },
    ],
  }),

  guide({
    slug: "how-often-to-re-screen-for-exclusions",
    title: "How Often to Re-screen for Exclusions",
    summary:
      "How U.S. compliance teams set OIG and OFAC re-screening frequency for vendors and employees.",
    answer:
      "Re-screen vendors and employees on a fixed schedule — monthly or quarterly is common for healthcare organizations, with annual minimums for lower-risk relationships. Exclusions and sanctions lists update continuously; a clear result at onboarding expires the moment a party is added to a list. Your written policy should define frequency by risk tier and require automated reminders.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    relatedGuides: ["how-to-screen-vendors-against-the-oig-list", "how-to-screen-employees-for-exclusions", "how-to-document-exclusion-screening"],
    relatedGlossary: ["oig-exclusion", "ofac-sdn-list", "sanctions-screening"],
    faqs: [
      { q: "Is annual re-screening enough?", a: "Annual checks may satisfy some low-risk relationships, but CMS and payer scrutiny often expect more frequent screening for healthcare providers and vendors touching federal programs. Many organizations use monthly or quarterly cycles." },
      { q: "Should employees and vendors use the same schedule?", a: "Not necessarily. Risk-based tiers are standard — clinical and billing staff often re-screen more frequently than administrative vendors with no patient or claims access." },
    ],
    sections: [
      {
        heading: "Why one-time screening fails",
        body: "Exclusion and sanctions lists change daily. OIG publishes monthly updates to the LEIE; OFAC adds and removes SDN entries on an ongoing basis. A vendor cleared in January can be excluded in March. Without re-screening, your compliance program has a growing blind spot.",
      },
      {
        heading: "Industry norms in U.S. healthcare",
        body: "Healthcare providers subject to CMS conditions of participation or payer credentialing requirements typically re-screen employees monthly or quarterly. Vendors with billing access or clinical involvement follow similar cadences. Low-touch administrative vendors may re-screen semi-annually or annually if your risk assessment supports it — document the rationale.",
      },
      {
        heading: "Build risk-based tiers",
        body: "Not every relationship carries equal exposure. Define tiers in your compliance policy and assign a re-screen frequency to each.",
        bullets: [
          "Tier 1 — employees, billing vendors, clinical contractors: monthly or quarterly",
          "Tier 2 — general vendors with system or facility access: quarterly or semi-annually",
          "Tier 3 — low-risk, non-healthcare vendors: annually with documented risk assessment",
          "Ad hoc — re-screen immediately after name changes, mergers, or adverse news",
        ],
      },
      {
        heading: "Trigger-based re-screening",
        body: "Scheduled checks are the baseline. Also re-screen when a vendor changes legal name, ownership structure, or banking details; when an employee's legal name changes; when you renew a contract; and when a regulator or payer updates screening requirements in your agreement.",
      },
      {
        heading: "Put the schedule in writing",
        body: "Your exclusion screening policy should state frequencies by tier, responsible owners, and what happens when a re-screen is overdue — hold payment, suspend access, or escalate to compliance. Verbal 'we check quarterly' without a enforced schedule does not hold up in an audit.",
      },
      {
        heading: "Automate so the schedule survives turnover",
        body: "Calendar reminders and spreadsheet due dates depend on someone remembering. Automated re-screening runs on the defined cadence, logs results, and flags overdue checks before they become audit findings. That is the difference between a policy document and an operating control.",
      },
    ],
  }),
];
