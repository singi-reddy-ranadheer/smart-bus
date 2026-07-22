-- ============================================
-- Seed Data: Buses
-- ============================================

INSERT INTO buses (id, registration_number, model, capacity, status, current_latitude, current_longitude)
VALUES
  (gen_random_uuid(), 'TS-01-AB-1234', 'Tata Marcopolo', 40, 'active', 17.3850, 78.4867),
  (gen_random_uuid(), 'TS-01-CD-5678', 'Ashok Leyland', 40, 'active', 17.3830, 78.4900),
  (gen_random_uuid(), 'TS-01-EF-9012', 'Volvo', 35, 'active', 17.3850, 78.4867);