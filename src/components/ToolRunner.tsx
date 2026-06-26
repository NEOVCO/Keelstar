"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, Search, ArrowRight, CheckCircle2 } from "lucide-react";

type Props = {
  name: string;
  inputKind: "paste" | "upload" | "search" | "form";
  inputLabel: string;
  productSlug: string;
  productName: string;
};

export function ToolRunner({ name, inputKind, inputLabel, productSlug, productName }: Props) {
  const [done, setDone] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      {!done ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="mb-2 block text-caption font-medium text-secondary">{inputLabel}</label>
          {inputKind === "upload" ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-sunken px-6 py-10 text-center">
              <Upload className="h-6 w-6 text-tertiary" aria-hidden />
              <span className="text-body-sm text-secondary">Drop a file here, or click to upload</span>
              <input type="file" className="hidden" onChange={() => setValue("file")} />
            </label>
          ) : inputKind === "search" ? (
            <div className="flex items-center gap-2 rounded-md border border-border-strong bg-bg px-3">
              <Search className="h-4 w-4 text-tertiary" aria-hidden />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type a name to screen"
                className="h-11 w-full bg-transparent outline-none"
              />
            </div>
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the details here…"
              className="min-h-[120px] w-full rounded-md border border-border-strong bg-bg p-3 outline-none focus:border-accent"
            />
          )}
          <button
            type="submit"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 font-semibold text-white hover:bg-accent-hover"
          >
            Run {name} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-caption text-tertiary">
            This runs as a one-time preview. Nothing is saved to an account until you choose to monitor it.
          </p>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
            <span className="text-body-sm font-semibold">Done — here&apos;s your result</span>
          </div>
          <div className="mt-4 rounded-md border border-border bg-sunken p-4">
            <p className="font-mono text-caption text-secondary">
              {name} produced a one-time result. In the live tool this is where your extracted fields, search matches,
              or generated document would appear.
            </p>
          </div>
          <div className="mt-5 rounded-md border border-accent-subtle bg-accent-subtle p-4">
            <p className="text-body-sm font-semibold text-primary">Monitor this continuously</p>
            <p className="mt-1 text-caption text-secondary">
              Keep this tracked, get reminders before anything changes, and keep an audit trail with {productName}.
            </p>
            <Link
              href={`/products/${productSlug}/`}
              className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent hover:underline"
            >
              Set up monitoring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <button onClick={() => setDone(false)} className="mt-4 text-caption text-tertiary hover:text-primary">
            ← Run again
          </button>
        </div>
      )}
    </div>
  );
}
