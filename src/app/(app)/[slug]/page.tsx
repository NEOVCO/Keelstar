import { getModuleBySlug } from "@/lib/modules/modules";
import { ModulePageShell } from "@/components/workflows/ModulePageShell";
import { notFound } from "next/navigation";

const SLUGS = [
  "w9", "coi", "contracts", "exclusions", "vendor-packets",
  "policies", "training", "invoices", "signer",
] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default function ModulePage({ params }: { params: { slug: string } }) {
  const mod = getModuleBySlug(params.slug);
  if (!mod) notFound();
  return <ModulePageShell module={mod} />;
}
