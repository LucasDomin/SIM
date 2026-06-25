-- =============================================================================
-- SIM — seed.sql
-- Insere os defaults estáticos no Supabase (idempotente).
-- Rode DEPOIS de schema.sql.
-- =============================================================================

-- Configuração inicial do site
insert into public.site_config (id, hero_images, hero_scenes, hero_reels, background_video)
values (
  'default',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '{"url":"","poster":""}'::jsonb
)
on conflict (id) do nothing;

-- Atualiza com os defaults reais se o bucket estiver vazio
update public.site_config
set
  hero_images = '[
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=2400&q=80"
  ]'::jsonb,
  hero_scenes = '["Atlas · 2025","Noctilucent · 2024","Kintsugi · 2024"]'::jsonb,
  hero_reels  = '["","",""]'::jsonb,
  background_video = '{"url":"","poster":""}'::jsonb
where id = 'default';

-- Pricing
insert into public.pricing_table (category, item_name, base_cost, sale_price) values
  ('Cinema de Marca', 'Direção', 12000, 0),
  ('Cinema de Marca', 'Direção de Fotografia', 4000, 0),
  ('Cinema de Marca', 'Color grading', 1800, 0),
  ('Cinema de Marca', 'Sound design', 2200, 0),
  ('Editorial', 'Sessão (8h)', 4500, 0),
  ('Editorial', 'Color', 1500, 0),
  ('Editorial', 'Set fotográfico', 2000, 0),
  ('Documentário', 'Pré-produção', 3000, 0),
  ('Documentário', 'Direção', 9000, 0),
  ('Documentário', 'Color grading', 1800, 0),
  ('Documentário', 'Sound design', 2200, 0)
on conflict do nothing;
