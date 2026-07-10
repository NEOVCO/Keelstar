import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingLayout } from "@/components/seo-landing/SeoLandingLayout";
import { getDynamicSeoLandingPage, getDynamicSeoLandingSlugs } from "@/lib/seo-landing/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getDynamicSeoLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getDynamicSeoLandingPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
  });
}

export default async function SolutionsSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = getDynamicSeoLandingPage(slug);
  if (!page) notFound();
  return <SeoLandingLayout page={page} />;
}
