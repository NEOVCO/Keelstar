import type { ColonyPage } from "./types";
import { OIG_HEAD_SOLUTION, OIG_HEAD_TOOL, OIG_HUB, OIG_PRODUCT } from "./oig";

const s = (slug: string) => `/solutions/${slug}/`;
const g = (slug: string) => `/guides/${slug}/`;
const term = (slug: string) => `/glossary/${slug}/`;

export const OIG_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "industry",
    path: "/industries/healthcare/screen-vendors-against-exclusion-lists/",
    slug: "healthcare-screen-vendors-against-exclusion-lists",
    title: "Screen Vendors Against Exclusion Lists for Healthcare",
    primaryKeyword: "healthcare oig vendor screening",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [g("how-to-screen-vendors-against-the-oig-list"), s("healthcare-oig-screening")],
  },
  {
    tier: "hub",
    path: OIG_HUB,
    slug: "exclusion-monitoring",
    title: "OIG Exclusion Monitoring",
    primaryKeyword: "oig exclusion list",
    difficulty: "hard",
    linkUp: [OIG_PRODUCT, OIG_HEAD_SOLUTION, OIG_HEAD_TOOL],
    linkSideways: [s("oig-leie-search"), s("monthly-oig-screening")],
  },
  {
    tier: "product",
    path: OIG_PRODUCT,
    slug: "exclusion-monitor",
    title: "Exclusion Monitor",
    primaryKeyword: "oig exclusion monitoring software",
    difficulty: "hard",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION],
    linkSideways: [OIG_HEAD_TOOL, s("oig-continuous-monitoring")],
  },
  {
    tier: "tool",
    path: OIG_HEAD_TOOL,
    slug: "oig-search",
    title: "OIG Exclusion Search",
    primaryKeyword: "oig exclusion search",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_PRODUCT, OIG_HEAD_SOLUTION],
    linkSideways: [g("how-to-search-the-oig-leie-database"), term("leie")],
  },
];
