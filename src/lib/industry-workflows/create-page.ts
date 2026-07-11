import { industries, getWorkflow } from "@/lib/content";
import { getProduct } from "@/lib/products";
import type { IndustryWorkflowPage } from "./types";

export const INDUSTRY_WORKFLOW_UPDATED = "2026-07-12";

export const MATRIX_WORKFLOWS = [
  "collect-w9s",
  "track-coi-expirations",
  "screen-vendors-against-exclusion-lists",
  "build-vendor-onboarding-packets",
  "monitor-contract-renewals",
] as const;

export type MatrixWorkflow = (typeof MATRIX_WORKFLOWS)[number];

const WORKFLOW_PRODUCT: Record<MatrixWorkflow, string> = {
  "collect-w9s": "w9-collector",
  "track-coi-expirations": "coi-tracker",
  "screen-vendors-against-exclusion-lists": "exclusion-monitor",
  "build-vendor-onboarding-packets": "vendor-packet",
  "monitor-contract-renewals": "contract-renewal-tracker",
};

const WORKFLOW_SOLUTION: Record<MatrixWorkflow, string> = {
  "collect-w9s": "w9-request-from-vendor",
  "track-coi-expirations": "coi-tracking-software",
  "screen-vendors-against-exclusion-lists": "oig-exclusion-check",
  "build-vendor-onboarding-packets": "vendor-packet-software",
  "monitor-contract-renewals": "contract-renewal-tracking",
};

const WORKFLOW_GUIDES: Record<MatrixWorkflow, string[]> = {
  "collect-w9s": ["how-to-collect-w9s-from-vendors", "how-to-send-a-w9-request-email"],
  "track-coi-expirations": ["how-to-track-coi-expirations", "how-to-read-an-acord-25-certificate"],
  "screen-vendors-against-exclusion-lists": [
    "how-to-screen-vendors-against-the-oig-list",
    "how-to-search-the-oig-leie-database",
  ],
  "build-vendor-onboarding-packets": ["vendor-compliance-checklist", "how-to-collect-w9s-from-vendors"],
  "monitor-contract-renewals": ["how-to-track-contract-renewals", "how-to-avoid-accidental-auto-renewals"],
};

function defaultPains(industryName: string, workflowTitle: string): string[] {
  return [
    `${industryName} teams run ${workflowTitle.toLowerCase()} manually in spreadsheets`,
    "Reminders fail when owners change or leave",
    "Auditors cannot reconstruct who did what and when",
  ];
}

function defaultDocuments(workflow: MatrixWorkflow): string[] {
  switch (workflow) {
    case "collect-w9s":
      return ["IRS Form W-9", "Vendor master record", "1099 reporting log"];
    case "track-coi-expirations":
      return ["ACORD 25 certificates", "Insurance requirements matrix", "Expiration alerts"];
    case "screen-vendors-against-exclusion-lists":
      return ["OIG LEIE search results", "Match review notes", "Screening schedule"];
    case "build-vendor-onboarding-packets":
      return ["W-9", "COI", "Contracts", "Questionnaires"];
    case "monitor-contract-renewals":
      return ["Executed agreements", "Notice period calendar", "Renewal decisions"];
  }
}

export function buildIndustryWorkflowPage(
  industrySlug: string,
  workflowSlug: MatrixWorkflow
): IndustryWorkflowPage | null {
  const industry = industries.find((i) => i.slug === industrySlug);
  const workflow = getWorkflow(workflowSlug);
  const product = getProduct(WORKFLOW_PRODUCT[workflowSlug]);
  if (!industry || !workflow || !product) return null;

  const pains = defaultPains(industry.name, workflow.title);
  const headline = `${workflow.title} for ${industry.name}`;
  const summary = `How ${industry.name.toLowerCase()} organizations run ${workflow.title.toLowerCase()} with monitored reminders, validation, and audit-ready records.`;
  const answer = `${industry.name} teams use ${workflow.title.toLowerCase()} to keep vendor and contract records current before payments, renewals, or audits. Keelstar turns the process into a monitored workflow with dated evidence exportable for audits.`;

  return {
    industrySlug,
    workflowSlug,
    slug: `${industrySlug}/${workflowSlug}`,
    title: headline,
    headline,
    summary,
    answer,
    pains,
    documents: defaultDocuments(workflowSlug),
    steps: [
      { title: "Define requirements", body: `Set documents and schedules ${industry.name.toLowerCase()} vendors must meet.` },
      { title: "Collect and validate", body: "Capture required fields and expiration dates before vendors go live." },
      { title: "Monitor continuously", body: "Reminders fire before records go stale, lapse, or age out." },
      { title: "Export evidence", body: "Export request, submission, and review history for audits." },
    ],
    product: product.slug,
    relatedGuides: WORKFLOW_GUIDES[workflowSlug],
    relatedSolutions: [WORKFLOW_SOLUTION[workflowSlug]],
    updated: INDUSTRY_WORKFLOW_UPDATED,
  };
}

export function buildAllIndustryWorkflowPages(): IndustryWorkflowPage[] {
  const pages: IndustryWorkflowPage[] = [];
  for (const industry of industries) {
    for (const workflow of MATRIX_WORKFLOWS) {
      const page = buildIndustryWorkflowPage(industry.slug, workflow);
      if (page) pages.push(page);
    }
  }
  return pages;
}
