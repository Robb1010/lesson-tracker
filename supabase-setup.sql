-- ============================================================
-- Lesson Tracker — Full Supabase Setup
-- Run this entire file in the Supabase SQL editor (fresh setup).
-- If you already have tables, see the migrations section at the bottom.
-- ============================================================


-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists purchases (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) not null,
  weeks         integer not null check (weeks > 0),
  purchased_at  date not null default current_date,
  note          text,
  created_at    timestamptz default now()
);

create table if not exists lessons (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) not null,
  lesson_date   date not null,
  status        text not null check (status in ('attended', 'missed')),
  note          text,
  created_at    timestamptz default now(),
  unique (user_id, lesson_date)
);

create table if not exists user_settings (
  user_id          uuid references auth.users(id) primary key,
  theme            text not null default 'system'  check (theme in ('light', 'dark', 'system')),
  language         text not null default 'en'      check (language in ('en', 'es')),
  lessons_per_week integer not null default 2      check (lessons_per_week between 1 and 7),
  lesson_days      integer[] not null default '{1,3}', -- 0=Sun … 6=Sat
  start_date       date,
  updated_at       timestamptz default now()
);


-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table purchases     enable row level security;
alter table lessons       enable row level security;
alter table user_settings enable row level security;

-- purchases
drop policy if exists "Users can view own purchases"   on purchases;
drop policy if exists "Users can insert own purchases" on purchases;
drop policy if exists "Users can delete own purchases" on purchases;
create policy "Users can view own purchases"
  on purchases for select using (auth.uid() = user_id);
create policy "Users can insert own purchases"
  on purchases for insert with check (auth.uid() = user_id);
create policy "Users can delete own purchases"
  on purchases for delete using (auth.uid() = user_id);

-- lessons
drop policy if exists "Users can view own lessons"   on lessons;
drop policy if exists "Users can insert own lessons" on lessons;
drop policy if exists "Users can update own lessons" on lessons;
drop policy if exists "Users can delete own lessons" on lessons;
create policy "Users can view own lessons"
  on lessons for select using (auth.uid() = user_id);
create policy "Users can insert own lessons"
  on lessons for insert with check (auth.uid() = user_id);
create policy "Users can update own lessons"
  on lessons for update using (auth.uid() = user_id);
create policy "Users can delete own lessons"
  on lessons for delete using (auth.uid() = user_id);

-- user_settings
drop policy if exists "Users manage own settings" on user_settings;
create policy "Users manage own settings"
  on user_settings for all using (auth.uid() = user_id);


-- ------------------------------------------------------------
-- Migrations (safe to run on existing databases)
-- ------------------------------------------------------------

alter table user_settings add column if not exists start_date date;


-- ------------------------------------------------------------
-- Balance function
-- Counts scheduled lesson days from start_date to today using
-- generate_series, then subtracts manually missed lessons.
-- Called from the app via supabase.rpc('get_user_balance').
-- ------------------------------------------------------------

create or replace function get_user_balance()
returns json
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_settings    record;
  v_total       int;
  v_scheduled   int := 0;
  v_missed      int;
begin
  select lessons_per_week, lesson_days, start_date
    into v_settings
    from user_settings
   where user_id = auth.uid();

  select coalesce(sum(weeks), 0) * v_settings.lessons_per_week
    into v_total
    from purchases
   where user_id = auth.uid();

  if v_settings.start_date is not null then
    select count(*)::int
      into v_scheduled
      from generate_series(v_settings.start_date, current_date, '1 day'::interval) d
     where extract(dow from d)::int = any(v_settings.lesson_days);
  end if;

  select count(*)::int
    into v_missed
    from lessons
   where user_id = auth.uid()
     and lesson_date <= current_date
     and status = 'missed';

  return json_build_object(
    'totalLessons', v_total,
    'attended',     greatest(v_scheduled - v_missed, 0),
    'banked',       v_missed,
    'remaining',    v_total - greatest(v_scheduled - v_missed, 0)
  );
end;
$$;


