import type { SeoLandingPageData } from "./types";
import {
  exclusionMonitoringSections,
  exclusionMonitoringWhoItsFor,
} from "./content/exclusion-monitoring";
import { exclusionMonitoringFaqs } from "./content/exclusion-monitoring-faqs";
import { getHubSolutionLinks } from "./hub-solution-links";

export const exclusionMonitoring: SeoLandingPageData = {
  path: "/exclusion-monitoring/",
  metaTitle: "OIG Exclusion Monitoring",
  metaDescription:
    "Screen vendors and contractors against the OIG LEIE exclusion list on a schedule. Keep dated audit records, review potential matches, and export evidence for compliance reviews.",
  breadcrumb: "Exclusion Monitoring",
  eyebrow: "Vendor compliance",
  h1: "OIG exclusion monitoring",
  hero:
    "Screen vendors and contractors against the OIG LEIE exclusion list, re-run checks on a schedule, and keep dated records of every screen—with disposition history when potential matches appear.",
  problemTitle: "Why continuous screening matters",
  problem:
    "A clean OIG exclusion search today does not prove compliance next month. Healthcare providers, government contractors, and staffing firms need recurring screening—not a one-time spreadsheet note.",
  problemBullets: [
    "One-time OIG exclusion search at onboarding does not satisfy recurring screening requirements",
    "Exclusion records change; annual checks miss months of exposure",
    "Spreadsheet logs lack disposition history when potential matches appear",
    "Vendor compliance programs treat screening separately from W-9 and insurance records",
  ],
  howTitle: "How Keelstar exclusion monitoring works",
  how: [
    {
      title: "Screen against OIG LEIE",
      body: "Run ad-hoc or scheduled screens against the official HHS OIG exclusion database. Every check is stamped with date and list source.",
    },
    {
      title: "Review and disposition",
      body: "Potential matches are flagged for review. Record cleared, confirmed, or false-positive decisions as part of the audit trail.",
    },
    {
      title: "Monitor and export",
      body: "Re-screen on a schedule and pull dated evidence for audits, contract renewals, and payer inquiries.",
    },
  ],
  benefitsTitle: "What you get",
  benefits: [
    "OIG LEIE screening from the official exclusion database",
    "Scheduled re-checks with reminders",
    "Match review workflow with disposition history",
    "Dated audit records and evidence export for every screen",
    "Screening attached to the same vendor record as W-9s and insurance",
  ],
  sections: exclusionMonitoringSections,
  whoItsFor: exclusionMonitoringWhoItsFor,
  faqs: exclusionMonitoringFaqs,
  ctaTitle: "Start screening with audit records",
  ctaBody: "Create a free workspace and run your first OIG exclusion screen in minutes.",
  relatedLinks: [
    { label: "Exclusion Monitor (product)", href: "/products/exclusion-monitor/" },
    { label: "OIG exclusion search (free tool)", href: "/tools/oig-exclusion-search/" },
    { label: "Vendor compliance", href: "/vendor-compliance/" },
    { label: "Screen vendors workflow", href: "/workflows/screen-vendors-against-exclusion-lists/" },
    { label: "All solutions", href: "/solutions/" },
  ],
  solutionLinks: getHubSolutionLinks("exclusion-monitoring"),
  lastUpdated: "2026-07-10",
};
