CREATE TABLE IF NOT EXISTS tracked_events (
  id UUID PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT NOT NULL,
  site TEXT NOT NULL,
  referrer TEXT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  device_type TEXT NOT NULL,
  device_vendor TEXT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS tracked_events_occurred_at_idx
  ON tracked_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS tracked_events_path_idx
  ON tracked_events (path);