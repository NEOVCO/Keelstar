import { guide } from "./helpers";

export const platformGuides = [
  guide({
    slug: "how-to-prepare-for-a-compliance-audit",
    title: "How to Prepare for a Compliance Audit",
    summary:
      "How U.S. finance, HR, and operations teams assemble audit-ready evidence before an examiner, payer, or customer asks.",
    answer:
      "Start by mapping what the auditor will request — vendor files, screening logs, policy acknowledgments, contract dates — then pull live evidence from systems of record, not reconstructed folders. Assign an owner per workstream, run a dry-run export two weeks before the audit window, and fix gaps while you still have time.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-export-compliance-evidence", "what-makes-a-good-audit-trail", "how-to-set-a-document-retention-policy"],
    relatedGlossary: ["audit-trail", "version-history"],
    faqs: [
      { q: "How far back do auditors typically request records?", a: "It varies by audit type — CMS and payer reviews often look back several years for healthcare compliance; SOX-style reviews focus on the current fiscal period. Know your retention policy before the request arrives." },
      { q: "Should we create a special audit folder?", a: "Only as a staging area for exports. Source evidence should live in your operational systems with audit trails. Copying files into a folder for the auditor is reconstruction — acceptable as a deliverable, not as your only record." },
    ],
    sections: [
      {
        heading: "Know the scope before you gather documents",
        body: "Audits differ: a payer credentialing review, a SOC 2 observation, a CMS compliance audit, and a customer vendor assessment each want different samples. Get the request list or sampling methodology early. Guessing produces over-collection, missed items, and last-minute scrambles.",
      },
      {
        heading: "Map evidence to your workflows",
        body: "Organize preparation around how work actually happens — vendor onboarding, exclusion screening, COI tracking, policy acknowledgments — not around file folders someone created three years ago. Each workflow should have a defined owner who can export a complete record on demand.",
      },
      {
        heading: "Run a dry-run export",
        body: "Two weeks before the audit window, pull the same exports you expect to produce: vendor packets, screening logs, approval chains, training records. Gaps discovered during a dry run are fixable. Gaps discovered when the auditor is in the room are not.",
      },
      {
        heading: "Fix systemic issues, not just samples",
        body: "If the dry run reveals missing W-9s, lapsed COIs, or screening without dates, treat that as a control failure — not a one-off. Remediate the underlying workflow so the sample is representative of ongoing compliance, not a curated exception.",
      },
      {
        heading: "Assign roles for audit week",
        body: "Designate a single coordinator, workflow owners who can pull records within hours, and a legal or compliance reviewer for sensitive items. Auditors lose confidence when every question starts a three-day email chain.",
      },
      {
        heading: "After the audit",
        body: "Capture findings in a remediation tracker with owners and due dates. Update retention policies, access controls, and monitoring rules where the audit exposed weakness. The best audit preparation makes the next audit boring.",
      },
    ],
  }),

  guide({
    slug: "what-role-based-access-control-is",
    title: "What Role-Based Access Control Is",
    summary:
      "How U.S. compliance and IT teams use RBAC to limit who can view, edit, and export sensitive operational records.",
    answer:
      "Role-based access control (RBAC) assigns permissions to roles — AP clerk, compliance manager, auditor — instead of individuals. Users get only the access their job requires. For compliance workflows, RBAC protects vendor tax data, screening results, and audit exports while keeping day-to-day work unblocked.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-export-compliance-evidence", "what-makes-a-good-audit-trail", "how-to-prepare-for-a-compliance-audit"],
    relatedGlossary: ["audit-trail", "segregation-of-duties"],
    sections: [
      {
        heading: "RBAC in plain terms",
        body: "Instead of granting each person custom permissions, you define roles that mirror job functions and attach permissions to those roles. When someone joins, changes teams, or leaves, you change their role — not dozens of individual settings. That keeps access aligned with responsibility.",
      },
      {
        heading: "Why compliance teams care",
        body: "Vendor W-9s, exclusion screening results, employee training records, and contract terms are sensitive. RBAC ensures AP can process invoices without exporting every vendor's tax ID, and that only compliance or legal can access full screening histories. Least privilege is a baseline expectation in healthcare, finance, and government contracting.",
      },
      {
        heading: "Common roles in operational compliance",
        body: "Most U.S. mid-market organizations define a small set of roles rather than per-user exceptions.",
        bullets: [
          "Viewer — read assigned records, no export",
          "Contributor — upload documents and complete assigned tasks",
          "Approver — sign off on exceptions, holds, and payments",
          "Compliance admin — configure workflows, run reports, export evidence",
          "Auditor — read-only export access across a defined scope",
        ],
      },
      {
        heading: "RBAC and segregation of duties",
        body: "RBAC supports segregation of duties — the person who adds a vendor should not be the only person who approves invoices to that vendor. Map roles so conflicting permissions are not combined unless explicitly approved and logged.",
      },
      {
        heading: "Avoid shared accounts",
        body: "Shared logins destroy attribution in audit trails. If three people use one compliance@ company account, you cannot prove who exported a vendor file or cleared an exclusion match. RBAC works only when every action ties to an individual identity.",
      },
      {
        heading: "Review access periodically",
        body: "Roles drift as people change jobs. Quarterly access reviews — or automatic deprovisioning when HR offboards someone — prevent former employees from retaining export rights. Document reviews; auditors ask who had access during the period under examination.",
      },
    ],
  }),

  guide({
    slug: "how-to-export-compliance-evidence",
    title: "How to Export Compliance Evidence",
    summary:
      "How U.S. operations and compliance teams produce audit-ready exports without reconstructing records from email and shared drives.",
    answer:
      "Define what each audit or customer diligence request requires, then export directly from your workflow system — vendor records, screening logs, approval chains, timestamps included. Exports should be complete, dated, and attributable. If you are copying files into a folder manually, you are rebuilding evidence, not exporting it.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-prepare-for-a-compliance-audit", "what-makes-a-good-audit-trail", "what-role-based-access-control-is"],
    relatedGlossary: ["audit-trail", "version-history"],
    faqs: [
      { q: "What format should compliance exports use?", a: "PDF and CSV cover most auditor requests. Some payers accept structured spreadsheets for vendor rosters. Match the request format, and include metadata — export date, exported by, date range covered." },
      { q: "Can we redact sensitive fields?", a: "Yes, when the auditor does not need full TINs or bank details. Redact deliberately with a documented policy — do not hand over incomplete records that omit required evidence." },
    ],
    sections: [
      {
        heading: "Export from the system of record",
        body: "Credible evidence comes from the tool where work happened — where the W-9 was validated, the exclusion check was logged, the COI expiration was tracked. Pulling attachments from inboxes and renaming them the week before an audit creates gaps auditors are trained to find.",
      },
      {
        heading: "Know the standard export packages",
        body: "Most compliance audits repeat the same requests. Predefine export templates for each.",
        bullets: [
          "Single vendor or employee file — all documents, checks, and history",
          "Date-range activity log — every action in a period",
          "Portfolio snapshot — all vendors with COI status, screening date, W-9 status",
          "Exception report — overdue items, failed validations, open holds",
        ],
      },
      {
        heading: "Include metadata auditors expect",
        body: "An export without context raises questions. Include export timestamp, exporting user, filters applied (date range, status), and record counts. For screening logs, include list source and disposition. For documents, include received dates and version history.",
      },
      {
        heading: "Handle sensitive data deliberately",
        body: "Tax IDs, bank account numbers, and PHI may need redaction depending on the recipient. Apply a consistent redaction policy — not ad hoc manual edits — and note what was redacted and why. Full-detail exports should be limited to roles with appropriate access.",
      },
      {
        heading: "Test exports before audit week",
        body: "Run the same export you will hand over during a dry run. Verify record counts match expectations, dates fall inside the requested window, and no workflow is missing from the bundle. Fixing export gaps under deadline pressure is how teams miss audit windows.",
      },
      {
        heading: "Retain the export itself",
        body: "Keep a copy of what you submitted, who submitted it, and when. If the same auditor returns next year, you need to show consistency — or explain what changed in your controls since the last review.",
      },
    ],
  }),

  guide({
    slug: "how-to-set-a-document-retention-policy",
    title: "How to Set a Document Retention Policy",
    summary:
      "How U.S. organizations define how long to keep compliance documents — and when to delete them safely.",
    answer:
      "Identify document types your business creates, map each to legal and contractual retention requirements, assign a retention period and owner, and enforce deletion after the period expires unless litigation hold applies. Tax forms, contracts, screening logs, and policy acknowledgments often have different rules — one blanket 'keep forever' policy creates liability.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-prepare-for-a-compliance-audit", "how-to-export-compliance-evidence", "what-makes-a-good-audit-trail"],
    relatedGlossary: ["audit-trail", "version-history"],
    sections: [
      {
        heading: "Why retention policy matters",
        body: "Keeping everything forever increases breach exposure and discovery costs. Deleting too early violates IRS, CMS, OSHA, or contract requirements. A written retention schedule balances legal minimums with operational need — and gives auditors a clear answer when they ask how long records exist.",
      },
      {
        heading: "Inventory your document types",
        body: "Start with what your compliance workflows actually produce.",
        bullets: [
          "Tax forms (W-9, 1099 support) — often seven years under IRS guidance",
          "Vendor contracts and amendments — term plus post-termination period",
          "Certificates of insurance — duration of relationship plus claim tail",
          "Exclusion screening logs — commonly six years in healthcare; confirm with counsel",
          "Policy acknowledgments and training records — employment plus statutory period",
          "Invoice approval chains — aligned with financial record retention",
        ],
      },
      {
        heading: "Layer legal, contractual, and operational requirements",
        body: "The longest applicable period wins for each document type. A customer contract may require seven years of vendor evidence while state law requires less. Federal healthcare participants face CMS and payer-specific rules. Legal should sign off on the schedule — operations enforces it.",
      },
      {
        heading: "Define roles and enforcement",
        body: "Assign document owners — AP for tax forms, compliance for screening logs, HR for policy acknowledgments. Automated retention in your workflow system beats calendar reminders to 'clean up the drive.' Deletion should be logged like any other compliance action.",
      },
      {
        heading: "Litigation and audit holds",
        body: "When litigation, investigation, or audit notice arrives, suspend automatic deletion for affected records. Holds override normal retention until legal releases them. Your policy should describe who authorizes holds and how affected document classes are flagged.",
      },
      {
        heading: "Review the policy annually",
        body: "Regulations, contracts, and business lines change. Annual review keeps retention aligned with reality. Document each review with date and approver — auditors ask whether the policy is current, not just whether one exists.",
      },
    ],
  }),

  guide({
    slug: "how-to-standardize-operational-workflows",
    title: "How to Standardize Operational Workflows",
    summary:
      "How U.S. operations teams replace ad hoc processes with repeatable, auditable workflows across locations and departments.",
    answer:
      "Document the current state, design one standard path per workflow type, assign system-enforced steps with owners and deadlines, and retire informal shortcuts. Standardization does not mean rigidity — it means the same controls apply whether the request comes from AP in Dallas or procurement in Boston.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-replace-email-chains-with-workflows", "how-to-roll-out-a-new-workflow-to-your-team", "why-spreadsheets-fail-for-compliance-tracking"],
    relatedGlossary: ["approval-matrix", "audit-trail"],
    sections: [
      {
        heading: "Start with the mess you have",
        body: "Before standardizing, map how work actually flows today — not how the policy manual says it should. Interview AP, compliance, and site managers. You will find three different COI collection methods, email approvals with no log, and exclusion checks that happen for some vendors but not others.",
      },
      {
        heading: "Define the target workflow",
        body: "For each process — vendor onboarding, COI renewal, exclusion re-screen — write the happy path: trigger, steps, owners, deadlines, validation rules, and completion criteria. One page per workflow is enough if it is specific.",
      },
      {
        heading: "Encode controls in the system",
        body: "A laminated checklist still depends on humans remembering. Standardization sticks when the workflow tool enforces sequence: no payment until W-9 validates, no vendor active until screening clears, no COI marked current until limits are verified.",
      },
      {
        heading: "Handle exceptions explicitly",
        body: "Exceptions will happen — rush onboarding, legacy vendors, acquired entities. Define an exception path with approver, reason code, expiration, and audit log. Undocumented exceptions become the de facto standard and fail audits.",
      },
      {
        heading: "Measure adoption",
        body: "Track percentage of transactions flowing through the standard path, average cycle time, and overdue rate. Teams revert to email when the standard path is slower or harder. Fix friction — do not rely on mandates alone.",
      },
      {
        heading: "Govern changes",
        body: "When the workflow changes, version it. Compliance, finance, and legal should approve material control changes before rollout. Auditors compare practice to policy — undocumented drift between them is a finding.",
      },
    ],
  }),

  guide({
    slug: "how-to-move-off-shared-folders",
    title: "How to Move Off Shared Folders",
    summary:
      "How U.S. compliance and finance teams migrate vendor documents and tracking from shared drives to monitored workflows.",
    answer:
      "Inventory what lives in shared folders, classify documents by workflow type, migrate active records into a system with validation and audit trails, and cut off new uploads to the old location on a fixed date. Shared folders are archives, not controls — moving off them means changing where work happens, not just copying files.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["why-spreadsheets-fail-for-compliance-tracking", "how-to-standardize-operational-workflows", "how-to-replace-email-chains-with-workflows"],
    relatedGlossary: ["audit-trail", "version-history"],
    sections: [
      {
        heading: "Why shared folders fail compliance",
        body: "Google Drive and network shares are fine for collaboration and drafts. They do not validate TINs, warn before COI expiration, log who changed a filename, or prove what was on file on a past date. Compliance audits treat shared folders as unstructured storage — because that is what they are.",
      },
      {
        heading: "Inventory before you migrate",
        body: "List folders, owners, and document types. Prioritize active vendor files, current COIs, and tax forms over archived contracts from closed relationships. You do not need to migrate everything on day one — you need to stop creating new compliance debt in the folder.",
      },
      {
        heading: "Map folders to workflows",
        body: "Each folder type should land in a corresponding workflow: Vendor W-9s → W-9 collection, Insurance certs → COI tracking, Screening printouts → exclusion monitor. If a document type has no workflow, that is a process gap to close — not a reason to keep the folder.",
      },
      {
        heading: "Set a cutoff date",
        body: "Announce that after a specific date, new vendor documents must enter through the workflow system — not the shared drive. AP and procurement need a single intake path. Retroactive uploads to the old folder after cutoff defeat the migration.",
      },
      {
        heading: "Migrate with metadata",
        body: "When importing historical files, capture received dates and source — do not pretend every document was validated today. Mark migrated records clearly so auditors understand provenance. Missing dates on legacy files are acceptable if documented; falsified dates are not.",
      },
      {
        heading: "Keep the folder as read-only archive",
        body: "After migration, lock the old shared folder to read-only for reference during transition, then retire it per retention policy. The goal is one system of record going forward — not two places someone has to check.",
      },
    ],
  }),

  guide({
    slug: "how-to-set-up-notifications-that-actually-fire",
    title: "How to Set Up Notifications That Actually Fire",
    summary:
      "How U.S. operations teams configure reminders and alerts so compliance deadlines are not missed in email noise.",
    answer:
      "Assign every monitored item an owner, send notifications before deadlines — not on them — route alerts to individuals not shared inboxes, and escalate when items go overdue. Test notifications when you configure them. A reminder that fires once, to nobody's real account, on the expiration date, is worse than no reminder — it creates false confidence.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-choose-what-to-monitor", "how-to-track-coi-expirations", "how-to-track-contract-renewals"],
    relatedGlossary: ["audit-trail"],
    faqs: [
      { q: "How early should reminders fire?", a: "For expirations and notice deadlines, 30–60 days ahead is typical, with a second alert at 14 days and escalation if still open. Contract notice periods may need 90–120 day lead time." },
      { q: "Should vendors receive reminders directly?", a: "Often yes for COI renewals and document requests — it reduces AP chasing. Keep internal escalation separate so vendor-facing messages stay professional and consistent." },
    ],
    sections: [
      {
        heading: "Notifications are controls, not courtesy",
        body: "In compliance workflows, a missed reminder can mean lapsed insurance, an accidental contract renewal, or a payment to an excluded vendor. Treat notification configuration with the same rigor as approval matrices — wrong recipient or timing is a control failure.",
      },
      {
        heading: "Assign owners, not departments",
        body: "Alerts to accounts-payable@ or compliance-team@ get ignored. Every vendor, contract, and certificate needs a named owner who receives the first alert. Delegation rules cover PTO — not permanent shared inboxes.",
      },
      {
        heading: "Lead time before the deadline",
        body: "Notifications on the expiration date arrive too late. Configure tiered reminders: early warning for action, second notice approaching deadline, escalation to manager or compliance when overdue. Match lead time to how long the task actually takes — COI renewal needs weeks; a W-9 chase may need days.",
      },
      {
        heading: "Separate internal and external messages",
        body: "Vendor-facing renewal requests should use consistent templates and come from a controlled address. Internal escalations can be direct and urgent. Mixing them in one thread confuses vendors and hides accountability.",
      },
      {
        heading: "Test when you configure",
        body: "Create a test record with a near-term date and confirm each notification fires to the right person at the right time. Email filters, spam rules, and mobile client settings silently block more alerts than teams realize.",
      },
      {
        heading: "Log that notifications were sent",
        body: "When an audit asks why a COI lapsed, you need to show reminders went out — not just that a date passed. Notification history belongs in the audit trail alongside the document record.",
      },
    ],
  }),

  guide({
    slug: "how-to-choose-what-to-monitor",
    title: "How to Choose What to Monitor",
    summary:
      "How U.S. compliance and operations leaders prioritize which documents, dates, and checks belong in automated workflows.",
    answer:
      "Monitor anything with a deadline, a document, and audit consequence — COI expirations, contract notice windows, exclusion re-screens, policy acknowledgments, certification renewals. Skip one-off analysis and draft documents. If missing it would hurt in an audit or expose liability, it belongs in a monitored workflow.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-set-up-notifications-that-actually-fire", "how-to-standardize-operational-workflows", "why-spreadsheets-fail-for-compliance-tracking"],
    relatedGlossary: ["audit-trail", "certificate-of-insurance"],
    sections: [
      {
        heading: "The monitoring test",
        body: "Ask three questions: Does this item expire or require periodic re-check? Would we need to prove compliance on a specific past date? Does someone currently track it manually with reminders? Three yes answers mean automate it.",
      },
      {
        heading: "High-priority candidates",
        body: "Most U.S. mid-market compliance programs start with the same core set.",
        bullets: [
          "Vendor tax forms (W-9 / W-8) — stale TINs break 1099 filing",
          "Certificates of insurance — lapse creates uninsured exposure",
          "Contract renewals and notice periods — missed windows lock in unwanted terms",
          "Exclusion and sanctions screening — continuous list updates",
          "Employee policy acknowledgments and training certifications",
        ],
      },
      {
        heading: "Industry-specific additions",
        body: "Healthcare adds OIG and state exclusion lists, credentialing expirations, and payer enrollment dates. Construction adds subcontractor COIs and lien waiver tracking. Prioritize what your contracts and regulators mention by name.",
      },
      {
        heading: "What not to monitor in a workflow tool",
        body: "Financial models, one-time project plans, and draft documents belong elsewhere. Monitoring everything creates noise — teams ignore alerts when too many are irrelevant. Keep workflows for recurring compliance obligations, not general file storage.",
      },
      {
        heading: "Risk-rank when you cannot do everything at once",
        body: "If budget or bandwidth limits rollout, start with highest exposure: vendors you pay without current W-9s, contracts renewing in 90 days, and screening gaps for federal program touchpoints. Publish a phased roadmap so partial coverage is intentional, not accidental.",
      },
      {
        heading: "Review the portfolio quarterly",
        body: "New regulations, customer contract terms, and business lines add monitoring requirements. Quarterly review with compliance, finance, and operations keeps the monitored set current — and catches shadow processes that crept back to spreadsheets.",
      },
    ],
  }),

  guide({
    slug: "how-to-replace-email-chains-with-workflows",
    title: "How to Replace Email Chains with Workflows",
    summary:
      "How U.S. AP and compliance teams move document collection, approvals, and reminders out of inbox threads.",
    answer:
      "Identify the workflows trapped in email — W-9 requests, COI chases, invoice approvals — define the standard steps and owners, route work through a single system with status tracking, and stop accepting email attachments as the system of record. Email is notification; the workflow is the record.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-standardize-operational-workflows", "how-to-move-off-shared-folders", "how-to-set-up-invoice-approvals"],
    relatedGlossary: ["approval-matrix", "audit-trail"],
    sections: [
      {
        heading: "Why email chains fail audits",
        body: "Forwarded threads lose context. Attachments get stripped by security tools. Approvals say 'OK' without amount or invoice reference. When someone leaves, their inbox takes the history with it. Auditors know email is weak evidence — so should you.",
      },
      {
        heading: "Pick the highest-volume pain first",
        body: "Do not boil the ocean. Start with the workflow that generates the most threads — usually vendor document collection, invoice approval, or COI renewal. Success there builds credibility for the next migration.",
      },
      {
        heading: "Design the workflow before picking tools",
        body: "Map trigger, steps, validators, approvers, and completion state. The tool should enforce the sequence — not replicate a free-form email conversation in a different UI.",
      },
      {
        heading: "Use email as a channel, not a repository",
        body: "Vendors and managers can still receive email links to complete tasks. The difference is submission lands in the workflow with timestamp and validation — not as an attachment lost in thread 47. Internal teams work from a dashboard, not search.",
      },
      {
        heading: "Run parallel during transition",
        body: "For 30–60 days, accept both paths but treat the workflow as authoritative. When AP finds a W-9 in email, they upload it to the vendor record — they do not leave it in the inbox. Parallel period ends on a fixed date.",
      },
      {
        heading: "Measure thread reduction",
        body: "Track emails per vendor onboarding, time to complete, and audit export time before and after. Quantified improvement keeps leadership supportive when teams ask to 'just email them instead.'",
      },
    ],
  }),

  guide({
    slug: "how-to-roll-out-a-new-workflow-to-your-team",
    title: "How to Roll Out a New Workflow to Your Team",
    summary:
      "How U.S. operations leaders deploy compliance workflows without adoption dying after the kickoff meeting.",
    answer:
      "Pilot with one team, document the before-and-after process, train users on their specific tasks — not the whole product — assign workflow champions, set a hard cutoff for the old method, and review metrics weekly for the first month. Rollouts fail when tools launch without changing who does what by when.",
    product: "platform",
    workflow: "build-audit-trails",
    relatedGuides: ["how-to-standardize-operational-workflows", "how-to-replace-email-chains-with-workflows", "how-to-set-up-notifications-that-actually-fire"],
    relatedGlossary: ["approval-matrix", "audit-trail"],
    sections: [
      {
        heading: "Pilot before company-wide launch",
        body: "Choose a willing AP or compliance sub-team with enough volume to stress-test — not so much that failure is catastrophic. Run real vendor records through the workflow for 2–4 weeks. Fix friction before mandating adoption everywhere.",
      },
      {
        heading: "Train on tasks, not features",
        body: "AP clerks need to know how to send a W-9 request and release a payment hold — not every admin setting. Compliance needs export and exception approval. Role-based training sessions stay short and stick better than hour-long platform tours.",
      },
      {
        heading: "Name workflow champions",
        body: "Identify one power user per department who answers day-one questions. Champions should have direct line to the project lead for bugs and policy gaps. Without them, every user opens a ticket or reverts to email.",
      },
      {
        heading: "Set a cutoff for the old process",
        body: "Parallel runs longer than 60 days become permanent dual systems. Publish a date: after this, new vendor onboarding happens only in the workflow. Leadership must back the cutoff — exceptions granted by executives undermine rollout.",
      },
      {
        heading: "Monitor adoption metrics weekly",
        body: "Track active users, records created in the system vs estimated volume, overdue tasks, and support tickets. A drop in email volume is a lagging indicator; low login counts are an early warning. Address blockers in weekly standups during month one.",
      },
      {
        heading: "Iterate and document changes",
        body: "First-release workflows will need tuning — escalation paths, reminder timing, approval thresholds. Capture changes in a versioned process doc. Teams adopt tools that reduce their pain; they abandon tools that add steps without visible benefit.",
      },
    ],
  }),
];
