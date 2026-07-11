export type GlossaryTermSpec = {
  slug: string;
  term: string;
  definition: string;
  why: string;
  examples?: string;
  product?: string;
  workflow?: string;
  guide?: string;
  related: string[];
};

export const phase2GlossaryTerms: GlossaryTermSpec[] = [
  {
    slug: "exempt-payee-code",
    term: "Exempt Payee Code",
    definition:
      "A code on Form W-9 indicating whether a payee is exempt from backup withholding under specific IRS categories.",
    why: "Selecting the wrong exempt payee code can cause improper withholding or missed B-notice responses. Validating the code at collection prevents year-end corrections.",
    product: "w9-collector",
    related: ["backup-withholding", "tin-validation"],
  },
  {
    slug: "payee-name-mismatch",
    term: "Payee Name Mismatch",
    definition:
      "A discrepancy between the legal name on a W-9 and the name on file with the IRS or in your vendor master.",
    why: "Name mismatches are a leading cause of B-notices and 1099 corrections. Catching them before payment protects filing accuracy.",
    product: "w9-collector",
    related: ["tin-matching", "taxpayer-identification-number"],
  },
  {
    slug: "disregarded-entity",
    term: "Disregarded Entity",
    definition:
      "An LLC with a single owner that the IRS treats as part of the owner for tax purposes, not as a separate entity.",
    why: "Disregarded entities report on the owner's TIN, not the LLC's EIN. Wrong classification on the W-9 breaks 1099 reporting.",
    related: ["llc-tax-classification", "taxpayer-identification-number"],
  },
  {
    slug: "llc-tax-classification",
    term: "LLC Tax Classification",
    definition:
      "The federal tax category an LLC elects—such as disregarded entity, partnership, or corporation—reported on Form W-9.",
    why: "LLC vendors frequently mark the wrong classification box. Validating it keeps entity type, TIN, and 1099 forms aligned.",
    product: "w9-collector",
    related: ["disregarded-entity", "w-9"],
  },
  {
    slug: "fatca-reporting",
    term: "FATCA Reporting",
    definition:
      "Foreign Account Tax Compliance Act rules requiring certain payers to report payments to foreign entities and withhold when documentation is missing.",
    why: "Cross-border vendors may need W-8 series forms instead of W-9. Knowing when FATCA applies avoids withholding errors.",
    related: ["form-w8-ben", "withholding-exemption"],
  },
  {
    slug: "form-w8-ben",
    term: "Form W-8BEN",
    definition:
      "An IRS form foreign individuals use to certify tax status and claim treaty benefits instead of submitting Form W-9.",
    why: "U.S. payers must collect the right tax form by payee type. A foreign contractor needs W-8BEN, not W-9.",
    product: "w9-collector",
    related: ["fatca-reporting", "withholding-exemption"],
  },
  {
    slug: "withholding-exemption",
    term: "Withholding Exemption",
    definition:
      "A payee status that qualifies the vendor to receive full payment without backup withholding when properly documented.",
    why: "Missing exemption documentation forces 24% backup withholding. Operational teams need the exemption recorded before pay runs.",
    related: ["backup-withholding", "exempt-payee-code"],
  },
  {
    slug: "tin-validation",
    term: "TIN Validation",
    definition:
      "Checking that a taxpayer identification number is present, correctly formatted, and consistent with the payee name on file.",
    why: "Invalid TINs trigger IRS notices and withholding. Validating at W-9 intake is cheaper than fixing after payment.",
    product: "w9-collector",
    workflow: "collect-w9s",
    related: ["tin-matching", "payee-name-mismatch"],
  },
  {
    slug: "payee-statement",
    term: "Payee Statement",
    definition:
      "A written statement from a payee explaining missing or corrected tax identification information after a B-notice.",
    why: "B-notice workflows require documented payee responses. Tracking statements proves you followed IRS procedures.",
    related: ["backup-withholding", "tin-validation"],
  },
  {
    slug: "vendor-tax-profile",
    term: "Vendor Tax Profile",
    definition:
      "The set of tax forms, classifications, and withholding status tied to a vendor for reporting and payment.",
    why: "A single vendor tax profile should follow the entity through name changes and mergers. Fragmented records create 1099 risk.",
    product: "w9-collector",
    related: ["w-9", "vendor-master-record"],
  },
  {
    slug: "certificate-holder",
    term: "Certificate Holder",
    definition:
      "The person or organization listed on a certificate of insurance as the party receiving proof of coverage.",
    why: "The certificate holder name must match your legal entity to rely on the COI. Wrong holder names invalidate proof of coverage.",
    product: "coi-tracker",
    related: ["certificate-of-insurance", "additional-insured"],
  },
  {
    slug: "policy-endorsement",
    term: "Policy Endorsement",
    definition:
      "An amendment attached to an insurance policy that adds or changes coverage, such as additional insured status.",
    why: "COI checkboxes alone do not prove endorsements exist. Reviewing endorsements confirms contractual insurance requirements.",
    product: "coi-tracker",
    related: ["additional-insured", "acord-25"],
  },
  {
    slug: "workers-compensation-certificate",
    term: "Workers Compensation Certificate",
    definition:
      "Proof that a vendor carries workers compensation insurance covering employees who perform work on your behalf.",
    why: "Hiring uninsured contractors can leave you liable for workplace injuries. Workers comp certificates are a standard onboarding requirement.",
    product: "coi-tracker",
    related: ["certificate-of-insurance", "coverage-type"],
  },
  {
    slug: "primary-and-non-contributory",
    term: "Primary and Non-Contributory",
    definition:
      "Insurance language making a policy primary and preventing contribution from other policies when multiple cover a loss.",
    why: "Contracts often require primary and non-contributory wording. Verifying it on endorsements closes a common coverage gap.",
    related: ["additional-insured", "policy-endorsement"],
  },
  {
    slug: "certificate-of-insurance-request",
    term: "Certificate of Insurance Request",
    definition:
      "A formal ask for a vendor or broker to provide an ACORD certificate showing required coverage.",
    why: "Tracked COI requests create audit evidence. Untracked email asks leave no proof you required insurance before work began.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    related: ["certificate-of-insurance", "acord-25"],
  },
  {
    slug: "named-insured",
    term: "Named Insured",
    definition:
      "The person or organization listed on an insurance policy as the primary insured party.",
    why: "The named insured on the policy should match the vendor you contracted with. Mismatches signal the wrong entity is covered.",
    related: ["certificate-of-insurance", "certificate-holder"],
  },
  {
    slug: "certificate-expiration-date",
    term: "Certificate Expiration Date",
    definition:
      "The date on a certificate of insurance when one or more listed policies will lapse if not renewed.",
    why: "Operations teams rely on expiration dates to trigger renewals before vendors work uninsured. Missing or misread dates are a common cause of coverage gaps.",
    product: "coi-tracker",
    workflow: "track-coi-expirations",
    related: ["certificate-of-insurance", "acord-25"],
  },
  {
    slug: "insurance-broker-contact",
    term: "Insurance Broker Contact",
    definition:
      "The agent or broker listed on a COI who can issue updated certificates or confirm coverage details.",
    why: "When a vendor ignores renewal requests, the broker contact is often faster than chasing the vendor. Storing it on the vendor record speeds escalations.",
    product: "coi-tracker",
    related: ["certificate-of-insurance-request", "certificate-expiration-date"],
  },
  {
    slug: "subrogation-waiver",
    term: "Subrogation Waiver",
    definition:
      "Contract or policy language where an insurer gives up the right to recover losses from a third party, often required on construction and vendor agreements.",
    why: "Contracts frequently require a waiver of subrogation on workers comp and general liability. Missing waivers can void indemnity protections you thought you had.",
    related: ["primary-and-non-contributory", "workers-compensation-certificate"],
  },
  {
    slug: "leie",
    term: "LEIE",
    definition:
      "The List of Excluded Individuals and Entities maintained by the HHS Office of Inspector General for parties barred from federal healthcare programs.",
    why: "Screening against the LEIE is a baseline payer and provider compliance control. Using the current list with dated results proves due diligence.",
    product: "exclusion-monitor",
    workflow: "screen-vendors-against-exclusion-lists",
    related: ["oig-exclusion", "exclusion-screening"],
  },
  {
    slug: "exclusion-screening",
    term: "Exclusion Screening",
    definition:
      "The process of checking individuals and entities against federal and state exclusion lists before hire, onboarding, or payment.",
    why: "One-time screening at onboarding is not enough—lists update monthly. Continuous screening with evidence reduces civil monetary penalty exposure.",
    product: "exclusion-monitor",
    related: ["leie", "re-screening-cadence"],
  },
  {
    slug: "re-screening-cadence",
    term: "Re-Screening Cadence",
    definition:
      "The scheduled frequency—such as monthly or quarterly—at which you re-check parties against exclusion and sanctions lists.",
    why: "Payer compliance programs expect ongoing monitoring, not a single onboarding check. A defined cadence makes gaps visible before auditors do.",
    product: "exclusion-monitor",
    related: ["exclusion-screening", "payer-compliance-program"],
  },
  {
    slug: "false-positive-match",
    term: "False Positive Match",
    definition:
      "A screening hit where the name on an exclusion list does not actually refer to the vendor or individual you screened.",
    why: "Unresolved false positives block onboarding or payment without cause. Documented review and clearance keeps workflows moving with defensible evidence.",
    product: "exclusion-monitor",
    related: ["exclusion-match-review", "exclusion-screening"],
  },
  {
    slug: "reinstatement-date",
    term: "Reinstatement Date",
    definition:
      "The date an excluded individual or entity is removed from the LEIE and may again participate in federal healthcare programs.",
    why: "Vendors cleared after exclusion need a recorded reinstatement date before you resume payments or access. Screening alone does not prove eligibility restored.",
    related: ["leie", "exclusion-match-review"],
  },
  {
    slug: "medicare-participation",
    term: "Medicare Participation",
    definition:
      "Enrollment status allowing a provider or supplier to bill Medicare and receive payment under program rules.",
    why: "Contracting with excluded parties can jeopardize your own Medicare participation. Vendor screening ties directly to maintaining program eligibility.",
    related: ["payer-compliance-program", "oig-exclusion"],
  },
  {
    slug: "exclusion-match-review",
    term: "Exclusion Match Review",
    definition:
      "The documented process of investigating a screening hit to confirm or clear a potential exclusion match.",
    why: "Auditors want more than a spreadsheet flag—they want who reviewed the hit, what evidence was used, and when the party was cleared or blocked.",
    product: "exclusion-monitor",
    related: ["false-positive-match", "reinstatement-date"],
  },
  {
    slug: "payer-compliance-program",
    term: "Payer Compliance Program",
    definition:
      "A health plan or provider organization's structured policies and controls for meeting CMS and OIG requirements, including vendor screening.",
    why: "Compliance programs define how often you screen, who approves exceptions, and what evidence to retain. Operational tools should map to those written standards.",
    related: ["re-screening-cadence", "medicare-participation"],
  },
  {
    slug: "vendor-packet",
    term: "Vendor Packet",
    definition:
      "The complete set of documents and attestations—W-9, COI, questionnaires, screening results—required before a vendor is approved.",
    why: "Incomplete packets slip through when items live in email. A single packet view shows what is missing and who is blocking approval.",
    workflow: "vendor-onboarding",
    related: ["supplier-questionnaire", "vendor-tier"],
  },
  {
    slug: "vendor-tier",
    term: "Vendor Tier",
    definition:
      "A risk-based classification that determines which documents, reviews, and approvals a vendor must complete.",
    why: "Not every vendor needs the same depth of diligence. Tiering focuses high-touch controls on high-risk suppliers without slowing low-risk purchases.",
    related: ["vendor-packet", "third-party-risk-assessment"],
  },
  {
    slug: "supplier-questionnaire",
    term: "Supplier Questionnaire",
    definition:
      "A structured form vendors complete covering security, privacy, financial stability, or industry-specific compliance topics.",
    why: "Questionnaires surface risks that certificates and tax forms do not capture. Tracked responses create evidence for procurement and audit reviews.",
    related: ["vendor-packet", "third-party-risk-assessment"],
  },
  {
    slug: "payment-hold",
    term: "Payment Hold",
    definition:
      "A block on invoice or disbursement processing until required vendor documentation or approvals are satisfied.",
    why: "Payment holds enforce policy without relying on AP memory. Linking holds to missing W-9s, COIs, or screening clears gaps before money leaves.",
    related: ["vendor-packet", "vendor-master-record"],
  },
  {
    slug: "vendor-master-record",
    term: "Vendor Master Record",
    definition:
      "The authoritative profile for a supplier in your ERP or vendor system, including legal name, tax ID, payment terms, and compliance status.",
    why: "Compliance data scattered outside the vendor master gets ignored at payment time. Syncing documents and status to the master record keeps AP aligned.",
    related: ["vendor-tax-profile", "payment-hold"],
  },
  {
    slug: "vendor-offboarding",
    term: "Vendor Offboarding",
    definition:
      "The controlled process of ending a vendor relationship, including access revocation, final payments, and records retention.",
    why: "Offboarding without a checklist leaves system access, auto-renewals, and liability exposures open. Documented steps prove the relationship truly ended.",
    related: ["vendor-master-record", "vendor-packet"],
  },
  {
    slug: "third-party-risk-assessment",
    term: "Third-Party Risk Assessment",
    definition:
      "An evaluation of a vendor's security, financial, regulatory, and operational risk before or during the relationship.",
    why: "Assessments drive tiering and control selection. Without a recorded assessment, procurement cannot explain why a vendor received lighter or heavier scrutiny.",
    related: ["vendor-tier", "supplier-questionnaire"],
  },
  {
    slug: "master-service-agreement",
    term: "Master Service Agreement (MSA)",
    definition:
      "A framework contract setting general terms between parties, with individual statements of work defining specific projects or services.",
    why: "MSAs outlive individual projects. Tracking the MSA separately from SOWs prevents you from missing renewal, liability, or insurance terms that apply to all work.",
    product: "contract-renewal-tracker",
    related: ["statement-of-work", "contract-obligation"],
  },
  {
    slug: "change-order",
    term: "Change Order",
    definition:
      "A written amendment to a contract or SOW that modifies scope, price, or timeline after the original agreement.",
    why: "Verbal scope changes create disputes and audit findings. Tracked change orders keep contract obligations and invoice amounts aligned.",
    related: ["statement-of-work", "contract-obligation"],
  },
  {
    slug: "service-level-agreement",
    term: "Service Level Agreement (SLA)",
    definition:
      "Contract terms defining measurable service standards, remedies, and sometimes credits when performance falls short.",
    why: "SLA breaches affect operations and may trigger fee reductions. Monitoring obligations tied to SLAs keeps vendor management proactive, not reactive.",
    product: "contract-renewal-tracker",
    related: ["contract-obligation", "master-service-agreement"],
  },
  {
    slug: "liquidated-damages",
    term: "Liquidated Damages",
    definition:
      "A contract clause specifying a predetermined amount owed when a party fails to meet defined performance or delivery obligations.",
    why: "Teams miss liquidated damages deadlines when obligations live only in PDFs. Extracting and tracking them prevents silent waiver of contractual remedies.",
    related: ["contract-obligation", "service-level-agreement"],
  },
  {
    slug: "contract-obligation",
    term: "Contract Obligation",
    definition:
      "A specific duty a party must perform under a contract, such as delivering reports, maintaining insurance, or giving renewal notice.",
    why: "Renewal dates get calendar entries; other obligations do not. Tracking obligations separately stops insurance, reporting, and notice requirements from being forgotten.",
    product: "contract-renewal-tracker",
    related: ["master-service-agreement", "notice-period"],
  },
  {
    slug: "contract-repository",
    term: "Contract Repository",
    definition:
      "A centralized store of executed agreements with metadata such as counterparty, dates, owners, and linked amendments.",
    why: "Contracts buried in shared drives cannot drive alerts or audits. A repository with searchable fields turns static PDFs into operational records.",
    product: "contract-renewal-tracker",
    related: ["contract-obligation", "master-service-agreement"],
  },
  {
    slug: "assignment-clause",
    term: "Assignment Clause",
    definition:
      "Contract language governing whether a party may transfer its rights or obligations to another entity without consent.",
    why: "Vendors that merge or assign contracts without permission can shift liability to an unknown party. Knowing assignment restrictions protects your approval controls.",
    related: ["master-service-agreement", "contract-obligation"],
  },
  {
    slug: "three-way-match",
    term: "Three-Way Match",
    definition:
      "Accounts payable control comparing an invoice to its purchase order and receiving documentation before approval or payment.",
    why: "Three-way matching catches quantity, price, and receipt discrepancies before cash goes out. Automating the match reduces fraud and duplicate payment risk.",
    product: "invoice-approval",
    workflow: "route-invoice-approvals",
    related: ["purchase-order-match", "duplicate-invoice"],
  },
  {
    slug: "non-po-invoice",
    term: "Non-PO Invoice",
    definition:
      "An invoice submitted without a purchase order, common for utilities, rent, or recurring services under contract.",
    why: "Non-PO invoices need alternate approval paths and accrual handling. Treating them like standard PO invoices either blocks legitimate payables or bypasses controls.",
    product: "invoice-approval",
    related: ["invoice-accrual", "approval-matrix"],
  },
  {
    slug: "invoice-accrual",
    term: "Invoice Accrual",
    definition:
      "Recording an expense in the accounting period when goods or services were received, even if the invoice has not yet arrived.",
    why: "Month-end close depends on accruals for late invoices. Linking accruals to contracts and POs reduces misstated liabilities and duplicate payments when invoices appear.",
    related: ["non-po-invoice", "three-way-match"],
  },
  {
    slug: "duplicate-invoice",
    term: "Duplicate Invoice",
    definition:
      "The same invoice or charge submitted more than once for payment, intentionally or by error.",
    why: "Duplicate payments drain working capital and complicate recovery. Detection at intake—before approval—is far cheaper than chasing refunds after pay runs.",
    product: "invoice-approval",
    related: ["three-way-match", "purchase-order-match"],
  },
  {
    slug: "purchase-order-match",
    term: "Purchase Order Match",
    definition:
      "Verification that invoice line items align with an approved purchase order for vendor, amount, and quantity.",
    why: "PO matching is the first line of defense against unauthorized spend. Exceptions should route to approvers with context, not sit in email.",
    product: "invoice-approval",
    related: ["three-way-match", "duplicate-invoice"],
  },
  {
    slug: "policy-distribution",
    term: "Policy Distribution",
    definition:
      "The process of delivering updated policies or handbooks to employees and confirming the correct version reached the audience.",
    why: "Publishing a policy is not compliance—distribution with tracking is. Teams need proof that the right version went to the right people on schedule.",
    product: "policy-acknowledgment-tracker",
    workflow: "send-policy-acknowledgments",
    related: ["policy-acknowledgment", "employee-handbook-version"],
  },
  {
    slug: "employee-handbook-version",
    term: "Employee Handbook Version",
    definition:
      "A numbered or dated edition of the employee handbook reflecting current policies, benefits, and conduct expectations.",
    why: "Acknowledgments must tie to a specific handbook version. When policies change, you need a clear cutover so old acknowledgments do not cover new rules.",
    product: "policy-acknowledgment-tracker",
    related: ["policy-distribution", "code-of-conduct-attestation"],
  },
  {
    slug: "code-of-conduct-attestation",
    term: "Code of Conduct Attestation",
    definition:
      "A recorded confirmation that an employee read and agrees to follow the organization's code of conduct for a given version.",
    why: "Ethics and healthcare compliance programs expect annual attestations with timestamps. Missing attestations weaken defense in misconduct or fraud investigations.",
    product: "policy-acknowledgment-tracker",
    related: ["attestation", "employee-handbook-version"],
  },
  {
    slug: "coverage-type",
    term: "Coverage Type",
    definition:
      "The category of insurance listed on a certificate, such as general liability, auto, workers compensation, or professional liability.",
    why: "Contracts specify required coverage types and minimum limits. Checking types—not just expiration dates—catches certificates that look valid but omit required lines.",
    product: "coi-tracker",
    related: ["certificate-of-insurance", "workers-compensation-certificate"],
  },
];
