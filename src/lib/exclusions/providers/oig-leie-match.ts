import type { ProviderMatch, ScreeningSubjectInput } from "./types";
import type { LeieRecord } from "./oig-leie";
import {
  formatLeieDate,
  isValidLeieNpi,
  namesMatch,
  normalizeName,
} from "../matchScoring";

function recordDisplayName(record: LeieRecord): string {
  if (record.busName.trim()) return record.busName.trim();
  return [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
}

function personNames(record: LeieRecord): string[] {
  const first = record.firstName.trim();
  const last = record.lastName.trim();
  if (!first && !last) return [];
  return [
    `${first} ${last}`.trim(),
    `${last} ${first}`.trim(),
    last,
  ].filter(Boolean);
}

function subjectNameCandidates(subject: ScreeningSubjectInput): string[] {
  const values = [
    subject.displayName,
    subject.organizationName,
    subject.firstName && subject.lastName ? `${subject.firstName} ${subject.lastName}` : null,
    subject.firstName && subject.lastName ? `${subject.lastName} ${subject.firstName}` : null,
  ].filter(Boolean) as string[];

  return [...new Set(values.map(normalizeName).filter(Boolean))];
}

export function findLeieMatches(
  subject: ScreeningSubjectInput,
  records: LeieRecord[]
): ProviderMatch[] {
  const matches: ProviderMatch[] = [];
  const seen = new Set<string>();
  const candidates = subjectNameCandidates(subject);
  const subjectNpi = subject.npi?.trim();

  for (const record of records) {
    const displayName = recordDisplayName(record);
    if (!displayName) continue;

    let matched = false;
    let matchReason = "";

    if (subjectNpi && isValidLeieNpi(record.npi) && subjectNpi === record.npi.trim()) {
      matched = true;
      matchReason = `NPI match: ${subjectNpi}`;
    }

    if (!matched && record.busName.trim()) {
      for (const candidate of candidates) {
        if (namesMatch(candidate, record.busName)) {
          matched = true;
          matchReason = `Organization name match: "${candidate}" ↔ "${normalizeName(record.busName)}"`;
          break;
        }
      }
    }

    if (!matched) {
      for (const personName of personNames(record)) {
        for (const candidate of candidates) {
          if (namesMatch(candidate, personName)) {
            matched = true;
            matchReason = `Name match: "${candidate}" ↔ "${normalizeName(personName)}"`;
            break;
          }
        }
        if (matched) break;
      }
    }

    if (!matched) continue;

    const key = `${displayName}|${record.npi}|${record.exclDate}`;
    if (seen.has(key)) continue;
    seen.add(key);

    matches.push({
      matchedName: displayName,
      matchedIdentifier: isValidLeieNpi(record.npi) ? record.npi : null,
      matchedProgram: record.exclType || record.general || "OIG LEIE",
      matchedDate: formatLeieDate(record.exclDate),
      matchScore: 1,
      matchReason,
      raw: {
        lastName: record.lastName,
        firstName: record.firstName,
        busName: record.busName,
        npi: record.npi,
        state: record.state,
        exclType: record.exclType,
        exclDate: record.exclDate,
        specialty: record.specialty,
      },
    });
  }

  return matches;
}
