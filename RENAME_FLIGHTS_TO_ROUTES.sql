-- Rename table
ALTER TABLE IF EXISTS public.flights RENAME TO routes;

-- Rename indexes (optional but good for consistency)
ALTER INDEX IF EXISTS flights_airline_id_idx RENAME TO routes_airline_id_idx;
ALTER INDEX IF EXISTS flights_departure_airport_idx RENAME TO routes_departure_airport_idx;
ALTER INDEX IF EXISTS flights_arrival_airport_idx RENAME TO routes_arrival_airport_idx;
ALTER INDEX IF EXISTS flights_departure_time_idx RENAME TO routes_departure_time_idx;
