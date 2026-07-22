-- ============================================
-- Seed Data: Drivers
-- ============================================
-- Note: Users must be created first since drivers.user_id references users.id
-- Create users with driver role first, then reference them here

-- Driver 1
INSERT INTO users (id, email, phone, full_name, role, is_email_verified, is_phone_verified)
VALUES (gen_random_uuid(), 'driver1@smartbus.ai', '+919876543210', 'Ramesh Kumar', 'driver', true, true);

-- Driver 2
INSERT INTO users (id, email, phone, full_name, role, is_email_verified, is_phone_verified)
VALUES (gen_random_uuid(), 'driver2@smartbus.ai', '+919876543211', 'Suresh Babu', 'driver', true, true);

-- Now create driver records referencing the users
-- (In practice, you'd query the user IDs; here we use CTEs for clarity)
WITH driver1 AS (
  SELECT id FROM users WHERE email = 'driver1@smartbus.ai'
), driver2 AS (
  SELECT id FROM users WHERE email = 'driver2@smartbus.ai'
)
INSERT INTO drivers (user_id, license_number, license_expiry, is_available, current_bus_id)
SELECT id, 'TS-2023-001', '2028-12-31', true, (SELECT id FROM buses WHERE registration_number = 'TS-01-AB-1234')
FROM driver1
UNION ALL
SELECT id, 'TS-2023-002', '2029-06-30', true, (SELECT id FROM buses WHERE registration_number = 'TS-01-CD-5678')
FROM driver2;