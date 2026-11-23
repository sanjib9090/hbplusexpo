-- Run in the Supabase SQL editor for this project. Safe to re-run.
-- Supabase Auth stores the verified account; this table stores user-entered profile data.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  phone text check (phone is null or char_length(phone) <= 30),
  updated_at timestamptz not null default now()
);
-- Existing profiles tables are not changed by CREATE TABLE IF NOT EXISTS.
-- Add missing fields without overwriting existing data. Existing incomplete rows
-- stay nullable and are prompted to complete their name by the app.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

-- Authorize using Supabase-signed claims, not Google tokens decoded by the app.
-- Only the owner and a Google provider with an allowed email domain may access a row.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated
using (id = auth.uid() and auth.jwt()->'app_metadata'->>'provider' = 'google' and coalesce(auth.jwt()->>'email', '') ~* '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com)$');
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles for insert to authenticated
with check (id = auth.uid() and auth.jwt()->'app_metadata'->>'provider' = 'google' and coalesce(auth.jwt()->>'email', '') ~* '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com)$');
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update to authenticated
using (id = auth.uid() and auth.jwt()->'app_metadata'->>'provider' = 'google' and coalesce(auth.jwt()->>'email', '') ~* '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com)$')
with check (id = auth.uid() and auth.jwt()->'app_metadata'->>'provider' = 'google' and coalesce(auth.jwt()->>'email', '') ~* '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com)$');

create or replace function public.set_profile_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists set_profile_updated_at on public.profiles;
create trigger set_profile_updated_at before update on public.profiles
for each row execute function public.set_profile_updated_at();
