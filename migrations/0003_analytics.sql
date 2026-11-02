CREATE TABLE IF NOT EXISTS portfolio_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_portfolio_events_created ON portfolio_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_events_type_created ON portfolio_events(event_type, created_at DESC);
