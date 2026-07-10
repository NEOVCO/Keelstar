import { test, expect } from "@playwright/test";
import { auditRoute, writeAuditReport, type RouteAuditEntry } from "../helpers/audit";

const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/products",
  "/products/w9-collector",
  "/products/coi-tracker",
  "/products/contract-renewal-tracker",
  "/login",
  "/signup",
  "/docs",
  "/security",
  "/contact",
];

const AUTH_ROUTES = [
  "/app",
  "/app/inbox",
  "/app/workflows",
  "/app/documents",
  "/app/monitors",
  "/app/vendors",
  "/app/vendors/new",
  "/app/people",
  "/app/reports",
  "/app/audit",
  "/app/settings",
  "/app/settings/billing",
  "/app/settings/members",
  "/app/apps/w9",
  "/app/apps/coi",
  "/app/apps/contracts",
  "/app/apps/exclusions",
  "/app/apps/vendor-packets",
  "/app/apps/policies",
  "/app/apps/training",
  "/app/apps/invoices",
  "/app/apps/signer",
];

test.describe("Route audit", () => {
  test("public routes", async ({ page }) => {
    const entries: RouteAuditEntry[] = [];
    for (const route of PUBLIC_ROUTES) {
      entries.push(await auditRoute(page, route));
    }
    const report = writeAuditReport(entries, "audit-public.md");
    console.log(`Public audit report: ${report}`);
    const failed = entries.filter((e) => !e.ok);
    expect(failed, `Failed routes: ${failed.map((f) => f.route).join(", ")}`).toHaveLength(0);
  });

  test("authenticated app routes", async ({ page }) => {
    test.setTimeout(120_000);
    const entries: RouteAuditEntry[] = [];
    for (const route of AUTH_ROUTES) {
      entries.push(await auditRoute(page, route));
    }
    const report = writeAuditReport(entries, "audit-app.md");
    console.log(`App audit report: ${report}`);

    const failed = entries.filter((e) => !e.ok);
    expect(failed, `Failed routes: ${failed.map((f) => f.route).join(", ")}`).toHaveLength(0);

    const withErrors = entries.filter((e) => e.consoleErrors.length > 0);
    if (withErrors.length) {
      console.warn(
        "Routes with console errors:",
        withErrors.map((e) => `${e.route}: ${e.consoleErrors.join("; ")}`)
      );
    }
  });
});
