import Link from "next/link";
import type { ReactNode } from "react";
import {
  Inbox,
  ScanLine,
  CheckCircle2,
  BellRing,
  ShieldCheck,
  History,
  Users,
  Download,
  Bell,
  Layers,
  Lock,
  Zap,
} from "lucide-react";
import { Container, Eyebrow, Button } from "./ui";

/* ----------------------------- Breadcrumbs ----------------------------- */
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-secondary">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-tertiary">/</span>}
            {i === items.length - 1 ? (
              <span className="text-tertiary" aria-current="page">
                {it.name}
              </span>
            ) : (
              <Link href={it.href} className="hover:text-accent">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ----------------------------- Workflow Spine ----------------------------- */
const SPINE = [
  { key: "Collect", icon: Inbox, role: "Bring documents in" },
  { key: "Extract", icon: ScanLine, role: "Read the details" },
  { key: "Approve", icon: CheckCircle2, role: "Route and sign off" },
  { key: "Monitor", icon: BellRing, role: "Watch for expirations" },
  { key: "Audit", icon: ShieldCheck, role: "Keep the evidence" },
] as const;

const stageHref: Record<string, string> = {
  Collect: "/workflows/collect-w9s/",
  Extract: "/workflows/review-acord-certificates/",
  Approve: "/workflows/route-invoice-approvals/",
  Monitor: "/workflows/track-coi-expirations/",
  Audit: "/workflows/build-audit-trails/",
};

export function WorkflowSpine({ highlight }: { highlight?: string }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-0">
        {SPINE.map((node, i) => {
          const Icon = node.icon;
          const active = highlight === node.key;
          return (
            <div key={node.key} className="relative flex sm:flex-col sm:items-center sm:text-center">
              {/* connector line */}
              {i < SPINE.length - 1 && (
                <span className="absolute left-5 top-10 hidden h-[calc(100%-2.5rem)] w-px bg-border sm:left-1/2 sm:top-5 sm:h-px sm:w-full" aria-hidden />
              )}
              <Link
                href={stageHref[node.key]}
                className="relative z-10 flex items-start gap-3 sm:flex-col sm:items-center"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                    active ? "border-accent bg-accent text-white" : "border-border bg-surface text-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="sm:mt-3">
                  <span className={`block text-body-sm font-semibold ${active ? "text-accent" : "text-primary"}`}>
                    {node.key}
                  </span>
                  <span className="block text-caption text-secondary">{node.role}</span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- Trust Callouts ----------------------------- */
const TRUST = [
  { icon: ShieldCheck, label: "Audit trails", desc: "Every action recorded with an actor and timestamp." },
  { icon: History, label: "Version history", desc: "Every version of every document, kept and comparable." },
  { icon: Users, label: "Role-based permissions", desc: "Access is one decision, applied across workflows." },
  { icon: Download, label: "Exports", desc: "Hand any record or its history to finance or an auditor." },
  { icon: Bell, label: "Notifications", desc: "Reminders that fire before deadlines, not after." },
  { icon: Layers, label: "Shared platform", desc: "One foundation for every application you add." },
  { icon: Lock, label: "Security & privacy", desc: "Security documentation available on request." },
  { icon: Zap, label: "Fast self-serve setup", desc: "Live the same day. No consultants, no project." },
];

export function TrustCallouts() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {TRUST.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.label} className="bg-surface p-6">
            <Icon className="h-5 w-5 text-accent" aria-hidden />
            <p className="mt-3 text-body-sm font-semibold text-primary">{t.label}</p>
            <p className="mt-1 text-caption text-secondary">{t.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- CTA Band ----------------------------- */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  tone = "ink",
}: {
  title: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "ink" | "sunken";
}) {
  const isInk = tone === "ink";
  return (
    <section className={isInk ? "bg-ink" : "bg-sunken"}>
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-h2 ${isInk ? "text-white" : "text-primary"}`}>{title}</h2>
          {body && <p className={`mt-4 text-body-lg ${isInk ? "text-ink-text/80" : "text-secondary"}`}>{body}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={primary.href} size="lg">
              {primary.label}
            </Button>
            {secondary &&
              (isInk ? (
                <Link
                  href={secondary.href}
                  className="inline-flex h-11 items-center rounded-sm border border-ink-border px-5 text-body font-semibold text-white hover:bg-white/5"
                >
                  {secondary.label}
                </Link>
              ) : (
                <Button href={secondary.href} variant="secondary" size="lg">
                  {secondary.label}
                </Button>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------- Section wrapper ----------------------------- */
export function Section({
  children,
  className,
  tone = "bg",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "bg" | "surface" | "sunken";
  id?: string;
}) {
  const bg = tone === "surface" ? "bg-surface" : tone === "sunken" ? "bg-sunken" : "bg-bg";
  return (
    <section id={id} className={`${bg} ${className ?? ""}`}>
      <Container className="py-16 sm:py-24">{children}</Container>
    </section>
  );
}

/* ----------------------------- Related links grid ----------------------------- */
export function RelatedGrid({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; desc?: string }[];
}) {
  if (!links.length) return null;
  return (
    <div>
      <Eyebrow className="mb-4">{title}</Eyebrow>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex items-baseline justify-between gap-3 border-b border-border py-2.5">
              <span className="text-body-sm font-medium text-primary group-hover:text-accent">{l.label}</span>
              <span className="text-caption text-tertiary group-hover:text-accent">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Figure placeholder ----------------------------- */
export function FigureFrame({ label, caption }: { label: string; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-1.5 border-b border-border bg-sunken px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="ml-2 font-mono text-caption text-tertiary">{label}</span>
      </div>
      <div className="grid min-h-[220px] place-items-center bg-[repeating-linear-gradient(45deg,transparent,transparent_11px,rgba(31,58,95,0.03)_11px,rgba(31,58,95,0.03)_12px)] p-8">
        <p className="max-w-sm text-center text-caption text-tertiary">{caption ?? "Product UI"}</p>
      </div>
    </figure>
  );
}
