import type { ColonyPage } from "./types";
import {
  CONTRACT_HEAD_SOLUTION,
  CONTRACT_HEAD_TOOL,
  CONTRACT_HUB,
  CONTRACT_PRODUCT,
  g,
  s,
  term,
} from "./contract";

export const CONTRACT_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: CONTRACT_HUB,
    slug: "contract-renewal-tracking",
    title: "Contract Renewal Tracking",
    primaryKeyword: "contract renewal tracking",
    difficulty: "hard",
    linkUp: [CONTRACT_PRODUCT, CONTRACT_HEAD_SOLUTION, CONTRACT_HEAD_TOOL],
    linkSideways: [s("contract-expiration-alerts"), s("contract-notice-period-tracking")],
  },
  {
    tier: "product",
    path: CONTRACT_PRODUCT,
    slug: "contract-renewal-tracker",
    title: "Contract Renewal Tracker",
    primaryKeyword: "contract renewal tracker",
    difficulty: "hard",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION],
    linkSideways: [CONTRACT_HEAD_TOOL, s("contract-renewal-tracking")],
  },
  {
    tier: "tool",
    path: CONTRACT_HEAD_TOOL,
    slug: "contract-renewal-extractor",
    title: "Contract Renewal Extractor",
    primaryKeyword: "contract renewal extractor",
    difficulty: "medium",
    linkUp: [CONTRACT_HUB, CONTRACT_PRODUCT, CONTRACT_HEAD_SOLUTION],
    linkSideways: [g("how-to-find-a-contract-notice-period"), term("notice-period")],
  },
];
