import type { ColonyLink, ColonyPage } from "./types";

export const PORTAL_HUB = "/vendor-portal/";
export const PORTAL_PRODUCT = "/products/vendor-packet/";
export const PORTAL_HEAD_SOLUTION = "/solutions/vendor-setup-portal/";
export const PORTAL_HEAD_TOOL = "/tools/vendor-onboarding-packet-generator/";

export const s = (slug: string) => `/solutions/${slug}/`;
export const g = (slug: string) => `/guides/${slug}/`;
export const term = (slug: string) => `/glossary/${slug}/`;
export const industry = (industrySlug: string, workflowSlug: string) =>
  `/industries/${industrySlug}/${workflowSlug}/`;

export const PORTAL_HUB_COLONY_GUIDES: ColonyLink[] = [
  { label: "How to send a vendor portal link", href: g("how-to-send-a-vendor-portal-link") },
  { label: "What is a vendor packet?", href: g("what-is-a-vendor-packet") },
  { label: "How to collect vendor documents in one place", href: g("how-to-collect-vendor-documents-in-one-place") },
  { label: "How to build a vendor onboarding checklist", href: g("how-to-build-a-vendor-onboarding-checklist") },
  { label: "Vendor compliance checklist", href: g("vendor-compliance-checklist") },
  { label: "How to track vendor onboarding status", href: g("how-to-track-vendor-onboarding-status") },
  { label: "How to handle incomplete vendor packets", href: g("how-to-handle-incomplete-vendor-packets") },
  { label: "How to collect W-9 and COI together", href: g("how-to-collect-w9-and-coi-together") },
  { label: "How to standardize vendor setup across locations", href: g("how-to-standardize-vendor-setup-across-locations") },
];

export const PORTAL_PAGES_BASE: ColonyPage[] = [
  {
    tier: "glossary",
    path: term("vendor-onboarding"),
    slug: "vendor-onboarding",
    title: "Vendor Onboarding",
    primaryKeyword: "vendor onboarding",
    difficulty: "easy",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION, g("how-to-build-a-vendor-onboarding-checklist")],
    linkSideways: [term("onboarding-packet"), term("vendor-packet")],
  },
  {
    tier: "glossary",
    path: term("onboarding-packet"),
    slug: "onboarding-packet",
    title: "Onboarding Packet",
    primaryKeyword: "onboarding packet",
    difficulty: "easy",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION, g("what-is-a-vendor-packet")],
    linkSideways: [term("vendor-packet"), term("vendor-onboarding")],
  },
  {
    tier: "glossary",
    path: term("vendor-packet"),
    slug: "vendor-packet",
    title: "Vendor Packet",
    primaryKeyword: "vendor packet",
    difficulty: "easy",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION, g("what-is-a-vendor-packet")],
    linkSideways: [term("onboarding-packet"), term("vendor-master-record")],
  },
  {
    tier: "glossary",
    path: term("vendor-master-record"),
    slug: "vendor-master-record",
    title: "Vendor Master Record",
    primaryKeyword: "vendor master record",
    difficulty: "easy",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION, PORTAL_PRODUCT],
    linkSideways: [term("vendor-packet"), s("vendor-information-management")],
  },
  {
    tier: "guide",
    path: g("how-to-send-a-vendor-portal-link"),
    slug: "how-to-send-a-vendor-portal-link",
    title: "How to Send a Vendor Portal Link",
    primaryKeyword: "vendor portal link",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("how-to-collect-vendor-documents-in-one-place"), s("vendor-document-portal")],
  },
  {
    tier: "guide",
    path: g("what-is-a-vendor-packet"),
    slug: "what-is-a-vendor-packet",
    title: "What Is a Vendor Packet?",
    primaryKeyword: "vendor packet",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, term("vendor-packet")],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), g("how-to-handle-incomplete-vendor-packets")],
  },
  {
    tier: "guide",
    path: g("how-to-collect-vendor-documents-in-one-place"),
    slug: "how-to-collect-vendor-documents-in-one-place",
    title: "How to Collect Vendor Documents in One Place",
    primaryKeyword: "collect vendor documents",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("how-to-send-a-vendor-portal-link"), s("vendor-document-collection")],
  },
  {
    tier: "guide",
    path: g("how-to-build-a-vendor-onboarding-checklist"),
    slug: "how-to-build-a-vendor-onboarding-checklist",
    title: "How to Build a Vendor Onboarding Checklist",
    primaryKeyword: "vendor onboarding checklist",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("vendor-compliance-checklist"), s("vendor-onboarding-checklist")],
  },
  {
    tier: "guide",
    path: g("vendor-compliance-checklist"),
    slug: "vendor-compliance-checklist",
    title: "Vendor Compliance Checklist",
    primaryKeyword: "vendor compliance checklist",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), g("what-is-a-vendor-packet")],
  },
  {
    tier: "guide",
    path: g("how-to-track-vendor-onboarding-status"),
    slug: "how-to-track-vendor-onboarding-status",
    title: "How to Track Vendor Onboarding Status",
    primaryKeyword: "vendor onboarding status",
    difficulty: "easy",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("how-to-handle-incomplete-vendor-packets"), s("supplier-onboarding-workflow")],
  },
  {
    tier: "guide",
    path: g("how-to-handle-incomplete-vendor-packets"),
    slug: "how-to-handle-incomplete-vendor-packets",
    title: "How to Handle Incomplete Vendor Packets",
    primaryKeyword: "incomplete vendor packet",
    difficulty: "medium",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, g("what-is-a-vendor-packet")],
    linkSideways: [g("how-to-track-vendor-onboarding-status"), g("how-to-send-a-vendor-portal-link")],
  },
  {
    tier: "guide",
    path: g("how-to-collect-w9-and-coi-together"),
    slug: "how-to-collect-w9-and-coi-together",
    title: "How to Collect W-9 and COI Together",
    primaryKeyword: "collect w9 and coi together",
    difficulty: "medium",
    linkUp: [PORTAL_HEAD_SOLUTION, PORTAL_HUB, PORTAL_PRODUCT],
    linkSideways: [g("what-is-a-vendor-packet"), g("how-to-collect-vendor-documents-in-one-place")],
  },
  {
    tier: "guide",
    path: g("how-to-standardize-vendor-setup-across-locations"),
    slug: "how-to-standardize-vendor-setup-across-locations",
    title: "How to Standardize Vendor Setup Across Locations",
    primaryKeyword: "standardize vendor setup locations",
    difficulty: "medium",
    linkUp: [PORTAL_HUB, PORTAL_HEAD_SOLUTION, PORTAL_PRODUCT],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), s("vendor-information-management")],
  },
];
