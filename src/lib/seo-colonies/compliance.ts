import type { ColonyLink, ColonyPage } from "./types";

export const COMPLIANCE_HUB = "/vendor-compliance/";
export const COMPLIANCE_PRODUCT = "/products/vendor-packet/";
export const COMPLIANCE_HEAD_SOLUTION = "/solutions/third-party-vendor-compliance/";
export const COMPLIANCE_HEAD_TOOL = "/tools/vendor-onboarding-packet-generator/";

export const s = (slug: string) => `/solutions/${slug}/`;
export const g = (slug: string) => `/guides/${slug}/`;
export const term = (slug: string) => `/glossary/${slug}/`;
export const industry = (industrySlug: string, workflowSlug: string) =>
  `/industries/${industrySlug}/${workflowSlug}/`;

export const COMPLIANCE_HUB_COLONY_GUIDES: ColonyLink[] = [
  { label: "Vendor compliance checklist", href: g("vendor-compliance-checklist") },
  { label: "How to collect W-9s from vendors", href: g("how-to-collect-w9s-from-vendors") },
  { label: "How to track COI expirations", href: g("how-to-track-coi-expirations") },
  { label: "How to screen vendors against the OIG list", href: g("how-to-screen-vendors-against-the-oig-list") },
  { label: "How to build a vendor onboarding checklist", href: g("how-to-build-a-vendor-onboarding-checklist") },
  { label: "How to export vendor onboarding evidence", href: g("how-to-export-vendor-onboarding-evidence") },
  { label: "How to audit vendor onboarding records", href: g("how-to-audit-vendor-onboarding-records") },
  { label: "How to block payments for non-compliant vendors", href: g("how-to-block-payments-for-non-compliant-vendors") },
  { label: "How to onboard high-risk vendors", href: g("how-to-onboard-high-risk-vendors") },
];

export const COMPLIANCE_PAGES_BASE: ColonyPage[] = [
  {
    tier: "glossary",
    path: term("vendor-onboarding"),
    slug: "vendor-onboarding",
    title: "Vendor Onboarding",
    primaryKeyword: "vendor onboarding",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-build-a-vendor-onboarding-checklist")],
    linkSideways: [term("due-diligence"), term("compliance-control")],
  },
  {
    tier: "glossary",
    path: term("due-diligence"),
    slug: "due-diligence",
    title: "Due Diligence",
    primaryKeyword: "vendor due diligence",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-onboard-high-risk-vendors")],
    linkSideways: [term("compliance-control"), s("vendor-due-diligence-software")],
  },
  {
    tier: "glossary",
    path: term("compliance-control"),
    slug: "compliance-control",
    title: "Compliance Control",
    primaryKeyword: "compliance control",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("vendor-compliance-checklist")],
    linkSideways: [term("audit-evidence"), term("due-diligence")],
  },
  {
    tier: "glossary",
    path: term("audit-evidence"),
    slug: "audit-evidence",
    title: "Audit Evidence",
    primaryKeyword: "audit evidence",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-export-vendor-onboarding-evidence")],
    linkSideways: [term("compliance-control"), g("how-to-audit-vendor-onboarding-records")],
  },
  {
    tier: "glossary",
    path: term("certificate-of-insurance"),
    slug: "certificate-of-insurance",
    title: "Certificate of Insurance",
    primaryKeyword: "certificate of insurance",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-track-coi-expirations")],
    linkSideways: [term("w-9"), s("coi-tracking-software")],
  },
  {
    tier: "glossary",
    path: term("w-9"),
    slug: "w-9",
    title: "W-9",
    primaryKeyword: "w-9 form",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-collect-w9s-from-vendors")],
    linkSideways: [term("certificate-of-insurance"), s("w9-collection-software")],
  },
  {
    tier: "glossary",
    path: term("oig-exclusion"),
    slug: "oig-exclusion",
    title: "OIG Exclusion",
    primaryKeyword: "oig exclusion",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, g("how-to-screen-vendors-against-the-oig-list")],
    linkSideways: [term("due-diligence"), s("oig-exclusion-check")],
  },
  {
    tier: "guide",
    path: g("vendor-compliance-checklist"),
    slug: "vendor-compliance-checklist",
    title: "Vendor Compliance Checklist",
    primaryKeyword: "vendor compliance checklist",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HUB, COMPLIANCE_PRODUCT],
    linkSideways: [g("how-to-build-a-vendor-onboarding-checklist"), g("how-to-audit-vendor-onboarding-records")],
  },
  {
    tier: "guide",
    path: g("how-to-collect-w9s-from-vendors"),
    slug: "how-to-collect-w9s-from-vendors",
    title: "How to Collect W-9s from Vendors",
    primaryKeyword: "collect w9s from vendors",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HUB, term("w-9")],
    linkSideways: [g("how-to-block-payments-for-non-compliant-vendors"), s("w9-collection-software")],
  },
  {
    tier: "guide",
    path: g("how-to-track-coi-expirations"),
    slug: "how-to-track-coi-expirations",
    title: "How to Track COI Expirations",
    primaryKeyword: "track coi expirations",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HUB, term("certificate-of-insurance")],
    linkSideways: [g("how-to-collect-w9-and-coi-together"), s("coi-tracking-software")],
  },
  {
    tier: "guide",
    path: g("how-to-screen-vendors-against-the-oig-list"),
    slug: "how-to-screen-vendors-against-the-oig-list",
    title: "How to Screen Vendors Against the OIG List",
    primaryKeyword: "screen vendors oig list",
    difficulty: "medium",
    linkUp: [COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HUB, term("oig-exclusion")],
    linkSideways: [g("how-to-onboard-high-risk-vendors"), s("oig-exclusion-check")],
  },
  {
    tier: "guide",
    path: g("how-to-build-a-vendor-onboarding-checklist"),
    slug: "how-to-build-a-vendor-onboarding-checklist",
    title: "How to Build a Vendor Onboarding Checklist",
    primaryKeyword: "vendor onboarding checklist",
    difficulty: "easy",
    linkUp: [COMPLIANCE_HEAD_SOLUTION, COMPLIANCE_HUB, COMPLIANCE_PRODUCT],
    linkSideways: [g("vendor-compliance-checklist"), s("vendor-onboarding-checklist")],
  },
  {
    tier: "guide",
    path: g("how-to-export-vendor-onboarding-evidence"),
    slug: "how-to-export-vendor-onboarding-evidence",
    title: "How to Export Vendor Onboarding Evidence",
    primaryKeyword: "export vendor onboarding evidence",
    difficulty: "medium",
    linkUp: [COMPLIANCE_HUB, COMPLIANCE_HEAD_SOLUTION, term("audit-evidence")],
    linkSideways: [g("how-to-audit-vendor-onboarding-records"), g("vendor-compliance-checklist")],
  },
];
