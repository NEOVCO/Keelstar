import type { Metadata } from "next";
import { site } from "./site";

type SeoArgs = {
  title: string; // visible title intent, "| Keelstar" appended unless already present
  description: string;
  path: string; // canonical path, e.g. "/products/w9-collector/"
  type?: "website" | "article";
  noindex?: boolean;
  ogType?: string; // page type for OG image generation
};

export function pageMetadata({ title, description, path, type = "website", noindex }: SeoArgs): Metadata {
  const fullTitle = title.includes("Keelstar") ? title : `${title} | Keelstar`;
  const url = `${site.url}${path}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type: type === "article" ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function breadcrumbTrail(parts: { name: string; href: string }[]) {
  return parts;
}
