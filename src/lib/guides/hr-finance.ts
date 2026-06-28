import { guide } from "./helpers";

export const signerGuides = [
  guide({
    slug: "how-to-send-a-document-for-signature",
    title: "How to Send a Document for Signature",
    summary:
      "A practical process for U.S. teams to send contracts, policies, and forms for signature — with a clear audit trail from request to execution.",
    answer:
      "Prepare the final document, identify every signer and their role, send one controlled signature request per document, and store the executed copy with timestamps for each action. Do not circulate unsigned PDFs over email — versions diverge, signers get lost, and you cannot prove who signed what.",
    product: "simple-signer",
    workflow: "send-documents-for-signature",
    relatedGuides: [
      "are-electronic-signatures-legally-valid",
      "how-to-store-signed-documents",
      "how-to-chase-a-pending-signature",
    ],
    relatedGlossary: ["electronic-signature", "audit-trail"],
    faqs: [
      {
        q: "Should I send the document as an email attachment?",
        a: "Avoid it for anything you need to defend later. A signature request link keeps one authoritative version, records each signer action, and produces a single executed file.",
      },
      {
        q: "Can multiple people sign the same document?",
        a: "Yes. Define signing order when sequence matters — for example, the company representative signs after the counterparty. Parallel signing works when order does not matter.",
      },
    ],
    sections: [
      {
        heading: "Prepare the document before you send",
        body: "The signature request should contain the final text — not a draft with tracked changes. Confirm the correct entity names, dates, and exhibits. If legal reviewed the document, use the approved version only. Sending a draft that gets signed creates rework and weakens enforceability.",
      },
      {
        heading: "Identify every signer and their role",
        body: "List each person who must sign and why. A vendor agreement may need the vendor's authorized representative and your contract owner. An employment offer needs the candidate and an HR signatory. Missing a required signer means the document is not fully executed — even if one party already signed.",
        bullets: [
          "Counterparty signers: confirm they have authority to bind the entity",
          "Internal signers: route to someone with delegated signing authority",
          "Witness or notary: required only for specific document types — confirm with counsel",
        ],
      },
      {
        heading: "Send one controlled request",
        body: "Use a single signature request that delivers the document to each signer's inbox with a unique link. The system should record when the request was sent, when each party viewed the document, and when they signed. Avoid parallel email threads with different PDF versions attached.",
      },
      {
        heading: "Set expectations and deadlines",
        body: "Include a clear subject line, a short note explaining what is being signed, and a reasonable deadline. For time-sensitive agreements, say so. Most U.S. business teams use 3–7 business days for routine documents and shorter windows for offers or closing items.",
      },
      {
        heading: "Close the loop when signing completes",
        body: "When all parties have signed, distribute the executed copy to stakeholders who need it — AP for vendor agreements, HR for offer letters, operations for SOWs. Store the final PDF in your document system with the signature audit trail attached or linked. Unsigned requests should not linger in limbo; chase or cancel them explicitly.",
      },
    ],
  }),

  guide({
    slug: "are-electronic-signatures-legally-valid",
    title: "Are Electronic Signatures Legally Valid?",
    summary:
      "How U.S. federal and state law treats electronic signatures for most business documents — and when you still need a wet signature.",
    answer:
      "For most U.S. commercial and HR documents, electronic signatures are legally valid under the federal ESIGN Act and state UETA laws, provided you can demonstrate signer intent, consent to electronic records, and an attributable record of the signing. Exceptions exist for certain real estate, family law, and notarized documents — confirm with counsel for those categories.",
    product: "simple-signer",
    workflow: "send-documents-for-signature",
    relatedGuides: [
      "how-to-send-a-document-for-signature",
      "how-to-store-signed-documents",
    ],
    relatedGlossary: ["electronic-signature", "audit-trail", "attestation"],
    faqs: [
      {
        q: "Is an e-signature as good as a handwritten signature?",
        a: "For most business contracts and HR acknowledgments in the U.S., yes — courts look at intent and reliable records, not whether ink was used.",
      },
      {
        q: "Do I need to disclose that signatures will be electronic?",
        a: "ESIGN requires consumer consent in certain contexts. For B2B and most employment documents, your process should still make clear the signer agrees to electronic execution and can access the signed record.",
      },
    ],
    sections: [
      {
        heading: "The legal framework in the U.S.",
        body: "The Electronic Signatures in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA), adopted in most states, establish that electronic signatures and records cannot be denied legal effect solely because they are electronic. Together they cover the vast majority of day-to-day business agreements, vendor contracts, NDAs, and HR policy acknowledgments.",
      },
      {
        heading: "What makes an e-signature enforceable",
        body: "Courts and auditors look for evidence that the signer intended to sign, agreed to conduct the transaction electronically where required, and that the record has integrity — it was not altered after signing.",
        bullets: [
          "Signer intent: clear action such as clicking 'Sign' or typing a name in a designated field",
          "Attribution: identity tied to an email, account, or authentication step",
          "Integrity: tamper-evident record showing document content at time of signing",
          "Retention: ability to reproduce the signed record accurately later",
        ],
      },
      {
        heading: "Common documents where e-signatures work",
        body: "Vendor agreements, statements of work, NDAs, offer letters, employee handbooks and policy acknowledgments, contractor agreements, and internal approvals are routinely executed electronically in U.S. companies. The question is usually process quality, not legality.",
      },
      {
        heading: "When to pause and get legal advice",
        body: "Some documents still require traditional signatures, notarization, or recording — certain real property transfers, wills, codicils, and some family-law forms are common examples. State law varies. If a statute explicitly requires a physical signature or notary seal, electronic execution may not suffice.",
      },
      {
        heading: "Operational practices that hold up in disputes",
        body: "Use a system that logs IP address, timestamp, and signer identity where appropriate. Keep the certificate of completion with the PDF. Do not let signers download, sign offline, and email back without a trail — that recreates the problems ESIGN was meant to solve.",
      },
    ],
  }),

  guide({
    slug: "how-to-store-signed-documents",
    title: "How to Store Signed Documents",
    summary:
      "How U.S. finance, HR, and legal teams store executed documents so they are findable, tamper-evident, and audit-ready.",
    answer:
      "Store each executed document with its completion certificate, organize by counterparty or employee and document type, apply retention rules that match legal and tax requirements, and restrict edit access so the signed file cannot be silently replaced. A signed PDF in a shared drive with no trail is storage — not evidence.",
    product: "simple-signer",
    workflow: "send-documents-for-signature",
    relatedGuides: [
      "how-to-send-a-document-for-signature",
      "are-electronic-signatures-legally-valid",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["audit-trail", "version-history"],
    faqs: [
      {
        q: "Should I keep the audit certificate with the PDF?",
        a: "Yes. The certificate documents who signed and when. Store it alongside the executed PDF or in a system that embeds the trail.",
      },
      {
        q: "How long should we keep signed contracts?",
        a: "Retention depends on document type and state law. Many commercial contracts are kept 7+ years after expiration; employment records often follow separate HR schedules. Align with your counsel's retention policy.",
      },
    ],
    sections: [
      {
        heading: "What to store for each executed document",
        body: "At minimum, keep the final signed PDF, the signature completion record showing each party and timestamp, and metadata: counterparty or employee name, effective date, document type, and internal owner. If the document amended a prior version, link to the superseded file.",
      },
      {
        heading: "Folder structure that scales",
        body: "Ad hoc folders break when people leave. Use a consistent scheme: by entity (vendor, employee) and then by document type, or by department with entity as a subfolder. Name files with date and type — for example, 2026-03-15_acme-msa_executed.pdf — so search works even without a database.",
        bullets: [
          "Vendor contracts: vendor legal name + agreement type",
          "HR documents: employee ID or name + document type + version",
          "Internal approvals: department + fiscal period + reference number",
        ],
      },
      {
        heading: "Access control and integrity",
        body: "Signed documents should be read-only for most users. Only records management or system admins should replace files — and replacements should be versioned, not overwritten. Shared drives with edit access for everyone invite accidental or intentional changes that undermine disputes and audits.",
      },
      {
        heading: "Retention and legal holds",
        body: "Match retention to your document retention schedule. Tax, employment, and litigation holds may require keeping documents longer than operational need. When legal issues a hold, flag affected records so routine deletion does not run. Electronic storage makes retention cheaper — but only if you know where files live.",
      },
      {
        heading: "Retrieval under audit or dispute",
        body: "Test retrieval before you need it. Can you produce every signed vendor agreement from 2024 in under an hour? Can you show the signing trail without asking IT to reconstruct logs? If not, consolidate storage and export paths now.",
      },
    ],
  }),

  guide({
    slug: "how-to-chase-a-pending-signature",
    title: "How to Chase a Pending Signature",
    summary:
      "How U.S. operations teams follow up on unsigned documents without damaging relationships or losing the audit trail.",
    answer:
      "Track every outstanding request with sent date, signers completed, and deadline. Send structured reminders before escalation, route blockers to the right owner, and cancel or replace stale requests instead of sending duplicate links. Chasing over ad hoc email loses context — automated reminders with a visible status do not.",
    product: "simple-signer",
    workflow: "send-documents-for-signature",
    relatedGuides: [
      "how-to-send-a-document-for-signature",
      "how-to-store-signed-documents",
    ],
    relatedGlossary: ["audit-trail"],
    faqs: [
      {
        q: "How often should I remind a signer?",
        a: "A common pattern: reminder at 3 days, again at 1 day before deadline, then escalate to the request owner or the signer's manager for business-critical items.",
      },
      {
        q: "Should I send a new link if they say they cannot find the email?",
        a: "Resend from the same request when possible so the audit trail stays on one envelope. If you must recreate the request, void the old one and document why.",
      },
    ],
    sections: [
      {
        heading: "Know what is actually pending",
        body: "A request can stall because the external signer has not opened it, because an internal approver is waiting, or because signing order blocked the next party. Before chasing, check status: sent, viewed, signed, or declined. Generic 'please sign' messages annoy people who already signed.",
      },
      {
        heading: "Set a clear deadline upfront",
        body: "Deadlines create urgency and give you a legitimate reason to follow up. Include the deadline in the original request and in reminders. For contracts tied to a start date or funding milestone, reference that date — it helps signers prioritize.",
      },
      {
        heading: "Reminder cadence that works",
        body: "Start polite and increase specificity. First reminder: short, with a direct link. Second: note the deadline and offer to answer questions. Third: escalate to your internal owner or the counterparty's project sponsor. Avoid daily nagging on low-priority documents — it trains people to ignore you.",
      },
      {
        heading: "Escalation without burning the relationship",
        body: "For vendor and customer documents, loop in the business relationship owner — the AE, CSM, or project manager — before going to executives. For internal documents, escalate to the signer's manager with context: what document, why it matters, and what is blocked. Keep all chase activity in the system or a single thread so history is visible.",
      },
      {
        heading: "When to void and resend",
        body: "Void and recreate the request when the underlying document changed, the wrong person was listed, or the original link expired. Document the reason. Do not let two active requests for the same document float — signers may execute the wrong version.",
      },
    ],
  }),
];

export const policyGuides = [
  guide({
    slug: "how-to-collect-policy-acknowledgments",
    title: "How to Collect Policy Acknowledgments",
    summary:
      "A defensible U.S. HR process for distributing policies and recording that each employee received and accepted the current version.",
    answer:
      "Publish the policy version, send each employee a single acknowledgment request tied to that version, capture affirmative acceptance with a timestamp, and store the record where you can report completion by person and version. Email replies like 'I have read it' are not evidence — versioned acknowledgments are.",
    product: "policy-acknowledgment-tracker",
    workflow: "send-policy-acknowledgments",
    relatedGuides: [
      "how-to-handle-policy-version-changes",
      "how-to-prove-employees-read-a-policy",
      "how-to-roll-out-a-new-policy",
    ],
    relatedGlossary: ["policy-acknowledgment", "attestation", "version-history"],
    faqs: [
      {
        q: "Is distributing a policy in email enough?",
        a: "Distribution alone does not prove an employee read or accepted it. You need affirmative acknowledgment tied to a specific version.",
      },
      {
        q: "Do contractors need to acknowledge policies too?",
        a: "Often yes — especially security, confidentiality, and workplace conduct policies. Scope acknowledgments to anyone with system access or facility access per your program.",
      },
    ],
    sections: [
      {
        heading: "Why acknowledgments matter",
        body: "When an employee violates a policy or a regulator asks whether training and notice were adequate, 'we sent an email' is weak evidence. Acknowledgments tie a person to a specific policy version at a specific time — the standard HR and compliance teams are held to in investigations and employment disputes.",
      },
      {
        heading: "Tie each request to a version",
        body: "Policies change. An acknowledgment of 'the handbook' without a version number is ambiguous. Label every release — v3.2, 2026-01-15 security policy — and ensure the acknowledgment record stores that identifier. When the policy updates, prior acknowledgments do not cover the new text.",
      },
      {
        heading: "Use affirmative acceptance",
        body: "Best practice is explicit action: check a box, click Accept, or sign electronically. Passive acknowledgment ('continued employment means acceptance') is used in some handbooks but is harder to defend for standalone policy updates. Make the action deliberate and logged.",
        bullets: [
          "Present the full policy or a link to the canonical PDF",
          "Require scroll or time-on-page only as a supplement — not a substitute for acceptance",
          "Record employee ID, version, timestamp, and IP or device where appropriate",
        ],
      },
      {
        heading: "New hires and role changes",
        body: "Include policy acknowledgment in onboarding before system access is granted where possible. When someone transfers into a regulated role, trigger the policies that apply to that role — not just the company-wide set from hire date.",
      },
      {
        heading: "Monitor completion and follow up",
        body: "Run completion reports by department and manager. Remind non-responders on a schedule. Escalate to managers when deadlines pass — especially for security and harassment policies. Incomplete acknowledgment rates are a metric; ignoring them is a liability.",
      },
    ],
  }),

  guide({
    slug: "how-to-handle-policy-version-changes",
    title: "How to Handle Policy Version Changes",
    summary:
      "How U.S. HR and compliance teams re-acknowledge employees when a policy is revised — without losing history.",
    answer:
      "Increment the version on every material change, archive the prior PDF, issue new acknowledgment requests tied to the new version, and preserve records of who accepted each prior version. Do not overwrite the old file in place — auditors and disputes ask what was in effect on a given date.",
    product: "policy-acknowledgment-tracker",
    workflow: "send-policy-acknowledgments",
    relatedGuides: [
      "how-to-collect-policy-acknowledgments",
      "how-to-prove-employees-read-a-policy",
      "how-to-roll-out-a-new-policy",
    ],
    relatedGlossary: ["version-history", "policy-acknowledgment", "attestation"],
    faqs: [
      {
        q: "Do employees need to re-acknowledge minor edits?",
        a: "Material changes — rights, obligations, reporting paths, discipline — require re-acknowledgment. Typo fixes may not. When in doubt, legal or compliance should classify the change.",
      },
      {
        q: "What happens to old acknowledgment records?",
        a: "Keep them. They prove what version someone accepted at the time. New acknowledgment does not erase historical records.",
      },
    ],
    sections: [
      {
        heading: "Define what counts as a new version",
        body: "Use semantic versioning or dated releases consistently. A new version should trigger re-acknowledgment when obligations, prohibited conduct, reporting mechanisms, or enforcement consequences change. Document the rationale so HR does not debate typos versus material edits on every release.",
      },
      {
        heading: "Archive — do not overwrite",
        body: "Store each published PDF or HTML snapshot with its version ID and effective date. If someone accepted v2 in March and v3 ships in June, you must prove what v2 said if an incident occurred in April. Overwriting a file on the intranet destroys that evidence.",
      },
      {
        heading: "Communicate the change clearly",
        body: "Tell employees what changed and why — summary of key revisions, effective date, and deadline to acknowledge. Link to the full policy. For regulated industries, align communication with training updates when the policy implements new procedures.",
      },
      {
        heading: "Re-run the acknowledgment campaign",
        body: "Issue requests to all in-scope employees, not only new hires. Track completion separately from the prior version. Managers should see their team's status. Set a firm deadline before the policy is considered in force for accountability purposes.",
      },
      {
        heading: "Preserve the version history in reports",
        body: "Reporting should answer: who accepted v3, who is still on v2 only, and who never acknowledged either. Cross-version views matter for workforce analytics and audits. Export history when employment disputes arise — 'current status' alone is insufficient.",
      },
    ],
  }),

  guide({
    slug: "how-to-prove-employees-read-a-policy",
    title: "How to Prove Employees Read a Policy",
    summary:
      "What evidence U.S. employers and auditors accept when asked to show an employee knew a policy — and what fails.",
    answer:
      "Produce a record linking the employee to the specific policy version, showing affirmative acceptance and a timestamp, plus the text they accepted. Read receipts, LMS completion without content linkage, and verbal assurances fail. Versioned electronic acknowledgment with retained policy text succeeds.",
    product: "policy-acknowledgment-tracker",
    workflow: "send-policy-acknowledgments",
    relatedGuides: [
      "how-to-collect-policy-acknowledgments",
      "how-to-handle-policy-version-changes",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["policy-acknowledgment", "attestation", "audit-trail"],
    faqs: [
      {
        q: "Does a signed paper handbook page work?",
        a: "It can, if you can produce the signed page and the handbook version it referenced. Paper is harder to search and easier to lose than electronic records.",
      },
      {
        q: "Is a training quiz enough?",
        a: "A quiz proves assessment completion, not necessarily that the full policy was presented. Pair training with acknowledgment of the policy document itself when both are required.",
      },
    ],
    sections: [
      {
        heading: "What investigators and auditors ask for",
        body: "They want three things: what the policy said at the time, proof the person had access to it, and proof they accepted or were on notice. Missing any leg weakens the defense in harassment, safety, data breach, or regulatory inquiries.",
      },
      {
        heading: "Evidence that holds up",
        body: "Strong records include the policy PDF or snapshot for version X, a log showing employee Y clicked Accept on date Z, and authentication tying the action to that employee's account.",
        bullets: [
          "Electronic signature or checkbox attestation",
          "Version ID and effective date stored with the event",
          "Immutable or append-only audit log",
          "Optional: IP address and user agent for additional attribution",
        ],
      },
      {
        heading: "Evidence that usually fails",
        body: "Email blast without read tracking tied to acceptance. A line in an offer letter saying policies apply. Manager saying 'I told them in orientation.' LMS 'completed' with no document version. These may support a narrative but do not reliably win disputes.",
      },
      {
        heading: "Matching the person to the right policy set",
        body: "Remote employees in multiple states may have different addenda. Contractors and interns may have a reduced set. Prove the person acknowledged the documents that applied to them — not a generic company-wide packet they never received.",
      },
      {
        heading: "Producing records on demand",
        body: "Practice exporting one employee's full acknowledgment history in minutes. Include policy text retrieval for each version. If production takes days of IT work, fix storage and indexing before the next audit or litigation hold.",
      },
    ],
  }),

  guide({
    slug: "how-to-roll-out-a-new-policy",
    title: "How to Roll Out a New Policy",
    summary:
      "A U.S. HR playbook for launching a new or heavily revised policy — from draft to full acknowledgment.",
    answer:
      "Align stakeholders, publish a versioned policy with an effective date, train managers on what changed, distribute acknowledgment requests to everyone in scope, monitor completion to a deadline, and only then treat the policy as fully operational for enforcement. Rolling out without acknowledgment completion creates gaps you cannot defend.",
    product: "policy-acknowledgment-tracker",
    workflow: "send-policy-acknowledgments",
    relatedGuides: [
      "how-to-collect-policy-acknowledgments",
      "how-to-handle-policy-version-changes",
      "how-to-prove-employees-read-a-policy",
    ],
    relatedGlossary: ["policy-acknowledgment", "version-history"],
    faqs: [
      {
        q: "How long should we give employees to acknowledge?",
        a: "Two to four weeks is common for company-wide policies. Urgent security changes may use shorter windows with explicit executive communication.",
      },
      {
        q: "Should managers acknowledge first?",
        a: "Yes — managers should receive the policy early so they can answer questions and reinforce completion with their teams.",
      },
    ],
    sections: [
      {
        heading: "Align before you publish",
        body: "Legal, compliance, IT, and business leads should sign off on substance and effective date. HR should know which populations are in scope — all employees, specific states, contractors with network access. Publishing first and fixing later confuses acknowledgment campaigns.",
      },
      {
        heading: "Prepare manager talking points",
        body: "Managers field questions. Give them a one-page summary of what changed, what stays the same, and where employees report concerns. For conduct and safety policies, clarify how reporting channels work in practice — not only on paper.",
      },
      {
        heading: "Publish with version and effective date",
        body: "Release the canonical document in one place — intranet, policy tool, or HRIS link. Version number and effective date should appear on the document face. Remove or clearly mark superseded versions so employees do not acknowledge outdated PDFs from bookmarks.",
      },
      {
        heading: "Run the acknowledgment campaign",
        body: "Send requests through a tracked channel. Dashboard completion by org unit. Remind at midpoint and before deadline. Escalate stragglers to managers and HRBPs. For large rollouts, consider live Q&A or office hours — especially for wage-and-hour or leave policy changes.",
      },
      {
        heading: "Close the rollout and enforce consistently",
        body: "After the deadline, report final completion rates to leadership. Document exceptions — leave of absence, unpaid leave — and how you will catch them up. Enforcement should reference the acknowledged version. Inconsistent enforcement undermines the policy and future rollouts.",
      },
    ],
  }),
];

export const trainingGuides = [
  guide({
    slug: "how-to-track-certification-expirations",
    title: "How to Track Certification Expirations",
    summary:
      "How U.S. HR, safety, and healthcare operations teams monitor professional certifications and licenses before they lapse.",
    answer:
      "Record each person's certification type, issuer, issue date, expiration date, and required renewal actions, then set reminders well before expiration — not on the expiration date. Spreadsheets work for a handful of people; workforce-scale compliance needs automated warnings and historical records.",
    product: "training-record-tracker",
    workflow: "track-training-records",
    relatedGuides: [
      "how-to-set-certification-renewal-reminders",
      "how-to-build-a-training-record-system",
      "how-to-prepare-training-records-for-an-audit",
    ],
    relatedGlossary: ["certification-expiration"],
    faqs: [
      {
        q: "How far in advance should we remind employees?",
        a: "60–90 days is typical for licenses requiring continuing education. High-stakes clinical or safety credentials may need 120 days to accommodate scheduling.",
      },
      {
        q: "Who owns renewal — HR or the employee?",
        a: "The employee usually completes renewal requirements, but the employer must monitor lapses that affect job eligibility and patient or customer safety. Assign a clear HR or compliance owner for monitoring.",
      },
    ],
    sections: [
      {
        heading: "Why expiration tracking is an employer problem",
        body: "Employees forget. Managers assume HR is watching. A lapsed RN license, expired forklift certification, or stale HIPAA training creates liability, billing risk, and scheduling chaos. Regulators and customers ask whether you knew — and whether you continued to assign work after expiration.",
      },
      {
        heading: "What to record for each certification",
        body: "Capture enough to answer: is this person credentialed for the work they are doing today?",
        bullets: [
          "Certification or license name and issuing body",
          "Credential number where applicable",
          "Issue date and expiration date",
          "Renewal requirements: CE hours, exam, supervisor sign-off",
          "Role or site where the credential is required",
          "Copy of the certificate on file",
        ],
      },
      {
        heading: "Set reminders before lapses",
        body: "Warn the employee and their manager at 90, 60, and 30 days — adjust for your industry's lead time. Block scheduling or system access on expiration only if your policy supports it and legal has approved. The goal is prevention, not surprise terminations.",
      },
      {
        heading: "Multi-state and multi-site complexity",
        body: "Nurses, engineers, and tradespeople may hold licenses in several states. Staffing firms place workers at client sites with different credential rules. Track credentials per person per jurisdiction — a valid home-state license may not suffice elsewhere.",
      },
      {
        heading: "Keep historical credentials",
        body: "Audits ask whether someone was credentialed on the date of service or incident. Store superseded certificates with dates. Today's valid card does not prove last month was covered.",
      },
    ],
  }),

  guide({
    slug: "how-to-build-a-training-record-system",
    title: "How to Build a Training Record System",
    summary:
      "How U.S. compliance-driven organizations structure training records so completion, content, and expiration are provable.",
    answer:
      "Define required training by role, record completion with course name, version, date, and expiration where applicable, assign an owner for data quality, and connect reminders to expiration dates. A folder of completion PDFs without role mapping fails the first time an auditor asks for proof by job function.",
    product: "training-record-tracker",
    workflow: "track-training-records",
    relatedGuides: [
      "how-to-track-certification-expirations",
      "how-to-prepare-training-records-for-an-audit",
      "how-to-set-certification-renewal-reminders",
    ],
    relatedGlossary: ["certification-expiration", "audit-trail"],
    faqs: [
      {
        q: "Do we need an LMS to track training?",
        a: "An LMS helps deliver content, but the record system must answer compliance questions — who completed what, when, and when it expires. Some teams use an LMS plus a compliance layer; others track externally delivered credentials.",
      },
      {
        q: "What about informal on-the-job training?",
        a: "Document it if your program requires it. Supervisor attestation with date, topic, and duration is stronger than verbal claims.",
      },
    ],
    sections: [
      {
        heading: "Start with role-based requirements",
        body: "List training and certifications required for each role or site — OSHA 10, HIPAA, harassment prevention, forklift, BLS, state harassment training by headcount. Without a requirements matrix, you cannot know who is deficient.",
      },
      {
        heading: "Standardize the record format",
        body: "Each entry should include employee identifier, training or credential name, provider, completion date, expiration date if any, score or pass-fail if applicable, and evidence file. Inconsistent spreadsheets become unsearchable within a year.",
      },
      {
        heading: "Single source of truth",
        body: "Pick one system of record — HRIS module, compliance tracker, or controlled database. Shadow trackers in email and personal drives diverge. Integrate imports from LMS or vendors rather than maintaining parallel lists.",
      },
      {
        heading: "Ownership and data hygiene",
        body: "Assign HR or compliance operations to reconcile new hires, transfers, and terminations weekly. Stale records for terminated employees inflate completion rates. Transfers should trigger new role requirements automatically where possible.",
      },
      {
        heading: "Connect to operations",
        body: "Training data should inform scheduling and access — not sit in a report no one reads. Facilities teams use credential status for shift assignment; IT uses security training for access renewal. Build exports or APIs that downstream owners actually use.",
      },
    ],
  }),

  guide({
    slug: "how-to-prepare-training-records-for-an-audit",
    title: "How to Prepare Training Records for an Audit",
    summary:
      "What U.S. auditors and accreditors expect when they sample training and certification records — and how to produce them fast.",
    answer:
      "Before the audit, reconcile your requirements matrix to actual records, close gaps or document remediation plans, and test export of a sample employee's full history including expiration dates and evidence files. Auditors sample people and dates — you must prove credentials were valid on those dates, not just today.",
    product: "training-record-tracker",
    workflow: "track-training-records",
    relatedGuides: [
      "how-to-build-a-training-record-system",
      "how-to-track-certification-expirations",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["certification-expiration", "audit-trail"],
    faqs: [
      {
        q: "How many records will auditors sample?",
        a: "It varies by framework — OSHA, Joint Commission, CMS, SOC 2 each have different methods. Prepare as if they will pull random employees across roles and dates.",
      },
      {
        q: "What if we find gaps right before the audit?",
        a: "Remediate immediately where possible, document corrective action for the rest, and never backdate records. Falsified completion is worse than a documented gap.",
      },
    ],
    sections: [
      {
        heading: "Know the audit scope",
        body: "Identify which standards apply — state OSHA, HIPAA, Joint Commission, PCI, company SOC 2. Each maps to specific training types and frequencies. Your requirements matrix should mirror the audit checklist language so you do not debate whether a course counts.",
      },
      {
        heading: "Pre-audit reconciliation",
        body: "Run a deficiency report: required training minus completed training, by person and role. Fix high-risk gaps first — clinical licenses, safety-critical certs. For remaining gaps, document approved remediation with dates. Auditors respect honest corrective action plans.",
      },
      {
        heading: "Assemble the evidence packet",
        body: "For each sampled employee, be ready to produce: job description or role code, list of required training, completion records with dates, expiration status on the sample date, and certificate PDFs or LMS transcripts. Include policy version if training was tied to a policy acknowledgment.",
      },
      {
        heading: "Point-in-time proof",
        body: "The hardest question: was this person credentialed on March 15? You need historical expiration data and archived certificates — not a note that they renewed in April. Systems that only store current status fail here.",
      },
      {
        heading: "Dry-run the export",
        body: "Time how long it takes to produce five complete employee files. If IT must manually gather from three systems, fix integration before auditors arrive. A clean export builds credibility; scrambling destroys it.",
      },
    ],
  }),

  guide({
    slug: "how-to-set-certification-renewal-reminders",
    title: "How to Set Certification Renewal Reminders",
    summary:
      "How U.S. teams configure reminder schedules so certifications and mandatory training renew before they expire.",
    answer:
      "For each credential with an expiration date, set reminders at 90, 60, and 30 days before lapse — adjusted for renewal lead time — notify both the employee and their manager, and escalate if no renewal activity is recorded. One reminder on the expiration date is too late for exams and CE bundles.",
    product: "training-record-tracker",
    workflow: "track-training-records",
    relatedGuides: [
      "how-to-track-certification-expirations",
      "how-to-build-a-training-record-system",
    ],
    relatedGlossary: ["certification-expiration"],
    faqs: [
      {
        q: "Should managers get copied on reminders?",
        a: "Yes for operational roles where lapse affects scheduling. Managers can remove barriers — approve training time, budget CE fees — that employees cannot solve alone.",
      },
      {
        q: "What if renewal is automatic?",
        a: "Some credentials auto-renew with fee payment only. Still set a reminder to verify payment posted and update the new expiration date in your system.",
      },
    ],
    sections: [
      {
        heading: "Match lead time to renewal effort",
        body: "A CPR card renewal may take an afternoon. A professional engineering license with continuing education may need months of coursework. Map each credential type to realistic lead time — 30 days is insufficient for credentials requiring 30 hours of CE.",
      },
      {
        heading: "Layered reminder schedule",
        body: "A practical default: first notice at 90 days (planning), second at 60 days (register for course or exam), third at 30 days (urgent), final at 14 days (escalation to manager and HR). Adjust per credential criticality.",
        bullets: [
          "Employee notification: email and in-app",
          "Manager copy: at 30 days and on expiration",
          "HR/compliance dashboard: all items under 60 days",
        ],
      },
      {
        heading: "Track renewal in progress",
        body: "Reminders should stop or change tone when renewal is in flight — exam scheduled, CE hours logged pending upload. Simple date-based nagging without status creates alert fatigue. Allow employees to mark 'renewal submitted' with proof upload.",
      },
      {
        heading: "Escalation paths",
        body: "Define what happens at expiration: removed from schedule, suspended system access, or HR conversation. Policies should be consistent and documented before the first lapse — not decided ad hoc under pressure.",
      },
      {
        heading: "Automate from the system of record",
        body: "Reminders tied to a spreadsheet depend on someone updating dates after renewal. Connect reminders to the training record system so completing renewal resets the clock automatically. Manual date entry is where lapses slip through.",
      },
    ],
  }),
];

export const invoiceGuides = [
  guide({
    slug: "how-to-design-an-approval-matrix",
    title: "How to Design an Approval Matrix",
    summary:
      "How U.S. finance teams define who approves invoices by amount, department, and vendor — so routing is automatic and auditable.",
    answer:
      "Document approval thresholds by dollar amount, cost center, and vendor category; assign named roles not just individuals; enforce segregation of duties; and version the matrix when org structure changes. An approval matrix that lives only in AP's head breaks the first time someone is on PTO or an auditor asks for the written policy.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: [
      "what-segregation-of-duties-means-in-ap",
      "how-to-set-up-invoice-approvals",
      "how-to-handle-out-of-policy-invoices",
    ],
    relatedGlossary: ["approval-matrix", "segregation-of-duties"],
    faqs: [
      {
        q: "Should approvers be people or roles?",
        a: "Define roles — department manager, site director, CFO — and map people to roles. Individuals change; the matrix should not require a rewrite every reorg.",
      },
      {
        q: "How many approval tiers do we need?",
        a: "Most mid-market companies use two to four tiers by amount. Too many tiers slow payments; too few weaken control on large spend.",
      },
    ],
    sections: [
      {
        heading: "Why a written matrix matters",
        body: "Without a matrix, approvers are chosen by whoever is available in email. That breaks segregation of duties, creates inconsistent treatment of similar invoices, and fails SOX-style audits. A written matrix is the control document AP implements in software.",
      },
      {
        heading: "Dimensions to route on",
        body: "Amount is the primary axis. Add department or cost center so spend is approved by someone who owns the budget. Vendor category matters for capital vs expense, IT vs facilities, and preferred vendor programs.",
        bullets: [
          "Under $1,000: department manager",
          "$1,000–$10,000: director plus budget owner",
          "Over $10,000: VP or CFO per policy",
          "New vendor or non-PO invoice: additional procurement review",
        ],
      },
      {
        heading: "Segregation of duties in the matrix",
        body: "The person who can add or change vendor bank details should not be the sole approver of that vendor's invoices. The person who submits a expense should not approve it. Encode these rules explicitly — auditors map duties to people.",
      },
      {
        heading: "Exceptions and delegation",
        body: "Document how PTO delegation works: acting approver, date range, same threshold limits. Out-of-office auto-forward in email is not delegation — it is unaudited routing. Matrix exceptions for emergencies need a named override role and post-hoc review.",
      },
      {
        heading: "Maintain and version the matrix",
        body: "Review quarterly and after reorgs. Store version history — auditors ask which matrix was in effect when an invoice was approved in Q2. AP should not guess; the system should apply the matrix version active on invoice date or receipt date per your policy.",
      },
    ],
  }),

  guide({
    slug: "what-segregation-of-duties-means-in-ap",
    title: "What Segregation of Duties Means in AP",
    summary:
      "A plain-language guide to segregation of duties in U.S. accounts payable — why it matters and how to implement it without paralyzing payments.",
    answer:
      "Segregation of duties means no single person controls the full payment cycle — vendor setup, invoice approval, and payment release should be split so fraud and errors require collusion. In AP, that means different people (or role-enforced steps) handle intake, approval, and disbursement, with an auditable trail for each.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: [
      "how-to-design-an-approval-matrix",
      "how-to-audit-invoice-approvals",
      "how-to-handle-out-of-policy-invoices",
    ],
    relatedGlossary: ["segregation-of-duties", "approval-matrix", "audit-trail"],
    faqs: [
      {
        q: "Is segregation of duties required for private companies?",
        a: "It is a core internal control expected by auditors and investors even when SOX does not apply literally. Banks and customers may require it contractually.",
      },
      {
        q: "How do small teams segregate duties?",
        a: "Use role separation in software, owner vs approver on invoices, and management review of payments — document compensating controls when headcount is limited.",
      },
    ],
    sections: [
      {
        heading: "The AP duties to separate",
        body: "Classic fraud schemes need one person to create a fake vendor, approve invoices, and pay them. Splitting those duties raises the bar.",
        bullets: [
          "Vendor master: create and change vendor records and banking",
          "Purchase authorization: PO or contract ownership",
          "Invoice approval: confirm goods or services and budget",
          "Payment: release funds and reconcile bank",
        ],
      },
      {
        heading: "What good separation looks like",
        body: "The employee who approves a utility bill should not be the only person who can change the utility company's ACH details. The AP clerk who enters invoices should not approve them unless your matrix explicitly allows low-dollar exceptions with secondary review.",
      },
      {
        heading: "SOX and private company reality",
        body: "Public companies under SOX document and test these controls. Private companies face the same fraud risk without the filing burden. Investors, lenders, and acquirers diligence AP controls — weak segregation surfaces in quality of earnings reviews.",
      },
      {
        heading: "Compensating controls for small teams",
        body: "When one person wears multiple hats, add mitigations: management review of payment runs, dual approval on vendor bank changes, automated three-way match, and monthly analytic review of new vendors and duplicate invoices. Document compensating controls — auditors accept them when well designed.",
      },
      {
        heading: "Implement in software, not policy alone",
        body: "A policy that says 'no self-approval' fails if the tool allows it. Enforce duties in the approval workflow: block self-approval, require second approver on vendor changes, log overrides. The trail should show who did what, not who was supposed to.",
      },
    ],
  }),

  guide({
    slug: "how-to-reduce-invoice-approval-delays",
    title: "How to Reduce Invoice Approval Delays",
    summary:
      "Practical ways U.S. AP teams speed invoice approvals without weakening controls or audit trails.",
    answer:
      "Automate routing from a clear approval matrix, surface overdue items daily, enable mobile one-click approval, define delegation for PTO, and fix master data so invoices are not stuck on wrong approvers. Delays usually come from routing errors and visibility gaps — not from having too many approvers.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: [
      "how-to-design-an-approval-matrix",
      "how-to-set-up-invoice-approvals",
      "how-to-audit-invoice-approvals",
    ],
    relatedGlossary: ["approval-matrix"],
    faqs: [
      {
        q: "What is a healthy approval cycle time?",
        a: "Many teams target 3–5 business days from receipt to approval for standard invoices. Complex or capital items take longer by design.",
      },
      {
        q: "Should we auto-approve small recurring invoices?",
        a: "Some teams auto-approve trusted recurring vendors within tight amount bands after initial setup. Document the rule and review periodically — it is a control relaxation, not a default.",
      },
    ],
    sections: [
      {
        heading: "Find where invoices actually stall",
        body: "Measure time in each queue: intake, coding, approver inbox, exception, payment. Most delays are a handful of approvers or systematic coding errors — not universal slowness. Dashboard overdue by approver and department before changing policy.",
      },
      {
        heading: "Automate routing from the matrix",
        body: "Manual 'who should approve this?' adds days. Invoices should land in the right inbox on receipt based on amount, GL coding, and vendor. Wrong routing generates round-robin email that nobody owns.",
      },
      {
        heading: "Make approval frictionless",
        body: "Approvers live in email and on phones. One-click approve with invoice image, amount, vendor, and budget line visible. Batch approve low-risk items in a queue. Forcing login to a slow ERP on desktop guarantees delay.",
      },
      {
        heading: "Escalation and delegation",
        body: "Auto-escalate after N business days to a backup approver or manager. Pre-register delegation before PTO. Escalation should be visible in the audit trail — not a side conversation that bypasses the system.",
      },
      {
        heading: "Clean up upstream causes",
        body: "Missing PO, wrong cost center, and incomplete intake send invoices to exception queues that dwarf approval time. Fix vendor master data, enforce PO policy where required, and return bad invoices to submitters quickly with a clear reason code.",
      },
    ],
  }),

  guide({
    slug: "how-to-audit-invoice-approvals",
    title: "How to Audit Invoice Approvals",
    summary:
      "How U.S. internal audit and finance teams sample invoice approvals and what evidence they expect to find.",
    answer:
      "For each sampled invoice, produce the invoice image, PO or contract support if required, the approval chain showing each approver and timestamp, evidence the correct matrix tier was applied, and payment record. Gaps in the chain or approvers below threshold for the amount are findings — 'approved in email' without a central trail is a finding waiting to happen.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: [
      "how-to-design-an-approval-matrix",
      "what-segregation-of-duties-means-in-ap",
      "what-makes-a-good-audit-trail",
    ],
    relatedGlossary: ["approval-matrix", "audit-trail", "segregation-of-duties"],
    faqs: [
      {
        q: "How many invoices should we sample?",
        a: "Internal audit typically uses risk-based sampling — more from high-dollar, new vendors, and manual payments. There is no universal count; document your methodology.",
      },
      {
        q: "Do we need PO matching for every invoice?",
        a: "Policy-dependent. Auditors look for consistency — PO required vendors without PO support is a common finding.",
      },
    ],
    sections: [
      {
        heading: "Define the audit objective",
        body: "Common objectives: approvals comply with the matrix, segregation of duties held, support exists for services billed, and payments match approved amounts. Scope informs which invoices to pull — capital, T&E, utilities, new vendors each carry different risks.",
      },
      {
        heading: "Evidence per sampled invoice",
        body: "Assemble a complete packet auditors can follow without AP narration.",
        bullets: [
          "Vendor invoice PDF and receipt date",
          "PO, receipt, or contract excerpt if policy requires",
          "Approval log: actor, role, date-time, action",
          "Matrix version showing required approvers for amount and department",
          "Payment authorization and bank record",
        ],
      },
      {
        heading: "Tests auditors run",
        body: "Was the approver authorized for this amount? Did anyone approve their own submission? Was there a second approver when required? Did payment occur before approval? Were vendor bank details changed near the payment date? Software trails answer these in seconds; email cannot.",
      },
      {
        heading: "Common findings and fixes",
        body: "Split approvals across email and ERP. Approvers below threshold. Rubber-stamp approvals with no review evidence. Late approval after payment. Fix with enforced workflow, training, and periodic AP control self-assessments — not only at year-end audit.",
      },
      {
        heading: "Continuous monitoring vs point-in-time",
        body: "Strong teams run monthly exception reports: invoices paid without approval, matrix overrides, new vendors with immediate large payments. Continuous monitoring reduces audit surprises and fraud window.",
      },
    ],
  }),

  guide({
    slug: "how-to-handle-out-of-policy-invoices",
    title: "How to Handle Out-of-Policy Invoices",
    summary:
      "How U.S. AP teams route invoices that miss a PO, exceed budget, or hit the wrong vendor — without bypassing controls.",
    answer:
      "Define what 'out of policy' means in your org, route those invoices to a dedicated exception queue with required fields and approvers, document the business justification, and apply elevated approval per the matrix. Silent exceptions — paying anyway without trail — are how fraud and audit findings accumulate.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    relatedGuides: [
      "how-to-design-an-approval-matrix",
      "what-segregation-of-duties-means-in-ap",
      "how-to-reduce-invoice-approval-delays",
    ],
    relatedGlossary: ["approval-matrix", "segregation-of-duties"],
    faqs: [
      {
        q: "What counts as out of policy?",
        a: "Common cases: no PO when PO required, invoice over PO amount, non-approved vendor, wrong GL or cost center, duplicate invoice, or services outside contract scope.",
      },
      {
        q: "Can managers approve their own exceptions?",
        a: "Avoid it. Exception paths should add a finance or procurement reviewer so budget owners cannot unilaterally bypass procurement policy.",
      },
    ],
    sections: [
      {
        heading: "Define categories of exceptions",
        body: "Write down exception types AP sees weekly: emergency purchase, PO mismatch, new vendor, capital not on capex plan, duplicate submission. Each category gets a routing rule and required documentation — not ad hoc judgment in the inbox.",
      },
      {
        heading: "Exception queue design",
        body: "Out-of-policy invoices should not sit in the standard approver's queue without context. Flag them visually, capture reason codes, and require attachment of approval email, business case, or procurement waiver. Standard approvers may still need to sign off — plus an exception reviewer.",
      },
      {
        heading: "Elevated approval thresholds",
        body: "Treat exceptions as higher risk by default. A $2,000 invoice without a PO might need department head plus finance ops. Document who can grant recurring exceptions vs one-time waivers.",
      },
      {
        heading: "SLA and visibility",
        body: "Exceptions take longer — set explicit SLAs and report aging weekly. Leadership should see volume and top reason codes. Spikes in 'emergency purchase' often signal training gaps or policy mismatch with how people actually buy.",
      },
      {
        heading: "Close the loop to policy",
        body: "Track repeat offenders by vendor, department, and requester. Feed patterns back to procurement — maybe the PO process is broken, not the users. Exceptions are data; ignoring them recreates the same friction every month.",
      },
    ],
  }),
];
