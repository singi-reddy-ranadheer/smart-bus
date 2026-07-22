-- ============================================
-- Sprint 1: Create Notifications Table
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  
  -- Delivery
  channel notification_channel NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, read, failed
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

INSERT INTO schema_migrations (version) VALUES ('011_create_notifications') ON CONFLICT DO NOTHING;