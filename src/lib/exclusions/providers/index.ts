import type { ExclusionSource } from "../constants";
import { oigProvider } from "./oig";
import type { ExclusionProvider } from "./types";

export function getProvider(source: ExclusionSource): ExclusionProvider {
  if (source === "oig") return oigProvider;
  throw new Error(`Exclusion source "${source}" is not available`);
}

export function getAvailableProviders(sources: ExclusionSource[]): ExclusionProvider[] {
  return sources.filter((s) => s === "oig").map(getProvider);
}
