import Script from "next/script";
import { site } from "@/lib/site";

export function GoogleAnalytics() {
  if (!site.googleAnalyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${site.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
}
