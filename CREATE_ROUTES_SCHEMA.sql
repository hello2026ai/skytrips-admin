-- SQL Schema for the 'routes' table based on the RouteForm and Route type definition

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Route Information
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    
    -- Hero Section
    hero_headline TEXT,
    hero_subtitle TEXT,
    
    -- Route Details
    average_flight_time TEXT,
    distance TEXT,
    cheapest_month TEXT,
    daily_flights INTEGER,
    
    -- Media & Content
    featured_image TEXT,
    description TEXT,
    
    -- Relationships
    -- Stores an array of related route IDs or objects
    other_popular_routes JSONB DEFAULT '[]'::jsonb,
    
    -- FAQs
    -- Stores an array of objects: [{"question": "...", "answer": "..."}]
    faqs JSONB DEFAULT '[]'::jsonb,
    
    -- SEO Fields
    seo_title TEXT,
    meta_description TEXT,
    slug TEXT UNIQUE,
    canonical_url TEXT,
    schema_markup TEXT,
    
    -- Robots Meta Settings
    -- Stores boolean flags: {"no_index": false, "no_follow": false, ...}
    robots_meta JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on the slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_routes_slug ON routes(slug);

-- Create an index on departure and arrival airports for search performance
CREATE INDEX IF NOT EXISTS idx_routes_departure_airport ON routes(departure_airport);
CREATE INDEX IF NOT EXISTS idx_routes_arrival_airport ON routes(arrival_airport);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON COLUMN routes.other_popular_routes IS 'JSONB array of related route objects or IDs';
COMMENT ON COLUMN routes.faqs IS 'JSONB array of FAQ objects with question and answer fields';
COMMENT ON COLUMN routes.robots_meta IS 'JSONB object containing boolean flags for SEO robots settings';
