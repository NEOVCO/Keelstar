"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function VendorMagicLinkPanel({ url }: { url: string | null }) {
  const [copied, setCopied] = useState(false);

  if (!url) return null;

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-sunken/50 p-4">
      <p className="text-body-sm font-medium text-primary">Vendor upload link</p>
      <p className="mt-1 text-caption text-secondary">
        Share this secure link if email delivery fails or for local testing.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 truncate rounded-md border border-border bg-surface px-2 py-1.5 text-caption text-primary">
          {url}
        </code>
        <Button type="button" variant="secondary" size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy link"}
        </Button>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="ghost" size="sm">
            Open
          </Button>
        </a>
      </div>
    </div>
  );
}
