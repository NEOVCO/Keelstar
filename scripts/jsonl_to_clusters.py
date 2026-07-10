import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "seo-landing")
CLUSTER_DIR = os.path.join(ROOT, "clusters")
JSONL = os.path.join(os.path.dirname(__file__), "seo-specs.jsonl")

EXPORTS = {
    "w9": ("w9PageSpecs", "w9-pages.ts"),
    "coi": ("coiPageSpecs", "coi-pages.ts"),
    "oig": ("oigPageSpecs", "oig-pages.ts"),
    "vendor": ("vendorPageSpecs", "vendor-pages.ts"),
    "contract": ("contractPageSpecs", "contract-pages.ts"),
    "invoice": ("invoicePageSpecs", "invoice-pages.ts"),
    "policy": ("policyPageSpecs", "policy-pages.ts"),
}

EYEBROW = {"w9":"W-9 collection","coi":"Certificate of insurance","oig":"Exclusion screening","vendor":"Vendor onboarding","contract":"Contract operations","invoice":"Invoice approval","policy":"Policy acknowledgment"}

WHO = {
    "w9": ["Accounts payable managers preparing for 1099 season","Vendor onboarding specialists collecting tax IDs at setup","Controllers who need backup withholding documentation","Operations teams coordinating hundreds of vendor records"],
    "coi": ["Risk managers requiring proof of insurance from vendors","Procurement leads onboarding subcontractors and suppliers","Property and facilities teams tracking tenant certificates","Compliance officers preparing for insurance audits"],
    "oig": ["Healthcare compliance teams screening vendor rosters","Medicaid and Medicare funded organizations","Pharmacy and lab services procurement","Audit teams documenting exclusion clearance"],
    "vendor": ["Procurement building repeatable onboarding playbooks","AP teams that should not pay non-compliant vendors","Risk teams consolidating W-9, COI, and questionnaires","Growing companies outgrowing email-based vendor setup"],
    "contract": ["Legal operations tracking renewal and notice dates","Finance owners responsible for vendor spend agreements","Procurement managing MSAs and statements of work","Compliance teams reviewing third-party contract risk"],
    "invoice": ["AP managers reducing invoice approval bottlenecks","Controllers strengthening invoice approval controls","Department heads who approve vendor spend","Organizations tying payment to vendor compliance status"],
    "policy": ["HR teams distributing handbook and safety policies","Compliance officers running annual attestations","Healthcare privacy officers tracking HIPAA acknowledgments","Operations leaders proving policy completion by site"],
}

CHECKLIST = {
    "w9": ["Every active vendor has a validated W-9 on file","Legal name and TIN were checked before first payment","Reminders run automatically for non-responders","Stale forms are flagged for re-collection","Request and submission history is exportable"],
    "coi": ["Coverage limits match your contract requirements","Expiration dates are tracked with lead time alerts","Additional insured endorsements are on file when required","Lapsed certificates block new POs or site access","Certificate history is exportable for audits"],
    "oig": ["Roster includes every vendor and individual you pay","Screening runs on a documented schedule","Potential matches are reviewed with notes","Cleared vendors show last screen date on profile","Screening history exports for payer audits"],
    "vendor": ["Checklists differ by vendor type and spend tier","Vendors submit through one branded portal link","Internal owners are assigned for each onboarding stage","Incomplete packets cannot be marked approved","Onboarding evidence exports as a single packet"],
    "contract": ["Renewal and termination notice dates are captured","Contract owners receive reminders before deadlines","Risk review notes stay attached to each file","Auto-renew clauses are visible before they trigger","Contract history is exportable for legal review"],
    "invoice": ["Approval rules reflect amount and department thresholds","Overdue approvals are visible on a single dashboard","Rejected invoices capture a reason code","Approved invoices link to vendor compliance status","Approval history exports for control testing"],
    "policy": ["Employees see the current policy version only","Attestations capture timestamp and identity","Reminders target employees who have not completed","Completion rates are available by department","Version history is exportable for investigations"],
}

def sec(title, paragraphs, eyebrow=None, bullets=None):
    s = {"title": title, "paragraphs": paragraphs}
    if eyebrow:
        s["eyebrow"] = eyebrow
    if bullets:
        s["bullets"] = bullets
    return s

def faq(q, a):
    return {"q": q, "a": a}

def enrich(spec):
    c = spec["cluster"]
    spec.setdefault("eyebrow", EYEBROW[c])
    spec.setdefault("whoItsFor", WHO[c])
    spec.setdefault("checklist", CHECKLIST[c])
    spec.setdefault("relatedSlugs", [])
    if "sections" not in spec:
        b = spec.get("breadcrumb", spec["h1"])
        spec["sections"] = [
            sec("Operationalize " + b.lower(), ["Keelstar gives your team a repeatable workflow for " + spec["h1"].lower() + ". Requests, submissions, and reminders stay on the vendor record instead of scattered inboxes."], eyebrow="Workflow"),
            sec("Controls auditors expect", ["Every action is timestamped so you can show who requested documentation, when it arrived, and what changed on re-collection."], bullets=["Branded outbound requests with reminder cadence","Validation before documents enter the vendor file","Exportable history for tax, insurance, or payer reviews"], eyebrow="Audit readiness"),
        ]
    if "faqs" not in spec:
        spec["faqs"] = [
            faq("Do vendors need a Keelstar account?", "Vendors and employees typically complete tasks through secure links. Your internal team manages workflows inside Keelstar."),
            faq("Can we export evidence for audits?", "Yes. Request history, submissions, approvals, and screening results export with timestamps."),
            faq("How fast can we go live?", "Most teams start with one workflow and expand to the full vendor packet as they onboard more modules."),
            faq("Does Keelstar send reminders automatically?", "You control reminder cadence. Keelstar nudges non-responders until they submit or you escalate."),
            faq("Is Keelstar only for " + EYEBROW[c].lower() + "?", "Keelstar covers W-9, COI, OIG screening, contracts, invoices, and policies on shared vendor records."),
        ]
    return spec


def write_cluster(cluster, specs):
    name, fname = EXPORTS[cluster]
    body = 'import type { SeoPageSpec } from "../create-page";\n\n'
    body += f"export const {name}: SeoPageSpec[] = "
    body += json.dumps(specs, indent=2, ensure_ascii=False)
    body += ";\n"
    path = os.path.join(CLUSTER_DIR, fname)
    os.makedirs(CLUSTER_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body)


def main():
    by_cluster = {k: [] for k in EXPORTS}
    with open(JSONL, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            spec = enrich(json.loads(line))
            by_cluster[spec["cluster"]].append(spec)
    for cluster, specs in by_cluster.items():
        write_cluster(cluster, specs)
    all_specs = []
    for cluster in EXPORTS:
        all_specs.extend(by_cluster[cluster])
    index = 'import type { SeoPageSpec } from "../create-page";\n'
    index += 'import { w9PageSpecs } from "./w9-pages";\n'
    index += 'import { coiPageSpecs } from "./coi-pages";\n'
    index += 'import { oigPageSpecs } from "./oig-pages";\n'
    index += 'import { vendorPageSpecs } from "./vendor-pages";\n'
    index += 'import { contractPageSpecs } from "./contract-pages";\n'
    index += 'import { invoicePageSpecs } from "./invoice-pages";\n'
    index += 'import { policyPageSpecs } from "./policy-pages";\n\n'
    index += 'export const allSeoPageSpecs: SeoPageSpec[] = [\n'
    index += '  ...w9PageSpecs,\n  ...coiPageSpecs,\n  ...oigPageSpecs,\n  ...vendorPageSpecs,\n  ...contractPageSpecs,\n  ...invoicePageSpecs,\n  ...policyPageSpecs,\n'
    index += '];\n'
    with open(os.path.join(CLUSTER_DIR, "index.ts"), "w", encoding="utf-8") as f:
        f.write(index)
    print("pages", len(all_specs))


if __name__ == "__main__":
    main()
