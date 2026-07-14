import type { ColonyPage } from "./types";
import { OIG_HEAD_SOLUTION, OIG_HUB, OIG_PRODUCT } from "./oig";

const s = (slug: string) => `/solutions/${slug}/`;
const g = (slug: string) => `/guides/${slug}/`;

export const OIG_PAGES_SOLUTIONS_B: ColonyPage[] = [
  {
    tier: "solution",
    path: s("oig-exclusion-audit-trail"),
    slug: "oig-exclusion-audit-trail",
    title: "OIG Exclusion Audit Trail",
    primaryKeyword: "oig exclusion audit trail",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_PRODUCT, OIG_HEAD_SOLUTION],
    linkSideways: [g("how-to-document-exclusion-screening"), s("oig-false-positive-review")],
  },
  {
    tier: "solution",
    path: s("medicaid-vendor-screening"),
    slug: "medicaid-vendor-screening",
    title: "Medicaid Vendor Screening",
    primaryKeyword: "medicaid vendor screening",
    difficulty: "hard",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [g("how-to-check-state-medicaid-exclusion-lists"), s("healthcare-oig-screening")],
  },
  {
    tier: "solution",
    path: s("oig-monthly-screening-software"),
    slug: "oig-monthly-screening-software",
    title: "OIG Monthly Screening Software",
    primaryKeyword: "oig monthly screening software",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("monthly-oig-screening"), s("oig-continuous-monitoring")],
  },
  {
    tier: "solution",
    path: s("oig-continuous-monitoring"),
    slug: "oig-continuous-monitoring",
    title: "OIG Continuous Monitoring",
    primaryKeyword: "oig continuous monitoring",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_PRODUCT, OIG_HEAD_SOLUTION],
    linkSideways: [s("leie-screening-software"), s("oig-vendor-roster-screening")],
  },
  {
    tier: "solution",
    path: s("oig-vendor-roster-screening"),
    slug: "oig-vendor-roster-screening",
    title: "OIG Vendor Roster Screening",
    primaryKeyword: "oig vendor roster screening",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("vendor-exclusion-screening"), g("how-to-screen-vendors-against-the-oig-list")],
  },
  {
    tier: "solution",
    path: s("oig-false-positive-review"),
    slug: "oig-false-positive-review",
    title: "OIG False Positive Review",
    primaryKeyword: "oig false positive review",
    difficulty: "medium",
    linkUp: [OIG_HUB, OIG_HEAD_SOLUTION, OIG_PRODUCT],
    linkSideways: [s("oig-exclusion-audit-trail"), g("how-to-resolve-an-oig-list-match")],
  },
];
