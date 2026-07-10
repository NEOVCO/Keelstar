import { test, expect } from "@playwright/test";

const modules = [
  { slug: "w9", heading: "W-9 Collector" },
  { slug: "coi", heading: "COI Tracker" },
  { slug: "contracts", heading: "Contract Renewal Tracker" },
] as const;

test.describe("Module pages", () => {
  for (const mod of modules) {
    test(`${mod.slug} module page loads`, async ({ page }) => {
      await page.goto(`/app/apps/${mod.slug}`);
      await expect(page.getByRole("heading", { name: mod.heading })).toBeVisible();
    });
  }

  test("directory add form reachable", async ({ page }) => {
    await page.goto("/app/vendors/new");
    await expect(page.getByRole("heading", { name: /directory/i })).toBeVisible();
  });

  test("contracts module has add contract form", async ({ page }) => {
    await page.goto("/app/apps/contracts");
    await expect(page.getByRole("button", { name: /add contract/i })).toBeVisible();
  });
});
