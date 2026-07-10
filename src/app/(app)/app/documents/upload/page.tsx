import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDocumentForm } from "@/components/documents/UploadDocumentForm";

export default function UploadDocumentPage() {
  return (
    <div>
      <PageHeader
        title="Upload document"
        description="Store a file with version history and audit trail."
      />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>New document</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDocumentForm />
          <p className="mt-4 text-caption text-secondary">
            <Link href="/app/documents" className="text-accent hover:underline">
              Back to documents
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
