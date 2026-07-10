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
  // SAM exclusion section — disabled (not implementing)
  {
    title: "How Keelstar handles exclusion monitoring",
    eyebrow: "Available now",
    paragraphs: [
      "Keelstar Exclusion Monitor screens subjects against the official OIG LEIE database, flags potential matches for review, and stores a dated record of every check. Scheduled re-screens run automatically so a clean result from last quarter does not pass for compliance today.",
      "Screening lives alongside W-9 collection and certificate of insurance tracking in the same vendor record—so finance, procurement, and compliance teams work from one system of record instead of separate spreadsheets and inbox searches.",
    ],
  },
];

export const exclusionMonitoringWhoItsFor = {
  title: "Who needs exclusion monitoring",
  items: [
    "Healthcare providers screening vendors and contractors against OIG",
    // "Government contractors requiring SAM exclusion checks for subcontractors",
    "Staffing firms placing workers at regulated client sites",
    "Compliance teams replacing annual spreadsheet screens with continuous monitoring",
  ],
};
