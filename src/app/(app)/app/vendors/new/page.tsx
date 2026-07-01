import { Breadcrumbs, PageHeader } from "@/components/navigation/Breadcrumbs";
import { AddVendorForm } from "@/components/vendors/AddVendorForm";

export default function NewVendorPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Vendors", href: "/app/vendors" }, { label: "Add vendor" }]} />
        }
        title="Add vendor"
        description="Create a vendor to send W-9 requests and track documents."
      />
      <div className="max-w-md rounded-lg border border-border bg-surface p-6">
        <AddVendorForm redirectTo="/app/vendors" />
      </div>
    </div>
  );
}
