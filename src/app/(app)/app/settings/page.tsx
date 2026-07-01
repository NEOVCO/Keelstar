import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestartTourButton } from "@/components/onboarding";

const LINKS = [
  { href: "/app/settings/members", title: "Members", desc: "Invite teammates and manage roles." },
  { href: "/app/settings/billing", title: "Billing", desc: "Plan, usage, and upgrade." },
  { href: "/app/settings/security", title: "Security", desc: "Sessions and security preferences." },
  { href: "/app/settings/integrations", title: "Integrations", desc: "Email, storage, and third-party connections." },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Organization preferences and administration." />
      <div className="grid gap-4 sm:grid-cols-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="h-full transition-shadow hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-body font-medium">{l.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-secondary">{l.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-body font-medium">Help</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-secondary">
            New to Keelstar? Replay the guided tour of the main workspace areas.
          </p>
          <RestartTourButton />
        </CardContent>
      </Card>
    </div>
  );
}
