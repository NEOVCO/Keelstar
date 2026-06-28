import { Container } from "./ui";

// Illustrative wordmarks — replace with real customer logos when available.
const companies = ["Northwind", "Harbor Logistics", "Cedar Mechanical", "Vertex Group", "Linden Health", "Atlas Facilities"];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-caption font-semibold uppercase tracking-wide text-tertiary">
            Trusted by 650+ companies to keep their documents in order
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {companies.map((c) => (
              <span
                key={c}
                className="text-body font-semibold tracking-tight text-tertiary/80 grayscale transition-colors hover:text-secondary"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
