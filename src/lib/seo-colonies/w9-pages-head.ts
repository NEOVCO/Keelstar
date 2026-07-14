import type { ColonyPage } from "./types";
import { W9_HEAD_SOLUTION, W9_HEAD_TOOL, W9_HUB, W9_PRODUCT } from "./w9";

const s = (slug: string) => `/solutions/${slug}/`;
const g = (slug: string) => `/guides/${slug}/`;
const term = (slug: string) => `/glossary/${slug}/`;

export const W9_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: W9_HUB,
    slug: "w9-collection",
    title: "W-9 Collection",
    primaryKeyword: "w9 request",
    difficulty: "hard",
    linkUp: [W9_PRODUCT, W9_HEAD_SOLUTION, W9_HEAD_TOOL],
    linkSideways: [s("collect-w9-online"), s("w9-reminder-automation")],
  },
  {
    tier: "product",
    path: W9_PRODUCT,
    slug: "w9-collector",
    title: "W-9 Collector",
    primaryKeyword: "w9 collector software",
    difficulty: "hard",
    linkUp: [W9_HUB, W9_HEAD_SOLUTION],
    linkSideways: [W9_HEAD_TOOL, s("w9-collection-software")],
  },
  {
    tier: "tool",
    path: W9_HEAD_TOOL,
    slug: "w9-request-generator",
    title: "W-9 Request Generator",
    primaryKeyword: "w9 request generator",
    difficulty: "medium",
    linkUp: [W9_HUB, W9_PRODUCT, W9_HEAD_SOLUTION],
    linkSideways: [g("how-to-send-a-w9-request-email"), term("w-9")],
  },
];
