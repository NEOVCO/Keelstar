import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { SearchResults } from "@/components/SearchResults";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Search", description: "Search Keelstar products, workflows, tools, guides, templates, glossary, and docs.", path: "/search/" }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Search", href: "/search/" }]} />
      <Eyebrow className="mb-3">Search</Eyebrow>
      <h1 className="text-h1">Search Keelstar</h1>
      <div className="mt-8 max-w-2xl">
        <SearchResults />
      </div>
    </Container>
  );
}
