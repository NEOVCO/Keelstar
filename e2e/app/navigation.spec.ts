import { test, expect } from "@playwright/test";

test.describe("App shell navigation", () => {
  test("home dashboard loads", async ({ page }) => {
    await page.goto("/app");
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  });

  test("vendors list loads", async ({ page }) => {
    await page.goto("/app/vendors");
    await expect(page.getByRole("heading", { name: "Directory" })).toBeVisible();
  });

  test("workflows list loads", async ({ page }) => {
    await page.goto("/app/workflows");
    await expect(page.getByRole("heading", { name: "Workflows" })).toBeVisible();
  });

  test("settings loads", async ({ page }) => {
    await page.goto("/app/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("billing settings loads", async ({ page }) => {
    await page.goto("/app/settings/billing");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
