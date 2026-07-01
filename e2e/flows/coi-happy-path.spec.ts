import { test, expect } from "@playwright/test";
import {
  ensureTestVendor,
  fillFieldByLabel,
  futureDateInput,
  selectFieldByLabel,
  uniqueSuffix,
  writeTestPdf,
} from "../helpers/flows";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

test.describe("COI happy path", () => {
  const suffix = uniqueSuffix();
  const vendorName = `E2E COI Vendor ${suffix}`;
  const vendorEmail = `e2e-coi+${suffix}@example.com`;

  test("create vendor, send COI request, upload, approve with monitoring", async ({
    page,
    browser,
  }) => {
    const vendorId = await ensureTestVendor(page, vendorName, vendorEmail);

    const createRes = await page.request.post("/api/coi/requests", {
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
        test.skip(true, createJson.error ?? "COI usage limit reached");
      }
      throw new Error(createJson.error ?? "Failed to create COI request");
    }

    const magicLinkUrl = createJson.data.magicLinkUrl as string | undefined;
    const workflowId = createJson.data.workflow?.id as string | undefined;
    if (!magicLinkUrl || !workflowId) {
      throw new Error(`Unexpected COI create response: ${JSON.stringify(createJson).slice(0, 300)}`);
    }

    await page.goto(`/app/workflows/${workflowId}`);

    const external = await browser.newPage();
    await external.goto(magicLinkUrl);
    await expect(external.getByRole("heading", { name: "Certificate of insurance upload" })).toBeVisible();

    const pdfPath = writeTestPdf("coi");
    await external.locator('input[type="file"]').setInputFiles(pdfPath);
    const uploadResponse = external.waitForResponse(
      (r) => r.url().includes("/api/external/coi/upload") && r.request().method() === "POST"
    );
    await external.getByRole("button", { name: "Upload certificate" }).click();
    const uploadRes = await uploadResponse;
    const uploadJson = await uploadRes.json();
    if (!uploadJson.success) {
      throw new Error(uploadJson.error ?? "COI external upload failed");
    }
    await expect(external.getByText(/Thank you/i)).toBeVisible({ timeout: 20_000 });
    await external.close();

    await page.reload();
    const coiFields = page.locator("div").filter({ has: page.getByRole("heading", { name: "COI fields" }) });
    await expect(coiFields.getByText("Insured name", { exact: true })).toBeVisible({ timeout: 20_000 });
    await fillFieldByLabel(page, "Insured name", vendorName, coiFields);
    await fillFieldByLabel(page, "Expiration date", futureDateInput(365), coiFields);
    await selectFieldByLabel(page, "Policy type", "general_liability", coiFields);

    const saveRes = await page.request.post(`/api/coi/requests/${workflowId}`, {
      data: {
        action: "save_fields",
        fields: {
          insured_name: vendorName,
          expiration_date: futureDateInput(365),
          policy_type: "general_liability",
        },
      },
    });
    const saveJson = await saveRes.json();
    if (!saveJson.success) {
      throw new Error(saveJson.error ?? "Failed to save COI fields");
    }
    await page.reload();
    await expect(coiFields.getByText("Insured name", { exact: true })).toBeVisible({ timeout: 20_000 });

    const approveResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/api/coi/requests") &&
        r.request().method() === "POST" &&
        r.request().postData()?.includes('"approve"')
    );
    await page.getByRole("button", { name: "Approve COI" }).click();
    const approveRes = await approveResponse;
    const approveJson = await approveRes.json();
    if (!approveJson.success) {
      throw new Error(approveJson.error ?? "COI approve failed");
    }

    await page.reload();
    await expect(page.getByRole("button", { name: "Export evidence" })).toBeVisible({
      timeout: 20_000,
    });
  });
});
