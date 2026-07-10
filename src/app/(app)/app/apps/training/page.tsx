import { TrainingModulePage } from "@/components/training/TrainingModulePage";

export default function TrainingAppPage({
  searchParams,
}: {
  searchParams: { person?: string };
}) {
  return <TrainingModulePage defaultPersonId={searchParams.person} />;
}
