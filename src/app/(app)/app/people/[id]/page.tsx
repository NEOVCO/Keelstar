import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectMetadataGrid } from "@/components/objects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PEOPLE } from "@/lib/mock-data";

export default function PersonDetailPage({ params }: { params: { id: string } }) {
  const person = MOCK_PEOPLE.find((p) => p.id === params.id);
  if (!person) notFound();

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "People", href: "/app/people" }, { label: person.name }]} />
        }
        title={person.name}
        status={person.type}
        owner={person.owner.name}
      />
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjectMetadataGrid
            items={[
              { label: "Email", value: person.email },
              { label: "Type", value: person.type },
              { label: "Pending tasks", value: person.pendingTasks },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
