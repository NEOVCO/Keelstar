import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/cn";
import { getExclusionDataMode } from "@/lib/exclusions/constants";

type LatestResult = {
  id: string;
  result_status: string;
  review_status: string;
  created_at: string;
  source: string;
} | null;

export function ExclusionScreeningCard({
  vendorId,
  vendorName,
  latestResult,
  canRun,
}: {
  vendorId: string;
  vendorName: string;
  latestResult: LatestResult;
  canRun: boolean;
}) {
  const dataMode = getExclusionDataMode();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exclusion screening</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-body-sm">
        <p className="text-caption text-secondary">
          {dataMode === "demo" ? "Demo data mode" : "Live mode"} — results require compliance review.
        </p>
        {latestResult ? (
          <>
            <p>
              <span className="text-secondary">Last checked:</span> {formatDate(latestResult.created_at)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-secondary">Result:</span>
              <StatusBadge status={latestResult.result_status} />
              <StatusBadge status={latestResult.review_status} />
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link href={`/app/exclusions/results/${latestResult.id}`}>View result</Link>
            </Button>
          </>
        ) : (
          <p className="text-secondary">No exclusion screening yet.</p>
        )}
        {canRun && (
          <Button asChild size="sm">
            <Link href={`/app/apps/exclusions?vendor=${vendorId}&name=${encodeURIComponent(vendorName)}`}>
              Run check
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
