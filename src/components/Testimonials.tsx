import { Container, Eyebrow } from "./ui";

type Quote = { quote: string; name: string; role: string; company: string; initials: string };

const quotes: Quote[] = [
  {
    quote:
      "We stopped chasing certificates over email. Keelstar tells us which vendor is about to lapse before it happens — and the audit trail is right there when our insurer asks.",
    name: "Marisol Reyes",
    role: "Director of Risk",
    company: "Northwind Facilities",
    initials: "MR",
  },
  {
    quote:
      "We turned on W-9 Collector in an afternoon, no implementation, no consultant. Adding contract renewals later was just one more module on the same login.",
    name: "David Chen",
    role: "Controller",
    company: "Harbor Logistics",
    initials: "DC",
  },
  {
    quote:
      "Exclusion screening used to be a spreadsheet someone forgot to update. Now it re-runs on a schedule and every check is dated. Audits are a non-event.",
    name: "Priya Nair",
    role: "Compliance Manager",
    company: "Linden Health",
    initials: "PN",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border bg-surface">
      <Container className="py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <Eyebrow className="mb-3">What teams say</Eyebrow>
          <h2 className="text-h2">Operators who replaced the spreadsheet</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="flex flex-col justify-between rounded-lg border border-border bg-surface p-7">
              <blockquote className="text-body text-primary">“{q.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle text-caption font-semibold text-accent">
                  {q.initials}
                </span>
                <span>
                  <span className="block text-body-sm font-semibold text-primary">{q.name}</span>
                  <span className="block text-caption text-secondary">
                    {q.role}, {q.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
