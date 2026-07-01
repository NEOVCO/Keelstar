"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const APP_ROUTE_PREFIXES = [
  "/app",
  "/dashboard",
  "/documents",
  "/workflows",
  "/tasks",
  "/monitors",
  "/audit",
  "/settings",
  "/billing",
  "/vendors",
  "/requests",
  "/w9",
  "/coi",
  "/contracts",
  "/exclusions",
  "/vendor-packets",
  "/policies",
  "/training",
  "/invoices",
  "/signer",
];

function isAppRoute(pathname: string): boolean {
  if (pathname === "/app" || pathname.startsWith("/app/")) return true;
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding")
  );
}

function isExternalRoute(pathname: string): boolean {
  return pathname.startsWith("/external");
}

export function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  if (isAppRoute(pathname) || isAuthRoute(pathname) || isExternalRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
