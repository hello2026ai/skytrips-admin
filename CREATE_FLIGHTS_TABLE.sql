-- Create flights table
CREATE TABLE IF NOT EXISTS public.flights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    airline_id UUID REFERENCES public.airlines(id) ON DELETE SET NULL,
    flight_number VARCHAR(20) NOT NULL,
    departure_airport VARCHAR(3) NOT NULL,
    arrival_airport VARCHAR(3) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Scheduled',
    aircraft_type VARCHAR(50),
    capacity INTEGER,
    available_seats INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS flights_airline_id_idx ON public.flights(airline_id);
CREATE INDEX IF NOT EXISTS flights_departure_airport_idx ON public.flights(departure_airport);
CREATE INDEX IF NOT EXISTS flights_arrival_airport_idx ON public.flights(arrival_airport);
CREATE INDEX IF NOT EXISTS flights_departure_time_idx ON public.flights(departure_time);

-- Enable RLS (optional but recommended, allowing all for admin panel for now)
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- Create policy for full access (adjust as needed for production)
CREATE POLICY "Enable all access for authenticated users" ON public.flights
    FOR ALL USING (auth.role() = 'authenticated');
