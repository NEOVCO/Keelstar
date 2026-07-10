import fs from "fs";
import os from "os";
import path from "path";
import type { Page, Response } from "@playwright/test";

export function uniqueSuffix() {
  return Date.now().toString(36);
}

export function writeTestPdf(label = "e2e"): string {
  const filePath = path.join(os.tmpdir(), `keelstar-${label}-${Date.now()}.pdf`);
  const contents = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
149
%%EOF`;
  fs.writeFileSync(filePath, contents);
  return filePath;
}

export async function fillFieldByLabel(
  page: Page,
  label: string,
  value: string,
  scope?: ReturnType<Page["locator"]>
) {
  const root = scope ?? page.locator("form").first();
  const field = root
    .locator("div")
    .filter({ has: root.locator("label", { hasText: new RegExp(`^${label}$`) }) })
    .locator("input, textarea")
    .first();
  await field.fill(value);
  await field.blur();
}

export async function selectFieldByLabel(
  page: Page,
  label: string,
  value: string,
  scope?: ReturnType<Page["locator"]>
) {
  const root = scope ?? page.locator("form").first();
  const field = root
    .locator("div")
    .filter({ has: root.locator("label", { hasText: new RegExp(`^${label}$`) }) })
    .locator("select")
    .first();
  await field.selectOption(value);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function vendorIdFromHref(href: string | null): string | null {
  const id = href?.split("/").filter(Boolean).pop();
  return id && UUID_RE.test(id) ? id : null;
}

export async function cleanupE2EVendors(page: Page): Promise<number> {
  await page.goto("/app/vendors");
  const links = page.locator('a[href^="/app/vendors/"]');
  const count = await links.count();
  let deleted = 0;
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    const id = vendorIdFromHref(href);
    if (!id) continue;
    const label = (await links.nth(i).textContent())?.trim() ?? "";
    if (label.startsWith("E2E ")) {
      await page.request.delete(`/api/vendors/${id}`);
      deleted++;
    }
  }
  return deleted;
}

export async function ensureTestVendor(page: Page, name: string, email: string): Promise<string> {
  const attempt = async () => {
    const res = await page.request.post("/api/vendors", { data: { name, email } });
    return { res, json: await res.json() };
  };

  let { res, json } = await attempt();
  if (json.success) return json.data.vendor.id as string;

  if (res.status() === 402) {
    await cleanupE2EVendors(page);
    ({ res, json } = await attempt());
    if (json.success) return json.data.vendor.id as string;
  }

  throw new Error(json.error ?? `Create vendor failed (${res.status()})`);
}

/** Create a vendor, or reuse an existing one when the org is at the vendor cap. */
export async function getOrCreateTestVendor(page: Page, name: string, email: string): Promise<string> {
  try {
    return await ensureTestVendor(page, name, email);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("vendor")) throw err;
  }

  await page.goto("/app/vendors");
  const links = page.locator('a[href^="/app/vendors/"]');
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const id = vendorIdFromHref(await links.nth(i).getAttribute("href"));
    if (id) return id;
  }
  throw new Error("No vendors available and cannot create a new one (usage limit reached)");
}

/** @deprecated Use ensureTestVendor */
export async function createVendorViaApi(page: Page, name: string, email: string) {
  return ensureTestVendor(page, name, email);
}

export async function captureApiMagicLink(
  page: Page,
  apiPath: string,
  trigger: () => Promise<void>
): Promise<string> {
  const responsePromise = page.waitForResponse(
    (res: Response) =>
      res.url().includes(apiPath) && res.request().method() === "POST" && res.ok()
  );
  await trigger();
  const response = await responsePromise;
  const json = await response.json();
  const url = json?.data?.magicLinkUrl as string | undefined;
  if (!url) {
    throw new Error(`No magicLinkUrl in ${apiPath} response: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return url;
}

export function futureDateInput(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}
