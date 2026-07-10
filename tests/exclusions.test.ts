import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  EXCLUSION_WORKFLOW_TYPE,
  EXCLUSION_MONITOR_TYPE,
  EXCLUSION_ENTITLEMENT,
  getExclusionDataMode,
  OIG_LEIE_CSV_URL,
  OIG_LEIE_ONLINE_SEARCH_URL,
} from "@/lib/exclusions/constants";
import { findDemoOigMatches } from "@/lib/exclusions/providers/demo-data";
import { parseCsvLine, parseLeieCsv } from "@/lib/exclusions/providers/oig-leie";
import { findLeieMatches } from "@/lib/exclusions/providers/oig-leie-match";
import { namesMatch, normalizeName, namesMatchFlexible } from "@/lib/exclusions/matchScoring";
import { parseBulkImportCsv } from "@/lib/exclusions/bulkImportCsv";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";
import { PERMISSIONS } from "@/lib/rbac/permissions";

describe("exclusion constants", () => {
  it("defines workflow and monitor types", () => {
    expect(EXCLUSION_WORKFLOW_TYPE).toBe("exclusion_screening");
    expect(EXCLUSION_MONITOR_TYPE).toBe("exclusion_monitoring");
    expect(EXCLUSION_ENTITLEMENT).toBe("exclusion_monitor");
  });

  it("defaults to live data mode", () => {
    expect(getExclusionDataMode()).toBe("live");
  });

  it("exposes official OIG LEIE URLs", () => {
    expect(OIG_LEIE_CSV_URL).toContain("oig.hhs.gov");
    expect(OIG_LEIE_ONLINE_SEARCH_URL).toContain("exclusions.oig.hhs.gov");
  });
});

describe("OIG demo matching", () => {
  it("finds exact name match as potential match", () => {
    const matches = findDemoOigMatches({ displayName: "Jane Doe" });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].matchedName).toBe("JANE DOE");
  });

  it("returns no match for unknown name", () => {
    const matches = findDemoOigMatches({ displayName: "Nobody Here LLC" });
    expect(matches).toHaveLength(0);
  });

  it("matches by NPI when provided", () => {
    const matches = findDemoOigMatches({
      displayName: "Unrelated Name",
      npi: "1234567890",
    });
    expect(matches.some((m) => m.matchedIdentifier === "1234567890")).toBe(true);
  });
});

describe("OIG LEIE CSV parsing", () => {
  it("parses a CSV row with quoted business name", () => {
    const line =
      '"DOE","JANE","","","INDIVIDUAL","NURSE","","1234567893","","123 MAIN ST","AUSTIN","TX","78701","1128a1","20231101","00000000","00000000",""';
    const cols = parseCsvLine(line);
    expect(cols[0]).toBe("DOE");
    expect(cols[1]).toBe("JANE");
    expect(cols[7]).toBe("1234567893");
  });

  it("matches parsed LEIE records by person name", () => {
    const csv = `LASTNAME,FIRSTNAME,MIDNAME,BUSNAME,GENERAL,SPECIALTY,UPIN,NPI,DOB,ADDRESS,CITY,STATE,ZIP,EXCLTYPE,EXCLDATE,REINDATE,WAIVERDATE,WVRSTATE
"DOE","JANE","","","INDIVIDUAL","NURSE","","1234567893","","123 MAIN ST","AUSTIN","TX","78701","1128a1","20231101","00000000","00000000",""`;
    const records = parseLeieCsv(csv);
    const matches = findLeieMatches({ displayName: "Jane Doe", subjectType: "person" }, records);
    expect(matches.length).toBe(1);
    expect(matches[0].matchedName).toBe("JANE DOE");
  });
});

describe("name normalization", () => {
  it("normalizes punctuation and case", () => {
    expect(normalizeName("Jane-Doe, Inc.")).toBe("JANEDOE INC");
    expect(namesMatch("jane doe", "JANE DOE")).toBe(true);
  });

  it("matches person names with minor first-name typo", () => {
    expect(namesMatchFlexible("Debhanma AAKER", "DEBHANNA AAKER")).toBe(true);
    expect(namesMatchFlexible("DEBHANNA AAKER", "AAKER DEBHANNA")).toBe(true);
    expect(namesMatchFlexible("Jane Doe", "JOHN SMITH")).toBe(false);
  });
});

  // SAM configuration tests — disabled (not implementing)

describe("exclusion billing limits", () => {
  it("defines free tier limits", () => {
    expect(FREE_TIER_LIMITS.exclusionChecksPerMonth).toBe(5);
    expect(FREE_TIER_LIMITS.exclusionActiveMonitors).toBe(1);
  });
});

describe("exclusion permissions mapping", () => {
  it("maps run to workflows.create", () => {
    expect(PERMISSIONS.WORKFLOWS_CREATE).toBe("workflows.create");
  });

  it("maps review to workflows.approve", () => {
    expect(PERMISSIONS.WORKFLOWS_APPROVE).toBe("workflows.approve");
  });

  it("maps monitor to monitors.manage", () => {
    expect(PERMISSIONS.MONITORS_MANAGE).toBe("monitors.manage");
  });
});

describe("review note requirement", () => {
  it("requires minimum note length", async () => {
    const { reviewScreeningResult } = await import("@/lib/exclusions/reviewResult");
    await expect(
      reviewScreeningResult("00000000-0000-0000-0000-000000000001", {
        action: "clear",
        reviewNotes: "ab",
      })
    ).rejects.toThrow();
  });
});

describe("bulk import CSV", () => {
  it("parses headered CSV rows", () => {
    const rows = parseBulkImportCsv(
      "subject_type,display_name,first_name,last_name\nemployee,Jane Smith,Jane,Smith"
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].display_name).toBe("Jane Smith");
    expect(rows[0].subject_type).toBe("employee");
  });

  it("parses single-column name lines as people", () => {
    const rows = parseBulkImportCsv("DEBHANNA AAKER\nAcme Medical LLC");
    expect(rows).toHaveLength(2);
    expect(rows[0].subject_type).toBe("person");
    expect(rows[0].display_name).toBe("DEBHANNA AAKER");
  });
});
