import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_EMAIL ?? "admin@keelstar.test";
  const password = process.env.E2E_PASSWORD ?? "KeelstarDev2026!";

  await page.goto("/login?redirect=/app");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/(app|onboarding)/, { timeout: 20_000 });

  if (page.url().includes("/onboarding")) {
    throw new Error(
      "E2E user has no organization. Use admin@keelstar.test with a seeded org or set E2E_EMAIL / E2E_PASSWORD."
    );
  }

  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible({ timeout: 15_000 });
  await page.context().storageState({ path: authFile });
});
