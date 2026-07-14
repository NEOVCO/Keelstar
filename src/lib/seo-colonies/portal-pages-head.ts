import type { ColonyPage } from "./types";
import { PORTAL_HEAD_SOLUTION, PORTAL_HEAD_TOOL, PORTAL_HUB, PORTAL_PRODUCT, g, s, term } from "./portal";

export const PORTAL_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: PORTAL_HUB,
    slug: "vendor-portal",
    title: "Vendor Portal",
    primaryKeyword: "vendor portal",
    difficulty: "hard",
    linkUp: [PORTAL_PRODUCT, PORTAL_HEAD_SOLUTION, PORTAL_HEAD_TOOL],
    linkSideways: [s("vendor-setup-portal"), s("vendor-document-portal")],
  },
  {
    tier: "product",
    path: PORTAL_PRODUCT,
    slug: "vendor-packet",
    title: "Vendor Packet",
    primaryKeyword: "vendor packet software",
    difficulty: "hard",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION],
    linkSideways: [PORTAL_HEAD_TOOL, s("vendor-packet-software")],
  },
  {
    tier: "tool",
    path: PORTAL_HEAD_TOOL,
    slug: "vendor-onboarding-packet-generator",
    title: "Vendor Onboarding Packet Generator",
    primaryKeyword: "vendor onboarding packet generator",
    difficulty: "medium",
    linkUp: [PORTAL_HUB, PORTAL_PRODUCT, PORTAL_HEAD_SOLUTION],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), term("onboarding-packet")],
  },
];
