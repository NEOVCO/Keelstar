#!/usr/bin/env bash
# Create Keelstar module products on Stripe LIVE.
# Prereq: stripe login (with live mode access)
set -euo pipefail

LIVE_FLAG=(--live)
MODULES=(
  "w9_collector:W-9 Collector"
  "coi_tracker:COI Tracker"
  "contract_renewal:Contract Renewal Tracker"
  "contract_risk_scanner:Contract Risk Scanner"
  "exclusion_monitor:Exclusion Monitor"
  "vendor_packet:Vendor Packet Portal"
  "policy_acknowledgement:Policy Acknowledgement Tracker"
  "training_record:Training Record Tracker"
  "invoice_approval:Invoice Approval Lite"
  "simple_signer:Simple Signer"
)

echo "Creating Stripe LIVE products and prices..."
for entry in "${MODULES[@]}"; do
  key="${entry%%:*}"
  name="${entry#*:}"
  product_id=$(stripe products create "${LIVE_FLAG[@]}" \
    -d "name=Keelstar — ${name}" \
    -d "metadata[productKey]=${key}" \
    --format json | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  monthly=$(stripe prices create "${LIVE_FLAG[@]}" \
    -d "product=${product_id}" \
    -d "unit_amount=4900" \
    -d "currency=usd" \
    -d "recurring[interval]=month" \
    -d "metadata[productKey]=${key}" \
    --format json | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  yearly=$(stripe prices create "${LIVE_FLAG[@]}" \
    -d "product=${product_id}" \
    -d "unit_amount=49000" \
    -d "currency=usd" \
    -d "recurring[interval]=year" \
    -d "metadata[productKey]=${key}" \
    --format json | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "${key}: product=${product_id} monthly=${monthly} yearly=${yearly}"
done

echo ""
echo "Run npm run stripe:setup (with STRIPE_SECRET_KEY=sk_live_...) to sync IDs to Supabase."
