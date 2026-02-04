-- Add missing columns for PNR data to flight_inquiries
ALTER TABLE flight_inquiries
ADD COLUMN IF NOT EXISTS pnr_text TEXT,
ADD COLUMN IF NOT EXISTS pnr_parsed_data JSONB,
ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- Fix RLS policy for flight_inquiry_audit_logs
-- Allow authenticated users to insert audit logs (needed for the trigger to work)
DO $$ BEGIN
    CREATE POLICY "Enable insert for authenticated users" ON flight_inquiry_audit_logs
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
