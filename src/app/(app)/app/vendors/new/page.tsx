import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { AddVendorsHub } from "@/components/vendors/AddVendorsHub";
import { DIRECTORY } from "@/lib/terminology/directory";

export default function NewVendorPage({
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
              { label: DIRECTORY.nav, href: "/app/vendors" },
              { label: DIRECTORY.addTitle },
            ]}
          />
        }
        title={DIRECTORY.addTitle}
        description={DIRECTORY.addDescription}
      />
      <div className="max-w-2xl">
        <AddVendorsHub initialMode={initialMode} />
      </div>
    </div>
  );
}
