import { isSamConfigured } from "../constants";
import type { ExclusionProvider } from "./types";

export const samProvider: ExclusionProvider = {
  source: "sam",

  isAvailable() {
    return isSamConfigured();
  },

  dataModeLabel() {
    return isSamConfigured() ? "SAM.gov (API)" : "SAM.gov (not configured)";
  },

  async screen() {
    if (!isSamConfigured()) {
      return {
        source: "sam" as const,
        status: "not_configured" as const,
        matches: [],
        rawResponse: {
          configured: false,
          message: "SAM_API_KEY not set. SAM exclusion search is not available.",
        },
      };
    }

    // SAM API integration placeholder — requires entity API setup
    return {
      source: "sam" as const,
      status: "failed" as const,
      matches: [],
      rawResponse: { configured: true, message: "SAM API client not yet implemented" },
      errorMessage: "SAM API integration pending configuration",
    };
  },
};
