import type { ColonyDefinition, ColonyPage } from "./types";
import {
  CONTRACT_HEAD_SOLUTION,
  CONTRACT_HEAD_TOOL,
  CONTRACT_HUB,
  CONTRACT_HUB_COLONY_GUIDES,
  CONTRACT_PAGES_BASE,
  CONTRACT_PRODUCT,
} from "./contract";
import { CONTRACT_PAGES_EXTRA } from "./contract-pages-extra";
import { CONTRACT_PAGES_HEAD } from "./contract-pages-head";
import { CONTRACT_PAGES_SOLUTIONS } from "./contract-pages-solutions";

export const CONTRACT_PAGES: ColonyPage[] = [
  ...CONTRACT_PAGES_BASE,
  ...CONTRACT_PAGES_EXTRA,
  ...CONTRACT_PAGES_SOLUTIONS,
  ...CONTRACT_PAGES_HEAD,
];

export const contractColony: ColonyDefinition = {
  id: "contract",
  name: "Contract Renewals",
  headHub: CONTRACT_HUB,
  headSolution: CONTRACT_HEAD_SOLUTION,
  headProduct: CONTRACT_PRODUCT,
  headTool: CONTRACT_HEAD_TOOL,
  pages: CONTRACT_PAGES,
};

export { CONTRACT_HUB_COLONY_GUIDES };
