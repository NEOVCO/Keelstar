import Link from "next/link";
import type { ColonyLink } from "@/lib/seo-colonies";

type Props = { links: ColonyLink[] };

export function ColonyFunnelLinks({ links }: Props) {
  if (!links.length) return null;

  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-caption font-semibold uppercase tracking-wide text-tertiary">OIG colony funnel</p>
      <ul className="mt-2 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-body-sm text-accent hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
