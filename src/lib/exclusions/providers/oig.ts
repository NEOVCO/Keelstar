import { getExclusionDataMode } from "../constants";
import { findDemoOigMatches } from "./demo-data";
import { findLeieMatches } from "./oig-leie-match";
import { getLeieCacheMetadata, loadLeieCache } from "./oig-leie";
import type { ExclusionProvider, ScreeningSubjectInput } from "./types";

export const oigProvider: ExclusionProvider = {
  source: "oig",

  isAvailable() {
    return true;
  },

  dataModeLabel() {
    const mode = getExclusionDataMode();
    if (mode === "demo") return "OIG LEIE (demo dataset)";
    const meta = getLeieCacheMetadata();
    if (meta) return `OIG LEIE (live, ${meta.recordCount.toLocaleString()} records)`;
    return "OIG LEIE (live)";
  },

  async screen(subject: ScreeningSubjectInput) {
    const mode = getExclusionDataMode();

    if (mode === "demo") {
      const matches = findDemoOigMatches(subject);
      return {
        source: "oig" as const,
        status: matches.length > 0 ? ("potential_match" as const) : ("no_match" as const),
        matches,
        rawResponse: {
          mode: "demo",
          disclaimer:
            "Demo dataset only. Set EXCLUSION_DATA_MODE=live for official OIG LEIE data.",
          recordsSearched: 3,
        },
      };
    }

    try {
      const leie = await loadLeieCache();
      const matches = findLeieMatches(subject, leie.records);

      return {
        source: "oig" as const,
        status: matches.length > 0 ? ("potential_match" as const) : ("no_match" as const),
        matches,
        rawResponse: {
          mode: "live",
          sourceUrl: leie.sourceUrl,
          recordsSearched: leie.recordCount,
          cacheLoadedAt: leie.loadedAt,
          disclaimer:
            "Potential matches require human review. Verify identity at https://exclusions.oig.hhs.gov — SSN/EIN verification is not available in the downloadable file.",
          officialSources: {
            csvDownload: leie.sourceUrl,
            downloadPage: "https://oig.hhs.gov/exclusions/leie-database-supplement-downloads/",
            onlineSearch: "https://exclusions.oig.hhs.gov/",
            contact: "exclusions@oig.hhs.gov",
          },
        },
      };
    } catch (err) {
      return {
        source: "oig" as const,
        status: "failed" as const,
        matches: [],
        rawResponse: {
          mode: "live",
          error: String(err),
          sourceUrl: process.env.OIG_DATA_SOURCE_URL ?? "https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv",
        },
        errorMessage: "Failed to load OIG LEIE database",
      };
    }
  },
};
