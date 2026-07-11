import type { GuideArticleSpec } from "../create-guide";

export const vendorPhase2Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-build-a-vendor-onboarding-checklist",
    cluster: "vendor",
    title: "How to Build a Vendor Onboarding Checklist",
    summary:
      "How U.S. procurement and AP teams build a vendor onboarding checklist that covers tax, insurance, compliance, and payment setup — without letting critical steps slip through email threads.",
    answer:
      "Start with your risk tiers: what every vendor must provide before first PO, what high-spend vendors add, and what regulated categories require extra screening. List each document and approval as a discrete checklist item with an owner, deadline, and pass/fail criteria. Include W-9, COI, banking, contract execution, exclusion screening, and internal approval gates. Publish the checklist in your vendor portal or workflow tool so status is visible — not buried in a shared spreadsheet only one buyer maintains. Review the checklist quarterly against audit findings and payment holds to remove steps nobody uses and add gaps you discovered the hard way.",
    primaryKeyword: "vendor onboarding checklist",
    relatedGuideSlugs: [
      "vendor-compliance-checklist",
      "what-is-a-vendor-packet",
      "how-to-assign-vendor-onboarding-owners",
      "how-to-set-vendor-document-requirements-by-tier",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "What belongs on a minimum vendor onboarding checklist?",
        a: "Legal name verification, W-9, COI meeting your limits, signed contract or PO terms acceptance, banking details with dual approval, and internal stakeholder sign-off. Add exclusion screening if you are in healthcare or government-adjacent spend.",
      },
      {
        q: "Should procurement or AP own the checklist?",
        a: "Procurement usually owns the master checklist; AP owns tax and payment gates. One published version prevents buyers from skipping steps finance requires later.",
      },
      {
        q: "How often should we update the checklist?",
        a: "Review quarterly and after every audit or significant payment hold incident. Tax, insurance, and screening requirements change — static checklists go stale within a year.",
      },
      {
        q: "Can we use the same checklist for all vendor types?",
        a: "Use a base checklist plus tier overlays. Contractors, SaaS vendors, and facilities vendors need different documents — tiering prevents over-collecting from low-risk vendors and under-collecting from high-risk ones.",
      },
    ],
    sections: [
      {
        heading: "Define tiers before listing tasks",
        body: "A checklist without tiers becomes either too heavy for small vendors or too light for critical suppliers. Map spend thresholds, data access, and regulatory exposure first. Tier 1 might require full packet plus legal review; Tier 3 might need W-9 and COI only.",
        bullets: [
          "Annual spend or contract value bands",
          "Access to PHI, PII, or financial systems",
          "On-site work vs remote-only services",
          "Government or grant-funded spend rules",
        ],
      },
      {
        heading: "Separate collection from approval",
        body: "Checklist items should distinguish document collection (vendor action) from internal approval (your action). Mixing them in one column hides who is blocking progress. Status views should show waiting on vendor vs waiting on internal reviewer.",
      },
      {
        heading: "Assign owners to every gate",
        body: "Each checklist step needs a named owner and backup — tax for W-9, risk for COI, legal for contract, AP for banking. Unowned steps stall onboarding for weeks because everyone assumes someone else will act.",
      },
      {
        heading: "Tie checklist completion to payment release",
        body: "The checklist only works when incomplete status blocks PO issuance or first payment. Publish the policy to vendors upfront so they understand why document requests are not optional administrative noise.",
      },
      {
        heading: "Version control and audit evidence",
        body: "When you change requirements, version the checklist and apply the new version to vendors onboarded after the effective date. Retain which checklist version applied to each vendor for audit — especially after mergers or policy updates.",
      },
    ],
  },
  {
    slug: "how-to-send-a-vendor-portal-link",
    cluster: "vendor",
    title: "How to Send a Vendor Portal Link",
    summary:
      "Best practices for sending vendor portal links so suppliers complete onboarding documents securely — with tracking, reminders, and fewer reply-all email chains.",
    answer:
      "Send the portal link from a monitored system address or workflow notification — not a personal buyer inbox that goes dark when someone is on PTO. The message should name your company, the vendor's legal entity, what they must complete, the deadline, and a support contact. Use a unique link tied to the vendor record so submissions attach automatically. Never ask vendors to email W-9s or bank letters as attachments when your policy requires portal upload. Log send time, open events, and completion status so AP can see blockers without chasing buyers for updates.",
    primaryKeyword: "vendor portal link",
    relatedGuideSlugs: [
      "how-to-collect-vendor-documents-in-one-place",
      "what-is-a-vendor-packet",
      "how-to-track-vendor-onboarding-status",
      "how-to-send-a-w9-request-email",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Should the portal link go in the first vendor email?",
        a: "Yes — send it with the initial onboarding notice after internal approval to engage the vendor. Delaying the link creates duplicate data collection over email.",
      },
      {
        q: "What if the vendor says the link expired?",
        a: "Regenerate from the vendor record, resend with a new deadline, and log the resend. Expired links often mean the original request sat unread — follow up by phone for high-spend vendors.",
      },
      {
        q: "Can multiple contacts at the vendor use one link?",
        a: "Prefer one link per vendor entity tied to your master record. If the vendor needs multiple contributors, use a portal that supports delegated tasks rather than forwarding a single-use link externally.",
      },
      {
        q: "How do we prevent phishing concerns?",
        a: "Use a consistent sender domain, explain the request in plain language, and provide a verified phone number for the vendor to confirm legitimacy before entering tax or banking data.",
      },
    ],
    sections: [
      {
        heading: "What the invitation email must include",
        body: "Vendors ignore vague requests. Include legal name, relationship context (new supplier, post-merger refresh), document list, deadline, and consequence for missing it — typically payment or PO hold.",
      },
      {
        heading: "Use tracked sends, not one-off forwards",
        body: "Buyers forwarding portal links from personal mailboxes lose visibility when they change roles. System-generated invitations create an audit trail and enable automated reminders without manual copy-paste.",
      },
      {
        heading: "Security expectations for vendors",
        body: "State that tax and banking data must be submitted through the portal, not email replies. This protects the vendor and satisfies most infosec policies. Link to a brief FAQ if vendors push back.",
      },
      {
        heading: "Reminder cadence",
        body: "Automate reminders at seven and fourteen days for incomplete packets. Escalate to the buyer or vendor manager at twenty-one days. Manual reminder discipline does not scale past a few dozen active onboardings.",
      },
      {
        heading: "Confirm completion on your side",
        body: "Portal submission is not the same as approval. Define who validates W-9 TIN, COI limits, and banking before status moves to ready-for-payment. Vendors should receive confirmation when they are fully cleared.",
      },
    ],
  },
  {
    slug: "what-is-a-vendor-packet",
    cluster: "vendor",
    title: "What Is a Vendor Packet?",
    summary:
      "What a vendor packet includes, who assembles it, and why U.S. operations teams treat it as the single record of supplier readiness before first payment.",
    answer:
      "A vendor packet is the consolidated set of documents, certifications, and approvals required before a supplier is cleared for purchase orders and payment. Typical contents include W-9, certificate of insurance, contract or rate agreement, banking details, questionnaires (security, diversity, or quality), and exclusion screening results. The packet is not a folder of random attachments — it is a structured record tied to a vendor ID with version history, validation status, and sign-offs. Finance and audit teams rely on the packet to prove due diligence was completed before money moved, not reconstructed from email after a problem surfaces.",
    primaryKeyword: "vendor packet",
    relatedGuideSlugs: [
      "how-to-build-a-vendor-onboarding-checklist",
      "how-to-collect-vendor-documents-in-one-place",
      "how-to-handle-incomplete-vendor-packets",
      "vendor-compliance-checklist",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Is a vendor packet the same as vendor master data?",
        a: "No. Master data is the ERP record — name, address, payment terms. The packet is the evidence file supporting that record: tax forms, insurance, contracts, and approvals.",
      },
      {
        q: "Who owns the vendor packet?",
        a: "Procurement or vendor management usually owns assembly; AP validates tax and banking; risk or legal validates insurance and contracts. One system should show overall packet status.",
      },
      {
        q: "How long do we keep vendor packets?",
        a: "Retain for the vendor relationship plus your document retention policy — often seven years for tax and contract evidence. Expired documents should be refreshed, not deleted without replacement.",
      },
      {
        q: "Do we need a new packet for every PO?",
        a: "No — one packet per vendor entity, refreshed on schedule or when requirements change. Project-specific SOWs may add documents without rebuilding the entire packet.",
      },
    ],
    sections: [
      {
        heading: "Core components of a complete packet",
        body: "Minimum viable packet for most U.S. commercial vendors:",
        bullets: [
          "IRS Form W-9 (validated TIN)",
          "Certificate of insurance meeting your requirements",
          "Executed contract, MSA, or PO terms",
          "Banking and remittance details (with verification)",
          "Internal approval record",
        ],
      },
      {
        heading: "Optional items by tier and industry",
        body: "Healthcare may add OIG exclusion screening. Construction adds additional insured and waiver of subrogation endorsements. IT vendors add security questionnaires and DPAs. Tier your optional items so low-risk vendors are not buried in forms.",
      },
      {
        heading: "Packet status vs document status",
        body: "Each document has its own lifecycle — requested, submitted, validated, expired. Packet status rolls up those states: incomplete, in review, approved, or blocked. Leadership dashboards should show blocked vendors by reason, not just incomplete counts.",
      },
      {
        heading: "Why email folders fail as packets",
        body: "Shared drives and inboxes lose version control, lack validation timestamps, and break when staff turnover. A purpose-built packet ties every file to the vendor ID with who approved it and when.",
      },
      {
        heading: "Refreshing packets over time",
        body: "Onboarding is not one-and-done. Schedule W-9 refresh, COI renewal, and contract amendment updates into the same packet record so auditors see continuous compliance — not a snapshot from go-live year.",
      },
    ],
  },
  {
    slug: "how-to-approve-a-new-vendor",
    cluster: "vendor",
    title: "How to Approve a New Vendor",
    summary:
      "How U.S. finance and procurement teams run a new vendor approval workflow — from intake through tax, risk, and payment setup — without bypassing controls.",
    answer:
      "New vendor approval should follow a defined path: business sponsor request, duplicate vendor check, risk tier assignment, document collection, functional review (tax, insurance, legal), and final approver sign-off before ERP setup. Each step records who approved, when, and on what basis. Do not create vendor master records in the ERP until the packet is approved — premature setup is how duplicate vendors and payment-before-compliance happen. High-spend or high-risk vendors need additional approvers; low-tier vendors can use streamlined paths but never skip tax validation. Publish SLA targets so sponsors know how long approval takes and what they must provide upfront.",
    primaryKeyword: "new vendor approval",
    relatedGuideSlugs: [
      "how-to-assign-vendor-onboarding-owners",
      "how-to-build-a-vendor-onboarding-checklist",
      "how-to-block-payments-for-non-compliant-vendors",
      "vendor-compliance-checklist",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Who should be the final approver for a new vendor?",
        a: "Typically procurement or vendor management for commercial vendors, with finance concurrence for banking changes. Legal approves when contract terms are non-standard. Define thresholds in your approval matrix.",
      },
      {
        q: "Can a buyer approve their own vendor?",
        a: "Avoid self-approval for vendors the requester will benefit from personally or departmentally. Segregation of duties reduces fraud and preferred-vendor bypass of competitive sourcing.",
      },
      {
        q: "What triggers rejection at approval?",
        a: "TIN mismatch, inadequate insurance, failed exclusion screening, unsigned contract, or incomplete banking verification. Rejection should specify remedial action — not a generic 'denied.'",
      },
      {
        q: "How fast should new vendor approval take?",
        a: "Tier 3 vendors: five to ten business days with complete submissions. Tier 1 with legal review: two to four weeks. Publish SLAs and track actual cycle time monthly.",
      },
    ],
    sections: [
      {
        heading: "Intake: what sponsors must provide",
        body: "Require legal name, proposed spend, category, business justification, and contract draft before work begins. Incomplete intake returns to sponsor — not forwarded to AP as an emergency.",
      },
      {
        heading: "Duplicate and conflict checks",
        body: "Search ERP and pending requests for similar names, TINs, and addresses. Duplicate vendors fracture spend analytics and duplicate W-9 maintenance. Resolve merges before approval.",
      },
      {
        heading: "Parallel vs sequential reviews",
        body: "Tax, insurance, and legal can review in parallel once documents arrive. Final approval stays sequential after all functional gates pass. Parallel review cuts cycle time without skipping steps.",
      },
      {
        heading: "Document the approval record",
        body: "Store approver name, role, timestamp, and packet version approved. Auditors ask whether payment occurred before approval — your record should answer definitively.",
      },
      {
        heading: "ERP activation timing",
        body: "Create or activate the vendor master only after approval. Configure payment holds in AP until first-invoice validation confirms nothing changed post-approval.",
      },
      {
        heading: "Emergency and exception paths",
        body: "Define a narrow exception process for true emergencies — with retroactive deadline, executive approval, and automatic payment hold until packet completion. Undocumented exceptions become the norm.",
      },
    ],
  },
  {
    slug: "how-to-track-vendor-onboarding-status",
    cluster: "vendor",
    title: "How to Track Vendor Onboarding Status",
    summary:
      "How operations teams track vendor onboarding status across document collection, review, and approval — with visibility for buyers, AP, and leadership.",
    answer:
      "Track onboarding at the vendor-record level with statuses that mean something operationally: invited, in progress, waiting on vendor, in internal review, approved, or blocked. Each status should map to the next action and owner. Avoid binary done/not-done fields that hide whether you are waiting on a COI or a legal redline. Dashboard by age, tier, and blocker type so leadership sees bottlenecks — not just a count of open vendors. Integrate status with your ERP or P2P system so buyers cannot issue POs against vendors still in onboarding. Weekly standups review vendors past SLA with named escalation owners.",
    primaryKeyword: "vendor onboarding status",
    relatedGuideSlugs: [
      "how-to-send-a-vendor-portal-link",
      "how-to-assign-vendor-onboarding-owners",
      "how-to-reduce-vendor-onboarding-time",
      "how-to-handle-incomplete-vendor-packets",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "What statuses should we use?",
        a: "Use a small set: Not started, Vendor action required, Internal review, Approved, Blocked, and Offboarding. Sub-status for document type (W-9 pending) is fine but keep executive rollups simple.",
      },
      {
        q: "How do we report onboarding cycle time?",
        a: "Measure from intake approval to ready-for-payment. Segment by tier and category. Spikes in 'vendor action required' usually mean unclear requirements or portal friction — not vendor bad faith.",
      },
      {
        q: "Should vendors see their own status?",
        a: "Yes, in the portal — show completed items, outstanding items, and who to contact. Transparency reduces 'where are we?' emails to buyers.",
      },
      {
        q: "Who gets alerted when onboarding stalls?",
        a: "Alert the assigned onboarding owner first, then the business sponsor at SLA breach, then procurement leadership for tier-one vendors past twice the SLA.",
      },
    ],
    sections: [
      {
        heading: "Define status semantics across teams",
        body: "Procurement, AP, and legal must use the same status definitions. If 'in review' means different things in email vs the system, dashboards lie. Publish a one-page status glossary.",
      },
      {
        heading: "Blocker taxonomy",
        body: "Tag blockers: missing W-9, COI limits insufficient, legal contract, banking verification, exclusion hit. Monthly review of blocker frequency drives process fixes — not blame.",
      },
      {
        heading: "Age-based escalation rules",
        body: "Automate escalations at 7, 14, and 21 days idle. Idle means no vendor upload and no internal action. Reset timers when meaningful progress occurs.",
      },
      {
        heading: "Visibility for business sponsors",
        body: "Sponsors who requested the vendor should see status without emailing procurement. Self-service visibility cuts status-check email volume significantly.",
      },
      {
        heading: "Close the loop at approval",
        body: "When status moves to approved, notify sponsor, AP, and the vendor contact with payment/PO instructions. Silent approval creates first-invoice surprises.",
      },
    ],
  },
  {
    slug: "how-to-collect-vendor-documents-in-one-place",
    cluster: "vendor",
    title: "How to Collect Vendor Documents in One Place",
    summary:
      "How U.S. teams stop chasing vendor documents across email, SharePoint, and ERP attachments by centralizing collection in one system of record.",
    answer:
      "Designate one system — vendor portal or compliance platform — as the intake point for W-9s, COIs, contracts, questionnaires, and banking letters. Configure document types with required fields, expiration rules, and validation owners. Disable ad-hoc email submission for tax and banking where policy requires secure upload. Link each uploaded file to the vendor master ID automatically via portal invitation codes or ERP vendor numbers. Train buyers to redirect vendors to the portal instead of accepting attachments. Monthly audit: sample new vendors and confirm every required document lives in the central record — not scattered across three inboxes.",
    primaryKeyword: "collect vendor documents",
    relatedGuideSlugs: [
      "what-is-a-vendor-packet",
      "how-to-send-a-vendor-portal-link",
      "how-to-collect-w9-and-coi-together",
      "how-to-move-off-shared-folders",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Can we still accept documents by email?",
        a: "Only for low-risk exceptions with manual upload by AP into the central system the same day. Default path should be portal upload for audit trail and security.",
      },
      {
        q: "How do we handle vendors with multiple entities?",
        a: "Separate vendor records and portals per legal entity. Parent company COIs do not substitute for subsidiary W-9s — each entity gets its own document set.",
      },
      {
        q: "What about legacy vendors onboarded before centralization?",
        a: "Run a migration campaign: request refresh through the portal, attach migrated files with a 'legacy import' tag, and prioritize high-spend vendors first.",
      },
      {
        q: "Who validates uploaded documents?",
        a: "Route by type: AP for W-9, risk for COI, treasury for banking, legal for contracts. Validation status should display on the vendor record.",
      },
    ],
    sections: [
      {
        heading: "Document type catalog",
        body: "Define each acceptable document type, file format, max age, and renewal frequency. Ambiguous 'upload insurance' requests produce wrong files. Be specific: ACORD 25 COI, signed W-9, void check or bank letter.",
      },
      {
        heading: "Single intake, multiple reviewers",
        body: "Vendors upload once; workflows route copies to functional reviewers without re-requesting. Vendors hate sending the same COI to procurement and AP separately.",
      },
      {
        heading: "Naming and version control",
        body: "Auto-name files with vendor ID, document type, and received date. When vendors upload corrections, supersede prior versions — do not delete without retention policy compliance.",
      },
      {
        heading: "Integration with ERP and P2P",
        body: "Push approval status — not necessarily the files themselves — to ERP payment blocks. AP should see compliance status at invoice entry without opening SharePoint.",
      },
      {
        heading: "Measuring centralization success",
        body: "Track percentage of new vendors with full packet in central system, email exception rate, and average time to find a document during audit requests. Target near-zero audit search time.",
      },
    ],
  },
  {
    slug: "how-to-set-vendor-document-requirements-by-tier",
    cluster: "vendor",
    title: "How to Set Vendor Document Requirements by Tier",
    summary:
      "How procurement teams tier vendor document requirements by spend, risk, and category — balancing compliance with onboarding speed.",
    answer:
      "Define tiers using objective criteria: annual spend, contract length, data sensitivity, on-site access, and regulatory exposure. Assign document requirements per tier in a published matrix — Tier 1 full packet plus security questionnaire and legal review; Tier 2 standard W-9, COI, and contract; Tier 3 simplified path for low-dollar, low-risk purchases. Apply tier at intake based on sponsor attestation and procurement validation, not after documents arrive. Re-tier when spend or scope changes mid-relationship. Review tier thresholds annually against audit findings and near-miss incidents where a Tier 3 vendor should have been Tier 1.",
    primaryKeyword: "vendor document requirements by tier",
    relatedGuideSlugs: [
      "how-to-build-a-vendor-onboarding-checklist",
      "how-to-onboard-high-risk-vendors",
      "vendor-compliance-checklist",
      "how-to-set-vendor-insurance-requirements",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "What spend threshold defines Tier 1?",
        a: "Varies by organization — common breakpoints are $50K, $100K, or $250K annual spend. Align with your delegation of authority and insurance minimums.",
      },
      {
        q: "Can sponsors request a lower tier?",
        a: "Sponsors can request; procurement assigns tier based on criteria, not convenience. Document overrides with approver name and reason.",
      },
      {
        q: "Do tiers apply to existing vendors?",
        a: "Apply new requirements at renewal or annual refresh. Grandfather only with explicit risk acceptance — not silent omission.",
      },
      {
        q: "How do categories affect tiers?",
        a: "Some categories override spend — healthcare staffing, cloud processors with PHI, and construction on-site may be Tier 1 regardless of dollar amount.",
      },
    ],
    sections: [
      {
        heading: "Build the tier matrix",
        body: "Rows are tiers; columns are document types and approvals. Publish internally and excerpt for vendor-facing FAQs so expectations are clear before submission.",
      },
      {
        heading: "Risk factors beyond spend",
        body: "A $10K SaaS tool with SSO into your HRIS may outrank a $80K print vendor for documentation depth. Include data access and physical access in tier logic.",
      },
      {
        heading: "Automate tier assignment",
        body: "Intake forms should calculate suggested tier from spend and category fields. Procurement confirms or adjusts before portal invitation sends — preventing wrong checklist from day one.",
      },
      {
        heading: "Communicate tier to vendors",
        body: "Tell vendors which tier they are in and exactly what that requires. Surprises mid-process erode trust and extend cycle time.",
      },
      {
        heading: "Review and adjust thresholds",
        body: "If Tier 3 vendors repeatedly cause compliance issues, lower thresholds. If Tier 1 is overloaded with immaterial vendors, refine category rules — not just spend cuts.",
      },
    ],
  },
  {
    slug: "how-to-handle-incomplete-vendor-packets",
    cluster: "vendor",
    title: "How to Handle Incomplete Vendor Packets",
    summary:
      "How AP and procurement resolve incomplete vendor packets — escalation, partial approval rules, and payment holds without losing supplier relationships.",
    answer:
      "When a packet is incomplete, identify missing or rejected items specifically — not a generic 'incomplete' flag vendors cannot act on. Send targeted portal tasks with deadline and consequence. Do not partially activate vendors in ERP without a written exception policy: which missing items block PO vs payment vs both. Standard path: no first payment until tax and banking validate; COI may follow for low on-site risk with documented acceptance. Escalate to the business sponsor when vendors miss second deadline. Track incomplete rate by document type to fix systemic gaps — often unclear COI requirements or W-9 entity confusion.",
    primaryKeyword: "incomplete vendor packet",
    relatedGuideSlugs: [
      "what-is-a-vendor-packet",
      "how-to-block-payments-for-non-compliant-vendors",
      "how-to-collect-vendor-documents-in-one-place",
      "how-to-reduce-vendor-onboarding-time",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Can we pay a vendor with a missing COI?",
        a: "Only under a documented exception with risk acceptance for low physical exposure — never as default. Construction and on-site vendors should never pay without valid COI.",
      },
      {
        q: "What if the vendor submitted the wrong document?",
        a: "Reject with specific correction instructions in the portal. 'Wrong COI limits' beats 'please resubmit' — vendors fix faster with precise feedback.",
      },
      {
        q: "How long before we cancel onboarding?",
        a: "Typical policy: 30–45 days inactive with two reminders, then suspend request. Tier-one strategic vendors get phone escalation before cancellation.",
      },
      {
        q: "Should incomplete vendors stay in ERP?",
        a: "Prefer pending or blocked vendor status — not active — until minimum packet complete. Active status invites PO creation bypass.",
      },
    ],
    sections: [
      {
        heading: "Diagnose the gap precisely",
        body: "Break incomplete into: not requested, vendor pending, submitted wrong, internal review backlog, or rejected pending vendor fix. Each has a different owner and fix.",
      },
      {
        heading: "Vendor-facing clarity",
        body: "Portal should list outstanding items with examples and contacts. Vendors abandon packets when requirements read like internal jargon.",
      },
      {
        heading: "Internal review bottlenecks",
        body: "Sometimes the vendor is done and AP or legal has not reviewed in ten days. Track internal SLA separately from vendor SLA.",
      },
      {
        heading: "Exception documentation",
        body: "When leadership approves go-live with gaps, record approver, missing items, remediation deadline, and payment limits. Auditors will ask.",
      },
      {
        heading: "Root cause reviews",
        body: "Monthly tally of rejection reasons: TIN mismatch, wrong entity on W-9, COI limits, missing additional insured. Feed into checklist and template improvements.",
      },
    ],
  },
  {
    slug: "how-to-re-onboard-vendors-after-merger",
    cluster: "vendor",
    title: "How to Re-Onboard Vendors After a Merger",
    summary:
      "How finance and procurement teams re-onboard vendors after M&A — harmonizing master data, tax records, and compliance packets across legacy entities.",
    answer:
      "After a merger, treat vendor re-onboarding as a controlled migration: inventory legacy vendor masters from both entities, deduplicate by TIN and legal name, assign surviving vendor IDs, and define which compliance documents must refresh vs carry forward. Communicate legal entity changes to vendors with updated W-9, banking, and contract assignment requirements. Run parallel payment blocks until new packet approval completes — do not assume legacy compliance transfers. Prioritize by spend and payment volume first. Document mapping from old vendor numbers to new for AP cutover and 1099 continuity.",
    primaryKeyword: "re-onboard vendors after merger",
    relatedGuideSlugs: [
      "how-to-handle-vendor-name-changes-at-onboarding",
      "how-to-standardize-vendor-setup-across-locations",
      "how-to-audit-vendor-onboarding-records",
      "how-to-collect-vendor-documents-in-one-place",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Do vendors need new W-9s after our merger?",
        a: "If the payee legal entity or TIN changed, yes. If you are now a different payer entity, vendors may need updated forms reflecting the new payer name and EIN.",
      },
      {
        q: "How do we handle duplicate vendors across legacy ERPs?",
        a: "Merge on TIN first, then fuzzy name match with manual review. Retire duplicate IDs with redirect mapping so historical POs and 1099s remain traceable.",
      },
      {
        q: "Can we grandfather old insurance certificates?",
        a: "Only if still valid, meets the surviving entity's higher requirements, and names the correct insured entities. Otherwise require refresh.",
      },
      {
        q: "What timeline is realistic for re-onboarding?",
        a: "Top 80% of spend in 90 days is a common target; tail vendors over 6–12 months with annual refresh campaigns.",
      },
    ],
    sections: [
      {
        heading: "Inventory and deduplication",
        body: "Export both vendor masters. Match on TIN, bank account, and address. Flag conflicts where same TIN has different names — possible acquisition or DBA issue.",
      },
      {
        heading: "Harmonize requirements",
        body: "Surviving entity policy wins. Vendors meeting only the weaker legacy policy must upgrade documents — communicate early with tier-based deadlines.",
      },
      {
        heading: "Vendor communication plan",
        body: "Single branded communication explaining entity change, new remittance details if applicable, portal link, and deadline. Confused vendors submit to wrong entity or old bank accounts.",
      },
      {
        heading: "ERP cutover coordination",
        body: "Coordinate vendor ID mapping with AP, treasury, and 1099 teams. Payment to wrong legacy ID after cutover is a common merger failure mode.",
      },
      {
        heading: "Retain legacy evidence",
        body: "Archive pre-merger packets linked to legacy IDs for audit. Do not delete because the vendor 'already onboarded' at the other company.",
      },
    ],
  },
  {
    slug: "how-to-audit-vendor-onboarding-records",
    cluster: "vendor",
    title: "How to Audit Vendor Onboarding Records",
    summary:
      "How internal audit and compliance teams sample vendor onboarding records — what evidence to expect and how to close gaps before external auditors arrive.",
    answer:
      "An onboarding audit verifies that vendors received appropriate due diligence before first payment and that evidence is complete, dated, and approved. Sample by tier and spend — not random only. For each vendor, trace: intake approval, tier assignment, document collection timestamps, validation sign-offs, ERP activation date, and first payment date. First payment before W-9 validation is a critical finding. Check exclusion screening where required. Confirm packet versions match policy effective dates. Report deficiency rate by document type and business unit, with remediation owners and deadlines. Run pre-audit self-tests quarterly so external audit is confirmation, not discovery.",
    primaryKeyword: "audit vendor onboarding records",
    relatedGuideSlugs: [
      "how-to-export-vendor-onboarding-evidence",
      "how-to-prepare-for-a-compliance-audit",
      "what-makes-a-good-audit-trail",
      "vendor-compliance-checklist",
    ],
    relatedGlossary: ["vendor-onboarding", "audit-trail"],
    faqs: [
      {
        q: "What sample size is reasonable?",
        a: "For large populations, 30–50 vendors stratified by tier and spend often suffices for internal audit. Include all tier-one vendors onboarded in the period for critical coverage.",
      },
      {
        q: "What is the most common onboarding audit finding?",
        a: "Payment released before validated W-9 or missing COI for on-site vendors. Both indicate broken gates between procurement and AP.",
      },
      {
        q: "How far back should onboarding audits reach?",
        a: "Align with retention policy — typically current year plus open vendor relationships. Merger years need explicit scope for legacy entity records.",
      },
      {
        q: "Who remediates audit findings?",
        a: "Procurement owns process fixes; AP owns tax gaps; business units own sponsor compliance. Track open findings to closure with evidence.",
      },
    ],
    sections: [
      {
        heading: "Define the audit trail standard",
        body: "Before sampling, document what 'complete onboarding' means per tier. Auditors test against published policy — not informal practice.",
      },
      {
        heading: "Trace payment timing",
        body: "Compare first payment date to W-9 validation and approval timestamps. Gaps of even one day may violate policy and create 1099 risk.",
      },
      {
        heading: "Test access controls",
        body: "Verify who can bypass gates, approve vendors, and change banking. Segregation of duties findings often accompany onboarding gaps.",
      },
      {
        heading: "Exclusion and screening evidence",
        body: "Healthcare and government-funded orgs must show screening date and result in packet. Missing screening on staffing vendors is high-severity.",
      },
      {
        heading: "Remediation and re-performance",
        body: "Findings should close with corrected documents or process changes — not notes that 'we will do better.' Re-sample failed population after remediation.",
      },
    ],
  },
  {
    slug: "how-to-onboard-high-risk-vendors",
    cluster: "vendor",
    title: "How to Onboard High-Risk Vendors",
    summary:
      "Enhanced onboarding steps for high-risk vendors — data processors, healthcare suppliers, on-site contractors, and high-spend strategic suppliers.",
    answer:
      "High-risk vendor onboarding extends the standard packet with security assessment, enhanced insurance, legal review, exclusion screening, reference checks, and executive approval. Define high-risk triggers: PHI access, critical infrastructure, single-source dependency, international sanctions exposure, or spend above delegation limits. Sequence reviews so security and legal run early — not after the business has committed. Set longer SLAs with explicit milestones. Never compress high-risk onboarding because of project deadlines; use documented exceptions with compensating controls instead. Re-assess risk at contract renewal, not only at initial onboarding.",
    primaryKeyword: "high risk vendor onboarding",
    relatedGuideSlugs: [
      "how-to-set-vendor-document-requirements-by-tier",
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-set-vendor-insurance-requirements",
      "how-to-review-a-contract-before-signing",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "What makes a vendor high-risk?",
        a: "Common triggers: processes personal or health data, performs on-site work, accesses financial systems, operates in sanctioned regions, or represents material spend concentration.",
      },
      {
        q: "Do high-risk vendors need security questionnaires?",
        a: "Yes — SOC 2, SIG Lite, or your internal questionnaire depending on data access. Review infosec before contract signature when possible.",
      },
      {
        q: "Can high-risk vendors skip steps with executive approval?",
        a: "Only with written risk acceptance naming skipped controls, compensating measures, and remediation date. Blanket waivers fail audits.",
      },
      {
        q: "How long does high-risk onboarding take?",
        a: "Plan three to six weeks including legal and security. Communicate timeline to sponsors at intake to prevent last-minute pressure.",
      },
    ],
    sections: [
      {
        heading: "Risk trigger catalog",
        body: "Publish objective triggers so buyers cannot self-classify strategic vendors as low-risk to skip steps. Procurement confirms classification.",
      },
      {
        heading: "Enhanced documentation set",
        body: "Add security questionnaire, DPA/BAA where applicable, enhanced COI limits, subcontractor flow-down requirements, and financial stability check for critical suppliers.",
      },
      {
        heading: "Early legal and security engagement",
        body: "Parallel-path security review while commercial terms negotiate. Discovering infosec blockers after signature wastes weeks.",
      },
      {
        heading: "Executive and board visibility",
        body: "Material third-party relationships may need executive committee awareness. Track separately from routine vendor counts.",
      },
      {
        heading: "Ongoing monitoring post-onboarding",
        body: "High-risk is not a one-time gate. Schedule annual packet refresh, continuous exclusion monitoring, and contract performance review.",
      },
    ],
  },
  {
    slug: "how-to-collect-vendor-questionnaires",
    cluster: "vendor",
    title: "How to Collect Vendor Questionnaires",
    summary:
      "How procurement collects vendor questionnaires — diversity, quality, security, and ESG — without duplicating requests or losing responses in email.",
    answer:
      "Consolidate questionnaires into the vendor portal as typed tasks with clear deadlines and pre-populated company details where possible. Maintain a questionnaire library mapped to tiers — do not send a 200-question security form to office supply vendors. Assign internal owners to review each questionnaire type. Reject incomplete submissions with section-level feedback. Store responses with version and submission date for renewal comparison. Coordinate with other departments so vendors receive one combined request, not three separate surveys from procurement, IT, and ESG in the same week.",
    primaryKeyword: "vendor questionnaire collection",
    relatedGuideSlugs: [
      "how-to-collect-vendor-documents-in-one-place",
      "how-to-set-vendor-document-requirements-by-tier",
      "what-is-a-vendor-packet",
      "how-to-onboard-high-risk-vendors",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Which questionnaires are most common?",
        a: "Security (SIG/SOC), diversity supplier certification, quality/ISO, anti-bribery, and environmental/sustainability — depending on industry and customer requirements.",
      },
      {
        q: "Can vendors reuse questionnaire answers?",
        a: "Allow pre-fill from prior submission when renewing. Vendors appreciate not retyping unchanged answers annually.",
      },
      {
        q: "Who reviews security questionnaires?",
        a: "Information security or third-party risk team — not procurement alone. Route automatically on submission.",
      },
      {
        q: "What if a vendor refuses a questionnaire?",
        a: "Treat as blocker for tier requiring it. Escalate to sponsor; for critical vendors, negotiate alternative evidence (e.g., SOC 2 report instead of full SIG).",
      },
    ],
    sections: [
      {
        heading: "Questionnaire library management",
        body: "Version each template, map to tiers, and retire obsolete forms. Old PDF questionnaires floating on SharePoint multiply inconsistent data.",
      },
      {
        heading: "Right-size by tier",
        body: "Match depth to risk. Full SIG for data processors; abbreviated attestation for low-risk commodity vendors.",
      },
      {
        heading: "Coordinated outreach",
        body: "Weekly cross-functional calendar of vendor outreach prevents survey fatigue and incomplete responses.",
      },
      {
        heading: "Scoring and decisions",
        body: "Define pass/fail criteria and escalation paths for failed security or compliance answers before contract execution.",
      },
      {
        heading: "Renewal and change detection",
        body: "On refresh, highlight answers that changed from prior year — useful for risk re-evaluation without re-reading entire submissions.",
      },
    ],
  },
  {
    slug: "how-to-standardize-vendor-setup-across-locations",
    cluster: "vendor",
    title: "How to Standardize Vendor Setup Across Locations",
    summary:
      "How multi-location U.S. organizations standardize vendor onboarding across sites — shared policies, local flexibility, and one vendor master.",
    answer:
      "Standardize the core: tier definitions, required documents, approval matrix, portal intake, and ERP vendor master governance. Allow limited local overlays only where regulation requires — e.g., state-specific forms — documented in the tier matrix. Prohibit local ERP vendor creation outside the central process. Train site AP and buyers on the single intake path. Measure compliance by location: incomplete packet rate, duplicate vendors, and payment-before-approval incidents. Regional procurement leads resolve local pushback but cannot waive tax or insurance gates. Periodic audits compare location practice to corporate policy and close variances with training or system controls.",
    primaryKeyword: "standardize vendor setup locations",
    relatedGuideSlugs: [
      "how-to-build-a-vendor-onboarding-checklist",
      "how-to-re-onboard-vendors-after-merger",
      "how-to-standardize-operational-workflows",
      "how-to-assign-vendor-onboarding-owners",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Should each location have its own vendor master?",
        a: "No — one legal-entity-aware master with ship-to/bill-to locations. Duplicate masters per site break spend visibility and compliance tracking.",
      },
      {
        q: "How do we handle local emergency purchases?",
        a: "Define petty-cash or P-card paths separate from formal vendor setup — do not create shadow vendors in ERP for convenience.",
      },
      {
        q: "What if a state requires extra documentation?",
        a: "Add state overlay rows to the tier matrix — not a separate onboarding process per site.",
      },
      {
        q: "Who enforces standardization?",
        a: "Corporate procurement with AP and internal audit support. ERP role restrictions prevent unauthorized vendor creation at sites.",
      },
    ],
    sections: [
      {
        heading: "Corporate policy, local execution",
        body: "Publish one vendor policy with location addenda only where legally required. Site managers execute — they do not rewrite requirements.",
      },
      {
        heading: "Central intake and local sponsorship",
        body: "Local managers sponsor vendors; central team processes onboarding. Sponsors cannot skip portal steps because 'their site always did it differently.'",
      },
      {
        heading: "ERP governance",
        body: "Restrict vendor master create/modify to central roles. Sites request through workflow. Prevents ten variants of the same national supplier.",
      },
      {
        heading: "Training and onboarding playbooks",
        body: "Site AP turnover is high — short playbooks and portal videos beat policy PDFs nobody reads.",
      },
      {
        heading: "Location scorecards",
        body: "Monthly metrics by site: cycle time, exceptions, duplicates. Friendly competition plus executive visibility drives adoption.",
      },
    ],
  },
  {
    slug: "how-to-block-payments-for-non-compliant-vendors",
    cluster: "vendor",
    title: "How to Block Payments for Non-Compliant Vendors",
    summary:
      "How AP implements payment holds for non-compliant vendors — tying ERP blocks to document status without breaking critical supplier relationships.",
    answer:
      "Configure payment holds in AP or ERP triggered by compliance status: missing or expired W-9, invalid TIN, lapsed COI, incomplete onboarding, or failed exclusion screening. Holds should fire automatically from your compliance system feed — not manual spreadsheet checks each payment run. Define exception process for true business continuity with executive approval, dollar caps, and remediation deadline. Communicate holds to vendors and sponsors with specific fix actions. Release holds only when validation completes and logs approver. Measure hold frequency and aging monthly; chronic offenders need vendor management conversation, not repeated one-off overrides.",
    primaryKeyword: "block payments non compliant vendors",
    relatedGuideSlugs: [
      "how-to-handle-incomplete-vendor-packets",
      "how-to-collect-w9s-before-first-payment",
      "how-to-handle-an-expired-certificate-of-insurance",
      "how-to-integrate-vendor-onboarding-with-ap",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Will payment holds damage vendor relationships?",
        a: "Clear policy communicated at onboarding prevents surprise. Holds enforce rules vendors already agreed to — inconsistent enforcement damages trust more.",
      },
      {
        q: "What about critical sole-source vendors?",
        a: "Use documented exception with risk acceptance and short remediation window — not permanent bypass. Escalate to vendor management and legal.",
      },
      {
        q: "Should holds block PO creation or payment?",
        a: "Both for new vendors. For existing vendors, payment hold often suffices while COI refreshes — blocking PO may be excessive for renewals.",
      },
      {
        q: "How do we notify vendors of a hold?",
        a: "Automated email from AP or compliance system stating reason, portal link, and AP contact. Generic 'payment delayed' emails generate unnecessary escalation.",
      },
    ],
    sections: [
      {
        heading: "Hold trigger definitions",
        body: "Document each trigger and severity: hard stop vs warning. Tax and exclusion typically hard stop; COI may warn then stop after grace period.",
      },
      {
        heading: "System integration",
        body: "Push compliance flags to ERP nightly or real-time. Manual hold entry does not scale and fails when AP staff change.",
      },
      {
        heading: "Exception workflow",
        body: "Require approver, reason, max payment amount, and expiration date. Auto-expire exceptions and re-apply hold if remediation missed.",
      },
      {
        heading: "Vendor and sponsor communication",
        body: "Simultaneous notice to vendor contact and internal sponsor accelerates fixes. Sponsors often have relationship leverage AP lacks.",
      },
      {
        heading: "Reporting and governance",
        body: "Dashboard: vendors on hold, dollars at risk, average days to clear. Review exceptions weekly with finance leadership.",
      },
    ],
  },
  {
    slug: "how-to-assign-vendor-onboarding-owners",
    cluster: "vendor",
    title: "How to Assign Vendor Onboarding Owners",
    summary:
      "How to assign clear owners for each vendor onboarding — business sponsor, procurement lead, and functional reviewers — so nothing stalls unowned.",
    answer:
      "Every onboarding needs three roles: business sponsor (need and budget), onboarding owner (drives completion), and functional reviewers (tax, legal, risk). Record names in the vendor record at intake — not in email headers. Backup owners cover PTO and turnover. RACI clarity prevents AP from chasing buyers who think procurement owns W-9, while procurement waits on AP. Reassign owners in the system when people change jobs; orphaned records are the top cause of 60-day onboarding stalls. Review unowned or owner-departed records weekly.",
    primaryKeyword: "vendor onboarding owner",
    relatedGuideSlugs: [
      "how-to-track-vendor-onboarding-status",
      "how-to-approve-a-new-vendor",
      "how-to-build-a-vendor-onboarding-checklist",
      "how-to-reduce-vendor-onboarding-time",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Who should be the onboarding owner?",
        a: "Typically procurement or vendor management for external suppliers; AP for payment-only setup. One named person — not a department inbox.",
      },
      {
        q: "Is the business sponsor the same as owner?",
        a: "No. Sponsor requests the vendor; owner executes the process. Same person only in very small teams.",
      },
      {
        q: "What happens when the owner leaves mid-onboarding?",
        a: "Manager must reassign in the system within five business days. Automated alerts on HR termination feeds help.",
      },
      {
        q: "Should owners rotate by category?",
        a: "Category-aligned owners (IT, clinical, facilities) improve expertise. Balance workload with volume metrics.",
      },
    ],
    sections: [
      {
        heading: "RACI for onboarding",
        body: "Publish Responsible, Accountable, Consulted, Informed for each step. Accountable is one person per vendor onboarding record.",
      },
      {
        heading: "Assignment at intake",
        body: "Owner field mandatory before portal invite sends. Workflow rejects intake missing owner or sponsor.",
      },
      {
        heading: "Functional reviewer routing",
        body: "Auto-route to W-9 validator, COI reviewer, and contract counsel based on tier. Reviewers are consulted — owner remains accountable for cycle time.",
      },
      {
        heading: "Escalation when owners stall",
        body: "If owner has no activity in seven days, notify their manager and sponsor. Passive ownership kills SLAs.",
      },
      {
        heading: "Capacity planning",
        body: "Track open onboardings per owner. Rebalance when someone exceeds threshold — usually 15–25 active complex onboardings depending on tier mix.",
      },
    ],
  },
  {
    slug: "how-to-collect-w9-and-coi-together",
    cluster: "vendor",
    title: "How to Collect W-9 and COI Together",
    summary:
      "How AP and procurement coordinate W-9 and COI collection in one vendor onboarding flow — reducing duplicate outreach and payment delays.",
    answer:
      "Request W-9 and COI in the same portal invitation with tier-appropriate insurance requirements attached. Explain both needs upfront: tax reporting and risk transfer are separate gates but equally block payment. Provide COI requirement summary (limits, additional insured, waiver) alongside W-9 instructions to prevent back-and-forth. Validate in parallel — AP on TIN, risk on coverage. Do not mark vendor approved until both pass unless a documented exception applies. Annual refresh campaigns should bundle W-9 and COI renewal for vendors needing both, timed before COI expiration and 1099 season.",
    primaryKeyword: "collect w9 and coi together",
    relatedGuideSlugs: [
      "how-to-collect-w9s-from-vendors",
      "how-to-set-vendor-insurance-requirements",
      "how-to-collect-vendor-documents-in-one-place",
      "how-to-send-a-w9-request-email",
    ],
    relatedGlossary: ["vendor-onboarding", "w-9", "certificate-of-insurance"],
    faqs: [
      {
        q: "Should W-9 or COI be collected first?",
        a: "Request simultaneously. AP often prioritizes W-9 validation; risk prioritizes COI. Parallel collection cuts total cycle time.",
      },
      {
        q: "What if the vendor sends COI but not W-9?",
        a: "Keep status blocked for payment. Partial completion should show both outstanding items clearly in portal.",
      },
      {
        q: "Do all vendors need both?",
        a: "Most U.S. service and contractor vendors need both. Product-only resellers may need W-9 without COI if no on-site or professional liability exposure — tier accordingly.",
      },
      {
        q: "Can one email request both documents?",
        a: "Yes — one email with portal link listing both requirements beats separate threads that vendors answer at different times.",
      },
    ],
    sections: [
      {
        heading: "Single invitation, dual requirements",
        body: "Portal task list shows W-9 and COI with equal visibility. Sequencing invites imply one is optional — vendors delay the 'secondary' item indefinitely.",
      },
      {
        heading: "Attach requirement specs",
        body: "Link insurance requirement PDF or in-portal limits table when requesting COI. Vendors submit wrong limits when requirements live only in buyer's head.",
      },
      {
        heading: "Parallel validation workflow",
        body: "Route submissions to AP and risk simultaneously. First approver done should not flip vendor to approved — wait for all required gates.",
      },
      {
        heading: "Renewal coordination",
        body: "COI expires on rolling dates; W-9 refreshes on policy schedule. Bundle vendors due for both in one campaign where timelines align.",
      },
      {
        heading: "Exception policy clarity",
        body: "If COI follows W-9 for low-risk categories, document categories explicitly in tier matrix — not ad-hoc buyer discretion.",
      },
    ],
  },
  {
    slug: "how-to-reduce-vendor-onboarding-time",
    cluster: "vendor",
    title: "How to Reduce Vendor Onboarding Time",
    summary:
      "Practical steps U.S. procurement teams use to shorten vendor onboarding cycle time without weakening compliance controls.",
    answer:
      "Measure cycle time end-to-end and by step — vendor response, internal review, ERP setup. Biggest gains usually come from clearer requirements upfront, parallel reviews, portal self-service, and eliminating duplicate data entry — not from removing controls. Publish tier-based checklists at intake so vendors submit complete packets first try. Set internal review SLAs with auto-escalation. Pre-approve template contracts for common categories. Integrate ERP vendor creation with compliance approval to remove manual re-keying. Track first-pass acceptance rate; low rates mean confusing instructions, not slow vendors.",
    primaryKeyword: "reduce vendor onboarding time",
    relatedGuideSlugs: [
      "how-to-track-vendor-onboarding-status",
      "how-to-send-a-vendor-portal-link",
      "how-to-set-vendor-document-requirements-by-tier",
      "how-to-handle-incomplete-vendor-packets",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "What is a good onboarding cycle time target?",
        a: "Tier 3: under ten business days. Tier 2: two to three weeks. Tier 1 with legal: four to six weeks. Measure from approved intake to ready-for-payment.",
      },
      {
        q: "Does removing approval steps speed things up?",
        a: "Removing controls creates payment and audit rework — net slower. Streamline routing and clarity instead.",
      },
      {
        q: "How much time do vendors typically add?",
        a: "Often 40–60% of total cycle is vendor response. Clear portal tasks and reminders help; internal review fixes help the rest.",
      },
      {
        q: "Should we offer office hours for vendors?",
        a: "Yes for high-volume onboarding periods — thirty-minute AP/legal office hours reduce bad first submissions.",
      },
    ],
    sections: [
      {
        heading: "Baseline measurement",
        body: "You cannot improve what you do not measure. Segment cycle time by tier, category, and location. Report monthly.",
      },
      {
        heading: "First-pass completeness",
        body: "Improve instructions, examples, and COI templates. Each rejection adds days. Target 70%+ first-pass acceptance.",
      },
      {
        heading: "Internal bottleneck removal",
        body: "Legal and AP review queues often exceed vendor delay. SLA internal steps at 2–3 business days each for standard items.",
      },
      {
        heading: "Template contracts and pre-negotiated terms",
        body: "Standard categories use playbook contracts — redlines only for non-standard terms. Cuts legal review from weeks to days.",
      },
      {
        heading: "Automation and integration",
        body: "Auto-create ERP vendor on approval, auto-send reminders, auto-route by tier. Manual handoffs multiply delay and error.",
      },
    ],
  },
  {
    slug: "how-to-handle-vendor-name-changes-at-onboarding",
    cluster: "vendor",
    title: "How to Handle Vendor Name Changes at Onboarding",
    summary:
      "How to handle vendor legal name changes, DBAs, and entity conversions during onboarding — W-9 alignment, ERP setup, and contract matching.",
    answer:
      "When a vendor's legal name differs from the name on the contract or PO, stop and reconcile before ERP setup. The W-9 line 1 name must match the legal entity you pay and report on 1099. Collect updated W-9 and articles of name change or merger docs for entity conversions. Search for duplicate vendor masters under old names. Update contracts via amendment if counterparty name changed. Never create a new vendor ID for a mere DBA if TIN is unchanged — update master data with proper documentation. Payment to wrong legal entity creates tax reporting and lien risk.",
    primaryKeyword: "vendor name change onboarding",
    relatedGuideSlugs: [
      "how-to-fix-a-tin-mismatch-on-a-w9",
      "how-to-re-onboard-vendors-after-merger",
      "how-to-handle-w9-for-llc-vendors",
      "how-to-collect-w9s-from-vendors",
    ],
    relatedGlossary: ["vendor-onboarding", "w-9", "tin"],
    faqs: [
      {
        q: "Vendor uses DBA on invoice but different legal name on W-9 — is that OK?",
        a: "Pay and report using W-9 legal name (line 1). DBA can appear on line 2 or remittance instructions if consistent with banking.",
      },
      {
        q: "Do we need a new vendor for a name change?",
        a: "Same TIN and continuous entity: update master. New TIN or entity after merger: likely new vendor record with mapping from old.",
      },
      {
        q: "What documents prove a legal name change?",
        a: "Secretary of state filing, certificate of amendment, or attorney letter. Retain in vendor packet.",
      },
      {
        q: "Should banking match the new name?",
        a: "Bank account name should align with payee to reduce fraud and wire reject. Re-verify banking on any name change.",
      },
    ],
    sections: [
      {
        heading: "Verify before vendor master creation",
        body: "Compare contract counterparty, W-9 line 1, insurance named insured, and bank account. Mismatch triggers research — not override.",
      },
      {
        heading: "TIN is the anchor",
        body: "Same TIN with new name usually means rename or DBA structure change. Different TIN means possible new entity — new onboarding path.",
      },
      {
        heading: "Contract and insurance updates",
        body: "Amend contracts and request COI endorsing new legal name. Old name on COI invalidates coverage after rename.",
      },
      {
        heading: "Duplicate prevention",
        body: "Search old and new names before creating vendor. Buyers often create duplicates when vendor rebrands mid-process.",
      },
      {
        heading: "Communication with AP and 1099",
        body: "Notify tax team of name changes on existing vendors before year-end reporting. W-9 refresh ensures 1099 name/TIN match IRS records.",
      },
    ],
  },
  {
    slug: "how-to-export-vendor-onboarding-evidence",
    cluster: "vendor",
    title: "How to Export Vendor Onboarding Evidence",
    summary:
      "How to export vendor onboarding evidence for auditors, customers, and due diligence — complete packets with timestamps and approvals.",
    answer:
      "Export onboarding evidence as vendor-level packages: intake record, tier, checklist version, each document with received and validated dates, approver log, exclusion screening results, and ERP activation timestamp. Include metadata — not just PDFs — so auditors can verify timing without opening every file. Support bulk export by vendor list, date range, or tier for sample requests. Redact SSNs in exports shared outside tax unless encrypted and authorized. Standard export format (ZIP with index CSV) speeds external audit response from weeks to hours.",
    primaryKeyword: "export vendor onboarding evidence",
    relatedGuideSlugs: [
      "how-to-audit-vendor-onboarding-records",
      "how-to-export-compliance-evidence",
      "what-makes-a-good-audit-trail",
      "how-to-prepare-for-a-compliance-audit",
    ],
    relatedGlossary: ["vendor-onboarding", "audit-trail"],
    faqs: [
      {
        q: "What do auditors ask for most often?",
        a: "W-9 validation before first payment, COI for on-site vendors, approval before ERP setup, and exclusion screening where applicable.",
      },
      {
        q: "Can we export from shared drives?",
        a: "Manual drive exports lack consistent metadata. Compliance platform export with audit log is defensible; folder dumps are not.",
      },
      {
        q: "How do we handle customer due diligence requests?",
        a: "Export subset for specific vendor serving that customer — security questionnaire, COI, screening — under NDA with redactions as needed.",
      },
      {
        q: "Should exports include rejected documents?",
        a: "Include final approved versions plus rejection history if it shows control operation — optional for external auditors, useful for internal.",
      },
    ],
    sections: [
      {
        heading: "Standard evidence package contents",
        body: "Define the export template once: documents, approvals, status history, policy version. Reuse for every audit type.",
      },
      {
        heading: "Metadata and index file",
        body: "CSV index with vendor ID, document type, received date, validator, approval date. Auditors love sortable indexes.",
      },
      {
        heading: "Bulk export for sampling",
        body: "Support export of 30–50 vendor sample from stratified query. Manual one-by-one export fails tight audit timelines.",
      },
      {
        heading: "Redaction and security",
        body: "Role-based export: full tax detail for tax team; redacted SSN for operational auditors. Encrypt transfers.",
      },
      {
        heading: "Retention of export logs",
        body: "Log who exported what and when — exports themselves are sensitive and should be auditable.",
      },
    ],
  },
  {
    slug: "how-to-integrate-vendor-onboarding-with-ap",
    cluster: "vendor",
    title: "How to Integrate Vendor Onboarding with AP",
    summary:
      "How to integrate vendor onboarding with accounts payable — shared vendor master, payment holds, and first-invoice validation.",
    answer:
      "Integration means one vendor ID flows from approved onboarding into ERP with compliance flags AP sees at invoice entry. On approval, auto-create or activate vendor master with validated remittance, tax classification, and 1099 eligibility. Push hold/release status from compliance platform to AP payment run. First invoice should trigger validation that packet status still current — not assume onboarding-time snapshot forever. Align W-9 deadlines with payment terms communicated to vendors. Joint metrics: payment blocks avoided vs justified holds, first-invoice exception rate, and duplicate vendor creation by AP bypass.",
    primaryKeyword: "integrate vendor onboarding ap",
    relatedGuideSlugs: [
      "how-to-block-payments-for-non-compliant-vendors",
      "how-to-collect-w9s-before-first-payment",
      "how-to-set-up-invoice-approvals",
      "vendor-compliance-checklist",
    ],
    relatedGlossary: ["vendor-onboarding"],
    faqs: [
      {
        q: "Should AP create vendors in ERP?",
        a: "Only from approved onboarding feed — not from invoice alone. Invoice-only creation is how duplicates and unvetted payees enter.",
      },
      {
        q: "What AP should see at invoice entry?",
        a: "Compliance status icon, expiration warnings, payment hold reason, and link to packet — without leaving ERP if possible.",
      },
      {
        q: "How often sync compliance to ERP?",
        a: "Daily minimum; real-time for hold release when vendors clear critical gaps before payment run cutoff.",
      },
      {
        q: "Who owns integration break fixes?",
        a: "Joint ownership: procurement/compliance for data accuracy, IT for interface, AP for payment impact validation.",
      },
    ],
    sections: [
      {
        heading: "Single vendor master source",
        body: "Onboarding approval is the only front door to active vendor status. AP redirects off-system requests back to intake.",
      },
      {
        heading: "Compliance flag mapping",
        body: "Map platform statuses to ERP hold codes vendors and AP staff understand — not opaque system codes.",
      },
      {
        heading: "First payment and first invoice controls",
        body: "Optional hard stop: first invoice requires AP manager release confirming packet still valid. Catches post-approval document expiry.",
      },
      {
        heading: "1099 and tax alignment",
        body: "Tax classification and reportable flag from validated W-9 flow to ERP before any reportable payment. Prevents year-end fire drills.",
      },
      {
        heading: "Joint operating rhythm",
        body: "Monthly AP-procurement meeting on blocked vendors, integration errors, and policy exceptions. Silos recreate payment-before-compliance.",
      },
    ],
  },
];
