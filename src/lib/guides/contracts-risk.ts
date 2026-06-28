import { guide } from "./helpers";

export const contractRiskGuides = [
  guide({
    slug: "how-to-review-a-contract-before-signing",
    title: "How to Review a Contract Before Signing",
    summary:
      "A practical checklist for U.S. business teams reviewing commercial contracts before signature — without waiting for counsel on every agreement.",
    answer:
      "Read the term, renewal, payment, termination, indemnification, limitation of liability, and governing law sections before signing. Confirm scope matches what was negotiated, identify auto-renewal and notice requirements, and flag one-sided liability or termination terms for legal review. Use a consistent checklist so nothing is skipped under time pressure.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "what-to-look-for-in-an-indemnification-clause",
      "how-to-read-a-limitation-of-liability-clause",
      "how-to-spot-risk-in-a-termination-clause",
      "what-governing-law-means-in-a-contract",
      "how-to-review-a-statement-of-work",
    ],
    relatedGlossary: ["indemnification", "limitation-of-liability", "termination-for-convenience"],
    faqs: [
      {
        q: "Do I need a lawyer for every contract?",
        a: "Not every agreement, but any contract with significant liability exposure, IP transfer, regulatory obligations, or non-standard terms should get legal review. A checklist helps you know which ones to escalate.",
      },
      {
        q: "What is the highest-risk clause to miss?",
        a: "Unlimited indemnification combined with a weak limitation of liability cap on the vendor's side. That combination can expose your organization to losses far exceeding contract value.",
      },
    ],
    sections: [
      {
        heading: "Start with the business terms",
        body: "Before reading legal clauses, confirm the commercial terms match what was negotiated: parties, scope, pricing, payment schedule, term length, and deliverables. Discrepancies between the proposal and the contract are common — especially in order forms attached to MSAs. If the business terms are wrong, the legal review is wasted.",
      },
      {
        heading: "The clauses that carry the most risk",
        body: "Every commercial contract should be reviewed for these sections, in roughly this priority:",
        bullets: [
          "Indemnification — who covers whose losses",
          "Limitation of liability — caps and exclusions on damages",
          "Termination — how and when each party can exit",
          "Term and renewal — auto-renewal and notice requirements",
          "Governing law and dispute resolution — which state's laws apply",
          "Intellectual property — who owns what is created",
          "Confidentiality and data handling — especially for PII or PHI",
        ],
      },
      {
        heading: "Check for incorporation by reference",
        body: "Many vendor contracts incorporate terms from a website, a click-through agreement, or a separate policy document. Those incorporated terms are binding even if you never read them. Follow the links, or ask the vendor for the current version of every referenced document before signing.",
      },
      {
        heading: "Use a consistent checklist",
        body: "Review quality drops under deadline pressure. A standard checklist — the same fields for every contract — prevents skipped sections and creates a record of what was reviewed. Note pass, flag, or escalate for each clause. Contracts that fail multiple checks go to legal before signature.",
      },
      {
        heading: "Know when to escalate to counsel",
        body: "Escalate when: liability is uncapped or indemnification is one-sided; the contract involves regulated data (HIPAA, PCI, GDPR); IP assignment is broader than expected; termination rights are asymmetric; governing law is unfavorable and non-negotiable; or the contract value exceeds your organization's signing authority threshold.",
      },
      {
        heading: "Document the review",
        body: "Store the checklist, flagged clauses, and any legal sign-off with the executed contract. If a dispute arises later, you need to show what was reviewed and what was accepted knowingly. A review record is also how you improve your template terms over time — recurring flags indicate clauses to push back on in future negotiations.",
      },
    ],
  }),

  guide({
    slug: "what-to-look-for-in-an-indemnification-clause",
    title: "What to Look for in an Indemnification Clause",
    summary:
      "How to read indemnification language in U.S. commercial contracts and identify one-sided or overbroad obligations.",
    answer:
      "Check who indemnifies whom, for what types of claims, whether indemnification is mutual or one-way, and whether it is capped by the limitation of liability. Broad indemnification — covering all claims arising from the contract regardless of fault — is a red flag. Indemnification for the other party's negligence should be resisted.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "how-to-review-a-contract-before-signing",
      "how-to-read-a-limitation-of-liability-clause",
      "how-to-spot-risk-in-a-termination-clause",
    ],
    relatedGlossary: ["indemnification", "indemnitee", "limitation-of-liability"],
    faqs: [
      {
        q: "What does indemnification mean in plain terms?",
        a: "One party agrees to cover the other party's losses from specified claims — typically including legal defense costs and settlements. It is essentially a contractual insurance policy.",
      },
      {
        q: "Should indemnification be mutual?",
        a: "In balanced commercial relationships, yes. Each party indemnifies the other for claims arising from its own breach, negligence, or misconduct. One-way indemnification favoring the vendor is common in form contracts and should be negotiated.",
      },
    ],
    sections: [
      {
        heading: "What indemnification does",
        body: "An indemnification clause requires one party (the indemnitor) to compensate the other (the indemnitee) for specified losses — including third-party claims, legal fees, and settlements. It shifts financial risk from the indemnitee to the indemnitor for covered events. In vendor contracts, vendors often ask customers to indemnify them broadly while offering narrow indemnification in return.",
      },
      {
        heading: "The four questions to ask",
        body: "Every indemnification clause answers four questions:",
        bullets: [
          "Who indemnifies whom — one-way or mutual?",
          "For what — breach, negligence, IP infringement, data breach, bodily injury?",
          "Scope — only third-party claims, or also direct losses between the parties?",
          "Cap — is indemnification subject to the limitation of liability, or uncapped?",
        ],
      },
      {
        heading: "Red flags in vendor contracts",
        body: "Watch for language requiring you to indemnify the vendor for claims arising from your use of the product — even if the product caused the harm. Indemnification for the vendor's own negligence, gross negligence, or willful misconduct is one-sided and should be rejected. Uncapped indemnification paired with a low liability cap on the vendor's obligations creates asymmetric risk.",
      },
      {
        heading: "IP indemnification",
        body: "Vendors typically indemnify customers against third-party claims that the product infringes intellectual property. Confirm the scope: does it cover modified versions, combinations with your systems, and claims in all jurisdictions where you operate? IP indemnification is one of the few areas where vendor indemnification of the customer is standard — push for it if missing.",
      },
      {
        heading: "Defense and control of claims",
        body: "Indemnification clauses often specify who controls the defense of indemnified claims. If the indemnitor controls defense, they choose the lawyers and settlement strategy. If you are the indemnitee, you may want the right to participate in or approve settlements. Read the defense obligations — they affect how claims are handled in practice, not just who pays.",
      },
      {
        heading: "Interaction with limitation of liability",
        body: "Some contracts cap general liability but carve out indemnification from the cap — meaning indemnification obligations are unlimited even when other damages are capped. Others subordinate indemnification to the overall liability cap. Understand which structure applies: uncapped indemnification with a $50,000 liability cap is a significant exposure.",
      },
    ],
  }),

  guide({
    slug: "how-to-read-a-limitation-of-liability-clause",
    title: "How to Read a Limitation of Liability Clause",
    summary:
      "How to identify liability caps, excluded damages, and carve-outs in U.S. commercial contract limitation of liability clauses.",
    answer:
      "Find the cap — usually stated as a dollar amount or multiple of fees paid — and the excluded damages, typically consequential, indirect, and lost profits. Check whether indemnification, confidentiality breaches, or data breaches are carved out from the cap. A low cap with broad exclusions on your side and narrow exclusions on the vendor's side is unfavorable.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "what-to-look-for-in-an-indemnification-clause",
      "how-to-review-a-contract-before-signing",
      "how-to-spot-risk-in-a-termination-clause",
    ],
    relatedGlossary: ["limitation-of-liability", "indemnification"],
    sections: [
      {
        heading: "What limitation of liability does",
        body: "This clause caps the total amount one party can recover from the other if something goes wrong — regardless of how much damage actually occurred. Without it, a vendor's software bug that shuts down your operations for a week could theoretically expose them to millions in lost revenue claims. The cap replaces that open-ended exposure with a defined maximum.",
      },
      {
        heading: "The cap structure",
        body: "Caps are typically expressed as: a fixed dollar amount (e.g., $100,000); a multiple of fees paid in the prior 12 months (e.g., 1x or 2x annual fees); or the fees paid under the specific order giving rise to the claim. Compare the cap to the contract value and to the potential harm if the vendor fails. A $10,000 cap on a $500,000 annual contract is worth negotiating.",
      },
      {
        heading: "Excluded damages",
        body: "Most limitation clauses exclude consequential, indirect, incidental, special, and punitive damages — for both parties. This means neither party can recover lost profits, lost data, business interruption, or reputational harm, even if the other party caused the problem. Understand that these exclusions cut both ways: they protect you from vendor claims too.",
      },
      {
        heading: "Carve-outs from the cap",
        body: "Certain obligations often sit outside the liability cap:",
        bullets: [
          "Indemnification obligations",
          "Breaches of confidentiality",
          "Data breach or privacy violations",
          "Gross negligence or willful misconduct",
          "Payment obligations",
          "IP infringement indemnification",
        ],
      },
      {
        heading: "Mutual vs one-sided caps",
        body: "Balanced contracts apply the same cap and exclusions to both parties. Vendor form contracts sometimes cap the vendor's liability while leaving your liability uncapped or subject to a higher cap. Compare both sides — a mutual $100,000 cap is very different from a $100,000 cap on the vendor and unlimited liability on the customer.",
      },
      {
        heading: "When the cap is too low",
        body: "If the liability cap is materially below the potential harm — a critical infrastructure vendor with a cap equal to one month of fees, for example — negotiate a higher cap, carve out specific risks, or require insurance. Accepting an inadequate cap is a business decision that should be documented, not an oversight.",
      },
    ],
  }),

  guide({
    slug: "how-to-spot-risk-in-a-termination-clause",
    title: "How to Spot Risk in a Termination Clause",
    summary:
      "How to evaluate termination rights, notice requirements, and wind-down obligations in U.S. commercial contracts.",
    answer:
      "Check whether both parties can terminate for convenience or only one; the notice period required; whether termination for cause requires cure periods; and what fees, data return, and transition obligations apply on exit. Asymmetric termination — where the vendor can exit easily but you cannot — is a common risk in form contracts.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "how-to-review-a-contract-before-signing",
      "how-to-give-notice-of-non-renewal",
      "what-an-evergreen-contract-means",
    ],
    relatedGlossary: ["termination-for-convenience", "notice-period", "evergreen-contract"],
    faqs: [
      {
        q: "What is termination for convenience?",
        a: "Either party can end the contract without proving the other breached — usually with written notice. It is the most flexible exit right and should be mutual in balanced agreements.",
      },
      {
        q: "What is termination for cause?",
        a: "A party may end the contract because the other breached a material term — often after a cure period to fix the breach. Cause termination is narrower but does not require waiting for a renewal notice window.",
      },
    ],
    sections: [
      {
        heading: "The three types of termination",
        body: "Most commercial contracts include some combination of: termination for convenience (exit without cause, with notice); termination for cause (exit because of breach, often with a cure period); and termination on insolvency or change of control. Know which types are available to each party — asymmetry here is one of the most common contract risks.",
      },
      {
        heading: "Check mutuality",
        body: "Can both parties terminate for convenience, or only the vendor? Can you terminate for the vendor's material breach, and can they terminate for yours? Vendor form contracts often give the vendor broad termination rights while restricting yours to cause-based exit with long notice periods. Flag one-sided termination for negotiation.",
      },
      {
        heading: "Notice periods on exit",
        body: "Termination for convenience typically requires 30, 60, or 90 days' written notice. Confirm the method — same as non-renewal notice requirements. For critical services, check whether the notice period gives you enough time to migrate to an alternative. A 30-day exit window on a core ERP system is operationally risky.",
      },
      {
        heading: "Fees and penalties on termination",
        body: "Some contracts require payment of remaining fees if you terminate early — effectively making the full term a minimum commitment regardless of termination rights. Others refund prepaid fees pro rata. Read the payment section alongside termination: termination for convenience means little if you owe the full contract value anyway.",
      },
      {
        heading: "Wind-down and transition obligations",
        body: "Termination triggers practical obligations: return or destruction of confidential data, transition assistance, export of your data in a usable format, and return of materials. Vendor contracts sometimes omit data return obligations or allow data deletion on termination. For any system holding your business data, confirm you can get it back.",
      },
      {
        heading: "Survival clauses",
        body: "Certain obligations survive termination: confidentiality, indemnification, limitation of liability, payment of accrued fees, and dispute resolution. Know what persists after the contract ends. A termination clause that ends the service but leaves broad indemnification in force creates ongoing exposure.",
      },
    ],
  }),

  guide({
    slug: "what-governing-law-means-in-a-contract",
    title: "What Governing Law Means in a Contract",
    summary:
      "What governing law and jurisdiction clauses mean in U.S. commercial contracts — and why they matter before you sign.",
    answer:
      "Governing law specifies which state's laws interpret the contract. Jurisdiction specifies where disputes are litigated. Together they determine the legal framework if a disagreement ends up in court. Vendor contracts typically choose the vendor's home state — negotiate if the contract is high-value or involves regulated data.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "how-to-review-a-contract-before-signing",
      "how-to-spot-risk-in-a-termination-clause",
      "what-to-look-for-in-an-indemnification-clause",
    ],
    relatedGlossary: ["governing-law"],
    sections: [
      {
        heading: "Governing law vs jurisdiction",
        body: "These are related but distinct. Governing law (also called choice of law) determines which state's statutes and case law apply to interpret the contract. Jurisdiction (or venue) determines which state's courts hear the dispute. A contract may be governed by Delaware law but require litigation in California courts — though often both point to the same state.",
      },
      {
        heading: "Why vendors choose their home state",
        body: "Vendor form contracts almost always specify the vendor's state of incorporation — often Delaware, California, or New York. The vendor's lawyers know that state's law, local courts are familiar with the vendor, and the vendor avoids litigating in your state. This is standard but not always neutral: some states favor certain types of contractual provisions differently.",
      },
      {
        heading: "Practical impact on your risk",
        body: "Governing law affects how courts interpret indemnification scope, liability caps, non-compete enforceability, and warranty disclaimers. A limitation of liability clause that is enforceable under one state's law may be challenged under another. You do not need to be an expert in every state's contract law — but you should know which state's rules apply to your agreement.",
      },
      {
        heading: "Dispute resolution alternatives",
        body: "Many contracts include arbitration or mediation clauses instead of or before litigation. Arbitration is typically faster and private but may limit discovery and appeal rights. Confirm whether disputes go to binding arbitration, which forum (AAA, JAMS), and whether small claims are excluded. An arbitration clause in a vendor's home state has similar practical effect to a jurisdiction clause.",
      },
      {
        heading: "When to negotiate governing law",
        body: "Push for your state's law when: the contract value is significant; the vendor performs services at your locations; the contract involves regulated data subject to your state's laws; or the vendor's chosen state has materially different contract enforcement rules. For low-value SaaS subscriptions, governing law is often not worth negotiating — but you should still know what you accepted.",
      },
      {
        heading: "Federal law overlay",
        body: "Some contract areas are governed by federal law regardless of the governing law clause — including copyright, patent, federal arbitration, and certain regulatory frameworks (HIPAA, GLBA). The governing law clause does not override federal statutes. If your contract involves regulated industries, confirm federal requirements independently of the state law choice.",
      },
    ],
  }),

  guide({
    slug: "how-to-review-a-statement-of-work",
    title: "How to Review a Statement of Work",
    summary:
      "How to review a Statement of Work (SOW) against the master agreement to confirm scope, deliverables, timelines, and acceptance criteria.",
    answer:
      "Read the SOW alongside the master agreement — the MSA governs legal terms, the SOW governs what is being delivered. Confirm deliverables are specific and measurable, timelines are realistic, acceptance criteria are defined, and pricing matches the proposal. Vague scope language is where scope creep and disputes begin.",
    product: "contract-risk-scanner",
    workflow: "review-contract-risk",
    relatedGuides: [
      "how-to-review-a-contract-before-signing",
      "how-to-read-a-limitation-of-liability-clause",
      "how-to-spot-risk-in-a-termination-clause",
    ],
    relatedGlossary: ["statement-of-work"],
    faqs: [
      {
        q: "What is the difference between an MSA and an SOW?",
        a: "The MSA (Master Services Agreement) sets the legal framework — liability, termination, IP, confidentiality. The SOW defines the specific project: deliverables, timeline, price, and acceptance criteria for one engagement.",
      },
      {
        q: "Can an SOW override the MSA?",
        a: "Usually no — the MSA states that it governs unless the SOW explicitly overrides a specific term. If the SOW is silent on a topic, the MSA applies. Check the order of precedence clause.",
      },
    ],
    sections: [
      {
        heading: "The MSA-SOW relationship",
        body: "Professional services and implementation engagements typically use a two-document structure: a Master Services Agreement that applies to all work between the parties, and a Statement of Work for each project. The MSA covers legal terms. The SOW covers commercial specifics. Review both together — a well-drafted MSA does not save you from a vague SOW.",
      },
      {
        heading: "Deliverables must be specific",
        body: "The highest-risk SOW language is vague deliverables: 'consulting services as requested' or 'support as needed.' Deliverables should be named, described, and measurable. 'Configure CRM integration per attached specification' is reviewable. 'Provide ongoing support' is not. If deliverables reference attachments, confirm the attachments are included and current.",
      },
      {
        heading: "Timelines and milestones",
        body: "Check: start date, end date, milestone dates, and what happens if the vendor misses them. Are there penalties or just extensions? Do your payment obligations tie to milestone completion? A SOW with payment due upfront and deliverables due in six months creates risk if the vendor underperforms.",
      },
      {
        heading: "Acceptance criteria",
        body: "Define how you accept or reject deliverables. Reasonable acceptance language gives you a defined period (e.g., 10 business days) to review and reject non-conforming work, with the vendor obligated to cure. Without acceptance criteria, the vendor can claim completion and invoice regardless of quality. Silence on acceptance usually favors the vendor.",
      },
      {
        heading: "Change control",
        body: "Scope changes happen. The SOW should specify how changes are requested, approved, and priced — typically through written change orders signed by both parties. Without change control, the vendor can claim extra work was authorized verbally, or you can be billed for scope you did not approve. No change order, no extra bill.",
      },
      {
        heading: "Pricing and expenses",
        body: "Confirm the SOW pricing matches the proposal: fixed fee vs time-and-materials, hourly rates, expense reimbursement caps, and what is included vs billable separately. Travel, software licenses, and third-party costs are common sources of surprise invoices. If expenses are reimbursable, set a cap or require pre-approval above a threshold.",
      },
    ],
  }),
];
