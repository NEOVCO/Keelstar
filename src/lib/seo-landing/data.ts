import { vendorPortal } from "./vendor-portal";
import { vendorCompliance } from "./vendor-compliance";
import { vendorOnboarding } from "./vendor-onboarding";
import { w9Collection } from "./w9-collection";
import { certificateOfInsurance } from "./certificate-of-insurance";
import { exclusionMonitoring } from "./exclusion-monitoring";
import { buildPagesFromSpecs } from "./create-page";
import { allSeoPageSpecs } from "./clusters";

export const seoLandingPages = {
  "vendor-portal": vendorPortal,
  "vendor-compliance": vendorCompliance,
  "vendor-onboarding": vendorOnboarding,
  "w9-collection": w9Collection,
  "certificate-of-insurance": certificateOfInsurance,
  "exclusion-monitoring": exclusionMonitoring,
};

export function getSeoLandingPage(slug: string) {
  return seoLandingPages[slug as keyof typeof seoLandingPages];
}

/** Slugs served by dedicated app routes — excluded from [slug] dynamic pages */
export const RESERVED_SLUGS = new Set<string>([
  "vendor-portal",
  "vendor-compliance",
  "vendor-onboarding",
  "w9-collection",
  "certificate-of-insurance",
  "exclusion-monitoring",
]);

const dynamicSpecs = allSeoPageSpecs.filter((spec) => !RESERVED_SLUGS.has(spec.slug));

export const dynamicSeoLandingPages = buildPagesFromSpecs(dynamicSpecs);

export function getDynamicSeoLandingPage(slug: string) {
  return dynamicSeoLandingPages[slug];
}

export function getDynamicSeoLandingSlugs(): string[] {
  return Object.keys(dynamicSeoLandingPages);
}
