-- Smart Bus AI — Migration 015: Create Additional Indexes
-- Performance indexes for common query patterns.

-- Composite indexes for trip queries
CREATE INDEX idx_trips_bus_status ON trips(bus_id, status);
CREATE INDEX idx_trips_driver_status ON trips(driver_id, status);
CREATE INDEX idx_trips_route_status ON trips(route_id, status);

-- Trip events composite queries
CREATE INDEX idx_events_trip_type ON trip_events(trip_id, event_type);
CREATE INDEX idx_events_type_time ON trip_events(event_type, recorded_at);

-- User search
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Notification delivery
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read, created_at DESC)
    WHERE is_read = false;

-- Payment reconciliation
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- Route stop ordering for fast lookup
CREATE INDEX idx_rs_route_order ON route_stops(route_id, stop_order);

-- Bus current location (for active bus queries)
CREATE INDEX idx_buses_active ON buses(status) WHERE status = 'active';

-- Analytics period queries
CREATE INDEX idx_analytics_metric ON analytics(metric_name, period_start DESC);

-- Prediction lookup
CREATE INDEX idx_pred_route_type ON predictions(route_id, prediction_type, created_at DESC);