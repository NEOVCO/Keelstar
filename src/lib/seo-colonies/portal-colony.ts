import type { ColonyDefinition, ColonyPage } from "./types";
import {
  PORTAL_HEAD_SOLUTION,
  PORTAL_HEAD_TOOL,
  PORTAL_HUB,
  PORTAL_HUB_COLONY_GUIDES,
  PORTAL_PAGES_BASE,
  PORTAL_PRODUCT,
} from "./portal";
import { PORTAL_PAGES_EXTRA } from "./portal-pages-extra";
import { PORTAL_PAGES_HEAD } from "./portal-pages-head";
import { PORTAL_PAGES_SOLUTIONS } from "./portal-pages-solutions";

export const PORTAL_PAGES: ColonyPage[] = [
  ...PORTAL_PAGES_BASE,
  ...PORTAL_PAGES_EXTRA,
  ...PORTAL_PAGES_SOLUTIONS,
  ...PORTAL_PAGES_HEAD,
];

export const portalColony: ColonyDefinition = {
  id: "portal",
  name: "Vendor Portal",
  headHub: PORTAL_HUB,
  headSolution: PORTAL_HEAD_SOLUTION,
  headProduct: PORTAL_PRODUCT,
  headTool: PORTAL_HEAD_TOOL,
  pages: PORTAL_PAGES,
};

export { PORTAL_HUB_COLONY_GUIDES };
