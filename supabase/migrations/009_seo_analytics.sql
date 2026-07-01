-- Migration 009: SEO analytics control tower (GSC + GA4 + diagnostics)

CREATE TABLE IF NOT EXISTS gsc_page_daily (
  id bigserial PRIMARY KEY,
  property_url text NOT NULL,
  date date NOT NULL,
  page_url text NOT NULL,
  clicks int NOT NULL DEFAULT 0,
  impressions int NOT NULL DEFAULT 0,
  ctr double precision NOT NULL DEFAULT 0,
  position double precision NOT NULL DEFAULT 0,
  country_code text NOT NULL DEFAULT '',
  device_type text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_url, date, page_url, country_code, device_type)
);

CREATE INDEX IF NOT EXISTS idx_gsc_page_daily_property ON gsc_page_daily(property_url, date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_page_daily_page ON gsc_page_daily(page_url);

CREATE TABLE IF NOT EXISTS gsc_query_page_daily (
  id bigserial PRIMARY KEY,
  property_url text NOT NULL,
  date date NOT NULL,
  query text NOT NULL,
  page_url text NOT NULL,
  clicks int NOT NULL DEFAULT 0,
  impressions int NOT NULL DEFAULT 0,
  ctr double precision NOT NULL DEFAULT 0,
  position double precision NOT NULL DEFAULT 0,
  country_code text NOT NULL DEFAULT '',
  device_type text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_url, date, query, page_url, country_code, device_type)
);

CREATE INDEX IF NOT EXISTS idx_gsc_query_page_daily_date ON gsc_query_page_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_query_page_daily_query ON gsc_query_page_daily(query);

CREATE TABLE IF NOT EXISTS ga4_landing_page_daily (
  id bigserial PRIMARY KEY,
  property_id text NOT NULL,
  date date NOT NULL,
  landing_page text NOT NULL,
  sessions int NOT NULL DEFAULT 0,
  users int,
  engaged_sessions int,
  engagement_rate double precision,
  conversions double precision,
  bounce_rate double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, date, landing_page)
);

CREATE INDEX IF NOT EXISTS idx_ga4_landing_daily_date ON ga4_landing_page_daily(date DESC);

CREATE TABLE IF NOT EXISTS seo_page_catalog (
  id bigserial PRIMARY KEY,
  page_url text NOT NULL UNIQUE,
  page_type text NOT NULL,
  slug text NOT NULL,
  title text,
  canonical_url text,
  priority_score int,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_page_diagnostics_daily (
  id bigserial PRIMARY KEY,
  page_url text NOT NULL,
  date date NOT NULL,
  impressions_7d int,
  clicks_7d int,
  ctr_7d double precision,
  position_7d double precision,
  sessions_7d int,
  conversions_7d double precision,
  opportunity_type text NOT NULL,
  opportunity_score double precision NOT NULL DEFAULT 0,
  summary_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_url, date, opportunity_type)
);

CREATE INDEX IF NOT EXISTS idx_seo_diag_date ON seo_page_diagnostics_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_diag_type ON seo_page_diagnostics_daily(opportunity_type);

CREATE TABLE IF NOT EXISTS seo_sync_state (
  id bigserial PRIMARY KEY,
  source text NOT NULL UNIQUE,
  last_run_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  rows_upserted int,
  extra_json jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
