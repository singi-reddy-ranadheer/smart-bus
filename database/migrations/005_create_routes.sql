-- ============================================
-- Sprint 1: Create Routes Table
-- ============================================

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Details
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for map
  
  -- Geometry
  start_latitude DECIMAL(10, 7),
  start_longitude DECIMAL(10, 7),
  end_latitude DECIMAL(10, 7),
  end_longitude DECIMAL(10, 7),
  distance_km DECIMAL(5, 2),
  estimated_duration_minutes INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_routes_code ON routes(code);
CREATE INDEX IF NOT EXISTS idx_routes_active ON routes(is_active);

-- Auto-update updated_at
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO schema_migrations (version) VALUES ('005_create_routes') ON CONFLICT DO NOTHING;