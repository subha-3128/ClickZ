-- Enable UUID generation helper
create extension if not exists pgcrypto;

-- Core table for each user's links
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  custom_id text not null,
  link text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_created_at_idx
  on public.links (user_id, created_at desc);

-- Security: turn on row-level security
alter table public.links enable row level security;

-- Users can read only their own links
drop policy if exists "Users can select their own links" on public.links;
create policy "Users can select their own links"
  on public.links
  for select
  using (auth.uid() = user_id);

-- Users can insert only rows that belong to them
drop policy if exists "Users can insert their own links" on public.links;
create policy "Users can insert their own links"
  on public.links
  for insert
  with check (auth.uid() = user_id);

-- Users can update only their own rows
drop policy if exists "Users can update their own links" on public.links;
create policy "Users can update their own links"
  on public.links
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete only their own rows
drop policy if exists "Users can delete their own links" on public.links;
create policy "Users can delete their own links"
  on public.links
  for delete
  using (auth.uid() = user_id);

-- Optional: storage bucket for uploaded logos
insert into storage.buckets (id, name, public)
values ('link-logos', 'link-logos', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Users can upload logos" on storage.objects;
create policy "Users can upload logos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'link-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can update their logos" on storage.objects;
create policy "Users can update their logos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'link-logos' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'link-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete their logos" on storage.objects;
create policy "Users can delete their logos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'link-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Public can read logos" on storage.objects;
create policy "Public can read logos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'link-logos');
