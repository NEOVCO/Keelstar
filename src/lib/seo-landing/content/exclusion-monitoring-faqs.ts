import type { Faq } from "@/lib/products";

export const exclusionMonitoringFaqs: Faq[] = [
  {
    q: "Is OIG exclusion screening available now?",
    a: "Yes. Keelstar screens names against the official HHS OIG LEIE database. You can run ad-hoc screens or set up scheduled monitoring in a workspace. A free one-name OIG search tool is also available without an account.",
  },
  {
    q: "What is the OIG exclusion list?",
    a: "The HHS Office of Inspector General maintains the List of Excluded Individuals and Entities (LEIE). Parties on this list are excluded from participating in federal healthcare programs. Many providers must screen vendors and staff against it.",
  },
  // "Is SAM exclusion search available?" — disabled (not implementing)
  {
    q: "How often should exclusion screening run?",
    a: "Most compliance programs require monthly or quarterly re-screening—not just at onboarding. Keelstar supports scheduled re-checks so screening is continuous and provable.",
  },
  {
    q: "What happens when there is a potential match?",
    a: "Possible matches are flagged for review. Your team records a disposition—cleared, confirmed, or false positive—and that decision becomes part of the dated audit trail.",
  },
  {
    q: "Does exclusion monitoring connect to vendor records?",
    a: "Yes. Screening subjects and results attach to vendor records alongside W-9s, certificates of insurance, and other compliance documents in the same workspace.",
  },
];
