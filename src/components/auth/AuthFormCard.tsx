import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthFormCard({ title, description, children, className }: AuthFormCardProps) {
  return (
    <Card className={cn("border-border/80 shadow-md", className)}>
      <CardHeader className="space-y-1 pb-1">
        <CardTitle className="text-h3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}
