import type { Faq } from "./products";

/* ----------------------------- Workflows ----------------------------- */
export type Workflow = {
  slug: string;
  title: string; // "Collect W-9s"
  stage: "Collect" | "Extract" | "Approve" | "Monitor" | "Audit";
  summary: string;
  covers: string;
  struggle: string;
  stack: string[]; // product slugs
  tool: string; // tool slug
  template: string; // template slug
  steps: string[];
  audit: string;
  faqs: Faq[];
  primaryProduct: string;
  guides: string[];
  glossary: string[];
};

const w = (
  slug: string,
  title: string,
  stage: Workflow["stage"],
  summary: string,
  primaryProduct: string,
  extra?: Partial<Workflow>
): Workflow => ({
  slug,
  title,
  stage,
  summary,
  covers: extra?.covers ?? `${summary} Keelstar turns the manual version of this into a monitored workflow with a complete audit trail.`,
  struggle:
    extra?.struggle ??
    "Today this lives in spreadsheets, shared folders, and email reminders. Nothing is monitored, ownership is unclear, and the evidence is scattered across inboxes when someone finally asks for it.",
  stack: extra?.stack ?? [primaryProduct],
  tool: extra?.tool ?? "",
  template: extra?.template ?? "",
  steps:
    extra?.steps ?? [
      "Bring the documents or records into one place.",
      "Let Keelstar read the dates and details that matter.",
      "Route, approve, or assign ownership as needed.",
      "Monitor continuously with reminders before anything lapses.",
      "Export the audit trail whenever it's asked for.",
    ],
  audit:
    extra?.audit ??
    "Every action is recorded with an actor and timestamp, so the evidence is ready before anyone asks for it.",
  faqs: extra?.faqs ?? [],
  primaryProduct,
  guides: extra?.guides ?? [],
  glossary: extra?.glossary ?? [],
});

export const workflows: Workflow[] = [
  w("collect-w9s", "Collect W-9s", "Collect", "Get a current, validated W-9 on file for every vendor without chasing anyone over email.", "w9-collector", {
    tool: "w9-request-generator",
    template: "vendor-w9-request",
    glossary: ["w-9", "tin-matching"],
    guides: ["how-to-collect-w9s-from-vendors", "w9-vs-w8-which-form"],
    stack: ["w9-collector", "vendor-packet"],
  }),
  w("request-tax-documents-from-vendors", "Request tax documents from vendors", "Collect", "Request W-9s, W-8s, and other tax documents and track what's outstanding.", "w9-collector", { stack: ["w9-collector", "vendor-packet"], tool: "w9-request-generator", template: "vendor-w9-request" }),
  w("track-coi-expirations", "Track COI expirations", "Monitor", "Know before a vendor's certificate of insurance lapses — not after.", "coi-tracker", {
    tool: "coi-expiration-extractor",
    template: "coi-tracking-log",
    glossary: ["certificate-of-insurance", "acord-25"],
    guides: ["how-to-track-coi-expirations", "what-to-check-on-a-certificate-of-insurance"],
    stack: ["coi-tracker", "vendor-packet"],
  }),
  w("review-acord-certificates", "Review ACORD certificates", "Extract", "Read coverage, limits, and expiration off an ACORD 25 without re-keying it.", "coi-tracker", { tool: "acord-analyzer", template: "coi-tracking-log", glossary: ["acord-25", "additional-insured"], stack: ["coi-tracker"] }),
  w("build-vendor-onboarding-packets", "Build vendor onboarding packets", "Collect", "Collect every required vendor document in one secure flow.", "vendor-packet", { tool: "vendor-onboarding-packet-generator", template: "vendor-onboarding-checklist", stack: ["vendor-packet", "w9-collector", "coi-tracker"] }),
  w("screen-vendors-against-exclusion-lists", "Screen vendors against exclusion lists", "Monitor", "Check vendors against OIG, OFAC, and SAM on a schedule and keep the evidence.", "exclusion-monitor", { tool: "oig-search", template: "exclusion-screening-log", glossary: ["oig-exclusion", "ofac-sdn-list"], stack: ["exclusion-monitor"] }),
  w("screen-employees-against-exclusion-lists", "Screen employees against exclusion lists", "Monitor", "Screen staff against exclusion lists continuously, with a dated record.", "exclusion-monitor", { tool: "oig-search", template: "exclusion-screening-log", stack: ["exclusion-monitor"] }),
  w("monitor-contract-renewals", "Monitor contract renewals", "Monitor", "Never let a contract auto-renew by accident again.", "contract-renewal-tracker", {
    tool: "contract-renewal-extractor",
    template: "contract-renewal-log",
    glossary: ["auto-renewal-clause", "notice-period"],
    guides: ["how-to-track-contract-renewals", "how-to-find-a-contract-notice-period"],
    stack: ["contract-renewal-tracker", "contract-risk-scanner"],
  }),
  w("track-contract-notice-periods", "Track contract notice periods", "Monitor", "Work back from each renewal to the real deadline you must act by.", "contract-renewal-tracker", { tool: "notice-period-calculator", template: "notice-period-tracker", glossary: ["notice-period", "evergreen-contract"], stack: ["contract-renewal-tracker"] }),
  w("review-contract-risk", "Review contract risk", "Extract", "Get a fast, consistent read on the clauses that carry commercial risk.", "contract-risk-scanner", { tool: "contract-risk-clause-scanner", template: "contract-review-checklist", glossary: ["indemnification", "limitation-of-liability"], stack: ["contract-risk-scanner", "contract-renewal-tracker"] }),
  w("send-documents-for-signature", "Send documents for signature", "Approve", "Collect a signature and keep the executed copy with its audit trail.", "simple-signer", { tool: "pdf-signer", template: "signature-request", glossary: ["electronic-signature"], stack: ["simple-signer"] }),
  w("send-policy-acknowledgements", "Send policy acknowledgements", "Collect", "Distribute a policy and collect signed acknowledgements with version history.", "policy-acknowledgement-tracker", { tool: "policy-acknowledgement-link-maker", template: "policy-acknowledgement", glossary: ["policy-acknowledgement", "attestation"], stack: ["policy-acknowledgement-tracker"] }),
  w("track-policy-version-acceptance", "Track policy version acceptance", "Audit", "Know who accepted which version of which policy, and when.", "policy-acknowledgement-tracker", { tool: "policy-acknowledgement-link-maker", template: "policy-acknowledgement", glossary: ["version-history", "attestation"], stack: ["policy-acknowledgement-tracker"] }),
  w("track-training-records", "Track training records", "Monitor", "Keep a record of who completed which training and when it expires.", "training-record-tracker", { tool: "training-expiration-calculator", template: "training-record-log", glossary: ["certification-expiration"], stack: ["training-record-tracker"] }),
  w("monitor-certification-expirations", "Monitor certification expirations", "Monitor", "Get warned before any staff certification lapses.", "training-record-tracker", { tool: "training-expiration-calculator", template: "training-record-log", glossary: ["certification-expiration"], stack: ["training-record-tracker"] }),
  w("route-invoice-approvals", "Route invoice approvals", "Approve", "Send invoices through the right chain and keep the approval trail.", "invoice-approval", { tool: "approval-matrix-builder", template: "invoice-approval-matrix", glossary: ["approval-matrix", "segregation-of-duties"], guides: ["how-to-set-up-invoice-approvals"], stack: ["invoice-approval"] }),
  w("track-overdue-approvals", "Track overdue approvals", "Monitor", "Surface stuck approvals and the bottleneck behind each one.", "invoice-approval", { tool: "approval-matrix-builder", template: "invoice-approval-matrix", glossary: ["approval-matrix"], stack: ["invoice-approval"] }),
  w("build-audit-trails", "Build audit trails", "Audit", "Turn everyday document work into evidence that's ready before it's asked for.", "platform", { tool: "audit-trail-export-preview", template: "audit-evidence-pack", glossary: ["audit-trail", "version-history"], guides: ["what-makes-a-good-audit-trail"], stack: ["platform"] }),
  w("export-compliance-evidence", "Export compliance evidence", "Audit", "Hand finance, legal, or an auditor a clean evidence pack on demand.", "platform", { tool: "audit-trail-export-preview", template: "audit-evidence-pack", glossary: ["audit-trail"], stack: ["platform"] }),
  w("replace-spreadsheets-with-operational-workflows", "Replace spreadsheets with operational workflows", "Audit", "Move recurring document work off spreadsheets and shared folders for good.", "platform", { tool: "audit-trail-export-preview", template: "audit-evidence-pack", glossary: ["operational-workflow"], guides: ["why-spreadsheets-fail-for-compliance-tracking"], stack: ["platform"] }),
];

export function getWorkflow(slug: string) {
  return workflows.find((x) => x.slug === slug);
}

/* ----------------------------- Industries ----------------------------- */
export type Industry = {
  slug: string;
  name: string;
  headline: string;
  pains: string[];
  documents: string[];
  workflows: string[];
  products: string[];
  templates: string[];
  guides: string[];
};

export const industries: Industry[] = [
  { slug: "healthcare", name: "Healthcare", headline: "Keep vendors, staff, and credentials compliant — and provable.", pains: ["Exclusion screening (OIG) must be continuous, not annual", "Vendor insurance lapses create liability exposure", "Staff certifications expire on a rolling basis"], documents: ["W-9s", "Certificates of insurance", "OIG exclusion checks", "Staff certifications", "Policy acknowledgements"], workflows: ["screen-vendors-against-exclusion-lists", "track-coi-expirations", "monitor-certification-expirations"], products: ["exclusion-monitor", "coi-tracker", "training-record-tracker"], templates: ["exclusion-screening-log", "coi-tracking-log"], guides: ["how-to-track-coi-expirations"] },
  { slug: "construction", name: "Construction", headline: "Subcontractor insurance and documents, monitored before they lapse.", pains: ["Subcontractor COIs expire mid-project", "Additional-insured requirements go unchecked", "W-9s and lien waivers scattered across email"], documents: ["Subcontractor COIs", "W-9s", "Lien waivers", "Signed subcontracts"], workflows: ["track-coi-expirations", "build-vendor-onboarding-packets", "collect-w9s"], products: ["coi-tracker", "vendor-packet", "w9-collector"], templates: ["coi-tracking-log", "vendor-onboarding-checklist"], guides: ["what-to-check-on-a-certificate-of-insurance"] },
  { slug: "staffing", name: "Staffing", headline: "Onboard, screen, and keep credentials current at scale.", pains: ["High-volume onboarding documents", "Exclusion and certification checks per placement", "Re-acknowledgement when policies change"], documents: ["W-9s", "Certifications", "Policy acknowledgements", "Exclusion checks"], workflows: ["build-vendor-onboarding-packets", "screen-employees-against-exclusion-lists", "track-training-records"], products: ["vendor-packet", "exclusion-monitor", "training-record-tracker"], templates: ["vendor-onboarding-checklist", "training-record-log"], guides: [] },
  { slug: "logistics", name: "Logistics", headline: "Carrier and vendor compliance that doesn't lapse in transit.", pains: ["Carrier insurance must stay current", "Vendor onboarding is document-heavy", "Contracts auto-renew unnoticed"], documents: ["Carrier COIs", "W-9s", "Service contracts"], workflows: ["track-coi-expirations", "monitor-contract-renewals", "collect-w9s"], products: ["coi-tracker", "contract-renewal-tracker", "w9-collector"], templates: ["coi-tracking-log", "contract-renewal-log"], guides: [] },
  { slug: "manufacturing", name: "Manufacturing", headline: "Supplier documents and contracts, monitored end to end.", pains: ["Supplier insurance and tax documents", "Long-term contracts with notice periods", "Quality and safety certifications"], documents: ["Supplier COIs", "W-9s", "Supply contracts", "Certifications"], workflows: ["track-coi-expirations", "monitor-contract-renewals", "monitor-certification-expirations"], products: ["coi-tracker", "contract-renewal-tracker", "training-record-tracker"], templates: ["coi-tracking-log", "contract-renewal-log"], guides: [] },
  { slug: "facilities-services", name: "Facilities Services", headline: "Vendor insurance and approvals across every site.", pains: ["Subcontractor COIs across many sites", "Invoice approvals over email", "Vendor onboarding at scale"], documents: ["COIs", "W-9s", "Invoices", "Service agreements"], workflows: ["track-coi-expirations", "route-invoice-approvals", "build-vendor-onboarding-packets"], products: ["coi-tracker", "invoice-approval", "vendor-packet"], templates: ["coi-tracking-log", "invoice-approval-matrix"], guides: [] },
  { slug: "property-management", name: "Property Management", headline: "Tenant and vendor certificates, tracked before they expire.", pains: ["Tenant and vendor COIs lapse", "Lease and service contract renewals", "Approvals across properties"], documents: ["Tenant COIs", "Vendor COIs", "Leases", "Service contracts"], workflows: ["track-coi-expirations", "monitor-contract-renewals", "route-invoice-approvals"], products: ["coi-tracker", "contract-renewal-tracker", "invoice-approval"], templates: ["coi-tracking-log", "contract-renewal-log"], guides: ["how-to-track-coi-expirations"] },
  { slug: "professional-services", name: "Professional Services", headline: "Client and vendor documents, signed and on file.", pains: ["Engagement letters and signatures", "Vendor W-9s and insurance", "Policy acknowledgements"], documents: ["Engagement letters", "W-9s", "COIs", "Policies"], workflows: ["send-documents-for-signature", "collect-w9s", "send-policy-acknowledgements"], products: ["simple-signer", "w9-collector", "policy-acknowledgement-tracker"], templates: ["signature-request", "policy-acknowledgement"], guides: [] },
  { slug: "nonprofit", name: "Nonprofit", headline: "Grant, vendor, and volunteer documents without the overhead.", pains: ["Grant compliance documentation", "Vendor and contractor W-9s", "Volunteer policy acknowledgements"], documents: ["W-9s", "COIs", "Policy acknowledgements", "Grant documents"], workflows: ["collect-w9s", "send-policy-acknowledgements", "build-audit-trails"], products: ["w9-collector", "policy-acknowledgement-tracker", "platform"], templates: ["vendor-w9-request", "policy-acknowledgement"], guides: [] },
  { slug: "multi-site-retail", name: "Multi-site Retail", headline: "Vendor compliance and approvals across every location.", pains: ["Vendor COIs across locations", "Invoice approvals by store and region", "Contract renewals at scale"], documents: ["Vendor COIs", "Invoices", "Service contracts", "W-9s"], workflows: ["track-coi-expirations", "route-invoice-approvals", "monitor-contract-renewals"], products: ["coi-tracker", "invoice-approval", "contract-renewal-tracker"], templates: ["coi-tracking-log", "invoice-approval-matrix"], guides: [] },
];

export function getIndustry(slug: string) {
  return industries.find((x) => x.slug === slug);
}
