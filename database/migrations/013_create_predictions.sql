-- Smart Bus AI — Migration 013: Create Predictions Table
-- AI model prediction records.

CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id),
    route_id UUID REFERENCES routes(id),
    stop_id UUID REFERENCES stops(id),
    prediction_type prediction_type NOT NULL,
    value FLOAT NOT NULL,
    confidence FLOAT,
    model_version VARCHAR(50) NOT NULL,
    features_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pred_type ON predictions(prediction_type);
CREATE INDEX idx_pred_trip ON predictions(trip_id);
CREATE INDEX idx_pred_model ON predictions(model_version);