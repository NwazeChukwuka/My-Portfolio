-- 01_schema_and_policies.sql
-- Run this first in Supabase SQL Editor.

-- Extensions
create extension if not exists "pgcrypto";

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Admin-safe profile bootstrap on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Content tables
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  summary text,
  description text,
  image_url text,
  details_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  snippet text,
  content_html text not null,
  category text not null,
  tags text[] not null default '{}',
  cover_image_url text,
  published_at date not null default current_date,
  author text not null default 'Mazi Chukwuka',
  read_time text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text not null,
  message text not null,
  source text not null default 'website_contact_form',
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_email_or_phone_required
    check (
      (email is not null and btrim(email) <> '')
      or (phone is not null and btrim(phone) <> '')
    )
);

drop trigger if exists trg_contact_messages_updated_at on public.contact_messages;
create trigger trg_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

-- Storage bucket for portfolio media
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- Clean existing policies if rerun
drop policy if exists "profiles_read_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "projects_public_read" on public.projects;
drop policy if exists "projects_admin_write" on public.projects;
drop policy if exists "blog_public_read" on public.blog_posts;
drop policy if exists "blog_admin_write" on public.blog_posts;
drop policy if exists "settings_public_read" on public.site_settings;
drop policy if exists "settings_admin_write" on public.site_settings;
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
drop policy if exists "contact_messages_admin_read" on public.contact_messages;
drop policy if exists "contact_messages_admin_update" on public.contact_messages;

-- Profiles policies
create policy "profiles_read_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Projects policies
create policy "projects_public_read"
on public.projects
for select
to anon, authenticated
using (status = 'published');

create policy "projects_admin_write"
on public.projects
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

-- Blog policies
create policy "blog_public_read"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published');

create policy "blog_admin_write"
on public.blog_posts
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

-- Settings policies
create policy "settings_public_read"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "settings_admin_write"
on public.site_settings
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

create policy "contact_messages_public_insert"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "contact_messages_admin_read"
on public.contact_messages
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

create policy "contact_messages_admin_update"
on public.contact_messages
for update
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin'
));

-- Storage policies for assets bucket
drop policy if exists "assets_public_read" on storage.objects;
drop policy if exists "assets_admin_insert" on storage.objects;
drop policy if exists "assets_admin_update" on storage.objects;
drop policy if exists "assets_admin_delete" on storage.objects;

create policy "assets_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'assets');

create policy "assets_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "assets_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  bucket_id = 'assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "assets_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
