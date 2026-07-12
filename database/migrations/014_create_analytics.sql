-- Smart Bus AI — Migration 014: Create Analytics Table
-- Pre-computed analytics / materialized view cache.

CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    period VARCHAR(20) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    value FLOAT NOT NULL,
    dimensions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(metric_name, period, period_start, dimensions)
);

CREATE INDEX idx_analytics_metric_period ON analytics(metric_name, period, period_start);