# Sky Trips Admin Dashboard - Supabase Setup Guide

## Database Setup

To enable role-based authentication, you need to create a `user_roles` table in your Supabase project.

### 1. Create the user_roles table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create user_roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own role
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to insert/update
CREATE POLICY "Service role can manage roles"
  ON user_roles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

### 2. Create an admin user

After creating a user in Supabase Auth, assign them the admin role:

```sql
-- Insert admin role for a specific user (replace with actual user ID)
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin', updated_at = NOW();
```

### 3. Automatic role assignment (Optional)

You can create a trigger to automatically assign 'user' role to new signups:

```sql
-- Create function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Environment Variables

Make sure to update `.env.local` with your actual Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Update `.env.local` with these values

## Creating Admin Users

### Option 1: Via Supabase Dashboard

1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password
4. After user is created, copy the User ID
5. Go to Table Editor > user_roles
6. Insert a new row with the User ID and role='admin'

### Option 2: Via SQL

```sql
-- First, create the user via Supabase Auth UI or API
-- Then run this SQL with the user's ID:
INSERT INTO user_roles (user_id, role)
VALUES ('paste-user-id-here', 'admin');
```

## Testing

1. Create a test admin user in Supabase
2. Assign admin role using the methods above
3. Try logging in with the admin credentials
4. Verify that non-admin users are denied access

## Security Notes

- Authentication is handled client-side through Supabase Auth
- The dashboard layout component verifies both authentication and admin role
- Non-admin users are automatically signed out and redirected to login
- All dashboard routes are protected by client-side checks
- Sessions are managed securely by Supabase
- User authentication state is tracked in real-time through Supabase listeners
