import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { vendorPortal } from "@/lib/seo-landing/vendor-portal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Portal",
  description: vendorPortal.metaDescription,
  path: "/vendor-portal/",
});

export default function Page() {
  return <SeoLandingLayout page={vendorPortal} />;
}
