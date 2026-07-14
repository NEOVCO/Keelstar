import type { ColonyPage } from "./types";
import { VENDOR_HEAD_SOLUTION, VENDOR_HEAD_TOOL, VENDOR_HUB, VENDOR_PRODUCT, g, s, term } from "./vendor";

export const VENDOR_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: VENDOR_HUB,
    slug: "vendor-onboarding",
    title: "Vendor Onboarding",
    primaryKeyword: "vendor onboarding",
    difficulty: "hard",
    linkUp: [VENDOR_PRODUCT, VENDOR_HEAD_SOLUTION, VENDOR_HEAD_TOOL],
    linkSideways: [s("vendor-onboarding-checklist"), s("vendor-packet-software")],
  },
  {
    tier: "product",
    path: VENDOR_PRODUCT,
    slug: "vendor-packet",
    title: "Vendor Packet",
    primaryKeyword: "vendor packet software",
    difficulty: "hard",
    linkUp: [VENDOR_HUB, VENDOR_HEAD_SOLUTION],
    linkSideways: [VENDOR_HEAD_TOOL, s("vendor-packet-software")],
  },
  {
    tier: "tool",
    path: VENDOR_HEAD_TOOL,
    slug: "vendor-information-form-template",
    title: "Vendor Information Form Template",
    primaryKeyword: "vendor information form template",
    difficulty: "medium",
    linkUp: [VENDOR_HUB, VENDOR_PRODUCT, VENDOR_HEAD_SOLUTION],
    linkSideways: [g("how-to-send-a-vendor-portal-link"), term("vendor-onboarding")],
  },
];
