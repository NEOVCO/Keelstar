import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const sharedDisallow = ["/search/", "/search"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: sharedDisallow,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: sharedDisallow,
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url.replace(/^https?:\/\//, ""),
  };
}
