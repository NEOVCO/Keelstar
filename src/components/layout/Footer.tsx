import Link from "next/link";
import { footerGroups, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-text">
      <div className="container-x py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-7">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 font-semibold text-white">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="0.5" y="0.5" width="17" height="17" rx="4" stroke="#fff" opacity="0.6" />
                <path d="M4 9h10M9 4v10" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Keelstar
            </div>
            <p className="mt-3 max-w-[24ch] text-caption text-ink-text/70">{site.category}</p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-ink-text/60">{group.label}</p>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-body-sm text-ink-text/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-border pt-6 text-caption text-ink-text/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Keelstar. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
