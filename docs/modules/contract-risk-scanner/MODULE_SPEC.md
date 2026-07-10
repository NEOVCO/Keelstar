# Contract Risk Scanner — Module Spec

> Module slug: `contract-risk-scanner` · App slug: `contracts-risk` · Entitlement: `contract_risk_scanner` · Workflow type: `contract_risk_scan`

## One-Sentence Job

Upload a contract, get a consistent read on commercially risky clauses, and route a review decision before signing.

## MVP Scope

- Upload contract PDF
- Extract text and scan with OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is set; regex heuristics as fallback
- Flag categories: auto-renewal, termination, indemnification, liability cap, assignment, governing law
- Internal review task — approve or reject with notes
- Evidence CSV export

## Exclusions

Legal advice · jurisdiction-specific analysis · negotiation tools · full CLM

## Statuses

`draft` → `uploaded` → `processing` → `review_needed` → `approved` / `rejected` / `cancelled`

## Shared Primitives

`workflow_instances` · `documents` · `document_versions` · `document_parsed_fields` · `tasks` · `audit_logs`
