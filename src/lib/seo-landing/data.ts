import { vendorPortal } from "./vendor-portal";
import { vendorCompliance } from "./vendor-compliance";
import { vendorOnboarding } from "./vendor-onboarding";
import { w9Collection } from "./w9-collection";
import { certificateOfInsurance } from "./certificate-of-insurance";
import { exclusionMonitoring } from "./exclusion-monitoring";

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
