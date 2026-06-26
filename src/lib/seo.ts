import type { Metadata } from "next";
import { site } from "./site";

const defaultOgImage = "/opengraph-image";

type SeoArgs = {
  title: string; // visible title intent, "| Keelstar" appended unless already present
  description: string;
  path: string; // canonical path, e.g. "/products/w9-collector/"
  type?: "website" | "article";
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, type = "website", noindex }: SeoArgs): Metadata {
  const fullTitle = title.includes("Keelstar") ? title : `${title} | Keelstar`;
  const url = `${site.url}${path}`;
  const images = [{ url: defaultOgImage, width: 1200, height: 630, alt: `${site.name} — ${site.category}` }];

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: type === "article" ? "article" : "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage],
    },
  };
}

export function breadcrumbTrail(parts: { name: string; href: string }[]) {
  return parts;
}
