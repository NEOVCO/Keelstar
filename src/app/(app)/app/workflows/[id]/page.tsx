import { WorkflowDetailView } from "@/components/workflows/WorkflowDetailView";

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  return <WorkflowDetailView id={params.id} />;
}
