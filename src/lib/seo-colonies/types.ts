export type ColonyTier = "glossary" | "guide" | "industry" | "solution" | "hub" | "product" | "tool";

export type ColonyDifficulty = "easy" | "medium" | "hard";

/** One URL in a topic colony with its keyword target and link-up targets. */
export type ColonyPage = {
  tier: ColonyTier;
  path: string;
  slug: string;
  title: string;
  primaryKeyword: string;
  difficulty: ColonyDifficulty;
  /** Canonical paths this page should link to (internal links — not redirects). */
  linkUp: string[];
  /** Sibling colony pages for lateral authority. */
  linkSideways?: string[];
};

export type ColonyDefinition = {
  id: string;
  name: string;
  headHub: string;
  headSolution: string;
  headProduct: string;
  headTool?: string;
  pages: ColonyPage[];
};

export type ColonyLink = { label: string; href: string };
