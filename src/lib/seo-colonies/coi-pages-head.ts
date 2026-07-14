import type { ColonyPage } from "./types";
import { COI_HEAD_SOLUTION, COI_HEAD_TOOL, COI_HUB, COI_PRODUCT, g, s, term } from "./coi";

export const COI_PAGES_HEAD: ColonyPage[] = [
  {
    tier: "hub",
    path: COI_HUB,
    slug: "certificate-of-insurance",
    title: "Certificate of Insurance",
    primaryKeyword: "certificate of insurance",
    difficulty: "hard",
    linkUp: [COI_PRODUCT, COI_HEAD_SOLUTION, COI_HEAD_TOOL],
    linkSideways: [s("coi-expiration-alerts"), s("certificate-of-insurance-tracker")],
  },
  {
    tier: "product",
    path: COI_PRODUCT,
    slug: "coi-tracker",
    title: "COI Tracker",
    primaryKeyword: "coi tracker software",
    difficulty: "hard",
    linkUp: [COI_HUB, COI_HEAD_SOLUTION],
    linkSideways: [COI_HEAD_TOOL, s("coi-tracking-software")],
  },
  {
    tier: "tool",
    path: COI_HEAD_TOOL,
    slug: "acord-analyzer",
    title: "ACORD Analyzer",
    primaryKeyword: "acord analyzer",
    difficulty: "medium",
    linkUp: [COI_HUB, COI_PRODUCT, COI_HEAD_SOLUTION],
    linkSideways: [g("how-to-read-an-acord-25-certificate"), term("acord-25")],
  },
];
