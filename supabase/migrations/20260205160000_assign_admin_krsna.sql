-- Grant Admin Access to krsna@skytrips.com.au
-- This script looks up the user by email and assigns the 'admin' role in user_roles

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- 1. Find the user ID from auth.users
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = 'krsna@skytrips.com.au';

    -- 2. If user exists, assign admin role
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'admin', updated_at = now();
        
        RAISE NOTICE 'Successfully granted Admin access to krsna@skytrips.com.au (User ID: %)', target_user_id;
    ELSE
        RAISE WARNING 'User krsna@skytrips.com.au not found in auth.users. Please sign up first.';
    END IF;
END $$;
