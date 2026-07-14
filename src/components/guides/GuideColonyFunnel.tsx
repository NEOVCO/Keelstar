import { getAnyColonyFunnelForGuide } from "@/lib/seo-colonies";
import { ColonyFunnelLinks } from "@/components/guides/ColonyFunnelLinks";

type Props = { slug: string };

export function GuideColonyFunnel({ slug }: Props) {
  const funnel = getAnyColonyFunnelForGuide(slug);
  if (!funnel) return null;
  return <ColonyFunnelLinks title={funnel.title} links={funnel.links} />;
}
