-- 1. Add 'roles' module permissions to Manager role if missing
INSERT INTO role_permissions (role_id, module_id, can_view, can_add, can_edit, can_delete)
SELECT id, 'roles', true, true, true, true
FROM roles WHERE name = 'Manager'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- 2. Secure 'roles' table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop loose policies
DROP POLICY IF EXISTS "Allow insert/update/delete for authenticated users" ON roles;

-- Create strict admin-only write policy
CREATE POLICY "Admins can manage roles" ON roles
    FOR ALL
    USING (is_admin());

-- Keep read access open for authenticated users (needed for permission checking)
-- But we can optimize it later. For now, authenticated read is fine.


-- 3. Secure 'role_permissions' table
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Drop loose policies
DROP POLICY IF EXISTS "Allow insert/update/delete for authenticated users" ON role_permissions;

-- Create strict admin-only write policy
CREATE POLICY "Admins can manage role permissions" ON role_permissions
    FOR ALL
    USING (is_admin());

-- Ensure function is accessible (redundant but safe)
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
