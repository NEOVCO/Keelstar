import { allProducts } from "./products";
import { workflows, industries } from "./content";
import { tools } from "./tools";
import { glossary, compares, templates } from "./library";
import { guides } from "./guides";

export type SearchType =
  | "Product"
  | "Workflow"
  | "Industry"
  | "Tool"
  | "Guide"
  | "Template"
  | "Glossary"
  | "Comparison";

export type SearchItem = {
  title: string;
  href: string;
  type: SearchType;
  desc?: string;
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const p of allProducts) items.push({ title: p.name, href: `/products/${p.slug}/`, type: "Product", desc: p.job });
  for (const w of workflows) items.push({ title: w.title, href: `/workflows/${w.slug}/`, type: "Workflow", desc: w.summary });
  for (const i of industries) items.push({ title: i.name, href: `/industries/${i.slug}/`, type: "Industry", desc: i.headline });
  for (const t of tools) items.push({ title: t.name, href: `/tools/${t.slug}/`, type: "Tool", desc: t.outcome });
  for (const gu of guides) items.push({ title: gu.title, href: `/guides/${gu.slug}/`, type: "Guide", desc: gu.summary });
  for (const tp of templates) items.push({ title: tp.name, href: `/templates/${tp.slug}/`, type: "Template", desc: tp.forWhat });
  for (const g of glossary) items.push({ title: g.term, href: `/glossary/${g.slug}/`, type: "Glossary", desc: g.definition });
  for (const c of compares) items.push({ title: c.title, href: `/compare/${c.slug}/`, type: "Comparison" });
  return items;
}
