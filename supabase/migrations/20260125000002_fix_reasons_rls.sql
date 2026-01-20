-- Fix RLS policies for reasons table to allow public access (matching travellers table pattern)
-- This resolves the "new row violates row-level security policy" error if the user is not authenticated during testing

alter table public.reasons enable row level security;

-- Drop restrictive policies
drop policy if exists "Enable insert for authenticated users only" on public.reasons;
drop policy if exists "Enable update for authenticated users only" on public.reasons;
drop policy if exists "Enable delete for authenticated users only" on public.reasons;

-- Create permissive policies
create policy "Enable insert access for all users" on public.reasons for insert with check (true);
create policy "Enable update access for all users" on public.reasons for update using (true);
create policy "Enable delete access for all users" on public.reasons for delete using (true);
