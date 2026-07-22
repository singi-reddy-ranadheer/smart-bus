# Supabase Setup — Smart Bus AI

Apply these exactly once against the Supabase project URL already configured in the API.

## 1. Run migrations in order
001_create_enums.sql
002_create_users.sql
003_create_buses.sql
004_create_drivers.sql
005_create_routes.sql
006_create_stops.sql
007_create_route_stops.sql
008_create_trips.sql
009_create_trip_events.sql
010_create_trip_event_immutable_trigger.sql
011_create_notifications.sql
012_create_payments.sql
013_create_predictions.sql
014_create_analytics.sql
015_create_indexes.sql
016_create_rls_policies.sql

## 2. Run seeds in order
001_sample_routes.sql
002_sample_stops.sql
003_sample_buses.sql
004_sample_drivers.sql

## 3. Enable Realtime on buses table
Database > Replication > Update > add public.buses to supabase_realtime

After that, start services with run-dev.bat and test:
- API: http://localhost:3001/api/v1/buses
- Passenger: http://localhost:3000