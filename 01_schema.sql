-- =====================================================================
-- FITLIFE AI - Fase 2 - Parte 1: tipos e tabelas
-- Rodar no Supabase: SQL Editor > New query > colar > Run.
-- Projeto NOVO e vazio. Rode as partes na ordem: 01, 02, 03.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type biological_sex      as enum ('male','female');
create type experience_level    as enum ('beginner','intermediate','advanced');
create type subscription_tier   as enum ('free','premium');
create type goal_type           as enum ('weight_loss','hypertrophy','recomposition','conditioning','maintenance');
create type work_pattern        as enum ('day','night','shift','none');
create type schedule_kind       as enum ('work','gym','meal');
create type restriction_kind    as enum ('injury','pain','movement_limitation','health_condition','medical_restriction','pregnancy');
create type muscle_group        as enum ('chest','back','shoulders','biceps','triceps','legs','glutes','abs','calves','cardio');
create type difficulty_level    as enum ('easy','medium','hard');
create type workout_split       as enum ('full_body','abc','abcd','abcde','upper_lower');
create type plan_origin         as enum ('system','user');
create type message_role        as enum ('user','assistant','system');

-- ---------- FUNÇÃO updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- PERFIL ----------
create table public.user_profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  full_name               text not null default '',
  birth_date              date,
  biological_sex          biological_sex,
  height_cm               numeric(5,1) check (height_cm is null or height_cm between 100 and 250),
  current_weight_kg       numeric(5,2) check (current_weight_kg is null or current_weight_kg between 25 and 400),
  experience_level        experience_level,
  subscription_tier       subscription_tier not null default 'free',
  onboarding_completed_at timestamptz,
  lgpd_consent_at         timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table public.user_goals (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.user_profiles(id) on delete cascade,
  primary_goal        goal_type not null,
  target_weight_kg    numeric(5,2) check (target_weight_kg is null or target_weight_kg between 25 and 400),
  weekly_training_days smallint check (weekly_training_days between 1 and 7),
  session_minutes     smallint check (session_minutes between 15 and 240),
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index user_goals_user_idx on public.user_goals(user_id);
create unique index user_goals_one_active_idx on public.user_goals(user_id) where is_active;

create table public.user_routines (
  user_id           uuid primary key references public.user_profiles(id) on delete cascade,
  wake_time         time,
  sleep_time        time,
  work_pattern      work_pattern not null default 'day',
  meals_per_day     smallint check (meals_per_day between 1 and 10),
  water_goal_ml     integer check (water_goal_ml between 500 and 10000),
  usual_foods       text[] not null default '{}',
  food_preferences  text[] not null default '{}',
  food_restrictions text[] not null default '{}',
  allergies         text[] not null default '{}',
  training_location text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Horários flexíveis (trabalho, academia, refeições), inclusive noturno/turnos.
create table public.user_schedules (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.user_profiles(id) on delete cascade,
  kind       schedule_kind not null,
  weekday    smallint not null check (weekday between 0 and 6), -- 0 = domingo
  start_time time not null,
  end_time   time,         -- pode ser menor que start_time (vira a madrugada)
  label      text,
  created_at timestamptz not null default now()
);
create index user_schedules_user_kind_idx on public.user_schedules(user_id, kind);

create table public.health_restrictions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  kind        restriction_kind not null,
  body_area   text,
  description text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index health_restrictions_user_idx on public.health_restrictions(user_id) where is_active;

-- ---------- EQUIPAMENTOS E ACADEMIA ----------
create table public.equipment (
  id       uuid primary key default gen_random_uuid(),
  name     text not null unique,
  category text not null,   -- ex.: peso livre, máquina, polia, banco, cardio
  created_at timestamptz not null default now()
);

create table public.user_academies (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.user_profiles(id) on delete cascade,
  name       text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index user_academies_user_idx on public.user_academies(user_id);
create unique index user_academies_one_default_idx on public.user_academies(user_id) where is_default;

create table public.academy_equipment (
  academy_id   uuid not null references public.user_academies(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete restrict,
  created_at   timestamptz not null default now(),
  primary key (academy_id, equipment_id)
);
create index academy_equipment_equipment_idx on public.academy_equipment(equipment_id);

-- ---------- EXERCÍCIOS ----------
create table public.exercises (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  muscle_group          muscle_group not null,
  secondary_muscles     text[] not null default '{}',
  movement_pattern      text not null,            -- ex.: empurrar horizontal, agachar, puxar vertical
  required_equipment_id uuid references public.equipment(id) on delete set null, -- null = peso corporal
  difficulty            difficulty_level not null default 'medium',
  image_url             text,
  video_url             text,
  instructions          text,
  safety_notes          text,
  contraindications     text[] not null default '{}', -- tags comparadas com health_restrictions
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index exercises_group_idx     on public.exercises(muscle_group);
create index exercises_pattern_idx   on public.exercises(movement_pattern);
create index exercises_equipment_idx on public.exercises(required_equipment_id);

create table public.exercise_alternatives (
  id                uuid primary key default gen_random_uuid(),
  exercise_id       uuid not null references public.exercises(id) on delete cascade,
  alternative_id    uuid not null references public.exercises(id) on delete cascade,
  equivalence_score smallint not null check (equivalence_score between 1 and 100),
  rationale         text not null,   -- por que é funcionalmente equivalente
  created_at        timestamptz not null default now(),
  check (exercise_id <> alternative_id),
  unique (exercise_id, alternative_id)
);
create index exercise_alternatives_alt_idx on public.exercise_alternatives(alternative_id);

-- ---------- TREINO ----------
create table public.workout_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.user_profiles(id) on delete cascade,
  name       text not null,
  split      workout_split not null,
  origin     plan_origin not null default 'system',
  is_active  boolean not null default true,
  starts_on  date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workout_plans_user_idx on public.workout_plans(user_id);
create unique index workout_plans_one_active_idx on public.workout_plans(user_id) where is_active;

create table public.workout_days (
  id        uuid primary key default gen_random_uuid(),
  plan_id   uuid not null references public.workout_plans(id) on delete cascade,
  day_index smallint not null check (day_index >= 0),
  label     text not null,                       -- A, B, C, Upper...
  unique (plan_id, day_index)
);

create table public.workout_exercises (
  id           uuid primary key default gen_random_uuid(),
  day_id       uuid not null references public.workout_days(id) on delete cascade,
  exercise_id  uuid not null references public.exercises(id) on delete restrict,
  position     smallint not null check (position >= 0),
  sets         smallint not null check (sets between 1 and 20),
  reps_min     smallint not null check (reps_min between 1 and 100),
  reps_max     smallint not null,
  rest_seconds smallint check (rest_seconds between 0 and 900),
  notes        text,
  check (reps_max >= reps_min),
  unique (day_id, position)
);
create index workout_exercises_exercise_idx on public.workout_exercises(exercise_id);

-- Uma linha por série realizada.
create table public.workout_history (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.user_profiles(id) on delete cascade,
  session_id          uuid not null,                -- agrupa as séries de um mesmo treino
  workout_exercise_id uuid references public.workout_exercises(id) on delete set null,
  exercise_id         uuid not null references public.exercises(id) on delete restrict,
  performed_at        timestamptz not null default now(),
  set_number          smallint not null check (set_number >= 1),
  weight_kg           numeric(6,2) check (weight_kg is null or weight_kg >= 0),
  reps                smallint not null check (reps >= 0),
  rpe                 numeric(3,1) check (rpe is null or rpe between 1 and 10)
);
create index workout_history_user_date_idx     on public.workout_history(user_id, performed_at desc);
create index workout_history_user_exercise_idx on public.workout_history(user_id, exercise_id, performed_at desc);
create index workout_history_session_idx       on public.workout_history(session_id);

-- ---------- NUTRIÇÃO ----------
create table public.nutrition_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  is_active   boolean not null default true,
  bmr_kcal    integer not null check (bmr_kcal > 0),
  tdee_kcal   integer not null check (tdee_kcal > 0),
  target_kcal integer not null check (target_kcal > 0),
  protein_g   numeric(6,1) not null check (protein_g >= 0),
  carbs_g     numeric(6,1) not null check (carbs_g >= 0),
  fat_g       numeric(6,1) not null check (fat_g >= 0),
  assumptions jsonb not null default '{}'::jsonb,   -- premissas usadas no cálculo
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index nutrition_plans_user_idx on public.nutrition_plans(user_id);
create unique index nutrition_plans_one_active_idx on public.nutrition_plans(user_id) where is_active;

-- Catálogo de alimentos (valores por 100 g).
create table public.foods (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  source      text not null,          -- ex.: TACO (obrigatório informar a fonte)
  kcal_100g   numeric(7,2) not null check (kcal_100g >= 0),
  protein_100g numeric(6,2) not null check (protein_100g >= 0),
  carbs_100g  numeric(6,2) not null check (carbs_100g >= 0),
  fat_100g    numeric(6,2) not null check (fat_100g >= 0),
  created_at  timestamptz not null default now(),
  unique (name, source)
);

create table public.meals (
  id             uuid primary key default gen_random_uuid(),
  plan_id        uuid not null references public.nutrition_plans(id) on delete cascade,
  name           text not null,
  position       smallint not null check (position >= 0),
  scheduled_time time,
  target_kcal    integer check (target_kcal >= 0),
  unique (plan_id, position)
);

create table public.meal_records (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  meal_id     uuid references public.meals(id) on delete set null,
  food_id     uuid references public.foods(id) on delete set null,
  description text,
  eaten_at    timestamptz not null default now(),
  quantity_g  numeric(8,2) check (quantity_g is null or quantity_g > 0),
  kcal        numeric(7,2) not null check (kcal >= 0),
  protein_g   numeric(6,2) not null default 0 check (protein_g >= 0),
  carbs_g     numeric(6,2) not null default 0 check (carbs_g >= 0),
  fat_g       numeric(6,2) not null default 0 check (fat_g >= 0),
  check (food_id is not null or description is not null)
);
create index meal_records_user_date_idx on public.meal_records(user_id, eaten_at desc);

create table public.water_records (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  amount_ml   integer not null check (amount_ml between 1 and 5000),
  recorded_at timestamptz not null default now()
);
create index water_records_user_date_idx on public.water_records(user_id, recorded_at desc);

-- ---------- EVOLUÇÃO ----------
create table public.weight_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  measured_on date not null default current_date,
  weight_kg   numeric(5,2) not null check (weight_kg between 25 and 400),
  created_at  timestamptz not null default now(),
  unique (user_id, measured_on)
);

create table public.body_measurements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.user_profiles(id) on delete cascade,
  measured_on  date not null default current_date,
  chest_cm     numeric(5,1) check (chest_cm > 0),
  waist_cm     numeric(5,1) check (waist_cm > 0),
  hip_cm       numeric(5,1) check (hip_cm > 0),
  arm_cm       numeric(5,1) check (arm_cm > 0),
  thigh_cm     numeric(5,1) check (thigh_cm > 0),
  calf_cm      numeric(5,1) check (calf_cm > 0),
  body_fat_pct numeric(4,1) check (body_fat_pct between 2 and 70),
  photo_path   text,            -- caminho no bucket privado progress-photos
  created_at   timestamptz not null default now(),
  unique (user_id, measured_on)
);

-- ---------- IA E NOTIFICAÇÕES ----------
create table public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.user_profiles(id) on delete cascade,
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);

create table public.ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id         uuid not null references public.user_profiles(id) on delete cascade,
  role            message_role not null,
  content         text not null,
  tokens_in       integer check (tokens_in >= 0),
  tokens_out      integer check (tokens_out >= 0),
  created_at      timestamptz not null default now()
);
create index ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);
create index ai_messages_user_date_idx    on public.ai_messages(user_id, created_at desc); -- limite de uso

create table public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.user_profiles(id) on delete cascade,
  type          text not null,
  title         text not null,
  body          text,
  scheduled_for timestamptz,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

-- ---------- TRIGGERS updated_at ----------
do $$
declare t text;
begin
  foreach t in array array[
    'user_profiles','user_goals','user_routines','health_restrictions','user_academies',
    'exercises','workout_plans','nutrition_plans','ai_conversations'
  ] loop
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;
