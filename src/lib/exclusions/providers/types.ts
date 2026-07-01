import type { ExclusionSource } from "../constants";

export type ScreeningSubjectInput = {
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  organizationName?: string | null;
  dateOfBirth?: string | null;
  npi?: string | null;
  subjectType: string;
};

export type ProviderMatch = {
  matchedName: string;
  matchedIdentifier?: string | null;
  matchedProgram?: string | null;
  matchedDate?: string | null;
  matchScore: number;
  matchReason: string;
  raw: Record<string, unknown>;
};

export type ProviderScreenResult = {
  source: ExclusionSource;
  status: "no_match" | "potential_match" | "failed" | "not_configured";
  matches: ProviderMatch[];
  rawResponse: Record<string, unknown>;
  errorMessage?: string;
};

export interface ExclusionProvider {
  source: ExclusionSource;
  screen(subject: ScreeningSubjectInput): Promise<ProviderScreenResult>;
  isAvailable(): boolean;
  dataModeLabel(): string;
}
