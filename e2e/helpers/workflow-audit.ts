import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ensureReportDir } from "./audit";

export type WorkflowStepResult = {
  step: string;
  ms: number;
  ok: boolean;
  note?: string;
  slow: boolean;
};

const STEPPER_STEPS = ["Start", "Collect document", "Extract fields", "Review", "Monitor"];

export class WorkflowAudit {
  private readonly steps: WorkflowStepResult[] = [];
  private readonly slowThresholdMs: number;

  constructor(slowThresholdMs = 3_000) {
    this.slowThresholdMs = slowThresholdMs;
  }

  get results() {
    return [...this.steps];
  }

  async run<T>(step: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const value = await fn();
      this.record(step, Date.now() - start, true);
      return value;
    } catch (err) {
      this.record(step, Date.now() - start, false, err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  private record(step: string, ms: number, ok: boolean, note?: string) {
    this.steps.push({ step, ms, ok, note, slow: ms >= this.slowThresholdMs });
  }

  writeReport(workflowName: string, filename: string) {
    ensureReportDir();
    const failed = this.steps.filter((s) => !s.ok);
    const slow = this.steps.filter((s) => s.slow);
    const totalMs = this.steps.reduce((sum, s) => sum + s.ms, 0);

    const lines = [
      `# Workflow audit: ${workflowName}`,
      ``,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `## Summary`,
      ``,
      `- Steps: ${this.steps.length}`,
      `- Failed: ${failed.length}`,
      `- Slow (≥${this.slowThresholdMs}ms): ${slow.length}`,
      `- Total duration: ${totalMs}ms`,
      ``,
      `## Steps`,
      ``,
      `| Step | Duration (ms) | OK | Slow | Note |`,
      `|------|---------------|----|------|------|`,
      ...this.steps.map((s) => {
        return `| ${s.step} | ${s.ms} | ${s.ok ? "✓" : "✗"} | ${s.slow ? "⚠" : "—"} | ${(s.note ?? "—").slice(0, 50)} |`;
      }),
    ];

    if (failed.length) {
      lines.push(``, `## Failures`, ``);
      failed.forEach((s) => lines.push(`- **${s.step}:** ${s.note ?? "unknown"}`));
    }

    if (slow.length) {
      lines.push(``, `## Slow steps (efficiency)`, ``);
      slow.forEach((s) => lines.push(`- **${s.step}:** ${s.ms}ms`));
    }

    const out = path.join(process.cwd(), "e2e/reports", filename);
    fs.writeFileSync(out, lines.join("\n"));
    return out;
  }
}

export async function expectStepperActive(page: Page, stepLabel: string) {
  const step = page.locator("ol.flex li").filter({ hasText: stepLabel });
  await expect(step).toHaveClass(/border-accent/);
}

export async function expectStepperDone(page: Page, stepLabel: string) {
  const step = page.locator("ol.flex li").filter({ hasText: stepLabel });
  await expect(step).toHaveClass(/border-success/);
}

export async function expectWorkflowStatus(page: Page, statusPattern: RegExp) {
  const titleRow = page.locator("h1").locator("..");
  await expect(titleRow.getByText(statusPattern)).toBeVisible({ timeout: 15_000 });
}

export async function expectStepperProgress(page: Page, minCompletedSteps: number) {
  const doneMarkers = page.locator("ol.flex li span").filter({ hasText: "✓" });
  await expect(doneMarkers).toHaveCount(minCompletedSteps, { timeout: 15_000 });
}

export function stepperLabelForStatus(status: string): string {
  if (["draft"].includes(status)) return STEPPER_STEPS[0];
  if (["sent", "opened", "waiting_on_external", "in_progress"].includes(status)) return STEPPER_STEPS[1];
  if (["submitted", "processing", "parsed"].includes(status)) return STEPPER_STEPS[2];
  if (["review_needed", "in_review", "needs_correction", "rejected"].includes(status)) return STEPPER_STEPS[3];
  if (["approved", "active_monitoring", "active", "completed"].includes(status)) return STEPPER_STEPS[4];
  return STEPPER_STEPS[4];
}
