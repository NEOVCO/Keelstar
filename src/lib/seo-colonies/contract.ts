import type { ColonyLink, ColonyPage } from "./types";

export const CONTRACT_HUB = "/solutions/contract-renewal-tracking/";
export const CONTRACT_PRODUCT = "/products/contract-renewal-tracker/";
export const CONTRACT_HEAD_SOLUTION = "/solutions/contract-renewal-tracking/";
export const CONTRACT_HEAD_TOOL = "/tools/contract-renewal-extractor/";
export const CONTRACT_NOTICE_PERIOD_CALCULATOR = "/tools/notice-period-calculator/";

export const s = (slug: string) => `/solutions/${slug}/`;
export const g = (slug: string) => `/guides/${slug}/`;
export const term = (slug: string) => `/glossary/${slug}/`;
export const tool = (slug: string) => `/tools/${slug}/`;
export const industry = (industrySlug: string, workflowSlug: string) =>
  `/industries/${industrySlug}/${workflowSlug}/`;

export const CONTRACT_HUB_COLONY_GUIDES: ColonyLink[] = [
  { label: "How to track contract renewals", href: g("how-to-track-contract-renewals") },
  { label: "How to avoid accidental auto-renewals", href: g("how-to-avoid-accidental-auto-renewals") },
  { label: "How to build a contract renewal calendar", href: g("how-to-build-a-contract-renewal-calendar") },
  { label: "How to find a contract notice period", href: g("how-to-find-a-contract-notice-period") },
  { label: "How to track notice periods across a portfolio", href: g("how-to-track-notice-periods-across-a-portfolio") },
  { label: "How to maintain a contract renewal calendar", href: g("how-to-maintain-a-contract-renewal-calendar") },
  { label: "How to track SaaS contract renewals", href: g("how-to-track-saas-contract-renewals") },
  { label: "How to monitor notice periods for vendors", href: g("how-to-monitor-notice-periods-for-vendors") },
  { label: "How to avoid missing contract renewal deadlines", href: g("how-to-avoid-missing-contract-renewal-deadlines") },
];

export const CONTRACT_PAGES_BASE: ColonyPage[] = [
  {
    tier: "glossary",
    path: term("auto-renewal-clause"),
    slug: "auto-renewal-clause",
    title: "Auto-Renewal Clause",
    primaryKeyword: "auto-renewal clause",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-avoid-accidental-auto-renewals")],
    linkSideways: [term("notice-period"), term("evergreen-contract")],
  },
  {
    tier: "glossary",
    path: term("notice-period"),
    slug: "notice-period",
    title: "Notice Period",
    primaryKeyword: "contract notice period",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-find-a-contract-notice-period")],
    linkSideways: [term("auto-renewal-clause"), term("renewal-date")],
  },
  {
    tier: "glossary",
    path: term("evergreen-contract"),
    slug: "evergreen-contract",
    title: "Evergreen Contract",
    primaryKeyword: "evergreen contract",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-avoid-accidental-auto-renewals")],
    linkSideways: [term("auto-renewal-clause"), term("termination-for-convenience")],
  },
  {
    tier: "glossary",
    path: term("renewal-date"),
    slug: "renewal-date",
    title: "Renewal Date",
    primaryKeyword: "contract renewal date",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-track-contract-renewals")],
    linkSideways: [term("notice-period"), term("effective-date")],
  },
  {
    tier: "glossary",
    path: term("termination-clause"),
    slug: "termination-clause",
    title: "Termination Clause",
    primaryKeyword: "contract termination clause",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-give-notice-of-non-renewal")],
    linkSideways: [term("termination-for-convenience"), term("notice-period")],
  },
  {
    tier: "glossary",
    path: term("statement-of-work"),
    slug: "statement-of-work",
    title: "Statement of Work (SOW)",
    primaryKeyword: "statement of work",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, s("contract-msa-sow-linking")],
    linkSideways: [term("effective-date"), s("vendor-contract-management")],
  },
  {
    tier: "glossary",
    path: term("effective-date"),
    slug: "effective-date",
    title: "Effective Date",
    primaryKeyword: "contract effective date",
    difficulty: "easy",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, g("how-to-track-contract-renewals")],
    linkSideways: [term("renewal-date"), term("statement-of-work")],
  },
  {
    tier: "glossary",
    path: term("termination-for-convenience"),
    slug: "termination-for-convenience",
    title: "Termination for Convenience",
    primaryKeyword: "termination for convenience",
    difficulty: "medium",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, term("termination-clause")],
    linkSideways: [term("notice-period"), term("evergreen-contract")],
  },
  {
    tier: "guide",
    path: g("how-to-track-contract-renewals"),
    slug: "how-to-track-contract-renewals",
    title: "How to Track Contract Renewals",
    primaryKeyword: "how to track contract renewals",
    difficulty: "easy",
    linkUp: [CONTRACT_HEAD_SOLUTION, CONTRACT_HUB, CONTRACT_PRODUCT],
    linkSideways: [g("how-to-find-a-contract-notice-period"), g("how-to-avoid-accidental-auto-renewals")],
  },
  {
    tier: "guide",
    path: g("how-to-avoid-accidental-auto-renewals"),
    slug: "how-to-avoid-accidental-auto-renewals",
    title: "How to Avoid Accidental Auto-Renewals",
    primaryKeyword: "avoid accidental auto-renewals",
    difficulty: "easy",
    linkUp: [CONTRACT_HEAD_SOLUTION, CONTRACT_HUB, CONTRACT_PRODUCT],
    linkSideways: [g("how-to-track-contract-renewals"), s("contract-auto-renewal-prevention")],
  },
  {
    tier: "guide",
    path: g("how-to-build-a-contract-renewal-calendar"),
    slug: "how-to-build-a-contract-renewal-calendar",
    title: "How to Build a Contract Renewal Calendar",
    primaryKeyword: "contract renewal calendar",
    difficulty: "easy",
    linkUp: [CONTRACT_HEAD_SOLUTION, CONTRACT_HUB, CONTRACT_PRODUCT],
    linkSideways: [g("how-to-maintain-a-contract-renewal-calendar"), g("how-to-track-notice-periods-across-a-portfolio")],
  },
  {
    tier: "guide",
    path: g("how-to-find-a-contract-notice-period"),
    slug: "how-to-find-a-contract-notice-period",
    title: "How to Find a Contract Notice Period",
    primaryKeyword: "contract notice period",
    difficulty: "easy",
    linkUp: [CONTRACT_HEAD_SOLUTION, CONTRACT_HUB, term("notice-period")],
    linkSideways: [g("how-to-track-contract-renewals"), CONTRACT_NOTICE_PERIOD_CALCULATOR],
  },
  {
    tier: "guide",
    path: g("how-to-track-notice-periods-across-a-portfolio"),
    slug: "how-to-track-notice-periods-across-a-portfolio",
    title: "How to Track Notice Periods Across a Portfolio",
    primaryKeyword: "track notice periods portfolio",
    difficulty: "medium",
    linkUp: [CONTRACT_HUB, CONTRACT_HEAD_SOLUTION, CONTRACT_PRODUCT],
    linkSideways: [g("how-to-monitor-notice-periods-for-vendors"), s("contract-notice-period-tracking")],
  },
];
