-- Migration 011: In-app notifications, platform workflow types

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS read_at timestamptz,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS body text,
  ADD COLUMN IF NOT EXISTS href text;

CREATE INDEX IF NOT EXISTS idx_notifications_in_app_unread
  ON notifications(organization_id, recipient_email, created_at DESC)
  WHERE channel = 'in_app' AND read_at IS NULL;
