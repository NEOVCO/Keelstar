import { getDynamicSeoLandingSlugs } from "./data";

const staticSeoLandingPaths = [
  "/solutions/",
  "/vendor-portal/",
  "/vendor-compliance/",
  "/vendor-onboarding/",
  "/w9-collection/",
  "/certificate-of-insurance/",
  "/exclusion-monitoring/",
  "/tools/w9-request-generator/",
  "/tools/vendor-information-form-template/",
] as const;

/** SEO landing page paths for sitemap */
export const seoLandingSitemapPaths = [
  ...staticSeoLandingPaths,
  ...getDynamicSeoLandingSlugs().map((slug) => `/solutions/${slug}/`),
];
