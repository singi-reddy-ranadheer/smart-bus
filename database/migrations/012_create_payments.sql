-- ============================================
-- Sprint 1: Create Payments Table
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  
  -- Amount
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Payment details
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_trip ON payments(trip_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

INSERT INTO schema_migrations (version) VALUES ('012_create_payments') ON CONFLICT DO NOTHING;