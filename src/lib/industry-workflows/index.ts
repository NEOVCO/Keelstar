import { buildAllIndustryWorkflowPages } from "./create-page";

export type { IndustryWorkflowPage } from "./types";
export { MATRIX_WORKFLOWS, buildIndustryWorkflowPage } from "./create-page";

export const industryWorkflowPages = buildAllIndustryWorkflowPages();

export function getIndustryWorkflowPage(industrySlug: string, workflowSlug: string) {
  return industryWorkflowPages.find(
    (p) => p.industrySlug === industrySlug && p.workflowSlug === workflowSlug
  );
}
