import type { ExclusionSource } from "../constants";
import { oigProvider } from "./oig";
import { samProvider } from "./sam";
import type { ExclusionProvider } from "./types";

export function getProvider(source: ExclusionSource): ExclusionProvider {
  if (source === "oig") return oigProvider;
  return samProvider;
}

export function getAvailableProviders(sources: ExclusionSource[]): ExclusionProvider[] {
  return sources.map(getProvider);
}
