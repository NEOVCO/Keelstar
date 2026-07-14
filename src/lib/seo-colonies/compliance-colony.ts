import type { ColonyDefinition, ColonyPage } from "./types";
import {
  COMPLIANCE_HEAD_SOLUTION,
  COMPLIANCE_HEAD_TOOL,
  COMPLIANCE_HUB,
  COMPLIANCE_HUB_COLONY_GUIDES,
  COMPLIANCE_PAGES_BASE,
  COMPLIANCE_PRODUCT,
} from "./compliance";
import { COMPLIANCE_PAGES_EXTRA } from "./compliance-pages-extra";
import { COMPLIANCE_PAGES_HEAD } from "./compliance-pages-head";
import { COMPLIANCE_PAGES_SOLUTIONS } from "./compliance-pages-solutions";

export const COMPLIANCE_PAGES: ColonyPage[] = [
  ...COMPLIANCE_PAGES_BASE,
  ...COMPLIANCE_PAGES_EXTRA,
  ...COMPLIANCE_PAGES_SOLUTIONS,
  ...COMPLIANCE_PAGES_HEAD,
];

export const complianceColony: ColonyDefinition = {
  id: "compliance",
  name: "Vendor Compliance",
  headHub: COMPLIANCE_HUB,
  headSolution: COMPLIANCE_HEAD_SOLUTION,
  headProduct: COMPLIANCE_PRODUCT,
  headTool: COMPLIANCE_HEAD_TOOL,
  pages: COMPLIANCE_PAGES,
};

export { COMPLIANCE_HUB_COLONY_GUIDES };
