-- ============================================
-- Sprint 1: Create Buses Table
-- ============================================

CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Details
  model VARCHAR(100),
  capacity INTEGER NOT NULL DEFAULT 40,
  status bus_status NOT NULL DEFAULT 'active',
  
  -- Route assignment
  current_route_id UUID,
  
  -- Telemetry
  current_latitude DECIMAL(10, 7),
  current_longitude DECIMAL(10, 7),
  current_speed DECIMAL(5, 2),
  last_gps_update TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_buses_current_route ON buses(current_route_id);

-- Auto-update updated_at
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO schema_migrations (version) VALUES ('003_create_buses') ON CONFLICT DO NOTHING;