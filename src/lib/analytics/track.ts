type EventProperties = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: string, properties?: EventProperties): void {
  if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture: (e: string, p?: EventProperties) => void } }).posthog) {
    (window as unknown as { posthog: { capture: (e: string, p?: EventProperties) => void } }).posthog.capture(event, properties);
    return;
  }

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NODE_ENV === "production") {
    // Server-side PostHog can be wired later; safe no-op for MVP
  }
}
