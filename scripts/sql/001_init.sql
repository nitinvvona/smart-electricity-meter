/* Initial TimescaleDB schema for Smart Electricity Meter */
-- Enable TimescaleDB (requires superuser in many setups)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Core tables
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meter_readings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  ts TIMESTAMP NOT NULL,
  kwh DOUBLE PRECISION NOT NULL,
  voltage DOUBLE PRECISION,
  current DOUBLE PRECISION
);

-- Convert to hypertable
SELECT create_hypertable('meter_readings', 'ts', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS ml_outputs (
  id SERIAL PRIMARY KEY,
  reading_id INTEGER NOT NULL REFERENCES meter_readings(id),
  predicted_cost DOUBLE PRECISION NOT NULL,
  anomaly BOOLEAN DEFAULT FALSE,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS billing (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  period TEXT NOT NULL, -- e.g., 2025-09
  kwh_total DOUBLE PRECISION NOT NULL,
  cost_total DOUBLE PRECISION NOT NULL,
  due_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  paid BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  amount DOUBLE PRECISION NOT NULL,
  ts TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ts TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed demo customer
INSERT INTO customers (email, name)
VALUES ('demo@example.com', 'Demo Customer')
ON CONFLICT (email) DO NOTHING;
