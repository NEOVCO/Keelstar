import Link from "next/link";
import { FileText, CalendarClock, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

const features = [
  {
    icon: FileText,
    text: "Collect W-9s, COIs, and vendor documents without email chains",
  },
  {
    icon: CalendarClock,
    text: "Monitor expirations and renewals before they become problems",
  },
  {
    icon: ShieldCheck,
    text: "Audit-ready evidence trails for every workflow",
  },
] as const;

function KeelMark({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <rect x="0.5" y="0.5" width="17" height="17" rx="4" stroke="currentColor" />
      <path d="M4 9h10M9 4v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-10 py-10 text-ink-text lg:flex lg:w-1/2 xl:px-14 xl:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(31,58,95,0.45),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "url('/hero-texture.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight text-white">
          <KeelMark />
          <span>{site.name}</span>
        </Link>
      </div>

      <div className="relative max-w-lg">
        <h1 className="text-balance text-h1 text-white xl:text-display">
          Operational workflows, without the enterprise suite.
        </h1>
        <p className="mt-5 text-body-lg text-ink-text/90">
          Collect, approve, monitor, and audit the documents that keep your business running — from W-9s and
          certificates of insurance to contracts and policy acknowledgments.
        </p>
        <ul className="mt-10 space-y-5">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-body text-ink-text/95">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-caption text-ink-text/50">
        {site.category} ·{" "}
        <a href={`mailto:${site.contactEmail}`} className="hover:text-ink-text/80">
          {site.contactEmail}
        </a>
      </p>
    </div>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2.5 border-b border-border px-6 py-4 lg:hidden">
          <KeelMark className="text-accent" />
          <span className="font-semibold tracking-tight text-primary">{site.name}</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-bg px-6 py-10 sm:px-10">
          <div className="w-full max-w-lg">{children}</div>
          <p className="mt-8 text-caption text-tertiary">
            {site.category} ·{" "}
            <a href={`mailto:${site.contactEmail}`} className="hover:text-secondary">
              {site.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
