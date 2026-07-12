-- Smart Bus AI — Seed 002: Sample Stops
-- Creates 10 bus stops across 2 routes.

INSERT INTO stops (id, name, latitude, longitude, landmark, is_terminal) VALUES
-- Route 1: Campus Express stops (IDs 0001-0005)
(
    'b1c2d3e4-0001-4000-8000-000000000001',
    'Campus Gate',
    12.9716,
    77.5946,
    'Main University Entrance',
    true
),
(
    'b1c2d3e4-0002-4000-8000-000000000002',
    'Library',
    12.9740,
    77.5950,
    'Central Library Building',
    false
),
(
    'b1c2d3e4-0003-4000-8000-000000000003',
    'Bus Stand',
    12.9750,
    77.6000,
    'City Bus Terminal',
    false
),
(
    'b1c2d3e4-0004-4000-8000-000000000004',
    'Railway Station',
    12.9780,
    77.6100,
    'Main Railway Station',
    false
),
(
    'b1c2d3e4-0005-4000-8000-000000000005',
    'Airport',
    13.0000,
    77.6500,
    'Kempegowda International Airport',
    true
),

-- Route 2: City Loop stops (IDs 0006-0010)
(
    'b1c2d3e4-0006-4000-8000-000000000006',
    'City Center',
    12.9650,
    77.5900,
    'MG Road Metro Station',
    true
),
(
    'b1c2d3e4-0007-4000-8000-000000000007',
    'Market',
    12.9670,
    77.5920,
    'KR Market',
    false
),
(
    'b1c2d3e4-0008-4000-8000-000000000008',
    'Hospital',
    12.9690,
    77.5960,
    'City General Hospital',
    false
),
(
    'b1c2d3e4-0009-4000-8000-000000000009',
    'University',
    12.9720,
    77.5980,
    'State University Campus',
    false
),
(
    'b1c2d3e4-0010-4000-8000-000000000010',
    'Tech Park',
    12.9680,
    77.6020,
    'IT Business Park',
    true
);

-- Link stops to routes with ordering
INSERT INTO route_stops (route_id, stop_id, stop_order, distance_from_prev, time_from_prev) VALUES
-- Campus Express: Campus Gate (1) → Library (2) → Bus Stand (3) → Railway Station (4) → Airport (5)
('a1b2c3d4-0001-4000-8000-000000000001', 'b1c2d3e4-0001-4000-8000-000000000001', 1, 0, 0),
('a1b2c3d4-0001-4000-8000-000000000001', 'b1c2d3e4-0002-4000-8000-000000000002', 2, 1.2, 5),
('a1b2c3d4-0001-4000-8000-000000000001', 'b1c2d3e4-0003-4000-8000-000000000003', 3, 2.5, 8),
('a1b2c3d4-0001-4000-8000-000000000001', 'b1c2d3e4-0004-4000-8000-000000000004', 4, 3.0, 10),
('a1b2c3d4-0001-4000-8000-000000000001', 'b1c2d3e4-0005-4000-8000-000000000005', 5, 5.8, 12),

-- City Loop: City Center (1) → Market (2) → Hospital (3) → University (4) → Tech Park (5) → back to City Center (6)
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0006-4000-8000-000000000006', 1, 0, 0),
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0007-4000-8000-000000000007', 2, 1.0, 5),
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0008-4000-8000-000000000008', 3, 1.5, 7),
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0009-4000-8000-000000000009', 4, 2.0, 8),
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0010-4000-8000-000000000010', 5, 2.5, 10),
('a1b2c3d4-0002-4000-8000-000000000002', 'b1c2d3e4-0006-4000-8000-000000000006', 6, 8.0, 15);