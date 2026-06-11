export type ContentType = "text" | "richtext" | "image" | "video" | "setting";

export type ContentItem = {
  id: string;
  friendlyName: string;
  category: string;
  type: ContentType;
  value: string;
  updatedAt: string;
  createdAt?: string;
  updatedBy?: string | null;
};

export type MediaKind = "image" | "video" | "document";

export type MediaAsset = {
  id: string;
  name: string;
  kind: MediaKind;
  url: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  ratio?: string | null;
  category: string;
  updatedAt: string;
  createdAt?: string;
  updatedBy?: string | null;
};

export type SiteSetting = {
  id: string;
  label: string;
  value: string;
  updatedAt: string;
};

export type CropPixels = { x: number; y: number; width: number; height: number };