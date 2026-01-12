-- Add index on customerid for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customerid ON bookings(customerid);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own bookings
-- This assumes customers.id is linked to auth.users.id
-- If customers.id is NOT auth.uid(), we might need to join with customers on email
-- For now, we assume standard Supabase setup where profile ID matches Auth ID,
-- OR we allow based on the customerid field.
-- Note: If we want to be safe and customers.id != auth.uid(), we can use:
-- customerid IN (SELECT id FROM customers WHERE email = (select email from auth.users where id = auth.uid()))

-- Let's try the safer email-based policy first, as customers table has email.
-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Customers can view own bookings" ON bookings;

CREATE POLICY "Customers can view own bookings" ON bookings
FOR SELECT
TO authenticated
USING (
  customerid IN (
    SELECT id FROM customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Also allow inserting own bookings?
DROP POLICY IF EXISTS "Customers can insert own bookings" ON bookings;
CREATE POLICY "Customers can insert own bookings" ON bookings
FOR INSERT
TO authenticated
WITH CHECK (
  customerid IN (
    SELECT id FROM customers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);
