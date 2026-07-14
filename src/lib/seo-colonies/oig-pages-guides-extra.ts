import type { ColonyPage } from "./types";
import { OIG_HEAD_SOLUTION, OIG_HUB, OIG_PRODUCT } from "./oig";

const g = (slug: string) => `/guides/${slug}/`;
const term = (slug: string) => `/glossary/${slug}/`;

export const OIG_PAGES_GUIDES_EXTRA: ColonyPage[] = [
  {
    tier: "guide",
    path: g("oig-sam-and-ofac-what-healthcare-providers-must-screen"),
    slug: "oig-sam-and-ofac-what-healthcare-providers-must-screen",
    title: "OIG and OFAC: What Healthcare Providers Must Screen",
    primaryKeyword: "oig ofac screening healthcare",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, term("oig-exclusion")],
    linkSideways: [g("how-to-screen-vendors-against-the-oig-list"), g("what-ofac-screening-requires")],
  },
  {
    tier: "guide",
    path: g("how-to-screen-contractors-for-oig-exclusions"),
    slug: "how-to-screen-contractors-for-oig-exclusions",
    title: "How to Screen Contractors for OIG Exclusions",
    primaryKeyword: "screen contractors oig",
    difficulty: "medium",
    linkUp: [OIG_HEAD_SOLUTION, OIG_HUB, OIG_PRODUCT],
    linkSideways: [g("how-to-screen-vendors-against-the-oig-list"), g("how-to-screen-subcontractors-against-oig")],
  },
  {
    tier: "guide",
    path: g("how-to-resolve-an-oig-list-match"),
    slug: "how-to-resolve-an-oig-list-match",
    title: "How to Resolve an OIG List Match",
    primaryKeyword: "resolve oig list match",
    difficulty: "medium",
    linkUp: [OIG_HEAD_SOLUTION, OIG_HUB, OIG_PRODUCT],
    linkSideways: [g("what-to-do-when-oig-screening-finds-a-match"), term("exclusion-match-review")],
  },
];
