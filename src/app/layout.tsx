import type { Metadata } from "next";
import "../styles/globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd, organizationLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Keelstar — Operational workflows, without the enterprise suite.",
    template: "%s | Keelstar",
  },
  description: site.description,
  applicationName: "Keelstar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keelstar",
    title: "Keelstar — Operational Workflow Platform",
    description: site.description,
    url: site.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <JsonLd data={organizationLd()} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
