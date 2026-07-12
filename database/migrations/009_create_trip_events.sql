-- Smart Bus AI — Migration 009: Create Trip Events Table
-- Immutable event log for all trip activity.

CREATE TABLE trip_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id),
    event_type trip_event_type NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    speed FLOAT,
    heading FLOAT,
    passenger_count INTEGER,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_trip ON trip_events(trip_id);
CREATE INDEX idx_events_type ON trip_events(event_type);
CREATE INDEX idx_events_time ON trip_events(recorded_at);
CREATE INDEX idx_events_trip_time ON trip_events(trip_id, recorded_at);