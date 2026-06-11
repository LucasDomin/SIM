// Content Types
export type ContentType = 'text' | 'image' | 'video' | 'config';

export interface ContentItem {
  id: string;
  name: string;
  friendly_name: string;
  category: string;
  type: ContentType;
  value: string;
  value_en?: string;
  value_pt?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  original_name: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  duration?: number;
  url: string;
  thumbnail_url?: string;
  bucket: string;
  path: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  unit?: 'px' | '%';
}

export interface ImageWithCrop extends MediaFile {
  crop?: CropData;
}

// Content Categories
export const CONTENT_CATEGORIES = {
  HERO: 'hero',
  ABOUT: 'about',
  SERVICES: 'services',
  FOOTER: 'footer',
  NAV: 'nav',
  ESTIMATE: 'estimate',
  AI: 'ai',
  CONFIG: 'config',
} as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[keyof typeof CONTENT_CATEGORIES];
