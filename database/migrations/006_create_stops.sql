-- ============================================
-- Sprint 1: Create Stops Table
-- ============================================

CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Details
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  
  -- Location
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  
  -- Amenities
  has_shelter BOOLEAN DEFAULT FALSE,
  has_bench BOOLEAN DEFAULT FALSE,
  has_lighting BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stops_code ON stops(code);

-- Auto-update updated_at
CREATE TRIGGER update_stops_updated_at BEFORE UPDATE ON stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO schema_migrations (version) VALUES ('006_create_stops') ON CONFLICT DO NOTHING;