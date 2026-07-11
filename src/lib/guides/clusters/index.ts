import type { Guide } from "../types";
import { buildGuidesFromSpecs } from "../create-guide";
import { coiPhase2Specs } from "./coi-phase2";
import { contractPhase2Specs } from "./contract-phase2";
import { oigPhase1Specs } from "./oig-phase1";
import { oigPhase3Specs } from "./oig-phase3";
import { vendorPhase2Specs } from "./vendor-phase2";
import { w9Phase1Specs } from "./w9-phase1";
import { w9Phase3Specs } from "./w9-phase3";

export const phase1GuideSpecs = [...w9Phase1Specs, ...oigPhase1Specs];
export const phase1Batch2GuideSpecs = coiPhase2Specs;
export const phase1Batch3GuideSpecs = [...w9Phase3Specs, ...oigPhase3Specs];
export const phase2GuideSpecs = [...vendorPhase2Specs, ...contractPhase2Specs];

export const programmaticGuideSpecs = [
  ...phase1GuideSpecs,
  ...phase1Batch2GuideSpecs,
  ...phase1Batch3GuideSpecs,
  ...phase2GuideSpecs,
];

export const programmaticGuides: Guide[] = buildGuidesFromSpecs(programmaticGuideSpecs);

// Back-compat alias
export const phase1Guides = programmaticGuides.filter((g) =>
  phase1GuideSpecs.some((s) => s.slug === g.slug)
);
