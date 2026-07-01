import { notFound } from "next/navigation";
import { ModulePageShell } from "@/components/workflows/ModulePageShell";
import { CoiModulePage } from "@/components/coi/CoiModulePage";
import { ContractsModulePage } from "@/components/contracts/ContractsModulePage";
import { VendorPacketModulePage } from "@/components/vendor-packets/VendorPacketModulePage";
import { ExclusionsModulePage } from "@/components/exclusions/ExclusionsModulePage";
import { getModuleBySlug, MODULES } from "@/lib/modules/modules";

export function generateStaticParams() {
  return MODULES.filter((m) => m.status !== "coming_soon").map((m) => ({
    slug: m.slug,
  }));
}

export default function ModuleAppPage({ params }: { params: { slug: string } }) {
  const mod = getModuleBySlug(params.slug);
  if (!mod) notFound();
  if (params.slug === "coi") return <CoiModulePage />;
  if (params.slug === "contracts") return <ContractsModulePage />;
  if (params.slug === "vendor-packets") return <VendorPacketModulePage />;
  if (params.slug === "exclusions") return <ExclusionsModulePage />;
  return <ModulePageShell module={mod} />;
}
