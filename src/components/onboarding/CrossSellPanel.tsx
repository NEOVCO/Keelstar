import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getModuleBySlug } from "@/lib/modules/modules";

export function CrossSellPanel({
  moduleSlug,
  title = "What to do next",
}: {
  moduleSlug: string;
  title?: string;
}) {
  const mod = getModuleBySlug(moduleSlug);
  if (!mod?.crossSell.length) return null;

  const suggestions = mod.crossSell
    .map((s) => getModuleBySlug(s))
    .filter(Boolean)
    .slice(0, 2);

  if (!suggestions.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-body font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-body-sm text-secondary">
          You finished a {mod.name} workflow. These related apps may help next.
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((m) => (
            <Link key={m!.id} href={m!.routes.app}>
              <Button variant="secondary" size="sm">
                {m!.name}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
