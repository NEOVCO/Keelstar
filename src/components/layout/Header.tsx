"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import {
  primaryNav,
  productsMenu,
  workflowsMenu,
  industriesMenu,
  resourcesMenu,
  site,
  appSignupUrl,
  appLoginUrl,
} from "@/lib/site";
import { SearchModal } from "./SearchModal";

const stageBlurb: Record<string, string> = {
  Collect: "Bring documents in.",
  Extract: "Read the details that matter.",
  Approve: "Route and sign off.",
  Monitor: "Watch for expirations.",
  Audit: "Keep the evidence.",
};

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/90 backdrop-blur ${scrolled ? "border-border" : "border-transparent"}`}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-1.5 focus:text-white"
      >
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-primary">
            <KeelMark />
            <span>Keelstar</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) =>
              "href" in item ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-sm px-3 py-2 text-body-sm font-medium text-secondary hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.key}
                  onMouseEnter={() => setOpenMenu(item.key)}
                  onFocus={() => setOpenMenu(item.key)}
                  onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                  aria-expanded={openMenu === item.key}
                  className={`flex items-center gap-1 rounded-sm px-3 py-2 text-body-sm font-medium ${
                    openMenu === item.key ? "text-primary" : "text-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="hidden items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1.5 text-body-sm text-tertiary hover:border-border-strong sm:flex"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span>Search</span>
            <kbd className="rounded border border-border bg-sunken px-1 text-caption">⌘K</kbd>
          </button>
          <Link href={appLoginUrl()} className="hidden rounded-sm px-3 py-2 text-body-sm font-medium text-secondary hover:text-primary md:block">
            Sign in
          </Link>
          <Link
            href={appSignupUrl()}
            className="hidden rounded-sm bg-accent px-4 py-2 text-body-sm font-semibold text-white hover:bg-accent-hover md:block"
          >
            Start free
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-sm border border-border p-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mega menus */}
      {openMenu === "products" && (
        <MegaWrap onClose={() => setOpenMenu(null)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 lg:grid-cols-5">
            {productsMenu.map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-caption uppercase tracking-wide text-tertiary">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block text-body-sm font-medium text-primary hover:text-accent">
                        {l.label}
                        {l.desc && <span className="block text-caption font-normal text-secondary">{l.desc}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </MegaWrap>
      )}

      {openMenu === "workflows" && (
        <MegaWrap onClose={() => setOpenMenu(null)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-5">
            {workflowsMenu.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-body-sm font-semibold text-primary">{group.label}</p>
                <p className="mb-3 text-caption text-tertiary">{stageBlurb[group.label]}</p>
                <ul className="space-y-2">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block text-body-sm text-secondary hover:text-accent">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <Link href="/workflows/" className="text-body-sm font-medium text-accent hover:underline">
              See all workflows →
            </Link>
          </div>
        </MegaWrap>
      )}

      {openMenu === "industries" && (
        <MegaWrap onClose={() => setOpenMenu(null)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3 lg:grid-cols-5">
            {industriesMenu.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-sm px-2 py-2 text-body-sm text-secondary hover:bg-sunken hover:text-accent">
                {l.label}
              </Link>
            ))}
          </div>
        </MegaWrap>
      )}

      {openMenu === "resources" && (
        <MegaWrap onClose={() => setOpenMenu(null)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3">
            {resourcesMenu.map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-caption uppercase tracking-wide text-tertiary">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block text-body-sm font-medium text-primary hover:text-accent">
                        {l.label}
                        {l.desc && <span className="block text-caption font-normal text-secondary">{l.desc}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </MegaWrap>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} onSearch={() => { setMobileOpen(false); setSearchOpen(true); }} />}
    </header>
  );
}

function MegaWrap({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 top-16 hidden border-b border-border bg-surface shadow-md lg:block" onMouseLeave={onClose}>
      <div className="container-x py-8">{children}</div>
    </div>
  );
}

function MobileNav({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  const groups = [
    { label: "Products", items: productsMenu.flatMap((g) => g.links) },
    { label: "Workflows", items: workflowsMenu.flatMap((g) => g.links) },
    { label: "Industries", items: industriesMenu },
    { label: "Resources", items: resourcesMenu.flatMap((g) => g.links) },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-bg lg:hidden">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <span className="font-semibold">Menu</span>
        <button onClick={onClose} aria-label="Close menu" className="rounded-sm border border-border p-2">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[calc(100vh-8rem)] overflow-y-auto px-5 py-4">
        <button onClick={onSearch} className="mb-4 flex w-full items-center gap-2 rounded-sm border border-border bg-surface px-3 py-2.5 text-secondary">
          <Search className="h-4 w-4" /> Search
        </button>
        <Link href="/pricing/" onClick={onClose} className="block border-b border-border py-3 font-medium">
          Pricing
        </Link>
        {groups.map((g) => (
          <details key={g.label} className="border-b border-border">
            <summary className="flex cursor-pointer items-center justify-between py-3 font-medium">
              {g.label}
              <ChevronDown className="h-4 w-4" />
            </summary>
            <ul className="pb-3">
              {g.items.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onClose} className="block py-1.5 text-body-sm text-secondary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 space-y-2 border-t border-border bg-surface p-4">
        <Link href={appSignupUrl()} className="block rounded-sm bg-accent py-2.5 text-center font-semibold text-white">
          Start free
        </Link>
        <Link href="/tools/" onClick={onClose} className="block rounded-sm border border-border-strong py-2.5 text-center font-medium">
          Try a free tool
        </Link>
      </div>
    </div>
  );
}

function KeelMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="17" height="17" rx="4" stroke="var(--color-accent)" />
      <path d="M4 9h10M9 4v10" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
