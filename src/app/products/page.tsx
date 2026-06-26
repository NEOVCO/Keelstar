import type { Metadata } from "next";
import Link from "next/link";
import { Container, Card, Eyebrow } from "@/components/ui";
import { Breadcrumbs, WorkflowSpine } from "@/components/sections";
import { allProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

const clusters = ["Vendor Compliance", "Contract Operations", "HR Compliance", "Finance Operations", "Platform"] as const;

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description: "Every Keelstar application — focused tools for collecting, approving, monitoring, and auditing the documents that keep your business running.",
  path: "/products/",
});

export default function ProductsHub() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Products</Eyebrow>
        <h1 className="text-h1">One platform, many focused applications</h1>
        <p className="mt-4 text-body-lg text-secondary">
          Each application solves one recurring business problem extremely well — and shares the same audit logging,
          permissions, notifications, and exports.
        </p>
      </div>

      <div className="my-12">
        <WorkflowSpine />
      </div>

      <div className="space-y-12">
        {clusters.map((cluster) => (
          <div key={cluster}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-h4 text-primary">{cluster}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProducts
                .filter((p) => p.cluster === cluster)
                .map((p) => (
                  <Card key={p.slug} href={`/products/${p.slug}/`} title={p.name} desc={p.job} eyebrow={p.node} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
