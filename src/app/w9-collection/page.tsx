import type { Metadata } from "next";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { w9Collection } from "@/lib/seo-landing/w9-collection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: w9Collection.metaTitle,
  description: w9Collection.metaDescription,
  path: w9Collection.path,
});

export default function W9CollectionPage() {
  return <SeoLandingLayout page={w9Collection} />;
}
