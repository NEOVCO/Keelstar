import type { SeoContentSection } from "../types";

export const exclusionMonitoringSections: SeoContentSection[] = [
  {
    title: "What is OIG exclusion screening?",
    eyebrow: "Healthcare context",
    paragraphs: [
      "The HHS Office of Inspector General (OIG) maintains the List of Excluded Individuals and Entities (LEIE). Parties on this list are excluded from participating in federal healthcare programs. Healthcare providers, Medicaid managed care organizations, and their vendors often must screen against the OIG exclusion list before engagement and on an ongoing basis.",
      "A one-time OIG exclusion search at onboarding does not satisfy most compliance programs. Exclusions are added continuously. Continuous OIG exclusion monitoring means re-screening on a schedule and retaining dated records of each check.",
    ],
  },
  {
    title: "SAM exclusion search for government contractors",
    eyebrow: "Federal contracting",
    paragraphs: [
      "SAM.gov (System for Award Management) includes entities excluded from receiving federal contracts and certain federal financial assistance. Government contractors and subcontractors typically screen vendors and personnel against SAM exclusion records as part of supplier compliance.",
      "Like OIG screening, SAM exclusion search should be recurring—not a checkbox filed once during vendor registration. Keelstar is building scheduled screening with disposition trails and exportable audit records.",
    ],
  },
  {
    title: "What Keelstar is building",
    eyebrow: "Coming soon",
    paragraphs: [
      "Exclusion monitoring is in development. We are not offering live OIG or SAM search on this page—doing so would imply functionality that does not exist yet. Join the waitlist to get notified when scheduled screening ships.",
      "Today, Keelstar supports W-9 collection, certificate of insurance tracking, and vendor compliance records—the document layer most teams need before adding exclusion screening to the same vendor record.",
    ],
  },
];

export const exclusionMonitoringWhoItsFor = {
  title: "Who needs exclusion monitoring",
  items: [
    "Healthcare providers screening vendors and contractors against OIG",
    "Government contractors requiring SAM exclusion checks for subcontractors",
    "Staffing firms placing workers at regulated client sites",
    "Compliance teams replacing annual spreadsheet screens with continuous monitoring",
  ],
};
