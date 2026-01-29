-- Add new columns to routes table
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS average_flight_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS distance VARCHAR(50),
ADD COLUMN IF NOT EXISTS cheapest_month VARCHAR(20),
ADD COLUMN IF NOT EXISTS daily_flights INTEGER,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS other_popular_routes JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN routes.average_flight_time IS 'Average duration of the flight (e.g., "2h 30m")';
COMMENT ON COLUMN routes.distance IS 'Distance of the flight (e.g., "1200 km")';
COMMENT ON COLUMN routes.cheapest_month IS 'Cheapest month to fly (e.g., "January")';
COMMENT ON COLUMN routes.daily_flights IS 'Number of flights per day';
COMMENT ON COLUMN routes.featured_image IS 'URL of the featured image for the route';
COMMENT ON COLUMN routes.description IS 'Description of the route';
COMMENT ON COLUMN routes.other_popular_routes IS 'List of other popular routes related to this route (JSON array of objects)';
