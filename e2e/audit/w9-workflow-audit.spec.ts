import { test, expect } from "@playwright/test";
import { getOrCreateTestVendor, cleanupE2EVendors, uniqueSuffix, writeTestPdf } from "../helpers/flows";
import {
  WorkflowAudit,
  expectStepperActive,
  expectStepperDone,
  expectWorkflowStatus,
  stepperLabelForStatus,
} from "../helpers/workflow-audit";

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

test.describe("W-9 workflow audit", () => {
  const audit = new WorkflowAudit();
  const suffix = uniqueSuffix();
  const vendorName = `E2E W9 Audit ${suffix}`;
  const vendorEmail = `e2e-w9-audit+${suffix}@example.com`;

  let vendorId = "";
  let workflowId = "";
  let magicLinkUrl = "";

  test("step-by-step with timing and state checks", async ({ page, browser }) => {
    await audit.run("0. Clean up prior E2E vendors", () => cleanupE2EVendors(page));

    vendorId = await audit.run("1. Create vendor", () =>
      getOrCreateTestVendor(page, vendorName, vendorEmail)
    );

    const createJson = await audit.run("2. Send W-9 request", async () => {
      const createRes = await page.request.post("/api/w9/requests", {
        data: {
          vendorId,
          recipientEmail: vendorEmail,
          sendImmediately: true,
          replaceExisting: true,
        },
      });
      const json = await createRes.json();
      if (!json.success) {
        if (createRes.status() === 402) {
          test.skip(true, json.error ?? "W-9 usage limit reached");
        }
        throw new Error(json.error ?? "Failed to create W-9 request");
      }
      return json;
    });

    magicLinkUrl = createJson.data.magicLinkUrl as string;
    workflowId = createJson.data.workflow.id as string;

    await audit.run("3. Workflow sent — waiting on vendor", async () => {
      await page.goto(`/app/workflows/${workflowId}`);
      await expect(page.getByRole("button", { name: "Resend request" })).toBeVisible({
        timeout: 15_000,
      });
      await expectWorkflowStatus(page, /sent|opened/i);
      await expectStepperActive(page, stepperLabelForStatus("sent"));
      await expect(page.getByText("Waiting on external participant")).toBeVisible();
    });

    await audit.run("4. External vendor uploads W-9", async () => {
      const external = await browser.newPage();
      await external.goto(magicLinkUrl);
      await expect(external.getByRole("heading", { name: "W-9 upload request" })).toBeVisible();

      const pdfPath = writeTestPdf("w9-audit");
      await external.locator('input[type="file"]').setInputFiles(pdfPath);
      await external.getByRole("button", { name: "Upload W-9" }).click();
      await expect(external.getByText("Thank you")).toBeVisible({ timeout: 20_000 });
      await external.close();
    });

    await audit.run("5. Submitted — ready for review", async () => {
      await page.reload();
      await expect(page.getByRole("button", { name: "Approve W-9" })).toBeVisible({
        timeout: 20_000,
      });
      await expectWorkflowStatus(page, /submitted|review/i);
      await expectStepperActive(page, stepperLabelForStatus("submitted"));
      await expect(page.getByText("Review submitted document")).toBeVisible();
    });

    await audit.run("6. Approve W-9", async () => {
      const approveResponse = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/w9/requests/${workflowId}`) &&
          r.request().method() === "POST" &&
          r.request().postData()?.includes('"approve"') &&
          r.ok() &&
          (r.headers()["content-type"] ?? "").includes("application/json")
      );
      await page.getByRole("button", { name: "Approve W-9" }).click();
      const approveRes = await approveResponse;
      const approveJson = await approveRes.json();
      if (!approveJson.success) {
        throw new Error(approveJson.error ?? "W-9 approve failed");
      }
    });

    await audit.run("7. Approved — monitoring active", async () => {
      await page.reload();
      await expect(page.getByRole("button", { name: "Export evidence" })).toBeVisible({
        timeout: 15_000,
      });
      await expectWorkflowStatus(page, /approved|completed/i);
      await expectStepperDone(page, stepperLabelForStatus("completed"));
    });

    const report = audit.writeReport("W-9 Collector", "audit-workflow-w9.md");
    console.log(`Workflow audit report: ${report}`);

    const failed = audit.results.filter((s) => !s.ok);
    const slow = audit.results.filter((s) => s.slow);
    if (slow.length) {
      console.warn("Slow steps:", slow.map((s) => `${s.step}: ${s.ms}ms`).join(", "));
    }

    expect(failed, `Failed steps: ${failed.map((f) => f.step).join(", ")}`).toHaveLength(0);
  });
});
