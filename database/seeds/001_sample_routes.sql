-- Smart Bus AI — Seed 001: Sample Routes
-- Creates 2 bus routes for the demo.

INSERT INTO routes (id, name, description, color, total_distance, estimated_duration, status) VALUES
(
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Campus Express',
    'Connects campus main gate to airport via library, bus stand, and railway station.',
    '#E4572E',
    12.5,
    35,
    'active'
),
(
    'a1b2c3d4-0002-4000-8000-000000000002',
    'City Loop',
    'Circular route connecting city center to major landmarks including market, hospital, university, and tech park.',
    '#7C3AED',
    15.0,
    45,
    'active'
);