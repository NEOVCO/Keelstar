import type { Faq } from "@/lib/products";
import { withSolutionsIndex } from "./hub-solution-links";
import type { SeoContentSection, SeoLandingPageData } from "./types";

export type SeoCluster = "w9" | "coi" | "oig" | "vendor" | "contract" | "invoice" | "policy";

export type SeoPageSpec = {
  slug: string;
  cluster: SeoCluster;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  hero: string;
  problem: string;
  problemBullets: string[];
  sections: SeoContentSection[];
  whoItsFor: string[];
  checklist?: string[];
  faqs: Faq[];
  relatedSlugs?: string[];
};


type ClusterDefaults = {
  howTitle: string;
  how: { title: string; body: string }[];
  benefitsTitle: string;
  benefits: string[];
  ctaTitle: string;
  ctaBody: string;
  problemTitle: string;
  whoItsForTitle: string;
  checklistTitle: string;
  primaryProduct: { label: string; href: string };
  hubLink: { label: string; href: string };
};

export const CLUSTER_DEFAULTS: Record<SeoCluster, ClusterDefaults> = {
  w9: {
    howTitle: "How W-9 collection works",
    how: [
      { title: "Request", body: "Send a secure link for vendors to complete IRS Form W-9. No vendor account required." },
      { title: "Validate", body: "Required fields are checked before acceptance so blank or unsigned forms do not enter your records." },
      { title: "Monitor", body: "Re-collect when records go stale. Reminders run until every active vendor has a current W-9 on file." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "No vendor account required",
      "Bulk W-9 requests for vendor lists",
      "Full audit trail for tax and finance reviews",
      "Stale W-9 alerts before year-end reporting",
    ],
    ctaTitle: "Collect your first W-9",
    ctaBody: "Start free. Go live the same day.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "W-9 Collector", href: "/products/w9-collector/" },
    hubLink: { label: "W-9 collection", href: "/w9-collection/" },
  },
  coi: {
    howTitle: "How COI tracking works",
    how: [
      { title: "Collect", body: "Request certificates from vendors through a secure link or upload files your team already has." },
      { title: "Extract", body: "Expiration dates, coverage types, and limits are captured from ACORD certificates for review." },
      { title: "Monitor", body: "Reminders fire before certificates lapse so uninsured vendors do not slip through approvals." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Expiration alerts before coverage lapses",
      "Requirement checks against your limits and endorsements",
      "Vendor self-service certificate upload",
      "Audit-ready history for risk and procurement reviews",
    ],
    ctaTitle: "Track your first certificate",
    ctaBody: "Start free. Monitor renewals from day one.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "COI Tracker", href: "/products/coi-tracker/" },
    hubLink: { label: "Certificate of insurance", href: "/certificate-of-insurance/" },
  },
  oig: {
    howTitle: "How exclusion screening works",
    how: [
      { title: "Enroll", body: "Add vendors, contractors, and individuals you pay to a screening roster with the identifiers you already collect." },
      { title: "Screen", body: "Run checks against the OIG LEIE and related exclusion sources on a schedule that matches your risk policy." },
      { title: "Document", body: "Every search, match review, and clearance decision is logged for audits and payer inquiries." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Scheduled re-screening so clearance does not expire quietly",
      "Match review workflow with notes and outcomes",
      "Evidence exports for compliance and payer audits",
      "Works alongside W-9 and vendor onboarding records",
    ],
    ctaTitle: "Screen your vendor roster",
    ctaBody: "Start free. Document every exclusion check.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "Exclusion Monitor", href: "/products/exclusion-monitor/" },
    hubLink: { label: "Exclusion monitoring", href: "/exclusion-monitoring/" },
  },
  vendor: {
    howTitle: "How vendor onboarding works",
    how: [
      { title: "Define", body: "Set the documents and attestations each vendor type must complete before they are approved to work or get paid." },
      { title: "Collect", body: "Send a single portal link so vendors upload W-9s, insurance, contracts, and questionnaires in one place." },
      { title: "Approve", body: "Review completeness, assign owners, and release vendors to AP and operations with a dated audit record." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "One portal instead of scattered email threads",
      "Checklists tied to vendor type and spend tier",
      "Status visibility for procurement, AP, and risk",
      "Evidence packet for internal and external audits",
    ],
    ctaTitle: "Launch a vendor packet",
    ctaBody: "Start free. Onboard vendors with a checklist.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "Vendor Packet", href: "/products/vendor-packet/" },
    hubLink: { label: "Vendor onboarding", href: "/vendor-onboarding/" },
  },
  contract: {
    howTitle: "How contract operations work",
    how: [
      { title: "Ingest", body: "Upload executed agreements or route drafts through review so key dates and obligations live in one workspace." },
      { title: "Review", body: "Flag renewal windows, notice periods, and risk clauses before auto-renewals or unfavorable terms take effect." },
      { title: "Alert", body: "Reminders reach owners ahead of expiration, renewal, and termination notice deadlines." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Renewal and notice-period tracking in one calendar",
      "Risk review notes attached to each agreement",
      "Owner assignments so contracts do not sit in a shared drive",
      "Exportable evidence for legal and finance audits",
    ],
    ctaTitle: "Track your first contract",
    ctaBody: "Start free. Never miss a renewal date.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "Contract Risk Scanner", href: "/products/contract-risk-scanner/" },
    hubLink: { label: "Vendor compliance", href: "/vendor-compliance/" },
  },
  invoice: {
    howTitle: "How invoice approval works",
    how: [
      { title: "Submit", body: "Vendors or internal teams upload invoices with PO and contract references attached to the request." },
      { title: "Route", body: "Approvals follow your rules by amount, department, or vendor so the right owner signs off before payment." },
      { title: "Record", body: "Every approval, rejection, and comment is stored for AP audits and dispute resolution." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Clear approval chains without email forwarding",
      "Visibility into overdue approvals blocking payment",
      "Evidence for SOX and internal control reviews",
      "Ties invoices to vendor compliance status",
    ],
    ctaTitle: "Route your first invoice",
    ctaBody: "Start free. Close the loop from vendor to payment.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "Invoice Approval", href: "/products/invoice-approval/" },
    hubLink: { label: "Vendor compliance", href: "/vendor-compliance/" },
  },
  policy: {
    howTitle: "How policy acknowledgment works",
    how: [
      { title: "Publish", body: "Distribute the current policy version with a clear effective date and required reading window." },
      { title: "Attest", body: "Employees acknowledge receipt and understanding through a tracked link—no paper sign-in sheets." },
      { title: "Prove", body: "Completion rates, timestamps, and version history are ready for HR and regulatory inquiries." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Version control when policies are updated mid-year",
      "Reminder nudges for employees who have not attested",
      "Department-level completion reporting",
      "Audit trail for HIPAA, safety, and code-of-conduct programs",
    ],
    ctaTitle: "Send your first acknowledgment",
    ctaBody: "Start free. Document every attestation.",
    problemTitle: "The common problem",
    whoItsForTitle: "Who it's for",
    checklistTitle: "What good looks like",
    primaryProduct: { label: "Policy Acknowledgment Tracker", href: "/products/policy-acknowledgment-tracker/" },
    hubLink: { label: "Vendor compliance", href: "/vendor-compliance/" },
  },
};

function buildRelatedLinks(
  spec: SeoPageSpec,
  allSpecs: SeoPageSpec[],
  defaults: ClusterDefaults,
): { label: string; href: string }[] {
  const seen = new Set<string>();
  const links: { label: string; href: string }[] = [];
  const push = (link: { label: string; href: string }) => {
    if (seen.has(link.href)) return;
    seen.add(link.href);
    links.push(link);
  };
  push(defaults.primaryProduct);
  push(defaults.hubLink);
  for (const relatedSlug of spec.relatedSlugs ?? []) {
    const related = allSpecs.find((s) => s.slug === relatedSlug);
    if (related) {
      push({ label: related.breadcrumb, href: `/solutions/${related.slug}/` });
    }
  }
  return links;
}

function buildSolutionLinks(
  spec: SeoPageSpec,
  allSpecs: SeoPageSpec[],
  defaults: ClusterDefaults,
): { label: string; href: string }[] {
  const seen = new Set<string>();
  const links: { label: string; href: string }[] = [];
  const push = (link: { label: string; href: string }) => {
    if (seen.has(link.href)) return;
    seen.add(link.href);
    links.push(link);
  };
  push(defaults.hubLink);
  for (const relatedSlug of spec.relatedSlugs ?? []) {
    const related = allSpecs.find((s) => s.slug === relatedSlug);
    if (related) {
      push({ label: related.breadcrumb, href: `/solutions/${related.slug}/` });
    }
  }
  return links;
}

export function createSeoPage(spec: SeoPageSpec, allSpecs: SeoPageSpec[]): SeoLandingPageData {
  const defaults = CLUSTER_DEFAULTS[spec.cluster];
  return {
    path: `/solutions/${spec.slug}/`,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    breadcrumb: spec.breadcrumb,
    eyebrow: spec.eyebrow,
    h1: spec.h1,
    hero: spec.hero,
    problemTitle: defaults.problemTitle,
    problem: spec.problem,
    problemBullets: spec.problemBullets,
    howTitle: defaults.howTitle,
    how: defaults.how,
    benefitsTitle: defaults.benefitsTitle,
    benefits: defaults.benefits,
    sections: spec.sections,
    whoItsFor: { title: defaults.whoItsForTitle, items: spec.whoItsFor },
    checklist: spec.checklist?.length
      ? { title: defaults.checklistTitle, items: spec.checklist }
      : undefined,
    faqs: spec.faqs,
    ctaTitle: defaults.ctaTitle,
    ctaBody: defaults.ctaBody,
    relatedLinks: withSolutionsIndex(buildRelatedLinks(spec, allSpecs, defaults)),
    solutionLinks: buildSolutionLinks(spec, allSpecs, defaults),
    lastUpdated: "2026-07-10",
  };
}

export function buildPagesFromSpecs(specs: SeoPageSpec[]): Record<string, SeoLandingPageData> {
  const pages: Record<string, SeoLandingPageData> = {};
  for (const spec of specs) {
    pages[spec.slug] = createSeoPage(spec, specs);
  }
  return pages;
}
