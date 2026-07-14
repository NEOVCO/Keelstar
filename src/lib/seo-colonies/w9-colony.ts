import type { ColonyDefinition, ColonyPage } from "./types";
import {
  W9_HEAD_SOLUTION,
  W9_HEAD_TOOL,
  W9_HUB,
  W9_HUB_COLONY_GUIDES,
  W9_PAGES_BASE,
  W9_PRODUCT,
} from "./w9";
import { W9_PAGES_EXTRA } from "./w9-pages-extra";
import { W9_PAGES_HEAD } from "./w9-pages-head";
import { W9_PAGES_SOLUTIONS } from "./w9-pages-solutions";

export const W9_PAGES: ColonyPage[] = [
  ...W9_PAGES_BASE,
  ...W9_PAGES_EXTRA,
  ...W9_PAGES_SOLUTIONS,
  ...W9_PAGES_HEAD,
];

export const w9Colony: ColonyDefinition = {
  id: "w9",
  name: "W-9 Collection",
  headHub: W9_HUB,
  headSolution: W9_HEAD_SOLUTION,
  headProduct: W9_PRODUCT,
  headTool: W9_HEAD_TOOL,
  pages: W9_PAGES,
};

export { W9_HUB_COLONY_GUIDES };
