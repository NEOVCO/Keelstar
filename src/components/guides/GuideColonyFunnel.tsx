import { getColonyFunnelForGuide, isOigColonyGuide } from "@/lib/seo-colonies";
import { ColonyFunnelLinks } from "@/components/guides/ColonyFunnelLinks";

type Props = { slug: string };

export function GuideColonyFunnel({ slug }: Props) {
  if (!isOigColonyGuide(slug)) return null;
  return <ColonyFunnelLinks links={getColonyFunnelForGuide(slug)} />;
}
