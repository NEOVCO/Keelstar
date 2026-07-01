import type { SeoLandingPageData } from "./types";
import {
  exclusionMonitoringSections,
  exclusionMonitoringWhoItsFor,
} from "./content/exclusion-monitoring";
import { exclusionMonitoringFaqs } from "./content/exclusion-monitoring-faqs";

export const exclusionMonitoring: SeoLandingPageData = {
  path: "/exclusion-monitoring/",
  metaTitle: "OIG & SAM Exclusion Monitoring",
  metaDescription:
    "OIG and SAM exclusion monitoring with scheduled screening and dated audit records. Join the waitlist—live search is not available yet.",
  breadcrumb: "Exclusion Monitoring",
  eyebrow: "Coming soon",
  h1: "OIG and SAM exclusion monitoring",
  hero:
    "Screen vendors and contractors against OIG and SAM exclusion lists on a schedule—and keep dated records of every check. Live search is not available yet; join the waitlist to get early access.",
  problemTitle: "Why continuous screening matters",
  problem:
    "A clean OIG exclusion search today does not prove compliance next month. Healthcare providers, government contractors, and staffing firms need recurring SAM exclusion search—not a one-time spreadsheet note.",
  problemBullets: [
    "One-time OIG exclusion search at onboarding does not satisfy recurring screening requirements",
    "SAM exclusion records change; annual checks miss months of exposure",
    "Spreadsheet logs lack disposition history when potential matches appear",
    "Vendor compliance programs treat screening separately from W-9 and insurance records",
  ],
  howTitle: "What we are building",
  how: [
    {
      title: "Scheduled screening",
      body: "Re-run OIG and SAM checks against your vendor and employee lists on a cadence you define.",
    },
    {
      title: "Disposition trail",
      body: "Record match review decisions so compliance teams can show how potential hits were resolved.",
    },
    {
      title: "Export",
      body: "Pull dated evidence for audits, contract renewals, and payer inquiries.",
    },
  ],
  benefitsTitle: "Planned capabilities",
  benefits: [
    "OIG exclusion list screening",
    "SAM exclusion search",
    "Scheduled re-checks with reminders",
    "Dated audit records for every screen",
  ],
  sections: exclusionMonitoringSections,
  whoItsFor: exclusionMonitoringWhoItsFor,
  faqs: exclusionMonitoringFaqs,
  ctaTitle: "Join the waitlist",
  ctaBody: "We will notify you when exclusion monitoring ships.",
  comingSoon: true,
  relatedLinks: [
    { label: "Vendor compliance", href: "/vendor-compliance/" },
    { label: "Exclusion Monitor (product)", href: "/products/exclusion-monitor/" },
  ],
};
