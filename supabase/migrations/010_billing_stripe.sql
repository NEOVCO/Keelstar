-- Per-module Stripe pricing and subscription tracking

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stripe_price_id_monthly text,
  ADD COLUMN IF NOT EXISTS stripe_price_id_yearly text;

CREATE TABLE IF NOT EXISTS module_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  billing_interval text CHECK (billing_interval IN ('month', 'year')),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_module_subscriptions_org ON module_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_module_subscriptions_stripe ON module_subscriptions(stripe_subscription_id);

CREATE TRIGGER tr_module_subscriptions_updated_at
  BEFORE UPDATE ON module_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE module_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY module_subscriptions_select ON module_subscriptions FOR SELECT
  USING (is_org_member(organization_id));
