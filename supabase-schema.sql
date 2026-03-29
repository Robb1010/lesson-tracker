-- Run this in the Supabase SQL editor to set up the database

create table purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  weeks integer not null check (weeks > 0),
  purchased_at date not null default current_date,
  note text,
  created_at timestamptz default now()
);

alter table purchases enable row level security;

create policy "Users can view own purchases"
  on purchases for select using (auth.uid() = user_id);
create policy "Users can insert own purchases"
  on purchases for insert with check (auth.uid() = user_id);
create policy "Users can delete own purchases"
  on purchases for delete using (auth.uid() = user_id);

create table lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  lesson_date date not null,
  status text not null check (status in ('attended', 'missed')),
  note text,
  created_at timestamptz default now(),
  unique (user_id, lesson_date)
);

alter table lessons enable row level security;

create policy "Users can view own lessons"
  on lessons for select using (auth.uid() = user_id);
create policy "Users can insert own lessons"
  on lessons for insert with check (auth.uid() = user_id);
create policy "Users can update own lessons"
  on lessons for update using (auth.uid() = user_id);
create policy "Users can delete own lessons"
  on lessons for delete using (auth.uid() = user_id);

create table user_settings (
  user_id uuid references auth.users(id) primary key,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  language text not null default 'en' check (language in ('en', 'es')),
  lessons_per_week integer not null default 2 check (lessons_per_week between 1 and 7),
  lesson_days integer[] not null default '{1,3}',
  updated_at timestamptz default now()
);

alter table user_settings enable row level security;

create policy "Users manage own settings"
  on user_settings for all using (auth.uid() = user_id);
