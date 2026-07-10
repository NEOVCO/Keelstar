import type { Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ensureReportDir } from "./audit";

export type NavCrawlEntry = {
  label: string;
  expectedHref: string;
  landedUrl: string;
  ok: boolean;
  consoleErrors: string[];
  note?: string;
};

export type CtaCrawlEntry = {
  route: string;
  buttonLabel: string;
  ok: boolean;
  landedUrl: string;
  consoleErrors: string[];
  note?: string;
};

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function attachConsoleCollector(page: Page) {
  const consoleErrors: string[] = [];
  const handler = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  page.on("console", handler);
  return {
    consoleErrors,
    detach: () => page.off("console", handler),
    filtered: () =>
      consoleErrors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("Download the React DevTools") &&
          !e.includes("posthog") &&
          !e.includes("Failed to fetch RSC payload") &&
          !e.includes("fastRefresh") &&
          !e.includes("HMR")
      ),
  };
}

export async function crawlSidebarNav(page: Page): Promise<NavCrawlEntry[]> {
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Home" }).waitFor({ timeout: 20_000 });
  await page.locator("aside nav a").first().waitFor({ timeout: 10_000 });

  const linkMeta = await page.locator("aside nav a").evaluateAll((els) =>
    els.map((el) => ({
      label: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
      href: el.getAttribute("href") ?? "",
    }))
  );

  const entries: NavCrawlEntry[] = [];

  for (const { label, href: expectedHref } of linkMeta) {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    const { filtered, detach } = attachConsoleCollector(page);

    let landedUrl = "";
    let note: string | undefined;

    try {
      const link = page.locator("aside nav").getByRole("link", { name: label, exact: true });
      await link.click({ timeout: 10_000 });
      await page.waitForLoadState("domcontentloaded");
      landedUrl = normalizePath(new URL(page.url()).pathname);
    } catch (err) {
      note = err instanceof Error ? err.message : String(err);
      landedUrl = normalizePath(new URL(page.url()).pathname);
    }

    detach();

    const errors = filtered();
    const expectedPath = normalizePath(expectedHref.split("?")[0]);
    const reachedExpected =
      landedUrl === expectedPath || landedUrl.startsWith(`${expectedPath}/`);
    const billingRedirect =
      expectedPath.startsWith("/app/apps/") && landedUrl === "/app/settings/billing";

    entries.push({
      label,
      expectedHref,
      landedUrl,
      ok: !note && (reachedExpected || billingRedirect),
      consoleErrors: errors,
      note: note ?? (!reachedExpected && !billingRedirect ? `Landed on ${landedUrl}` : undefined),
    });
  }

  return entries;
}

export async function crawlPrimaryCtas(
  page: Page,
  cases: { route: string; action: RegExp; role?: "button" | "link" }[]
): Promise<CtaCrawlEntry[]> {
  const entries: CtaCrawlEntry[] = [];

  for (const { route, action, role = "button" } of cases) {
    const { filtered, detach } = attachConsoleCollector(page);

    await page.goto(route, { waitUntil: "domcontentloaded" });
    const cta =
      role === "link"
        ? page.getByRole("link", { name: action }).first()
        : page.getByRole("button", { name: action }).first();
    const buttonLabel = (await cta.textContent().catch(() => "")) ?? action.source;

    let note: string | undefined;
    let landedUrl = route;

    try {
      const visible = await cta.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!visible) {
        note = "Primary CTA not visible";
      } else {
        await cta.click();
        await page.waitForLoadState("domcontentloaded");
        landedUrl = normalizePath(new URL(page.url()).pathname);
      }
    } catch (err) {
      note = err instanceof Error ? err.message : String(err);
      landedUrl = new URL(page.url()).pathname;
    }

    detach();
    const errors = filtered();

    entries.push({
      route,
      buttonLabel,
      ok: !note,
      landedUrl,
      consoleErrors: errors,
      note,
    });
  }

  return entries;
}

export function writeCrawlReport(
  nav: NavCrawlEntry[],
  ctas: CtaCrawlEntry[],
  filename = "audit-crawl.md"
) {
  ensureReportDir();
  const navFailed = nav.filter((e) => !e.ok);
  const navWarnings = nav.filter((e) => e.consoleErrors.length > 0);
  const ctaFailed = ctas.filter((e) => !e.ok);
  const ctaWarnings = ctas.filter((e) => e.consoleErrors.length > 0);

  const lines = [
    `# Keelstar navigation crawl`,
    ``,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `## Summary`,
    ``,
    `- Sidebar links checked: ${nav.length}`,
    `- Sidebar failures: ${navFailed.length}`,
    `- Sidebar console warnings: ${navWarnings.length}`,
    `- Primary CTAs checked: ${ctas.length}`,
    `- CTA failures: ${ctaFailed.length}`,
    `- CTA console warnings: ${ctaWarnings.length}`,
    ``,
    `## Sidebar`,
    ``,
    `| Label | Expected | Landed | OK | Console errors |`,
    `|-------|----------|--------|----|----------------|`,
    ...nav.map((e) => {
      const errs = e.consoleErrors.length ? e.consoleErrors.join("; ").slice(0, 60) : "—";
      return `| ${e.label.slice(0, 28)} | ${e.expectedHref} | ${e.landedUrl} | ${e.ok ? "✓" : "✗"} | ${errs} |`;
    }),
    ``,
    `## Primary CTAs`,
    ``,
    `| Route | Button | Landed | OK | Note |`,
    `|-------|--------|--------|----|------|`,
    ...ctas.map((e) => {
      return `| ${e.route} | ${e.buttonLabel.slice(0, 24)} | ${e.landedUrl} | ${e.ok ? "✓" : "✗"} | ${(e.note ?? "—").slice(0, 40)} |`;
    }),
  ];

  if (navWarnings.length || ctaWarnings.length) {
    lines.push(``, `## Console warnings (navigation still succeeded)`, ``);
    for (const e of [...navWarnings, ...ctaWarnings]) {
      const name = "expectedHref" in e ? `Sidebar: ${e.label}` : `CTA: ${e.route}`;
      lines.push(`### ${name}`, ``);
      e.consoleErrors.slice(0, 3).forEach((c) => lines.push(`- \`${c.slice(0, 200)}\``));
      if (e.consoleErrors.length > 3) lines.push(`- _…and ${e.consoleErrors.length - 3} more_`);
      lines.push(``);
    }
  }

  if (navFailed.length || ctaFailed.length) {
    lines.push(``, `## Issues`, ``);
    for (const e of [...navFailed, ...ctaFailed]) {
      if ("expectedHref" in e) {
        lines.push(`### Sidebar: ${e.label}`, ``);
        if (e.note) lines.push(`- ${e.note}`);
        if (e.consoleErrors.length) e.consoleErrors.forEach((c) => lines.push(`- \`${c.slice(0, 200)}\``));
      } else {
        lines.push(`### CTA: ${e.route} → ${e.buttonLabel}`, ``);
        if (e.note) lines.push(`- ${e.note}`);
        if (e.consoleErrors.length) e.consoleErrors.forEach((c) => lines.push(`- \`${c.slice(0, 200)}\``));
      }
      lines.push(``);
    }
  }

  const out = path.join(process.cwd(), "e2e/reports", filename);
  fs.writeFileSync(out, lines.join("\n"));
  return out;
}
