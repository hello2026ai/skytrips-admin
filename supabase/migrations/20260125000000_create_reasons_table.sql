create table if not exists public.reasons (
    id uuid not null default gen_random_uuid(),
    code text not null,
    title text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint reasons_pkey primary key (id),
    constraint reasons_code_key unique (code)
);

-- Add RLS policies
alter table public.reasons enable row level security;

create policy "Enable read access for all users"
on public.reasons for select
using (true);

create policy "Enable insert for authenticated users only"
on public.reasons for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on public.reasons for update
using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only"
on public.reasons for delete
using (auth.role() = 'authenticated');
