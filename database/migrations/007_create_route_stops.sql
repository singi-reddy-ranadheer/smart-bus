-- ============================================
-- Sprint 1: Create Route Stops Junction Table
-- ============================================

CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  
  -- Ordering
  stop_order INTEGER NOT NULL,
  
  -- Timing
  estimated_arrival_offset_minutes INTEGER NOT NULL, -- Minutes from route start
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: a stop can only appear once per route
  UNIQUE(route_id, stop_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_stop ON route_stops(stop_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_order ON route_stops(route_id, stop_order);

-- Auto-update updated_at
CREATE TRIGGER update_route_stops_updated_at BEFORE UPDATE ON route_stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO schema_migrations (version) VALUES ('007_create_route_stops') ON CONFLICT DO NOTHING;