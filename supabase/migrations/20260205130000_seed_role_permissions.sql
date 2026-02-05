-- Seed permissions for Manager (Full Access)
INSERT INTO role_permissions (role_id, module_id, can_view, can_add, can_edit, can_delete)
SELECT id, unnest(ARRAY['flights', 'hotels', 'customers', 'travellers', 'bookings', 'payments', 'manage_booking', 'media', 'routes', 'airlines', 'airports', 'agencies', 'users', 'services']), true, true, true, true
FROM roles WHERE name = 'Manager'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Seed permissions for Staff (View/Add only)
INSERT INTO role_permissions (role_id, module_id, can_view, can_add, can_edit, can_delete)
SELECT id, unnest(ARRAY['flights', 'hotels', 'customers', 'travellers', 'bookings', 'payments', 'manage_booking', 'media', 'routes', 'airlines', 'airports', 'agencies', 'users', 'services']), true, true, false, false
FROM roles WHERE name = 'Staff'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Seed permissions for Sales Agent (View all, Bookings full access)
INSERT INTO role_permissions (role_id, module_id, can_view, can_add, can_edit, can_delete)
SELECT id, unnest(ARRAY['flights', 'hotels', 'customers', 'travellers', 'bookings', 'payments', 'manage_booking', 'media', 'routes', 'airlines', 'airports', 'agencies', 'users', 'services']), true, false, false, false
FROM roles WHERE name = 'Sales Agent'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Update Sales Agent specific permissions
UPDATE role_permissions 
SET can_add = true, can_edit = true 
WHERE module_id IN ('bookings', 'customers') 
AND role_id = (SELECT id FROM roles WHERE name = 'Sales Agent');
