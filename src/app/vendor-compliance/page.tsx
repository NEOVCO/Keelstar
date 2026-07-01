import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { vendorCompliance } from "@/lib/seo-landing/vendor-compliance";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: vendorCompliance.metaTitle,
  description: vendorCompliance.metaDescription,
  path: vendorCompliance.path,
});

export default function Page() {
  return <SeoLandingLayout page={vendorCompliance} />;
}
