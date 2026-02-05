-- Create flight_inquiries table
DO $$ BEGIN
    CREATE TYPE inquiry_priority AS ENUM ('HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('NEW', 'PROCESSING', 'QUOTE_SENT', 'FOLLOW_UP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS flight_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    departure_code TEXT NOT NULL,
    arrival_code TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    priority inquiry_priority NOT NULL DEFAULT 'MEDIUM',
    status inquiry_status NOT NULL DEFAULT 'NEW',
    assignee_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE flight_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
    CREATE POLICY "Enable read access for all authenticated users" ON flight_inquiries
        FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Enable insert for authenticated users" ON flight_inquiries
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Enable update for authenticated users" ON flight_inquiries
        FOR UPDATE USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Enable delete for authenticated users" ON flight_inquiries
        FOR DELETE USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Audit Log Table for Inquiries
CREATE TABLE IF NOT EXISTS flight_inquiry_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES flight_inquiries(id) ON DELETE CASCADE,
    operation TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE flight_inquiry_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Enable read for authenticated users" ON flight_inquiry_audit_logs
        FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trigger for updated_at and audit logging
CREATE OR REPLACE FUNCTION handle_flight_inquiry_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        NEW.updated_at = now();
        INSERT INTO flight_inquiry_audit_logs (inquiry_id, operation, old_data, new_data, changed_by)
        VALUES (OLD.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO flight_inquiry_audit_logs (inquiry_id, operation, new_data, changed_by)
        VALUES (NEW.id, 'CREATE', to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO flight_inquiry_audit_logs (inquiry_id, operation, old_data, changed_by)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER flight_inquiry_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON flight_inquiries
FOR EACH ROW EXECUTE FUNCTION handle_flight_inquiry_change();

-- Seed some data for initial view
INSERT INTO flight_inquiries (inquiry_number, client_name, departure_code, arrival_code, start_date, end_date, priority, status)
VALUES 
('#IF-9021', 'Skyline Travel', 'LHR', 'JFK', '2023-10-15', '2023-10-22', 'HIGH', 'NEW'),
('#IF-9025', 'Elite Holidays', 'FRA', 'BKK', '2024-01-10', '2024-01-25', 'MEDIUM', 'NEW'),
('#IF-9033', 'Corporate Jet', 'DXB', 'SYD', '2023-12-01', '2023-12-08', 'HIGH', 'PROCESSING'),
('#IF-9022', 'Sarah Jenkins', 'DXB', 'SIN', '2023-11-05', '2023-11-12', 'LOW', 'QUOTE_SENT')
ON CONFLICT (inquiry_number) DO NOTHING;

-- Add PNR related fields to flight_inquiries
ALTER TABLE flight_inquiries 
ADD COLUMN IF NOT EXISTS pnr_text TEXT,
ADD COLUMN IF NOT EXISTS pnr_parsed_data JSONB,
ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- Create index for faster PNR lookups
CREATE INDEX IF NOT EXISTS idx_flight_inquiries_pnr_number 
ON flight_inquiries ((pnr_parsed_data->>'pnr_number'));

-- Create storage bucket for PNR previews if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pnr-previews', 'pnr-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to pnr-previews
DO $$ BEGIN
    CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'pnr-previews');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policy to allow authenticated upload
DO $$ BEGIN
    CREATE POLICY "Authenticated Upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'pnr-previews' 
      AND auth.role() = 'authenticated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fix RLS policy for flight_inquiry_audit_logs
-- Allow authenticated users to insert audit logs (needed for the trigger to work)
DO $$ BEGIN
    CREATE POLICY "Enable insert for authenticated users" ON flight_inquiry_audit_logs
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
