-- Targeted fix for an existing public.profiles table. No existing data is overwritten.
-- This expects profiles.id to be the UUID of the signed-in auth user.
-- Review existing column types, required columns and RLS policies separately.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists updated_at timestamptz default now();
