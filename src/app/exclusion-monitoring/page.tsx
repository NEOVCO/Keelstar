import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { exclusionMonitoring } from "@/lib/seo-landing/exclusion-monitoring";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: exclusionMonitoring.metaTitle,
  description: exclusionMonitoring.metaDescription,
  path: exclusionMonitoring.path,
});

export default function Page() {
  return <SeoLandingLayout page={exclusionMonitoring} />;
}
