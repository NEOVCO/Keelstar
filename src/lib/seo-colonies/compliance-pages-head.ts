import type { ColonyPage } from "./types";
import { COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HEAD_TOOL, COMPLIANCE_HUB, COMPLIANCE_PRODUCT, g, s, term } from "./compliance";

export const COMPLIANCE_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: COMPLIANCE_HUB,
    slug: "vendor-compliance",
    title: "Vendor Compliance",
    primaryKeyword: "vendor compliance software",
    difficulty: "hard",
    linkUp: [COMPLIANCE_PRODUCT, COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HEAD_TOOL],
    linkSideways: [s("third-party-vendor-compliance"), s("vendor-compliance-dashboard")],
  },
  {
    tier: "product",
    path: COMPLIANCE_PRODUCT,
    slug: "vendor-packet",
    title: "Vendor Packet",
    primaryKeyword: "vendor packet software",
    difficulty: "hard",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION],
    linkSideways: [COMPLIANCE_HEAD_TOOL, s("vendor-packet-software")],
  },
  {
    tier: "tool",
    path: COMPLIANCE_HEAD_TOOL,
    slug: "vendor-onboarding-packet-generator",
    title: "Vendor Onboarding Packet Generator",
    primaryKeyword: "vendor onboarding packet generator",
    difficulty: "medium",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_PRODUCT, COMPLIANCE_HEAD_SOLUTION],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), term("vendor-onboarding")],
  },
];
