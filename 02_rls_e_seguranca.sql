-- =====================================================================
-- FITLIFE AI - Fase 2 - Parte 2: RLS, permissões, criação automática
-- de perfil e bucket privado de fotos. Rodar DEPOIS da parte 01.
-- =====================================================================

-- ---------- Perfil criado automaticamente no cadastro (e-mail ou Google) ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Ligar RLS em 100% das tabelas ----------
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------- Visitantes anônimos não acessam nada ----------
revoke all on all tables in schema public from anon;

-- ---------- Tabelas com user_id: o usuário só vê/edita as próprias linhas ----------
do $$
declare t text;
begin
  foreach t in array array[
    'user_goals','user_routines','user_schedules','health_restrictions','user_academies',
    'workout_plans','workout_history','nutrition_plans','meal_records','water_records',
    'weight_history','body_measurements','ai_conversations','notifications'
  ] loop
    execute format(
      'create policy "own rows" on public.%I for all to authenticated
         using (user_id = (select auth.uid()))
         with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;

-- ---------- Perfil ----------
create policy "profile select" on public.user_profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "profile insert" on public.user_profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "profile update" on public.user_profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- O cliente NÃO pode alterar plano de assinatura nem datas de controle.
-- (Essas colunas só mudam pelo servidor, com papel privilegiado.)
revoke insert, update on public.user_profiles from authenticated;
grant insert (id, full_name) on public.user_profiles to authenticated;
grant update (full_name, birth_date, biological_sex, height_cm, current_weight_kg,
              experience_level, onboarding_completed_at, lgpd_consent_at)
  on public.user_profiles to authenticated;

-- ---------- Tabelas filhas: acesso herdado do dono ----------
create policy "academy equipment" on public.academy_equipment for all to authenticated
  using (exists (select 1 from public.user_academies a
                 where a.id = academy_id and a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_academies a
                      where a.id = academy_id and a.user_id = (select auth.uid())));

create policy "workout days" on public.workout_days for all to authenticated
  using (exists (select 1 from public.workout_plans p
                 where p.id = plan_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.workout_plans p
                      where p.id = plan_id and p.user_id = (select auth.uid())));

create policy "workout exercises" on public.workout_exercises for all to authenticated
  using (exists (select 1 from public.workout_days d
                 join public.workout_plans p on p.id = d.plan_id
                 where d.id = day_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.workout_days d
                      join public.workout_plans p on p.id = d.plan_id
                      where d.id = day_id and p.user_id = (select auth.uid())));

create policy "meals" on public.meals for all to authenticated
  using (exists (select 1 from public.nutrition_plans n
                 where n.id = plan_id and n.user_id = (select auth.uid())))
  with check (exists (select 1 from public.nutrition_plans n
                      where n.id = plan_id and n.user_id = (select auth.uid())));

create policy "ai messages" on public.ai_messages for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid())
              and exists (select 1 from public.ai_conversations c
                          where c.id = conversation_id and c.user_id = (select auth.uid())));

-- ---------- Catálogos: leitura para logados, escrita só pelo servidor ----------
do $$
declare t text;
begin
  foreach t in array array['equipment','exercises','exercise_alternatives','foods'] loop
    execute format('create policy "catalog read" on public.%I for select to authenticated using (true)', t);
    execute format('revoke insert, update, delete on public.%I from authenticated', t);
  end loop;
end $$;

-- ---------- Bucket privado para fotos de evolução ----------
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

-- Cada usuário só acessa a pasta com o próprio id: <user_id>/arquivo.jpg
create policy "photos select" on storage.objects for select to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos update" on storage.objects for update to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos delete" on storage.objects for delete to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
