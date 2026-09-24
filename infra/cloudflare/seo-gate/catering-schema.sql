[Reading 44 lines from start (total: 44 lines, 0 remaining)]

CREATE TABLE IF NOT EXISTS catering_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'LEAD',
  is_test INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  ico TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  guest_count INTEGER NOT NULL,
  event_date TEXT,
  event_time TEXT,
  location TEXT,
  venue_type TEXT,
  diet_notes TEXT,
  addons_json TEXT,
  notes TEXT,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  estimated_revenue INTEGER,
  currency TEXT NOT NULL DEFAULT 'CZK',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  gclid TEXT,
  gbraid TEXT,
  wbraid TEXT,
  mail_status TEXT NOT NULL DEFAULT 'pending',
  mail_message_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_catering_leads_created_at
  ON catering_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_catering_leads_ip_created
  ON catering_leads(ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_catering_leads_email
  ON catering_leads(email);

[executed on device: DESKTOP-ALZABOX (7e869a05-3e3d-4dd2-adbd-ebf450ac342d)]