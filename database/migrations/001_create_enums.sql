-- Smart Bus AI — Migration 001: Create Enums
-- Creates all custom enum types used across the schema.

-- User roles
CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin', 'super_admin');

-- Bus operational status
CREATE TYPE bus_status AS ENUM ('active', 'inactive', 'maintenance', 'retired');

-- Driver availability
CREATE TYPE driver_status AS ENUM ('available', 'on_trip', 'offline', 'off_duty');

-- Route lifecycle
CREATE TYPE route_status AS ENUM ('active', 'inactive', 'archived');

-- Trip lifecycle
CREATE TYPE trip_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');

-- Trip event types
CREATE TYPE trip_event_type AS ENUM (
    'GPS_UPDATE',
    'BOARDING',
    'ALIGHTING',
    'TRIP_START',
    'TRIP_END',
    'SOS_ALERT',
    'DELAY_REPORT',
    'MAINTENANCE_REPORT',
    'ROUTE_DEVIATION'
);

-- Notification channels
CREATE TYPE notification_type AS ENUM ('push', 'sms', 'email', 'in_app');

-- Payment methods
CREATE TYPE payment_method AS ENUM ('wallet', 'qr', 'rfid', 'cash');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Prediction types
CREATE TYPE prediction_type AS ENUM ('eta', 'demand', 'occupancy');