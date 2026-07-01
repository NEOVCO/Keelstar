import { test, expect } from "@playwright/test";
import fs from "fs";
import { fillFieldByLabel, futureDateInput, uniqueSuffix, writeTestPdf } from "../helpers/flows";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

test.describe("Contract renewal happy path", () => {
  const suffix = uniqueSuffix();
  const contractName = `E2E Contract ${suffix}`;
  const counterparty = "E2E Counterparty LLC";

  test("create contract, upload, save fields, activate monitoring", async ({ page }) => {
    const createRes = await page.request.post("/api/contracts/requests", {
      data: { contractName, counterparty },
    });
    const createJson = await createRes.json();
    if (!createJson.success) {
      if (createRes.status() === 402) {
        test.skip(true, createJson.error ?? "Contract usage limit reached");
      }
      throw new Error(createJson.error ?? "Failed to create contract");
    }

    const workflowId = createJson.data.workflow.id as string;
    await page.goto(`/app/workflows/${workflowId}`);

    const pdfPath = writeTestPdf("contract");
    const uploadRes = await page.request.post(`/api/contracts/requests/${workflowId}`, {
      multipart: {
        file: {
          name: "e2e-contract.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(pdfPath),
        },
      },
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson.success) {
      if (uploadRes.status() === 402) {
        test.skip(true, uploadJson.error ?? "Contract usage limit reached");
      }
      throw new Error(uploadJson.error ?? "Contract upload failed");
    }

    await page.reload();
    await expect(page.getByRole("heading", { name: "Renewal details" })).toBeVisible({
      timeout: 20_000,
    });

    const contractDetails = page
      .locator("div")
      .filter({ has: page.getByRole("heading", { name: "Renewal details" }) });
    await fillFieldByLabel(page, "Renewal date", futureDateInput(180), contractDetails);

    const saveRes = await page.request.post(`/api/contracts/requests/${workflowId}`, {
      data: {
        action: "save_fields",
        fields: {
          contract_name: contractName,
          counterparty,
          renewal_date: futureDateInput(180),
        },
      },
    });
    const saveJson = await saveRes.json();
    if (!saveJson.success) {
      throw new Error(saveJson.error ?? "Failed to save contract fields");
    }

    const activateResponse = page.waitForResponse(
      (r) =>
        r.url().includes(`/api/contracts/requests/${workflowId}`) &&
        r.request().method() === "POST" &&
        r.request().postData()?.includes('"activate"')
    );
    await page.getByRole("button", { name: "Create renewal tracker" }).click();
    const activateRes = await activateResponse;
    const activateJson = await activateRes.json();
    if (!activateJson.success) {
      throw new Error(activateJson.error ?? "Failed to activate contract monitoring");
    }

    await page.reload();
    await expect(page.getByRole("button", { name: "Export evidence" })).toBeVisible({
      timeout: 20_000,
    });
  });
});
