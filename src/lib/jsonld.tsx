import { site } from "./site";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    sameAs: [] as string[],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.href}`,
    })),
  };
}

export function softwareApplicationLd(p: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: p.description,
    url: `${site.url}${p.path}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function articleLd(a: { title: string; description: string; path: string; updated: string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    dateModified: a.updated,
    author: { "@type": "Organization", name: a.author, url: site.url },
    mainEntityOfPage: `${site.url}${a.path}`,
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
