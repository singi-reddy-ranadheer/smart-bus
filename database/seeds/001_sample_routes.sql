-- ============================================
-- Seed Data: Routes
-- ============================================

-- Route 1: Campus Express
INSERT INTO routes (id, name, code, description, color, start_latitude, start_longitude, end_latitude, end_longitude, distance_km, estimated_duration_minutes)
VALUES (
  gen_random_uuid(),
  'Campus Express',
  'CE-101',
  'Connects campus gate to airport via key landmarks',
  '#10B981',
  17.3850, 78.4867, -- Start: Campus Gate
  17.3710, 78.5090, -- End: Airport
  12.0,
  35
);

-- Route 2: City Loop
INSERT INTO routes (id, name, code, description, color, start_latitude, start_longitude, end_latitude, end_longitude, distance_km, estimated_duration_minutes)
VALUES (
  gen_random_uuid(),
  'City Loop',
  'CL-201',
  'Circular route covering city center, market, hospital, university and tech park',
  '#F59E0B',
  17.3850, 78.4867, -- Start: City Center
  17.3850, 78.4867, -- End: City Center (loop)
  15.0,
  45
);