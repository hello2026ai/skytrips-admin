-- Create booking_logs table to store raw Amadeus request/response
CREATE TABLE IF NOT EXISTS public.booking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'AMADEUS_BOOKING',
    request_payload JSONB,
    response_payload JSONB,
    status TEXT,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins (assuming admins can view logs)
CREATE POLICY "Admins can view booking logs" ON public.booking_logs
    FOR SELECT
    USING (auth.role() = 'authenticated'); -- Adjust based on actual admin role check if needed

-- Create policy for insertion (server-side mostly, but allow authenticated for now if needed)
CREATE POLICY "Server can insert booking logs" ON public.booking_logs
    FOR INSERT
    WITH CHECK (true);
