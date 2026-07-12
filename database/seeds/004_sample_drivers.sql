-- Smart Bus AI — Seed 004: Sample Drivers
-- Creates 2 drivers for the demo simulation.
-- Note: user IDs should be replaced with actual Supabase Auth user IDs after registration.

INSERT INTO drivers (id, user_id, license_number, license_expiry, assigned_bus_id, status, total_trips) VALUES
(
    'd1e2f3a4-0001-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000', -- REPLACE with actual user_id after creating driver accounts
    'DL-KA-2023-001234',
    '2028-12-31',
    'c1d2e3f4-0001-4000-8000-000000000001',
    'available',
    0
),
(
    'd1e2f3a4-0002-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000', -- REPLACE with actual user_id after creating driver accounts
    'DL-KA-2024-005678',
    '2029-06-30',
    'c1d2e3f4-0003-4000-8000-000000000003',
    'available',
    0
);