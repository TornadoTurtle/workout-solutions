-- =============================================================================
-- Phase 2 Sprint 1 — initial schema
-- =============================================================================
-- Foundation tables + workout assignment, no logbook yet.
-- All tables created in this migration ship with RLS enabled and explicit
-- policies. NO table is publicly readable. The auth role used everywhere is
-- the per-request `auth.uid()` returned by Supabase Auth.
--
-- Role model:
--   - 'admin'  = Roy (full CRUD across catalog + clients + workouts)
--   - 'client' = end users (read their own profile, their assigned workouts,
--                and the catalog of exercises/muscle_groups)
--
-- A user's role is stored on `profiles.role`. Clients CANNOT escalate their
-- own role via UPDATE — protected by trigger `profiles_prevent_role_escalation`
-- (RLS WITH CHECK alone cannot read OLD, so trigger is the right tool here).
-- =============================================================================


-- =============================================================================
-- TABLES
-- =============================================================================
-- Tables come before helper functions because is_admin() declares its body as
-- `language sql`, which makes Postgres validate that `public.profiles` exists
-- at function-creation time. Creating the table first removes that ordering
-- constraint and keeps the helper close to the trigger that consumes it.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- muscle_groups — i18n-keyed catalog of muscle targets
-- -----------------------------------------------------------------------------
create table public.muscle_groups (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_key    text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- profiles — 1:1 with auth.users, holds role + display info
-- -----------------------------------------------------------------------------
-- on delete cascade so removing the auth user removes the profile too.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'client' check (role in ('admin','client')),
  full_name   text,
  locale      text not null default 'en' check (locale in ('en','de','es')),
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- clients — coaching-specific data for users with role='client'
-- -----------------------------------------------------------------------------
-- profile_id is also the PK to enforce 1:1 with profiles.
create table public.clients (
  profile_id   uuid primary key references public.profiles(id) on delete cascade,
  goal         text,
  status       text not null default 'active' check (status in ('active','paused','archived')),
  coach_notes  text,
  created_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- exercises — admin-curated catalog
-- -----------------------------------------------------------------------------
-- gif_url points to Supabase Storage (set later in Sprint N).
-- created_by goes to set null on profile delete so we don't lose history.
create table public.exercises (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name_key        text not null,
  description_key text,
  gif_url         text,
  equipment       text check (equipment in ('barbell','dumbbell','machine','bodyweight','cable','other')),
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- exercise_muscle_groups — many-to-many with role (primary/secondary)
-- -----------------------------------------------------------------------------
-- Composite PK includes role so the same muscle can appear as primary
-- in one row and secondary in another (we won't write that pattern, but it's
-- structurally valid and the constraint reflects intent).
create table public.exercise_muscle_groups (
  exercise_id     uuid not null references public.exercises(id) on delete cascade,
  muscle_group_id uuid not null references public.muscle_groups(id) on delete cascade,
  role            text not null check (role in ('primary','secondary')),
  primary key (exercise_id, muscle_group_id, role)
);

-- -----------------------------------------------------------------------------
-- workouts — admin-curated templates ("Push Day", etc.)
-- -----------------------------------------------------------------------------
-- owner_id is the admin who authored the workout.
create table public.workouts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- workout_exercises — ordered list of exercises inside a workout
-- -----------------------------------------------------------------------------
-- ON DELETE RESTRICT on exercise_id so an exercise in active use can't vanish
-- silently — admins must consciously remove or replace it.
create table public.workout_exercises (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid not null references public.workouts(id) on delete cascade,
  exercise_id   uuid not null references public.exercises(id) on delete restrict,
  sets          int  not null check (sets > 0),
  reps_min      int  check (reps_min > 0),
  reps_max      int  check (reps_max >= reps_min),
  rest_seconds  int  check (rest_seconds >= 0),
  sort_order    int  not null default 0,
  notes         text,
  created_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- client_workouts — many-to-many assignment (which workouts each client gets)
-- -----------------------------------------------------------------------------
create table public.client_workouts (
  client_id    uuid not null references public.clients(profile_id) on delete cascade,
  workout_id   uuid not null references public.workouts(id) on delete cascade,
  assigned_at  timestamptz not null default now(),
  primary key (client_id, workout_id)
);


-- =============================================================================
-- INDEXES (FK lookup paths used heavily by policies + reads)
-- =============================================================================
create index profiles_role_idx              on public.profiles (role);
create index exercises_equipment_idx        on public.exercises (equipment);
create index exercise_mg_muscle_idx         on public.exercise_muscle_groups (muscle_group_id);
create index workouts_owner_idx             on public.workouts (owner_id);
create index workout_exercises_workout_idx  on public.workout_exercises (workout_id, sort_order);
create index workout_exercises_exercise_idx on public.workout_exercises (exercise_id);
create index client_workouts_workout_idx    on public.client_workouts (workout_id);


-- =============================================================================
-- Helper: is_admin()
-- =============================================================================
-- SECURITY DEFINER so the function can read profiles regardless of the caller's
-- RLS policies (otherwise the policies that USE is_admin would recurse on the
-- very table they're protecting). `set search_path = ''` prevents shadowing
-- by a malicious schema on the call path.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;


-- =============================================================================
-- Trigger: prevent clients from escalating their own role
-- =============================================================================
-- WITH CHECK in an RLS UPDATE policy can't reference OLD.role, so a client
-- could otherwise issue `update profiles set role='admin' where id=auth.uid()`
-- and the WITH CHECK on the new row would happily pass (id matches auth.uid()).
-- We close that hole here: if role changes and the caller isn't admin, fail.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if NEW.role is distinct from OLD.role then
    if not public.is_admin() then
      raise exception 'role cannot be changed by non-admin users'
        using errcode = '42501';
    end if;
  end if;
  return NEW;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_role_self_escalation();


-- =============================================================================
-- RLS — enable on every table, then attach policies
-- =============================================================================
alter table public.muscle_groups            enable row level security;
alter table public.profiles                 enable row level security;
alter table public.clients                  enable row level security;
alter table public.exercises                enable row level security;
alter table public.exercise_muscle_groups   enable row level security;
alter table public.workouts                 enable row level security;
alter table public.workout_exercises        enable row level security;
alter table public.client_workouts          enable row level security;


-- -----------------------------------------------------------------------------
-- profiles policies
-- -----------------------------------------------------------------------------
-- Users can read their own row. Admins can read every row.
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy profiles_select_admin
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Users can update their own row. The role column is guarded by the trigger
-- above, so this policy only needs to scope the row.
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Admins can update any profile (including role changes).
create policy profiles_update_admin
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No INSERT/DELETE policy for clients — rows are created by a Supabase Auth
-- trigger (added in a later migration) and never deleted from the app.
-- Admins can do both.
create policy profiles_insert_admin
  on public.profiles for insert
  to authenticated
  with check (public.is_admin());

create policy profiles_delete_admin
  on public.profiles for delete
  to authenticated
  using (public.is_admin());


-- -----------------------------------------------------------------------------
-- clients policies
-- -----------------------------------------------------------------------------
-- Clients can SELECT/UPDATE their own row. INSERT/DELETE only via admin
-- (client rows are created when Roy onboards the client).
create policy clients_select_own
  on public.clients for select
  to authenticated
  using (profile_id = auth.uid());

create policy clients_update_own
  on public.clients for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy clients_all_admin
  on public.clients for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- muscle_groups policies — catalog visible to all authenticated, admin CRUD
-- -----------------------------------------------------------------------------
create policy muscle_groups_select_authenticated
  on public.muscle_groups for select
  to authenticated
  using (true);

create policy muscle_groups_all_admin
  on public.muscle_groups for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- exercises policies — same shape as muscle_groups
-- -----------------------------------------------------------------------------
create policy exercises_select_authenticated
  on public.exercises for select
  to authenticated
  using (true);

create policy exercises_all_admin
  on public.exercises for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- exercise_muscle_groups policies
-- -----------------------------------------------------------------------------
create policy emg_select_authenticated
  on public.exercise_muscle_groups for select
  to authenticated
  using (true);

create policy emg_all_admin
  on public.exercise_muscle_groups for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- workouts policies
-- -----------------------------------------------------------------------------
-- Clients see only workouts assigned to them via client_workouts.
-- Admins: full CRUD.
create policy workouts_select_assigned
  on public.workouts for select
  to authenticated
  using (
    exists (
      select 1
      from public.client_workouts cw
      where cw.workout_id = workouts.id
        and cw.client_id  = auth.uid()
    )
  );

create policy workouts_all_admin
  on public.workouts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- workout_exercises policies
-- -----------------------------------------------------------------------------
-- Clients see only rows whose workout is assigned to them.
create policy workout_exercises_select_assigned
  on public.workout_exercises for select
  to authenticated
  using (
    exists (
      select 1
      from public.client_workouts cw
      where cw.workout_id = workout_exercises.workout_id
        and cw.client_id  = auth.uid()
    )
  );

create policy workout_exercises_all_admin
  on public.workout_exercises for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- client_workouts policies
-- -----------------------------------------------------------------------------
-- Clients can only SEE their own assignments. They can't insert/delete
-- (admins do the assigning).
create policy client_workouts_select_own
  on public.client_workouts for select
  to authenticated
  using (client_id = auth.uid());

create policy client_workouts_all_admin
  on public.client_workouts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
