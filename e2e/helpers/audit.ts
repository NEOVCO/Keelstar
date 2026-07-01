import type { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export type RouteAuditEntry = {
  route: string;
  ok: boolean;
  status: number | null;
  title: string;
  heading: string | null;
  consoleErrors: string[];
  loadMs: number;
  note?: string;
};

const REPORT_DIR = path.join(process.cwd(), "e2e/reports");

export function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

export async function auditRoute(page: Page, route: string): Promise<RouteAuditEntry> {
  const consoleErrors: string[] = [];
  const handler = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  page.on("console", handler);

  const start = Date.now();
  let status: number | null = null;
  let note: string | undefined;

  try {
    const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 30_000 });
    status = response?.status() ?? null;
    await page.waitForTimeout(500);
  } catch (err) {
    note = err instanceof Error ? err.message : String(err);
  }

  page.off("console", handler);

  const title = await page.title();
  const heading =
    (await page.getByRole("heading").first().textContent().catch(() => null))?.trim() ?? null;

  const ignoredConsole = consoleErrors.filter(
    (e) =>
      !e.includes("favicon") &&
      !e.includes("Download the React DevTools") &&
      !e.includes("posthog")
  );

  return {
    route,
    ok: status !== null && status < 400 && !note,
    status,
    title,
    heading,
    consoleErrors: ignoredConsole,
    loadMs: Date.now() - start,
    note,
  };
}

export function writeAuditReport(entries: RouteAuditEntry[], filename = "audit-latest.md") {
  ensureReportDir();
  const failed = entries.filter((e) => !e.ok || e.consoleErrors.length > 0);
  const lines = [
    `# Keelstar Playwright audit`,
    ``,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `## Summary`,
    ``,
    `- Routes checked: ${entries.length}`,
    `- Failed loads: ${entries.filter((e) => !e.ok).length}`,
    `- Routes with console errors: ${entries.filter((e) => e.consoleErrors.length > 0).length}`,
    ``,
    `## Results`,
    ``,
    `| Route | Status | OK | Title | Heading | Load (ms) | Console errors |`,
    `|-------|--------|----|-------|---------|-----------|----------------|`,
    ...entries.map((e) => {
      const errs = e.consoleErrors.length ? e.consoleErrors.join("; ").slice(0, 80) : "—";
      return `| ${e.route} | ${e.status ?? "—"} | ${e.ok ? "✓" : "✗"} | ${e.title.slice(0, 40)} | ${(e.heading ?? "—").slice(0, 30)} | ${e.loadMs} | ${errs} |`;
    }),
  ];

  if (failed.length) {
    lines.push(``, `## Issues`, ``);
    for (const e of failed) {
      lines.push(`### ${e.route}`, ``);
      if (e.note) lines.push(`- **Load error:** ${e.note}`);
      if (!e.ok && e.status) lines.push(`- **HTTP ${e.status}**`);
      if (e.consoleErrors.length) {
        lines.push(`- **Console:**`);
        e.consoleErrors.forEach((c) => lines.push(`  - \`${c.slice(0, 200)}\``));
      }
      lines.push(``);
    }
  }

  const out = path.join(REPORT_DIR, filename);
  fs.writeFileSync(out, lines.join("\n"));
  return out;
}
