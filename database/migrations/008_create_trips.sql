-- ============================================
-- Sprint 1: Create Trips Table
-- ============================================

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign keys
  route_id UUID NOT NULL REFERENCES routes(id),
  bus_id UUID NOT NULL REFERENCES buses(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  
  -- Timing
  scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status trip_status NOT NULL DEFAULT 'scheduled',
  
  -- Metrics
  passenger_count INTEGER DEFAULT 0,
  revenue NUMERIC(10, 2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_bus ON trips(bus_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_scheduled_start ON trips(scheduled_start_time);

-- Auto-update updated_at
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO schema_migrations (version) VALUES ('008_create_trips') ON CONFLICT DO NOTHING;