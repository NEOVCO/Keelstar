import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        sunken: "var(--color-surface-sunken)",
        ink: "var(--color-ink)",
        "ink-text": "var(--color-ink-text)",
        "ink-border": "var(--color-ink-border)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-subtle": "var(--color-accent-subtle)",
        success: "var(--color-success)",
        "success-subtle": "var(--color-success-subtle)",
        warning: "var(--color-warning)",
        "warning-subtle": "var(--color-warning-subtle)",
        error: "var(--color-error)",
        "error-subtle": "var(--color-error-subtle)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      maxWidth: {
        container: "1200px",
        reading: "720px"
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px"
      },
      boxShadow: {
        sm: "0 1px 2px rgba(20,23,26,.05)",
        md: "0 6px 24px -8px rgba(20,23,26,.12)"
      },
      spacing: {
        18: "4.5rem",
        30: "7.5rem",
        40: "10rem"
      },
      fontSize: {
        overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" }],
        caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.005em" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        h4: ["1.125rem", { lineHeight: "1.35", letterSpacing: "-0.006em", fontWeight: "600" }],
        h3: ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        h2: ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.014em", fontWeight: "600" }],
        h1: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.018em", fontWeight: "600" }],
        display: ["3.25rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }]
      },
      transitionTimingFunction: {
        keel: "cubic-bezier(.2,.8,.2,1)"
      }
    }
  },
  plugins: []
};
export default config;
