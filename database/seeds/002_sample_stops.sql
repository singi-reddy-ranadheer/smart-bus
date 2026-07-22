-- ============================================
-- Seed Data: Stops
-- ============================================

-- Campus Express Stops (CE-101)
INSERT INTO stops (id, name, code, description, latitude, longitude, has_shelter, has_bench, has_lighting)
VALUES
  (gen_random_uuid(), 'Campus Gate', 'CE-101-01', 'Main entrance to the university campus', 17.3850, 78.4867, true, true, true),
  (gen_random_uuid(), 'Library', 'CE-101-02', 'Central library junction', 17.3830, 78.4900, true, true, true),
  (gen_random_uuid(), 'Bus Stand', 'CE-101-03', 'City bus stand near market', 17.3790, 78.4950, true, true, true),
  (gen_random_uuid(), 'Railway Station', 'CE-101-04', 'Main railway station', 17.3750, 78.5000, true, true, true),
  (gen_random_uuid(), 'Airport', 'CE-101-05', 'International airport terminal', 17.3710, 78.5090, true, true, true);

-- City Loop Stops (CL-201)
INSERT INTO stops (id, name, code, description, latitude, longitude, has_shelter, has_bench, has_lighting)
VALUES
  (gen_random_uuid(), 'City Center', 'CL-201-01', 'Central business district', 17.3850, 78.4867, true, true, true),
  (gen_random_uuid(), 'Market', 'CL-201-02', 'Main market area', 17.3820, 78.4840, true, true, true),
  (gen_random_uuid(), 'Hospital', 'CL-201-03', 'City general hospital', 17.3800, 78.4810, true, true, true),
  (gen_random_uuid(), 'University', 'CL-201-04', 'State university campus', 17.3830, 78.4780, true, true, true),
  (gen_random_uuid(), 'Tech Park', 'CL-201-05', 'Information technology park', 17.3870, 78.4820, true, true, true);