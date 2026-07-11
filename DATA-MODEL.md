# Smart Bus AI — Data Model

> **Version:** 1.0  
> **Status:** Active  
> **Last Updated:** 2026-07-10

---

## 1. Principles

1. **All entity IDs are UUID v4** — no auto-increment integers
2. **Timestamps are UTC** — stored as `timestamptz`
3. **TripEvent is IMMUTABLE** — enforced with database trigger; no UPDATE or DELETE allowed
4. **Soft deletes** — entities have `deleted_at` timestamp instead of physical deletion
5. **Row Level Security (RLS)** — Supabase RLS policies for data isolation
6. **Indexes on foreign keys and query columns** — performance from day one
7. **JSONB for flexible metadata** — avoids schema changes for optional/infrequent fields

---

## 2. Entity Relationship Diagram (Text)

```
User ──> Role (assigned via user.role field)
  │
  ├──< Trip (passenger_id) — trips taken
  │
  ├──< Payment (user_id) — payments made
  │
  ├──< Notification (user_id) — notifications received
  │
  └──< Driver (user_id) — if user is a driver

Driver ──< Bus (assigned_bus_id)
  │
  └──< Trip (driver_id) — trips driven

Bus ──< Trip (bus_id) — trips completed
  │
  └─── Route (current_route_id) — currently assigned route

Route ──< RouteStop (route_id) — ordered list of stops
  │
  RouteStop ──< Stop (stop_id)

Trip ──< TripEvent (trip_id) — immutable event log
  │
  ├──< Payment (trip_id) — fare payments for trip
  │
  └──< Prediction (trip_id) — AI predictions for trip

Prediction ── (model_version tracks which model produced it)
```

---

## 3. Enums

```sql
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
```

---

## 4. Tables

### 4.1 `users`

Core user account, linked to Supabase Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Primary identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| phone | VARCHAR(20) | UNIQUE | Phone number |
| name | VARCHAR(255) | NOT NULL | Display name |
| avatar_url | TEXT | | Profile picture |
| role | user_role | NOT NULL, DEFAULT 'passenger' | RBAC role |
| is_active | BOOLEAN | DEFAULT true | Account disabled? |
| last_seen_at | TIMESTAMPTZ | | Last activity |
| metadata | JSONB | DEFAULT '{}' | Flexible metadata |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| deleted_at | TIMESTAMPTZ | | Soft delete |

**Indexes:** `idx_users_email`, `idx_users_phone`, `idx_users_role`

**RLS:** Users can read/write their own data. Admins can read all.

---

### 4.2 `buses`

Physical bus records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| plate_number | VARCHAR(20) | UNIQUE, NOT NULL | License plate |
| bus_number | VARCHAR(20) | NOT NULL | Internal fleet number |
| capacity | INTEGER | NOT NULL | Max passenger capacity |
| model | VARCHAR(100) | | Bus make/model |
| year | INTEGER | | Manufacture year |
| color | VARCHAR(7) | NOT NULL, DEFAULT '#3B82F6' | Hex color for map |
| status | bus_status | NOT NULL, DEFAULT 'inactive' | Current status |
| current_location | POINT | | Last known lat/lng |
| current_speed | FLOAT | DEFAULT 0 | Speed in km/h |
| heading | FLOAT | | Heading in degrees |
| current_route_id | UUID | FK → routes.id | Current route assignment |
| gps_device_id | VARCHAR(100) | | IoT device ID (v1) |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | | |

**Indexes:** `idx_buses_plate`, `idx_buses_status`, `idx_buses_route`

**RLS:** Drivers see assigned bus. Admins see all. Passengers see active buses only.

---

### 4.3 `drivers`

Driver profiles linked to user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | UNIQUE, FK → users.id | Link to user account |
| license_number | VARCHAR(50) | UNIQUE, NOT NULL | Driver's license |
| license_expiry | DATE | | License expiry date |
| assigned_bus_id | UUID | FK → buses.id | Currently assigned bus |
| status | driver_status | NOT NULL, DEFAULT 'offline' | Availability |
| total_trips | INTEGER | DEFAULT 0 | Lifetime trips |
| rating | FLOAT | | Average rating (future) |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | | |

**Indexes:** `idx_drivers_user`, `idx_drivers_license`, `idx_drivers_status`

---

### 4.4 `routes`

Bus route definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | e.g., "Campus Express" |
| description | TEXT | | Description |
| color | VARCHAR(7) | NOT NULL | Hex color for map display |
| total_distance | FLOAT | | Distance in km |
| estimated_duration | INTEGER | | Duration in minutes |
| status | route_status | NOT NULL, DEFAULT 'active' | |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | | |

---

### 4.5 `stops`

Individual bus stops.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | Stop name |
| latitude | DOUBLE PRECISION | NOT NULL | |
| longitude | DOUBLE PRECISION | NOT NULL | |
| landmark | VARCHAR(255) | | Nearby landmark |
| is_terminal | BOOLEAN | DEFAULT false | Route endpoint |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | | |

**Indexes:** `idx_stops_location` (GIST on lat/lng)

---

### 4.6 `route_stops`

Junction table linking routes to stops with ordering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| route_id | UUID | FK → routes.id, NOT NULL | |
| stop_id | UUID | FK → stops.id, NOT NULL | |
| stop_order | INTEGER | NOT NULL | Sequence number |
| distance_from_prev | FLOAT | | Distance (km) from previous stop |
| time_from_prev | INTEGER | | Minutes from previous stop |
| created_at | TIMESTAMPTZ | NOT NULL | |

**Constraints:** `UNIQUE(route_id, stop_order)`, `UNIQUE(route_id, stop_id)`  
**Indexes:** `idx_rs_route`, `idx_rs_stop`, `idx_rs_order`

---

### 4.7 `trips`

A trip is a single bus journey along a route.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| bus_id | UUID | FK → buses.id, NOT NULL | |
| route_id | UUID | FK → routes.id, NOT NULL | |
| driver_id | UUID | FK → drivers.id | |
| status | trip_status | NOT NULL, DEFAULT 'scheduled' | |
| start_time | TIMESTAMPTZ | | Actual start |
| end_time | TIMESTAMPTZ | | Actual end |
| scheduled_start | TIMESTAMPTZ | | Scheduled start time |
| scheduled_end | TIMESTAMPTZ | | Scheduled end time |
| passenger_count | INTEGER | DEFAULT 0 | Current passenger count |
| total_passengers | INTEGER | DEFAULT 0 | Cumulative for trip |
| revenue | DECIMAL(10,2) | DEFAULT 0 | Trip revenue (v0.3+) |
| notes | TEXT | | Driver notes |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

**Indexes:** `idx_trips_bus`, `idx_trips_driver`, `idx_trips_route`, `idx_trips_status`, `idx_trips_start_time`

---

### 4.8 `trip_events` — IMMUTABLE

Immutable event log for all trip activity.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| trip_id | UUID | FK → trips.id, NOT NULL | |
| event_type | trip_event_type | NOT NULL | Type of event |
| latitude | DOUBLE PRECISION | | GPS latitude at event |
| longitude | DOUBLE PRECISION | | GPS longitude at event |
| speed | FLOAT | | Speed at event time |
| heading | FLOAT | | Direction at event time |
| passenger_count | INTEGER | | Passenger count at event |
| metadata | JSONB | DEFAULT '{}' | Event-specific data |
| recorded_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | When event occurred |

**CRITICAL RULES:**
- **No UPDATE allowed** — once written, trip_events records are permanent
- **No DELETE allowed** — events cannot be removed
- **Enforced via database trigger** that rejects UPDATE/DELETE on this table
- New rows are APPEND ONLY

**Indexes:** `idx_events_trip`, `idx_events_type`, `idx_events_time`, `idx_events_trip_time` (composite)

---

### 4.9 `notifications`

Notification records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | Recipient |
| type | notification_type | NOT NULL | Delivery channel |
| title | VARCHAR(255) | NOT NULL | |
| body | TEXT | | |
| data | JSONB | | Payload data |
| is_read | BOOLEAN | DEFAULT false | |
| read_at | TIMESTAMPTZ | | When read |
| sent_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | |
| delivered_at | TIMESTAMPTZ | | When delivered |

**Indexes:** `idx_notif_user`, `idx_notif_user_read`, `idx_notif_created`

---

### 4.10 `payments`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| trip_id | UUID | FK → trips.id | |
| amount | DECIMAL(10,2) | NOT NULL | |
| method | payment_method | NOT NULL | |
| status | payment_status | NOT NULL, DEFAULT 'pending' | |
| reference_id | VARCHAR(100) | | External reference |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

**Indexes:** `idx_payments_user`, `idx_payments_trip`, `idx_payments_status`

---

### 4.11 `predictions`

AI model predictions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| trip_id | UUID | FK → trips.id | Related trip (if applicable) |
| route_id | UUID | FK → routes.id | Related route |
| stop_id | UUID | FK → stops.id | Related stop |
| prediction_type | prediction_type | NOT NULL | |
| value | FLOAT | NOT NULL | Predicted value |
| confidence | FLOAT | | Model confidence (0-1) |
| model_version | VARCHAR(50) | NOT NULL | Which model generated this |
| features_hash | VARCHAR(64) | | Hash of input features (reproducibility) |
| metadata | JSONB | DEFAULT '{}' | |
| created_at | TIMESTAMPTZ | NOT NULL | |

**Indexes:** `idx_pred_type`, `idx_pred_trip`, `idx_pred_model`

---

### 4.12 `analytics`

Pre-computed analytics / materialized view cache.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| metric_name | VARCHAR(100) | NOT NULL | |
| period | VARCHAR(20) | NOT NULL | 'hourly', 'daily', 'weekly', 'monthly' |
| period_start | DATE | NOT NULL | Start of period |
| period_end | DATE | NOT NULL | End of period |
| value | FLOAT | NOT NULL | Metric value |
| dimensions | JSONB | DEFAULT '{}' | Breakdown dimensions |
| created_at | TIMESTAMPTZ | NOT NULL | |

**Constraints:** `UNIQUE(metric_name, period, period_start, dimensions)`  
**Indexes:** `idx_analytics_metric_period`

---

## 5. Row Level Security (RLS) Policies

| Table | Policy | Rule |
|-------|--------|------|
| users | SELECT | Own record OR role = admin/super_admin |
| users | INSERT | Authenticated users can insert their own record |
| users | UPDATE | Own record OR role = super_admin |
| buses | SELECT | Authenticated users (all roles) |
| buses | UPDATE | role IN (admin, super_admin) |
| buses | INSERT | role IN (admin, super_admin) |
| trips | SELECT | passenger: own trips; driver: assigned; admin: all |
| trips | INSERT | driver: own trips; admin: any |
| trips | UPDATE | driver: own active trips; admin: all |
| trip_events | SELECT | Authenticated users |
| trip_events | INSERT | driver: own trip; simulator: authenticated |
| trip_events | UPDATE | DENIED (trigger rejects) |
| trip_events | DELETE | DENIED (trigger rejects) |

---

## 6. Migration Strategy

```
database/
├── migrations/
│   ├── 001_create_enums.sql
│   ├── 002_create_users.sql
│   ├── 003_create_buses.sql
│   ├── 004_create_drivers.sql
│   ├── 005_create_routes.sql
│   ├── 006_create_stops.sql
│   ├── 007_create_route_stops.sql
│   ├── 008_create_trips.sql
│   ├── 009_create_trip_events.sql
│   ├── 010_create_trip_event_immutable_trigger.sql
│   ├── 011_create_notifications.sql
│   ├── 012_create_payments.sql
│   ├── 013_create_predictions.sql
│   ├── 014_create_analytics.sql
│   ├── 015_create_indexes.sql
│   └── 016_create_rls_policies.sql
└── seeds/
    ├── 001_sample_routes.sql
    ├── 002_sample_stops.sql
    ├── 003_sample_buses.sql
    └── 004_sample_drivers.sql
```

Each migration is a standalone SQL file that can be run in order against a Supabase project.