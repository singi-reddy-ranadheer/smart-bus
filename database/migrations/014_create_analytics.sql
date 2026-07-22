-- ============================================
-- Sprint 1: Create Analytics Table
-- ============================================

CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dimensions
  route_id UUID REFERENCES routes(id),
  bus_id UUID REFERENCES buses(id),
  
  -- Time bucket
  bucket DATE NOT NULL,
  
  -- Metrics
  total_passengers INTEGER DEFAULT 0,
  total_revenue NUMERIC(12, 2) DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  avg_eta_accuracy DECIMAL(5, 4),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(route_id, bus_id, bucket)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_route ON analytics(route_id);
CREATE INDEX IF NOT EXISTS idx_analytics_bus ON analytics(bus_id);
CREATE INDEX IF NOT EXISTS idx_analytics_bucket ON analytics(bucket);

INSERT INTO schema_migrations (version) VALUES ('014_create_analytics') ON CONFLICT DO NOTHING;