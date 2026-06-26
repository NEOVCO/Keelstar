import { Container, Eyebrow, Card } from "./ui";
import { Breadcrumbs } from "./sections";

export type HubItem = { title: string; href: string; desc?: string; eyebrow?: string };

export function Hub({
  crumbLabel,
  crumbHref,
  eyebrow,
  title,
  intro,
  items,
  children,
}: {
  crumbLabel: string;
  crumbHref: string;
  eyebrow: string;
  title: string;
  intro: string;
  items?: HubItem[];
  children?: React.ReactNode;
}) {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: crumbLabel, href: crumbHref }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <h1 className="text-h1">{title}</h1>
        <p className="mt-4 text-body-lg text-secondary">{intro}</p>
      </div>
      {children}
      {items && (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.href} href={it.href} title={it.title} desc={it.desc} eyebrow={it.eyebrow} />
          ))}
        </div>
      )}
    </Container>
  );
}
