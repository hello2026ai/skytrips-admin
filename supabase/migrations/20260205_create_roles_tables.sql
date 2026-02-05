-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow read access for authenticated users" ON roles
        FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow insert/update/delete for authenticated users" ON roles
        FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_add BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role_id, module_id)
);

-- Enable RLS for role_permissions
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow read access for authenticated users" ON role_permissions
        FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow insert/update/delete for authenticated users" ON role_permissions
        FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trigger to update updated_at on roles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial roles
INSERT INTO roles (name, description, is_system)
VALUES 
    ('Manager', 'Full system access', true),
    ('Staff', 'Operational tasks', true),
    ('Sales Agent', 'Booking focus', true)
ON CONFLICT (name) DO NOTHING;
