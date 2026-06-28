import { guide } from "./helpers";

export const contractRenewalGuides = [
  guide({
    slug: "how-to-avoid-accidental-auto-renewals",
    title: "How to Avoid Accidental Auto-Renewals",
    summary:
      "How U.S. finance and operations teams prevent contracts from renewing automatically when they intended to cancel or renegotiate.",
    answer:
      "For every contract with auto-renewal language, calculate the decision deadline — renewal date minus notice period — and set reminders at least 30 days before that date. Do not rely on the renewal date alone or calendar invites tied to contract end. Assign an owner, document the notice method required by the clause, and keep proof when you give notice.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-track-contract-renewals",
      "how-to-find-a-contract-notice-period",
      "how-to-give-notice-of-non-renewal",
      "what-an-evergreen-contract-means",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period", "evergreen-contract"],
    faqs: [
      {
        q: "What is the most common cause of accidental auto-renewals?",
        a: "Teams calendar the renewal date instead of the notice deadline. By the time the renewal date arrives, the window to give notice has already closed.",
      },
      {
        q: "Can I cancel after the notice window closes?",
        a: "Usually not without paying out the next term or negotiating an early termination. The notice window is the operational deadline — treat it as binding.",
      },
    ],
    sections: [
      {
        heading: "Why auto-renewals catch teams off guard",
        body: "Auto-renewal clauses are standard in SaaS subscriptions, facilities agreements, and vendor MSAs. They extend the contract for another term — often 12 or 36 months — unless one party gives written notice within a defined window. The clause is easy to miss because it sits in the Term or Renewal section, not on the signature page. When no one monitors the notice deadline, silence equals consent.",
      },
      {
        heading: "The date that actually matters",
        body: "The renewal date tells you when the next term begins if you do nothing. The notice period tells you how far in advance you must act. Your decision deadline is renewal date minus notice period — not the renewal date itself. Example: a December 31 renewal with 90 days' notice means you must give notice by October 2. Calendar that date, not December 31.",
        bullets: [
          "Renewal date = when the next term starts if no notice is given",
          "Notice period = days before renewal by which notice must be delivered",
          "Decision deadline = renewal date minus notice period",
        ],
      },
      {
        heading: "Build a buffer into your process",
        body: "Do not wait until the decision deadline to start evaluating the contract. Begin review 60–90 days before the notice window closes so you have time to negotiate, get internal approval, and deliver notice without rushing. Set reminders at 120, 90, and 30 days before the decision deadline — not just one alert on the final day.",
      },
      {
        heading: "Assign an owner for every contract",
        body: "Auto-renewals happen when contracts have no accountable owner. Each agreement should have a named business owner — the person who decides renew, renegotiate, or cancel — plus a backup. The owner receives reminders, initiates the review, and confirms notice was sent. Contracts without owners are the ones that slip through.",
      },
      {
        heading: "Follow the notice method in the clause",
        body: "Many contracts require notice by certified mail, email to a specific address, or through a vendor portal. Sending notice the wrong way can invalidate it even if you hit the deadline. Read the clause for delivery requirements, authorized recipients, and whether notice must cite a specific section. Keep delivery confirmation — read receipt, portal timestamp, or certified mail tracking.",
      },
      {
        heading: "When spreadsheets stop working",
        body: "A spreadsheet with renewal dates works until you have more than a handful of contracts or staff turnover. Spreadsheets do not calculate decision deadlines, do not send reminders, and do not record who gave notice. Portfolio monitoring with automated deadline calculation is how teams with dozens or hundreds of contracts avoid surprise renewals.",
      },
    ],
  }),

  guide({
    slug: "how-to-read-a-contract-term-and-renewal-clause",
    title: "How to Read a Contract Term and Renewal Clause",
    summary:
      "How to extract the initial term, renewal term, and notice requirements from U.S. commercial contracts — including MSAs, order forms, and SaaS agreements.",
    answer:
      "Start in the Term, Renewal, or Extension section. Identify the initial term length, whether the contract auto-renews, the renewal term length, and the notice period required to prevent renewal. Read the MSA and any order form together — dates may live in one document while renewal rules live in another. Record each field in your renewal register.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-find-a-contract-notice-period",
      "how-to-track-contract-renewals",
      "what-an-evergreen-contract-means",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period", "evergreen-contract"],
    sections: [
      {
        heading: "Where to look in the contract",
        body: "Term and renewal language typically appears under headings such as Term, Term and Termination, Renewal, Extension, or Duration. In SaaS agreements, also check the order form or subscription schedule — it may state the subscription period while the MSA governs what happens at the end of that period.",
      },
      {
        heading: "The four fields to extract",
        body: "Every renewal clause reduces to four data points you need in your register.",
        bullets: [
          "Effective date — when the contract (or this order) started",
          "Initial term — how long the first period runs",
          "Renewal term — how long each automatic extension lasts",
          "Notice period — how many days before renewal you must give notice to cancel or change terms",
        ],
      },
      {
        heading: "Common renewal patterns",
        body: "Fixed term with no renewal: the contract ends on a date and does not extend unless both parties sign an amendment. Auto-renewal with notice: the contract renews for a stated period unless one party gives notice within a window — this is the pattern that causes accidental renewals. Evergreen: the contract continues indefinitely until terminated — common in month-to-month services and some maintenance agreements.",
      },
      {
        heading: "MSA plus order form",
        body: "Enterprise vendor relationships often split terms across documents. The MSA may contain auto-renewal language while the order form states the subscription start and end dates. Read both — an order form that is silent on renewal does not override an auto-renewal clause in the MSA. When documents conflict, capture both versions and escalate before relying on a single interpretation.",
      },
      {
        heading: "Watch for defined terms",
        body: "Contracts define 'Term,' 'Renewal Term,' and 'Initial Term' in the definitions section. A clause that says 'the Term shall automatically renew for successive Renewal Terms' is referencing those definitions — not using the words casually. Cross-reference definitions when the language feels circular.",
      },
      {
        heading: "Document what you find",
        body: "Record the clause text alongside the dates you extract. If you interpret ambiguous language — calendar days vs business days, anniversary of effective date vs fixed end date — note your reasoning. Future you, or a successor, needs to understand why a specific deadline was chosen.",
      },
    ],
  }),

  guide({
    slug: "how-to-build-a-contract-renewal-calendar",
    title: "How to Build a Contract Renewal Calendar",
    summary:
      "How U.S. operations and procurement teams centralize contract renewal dates, notice deadlines, and decision owners in one actionable calendar.",
    answer:
      "Create a renewal register with one row per contract: counterparty, owner, effective date, term end, renewal date, notice period, decision deadline, annual value, and status. Review monthly for deadlines in the next 90 days. Set automated reminders at 120, 90, and 30 days before each decision deadline — not just the renewal date.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-track-contract-renewals",
      "how-to-track-notice-periods-across-a-portfolio",
      "how-to-avoid-accidental-auto-renewals",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "Should I calendar the renewal date or the notice deadline?",
        a: "Both, but prioritize the decision deadline. That is the last day you can act without auto-renewing. The renewal date is informational once the notice window has passed.",
      },
    ],
    sections: [
      {
        heading: "What a renewal calendar is for",
        body: "A renewal calendar is not a list of contract end dates — it is an operational tool that tells each owner when to start evaluating, negotiating, or canceling. The goal is to eliminate surprise renewals and give procurement and finance enough lead time to renegotiate pricing, scope, or terms before the notice window closes.",
      },
      {
        heading: "Fields to capture for each contract",
        body: "Minimum viable register columns:",
        bullets: [
          "Contract name and counterparty",
          "Business owner and backup owner",
          "Effective date and current term end",
          "Renewal date and renewal term length",
          "Notice period and calculated decision deadline",
          "Annual contract value or spend",
          "Status: active review, renewing, non-renewing, renegotiating",
          "Link to the contract document",
        ],
      },
      {
        heading: "Calculate decision deadlines automatically",
        body: "Decision deadline = renewal date minus notice period. Build this as a formula, not a manual entry — manual dates drift when someone miscounts days or uses the wrong renewal date. Flag contracts where the notice period is ambiguous so they get legal review before a deadline is set.",
      },
      {
        heading: "Run a monthly renewal review",
        body: "Block 30 minutes each month to review contracts with decision deadlines in the next 90 days. Confirm each owner knows their upcoming deadlines, whether a renegotiation is planned, and whether notice has been or will be sent. Escalate contracts with no owner or no status update.",
      },
      {
        heading: "Include SaaS and low-dollar agreements",
        body: "Teams often track large vendor contracts but miss SaaS subscriptions that auto-renew on order forms. A $500-per-month tool that auto-renews for three years is still a budget commitment. Include all recurring agreements above your materiality threshold — and define that threshold explicitly.",
      },
      {
        heading: "Keep the calendar current after decisions",
        body: "When a contract renews, update the renewal date, notice period (if it changed), and decision deadline for the next cycle. When you give non-renewal notice, record the notice date and expected end date. A stale calendar is worse than no calendar — it creates false confidence.",
      },
    ],
  }),

  guide({
    slug: "how-to-give-notice-of-non-renewal",
    title: "How to Give Notice of Non-Renewal",
    summary:
      "How to deliver valid non-renewal notice under U.S. commercial contracts — including timing, method, and documentation.",
    answer:
      "Send written notice to the address and method specified in the contract, within the notice window stated in the renewal clause, citing the contract and section that governs non-renewal. Deliver before the decision deadline — not on it. Keep proof of delivery: read receipt, certified mail tracking, or portal confirmation.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-avoid-accidental-auto-renewals",
      "how-to-find-a-contract-notice-period",
      "how-to-prepare-for-a-contract-renegotiation",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause", "termination-for-convenience"],
    faqs: [
      {
        q: "Is email sufficient for non-renewal notice?",
        a: "Only if the contract permits it. Many agreements require notice by certified mail or to a specific legal address. Check the notice provision before sending.",
      },
      {
        q: "What happens if I miss the notice window?",
        a: "The contract typically renews for another term. You may still negotiate an early exit, but you are no longer exercising a contractual right — you are asking for a concession.",
      },
    ],
    sections: [
      {
        heading: "Confirm the deadline first",
        body: "Before drafting notice, verify the decision deadline: renewal date minus notice period. Confirm whether days are calendar or business days and whether the deadline is inclusive or exclusive. If the contract defines notice requirements in a separate Notices section, read that too — it may specify format, address, and authorized recipients.",
      },
      {
        heading: "Use the required notice method",
        body: "Contracts commonly require notice by one or more of: email to a designated address, certified or registered mail, overnight courier, or submission through a vendor portal. Notice sent by the wrong method — even if received — may not satisfy the contract. Follow the clause literally.",
      },
      {
        heading: "What to include in the notice",
        body: "A valid non-renewal notice typically includes: the contract name and date; the parties; a clear statement that you are electing not to renew; reference to the renewal or termination section; the effective date of non-renewal (usually the end of the current term); and the signature of an authorized representative. Keep it factual — this is not the place to explain dissatisfaction with the vendor.",
      },
      {
        heading: "Send early, not on the deadline",
        body: "Delivery delays, time zones, and portal processing can push receipt past the deadline even when you send on the last day. Aim to deliver notice at least one week before the decision deadline. If the clause requires receipt by a date, back up further.",
      },
      {
        heading: "Document delivery",
        body: "Store proof alongside the contract: email read receipt or sent confirmation, certified mail tracking number with delivery confirmation, portal submission timestamp, or courier delivery record. If the vendor disputes whether notice was timely, this evidence is what protects you.",
      },
      {
        heading: "Plan for wind-down obligations",
        body: "Non-renewal ends the term but may trigger survival clauses: data return, transition assistance, payment of outstanding fees, and return of confidential information. Review termination and survival sections so the business owner knows what happens after the contract ends.",
      },
    ],
  }),

  guide({
    slug: "what-an-evergreen-contract-means",
    title: "What an Evergreen Contract Means",
    summary:
      "What evergreen and auto-renewing contracts mean in U.S. commercial agreements — and how they differ from fixed-term contracts.",
    answer:
      "An evergreen contract continues automatically until one party terminates it — there is no fixed end date. It may renew month-to-month or year-to-year indefinitely. Auto-renewal contracts have defined renewal terms but extend unless notice is given. Both require monitoring notice periods and termination rights, not just end dates.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-avoid-accidental-auto-renewals",
      "how-to-read-a-contract-term-and-renewal-clause",
      "how-to-track-contract-renewals",
    ],
    relatedGlossary: ["evergreen-contract", "auto-renewal-clause", "notice-period", "termination-for-convenience"],
    sections: [
      {
        heading: "Evergreen vs fixed term",
        body: "A fixed-term contract runs from an effective date to a stated end date and stops unless the parties sign a new agreement or renewal. An evergreen contract has no predetermined end — it continues until terminated according to the contract's termination provisions. Month-to-month office leases, maintenance agreements, and some SaaS plans operate this way.",
      },
      {
        heading: "Evergreen vs auto-renewal",
        body: "These terms are often used interchangeably, but they differ in practice. Auto-renewal contracts have discrete renewal periods — typically one or three years — and extend for another period unless notice is given before a deadline. Evergreen contracts roll continuously, often month-to-month, with termination available at any time subject to a notice period. Both create ongoing commitment if you stop paying attention.",
      },
      {
        heading: "Why evergreen contracts matter operationally",
        body: "There is no renewal date to trigger a natural review point. Without a calendar event, evergreen contracts persist for years — often with outdated pricing, scope, or terms. Finance may keep paying long after the business stopped using the service. Assign an owner and schedule periodic reviews even when no notice deadline is approaching.",
      },
      {
        heading: "Termination rights in evergreen agreements",
        body: "Evergreen contracts typically include termination for convenience — either party may end the agreement with written notice, often 30 or 60 days. That notice period is your operational deadline, analogous to the decision deadline in auto-renewal contracts. Locate the termination section and calendar the notice requirement.",
      },
      {
        heading: "Pricing and scope creep",
        body: "Evergreen agreements often allow the vendor to change pricing or terms on notice — sometimes with as little as 30 days. The contract continues, but the economics shift. Review evergreen contracts annually for price escalation clauses, usage-based fee changes, and whether current scope still matches business need.",
      },
      {
        heading: "How to monitor evergreen contracts",
        body: "Track them in the same renewal register as fixed-term contracts, but use the termination notice period as the actionable deadline. Set annual review reminders regardless of notice windows. Flag evergreen contracts with no active owner or no recent business justification — they are prime candidates for cancellation.",
      },
    ],
  }),

  guide({
    slug: "how-to-track-notice-periods-across-a-portfolio",
    title: "How to Track Notice Periods Across a Portfolio",
    summary:
      "How U.S. teams manage notice deadlines across dozens or hundreds of contracts without missing a single window.",
    answer:
      "Centralize every contract's notice period and calculated decision deadline in one register. Standardize how you extract notice language, assign owners, and set tiered reminders. Review the portfolio monthly for deadlines in the next 90 days. Do not track notice periods in individual calendars or scattered spreadsheets.",
    product: "contract-renewal-tracker",
    workflow: "track-contract-notice-periods",
    relatedGuides: [
      "how-to-find-a-contract-notice-period",
      "how-to-build-a-contract-renewal-calendar",
      "how-to-avoid-accidental-auto-renewals",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause", "evergreen-contract"],
    sections: [
      {
        heading: "The portfolio problem",
        body: "One missed notice period can commit your organization to another 12–36 months of spend. At portfolio scale — 50, 200, or 500 contracts — individual reminders fail. Staff leave, calendars get cluttered, and contracts signed years ago have no current owner. Portfolio tracking means one system of record for every notice deadline.",
      },
      {
        heading: "Standardize extraction",
        body: "Different contracts phrase notice requirements differently. Create a standard intake process: when a contract is signed or renewed, extract notice period, renewal date, and decision deadline using the same fields every time. If language is ambiguous, flag for legal review rather than guessing. Consistency at intake prevents chaos at scale.",
      },
      {
        heading: "Tiered reminder schedule",
        body: "One reminder is not enough. Most teams set alerts at 120, 90, and 30 days before the decision deadline, with escalation to the owner's manager at 14 days if no action is recorded. Reminders should go to the business owner, not just a shared mailbox that nobody monitors.",
      },
      {
        heading: "Assign ownership and backups",
        body: "Every contract needs a primary owner and a backup. When someone changes roles, ownership must transfer explicitly — not drift. Run a quarterly audit of contracts with no owner or an owner who has left the organization. Unowned contracts are the highest-risk items in your portfolio.",
      },
      {
        heading: "Group by urgency and value",
        body: "Not all contracts deserve equal attention. Sort your portfolio by decision deadline and annual value. High-value contracts with approaching deadlines get priority in the monthly review. Low-value evergreen contracts get annual review. This prevents the urgent from hiding the important.",
      },
      {
        heading: "Measure what you miss",
        body: "Track how many contracts auto-renewed because notice was missed, how many were renegotiated before renewal, and average lead time before decision deadlines. These metrics justify investment in portfolio monitoring and show whether your process is improving year over year.",
      },
    ],
  }),

  guide({
    slug: "how-to-prepare-for-a-contract-renegotiation",
    title: "How to Prepare for a Contract Renegotiation",
    summary:
      "How U.S. procurement and business teams prepare to renegotiate vendor contracts before the notice window closes.",
    answer:
      "Start preparation at least 90 days before the decision deadline. Gather current spend, usage data, and alternative options. Document what you want to change — price, scope, terms, or SLA. Know your walk-away point. Use the notice deadline as leverage: vendors respond when non-renewal is a credible option.",
    product: "contract-renewal-tracker",
    workflow: "monitor-contract-renewals",
    relatedGuides: [
      "how-to-give-notice-of-non-renewal",
      "how-to-build-a-contract-renewal-calendar",
      "how-to-read-a-contract-term-and-renewal-clause",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "When should I start preparing to renegotiate?",
        a: "At least 90 days before the decision deadline. Complex vendor relationships may need 120 days or more, especially if you are evaluating alternatives.",
      },
      {
        q: "Should I give non-renewal notice while renegotiating?",
        a: "It depends on the relationship and clause. Some teams give notice to preserve optionality, then withdraw if terms improve. Others negotiate first. Either way, know your deadline — do not let negotiations push past the notice window.",
      },
    ],
    sections: [
      {
        heading: "Use the notice deadline as your timeline",
        body: "Renegotiation without a deadline drifts. The decision deadline — renewal date minus notice period — is your hard stop. Work backward: 90 days out, begin internal review; 60 days out, open discussions with the vendor; 30 days out, finalize terms or prepare notice. If the vendor knows you cannot walk away because the notice window closed, your leverage disappears.",
      },
      {
        heading: "Gather your facts",
        body: "Before contacting the vendor, assemble: current contract terms and pricing; actual usage vs contracted capacity; total cost of ownership including implementation, support, and overages; performance against SLAs; and at least one alternative — a competitor quote, in-house option, or decision to discontinue. Negotiation without data is guessing.",
      },
      {
        heading: "Define your objectives",
        body: "Be specific about what you want: price reduction, better payment terms, expanded scope, improved SLA, liability cap changes, or shorter renewal terms. Prioritize — you will not get everything. Identify your walk-away point: the terms below which non-renewal is the better outcome.",
      },
      {
        heading: "Involve the right stakeholders",
        body: "Renegotiation is not only procurement. Include the business owner who uses the service, finance for budget impact, legal for term changes, and IT for technical dependencies. A renegotiation that saves 10% on price but breaks an integration is not a win.",
      },
      {
        heading: "Document the outcome",
        body: "Whether you renew, amend, or cancel, update the renewal register with new terms, dates, and notice periods. Store the amended agreement or renewal order with the original contract. The next renewal cycle starts immediately — do not let a successful renegotiation create a new unmonitored contract.",
      },
      {
        heading: "When renegotiation fails",
        body: "If the vendor will not meet your minimum terms and alternatives exist, give non-renewal notice before the deadline and execute your transition plan. Letting the notice window close because negotiations stalled is how organizations get locked into unfavorable terms for another full term.",
      },
    ],
  }),
];
