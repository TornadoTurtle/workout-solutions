-- =============================================================================
-- Phase 2 Sprint 2a — equipment table, replace exercises.equipment text with FK
-- =============================================================================
-- Way 1 model: every exercise has exactly ONE primary piece of equipment.
-- Variants (Barbell Bench Press vs Dumbbell Bench Press) are separate
-- exercises, each pointing at one equipment row.
--
-- Safe to drop exercises.equipment because the table is empty at migration time
-- (verified via supabase db query before authoring).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- equipment — admin-curated catalog of training equipment
-- -----------------------------------------------------------------------------
-- Shape mirrors muscle_groups: stable uuid id, machine-readable slug, i18n key,
-- coarse category for filtering UIs, sort_order for display.
create table public.equipment (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_key    text not null,
  category    text check (category in ('free-weights','machines','cables','bodyweight','accessories')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index equipment_category_idx on public.equipment (category);


-- -----------------------------------------------------------------------------
-- exercises.equipment_id — replacement FK column
-- -----------------------------------------------------------------------------
-- on delete set null so removing a rarely-used equipment row never silently
-- destroys an exercise definition; admins are forced to re-pick equipment
-- before the next time they edit it.
alter table public.exercises
  add column equipment_id uuid references public.equipment(id) on delete set null;

create index exercises_equipment_id_idx on public.exercises (equipment_id);


-- -----------------------------------------------------------------------------
-- Drop the old free-text column (and its check constraint with it)
-- -----------------------------------------------------------------------------
alter table public.exercises drop column equipment;


-- =============================================================================
-- RLS — same shape as muscle_groups: read-for-authenticated, admin CRUD
-- =============================================================================
alter table public.equipment enable row level security;

create policy equipment_select_authenticated
  on public.equipment for select
  to authenticated
  using (true);

create policy equipment_all_admin
  on public.equipment for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
