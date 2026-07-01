import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { certificateOfInsurance } from "@/lib/seo-landing/certificate-of-insurance";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: certificateOfInsurance.metaTitle,
  description: certificateOfInsurance.metaDescription,
  path: certificateOfInsurance.path,
});

export default function Page() {
  return <SeoLandingLayout page={certificateOfInsurance} />;
}
