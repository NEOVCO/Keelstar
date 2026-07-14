import type { ColonyDefinition, ColonyPage } from "./types";
import {
  OIG_HEAD_SOLUTION,
  OIG_HEAD_TOOL,
  OIG_HUB,
  OIG_HUB_COLONY_GUIDES,
  OIG_PAGES_BASE,
  OIG_PRODUCT,
} from "./oig";
import { OIG_PAGES_GUIDES_EXTRA } from "./oig-pages-guides-extra";
import { OIG_PAGES_HEAD } from "./oig-pages-head";
import { OIG_PAGES_SOLUTIONS_A } from "./oig-pages-solutions-a";
import { OIG_PAGES_SOLUTIONS_B } from "./oig-pages-solutions-b";

export const OIG_PAGES: ColonyPage[] = [
  ...OIG_PAGES_BASE,
  ...OIG_PAGES_GUIDES_EXTRA,
  ...OIG_PAGES_HEAD,
  ...OIG_PAGES_SOLUTIONS_A,
  ...OIG_PAGES_SOLUTIONS_B,
];

export const oigColony: ColonyDefinition = {
  id: "oig",
  name: "OIG Exclusion Monitoring",
  headHub: OIG_HUB,
  headSolution: OIG_HEAD_SOLUTION,
  headProduct: OIG_PRODUCT,
  headTool: OIG_HEAD_TOOL,
  pages: OIG_PAGES,
};

export { OIG_HUB_COLONY_GUIDES };
