import type { Guide } from "../types";
import { buildGuidesFromSpecs } from "../create-guide";
import { oigPhase1Specs } from "./oig-phase1";
import { w9Phase1Specs } from "./w9-phase1";

export const phase1GuideSpecs = [...w9Phase1Specs, ...oigPhase1Specs];

export const phase1Guides: Guide[] = buildGuidesFromSpecs(phase1GuideSpecs);
