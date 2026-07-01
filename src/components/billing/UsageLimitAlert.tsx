"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UsageLimitAlert({
  message,
  href = "/app/settings/billing",
}: {
  message: string;
  href?: string;
}) {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
      <p className="text-body-sm font-medium text-primary">Plan limit reached</p>
      <p className="mt-1 text-body-sm text-secondary">{message}</p>
      <Link href={href} className="mt-3 inline-block">
        <Button size="sm" variant="secondary">
          View billing
        </Button>
      </Link>
    </div>
  );
}
