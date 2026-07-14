import type { ColonyPage } from "./types";
import { OIG_HEAD_SOLUTION, OIG_HUB, OIG_PRODUCT } from "./oig";

const s = (slug: string) => `/solutions/${slug}/`;
const g = (slug: string) => `/guides/${slug}/`;

export const OIG_PAGES_SOLUTIONS_A: ColonyPage[] = [
  {
    tier: "solution",
    path: OIG_HEAD_SOLUTION,
    slug: "oig-exclusion-check",
    title: "OIG Exclusion Check",
    primaryKeyword: "oig exclusion check",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_PRODUCT],
    linkSideways: [s("oig-leie-search"), s("vendor-exclusion-screening")],
  },
  {
    tier: "solution",
    path: s("oig-leie-search"),
    slug: "oig-leie-search",
    title: "OIG LEIE Search",
    primaryKeyword: "oig leie search",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("leie-screening-software"), g("how-to-search-the-oig-leie-database")],
  },
  {
    tier: "solution",
    path: s("leie-screening-software"),
    slug: "leie-screening-software",
    title: "LEIE Screening Software",
    primaryKeyword: "leie screening software",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("oig-leie-search"), s("oig-continuous-monitoring")],
  },
  {
    tier: "solution",
    path: s("healthcare-oig-screening"),
    slug: "healthcare-oig-screening",
    title: "Healthcare OIG Screening",
    primaryKeyword: "healthcare oig screening",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("vendor-exclusion-screening"), "/industries/healthcare/screen-vendors-against-exclusion-lists/"],
  },
  {
    tier: "solution",
    path: s("vendor-exclusion-screening"),
    slug: "vendor-exclusion-screening",
    title: "Vendor Exclusion Screening",
    primaryKeyword: "vendor exclusion screening",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("oig-vendor-roster-screening"), g("how-to-screen-vendors-against-the-oig-list")],
  },
  {
    tier: "solution",
    path: s("monthly-oig-screening"),
    slug: "monthly-oig-screening",
    title: "Monthly OIG Screening",
    primaryKeyword: "monthly oig screening software",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("oig-monthly-screening-software"), g("how-to-schedule-monthly-oig-screening")],
  },
];
