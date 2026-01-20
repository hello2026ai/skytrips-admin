-- Force public access for reasons table
-- This overrides any previous restrictive policies from consolidated migrations

ALTER TABLE public.reasons ENABLE ROW LEVEL SECURITY;

-- 1. Drop ALL possible existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reasons;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reasons;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.reasons;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.reasons;

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.reasons;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.reasons;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.reasons;

-- 2. Create PERMISSIVE policies (Public Access)
-- This allows both authenticated and anonymous users to manage reasons
CREATE POLICY "Public read access" ON public.reasons FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.reasons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.reasons FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.reasons FOR DELETE USING (true);
