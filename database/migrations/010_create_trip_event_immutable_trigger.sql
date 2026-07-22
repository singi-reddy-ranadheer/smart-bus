-- ============================================
-- Sprint 1: Make Trip Events Immutable
-- ============================================

CREATE OR REPLACE FUNCTION prevent_trip_event_update_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Trip events are immutable and cannot be modified or deleted';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trip_events_immutable
  BEFORE UPDATE OR DELETE ON trip_events
  FOR EACH ROW EXECUTE FUNCTION prevent_trip_event_update_delete();

INSERT INTO schema_migrations (version) VALUES ('010_create_trip_event_immutable_trigger') ON CONFLICT DO NOTHING;