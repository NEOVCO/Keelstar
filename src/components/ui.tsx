import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-overline uppercase text-secondary", className)}>{children}</p>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "md" | "lg";
  className?: string;
};

export function Button({ href, children, variant = "primary", size = "md", className }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-100 ease-keel focus-visible:outline-2";
  const sizes = size === "lg" ? "h-11 px-5 text-body" : "h-10 px-4 text-body-sm";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    secondary: "bg-surface text-primary border border-border-strong hover:bg-sunken",
    tertiary: "text-accent hover:underline underline-offset-2 px-0",
  }[variant];
  const isExternal = href.startsWith("http");
  const cls = cn(base, variant === "tertiary" ? "" : sizes, variants, className);
  if (isExternal) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "success" | "warning" | "error" }) {
  const tones = {
    neutral: "bg-sunken text-secondary border-border",
    accent: "bg-accent-subtle text-accent border-accent-subtle",
    success: "bg-success-subtle text-success border-success-subtle",
    warning: "bg-warning-subtle text-warning border-warning-subtle",
    error: "bg-error-subtle text-error border-error-subtle",
  }[tone];
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-caption font-medium", tones)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-h2">{title}</h2>
      {intro && <p className="mt-4 text-body-lg text-secondary">{intro}</p>}
    </div>
  );
}

export function Card({
  href,
  title,
  desc,
  eyebrow,
  footer,
  icon,
  className,
}: {
  href?: string;
  title: string;
  desc?: string;
  eyebrow?: string;
  footer?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const inner = (
    <div
      className={cn(
        "group flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-all duration-100 ease-keel",
        href && "hover:border-border-strong hover:shadow-sm",
        className
      )}
    >
      {icon && <div className="mb-4 text-accent">{icon}</div>}
      {eyebrow && <p className="mb-2 text-caption font-medium uppercase tracking-wide text-tertiary">{eyebrow}</p>}
      <h3 className="text-h4 text-primary">{title}</h3>
      {desc && <p className="mt-2 text-body-sm text-secondary">{desc}</p>}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-2">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function KeelLine({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}
