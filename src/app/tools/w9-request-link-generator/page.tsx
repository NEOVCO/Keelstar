import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function W9RequestLinkGeneratorPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Free W-9 Request Link Generator</CardTitle>
          <CardDescription>
            Generate a secure W-9 request link without an account — coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body text-secondary">
            Sign up for Keelstar to collect W-9s with tracking, automated reminders,
            review workflows, and audit-ready evidence exports.
          </p>
          <div className="flex gap-3">
            <Link href="/signup">
              <Button>Start free</Button>
            </Link>
            <Link href="/w9">
              <Button variant="secondary">W-9 Collector</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
