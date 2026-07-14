-- =============================================================================
-- SIM — schema.sql
-- Cria o schema completo para o site da Still In Movement.
-- Idempotente: pode ser executado mais de uma vez.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tabela: projects
-- Cada row = um projeto do portfólio. is_draft = true => só admin vê.
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subtitle    text,
  category    text,
  client      text,
  description text,
  year        text,
  location    text,
  duration    text,
  format      text,
  cover       text,
  stills      jsonb default '[]'::jsonb,
  credits     jsonb default '[]'::jsonb,
  awards      jsonb default '[]'::jsonb,
  color       text,
  video       text,
  poster      text,
  is_draft    boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_draft on public.projects (is_draft);

-- -----------------------------------------------------------------------------
-- Tabela: site_config
-- Apenas uma linha (id = 'default') com a configuração do hero.
-- Campo _draft guarda o rascunho antes de publicar.
-- -----------------------------------------------------------------------------
create table if not exists public.site_config (
  id                 text primary key default 'default',
  hero_images        jsonb default '[]'::jsonb,
  hero_scenes        jsonb default '[]'::jsonb,
  hero_reels         jsonb default '[]'::jsonb,
  hero_videos        jsonb default '[]'::jsonb,
  background_video   jsonb default '{"url":"","poster":""}'::jsonb,
  _draft              jsonb,
  updated_at         timestamptz default now()
);

-- Garante a coluna também em bancos que já existiam antes desta alteração
alter table public.site_config add column if not exists hero_videos jsonb default '[]'::jsonb;

-- -----------------------------------------------------------------------------
-- Tabela: pricing_table
-- Categorias, itens, custos-base e preços sugeridos.
-- -----------------------------------------------------------------------------
create table if not exists public.pricing_table (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  item_name   text not null,
  base_cost   numeric(10, 2) default 0,
  sale_price  numeric(10, 2) default 0,
  updated_at  timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) — segurança real
-- -----------------------------------------------------------------------------
alter table public.projects       enable row level security;
alter table public.site_config    enable row level security;
alter table public.pricing_table  enable row level security;

-- Limpa policies existentes para tornar o script idempotente
drop policy if exists "projects: public read"     on public.projects;
drop policy if exists "projects: admin write"    on public.projects;
drop policy if exists "site_config: public read"  on public.site_config;
drop policy if exists "site_config: admin write" on public.site_config;
drop policy if exists "pricing: public read"       on public.pricing_table;
drop policy if exists "pricing: admin write"      on public.pricing_table;

-- projects: visitantes leem apenas o publicado (is_draft = false)
create policy "projects: public read"
  on public.projects for select
  using (is_draft = false);

-- projects: somente admin logado escreve
create policy "projects: admin write"
  on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- site_config: visitantes leem
create policy "site_config: public read"
  on public.site_config for select
  using (true);

create policy "site_config: admin write"
  on public.site_config for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- pricing_table: visitantes leem
create policy "pricing: public read"
  on public.pricing_table for select
  using (true);

create policy "pricing: admin write"
  on public.pricing_table for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- Storage bucket para uploads (imagens, vídeos)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('sim-media', 'sim-media', true)
  on conflict (id) do nothing;

drop policy if exists "sim-media: public read"   on storage.objects;
drop policy if exists "sim-media: admin upload" on storage.objects;
drop policy if exists "sim-media: admin delete" on storage.objects;

create policy "sim-media: public read"
  on storage.objects for select
  using (bucket_id = 'sim-media');

create policy "sim-media: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'sim-media' and auth.role() = 'authenticated');

create policy "sim-media: admin delete"
  on storage.objects for delete
  using (bucket_id = 'sim-media' and auth.role() = 'authenticated');
