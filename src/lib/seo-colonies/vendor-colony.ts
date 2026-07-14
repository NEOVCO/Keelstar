import type { ColonyDefinition, ColonyPage } from "./types";
import {
  VENDOR_HEAD_SOLUTION,
  VENDOR_HEAD_TOOL,
  VENDOR_HUB,
  VENDOR_HUB_COLONY_GUIDES,
  VENDOR_PAGES_BASE,
  VENDOR_PRODUCT,
} from "./vendor";
import { VENDOR_PAGES_EXTRA } from "./vendor-pages-extra";
import { VENDOR_PAGES_HEAD } from "./vendor-pages-head";
import { VENDOR_PAGES_SOLUTIONS } from "./vendor-pages-solutions";

export const VENDOR_PAGES: ColonyPage[] = [
  ...VENDOR_PAGES_BASE,
  ...VENDOR_PAGES_EXTRA,
  ...VENDOR_PAGES_SOLUTIONS,
  ...VENDOR_PAGES_HEAD,
];

export const vendorColony: ColonyDefinition = {
  id: "vendor",
  name: "Vendor Onboarding",
  headHub: VENDOR_HUB,
  headSolution: VENDOR_HEAD_SOLUTION,
  headProduct: VENDOR_PRODUCT,
  headTool: VENDOR_HEAD_TOOL,
  pages: VENDOR_PAGES,
};

export { VENDOR_HUB_COLONY_GUIDES };
