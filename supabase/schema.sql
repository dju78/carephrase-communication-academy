-- CarePhrase Communication Academy — database schema (MVP)
-- Run this in the Supabase SQL editor (or via the CLI) after creating a project.

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, holds role + display name.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  -- Learner is the only active role in the MVP. Supervisor/admin are reserved
  -- for future releases (designed, not built).
  role text not null default 'learner'
    check (role in ('learner', 'supervisor', 'administrator')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- attempts: one row per scenario practice attempt.
-- ---------------------------------------------------------------------------
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null,
  scenario_id text not null,
  transcript text not null,
  total_score integer not null check (total_score between 0 and 100),
  scores jsonb not null,
  feedback jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_id_created_at_idx
  on public.attempts (user_id, created_at desc);

alter table public.attempts enable row level security;

drop policy if exists "Users can view own attempts" on public.attempts;
create policy "Users can view own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own attempts" on public.attempts;
create policy "Users can insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Role grants.
-- RLS policies decide WHICH rows a user sees; the role still needs table-level
-- privileges to touch the table at all. We grant only to `authenticated` —
-- logged-out (`anon`) users have no access to either table by design.
-- (Safe to run repeatedly; harmless if the grants already exist.)
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.attempts to authenticated;

-- ---------------------------------------------------------------------------
-- pilot_access_requests: public lead-capture form (no login required).
-- Anyone may INSERT a request; nobody may read them via the API — leads are
-- viewed in the Supabase dashboard (service role bypasses RLS).
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_access_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  job_title text not null,
  organisation_name text not null,
  work_email text not null,
  phone_number text,
  organisation_type text not null,
  staff_count text not null,
  academy_interest text not null,
  additional_information text,
  consent boolean not null default false
);

alter table public.pilot_access_requests enable row level security;

-- Allow inserts from logged-out (anon) and logged-in (authenticated) visitors.
grant insert on public.pilot_access_requests to anon, authenticated;

drop policy if exists "Anyone can submit a pilot request" on public.pilot_access_requests;
create policy "Anyone can submit a pilot request"
  on public.pilot_access_requests for insert
  to anon, authenticated
  with check (consent = true);
