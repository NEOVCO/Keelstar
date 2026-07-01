import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { vendorOnboarding } from "@/lib/seo-landing/vendor-onboarding";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Onboarding",
  description: vendorOnboarding.metaDescription,
  path: "/vendor-onboarding/",
});

export default function Page() {
  return <SeoLandingLayout page={vendorOnboarding} />;
}
