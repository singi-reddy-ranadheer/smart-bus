-- Smart Bus AI — Migration 016: Row Level Security Policies
-- Supabase RLS policies for data isolation and access control.

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Users: users can read/write own data, admins read all
CREATE POLICY users_select_own ON users FOR SELECT
    USING (auth.uid() = id OR auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY users_insert_own ON users FOR INSERT
    WITH CHECK (auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE
    USING (auth.uid() = id OR auth.jwt()->>'role' = 'super_admin');

-- Buses: all authenticated users can read, only admins can modify
CREATE POLICY buses_select_all ON buses FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY buses_insert_admin ON buses FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY buses_update_admin ON buses FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Drivers: all authenticated users can read, only admins can modify
CREATE POLICY drivers_select_all ON drivers FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY drivers_insert_admin ON drivers FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY drivers_update_admin ON drivers FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Routes: all authenticated users can read, only admins can modify
CREATE POLICY routes_select_all ON routes FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY routes_insert_admin ON routes FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY routes_update_admin ON routes FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Stops: all authenticated users can read, only admins can modify
CREATE POLICY stops_select_all ON stops FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY stops_insert_admin ON stops FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY stops_update_admin ON stops FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Route Stops: all authenticated users can read, only admins can modify
CREATE POLICY rs_select_all ON route_stops FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY rs_insert_admin ON route_stops FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY rs_update_admin ON route_stops FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Trips: passengers see own, drivers see assigned, admins see all
CREATE POLICY trips_select ON trips FOR SELECT
    USING (
        auth.jwt()->>'role' IN ('admin', 'super_admin')
        OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM trip_events te WHERE te.trip_id = trips.id)
    );
CREATE POLICY trips_insert_driver ON trips FOR INSERT
    WITH CHECK (
        auth.jwt()->>'role' IN ('driver', 'admin', 'super_admin')
    );
CREATE POLICY trips_update_driver ON trips FOR UPDATE
    USING (
        driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        OR auth.jwt()->>'role' IN ('admin', 'super_admin')
    );

-- Trip Events: authenticated users can read, driver/simulator can insert
CREATE POLICY te_select_all ON trip_events FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY te_insert_driver ON trip_events FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM trips t WHERE t.id = trip_id AND t.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()))
        OR auth.jwt()->>'role' IN ('admin', 'super_admin')
    );
-- UPDATE and DELETE are rejected by immutable trigger (migration 010)

-- Notifications: users see own notifications
CREATE POLICY notif_select_own ON notifications FOR SELECT
    USING (user_id = auth.uid());
CREATE POLICY notif_insert_system ON notifications FOR INSERT
    WITH CHECK (true);
CREATE POLICY notif_update_own ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Payments: users see own, admins see all
CREATE POLICY payments_select_own ON payments FOR SELECT
    USING (user_id = auth.uid() OR auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY payments_insert_own ON payments FOR INSERT
    WITH CHECK (user_id = auth.uid());
CREATE POLICY payments_update_admin ON payments FOR UPDATE
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Predictions: all authenticated users can read, AI service can insert
CREATE POLICY pred_select_all ON predictions FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY pred_insert_ai ON predictions FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin') OR auth.jwt()->>'service' = 'ai');

-- Analytics: admins can read and write
CREATE POLICY analytics_select_admin ON analytics FOR SELECT
    USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY analytics_insert_admin ON analytics FOR INSERT
    WITH CHECK (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Enable Realtime for live tracking tables
ALTER PUBLICATION supabase_realtime ADD TABLE buses;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_events;