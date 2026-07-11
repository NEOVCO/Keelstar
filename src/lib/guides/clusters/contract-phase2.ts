import type { GuideArticleSpec } from "../create-guide";

export const contractPhase2Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-maintain-a-contract-renewal-calendar",
    cluster: "contract",
    title: "How to Maintain a Contract Renewal Calendar",
    summary:
      "How U.S. operations teams keep a contract renewal calendar accurate after initial setup — updates, ownership, and monthly review discipline.",
    answer:
      "A renewal calendar only works if someone maintains it after contracts are signed. Assign a calendar owner, define update triggers (new signature, amendment, non-renewal notice, auto-renewal), and require owners to confirm dates within five business days of any change. Recalculate decision deadlines when notice periods or renewal terms change. Run a monthly 90-day lookahead review with contract owners — not just legal ops in isolation. Retire expired entries instead of leaving stale rows that create false confidence. Integrate calendar updates into your contract intake workflow so new agreements enter the register automatically rather than through quarterly cleanup projects.",
    primaryKeyword: "maintain contract renewal calendar",
    relatedGuideSlugs: [
      "how-to-build-a-contract-renewal-calendar",
      "how-to-track-contract-renewals",
      "how-to-avoid-missing-contract-renewal-deadlines",
      "how-to-manage-contract-renewals-in-a-portfolio",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "How is maintaining different from building a renewal calendar?",
        a: "Building is the initial register setup. Maintaining is ongoing hygiene — updating dates after amendments, reassigning owners, and confirming deadlines before they pass.",
      },
      {
        q: "Who should own calendar maintenance?",
        a: "Legal operations or procurement ops often owns the register; business contract owners confirm status monthly. Split accountability kills accuracy.",
      },
      {
        q: "How often should dates be validated?",
        a: "Monthly for contracts with decision deadlines in the next 90 days; immediately after any amendment or order form renewal.",
      },
      {
        q: "What if our calendar is already stale?",
        a: "Pause reminders until you reconcile top-spend contracts first, then resume automated alerts. Bad data plus reminders trains teams to ignore alerts.",
      },
    ],
    sections: [
      {
        heading: "Update triggers you must define",
        body: "Document when the calendar must change: executed amendment, order form renewal, non-renewal sent, early termination, or acquisition assignment. Without triggers, updates depend on someone remembering.",
      },
      {
        heading: "Owner confirmation cadence",
        body: "Each contract owner receives a monthly task: confirm renewal date, notice period, and next action still correct. Unconfirmed rows escalate to their manager.",
      },
      {
        heading: "Recalculate decision deadlines",
        body: "When renewal terms change — especially notice period — rebuild decision deadline formulas. Do not edit renewal date alone and leave the old notice math.",
      },
      {
        heading: "Integrate with contract intake",
        body: "New contracts should flow from signature workflow into the calendar with required fields validated at entry. Retroactive data entry projects fail under volume.",
      },
      {
        heading: "Archive vs delete",
        body: "Move terminated contracts to archived status with end date and outcome — do not delete rows auditors may ask about later.",
      },
    ],
  },
  {
    slug: "how-to-track-saas-contract-renewals",
    cluster: "contract",
    title: "How to Track SaaS Contract Renewals",
    summary:
      "How finance and IT procurement track SaaS subscription renewals — order forms, seat counts, auto-renew clauses, and shadow IT spend.",
    answer:
      "SaaS renewals hide in order forms, credit card charges, and departmental budgets — not always in your MSA register. Track each subscription with vendor, product, billing owner, seat count, order start/end, auto-renew flag, notice period, and annual value. Include low-dollar tools above your materiality threshold — a $400/month subscription auto-renewing for three years is still a commitment. Tie renewal tracking to vendor master records and AP spend feeds to catch duplicates. Decision deadlines matter as much as for enterprise MSAs: SaaS auto-renew language on order forms traps teams who only calendar the subscription end date.",
    primaryKeyword: "track saas contract renewals",
    relatedGuideSlugs: [
      "how-to-avoid-accidental-auto-renewals",
      "how-to-read-a-contract-term-and-renewal-clause",
      "how-to-manage-contract-renewals-in-a-portfolio",
      "how-to-centralize-contract-metadata",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period"],
    faqs: [
      {
        q: "Where do SaaS renewal dates usually live?",
        a: "Often on the order form or subscription schedule, while auto-renew rules sit in the MSA. Read both — silent order forms do not override MSA auto-renew language.",
      },
      {
        q: "Should we track credit-card SaaS purchases?",
        a: "Yes, above your threshold. P-card SaaS is a major source of surprise auto-renewals and duplicate tools.",
      },
      {
        q: "Who owns SaaS renewal decisions?",
        a: "Business owner of the tool — IT for infrastructure, department head for line-of-business apps. IT procurement often coordinates.",
      },
      {
        q: "How do we find SaaS we are not tracking?",
        a: "Reconcile AP spend, SSO logs, and expense reports quarterly against your renewal register. Untracked SaaS appears in all three before legal knows the name.",
      },
    ],
    sections: [
      {
        heading: "Fields specific to SaaS",
        body: "Beyond standard renewal data, capture product name, environment (prod vs pilot), seat/license count, billing frequency, and true-up language.",
      },
      {
        heading: "Order form plus MSA discipline",
        body: "Store both documents linked to one renewal record. Extract dates from order form and renewal rules from MSA when split across files.",
      },
      {
        heading: "Materiality threshold",
        body: "Define dollar or risk threshold for inclusion — not just enterprise agreements. Document the threshold so audits understand omissions.",
      },
      {
        heading: "Duplicate and overlap detection",
        body: "Multiple departments buying the same category (collaboration, monitoring) fragments leverage at renewal. Spend analytics before renewal improves negotiating position.",
      },
      {
        heading: "Renewal vs true-up vs expansion",
        body: "Tag renewal events separately from mid-term seat adds. Expansion should update register without resetting notice history incorrectly.",
      },
    ],
  },
  {
    slug: "how-to-monitor-notice-periods-for-vendors",
    cluster: "contract",
    title: "How to Monitor Notice Periods for Vendors",
    summary:
      "How U.S. procurement teams monitor vendor contract notice periods — calculation, reminders, and proof of delivery before deadlines pass.",
    answer:
      "For each vendor contract with renewal or termination notice requirements, extract notice period length, notice method, and authorized recipients from the clause — then calculate decision deadline as renewal date minus notice period. Monitor decision deadlines, not renewal dates alone. Set reminders at 120, 90, and 30 days before each deadline with assigned contract owners. Flag ambiguous clauses (calendar vs business days) for legal interpretation before relying on automated dates. When notice is sent, log date, method, and delivery proof in the contract record. Portfolio monitoring beats spreadsheet columns that nobody updates after the first quarter.",
    primaryKeyword: "monitor vendor notice periods",
    relatedGuideSlugs: [
      "how-to-find-a-contract-notice-period",
      "how-to-track-notice-periods-across-a-portfolio",
      "how-to-avoid-missing-contract-renewal-deadlines",
      "how-to-give-notice-of-non-renewal",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "What is the most common notice period mistake?",
        a: "Calendaring the renewal date instead of the last day to give notice. By renewal date, the notice window has usually closed.",
      },
      {
        q: "Do notice periods vary by contract type?",
        a: "Yes — 30, 60, and 90 days are common; some MSAs require 180 days. Never assume 30 days without reading the clause.",
      },
      {
        q: "How do we handle conflicting notice language?",
        a: "Capture both versions, escalate to legal, and document chosen interpretation before setting automated reminders.",
      },
      {
        q: "Should vendors receive reminder copies?",
        a: "Internal reminders only — but confirm counterparty notice address annually so your non-renewal reaches the right mailbox.",
      },
    ],
    sections: [
      {
        heading: "Extract four notice fields",
        body: "Notice period length, calculation basis, required delivery method, and recipient address or portal. Missing any field breaks compliance at send time.",
      },
      {
        heading: "Decision deadline math",
        body: "Automate renewal date minus notice period. Manual counting errors spike in February and 31-day months — use system calculation.",
      },
      {
        heading: "Reminder schedule",
        body: "120/90/30 days before decision deadline for review start, negotiation window, and final action. One reminder on the last day is too late.",
      },
      {
        heading: "Proof of notice",
        body: "Store certified mail tracking, email read receipts, or vendor portal timestamps with the contract file. Proof matters when vendors dispute receipt.",
      },
      {
        heading: "Portfolio exceptions",
        body: "Evergreen and fixed-term-no-renew contracts still need termination notice monitoring — different trigger, same discipline.",
      },
    ],
  },
  {
    slug: "how-to-avoid-missing-contract-renewal-deadlines",
    cluster: "contract",
    title: "How to Avoid Missing Contract Renewal Deadlines",
    summary:
      "Operational tactics U.S. teams use to avoid missing contract renewal and notice deadlines — ownership, buffers, and escalation paths.",
    answer:
      "Missed renewal deadlines usually trace to three failures: no assigned owner, wrong date on the calendar (renewal vs decision deadline), or no escalation when owners ignore reminders. Fix all three. Assign primary and backup owner per contract, calculate decision deadlines from notice clauses, and start evaluation 60–90 days before the notice window closes — not on the last day. Escalate unacknowledged reminders to managers and finance sponsors. Track missed-deadline incidents monthly; repeat offenders need executive visibility or centralized legal ops ownership. Silence on reminders should trigger escalation — not another identical email.",
    primaryKeyword: "avoid missing contract renewal deadlines",
    relatedGuideSlugs: [
      "how-to-avoid-accidental-auto-renewals",
      "how-to-monitor-notice-periods-for-vendors",
      "how-to-alert-teams-before-contract-expiration",
      "how-to-track-contract-owners",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "What deadline matters most?",
        a: "The decision deadline — last day to give notice before auto-renewal or unwanted extension. Renewal date is often too late to act.",
      },
      {
        q: "How much buffer should we build in?",
        a: "Start internal review at least 60 days before notice deadline; aim to send notice 7–14 days before the final day required by contract.",
      },
      {
        q: "What if the owner is on vacation?",
        a: "Backup owner receives parallel reminders. Vacation is not an exception — reassign actively before PTO starts.",
      },
      {
        q: "Can we recover after missing a notice deadline?",
        a: "Sometimes via negotiation or early termination payment — often expensive. Treat notice deadline as hard operational cutoff.",
      },
    ],
    sections: [
      {
        heading: "Owner plus backup on every contract",
        body: "Contracts without named owners miss deadlines first. Backup covers PTO, turnover, and reorgs — update both when roles change.",
      },
      {
        heading: "Correct date on the calendar",
        body: "Audit sample contracts quarterly: does stored decision deadline match clause math? Spreadsheet formula drift is common after amendments.",
      },
      {
        heading: "Escalation ladder",
        body: "Owner reminder → manager → finance sponsor → legal ops → executive for material spend. Define dollar thresholds for each tier.",
      },
      {
        heading: "Acknowledgment requirement",
        body: "Owners click to acknowledge upcoming deadline in system — passive email delivery is insufficient for tier-one agreements.",
      },
      {
        heading: "Post-mortem on misses",
        body: "Every missed deadline gets root cause: data error, owner gap, or ignored alert. Fix process — not only blame individual.",
      },
    ],
  },
  {
    slug: "how-to-document-contract-renewal-decisions",
    cluster: "contract",
    title: "How to Document Contract Renewal Decisions",
    summary:
      "How to document renew, renegotiate, or terminate decisions for vendor contracts — audit trail, approvals, and linked evidence.",
    answer:
      "Every renewal decision needs a record: decision (renew, renegotiate, terminate, let expire), decision date, approver, rationale, financial impact, and linked notice or amendment. Capture business owner recommendation and finance concurrence for material spend. Store executed renewal amendment or non-renewal notice with delivery proof. When you renegotiate, log baseline terms, target improvements, and final outcome — future teams inherit context instead of re-learning vendor history. Undocumented decisions create audit gaps and repeat bad renewals because nobody remembers why you accepted a price increase three years ago.",
    primaryKeyword: "document contract renewal decisions",
    relatedGuideSlugs: [
      "how-to-renew-a-vendor-contract",
      "how-to-give-notice-of-non-renewal",
      "how-to-prepare-for-contract-renewal-meetings",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "What fields belong in a renewal decision log?",
        a: "Decision type, date, owners, approver, spend impact, summary rationale, and links to notice or signed renewal documents.",
      },
      {
        q: "Who must approve renewal decisions?",
        a: "Follow delegation of authority — business owner plus finance for material contracts; legal when terms change materially.",
      },
      {
        q: "Do we document 'do nothing' auto-renewals?",
        a: "Yes — intentional auto-renew should be explicit decision with approver, not absence of records.",
      },
      {
        q: "How long retain renewal decision records?",
        a: "Life of contract plus your retention policy — typically seven years after termination for commercial agreements.",
      },
    ],
    sections: [
      {
        heading: "Decision types to standardize",
        body: "Renew as-is, renew with amendment, renegotiate, non-renew, or migrate vendor. Consistent categories enable portfolio reporting.",
      },
      {
        heading: "Link decisions to actions",
        body: "Decision record should attach non-renewal notice, renewal order form, or negotiation notes — not live separately in email.",
      },
      {
        heading: "Financial impact capture",
        body: "Log prior year spend, proposed renewal value, and savings or increase. Finance reviews portfolio trends from this field.",
      },
      {
        heading: "Approval workflow",
        body: "Material renewals route through same approval matrix as new spend — prevents quiet budget growth through auto-renew inertia.",
      },
      {
        heading: "Historical context for successors",
        body: "When owner leaves, decision log is the handoff document. 'We renewed because sole source' beats inbox archaeology.",
      },
    ],
  },
  {
    slug: "how-to-renew-a-vendor-contract",
    cluster: "contract",
    title: "How to Renew a Vendor Contract",
    summary:
      "Step-by-step process for renewing U.S. vendor contracts — evaluation, approval, execution, and calendar updates.",
    answer:
      "Start renewal evaluation 90 days before the notice deadline: confirm business need, usage, spend trend, compliance status, and alternative options. Decide renew as-is, renegotiate, or exit — document the decision with approver. If renewing, execute amendment or renewal order form before the current term ends; verify auto-renew will not double-commit if you sign late. Update renewal register with new term end, notice period, and next decision deadline immediately after signature. Notify AP and business users of any pricing, scope, or payment term changes. Treat renewal as a controlled procurement event — not a silent rollover because nobody sent non-renewal notice.",
    primaryKeyword: "renew vendor contract",
    relatedGuideSlugs: [
      "how-to-document-contract-renewal-decisions",
      "how-to-negotiate-before-auto-renewal",
      "how-to-prepare-for-contract-renewal-meetings",
      "how-to-track-contract-renewals",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period"],
    faqs: [
      {
        q: "When should renewal discussions start?",
        a: "60–90 days before notice deadline for standard contracts; longer for complex MSAs or sole-source negotiations.",
      },
      {
        q: "Is signing a renewal order form always required?",
        a: "Depends on contract — some auto-renew without amendment if you do nothing. Know your clause before assuming signature is optional.",
      },
      {
        q: "What if we miss renewal but want to continue?",
        a: "You may already be auto-renewed on existing terms — or operating month-to-month. Read the clause and negotiate quickly with legal.",
      },
      {
        q: "Who executes the renewal document?",
        a: "Authorized signatory per delegation matrix — often procurement or legal for MSAs, business owner for order forms within approved spend.",
      },
    ],
    sections: [
      {
        heading: "Pre-renewal evaluation checklist",
        body: "Validate business need, performance, compliance, spend, and market alternatives before committing to another term.",
      },
      {
        heading: "Internal approval path",
        body: "Route renewal through spend authority and legal when terms change. Even 'same terms' renewals may need finance visibility above threshold.",
      },
      {
        heading: "Execution timing",
        body: "Sign before notice deadline if non-renewing; sign before term end if fixed renewal requires amendment. Late signature plus auto-renew creates overlap confusion.",
      },
      {
        heading: "Update systems after signature",
        body: "Renewal register, vendor master, and AP pricing tables must update same week — stale terms cause invoice disputes.",
      },
      {
        heading: "Communicate changes downstream",
        body: "Notify users of price, scope, or SLA changes. Renewal without communication breeds shadow purchases and budget surprises.",
      },
    ],
  },
  {
    slug: "how-to-negotiate-before-auto-renewal",
    cluster: "contract",
    title: "How to Negotiate Before Auto-Renewal",
    summary:
      "How procurement negotiates pricing and terms before a vendor contract auto-renews — leverage, timing, and fallback to non-renewal.",
    answer:
      "Negotiation leverage peaks before the notice deadline — after that, silence may lock you into another term. Start 90–120 days out with spend data, usage metrics, and competitive benchmarks. Request proposal in writing; compare to current order form and MSA renewal terms. Use credible non-renewal alternative — even sole-source vendors respond when exit is plausible. Document negotiation rounds and fallback plan. If vendor refuses movement, escalate renew-vs-exit decision to finance sponsor before notice window closes. Auto-renew without negotiation is how SaaS and services spend drifts 5–15% annually without competitive pressure.",
    primaryKeyword: "negotiate before auto renewal",
    relatedGuideSlugs: [
      "how-to-avoid-accidental-auto-renewals",
      "how-to-prepare-for-a-contract-renegotiation",
      "how-to-compare-renewal-terms-to-market",
      "how-to-give-notice-of-non-renewal",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period"],
    faqs: [
      {
        q: "When is it too late to negotiate?",
        a: "After notice deadline if auto-renew applies — you may be committed to another term unless vendor agrees to amend anyway.",
      },
      {
        q: "What data helps most in renewal negotiation?",
        a: "Historical spend, seat utilization, competitive quotes, and incident/SLA performance. Vendors discount when renewal is tied to measurable value.",
      },
      {
        q: "Should we send non-renewal notice to get attention?",
        a: "Only if genuinely willing to exit — bluff notices damage trust. Credible exit planning beats empty threats.",
      },
      {
        q: "Can legal terms be renegotiated at renewal?",
        a: "Yes — renewal is natural point to update liability, indemnity, and data terms, not only price.",
      },
    ],
    sections: [
      {
        heading: "Timing relative to notice window",
        body: "Open negotiation when you still have walk-away option. Map internal approval time so signed renewal or notice sends before deadline.",
      },
      {
        heading: "Build the fact pack",
        body: "Spend trend, user counts, support tickets, and benchmark pricing. Fact pack goes to vendor with clear ask — not open-ended 'best and final.'",
      },
      {
        heading: "Multi-year vs annual tradeoffs",
        body: "Vendors trade discount for term length. Finance should approve commitment length — not only headline rate.",
      },
      {
        heading: "Document walk-away plan",
        body: "Migration cost, transition timeline, and alternate vendor shortlist strengthen negotiation and speed decision if talks fail.",
      },
      {
        heading: "Close with written amendment",
        body: "Verbal discounts without order form amendment do not survive account rep turnover.",
      },
    ],
  },
  {
    slug: "how-to-track-contract-owners",
    cluster: "contract",
    title: "How to Track Contract Owners",
    summary:
      "How U.S. organizations assign and track contract owners — primary, backup, and escalation when roles change.",
    answer:
      "Every contract in your register needs a primary business owner accountable for renewal decisions and a backup for continuity. Owners should be people — not departments or generic mailing lists. Record assignment at contract intake and revalidate quarterly. When employees change roles, HR or legal ops triggers reassignment workflow within five business days. Owners receive renewal reminders, approve negotiation strategy, and confirm notice was sent. Dashboard contracts missing owners or with departed owners — those are the agreements that auto-renew without evaluation.",
    primaryKeyword: "track contract owners",
    relatedGuideSlugs: [
      "how-to-avoid-missing-contract-renewal-deadlines",
      "how-to-centralize-contract-metadata",
      "how-to-manage-contract-renewals-in-a-portfolio",
      "how-to-alert-teams-before-contract-expiration",
    ],
    relatedGlossary: ["notice-period"],
    faqs: [
      {
        q: "Who should be contract owner vs legal owner?",
        a: "Business owner decides renew/exit and budget; legal owns template and risk review. Both names should be on the record.",
      },
      {
        q: "Can one person own dozens of contracts?",
        a: "Possible for low-dollar SaaS; material contracts need distributed ownership aligned to budget holders.",
      },
      {
        q: "How handle owner disputes?",
        a: "Procurement or finance assigns owner based on budget authority — not who signed years ago.",
      },
      {
        q: "Should owners certify quarterly?",
        a: "Yes — lightweight attestation that they still own the contract and dates are correct catches org changes early.",
      },
    ],
    sections: [
      {
        heading: "Assign at contract intake",
        body: "Owner fields mandatory before contract enters active register. Intake without owner goes to legal ops queue — not active status.",
      },
      {
        heading: "Primary and backup structure",
        body: "Backup receives same renewal alerts and can act during primary PTO. Both updated on reorg.",
      },
      {
        heading: "Integration with HR changes",
        body: "Termination or transfer feeds should flag owned contracts for reassignment before access cuts.",
      },
      {
        heading: "Owner workload visibility",
        body: "Report contracts per owner — rebalance when individuals exceed manageable count for material agreements.",
      },
      {
        heading: "Escalation to budget holder",
        body: "If owner non-responsive, escalate to department head who holds spend authority for that vendor category.",
      },
    ],
  },
  {
    slug: "how-to-centralize-contract-metadata",
    cluster: "contract",
    title: "How to Centralize Contract Metadata",
    summary:
      "How legal operations centralizes contract metadata — key dates, values, clauses, and links — in one searchable register.",
    answer:
      "Centralized contract metadata means one register holds structured fields extracted from each agreement: parties, effective date, term, renewal date, notice period, decision deadline, value, owner, auto-renew flag, governing law, and document link. Stop relying on filename conventions in shared drives. Define required fields by contract type — MSA vs order form vs SOW. Validate at intake; reject incomplete records. Enable search and portfolio reports from metadata — not full-text hunt. Sync metadata updates when amendments change dates or value. Good metadata powers renewal alerts, spend analytics, and audit response without opening every PDF.",
    primaryKeyword: "centralize contract metadata",
    relatedGuideSlugs: [
      "how-to-track-contract-renewals",
      "how-to-link-contracts-to-vendor-records",
      "how-to-manage-contract-renewals-in-a-portfolio",
      "how-to-move-off-shared-folders",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "What metadata is minimum viable?",
        a: "Counterparty, owner, effective date, term end, renewal date, notice period, decision deadline, annual value, auto-renew Y/N, document link.",
      },
      {
        q: "Who enters metadata?",
        a: "Legal ops or contract admin at intake; business owners validate owner and value fields.",
      },
      {
        q: "How handle legacy contracts?",
        a: "Prioritize by spend and upcoming renewal — phased backfill beats waiting for 100% before going live.",
      },
      {
        q: "Does metadata replace storing the PDF?",
        a: "No — metadata indexes the agreement; executed document remains source of truth for disputes.",
      },
    ],
    sections: [
      {
        heading: "Schema by contract type",
        body: "MSA, order form, and SOW need different optional fields — one flexible schema with required core prevents garbage-in.",
      },
      {
        heading: "Intake validation rules",
        body: "Block save without owner, dates, and link. Optional AI extraction with human confirmation speeds intake without skipping review.",
      },
      {
        heading: "Amendment updates",
        body: "Amendment workflow must update metadata — not only add PDF to folder. Stale dates break renewal alerts.",
      },
      {
        heading: "Search and reporting",
        body: "Portfolio views: renewals next 90 days, missing owners, auto-renew over $X. Metadata quality determines report trust.",
      },
      {
        heading: "Vendor linkage",
        body: "Every contract record ties to vendor master ID for spend rollups and onboarding cross-checks.",
      },
    ],
  },
  {
    slug: "how-to-alert-teams-before-contract-expiration",
    cluster: "contract",
    title: "How to Alert Teams Before Contract Expiration",
    summary:
      "How to configure renewal and expiration alerts that reach the right owners — without alert fatigue or silent auto-renewals.",
    answer:
      "Effective expiration alerts target decision deadlines with tiered lead times — 120, 90, and 30 days — sent to contract owner, backup, and finance sponsor for material spend. Include contract name, vendor, decision required, and link to register record. Require acknowledgment for high-value agreements. Suppress duplicate daily emails; escalate unacknowledged alerts to managers at 14 days. Distinguish expiration (fixed term ending) from auto-renew decision points — different email templates prevent wrong action. Test alert delivery quarterly; broken integrations cause more misses than owner negligence.",
    primaryKeyword: "alert teams contract expiration",
    relatedGuideSlugs: [
      "how-to-avoid-missing-contract-renewal-deadlines",
      "how-to-set-renewal-reminders-by-contract-type",
      "how-to-set-up-notifications-that-actually-fire",
      "how-to-track-contract-owners",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "How many reminders are enough?",
        a: "Three before decision deadline plus escalation if unacknowledged — not daily spam that owners mute.",
      },
      {
        q: "Should alerts go to legal for every contract?",
        a: "Legal ops receives portfolio digest; business owner gets actionable alerts. Legal on every email creates noise.",
      },
      {
        q: "What about fixed-term contracts with no auto-renew?",
        a: "Alert on term end for wind-down planning — different CTA than auto-renew notice deadline.",
      },
      {
        q: "How prevent alert fatigue?",
        a: "Tier alerts by spend and risk — low-dollar renewals get lighter cadence; tier-one gets acknowledgment requirement.",
      },
    ],
    sections: [
      {
        heading: "Alert content that drives action",
        body: "Subject line names vendor and deadline. Body states decision options and links to contract file — not generic 'contract expiring soon.'",
      },
      {
        heading: "Recipient matrix",
        body: "Owner, backup, finance sponsor above threshold, legal ops CC on tier-one only. Document matrix in runbook.",
      },
      {
        heading: "Acknowledgment and escalation",
        body: "High-value alerts require click-to-acknowledge; unacked triggers manager escalation automatically.",
      },
      {
        heading: "Separate templates by renewal type",
        body: "Auto-renew, fixed expiry, and evergreen termination each need distinct instructions — one template confuses owners.",
      },
      {
        heading: "Monitor alert health",
        body: "Track bounce rates, unacked percentage, and missed deadlines post-alert. Broken email rules look like owner failure.",
      },
    ],
  },
  {
    slug: "how-to-handle-evergreen-vendor-contracts",
    cluster: "contract",
    title: "How to Handle Evergreen Vendor Contracts",
    summary:
      "How operations teams manage evergreen vendor contracts — termination notice, periodic review, and spend control without fixed renewal dates.",
    answer:
      "Evergreen contracts continue until terminated on notice — common in maintenance, utilities, and month-to-month services. They still have notice requirements for termination; track those notice periods and review dates even without a renewal calendar event. Schedule periodic business reviews — annual minimum — to validate need, pricing, and performance. Set internal review reminders independent of vendor notice clauses so spend does not run unchecked for years. Document termination decisions with notice proof like fixed-term non-renewals. Do not confuse evergreen with auto-renew fixed terms — termination mechanics differ.",
    primaryKeyword: "evergreen vendor contracts",
    relatedGuideSlugs: [
      "what-an-evergreen-contract-means",
      "how-to-monitor-notice-periods-for-vendors",
      "how-to-offboard-vendors-at-contract-end",
      "how-to-manage-contract-renewals-in-a-portfolio",
    ],
    relatedGlossary: ["evergreen-contract", "notice-period"],
    faqs: [
      {
        q: "Do evergreen contracts ever expire on their own?",
        a: "No — they continue until a party terminates per the agreement. You must give notice to stop spend.",
      },
      {
        q: "What date should we track?",
        a: "Termination notice period and internal review date — not a renewal date that does not exist.",
      },
      {
        q: "Can evergreen contracts auto-renew into longer terms?",
        a: "Some hybrid clauses exist — read carefully. Pure evergreen rolls period to period; auto-renew fixed term extends for defined length.",
      },
      {
        q: "How often review evergreen spend?",
        a: "Annual business review minimum; quarterly for high spend or volatile usage categories.",
      },
    ],
    sections: [
      {
        heading: "Identify evergreen vs auto-renew",
        body: "Extract clause type at intake. Misclassified evergreen treated as renewal causes missed termination windows.",
      },
      {
        heading: "Termination notice tracking",
        body: "Record notice period and method for ending evergreen services — same proof discipline as non-renewal on fixed terms.",
      },
      {
        heading: "Periodic business review",
        body: "Internal calendar event: validate need, benchmark pricing, check SLA performance. Review outcome logged on contract record.",
      },
      {
        heading: "Spend monitoring",
        body: "Evergreen spend creeps via rate tables and usage true-ups. Tie AP spend feeds to contract for anomaly alerts.",
      },
      {
        heading: "Exit planning",
        body: "Maintain transition requirements — data return, equipment removal — before sending termination notice on long-running services.",
      },
    ],
  },
  {
    slug: "how-to-prepare-for-contract-renewal-meetings",
    cluster: "contract",
    title: "How to Prepare for Contract Renewal Meetings",
    summary:
      "How procurement and business owners prepare for vendor contract renewal meetings — data pack, stakeholders, and decision criteria.",
    answer:
      "A renewal meeting needs a fact pack distributed 48 hours ahead: current terms, spend history, usage data, performance issues, market benchmarks, and recommended strategy (renew, renegotiate, exit). Invite business owner, finance, legal for material contracts, and IT if technical dependency. Define decision criteria before the call — target savings, must-have terms, walk-away point. Assign pre-work: legal reviews clause risks, finance validates budget, owner confirms operational need. End with documented action owner and deadline relative to notice period. Unprepared renewal calls default to vendor's timeline and pricing.",
    primaryKeyword: "contract renewal meeting preparation",
    relatedGuideSlugs: [
      "how-to-renew-a-vendor-contract",
      "how-to-negotiate-before-auto-renewal",
      "how-to-compare-renewal-terms-to-market",
      "how-to-document-contract-renewal-decisions",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "Who must attend renewal meetings?",
        a: "Business owner always; finance above spend threshold; legal when terms or risk change; procurement facilitates.",
      },
      {
        q: "What if we lack usage data?",
        a: "Request from vendor pre-meeting or pull from internal systems — negotiating without usage weakens price discussions.",
      },
      {
        q: "How long before notice deadline hold the meeting?",
        a: "At least 30–45 days before notice deadline to allow internal approval and vendor negotiation time.",
      },
      {
        q: "Should vendors attend internal renewal meetings?",
        a: "No — internal alignment first. Vendor joins separate negotiation calls with unified internal position.",
      },
    ],
    sections: [
      {
        heading: "Renewal fact pack contents",
        body: "Contract summary, spend 24 months, SLA/incident log, competitive alternatives, draft target terms, and notice deadline countdown.",
      },
      {
        heading: "Stakeholder roles",
        body: "Owner: need validation. Finance: budget. Legal: risk. Procurement: commercial strategy. Clear roles prevent circular discussion.",
      },
      {
        heading: "Decision criteria upfront",
        body: "Define success: max price increase, required liability cap, exit assistance — before vendor quotes anchor you.",
      },
      {
        heading: "Meeting outputs",
        body: "Minutes with decision direction, action owners, and dates. Upload to contract record same day.",
      },
      {
        heading: "Follow-through to notice deadline",
        body: "Calendar internal milestones from meeting date to notice send — approval, signature, vendor notice if exiting.",
      },
    ],
  },
  {
    slug: "how-to-compare-renewal-terms-to-market",
    cluster: "contract",
    title: "How to Compare Renewal Terms to Market",
    summary:
      "How U.S. procurement benchmarks vendor renewal pricing and terms against market — data sources, normalization, and negotiation leverage.",
    answer:
      "Market comparison starts with normalized unit economics — per seat, per hour, per unit — not headline invoice totals. Gather two to three alternative quotes or published pricing where competitive market exists. Use peer benchmarks, GPO rates, or analyst reports for categories where RFP is impractical. Adjust for scope differences before claiming vendor is high. Document comparison in renewal file to support finance approval and future audits. Even sole-source renewals benefit from benchmark conversation — vendors know when you have data versus bluffing.",
    primaryKeyword: "compare renewal terms market",
    relatedGuideSlugs: [
      "how-to-negotiate-before-auto-renewal",
      "how-to-prepare-for-contract-renewal-meetings",
      "how-to-prepare-for-a-contract-renegotiation",
      "how-to-renew-a-vendor-contract",
    ],
    relatedGlossary: ["auto-renewal-clause"],
    faqs: [
      {
        q: "What if no direct competitor exists?",
        a: "Compare to internal ROI threshold, historical escalation rate, and substitute workflows — document why renewal still makes sense.",
      },
      {
        q: "How normalize SaaS pricing?",
        a: "Cost per seat per month annualized, including support tiers and implementation fees amortized over term.",
      },
      {
        q: "Can we use last RFP from three years ago?",
        a: "Refresh quotes — stale benchmarks weaken negotiation and misstate market if category shifted.",
      },
      {
        q: "Who signs off on market comparison?",
        a: "Procurement prepares; finance approves commercial reasonableness for material renewals.",
      },
    ],
    sections: [
      {
        heading: "Normalize before comparing",
        body: "Align term length, volume, service level, and geography. Apples-to-oranges comparisons backfire in vendor negotiations.",
      },
      {
        heading: "Data sources",
        body: "Competitive quotes, GPO contracts, peer networking, analyst reports, and vendor public rate cards — use what fits category.",
      },
      {
        heading: "Document assumptions",
        body: "Record date of benchmark, sources, and adjustments. Future renewals inherit defensible history.",
      },
      {
        heading: "Present internally before vendor",
        body: "Finance and owner align on target range using benchmark — unified number beats split messages to vendor.",
      },
      {
        heading: "Update post-renewal",
        body: "Log achieved vs market and vs prior term. Builds portfolio view of vendor pricing trajectory.",
      },
    ],
  },
  {
    slug: "how-to-archive-expired-contracts",
    cluster: "contract",
    title: "How to Archive Expired Contracts",
    summary:
      "How legal operations archives expired vendor contracts — retention, access controls, and metadata without losing audit trail.",
    answer:
      "When a contract expires or terminates, move it to archived status — do not delete. Retain executed documents, amendments, notices, and renewal decision logs for your retention period — often seven years post-termination for commercial agreements. Strip archived records from active renewal alerts while preserving searchability. Restrict edit access; allow read for audit and litigation hold. Update vendor master to reflect inactive relationship where appropriate. Archive workflow should capture termination date, reason, and final payment obligations so AP does not pay against expired rates.",
    primaryKeyword: "archive expired contracts",
    relatedGuideSlugs: [
      "how-to-offboard-vendors-at-contract-end",
      "how-to-set-a-document-retention-policy",
      "how-to-document-contract-renewal-decisions",
      "how-to-centralize-contract-metadata",
    ],
    relatedGlossary: ["notice-period"],
    faqs: [
      {
        q: "When mark a contract archived?",
        a: "After termination effective date and completion of wind-down obligations — or immediately upon executed mutual termination with documented date.",
      },
      {
        q: "Should archived contracts stay linked to vendor?",
        a: "Yes — historical relationship context matters for audits, disputes, and future re-engagement diligence.",
      },
      {
        q: "Can users still download archived files?",
        a: "Read-only access for authorized roles — legal, audit, finance. Not active procurement edit.",
      },
      {
        q: "How handle litigation hold?",
        a: "Litigation hold overrides normal destruction schedule — flag records and suspend auto-delete.",
      },
    ],
    sections: [
      {
        heading: "Archive trigger checklist",
        body: "Termination notice sent, effective date passed, final invoice processed, data returned if required — then archive.",
      },
      {
        heading: "Metadata on archive",
        body: "Set status archived, termination date, reason code, and disabling renewal alerts in same transaction.",
      },
      {
        heading: "Retention alignment",
        body: "Match corporate retention policy — coordinate with records management on destruction dates after hold clears.",
      },
      {
        heading: "AP and PO alignment",
        body: "Notify AP to block new POs against expired contract pricing. Archive without AP notice causes payment on dead terms.",
      },
      {
        heading: "Search and audit access",
        body: "Archived contracts remain in search with clear status badge — auditors find history without mixing into active renewal queue.",
      },
    ],
  },
  {
    slug: "how-to-link-contracts-to-vendor-records",
    cluster: "contract",
    title: "How to Link Contracts to Vendor Records",
    summary:
      "How to link executed contracts to vendor master records — one vendor, many agreements, and clean hierarchy for renewals.",
    answer:
      "Link every executed contract to a single vendor master ID in ERP and your contract register. One vendor may have MSA, multiple order forms, and SOWs — parent-child hierarchy with shared counterparty ID. Do not store contracts only by vendor name string; names change and duplicates break linkage. At intake, match contract counterparty to vendor TIN and legal name from onboarding packet. Surface active contracts on vendor profile for AP and procurement. Renewal alerts roll up to vendor level for portfolio view while firing per document. Broken links cause payment on expired order forms and missed MSA notice deadlines.",
    primaryKeyword: "link contracts vendor records",
    relatedGuideSlugs: [
      "how-to-centralize-contract-metadata",
      "how-to-track-msa-and-sow-renewals-together",
      "what-is-a-vendor-packet",
      "how-to-manage-contract-renewals-in-a-portfolio",
    ],
    relatedGlossary: ["vendor-onboarding", "notice-period"],
    faqs: [
      {
        q: "What if vendor has multiple legal entities?",
        a: "Separate vendor IDs per entity — each with own contracts. Parent guarantee does not merge IDs without formal structure.",
      },
      {
        q: "How link legacy contracts before vendor ID existed?",
        a: "Match on TIN and legal name during data migration; manual review for ambiguous matches.",
      },
      {
        q: "Should POs link to contracts too?",
        a: "Ideal state: PO references active contract or order form ID — enables spend against correct terms.",
      },
      {
        q: "Who owns linkage quality?",
        a: "Legal ops at contract intake; procurement validates on onboarding; AP flags invoice-term mismatches.",
      },
    ],
    sections: [
      {
        heading: "Vendor ID as foreign key",
        body: "Contract record stores vendor master ID — mandatory field. Search and renewal reports join on ID not name.",
      },
      {
        heading: "Hierarchy: MSA, order form, SOW",
        body: "Child documents reference parent MSA; renewal clauses may live at parent while dates live on child.",
      },
      {
        heading: "Intake matching rules",
        body: "Auto-match counterparty to vendor registry; queue exceptions for new entities or name mismatches.",
      },
      {
        heading: "Vendor profile view",
        body: "Procurement sees all active agreements, upcoming deadlines, and compliance status from one vendor page.",
      },
      {
        heading: "Reconciliation cadence",
        body: "Quarterly audit: AP top vendors vs contract linkage — find spend without governing agreement.",
      },
    ],
  },
  {
    slug: "how-to-track-msa-and-sow-renewals-together",
    cluster: "contract",
    title: "How to Track MSA and SOW Renewals Together",
    summary:
      "How enterprise teams track MSA and SOW renewals together — linked dates, notice rules, and avoiding orphan statements of work.",
    answer:
      "Enterprise vendor relationships split terms across MSA and SOWs or order forms. Track them as a linked set: MSA holds governing renewal and termination rules while SOWs hold project dates and fees. Extract notice period from MSA even when SOW end date appears sooner. When SOW expires but MSA remains, clarify whether work continues under MSA terms or requires new SOW. Renewal calendar should show parent-child relationships with roll-up alerts to contract owner. Renegotiating SOW without checking MSA auto-renew has locked you into another enterprise term — read both before any renewal signature.",
    primaryKeyword: "track msa sow renewals",
    relatedGuideSlugs: [
      "how-to-read-a-contract-term-and-renewal-clause",
      "how-to-link-contracts-to-vendor-records",
      "how-to-review-a-statement-of-work",
      "how-to-track-contract-renewals",
    ],
    relatedGlossary: ["auto-renewal-clause", "notice-period"],
    faqs: [
      {
        q: "Which document governs renewal if SOW is silent?",
        a: "Usually the MSA — SOW silence rarely overrides MSA auto-renew unless explicitly stated.",
      },
      {
        q: "Do we renew MSA and SOW on same cycle?",
        a: "Not always — SOWs may be project-based while MSA auto-renews. Track each date but apply MSA notice rules globally.",
      },
      {
        q: "What about expiring SOW under active MSA?",
        a: "Decide if project ends or new SOW needed. MSA staying active does not automatically extend SOW scope or pricing.",
      },
      {
        q: "How display in renewal register?",
        a: "Parent MSA row with child SOW rows nested; alerts fire on earliest actionable deadline with context.",
      },
    ],
    sections: [
      {
        heading: "Parent-child linking",
        body: "Every SOW record points to MSA ID. Renewal clause reference field notes which document controls extension.",
      },
      {
        heading: "Date extraction discipline",
        body: "SOW: project end and fees. MSA: renewal term and notice. Do not copy SOW end date as renewal date without clause check.",
      },
      {
        heading: "Unified owner",
        body: "Same business owner across MSA and active SOWs for one vendor — avoids split decisions on related agreements.",
      },
      {
        heading: "Renewal sequencing",
        body: "If exiting vendor, coordinate MSA non-renewal with SOW wind-down. Partial exit on SOW only may still bind you at MSA level.",
      },
      {
        heading: "Amendment propagation",
        body: "MSA amendment changing notice period updates alert math for all child documents — cascade metadata updates.",
      },
    ],
  },
  {
    slug: "how-to-set-renewal-reminders-by-contract-type",
    cluster: "contract",
    title: "How to Set Renewal Reminders by Contract Type",
    summary:
      "How legal ops configures renewal reminder schedules by contract type — SaaS, MSA, facilities, evergreen — without one-size-fits-all alerts.",
    answer:
      "Different contract types need different reminder cadences and lead times. SaaS order forms: 90/60/30 days before decision deadline. Enterprise MSA: 180/120/90 for legal and security review. Facilities and construction: longer lead for site exit planning. Evergreen: annual internal review reminder plus termination notice tracking. Configure rules in your contract system by type tag — not manual calendar entry per contract. Materiality tier overlays spend: high-dollar contracts add executive escalation. Document reminder policy so owners understand why SaaS and MSA alerts differ.",
    primaryKeyword: "renewal reminders by contract type",
    relatedGuideSlugs: [
      "how-to-alert-teams-before-contract-expiration",
      "how-to-track-saas-contract-renewals",
      "how-to-handle-evergreen-vendor-contracts",
      "how-to-set-up-notifications-that-actually-fire",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "Should all contracts use 90-day reminders?",
        a: "No — match lead time to notice period and internal approval duration. 90-day notice needs earlier start than 30-day notice.",
      },
      {
        q: "How tag contract types consistently?",
        a: "Use controlled taxonomy at intake: SaaS, MSA, SOW, facilities, professional services, evergreen. Avoid free-text only.",
      },
      {
        q: "Can rules change retroactively?",
        a: "Apply new rules on next review cycle or contract amendment — note policy version on record.",
      },
      {
        q: "What about low-dollar contracts?",
        a: "Lighter reminder cadence with higher spend threshold for escalation — reduces noise while protecting material spend.",
      },
    ],
    sections: [
      {
        heading: "Contract type taxonomy",
        body: "Define types with default notice assumptions and reminder templates. Intake assigns type — drives automation.",
      },
      {
        heading: "Lead time matrix",
        body: "Rows: contract type. Columns: first, second, final reminder days before decision deadline. Publish internally.",
      },
      {
        heading: "Spend tier overlay",
        body: "Above $X annual value adds finance sponsor and exec escalation regardless of type.",
      },
      {
        heading: "Evergreen exception path",
        body: "Separate rule set: annual review reminder, not renewal date. Termination notice tracked independently.",
      },
      {
        heading: "Test rules on sample portfolio",
        body: "Before rollout, simulate alerts against ten contracts per type — verify dates and recipients.",
      },
    ],
  },
  {
    slug: "how-to-audit-contract-renewal-compliance",
    cluster: "contract",
    title: "How to Audit Contract Renewal Compliance",
    summary:
      "How internal audit tests contract renewal compliance — notice proof, owner assignment, and decision documentation.",
    answer:
      "Renewal compliance audit samples contracts with decision deadlines in the review period and tests: Was owner assigned? Was decision deadline calculated correctly? Was renew/exit decision documented before deadline? If notice sent, is delivery proof on file? If auto-renewed, was that intentional and approved? Stratify by spend and contract type — include SaaS order forms, not only MSAs in legal's shared drive. Common findings: wrong deadline math, missing non-renewal proof, and undocumented auto-renew acceptance. Report compliance rate and remediate register gaps before they become accidental renewals or external audit findings.",
    primaryKeyword: "audit contract renewal compliance",
    relatedGuideSlugs: [
      "how-to-document-contract-renewal-decisions",
      "how-to-avoid-missing-contract-renewal-deadlines",
      "how-to-audit-vendor-onboarding-records",
      "how-to-prepare-for-a-compliance-audit",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause", "audit-trail"],
    faqs: [
      {
        q: "What is a critical renewal compliance failure?",
        a: "Auto-renewal with no documented decision and no negotiation attempt on material spend — indicates control breakdown.",
      },
      {
        q: "How many contracts to sample?",
        a: "All tier-one renewals in period plus 25–40 stratified sample of remainder for internal audit.",
      },
      {
        q: "Does audit include SaaS order forms?",
        a: "Yes — often highest miss rate because they sit outside traditional legal files.",
      },
      {
        q: "Who remediates findings?",
        a: "Legal ops fixes register data; business owners supply missing decisions; procurement updates owner assignments.",
      },
    ],
    sections: [
      {
        heading: "Define compliance criteria",
        body: "Publish what 'compliant renewal' means: owner, correct deadline, documented decision, proof if notice sent.",
      },
      {
        heading: "Test deadline accuracy",
        body: "Recalculate decision deadline from clause for sample — compare to register. Formula errors are systemic.",
      },
      {
        heading: "Decision documentation review",
        body: "Every sampled renewal should have decision record within policy timeline — not retroactive notes after audit ask.",
      },
      {
        heading: "Notice proof verification",
        body: "For non-renewals, verify method and date match contract requirements — email to wrong address fails compliance.",
      },
      {
        heading: "Remediation tracking",
        body: "Open findings with owner and due date; re-test failed population after fix.",
      },
    ],
  },
  {
    slug: "how-to-manage-contract-renewals-in-a-portfolio",
    cluster: "contract",
    title: "How to Manage Contract Renewals in a Portfolio",
    summary:
      "How U.S. teams manage vendor contract renewals at portfolio scale — prioritization, dashboards, and governance rhythms.",
    answer:
      "Portfolio renewal management ranks contracts by spend, risk, and deadline proximity — then applies consistent governance. Monthly renewal council reviews 90-day pipeline: owners confirm status, finance flags budget impact, legal flags high-risk terms. Dashboard shows upcoming decision deadlines, unowned contracts, and auto-renew exposure dollars. Batch similar vendors for joint negotiation where leverage exists. Standard playbooks by category reduce reinventing process each cycle. At scale, spreadsheets fail — you need searchable metadata, automated deadlines, accountable owners on every row, and quarterly data hygiene so reorgs do not leave ghost owners on active alerts.",
    primaryKeyword: "manage contract renewals portfolio",
    relatedGuideSlugs: [
      "how-to-track-contract-renewals",
      "how-to-track-notice-periods-across-a-portfolio",
      "how-to-centralize-contract-metadata",
      "how-to-maintain-a-contract-renewal-calendar",
    ],
    relatedGlossary: ["notice-period", "auto-renewal-clause"],
    faqs: [
      {
        q: "How prioritize among hundreds of renewals?",
        a: "Rank by annual spend, then auto-renew risk, then strategic dependency. Low-dollar renewals batch with lighter process.",
      },
      {
        q: "What is a renewal council?",
        a: "Monthly cross-functional review of upcoming deadlines — procurement, finance, legal ops — not every owner in room.",
      },
      {
        q: "How measure portfolio health?",
        a: "Metrics: percent with assigned owner, percent decisions documented on time, auto-renew dollars without review.",
      },
      {
        q: "When do spreadsheets stop working?",
        a: "Typically past 50–75 active contracts with mixed types — error rate and missed deadlines climb quickly.",
      },
    ],
    sections: [
      {
        heading: "Portfolio segmentation",
        body: "Tier contracts by spend and criticality. Apply full governance to tier one; streamlined path to tier three with same deadline discipline.",
      },
      {
        heading: "90-day pipeline review",
        body: "Standing meeting agenda: new entries, status updates, escalations, budget rollup. Decisions logged in register.",
      },
      {
        heading: "Exposure dashboard",
        body: "Show dollars subject to auto-renew in next 90 days without documented decision — executive attention driver.",
      },
      {
        heading: "Category playbooks",
        body: "SaaS, staffing, facilities each get renewal checklist — owners follow playbook instead of ad-hoc process.",
      },
      {
        heading: "Continuous data hygiene",
        body: "Portfolio view is only as good as metadata. Quarterly data quality sprint fixes owners, dates, and missing links.",
      },
    ],
  },
  {
    slug: "how-to-offboard-vendors-at-contract-end",
    cluster: "contract",
    title: "How to Offboard Vendors at Contract End",
    summary:
      "How operations offboards vendors at contract end — notice, access removal, data return, and AP cutoff coordination.",
    answer:
      "Vendor offboarding starts before contract end: confirm termination or non-renewal notice was sent properly, execute wind-down plan, and communicate internal cutoff date to AP and users. Revoke system access, collect company data and equipment, and obtain vendor confirmation of data deletion where required. Block new POs and schedule final payment against executed closeout terms. Update vendor status to inactive, archive contract, and retain records per retention policy. Offboarding is not only legal notice — operational cutoffs prevent shadow usage and post-term payments that create liability.",
    primaryKeyword: "offboard vendors contract end",
    relatedGuideSlugs: [
      "how-to-give-notice-of-non-renewal",
      "how-to-archive-expired-contracts",
      "how-to-block-payments-for-non-compliant-vendors",
      "how-to-handle-evergreen-vendor-contracts",
    ],
    relatedGlossary: ["notice-period", "evergreen-contract"],
    faqs: [
      {
        q: "When start offboarding planning?",
        a: "At non-renewal decision or minimum 30–60 days before term end for complex services — longer for IT and PHI vendors.",
      },
      {
        q: "What if users keep purchasing after term end?",
        a: "Disable vendor in ERP, revoke catalog access, and communicate cutoff — AP rejects invoices without override.",
      },
      {
        q: "Do we need vendor data return certificate?",
        a: "Required for many DPAs and BAAs — obtain written confirmation of destruction or return.",
      },
      {
        q: "Can vendor relationship reopen later?",
        a: "Yes — new onboarding or reactivation with fresh packet if significant time passed or compliance lapsed.",
      },
    ],
    sections: [
      {
        heading: "Offboarding checklist",
        body: "Notice proof, internal announcement, access revocation, data return, final invoice, archive contract, vendor master inactive.",
      },
      {
        heading: "Cross-functional coordination",
        body: "IT, security, AP, legal, and business owner each own checklist items — single project owner tracks completion.",
      },
      {
        heading: "AP and PO cutoff",
        body: "Set hard PO block date aligned to contract end. Final payment terms documented before last disbursement.",
      },
      {
        heading: "Data and access",
        body: "Revoke SSO, API keys, facility badges, and shared accounts. Verify backup and transition of critical data.",
      },
      {
        heading: "Records retention",
        body: "Archive contract and offboarding evidence — do not delete because relationship ended. Supports future disputes and audits.",
      },
    ],
  },
];
