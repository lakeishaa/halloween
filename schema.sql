-- Run in Supabase SQL Editor once.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  status text not null check (status in ('yes','no','maybe')),
  plus_ones integer not null default 0 check (plus_ones between 0 and 2),
  created_at timestamptz not null default now(),
  constraint no_extra_guests_when_declined check (status <> 'no' or plus_ones = 0)
);
alter table public.rsvps enable row level security;
-- Public guest list: anyone can view names and RSVP status.
create policy "Public can read RSVPs" on public.rsvps for select to anon using (true);
-- Public invitation: anyone with the link can submit an RSVP.
create policy "Public can submit RSVPs" on public.rsvps for insert to anon with check (true);
-- No update/delete policies: visitors cannot edit or delete records.
grant select, insert on public.rsvps to anon;
-- Enable Supabase Realtime (run only once; skip if table is already in publication).
alter publication supabase_realtime add table public.rsvps;
