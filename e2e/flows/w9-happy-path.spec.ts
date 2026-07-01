import { test, expect } from "@playwright/test";
import { ensureTestVendor, uniqueSuffix, writeTestPdf } from "../helpers/flows";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

test.describe("W-9 happy path", () => {
  const suffix = uniqueSuffix();
  const vendorName = `E2E W9 Vendor ${suffix}`;
  const vendorEmail = `e2e-w9+${suffix}@example.com`;

  test("create vendor, send request, external upload, approve", async ({ page, browser }) => {
    const vendorId = await ensureTestVendor(page, vendorName, vendorEmail);

    const createRes = await page.request.post("/api/w9/requests", {
      data: {
        vendorId,
        recipientEmail: vendorEmail,
        sendImmediately: true,
        replaceExisting: true,
      },
    });
    const createJson = await createRes.json();
    if (!createJson.success) {
      if (createRes.status() === 402) {
        test.skip(true, createJson.error ?? "W-9 usage limit reached");
      }
      throw new Error(createJson.error ?? "Failed to create W-9 request");
    }

    const magicLinkUrl = createJson.data.magicLinkUrl as string;
    const workflowId = createJson.data.workflow.id as string;
    await page.goto(`/app/workflows/${workflowId}`);

    const external = await browser.newPage();
    await external.goto(magicLinkUrl);
    await expect(external.getByRole("heading", { name: "W-9 upload request" })).toBeVisible();

    const pdfPath = writeTestPdf("w9");
    await external.locator('input[type="file"]').setInputFiles(pdfPath);
    await external.getByRole("button", { name: "Upload W-9" }).click();
    await expect(external.getByText("Thank you")).toBeVisible({ timeout: 20_000 });
    await external.close();

    await page.reload();
    await expect(page.getByRole("button", { name: "Approve W-9" })).toBeVisible({ timeout: 20_000 });
    const approveResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/api/w9/requests") &&
        r.request().method() === "POST" &&
        r.request().postData()?.includes('"approve"')
    );
    await page.getByRole("button", { name: "Approve W-9" }).click();
    const approveRes = await approveResponse;
    const approveJson = await approveRes.json();
    if (!approveJson.success) {
      throw new Error(approveJson.error ?? "W-9 approve failed");
    }

    await page.reload();
    await expect(page.getByRole("button", { name: "Export evidence" })).toBeVisible({
      timeout: 15_000,
    });
  });
});
