"use client";

import { useState } from "react";
import Link from "next/link";
import { appSignupUrl } from "@/lib/site";

export function W9RequestGenerator() {
  const [company, setCompany] = useState("");
  const [vendor, setVendor] = useState("");
  const [copied, setCopied] = useState(false);

  const email = `Subject: W-9 request from ${company || "[Your company]"}

Hello ${vendor || "[Vendor name]"},

Please complete and return IRS Form W-9 so we can process payment. Use the secure link below:

[Your Keelstar request link]

If you have questions, reply to this email.

Thank you,
${company || "[Your company]"} Accounts Payable`;

  async function copy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-caption font-medium text-secondary">Company name</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-caption font-medium text-secondary">Vendor name</label>
          <input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
          />
        </div>
      </div>
      <pre className="mt-6 max-h-56 overflow-auto rounded-md border border-border bg-sunken p-4 text-caption text-secondary whitespace-pre-wrap">
        {email}
      </pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 items-center rounded-sm bg-accent px-4 text-body-sm font-semibold text-white hover:bg-accent-hover"
        >
          {copied ? "Copied" : "Copy email"}
        </button>
        <Link
          href={appSignupUrl()}
          className="inline-flex h-10 items-center rounded-sm border border-border-strong px-4 text-body-sm font-semibold text-primary hover:bg-sunken"
        >
          Create free workspace
        </Link>
      </div>
    </div>
  );
}
