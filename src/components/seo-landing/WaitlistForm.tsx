"use client";

import { useState } from "react";
import { appSignupUrl } from "@/lib/site";
import Link from "next/link";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="max-w-md rounded-lg border border-border bg-surface p-6">
      {done ? (
        <p className="text-body-sm text-secondary">Thanks. We will notify you when exclusion monitoring is available.</p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor="waitlist-email" className="block text-caption font-medium text-secondary">
            Work email
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
            placeholder="you@company.com"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-sm bg-accent px-4 text-body-sm font-semibold text-white hover:bg-accent-hover"
          >
            Join waitlist
          </button>
        </form>
      )}
      <p className="mt-4 text-caption text-tertiary">
        <Link href={appSignupUrl()} className="text-accent hover:underline">
          Create a free workspace
        </Link>{" "}
        for W-9 and certificate tracking today.
      </p>
    </div>
  );
}
