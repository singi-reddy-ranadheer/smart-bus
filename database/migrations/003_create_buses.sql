-- Smart Bus AI — Migration 003: Create Buses Table
-- Physical bus records with current location tracking.

CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    bus_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    model VARCHAR(100),
    year INTEGER,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    status bus_status NOT NULL DEFAULT 'inactive',
    current_location POINT,
    current_speed FLOAT DEFAULT 0,
    heading FLOAT,
    current_route_id UUID,
    gps_device_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_buses_plate ON buses(plate_number);
CREATE INDEX idx_buses_status ON buses(status);
CREATE INDEX idx_buses_route ON buses(current_route_id);