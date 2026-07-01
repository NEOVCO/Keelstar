import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Compliance summaries and export entry points." />
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Vendor compliance matrix", desc: "W-9, COI, and packet status by vendor." },
          { title: "Training matrix", desc: "Certifications and expiration by person." },
          { title: "Audit export", desc: "Filtered audit log CSV for date range." },
          { title: "Evidence packets", desc: "Workflow and vendor evidence bundles." },
        ].map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle className="text-body font-medium">{r.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-body-sm text-secondary">{r.desc}</p>
              <Button variant="secondary" size="sm">
                Export
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* TODO(backend): Wire report generation */}
    </div>
  );
}
