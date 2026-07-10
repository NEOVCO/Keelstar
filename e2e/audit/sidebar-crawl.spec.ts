import { test, expect } from "@playwright/test";
import { crawlSidebarNav, crawlPrimaryCtas, writeCrawlReport } from "../helpers/crawl";

const PRIMARY_CTAS = [
  { route: "/app/vendors", action: /add to directory/i },
  { route: "/app/apps/w9", action: /request w-9/i },
  { route: "/app/apps/coi", action: /request coi/i },
  { route: "/app/apps/contracts", action: /add contract/i },
  { route: "/app/settings", action: /^billing$/i, role: "link" as const },
] as const;

test.describe("Navigation crawl", () => {
  test.setTimeout(120_000);

  test("sidebar links", async ({ page }) => {
    const nav = await crawlSidebarNav(page);
    const report = writeCrawlReport(nav, [], "audit-crawl-sidebar.md");
    console.log(`Sidebar crawl report: ${report}`);

    const navFailed = nav.filter((e) => !e.ok);
    const navWarnings = nav.filter((e) => e.consoleErrors.length > 0);
    if (navWarnings.length) {
      console.warn(
        "Sidebar console warnings:",
        navWarnings.map((e) => `${e.label}: ${e.consoleErrors.length} error(s)`)
      );
    }

    expect(navFailed, `Sidebar: ${navFailed.map((f) => f.label).join(", ")}`).toHaveLength(0);
  });

  test("primary CTAs", async ({ page }) => {
    const ctas = await crawlPrimaryCtas(page, [...PRIMARY_CTAS]);
    const report = writeCrawlReport([], ctas, "audit-crawl-ctas.md");
    console.log(`CTA crawl report: ${report}`);

    const ctaFailed = ctas.filter((e) => !e.ok);
    const ctaWarnings = ctas.filter((e) => e.consoleErrors.length > 0);
    if (ctaWarnings.length) {
      console.warn(
        "CTA console warnings:",
        ctaWarnings.map((e) => `${e.route}: ${e.consoleErrors.length} error(s)`)
      );
    }

    expect(ctaFailed, `CTAs: ${ctaFailed.map((f) => f.route).join(", ")}`).toHaveLength(0);
  });
});
