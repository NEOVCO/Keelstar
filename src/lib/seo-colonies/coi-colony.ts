import type { ColonyDefinition, ColonyPage } from "./types";
import {
  COI_HEAD_SOLUTION,
  COI_HEAD_TOOL,
  COI_HUB,
  COI_HUB_COLONY_GUIDES,
  COI_PAGES_BASE,
  COI_PRODUCT,
} from "./coi";
import { COI_PAGES_EXTRA } from "./coi-pages-extra";
import { COI_PAGES_HEAD } from "./coi-pages-head";
import { COI_PAGES_SOLUTIONS } from "./coi-pages-solutions";

export const COI_PAGES: ColonyPage[] = [
  ...COI_PAGES_BASE,
  ...COI_PAGES_EXTRA,
  ...COI_PAGES_SOLUTIONS,
  ...COI_PAGES_HEAD,
];

export const coiColony: ColonyDefinition = {
  id: "coi",
  name: "Certificate of Insurance",
  headHub: COI_HUB,
  headSolution: COI_HEAD_SOLUTION,
  headProduct: COI_PRODUCT,
  headTool: COI_HEAD_TOOL,
  pages: COI_PAGES,
};

export { COI_HUB_COLONY_GUIDES };
