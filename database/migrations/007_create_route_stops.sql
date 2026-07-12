-- Smart Bus AI — Migration 007: Create Route Stops Junction Table
-- Links routes to stops with ordering.

CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id),
    stop_id UUID NOT NULL REFERENCES stops(id),
    stop_order INTEGER NOT NULL,
    distance_from_prev FLOAT,
    time_from_prev INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(route_id, stop_order),
    UNIQUE(route_id, stop_id)
);

CREATE INDEX idx_rs_route ON route_stops(route_id);
CREATE INDEX idx_rs_stop ON route_stops(stop_id);
CREATE INDEX idx_rs_order ON route_stops(stop_order);