import { PolicyModulePage } from "@/components/policies/PolicyModulePage";

export default function PoliciesAppPage({
  searchParams,
}: {
  searchParams: { person?: string };
}) {
  return <PolicyModulePage defaultPersonId={searchParams.person} />;
}
