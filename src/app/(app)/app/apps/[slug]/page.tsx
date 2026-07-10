import { notFound } from "next/navigation";
import { ModulePageShell } from "@/components/workflows/ModulePageShell";
import { CoiModulePage } from "@/components/coi/CoiModulePage";
import { W9ModulePage } from "@/components/w9/W9ModulePage";
import { ContractsModulePage } from "@/components/contracts/ContractsModulePage";
import { VendorPacketModulePage } from "@/components/vendor-packets/VendorPacketModulePage";
import { ExclusionsModulePage } from "@/components/exclusions/ExclusionsModulePage";
import { PolicyModulePage } from "@/components/policies/PolicyModulePage";
import { TrainingModulePage } from "@/components/training/TrainingModulePage";
import { InvoicesModulePage } from "@/components/invoices/InvoicesModulePage";
import { SignerModulePage } from "@/components/signer/SignerModulePage";
import { ContractRiskModulePage } from "@/components/contracts-risk/ContractRiskModulePage";
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
  if (params.slug === "w9") return <W9ModulePage />;
  if (params.slug === "contracts") return <ContractsModulePage />;
  if (params.slug === "vendor-packets") return <VendorPacketModulePage />;
  if (params.slug === "exclusions") return <ExclusionsModulePage />;
  if (params.slug === "policies") return <PolicyModulePage />;
  if (params.slug === "training") return <TrainingModulePage />;
  if (params.slug === "invoices") return <InvoicesModulePage />;
  if (params.slug === "signer") return <SignerModulePage />;
  if (params.slug === "contracts-risk") return <ContractRiskModulePage />;
  return <ModulePageShell module={mod} />;
}
