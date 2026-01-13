-- FIX: Add 'travellers' column and refresh schema cache to resolve PGRST204

-- 1. Add the column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS travellers JSONB DEFAULT '[]'::jsonb NOT NULL;

-- 2. Add a comment to the column (good practice)
COMMENT ON COLUMN bookings.travellers IS 'Array of traveller details for the booking';

-- 3. Migrate existing data: Populate array from legacy flat fields
-- Only runs for rows where travellers is empty AND we have legacy data
UPDATE bookings
SET travellers = jsonb_build_array(
  jsonb_build_object(
    'firstName', "travellerFirstName",
    'lastName', "travellerLastName",
    'passportNumber', "passportNumber",
    'passportExpiry', "passportExpiry",
    'dob', "dob",
    'nationality', "nationality"
  )
)
WHERE travellers = '[]'::jsonb 
  AND "travellerFirstName" IS NOT NULL 
  AND "travellerFirstName" != '';

-- 4. CRITICAL: Refresh the PostgREST schema cache
-- This resolves the "Could not find the 'travellers' column... in the schema cache" error
NOTIFY pgrst, 'reload schema';
