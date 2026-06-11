-- SIM Studio - Supabase Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  friendly_name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'config')),
  value TEXT NOT NULL,
  value_en TEXT,
  value_pt TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_content_name ON content(name);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);

-- ============================================
-- MEDIA TRACKING TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  format TEXT NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  aspect_ratio TEXT,
  duration INTEGER, -- in seconds (for videos)
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  crop_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_media_bucket ON media_files(bucket);
CREATE INDEX IF NOT EXISTS idx_media_name ON media_files(name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Content RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read content
CREATE POLICY "Allow authenticated read content"
  ON content FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated update content"
  ON content FOR UPDATE
  TO authenticated
  USING (true);

-- Media RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read media"
  ON media_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert media"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update media"
  ON media_files FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- These will be created via Supabase Dashboard or API
-- Bucket names: images, videos, documents

-- ============================================
-- DEFAULT CONTENT SEED
-- ============================================
INSERT INTO content (name, friendly_name, category, type, value) VALUES
  -- Hero Section
  ('hero_title', 'Hero Title', 'hero', 'text', 'Imagens que permanecem em silêncio.'),
  ('hero_subtitle', 'Hero Subtitle', 'hero', 'text', 'Cinematic Photography · Audiovisual Studio'),
  ('hero_description', 'Hero Description', 'hero', 'text', 'Estúdio independente dedicado à fotografia editorial e ao cinema de marca para clientes que entendem o valor do detalhe.'),
  ('hero_cta_primary', 'Hero CTA Primary', 'hero', 'text', 'Assistir reel'),
  ('hero_cta_secondary', 'Hero CTA Secondary', 'hero', 'text', 'Solicitar orçamento inteligente'),
  
  -- About/Manifesto
  ('manifesto_title', 'Manifesto Title', 'about', 'text', 'Manifesto'),
  ('manifesto_text', 'Manifesto Text', 'about', 'text', 'Acreditamos que a melhor imagem é aquela que continua a existir depois de fechar os olhos. Não fabricamos atenção — construímos memória.'),
  
  -- Footer
  ('footer_brand', 'Footer Brand', 'footer', 'text', 'SIM.'),
  ('footer_tagline', 'Footer Tagline', 'footer', 'text', 'Capturas que permanecem em movimento.'),
  ('footer_email', 'Footer Email', 'footer', 'text', 'studio@sim.studio'),
  ('footer_phone', 'Footer Phone', 'footer', 'text', '+351 900 000 000'),
  ('footer_social', 'Footer Social', 'footer', 'text', '@sim.studio'),
  
  -- Config
  ('site_name', 'Site Name', 'config', 'config', 'SIM - Still In Moviment'),
  ('site_description', 'Site Description', 'config', 'config', 'Cinematic Photography & Audiovisual Studio')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for content table
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for media_files table
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
