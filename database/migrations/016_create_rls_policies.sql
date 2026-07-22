-- ============================================
-- Sprint 1: Row Level Security (RLS) Policies
-- ============================================

-- Users: Users can view their own profile, admins can view all
CREATE POLICY users_select ON users FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Buses: Public read, authenticated write (for drivers/admins)
CREATE POLICY buses_select ON buses FOR SELECT USING (true);
CREATE POLICY buses_insert ON buses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY buses_update ON buses FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Stops: Public read
CREATE POLICY stops_select ON stops FOR SELECT USING (true);

-- Routes: Public read
CREATE POLICY routes_select ON routes FOR SELECT USING (is_active = true);

-- Trip events: Public read for active trips
CREATE POLICY trip_events_select ON trip_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_events.trip_id AND trips.status IN ('scheduled', 'in_progress'))
);

-- Notifications: Users can only see their own
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);

INSERT INTO schema_migrations (version) VALUES ('016_create_rls_policies') ON CONFLICT DO NOTHING;