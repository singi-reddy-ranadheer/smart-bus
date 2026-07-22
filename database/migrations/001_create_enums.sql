-- ============================================
-- Sprint 1: Create Enums
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin', 'super_admin');

-- Bus status
CREATE TYPE bus_status AS ENUM ('active', 'inactive', 'maintenance');

-- Trip status
CREATE TYPE trip_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Event types for trip tracking
CREATE TYPE event_type AS ENUM (
  'gps_update',
  'stop_arrival',
  'stop_departure',
  'passenger_boarding',
  'passenger_alighting',
  'sos_alert',
  'route_deviation'
);

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Payment method
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'wallet');

-- Notification channels
CREATE TYPE notification_channel AS ENUM ('push', 'sms', 'email', 'websocket');

-- Prediction types
CREATE TYPE prediction_type AS ENUM ('eta', 'demand', 'route_optimization');

-- ============================================
-- Version tracking
-- ============================================
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES ('001_create_enums') ON CONFLICT DO NOTHING;