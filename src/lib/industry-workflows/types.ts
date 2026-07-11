export type IndustryWorkflowPage = {
  industrySlug: string;
  workflowSlug: string;
  slug: string; // "{industrySlug}/{workflowSlug}"
  title: string;
  headline: string;
  summary: string;
  answer: string;
  pains: string[];
  documents: string[];
  steps: { title: string; body: string }[];
  product: string;
  relatedGuides: string[];
  relatedSolutions: string[];
  updated: string;
};
