import type { SeoPageSpec } from "../create-page";
import { w9PageSpecs } from "./w9-pages";
import { coiPageSpecs } from "./coi-pages";
import { oigPageSpecs } from "./oig-pages";
import { vendorPageSpecs } from "./vendor-pages";
import { contractPageSpecs } from "./contract-pages";
import { invoicePageSpecs } from "./invoice-pages";
import { policyPageSpecs } from "./policy-pages";

export const allSeoPageSpecs: SeoPageSpec[] = [
  ...w9PageSpecs,
  ...coiPageSpecs,
  ...oigPageSpecs,
  ...vendorPageSpecs,
  ...contractPageSpecs,
  ...invoicePageSpecs,
  ...policyPageSpecs,
];
