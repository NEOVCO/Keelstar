import type { GuideArticleSpec } from "../create-guide";

export const oigPhase3Specs: GuideArticleSpec[] = [
  {
    slug: "how-to-screen-locum-tenens-for-oig",
    cluster: "oig",
    title: "How to Screen Locum Tenens for OIG",
    summary:
      "OIG LEIE exclusion screening for locum tenens physicians and advanced practice providers — onboarding, agency placements, and recurring checks.",
    answer:
      "Locum tenens providers perform billable clinical services connected to federal healthcare programs — they require OIG LEIE screening before assignment and on your recurring re-screen schedule. Screen the individual provider's legal name, professional names, and known aliases against the LEIE and applicable state Medicaid exclusion lists before they treat patients or submit claims under your billing. Staffing agency attestation is not sufficient; maintain your own dated search records. Locum arrangements often involve rapid onboarding — embed LEIE screening in your credentialing workflow so clearance completes before system access or privileging. Re-screen monthly or quarterly per your policy because a provider cleared at assignment start can be excluded mid-contract. Document search date, list version, names searched, and result for every locum placement.",
    primaryKeyword: "screen locum tenens oig",
    relatedGuideSlugs: [
      "how-to-screen-medical-staffing-vendors-for-exclusions",
      "how-to-screen-contractors-for-oig-exclusions",
      "how-to-search-the-oig-leie-database",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do we screen locums placed through a staffing agency?",
        a: "Yes. Request agency documentation but run your own LEIE search. Ultimate compliance responsibility typically remains with the hiring organization.",
      },
      {
        q: "When should locum OIG screening happen?",
        a: "Before clinical assignment, privileging, or claims submission — whichever comes first. Re-screen on your defined recurring schedule.",
      },
      {
        q: "Should we search professional names or legal names?",
        a: "Search legal name first, then professional names, maiden names, and common variations used in credentialing files.",
      },
      {
        q: "What if a locum is excluded after onboarding?",
        a: "Immediately suspend assignment, hold claims, escalate to compliance and legal, and document the timeline from exclusion effective date.",
      },
    ],
    sections: [
      {
        heading: "Why locum tenens require OIG screening",
        body: "Locum providers deliver patient care and generate claims billable to Medicare and Medicaid. Excluded individuals cannot furnish services paid by federal healthcare programs — regardless of whether they are W-2, 1099, or agency-placed.",
      },
      {
        heading: "Screen before assignment, not after",
        body: "Credentialing timelines for locums are compressed. Build LEIE screening into the mandatory pre-assignment checklist alongside license verification and malpractice insurance.",
        bullets: [
          "LEIE search before privileging",
          "State Medicaid list checks where applicable",
          "Document result on provider credential file",
          "Block assignment until clear or false positive resolved",
        ],
      },
      {
        heading: "Agency vs direct locum screening",
        body: "Staffing agencies may provide exclusion attestation — verify with your own dated LEIE search. Contract language should require agencies to notify you of exclusion events and allow audit of their screening records.",
      },
      {
        heading: "Names and identifiers to search",
        body: "Use legal name from credentialing application and W-9. Search aliases, former names, and name variations on state licenses. Compare NPI and date of birth against potential matches.",
      },
      {
        heading: "Recurring screening for active locums",
        body: "Providers excluded after initial clearance create ongoing claims exposure. Include active locum tenens in monthly or quarterly re-screen batches alongside employed clinical staff.",
      },
      {
        heading: "Documentation for payer and CMS audit",
        body: "Retain screening records per placement: provider name, search date, LEIE version, result, and reviewer. Export evidence by assignment date range when auditors sample locum credentialing files.",
      },
    ],
  },
  {
    slug: "how-to-screen-dme-vendors-for-oig",
    cluster: "oig",
    title: "How to Screen DME Vendors for OIG",
    summary:
      "How U.S. healthcare providers screen durable medical equipment vendors and suppliers against the OIG LEIE before contracting and on a recurring basis.",
    answer:
      "DME vendors furnish items billable to Medicare and Medicaid — exclusion screening against the OIG LEIE is mandatory before contracting and throughout the relationship. Screen the supplier's legal entity name, DBAs, and individual owners or officers when your policy requires principal screening. DME is a high-risk category for OIG enforcement; excluded suppliers and their principals appear frequently on the LEIE. Document each search with date, list version, and result. Re-screen monthly or quarterly given direct claims exposure. Include DME suppliers in vendor onboarding packets alongside W-9 and accreditation verification. Do not rely on accreditation body checks alone — maintain your own dated LEIE evidence. Confirmed exclusions require immediate contract termination and claims impact assessment.",
    primaryKeyword: "screen dme vendors oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-owners-and-officers-for-oig",
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do DME suppliers require OIG screening?",
        a: "Yes. DME items and services are paid by federal healthcare programs. Excluded suppliers create civil monetary penalty exposure for providers who bill for their items.",
      },
      {
        q: "Should we screen DME company owners?",
        a: "Yes, for small suppliers and when owners perform operational roles. OIG excludes both entities and individuals.",
      },
      {
        q: "How often should DME vendors be re-screened?",
        a: "Monthly or quarterly is standard for DME given high enforcement focus and direct billing connection.",
      },
      {
        q: "Does DMEPOS accreditation replace OIG screening?",
        a: "No. Accreditation verifies quality standards; LEIE screening is a separate federal exclusion obligation you must document independently.",
      },
    ],
    sections: [
      {
        heading: "DME vendor exclusion risk",
        body: "DME suppliers provide equipment and supplies directly billed to Medicare and Medicaid. OIG actively excludes DME suppliers for fraud and abuse. Your organization cannot bill for items furnished by excluded parties.",
      },
      {
        heading: "Entity and principal screening",
        body: "Search the supplier's legal business name and all known DBAs. For small DME shops, screen individual owners and managing employees who influence billing operations.",
        bullets: [
          "Legal entity name from W-9 and contract",
          "DBAs and trade names",
          "Owners and officers for small suppliers",
          "State Medicaid lists in addition to LEIE",
        ],
      },
      {
        heading: "Onboarding controls for DME suppliers",
        body: "Include LEIE screening in DME vendor onboarding before formulary approval or preferred supplier designation. Block purchase orders until screening completes and is documented.",
      },
      {
        heading: "Re-screening DME relationships",
        body: "DME suppliers excluded mid-contract taint claims for equipment already provided. Re-screen on your highest-risk schedule and upon ownership changes or acquisition.",
      },
      {
        heading: "Handling confirmed DME exclusions",
        body: "Terminate the supplier relationship, notify compliance and legal, assess claim impact, and retain screening records showing when the exclusion appeared relative to your contract period.",
      },
      {
        heading: "Audit evidence for DME screening",
        body: "Export screening logs by supplier, search date, and result for CMS and payer audits. Gaps in DME vendor screening are a common finding in provider compliance reviews.",
      },
    ],
  },
  {
    slug: "how-to-screen-home-health-partners-for-oig",
    cluster: "oig",
    title: "How to Screen Home Health Partners for OIG",
    summary:
      "OIG LEIE screening for home health agency partners, subcontractors, and referral relationships — compliance steps for U.S. healthcare providers.",
    answer:
      "Home health partners — including home health agencies, therapy contractors, nursing subcontractors, and referral partners performing services billable to Medicare or Medicaid — must be screened against the OIG LEIE before engagement and on a recurring schedule. Screen legal entity names, DBAs, and key clinical and administrative principals. Home health is a high-scrutiny area for OIG enforcement; excluded agencies and individuals appear regularly on the LEIE. Document initial and recurring searches with date, list source, and result. Include home health partners in your vendor and subcontractor screening program, not just employed staff. Contract language should require partners to screen their own subcontractors and notify you of exclusion events. Confirmed exclusions require immediate cessation of referrals and billing for services furnished by the excluded party.",
    primaryKeyword: "screen home health oig",
    relatedGuideSlugs: [
      "how-to-screen-subcontractors-against-oig",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-contractors-for-oig-exclusions",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do we screen home health agencies we refer to?",
        a: "Yes, when they perform services connected to your patients and federal program billing. Referral relationships do not eliminate exclusion screening obligations.",
      },
      {
        q: "Should therapy subcontractors be screened separately?",
        a: "Yes. Screen subcontractors performing billable home health services on your behalf — not just the primary agency contract.",
      },
      {
        q: "Which state lists apply to home health partners?",
        a: "Screen state Medicaid exclusion lists for every state where the partner delivers services to your patients, in addition to the federal LEIE.",
      },
      {
        q: "How often should home health partners be re-screened?",
        a: "Monthly or quarterly for active partners with ongoing patient care relationships.",
      },
    ],
    sections: [
      {
        heading: "Home health exclusion exposure",
        body: "Home health services are predominantly funded by Medicare and Medicaid. Partners who are excluded — or who employ excluded clinicians — create civil monetary penalty exposure for every claim tied to their services.",
      },
      {
        heading: "Who to screen in home health relationships",
        body: "Screen broadly across the home health network.",
        bullets: [
          "Home health agency legal entity",
          "Therapy and nursing subcontractors",
          "Individual clinicians on contract",
          "Referral and care coordination partners",
          "Agency owners and managing employees",
        ],
      },
      {
        heading: "Initial screening at contract signing",
        body: "Complete LEIE and state list screening before executing referral agreements or admitting first shared patient. Block referrals until screening clears or false positives are documented.",
      },
      {
        heading: "Subcontractor flow-down requirements",
        body: "Primary home health agency contracts should require subcontractor LEIE screening, notification of matches, and your right to audit screening records.",
      },
      {
        heading: "Recurring monitoring",
        body: "Active home health partners should re-screen monthly or quarterly. New subcontractor engagement triggers immediate screening before patient assignments continue.",
      },
      {
        heading: "Documentation for survey and audit",
        body: "Retain dated screening records for every partner and subcontractor. CMS surveyors and payer auditors sample home health referral and vendor files specifically for exclusion compliance.",
      },
    ],
  },
  {
    slug: "what-is-leie-reinstatement",
    cluster: "oig",
    title: "What Is LEIE Reinstatement?",
    summary:
      "What OIG LEIE reinstatement means, how excluded parties apply for reinstatement, and what U.S. healthcare compliance teams verify before re-engagement.",
    answer:
      "LEIE reinstatement is the process by which an excluded individual or entity applies to the OIG for removal from the List of Excluded Individuals and Entities after the mandatory exclusion period ends. Reinstatement is not automatic — the excluded party must submit a written request to OIG and receive approval before participating again in federal healthcare programs. Until OIG grants reinstatement and removes the party from the LEIE, your organization cannot employ, contract with, or pay them for services connected to Medicare or Medicaid. If a formerly excluded vendor claims reinstatement, verify by searching the current LEIE — absence from the list after OIG confirmation is the authoritative evidence. Document the LEIE search date and result before resuming any relationship. Do not rely on vendor self-attestation alone.",
    primaryKeyword: "leie reinstatement",
    relatedGuideSlugs: [
      "what-is-the-oig-leie-list",
      "how-to-resolve-an-oig-list-match",
      "what-to-do-when-oig-screening-finds-a-match",
      "how-to-search-the-oig-leie-database",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Is reinstatement from the LEIE automatic after the exclusion period?",
        a: "No. Excluded parties must apply to OIG for reinstatement and receive approval. They remain on the LEIE until OIG removes them.",
      },
      {
        q: "How do we verify a vendor was reinstated?",
        a: "Search the current LEIE. If the party no longer appears and OIG has confirmed reinstatement in writing, document the search and clearance before re-engagement.",
      },
      {
        q: "Can we contract with someone pending reinstatement?",
        a: "No. Until OIG removes the party from the LEIE, they remain excluded from federal healthcare program participation.",
      },
      {
        q: "How long do OIG exclusions last?",
        a: "Varies by offense — often five years minimum for many convictions, with some permanent exclusions. Reinstatement is only available after the exclusion term ends.",
      },
    ],
    sections: [
      {
        heading: "What reinstatement means",
        body: "Reinstatement restores eligibility to participate in federal healthcare programs after a period of OIG exclusion. It requires OIG approval — excluded parties cannot simply wait out the period and resume billing.",
      },
      {
        heading: "The reinstatement application process",
        body: "Excluded parties submit a written reinstatement request to OIG after their exclusion term ends. OIG evaluates the request and decides whether to remove the party from the LEIE. Processing time varies.",
      },
      {
        heading: "What compliance teams must verify",
        body: "Before re-engaging a formerly excluded party, run a fresh LEIE search and confirm removal from the list. Retain search date, list version, and result. Request OIG reinstatement letter if available.",
        bullets: [
          "Current LEIE search showing party not listed",
          "Date of reinstatement approval if documented",
          "Compliance sign-off before re-engagement",
          "Updated screening schedule for reinstated parties",
        ],
      },
      {
        heading: "Do not rely on verbal reinstatement claims",
        body: "Vendors may claim they are cleared without OIG confirmation. The LEIE publication is authoritative — search it before resuming payment or clinical privileges.",
      },
      {
        heading: "Re-engagement controls after reinstatement",
        body: "Treat reinstated parties as new onboarding: fresh credentialing, contract review, and enhanced monitoring for a defined period. Document compliance leadership approval for re-engagement.",
      },
      {
        heading: "Permanent exclusions",
        body: "Some exclusions are permanent with no reinstatement path. If a party remains on the LEIE indefinitely, no re-engagement is permitted for federal healthcare program-connected work.",
      },
    ],
  },
  {
    slug: "how-to-screen-owners-and-officers-for-oig",
    cluster: "oig",
    title: "How to Screen Owners and Officers for OIG",
    summary:
      "When and how U.S. healthcare organizations screen individual owners, officers, and key principals of vendor entities against the OIG LEIE.",
    answer:
      "OIG exclusions attach to individuals as well as entities — screening only the company name misses excluded owners who control or perform work through the business. Screen individual owners, officers, and managing members of vendor entities when your compliance policy requires principal screening — especially for small LLCs, sole proprietorships, DME suppliers, home health agencies, and billing companies. Search legal names and aliases against the LEIE and state Medicaid lists. Document each search with date, list version, and result. Principal screening complements entity screening: a clean entity name with an excluded owner still creates exposure if that person performs billable or program-connected work. Include principal screening in vendor onboarding for high-risk tiers and re-screen on your recurring schedule.",
    primaryKeyword: "screen owners officers oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-dme-vendors-for-oig",
      "how-to-search-the-oig-leie-database",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "When is owner screening required?",
        a: "Common for small entities, sole proprietorships, DME suppliers, billing vendors, and any vendor where owners perform operational or clinical work. Define requirements in your written policy.",
      },
      {
        q: "Do we need ownership percentages to screen?",
        a: "Policy varies — many organizations screen all owners above a threshold (e.g., 5% or 20%) and all officers with management authority.",
      },
      {
        q: "What identifiers help resolve owner name matches?",
        a: "Date of birth, address, NPI, and exclusion effective date from the LEIE entry compared against your vendor ownership disclosure.",
      },
      {
        q: "Should owners be re-screened on schedule?",
        a: "Yes. Include identified principals in your monthly or quarterly re-screen roster alongside entities.",
      },
    ],
    sections: [
      {
        heading: "Why entity screening alone is insufficient",
        body: "Excluded individuals often continue operating through corporate shells or small businesses registered in a non-excluded entity name. OIG expects providers to look through entity structure to individuals who perform or control program-connected services.",
      },
      {
        heading: "Collect ownership information at onboarding",
        body: "Request owner and officer names, titles, and ownership percentages in your vendor onboarding packet. You cannot screen principals you have not identified.",
        bullets: [
          "Owner and officer disclosure form",
          "Beneficial ownership for small entities",
          "Managing member names for LLCs",
          "Updated disclosure on ownership changes",
        ],
      },
      {
        heading: "How to search individual principals",
        body: "Use legal names from ownership disclosure and W-9. Search LEIE with full name, then aliases and former names. Compare date of birth and address against potential matches.",
      },
      {
        heading: "Risk-based principal screening tiers",
        body: "Screen all principals for high-risk vendors — billing, DME, pharmacy, home health. For lower-risk large corporations with passive ownership, document your rationale if principal screening is not performed.",
      },
      {
        heading: "Re-screening owners and officers",
        body: "Include identified principals in recurring re-screen batches. Trigger immediate re-screen upon ownership change notification or acquisition.",
      },
      {
        heading: "Document principal screening for audit",
        body: "Log each owner search separately from entity search: name searched, date, result, and disposition. Auditors sample whether you screened individuals behind small vendor entities.",
      },
    ],
  },
  {
    slug: "how-to-integrate-oig-screening-with-vendor-packets",
    cluster: "oig",
    title: "How to Integrate OIG Screening with Vendor Packets",
    summary:
      "How U.S. healthcare organizations embed OIG LEIE screening into unified vendor onboarding packets alongside W-9, COI, and contract requirements.",
    answer:
      "Integrate OIG LEIE screening into your vendor onboarding packet so exclusion checks run automatically when a new vendor record is created — not as a separate manual step weeks later. A complete vendor packet should trigger LEIE search using the legal name from the W-9, log the result on the vendor master, and block approval until screening shows clear or documented false-positive disposition. Combine OIG screening with W-9 collection, COI upload, business associate agreements, and contract signature in one branded portal experience. Define pass criteria in your onboarding workflow: screening complete, result attached, reviewer identified. Re-screening schedules should activate automatically after initial packet approval. Unified packets reduce compliance gaps where AP has tax forms but compliance never ran exclusion checks — a frequent audit finding.",
    primaryKeyword: "oig screening vendor packets",
    relatedGuideSlugs: [
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-onboard-vendors-with-w9-and-oig-together",
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion","vendor-onboarding"],
    faqs: [
      {
        q: "What belongs in a healthcare vendor packet?",
        a: "Typically W-9, OIG LEIE screening, COI, BAA if applicable, ownership disclosure, and contract or rate agreement — customized by vendor risk tier.",
      },
      {
        q: "Should OIG screening block vendor approval?",
        a: "Yes. Do not mark a vendor approved or release payment until LEIE screening completes and any potential match is resolved.",
      },
      {
        q: "Can vendor packets automate LEIE search?",
        a: "Yes. Platforms can run LEIE search on vendor name submission and attach dated results to the vendor record automatically.",
      },
      {
        q: "Do all vendors need OIG in the packet?",
        a: "Apply by risk tier. Vendors performing federal healthcare program-connected services belong in scope. Document exclusions for pure non-healthcare vendors.",
      },
    ],
    sections: [
      {
        heading: "Why integrate screening into packets",
        body: "Standalone screening spreadsheets fail when volume grows. Embedding LEIE checks in vendor packets makes exclusion screening a mandatory onboarding gate — not an optional compliance task.",
      },
      {
        heading: "Design the unified vendor packet",
        body: "Map required documents and checks by vendor risk tier. High-risk healthcare vendors get full packet; lower tiers get reduced requirements with documented rationale.",
        bullets: [
          "W-9 and banking details",
          "OIG LEIE search with logged result",
          "COI with expiration tracking",
          "BAA and contract where required",
          "Ownership disclosure for principal screening",
        ],
      },
      {
        heading: "Workflow gates and approval criteria",
        body: "Define what must be complete before vendor status moves to approved: each packet component validated, screening clear or resolved, and internal reviewer sign-off recorded.",
      },
      {
        heading: "Use W-9 legal name for LEIE search",
        body: "Feed line 1 of the W-9 into your LEIE search to reduce name mismatches. Search aliases and DBAs after the primary legal name check completes.",
      },
      {
        heading: "Activate recurring screening post-approval",
        body: "Initial packet screening is the floor. Upon approval, enroll the vendor in your monthly or quarterly re-screen schedule automatically based on risk tier assignment.",
      },
      {
        heading: "Export complete packets for audit",
        body: "Auditors request onboarding evidence as a bundle. Export packets showing W-9, screening date, result, COI, and approval timestamp — not scattered attachments across systems.",
      },
    ],
  },
  {
    slug: "how-to-document-false-positive-oig-matches",
    cluster: "oig",
    title: "How to Document False Positive OIG Matches",
    summary:
      "How U.S. healthcare compliance teams investigate, resolve, and document false positive OIG LEIE name matches with audit-ready evidence.",
    answer:
      "A false positive OIG LEIE match occurs when a name search returns a potential hit that identifier comparison disproves — different date of birth, address, NPI, or specialty from your party's records. Document every false positive with the LEIE entry reviewed, identifiers compared, disposition rationale, reviewer name, and date closed. Never dismiss a match verbally without written evidence. Capture screenshots or exports of the LEIE entry alongside your internal record. Link the disposition to the vendor or employee master so future re-screens do not trigger redundant investigations. False positive documentation is as important as confirmed match records — auditors sample both to verify your screening program works correctly, not just that you ran searches.",
    primaryKeyword: "false positive oig match",
    relatedGuideSlugs: [
      "how-to-resolve-an-oig-list-match",
      "what-to-do-when-oig-screening-finds-a-match",
      "how-to-document-exclusion-screening",
      "how-to-search-the-oig-leie-database",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "What identifiers resolve most false positives?",
        a: "Date of birth, home or business address, NPI, general or specialty type, and exclusion effective date are the most useful LEIE fields for comparison.",
      },
      {
        q: "Who should approve false positive dispositions?",
        a: "Compliance or a designated screening analyst. High-risk vendors may require compliance leadership review before clearing.",
      },
      {
        q: "Should we store false positive records permanently?",
        a: "Yes, linked to the party's master record. Future re-screens may hit the same name — prior disposition prevents duplicate investigation.",
      },
      {
        q: "Can we proceed before false positive review completes?",
        a: "Hold payment and onboarding for billable roles during investigation. Clear only after documented disposition — not on assumption.",
      },
    ],
    sections: [
      {
        heading: "False positives are expected",
        body: "Common names generate LEIE hits that identifier comparison disproves. A screening program that never records false positives may be failing to investigate matches — or failing to document dispositions.",
      },
      {
        heading: "Investigation steps for potential matches",
        body: "When screening returns a hit, compare LEIE entry fields against your vendor or employee record before taking action.",
        bullets: [
          "Pull LEIE entry with all available identifiers",
          "Compare date of birth and address",
          "Compare NPI or UPIN if listed",
          "Review exclusion type and effective date",
          "Document side-by-side comparison",
        ],
      },
      {
        heading: "Required documentation fields",
        body: "Each false positive record should answer: who was screened, what name matched, what LEIE entry was reviewed, which identifiers differed, who reviewed, and when the case closed.",
      },
      {
        heading: "Link disposition to master record",
        body: "Attach the false positive disposition to the vendor or employee profile. Automated re-screening should recognize prior dispositions for the same LEIE entry ID when available.",
      },
      {
        heading: "When false positive is uncertain",
        body: "If identifiers partially align, escalate to compliance leadership before clearing. Document uncertainty and additional verification steps — do not clear ambiguous matches to avoid delay.",
      },
      {
        heading: "Auditor expectations for match dispositions",
        body: "CMS and payer auditors sample match investigations. 'We looked and it was fine' without detail fails scrutiny. Structured disposition notes with identifier comparison evidence pass.",
      },
    ],
  },
  {
    slug: "how-to-screen-pharmacy-vendors-for-oig",
    cluster: "oig",
    title: "How to Screen Pharmacy Vendors for OIG",
    summary:
      "OIG LEIE exclusion screening for pharmacy vendors, specialty pharmacies, and PBM partners — onboarding and recurring checks for healthcare providers.",
    answer:
      "Pharmacy vendors — including retail pharmacies, specialty pharmacies, compounding pharmacies, and pharmacy benefit managers — require OIG LEIE screening before contracting and on a recurring schedule when they dispense or manage medications billable to Medicare or Medicaid. Screen legal entity names, DBAs, and individual pharmacists or owners when your policy requires principal screening. Pharmacy is a high-enforcement OIG category; excluded pharmacies and pharmacists appear frequently on the LEIE. Document each search with date, list version, names searched, and result. Re-screen monthly or quarterly given direct Part D and Medicaid claims exposure. Include pharmacy vendors in onboarding packets and block formulary or network enrollment until screening clears.",
    primaryKeyword: "screen pharmacy vendors oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-owners-and-officers-for-oig",
      "how-to-screen-dme-vendors-for-oig",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do specialty pharmacies require OIG screening?",
        a: "Yes. Any pharmacy dispensing medications billed to federal healthcare programs should be screened against the LEIE.",
      },
      {
        q: "Should we screen individual pharmacists?",
        a: "Screen pharmacists-in-charge and owners of small pharmacy operations. Large chain pharmacies may focus on entity screening with policy-defined principal thresholds.",
      },
      {
        q: "Do PBMs need LEIE screening?",
        a: "Yes, when they manage Medicare Part D or Medicaid pharmacy benefits on your behalf or process claims connected to federal programs.",
      },
      {
        q: "How often should pharmacy vendors be re-screened?",
        a: "Monthly or quarterly for active pharmacy network partners given high OIG enforcement focus.",
      },
    ],
    sections: [
      {
        heading: "Pharmacy exclusion risk profile",
        body: "OIG excludes pharmacies and pharmacists for kickbacks, fraudulent billing, and controlled substance violations. Claims for medications dispensed by excluded pharmacies create direct CMP exposure.",
      },
      {
        heading: "Entity and pharmacist screening",
        body: "Search pharmacy legal name, NCPDP identifiers cross-referenced to name, and DBAs. For independent pharmacies, screen owner-pharmacists individually.",
        bullets: [
          "Pharmacy legal entity and DBA names",
          "Pharmacist-in-charge for small operations",
          "PBM entity for managed pharmacy benefits",
          "State Medicaid exclusion lists",
        ],
      },
      {
        heading: "Network and formulary onboarding gates",
        body: "Complete LEIE screening before adding pharmacies to preferred networks or formularies. Block enrollment until screening clears or false positive is documented.",
      },
      {
        heading: "340B and contract pharmacy considerations",
        body: "Contract pharmacies in 340B programs require the same LEIE screening as other pharmacy partners. Document screening for every dispensing site in the arrangement.",
      },
      {
        heading: "Recurring monitoring",
        body: "Pharmacy exclusions mid-contract affect all claims for dispensed medications during the exclusion period. Re-screen active pharmacy partners on your highest-risk schedule.",
      },
      {
        heading: "Audit documentation",
        body: "Export pharmacy vendor screening logs by network enrollment date and re-screen cycle. Payer pharmacy audits increasingly include LEIE evidence requests.",
      },
    ],
  },
  {
    slug: "how-to-screen-it-vendors-with-phi-access-for-oig",
    cluster: "oig",
    title: "How to Screen IT Vendors with PHI Access for OIG",
    summary:
      "OIG LEIE screening for IT vendors, EHR consultants, and technology subcontractors with access to PHI and claims systems.",
    answer:
      "IT vendors whose personnel access PHI, EHR systems, or claims platforms perform services connected to federal healthcare program operations — they belong in your OIG LEIE screening program. Screen the vendor entity, DBAs, and individual technicians or consultants with production system access when your policy requires principal screening. Excluded individuals performing billing support, coding, or system administration create the same CMP exposure as clinical exclusions. Document LEIE searches at onboarding before provisioning credentials and re-screen on your recurring schedule. Include IT subcontractors in flow-down screening requirements — cloud hosts, managed service providers, and offshore support teams are not exempt because work is technical rather than clinical. Combine OIG screening with BAA execution and access provisioning gates.",
    primaryKeyword: "screen it vendors oig phi",
    relatedGuideSlugs: [
      "how-to-screen-billing-vendors-for-oig-exclusions",
      "how-to-screen-subcontractors-against-oig",
      "how-to-screen-contractors-for-oig-exclusions",
      "how-often-to-re-screen-for-exclusions",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do IT vendors without patient contact need OIG screening?",
        a: "If they access PHI or claims systems connected to Medicare or Medicaid billing, yes. Remote access does not reduce exclusion screening obligations.",
      },
      {
        q: "Should we screen individual developers with EHR access?",
        a: "Screen personnel with production PHI or claims access per your policy — especially contractors and offshore support staff.",
      },
      {
        q: "Do SaaS vendors need LEIE screening?",
        a: "Screen vendors whose employees perform implementation, support, or maintenance touching your PHI or claims data. Pure licensing without service access may be lower tier — document your assessment.",
      },
      {
        q: "When should IT vendor screening happen?",
        a: "Before credential provisioning and system access — not after go-live.",
      },
    ],
    sections: [
      {
        heading: "Why IT vendors are in OIG scope",
        body: "Federal rules bar payment for services furnished by excluded individuals — including billing support, coding assistance, and claims system work. IT contractors with PHI access can affect program integrity even without patient contact.",
      },
      {
        heading: "Define PHI and claims access tiers",
        body: "Classify IT vendors by access level. Production PHI and claims system access warrants highest-tier screening frequency.",
        bullets: [
          "Production EHR and billing system access",
          "Revenue cycle and coding support contractors",
          "Cloud infrastructure with PHI storage",
          "Help desk with PHI ticket visibility",
          "Implementation consultants with admin credentials",
        ],
      },
      {
        heading: "Screen before credential provisioning",
        body: "Make LEIE clearance a prerequisite for account creation — alongside BAA signature and security training. Do not grant VPN or admin access pending screening.",
      },
      {
        heading: "Offshore and subcontractor IT screening",
        body: "Require prime IT vendors to screen subcontractors with PHI access and provide evidence on request. Verify high-risk offshore personnel independently when contractually permitted.",
      },
      {
        heading: "Re-screen on personnel changes",
        body: "New consultants joining an existing IT engagement trigger immediate screening. Include named personnel in recurring re-screen roster when they retain active access.",
      },
      {
        heading: "Combine with HIPAA and BAA controls",
        body: "OIG screening complements — not replaces — BAA and security requirements. Document both before vendor IT relationships become operational.",
      },
    ],
  },
  {
    slug: "how-to-build-an-oig-screening-policy",
    cluster: "oig",
    title: "How to Build an OIG Screening Policy",
    summary:
      "How U.S. healthcare compliance teams write an OIG LEIE screening policy covering scope, frequency, documentation, and escalation.",
    answer:
      "An OIG screening policy defines who you screen, which lists you check, how often you re-screen, what you document, and how you handle matches — in writing, approved by compliance leadership. Scope should cover employees, contractors, vendors, subcontractors, and medical staff performing services connected to federal healthcare programs. Specify LEIE plus applicable state Medicaid lists. Assign risk-based re-screening frequencies: monthly or quarterly for high-risk roles, less frequent for lower tiers with documented rationale. Require dated search records with list version, names searched, result, and reviewer. Define match investigation steps, hold procedures, and escalation to legal. Name policy owners and backup owners. Review the policy annually and after audit findings. A written policy without enforcement is insufficient — tie it to onboarding gates, payment holds, and automated monitoring.",
    primaryKeyword: "oig screening policy",
    relatedGuideSlugs: [
      "how-often-should-healthcare-providers-screen-oig",
      "how-to-document-exclusion-screening",
      "how-to-add-exclusion-screening-to-vendor-onboarding",
      "how-to-prepare-for-a-cms-exclusion-screening-audit",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "What must an OIG screening policy include?",
        a: "Scope of parties screened, lists checked, frequency by risk tier, documentation requirements, match investigation procedures, responsible owners, and enforcement consequences.",
      },
      {
        q: "Does CMS require a written exclusion policy?",
        a: "CMS and payer auditors expect documented screening programs. A written policy demonstrates intentional compliance design — not ad hoc checking.",
      },
      {
        q: "How often should the policy be updated?",
        a: "Review annually and after significant audit findings, organizational changes, or payer contract updates affecting screening requirements.",
      },
      {
        q: "Who should approve the OIG screening policy?",
        a: "Compliance leadership with input from legal, HR, and vendor management. Board or committee review may be required for some provider types.",
      },
    ],
    sections: [
      {
        heading: "Policy purpose and regulatory context",
        body: "Open with why exclusion screening exists: federal law prohibits payment for services by excluded parties. Reference Social Security Act sections 1128 and 1156 and CMP exposure for violations.",
      },
      {
        heading: "Define screening scope",
        body: "List every population in scope: employees, contractors, locums, vendors, subcontractors, medical staff, and downstream entities.",
        bullets: [
          "W-2 employees in billable roles",
          "1099 contractors and consultants",
          "Vendors and suppliers",
          "Subcontractors and agency placements",
          "Medical staff and credentialed providers",
        ],
      },
      {
        heading: "Lists and search methodology",
        body: "Specify OIG LEIE as primary federal list plus state Medicaid lists by operating state. Require legal name search with aliases. Reference LEIE download date in every record.",
      },
      {
        heading: "Frequency by risk tier",
        body: "Document tier definitions and re-screen schedules. High-risk: monthly or quarterly. Medium: quarterly or semi-annual. Low: annual with risk assessment. Ad hoc triggers on name or ownership changes.",
      },
      {
        heading: "Match investigation and escalation",
        body: "Define hold procedures, identifier comparison steps, false positive documentation, confirmed match escalation to legal, and re-engagement rules after reinstatement verification.",
      },
      {
        heading: "Governance, training, and audit",
        body: "Name policy owner and backup. Require staff training. Schedule internal audits of screening completeness. Review policy effectiveness after CMS or payer audit findings.",
      },
    ],
  },
  {
    slug: "how-to-screen-credentialing-vendors-for-oig",
    cluster: "oig",
    title: "How to Screen Credentialing Vendors for OIG",
    summary:
      "OIG LEIE screening for credentialing services vendors, CVOs, and primary source verification partners used by U.S. healthcare providers.",
    answer:
      "Credentialing vendors and credentials verification organizations perform services connected to your provider enrollment and payer contracts — screen them against the OIG LEIE before engagement and on a recurring schedule. A compromised credentialing vendor with excluded personnel could onboard excluded providers into your network. Screen the vendor entity, DBAs, and key personnel who access provider credential files or submit enrollment data. Do not assume credentialing vendors screen themselves adequately — verify with your own dated LEIE search and contractually require exclusion screening of their staff. Re-screen monthly or quarterly given access to sensitive provider data and enrollment workflows. Document screening as part of vendor due diligence alongside SOC reports and BAA review.",
    primaryKeyword: "screen credentialing vendors oig",
    relatedGuideSlugs: [
      "how-to-screen-vendors-against-the-oig-list",
      "how-to-screen-billing-vendors-for-oig-exclusions",
      "how-to-integrate-oig-screening-with-vendor-packets",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "Do CVOs need OIG screening?",
        a: "Yes. Credentialing verification organizations touch provider enrollment connected to federal programs. Screen the CVO entity and personnel with credential file access.",
      },
      {
        q: "If a CVO verifies OIG for us, do we still screen the CVO?",
        a: "Yes. Verify the CVO itself is not excluded and contractually require them to maintain their own screening program.",
      },
      {
        q: "Should credentialing software vendors be screened?",
        a: "Screen vendors whose staff access provider credential data or perform verification services. Pure software licensing without service delivery may be lower tier.",
      },
      {
        q: "How often should credentialing vendors be re-screened?",
        a: "Monthly or quarterly for vendors with ongoing access to credential files and enrollment submissions.",
      },
    ],
    sections: [
      {
        heading: "Credentialing vendor risk",
        body: "Credentialing vendors influence who enters your provider network. Excluded individuals within a CVO — or an excluded CVO entity itself — undermine your entire exclusion screening program.",
      },
      {
        heading: "Screen the CVO and its personnel",
        body: "Entity screening alone may miss excluded individuals processing credential files. Screen the organization and key staff with access to provider data.",
        bullets: [
          "CVO legal entity and DBAs",
          "Staff performing primary source verification",
          "Enrollment submission personnel",
          "Offshore credential processing teams if applicable",
        ],
      },
      {
        heading: "Contract requirements for CVOs",
        body: "Require CVOs to maintain LEIE screening for their employees, notify you of exclusion events, and permit audit of their screening records.",
      },
      {
        heading: "Due diligence alongside SOC and BAA",
        body: "Include LEIE screening in CVO vendor due diligence packet alongside SOC 2 reports, BAA, and reference checks. Do not grant credential system access until screening clears.",
      },
      {
        heading: "Re-screening credentialing relationships",
        body: "Active CVO contracts warrant recurring re-screens on your high-risk schedule. Personnel turnover at the CVO triggers screening of new staff with credential access.",
      },
      {
        heading: "Document for payer credentialing audit",
        body: "Payers audit whether credentialing functions include exclusion verification. Retain evidence that your CVO vendor itself was screened — not just that the CVO checks your providers.",
      },
    ],
  },
  {
    slug: "how-to-prepare-oig-evidence-for-cms-review",
    cluster: "oig",
    title: "How to Prepare OIG Evidence for CMS Review",
    summary:
      "How U.S. healthcare providers assemble OIG LEIE screening documentation for CMS surveys, RAC reviews, and compliance audits.",
    answer:
      "CMS reviewers expect proof that your organization screens employees, contractors, vendors, and medical staff against the OIG LEIE on a defined schedule — with complete records for sampled parties. Prepare evidence packages covering the review period: screening dates, LEIE list versions, names searched, results, match dispositions, and overdue exceptions with resolution. Organize by population — employees, vendors, medical staff — matching typical CMS sample methodology. Include your written screening policy, risk tier definitions, and re-screen calendar. Export structured logs — not email screenshots — with cover sheets summarizing total parties screened, confirmed matches, false positives, and overdue screens. Retain match investigation files with identifier comparison notes. Gap-free evidence on first request prevents expanded review scope.",
    primaryKeyword: "oig evidence cms review",
    relatedGuideSlugs: [
      "how-to-prepare-for-a-cms-exclusion-screening-audit",
      "how-to-export-oig-screening-evidence-for-auditors",
      "how-to-build-an-oig-screening-policy",
      "how-to-document-exclusion-screening",
    ],
    relatedGlossary: ["oig-exclusion"],
    faqs: [
      {
        q: "What does CMS ask for in exclusion screening reviews?",
        a: "Screening policy, sample of dated LEIE searches, match investigation records, re-screening evidence, and proof of onboarding screening before engagement.",
      },
      {
        q: "How far back should CMS evidence cover?",
        a: "Match the sample period requested — typically 12 to 36 months. Many organizations retain screening records for at least six years.",
      },
      {
        q: "Should we include state Medicaid list evidence?",
        a: "Yes, when CMS or your state survey scope includes state list screening. Document both LEIE and applicable state lists.",
      },
      {
        q: "What causes CMS to expand an exclusion audit sample?",
        a: "Incomplete records, missing re-screens, undocumented match dispositions, or gaps in vendor and subcontractor screening prompt expanded review.",
      },
    ],
    sections: [
      {
        heading: "Understand CMS review scope",
        body: "CMS surveyors and contractors evaluate whether you maintain an effective exclusion screening program — not just whether you searched once. They sample employees, vendors, and contractors across a defined period.",
      },
      {
        heading: "Core evidence components",
        body: "Every CMS evidence package should include these elements.",
        bullets: [
          "Written OIG screening policy with frequencies",
          "Initial onboarding screening records",
          "Recurring re-screen logs with LEIE version dates",
          "Match investigation and disposition files",
          "Overdue screen exceptions with resolution",
          "Subcontractor and vendor screening coverage",
        ],
      },
      {
        heading: "Organize by auditor sample type",
        body: "Structure exports to match how CMS samples: by employee roster, vendor list, or date range. Include a cover sheet with population totals and exception summary.",
      },
      {
        heading: "Match investigation documentation",
        body: "For any potential or confirmed match in the sample period, include LEIE entry reviewed, identifiers compared, disposition, reviewer, and date closed. False positives need the same rigor as confirmed matches.",
      },
      {
        heading: "Policy and governance evidence",
        body: "Provide the approved screening policy, evidence of staff training, named compliance owners, and internal audit results showing program effectiveness.",
      },
      {
        heading: "Pre-review gap remediation",
        body: "Run a self-audit before CMS arrives: identify overdue screens, missing vendor coverage, and incomplete match files. Remediate and document corrective action before the review starts — not during it.",
      },
    ],
  },
];
