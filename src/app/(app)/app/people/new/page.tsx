import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { AddPeopleHub } from "@/components/people/AddPeopleHub";
import { PEOPLE } from "@/lib/terminology/people";

export default function NewPersonPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const initialMode = searchParams.mode === "import" ? "import" : "single";

  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: PEOPLE.nav, href: "/app/people" },
              { label: PEOPLE.addTitle },
            ]}
          />
        }
        title={PEOPLE.addTitle}
        description={PEOPLE.addDescription}
      />
      <div className="max-w-2xl">
        <AddPeopleHub initialMode={initialMode} />
      </div>
    </div>
  );
}
