import type { ProviderMatch } from "./types";
import { namesMatch, normalizeName } from "../matchScoring";

/** Demo LEIE records — clearly not live government data */
export const DEMO_OIG_RECORDS: Array<{
  name: string;
  npi?: string;
  exclusionDate: string;
  program: string;
}> = [
  {
    name: "SUNRISE HOME HEALTH LLC",
    npi: "1234567890",
    exclusionDate: "2024-03-15",
    program: "Medicare/Medicaid",
  },
  {
    name: "JANE DOE",
    exclusionDate: "2023-11-01",
    program: "Medicare/Medicaid",
  },
  {
    name: "ACME MEDICAL BILLING INC",
    exclusionDate: "2022-06-20",
    program: "Medicare/Medicaid",
  },
];

export function findDemoOigMatches(subject: {
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  organizationName?: string | null;
  npi?: string | null;
}): ProviderMatch[] {
  const candidates = [
    subject.displayName,
    subject.organizationName,
    subject.firstName && subject.lastName
      ? `${subject.firstName} ${subject.lastName}`
      : null,
  ].filter(Boolean) as string[];

  const matches: ProviderMatch[] = [];

  for (const record of DEMO_OIG_RECORDS) {
    for (const candidate of candidates) {
      if (namesMatch(candidate, record.name)) {
        matches.push({
          matchedName: record.name,
          matchedIdentifier: record.npi ?? null,
          matchedProgram: record.program,
          matchedDate: record.exclusionDate,
          matchScore: 1,
          matchReason: `Normalized name match: "${candidate}" ↔ "${record.name}"`,
          raw: record,
        });
        break;
      }
    }
    if (subject.npi && record.npi && subject.npi === record.npi) {
      if (!matches.some((m) => m.matchedName === record.name)) {
        matches.push({
          matchedName: record.name,
          matchedIdentifier: record.npi,
          matchedProgram: record.program,
          matchedDate: record.exclusionDate,
          matchScore: 1,
          matchReason: `NPI match: ${subject.npi}`,
          raw: record,
        });
      }
    }
  }

  return matches;
}
