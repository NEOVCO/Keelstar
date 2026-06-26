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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "Keelstar",
    locale: "en_US",
    title: "Keelstar — Operational Workflow Platform",
    description: site.description,
    url: site.url,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Keelstar — Operational Workflow Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keelstar — Operational Workflow Platform",
    description: site.description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  category: "business",
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
