-- ============================================
-- Sprint 1: Create Predictions Table
-- ============================================

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Target
  type prediction_type NOT NULL,
  entity_id UUID NOT NULL, -- Route ID for ETA, area ID for demand
  
  -- Prediction
  predicted_value JSONB NOT NULL,
  confidence_score DECIMAL(5, 4),
  
  -- Model version
  model_version VARCHAR(50),
  
  -- Timestamps
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(type);
CREATE INDEX IF NOT EXISTS idx_predictions_entity ON predictions(entity_id);
CREATE INDEX IF NOT EXISTS idx_predictions_valid_until ON predictions(valid_until);

INSERT INTO schema_migrations (version) VALUES ('013_create_predictions') ON CONFLICT DO NOTHING;