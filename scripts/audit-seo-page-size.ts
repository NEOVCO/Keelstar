#!/usr/bin/env tsx
/**
 * Estimate SEO landing page HTML payload sizes (text content + layout overhead).
 * Flags pages exceeding 2MB.
 */
import type { SeoLandingPageData } from "../src/lib/seo-landing/types";
import { seoLandingPages, dynamicSeoLandingPages } from "../src/lib/seo-landing/data";

const LAYOUT_OVERHEAD_BYTES = 15 * 1024;
const LIMIT_BYTES = 2 * 1024 * 1024;

function collectPageText(page: SeoLandingPageData): string {
  const parts: string[] = [
    page.metaTitle,
    page.metaDescription,
    page.breadcrumb,
    page.eyebrow ?? "",
    page.h1,
    page.hero,
    page.problemTitle,
    page.problem,
    ...(page.problemBullets ?? []),
    page.howTitle,
    ...page.how.flatMap((step) => [step.title, step.body]),
    page.benefitsTitle,
    ...page.benefits,
    ...(page.sections ?? []).flatMap((section) => [
      section.title,
      section.eyebrow ?? "",
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
    page.whoItsFor?.title ?? "",
    ...(page.whoItsFor?.items ?? []),
    page.checklist?.title ?? "",
    ...(page.checklist?.items ?? []),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.ctaTitle,
    page.ctaBody,
    ...(page.relatedLinks ?? []).map((link) => link.label),
    ...(page.solutionLinks ?? []).map((link) => link.label),
  ];
  return parts.join("\n");
}

function estimatePayloadBytes(page: SeoLandingPageData): number {
  return Buffer.byteLength(collectPageText(page), "utf8") + LAYOUT_OVERHEAD_BYTES;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

type PageRow = { path: string; textBytes: number; totalBytes: number };

function main() {
  const pages: PageRow[] = [];

  for (const page of Object.values(seoLandingPages)) {
    const textBytes = Buffer.byteLength(collectPageText(page), "utf8");
    pages.push({ path: page.path, textBytes, totalBytes: textBytes + LAYOUT_OVERHEAD_BYTES });
  }

  for (const page of Object.values(dynamicSeoLandingPages)) {
    const textBytes = Buffer.byteLength(collectPageText(page), "utf8");
    pages.push({ path: page.path, textBytes, totalBytes: textBytes + LAYOUT_OVERHEAD_BYTES });
  }

  pages.sort((a, b) => b.totalBytes - a.totalBytes);

  const overLimit = pages.filter((p) => p.totalBytes > LIMIT_BYTES);
  const max = pages[0];

  console.log(`SEO page size audit (${pages.length} pages)`);
  console.log(`Layout overhead: ${formatBytes(LAYOUT_OVERHEAD_BYTES)}`);
  console.log(`Limit: ${formatBytes(LIMIT_BYTES)}`);
  console.log(`Max: ${max.path} — ${formatBytes(max.totalBytes)} (text ${formatBytes(max.textBytes)})`);
  console.log(`Over limit: ${overLimit.length}`);
  console.log("");

  const colPath = Math.max(8, ...pages.map((p) => p.path.length));
  console.log(
    `${"Path".padEnd(colPath)}  ${"Text".padStart(10)}  ${"Total".padStart(10)}  Flag`,
  );
  console.log(`${"-".repeat(colPath)}  ${"-".repeat(10)}  ${"-".repeat(10)}  ----`);

  for (const row of pages) {
    const flag = row.totalBytes > LIMIT_BYTES ? "OVER" : "";
    console.log(
      `${row.path.padEnd(colPath)}  ${formatBytes(row.textBytes).padStart(10)}  ${formatBytes(row.totalBytes).padStart(10)}  ${flag}`,
    );
  }

  if (overLimit.length > 0) {
    process.exitCode = 1;
  }
}

main();
