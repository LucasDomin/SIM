-- SIM CMS schema
create table if not exists public.content_items (
  id text primary key,
  friendly_name text not null,
  category text not null,
  type text not null check (type in ('text','richtext','image','video','setting')),
  value text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.media_assets (
  id text primary key,
  name text not null,
  kind text not null check (kind in ('image','video','document')),
  url text not null default '',
  mime_type text not null default '',
  size bigint not null default 0,
  width integer,
  height integer,
  duration numeric,
  ratio text,
  category text not null default 'Geral',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.site_settings (
  id text primary key,
  label text not null,
  value text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.content_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;

create policy "public read content" on public.content_items for select using (true);
create policy "public read media" on public.media_assets for select using (true);
create policy "public read settings" on public.site_settings for select using (true);

create policy "authenticated write content" on public.content_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write media" on public.media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage buckets must be created in Supabase dashboard or via SQL API:
-- images, videos, documents (public read, authenticated write)