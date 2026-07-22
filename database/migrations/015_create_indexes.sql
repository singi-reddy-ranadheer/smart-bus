-- ============================================
-- Sprint 1: Additional Indexes for Performance
-- ============================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_buses_route_status ON buses(current_route_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_route_status ON trips(route_id, status);
CREATE INDEX IF NOT EXISTS idx_trip_events_trip_created ON trip_events(trip_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_trip_events_metadata_gin ON trip_events USING GIN(metadata);

-- Coverage indexes
CREATE INDEX IF NOT EXISTS idx_trip_events_latlng ON trip_events(latitude, longitude);

INSERT INTO schema_migrations (version) VALUES ('015_create_indexes') ON CONFLICT DO NOTHING;