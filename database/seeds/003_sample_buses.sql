-- Smart Bus AI — Seed 003: Sample Buses
-- Creates 3 buses for the demo simulation.

INSERT INTO buses (id, plate_number, bus_number, capacity, model, year, color, status, current_route_id) VALUES
(
    'c1d2e3f4-0001-4000-8000-000000000001',
    'KA-01-AB-1234',
    'BUS-001',
    50,
    'Tata Starbus',
    2023,
    '#E4572E',
    'active',
    'a1b2c3d4-0001-4000-8000-000000000001'
),
(
    'c1d2e3f4-0002-4000-8000-000000000002',
    'KA-01-CD-5678',
    'BUS-002',
    50,
    'Tata Starbus',
    2023,
    '#E4572E',
    'active',
    'a1b2c3d4-0001-4000-8000-000000000001'
),
(
    'c1d2e3f4-0003-4000-8000-000000000003',
    'KA-01-EF-9012',
    'BUS-003',
    40,
    'Ashok Leyland',
    2024,
    '#7C3AED',
    'active',
    'a1b2c3d4-0002-4000-8000-000000000002'
);