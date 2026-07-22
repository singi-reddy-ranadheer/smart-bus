-- ============================================
-- Sprint 1: Create Trip Events Table
-- ============================================

CREATE TABLE IF NOT EXISTS trip_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  
  -- Event details
  event_type event_type NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  speed DECIMAL(5, 2),
  
  -- Additional data
  passenger_count_change INTEGER,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trip_events_trip ON trip_events(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_events_type ON trip_events(event_type);
CREATE INDEX IF NOT EXISTS idx_trip_events_created ON trip_events(created_at);

INSERT INTO schema_migrations (version) VALUES ('009_create_trip_events') ON CONFLICT DO NOTHING;