-- Smart Bus AI — Migration 010: Trip Event Immutable Trigger
-- Enforces that trip_events records can never be updated or deleted.
-- New rows are APPEND ONLY.

CREATE OR REPLACE FUNCTION reject_trip_event_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'trip_events is immutable: records cannot be modified or deleted. Event ID: %', OLD.id
        USING HINT = 'trip_events is an append-only log. Insert new records instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trip_events_immutable_trigger
    BEFORE UPDATE OR DELETE ON trip_events
    FOR EACH ROW
    EXECUTE FUNCTION reject_trip_event_modification();