import { supabase, isSupabaseConfigured, storageBuckets } from "./supabase";
import { defaultContent, defaultMedia, defaultSettings, defaultVideos } from "../data/cmsSeed";
import type { ContentItem, MediaAsset, SiteSetting } from "../types/cms";

const keys = {
  content: "sim.cms.content",
  media: "sim.cms.media",
  settings: "sim.cms.settings",
};

const readLocal = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export async function getContentItems(): Promise<ContentItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from("content_items").select("*").order("category");
    if (!error && data?.length) {
      return data.map((item) => ({
        id: item.id,
        friendlyName: item.friendly_name,
        category: item.category,
        type: item.type,
        value: item.value,
        updatedAt: item.updated_at,
        createdAt: item.created_at,
        updatedBy: item.updated_by,
      }));
    }
  }
  return readLocal(keys.content, defaultContent);
}

export async function saveContentItem(item: ContentItem): Promise<ContentItem> {
  const updated = { ...item, updatedAt: new Date().toISOString() };
  if (supabase) {
    await supabase.from("content_items").upsert({
      id: updated.id,
      friendly_name: updated.friendlyName,
      category: updated.category,
      type: updated.type,
      value: updated.value,
      updated_at: updated.updatedAt,
    });
  }
  const list = await getContentItems();
  writeLocal(keys.content, list.map((x) => (x.id === updated.id ? updated : x)));
  window.dispatchEvent(new Event("sim:cms-updated"));
  return updated;
}

export async function getMediaAssets(kind?: MediaAsset["kind"]): Promise<MediaAsset[]> {
  const fallback = [...defaultMedia, ...defaultVideos];
  if (supabase) {
    const query = supabase.from("media_assets").select("*").order("category");
    const { data, error } = kind ? await query.eq("kind", kind) : await query;
    if (!error && data?.length) {
      return data.map((m) => ({
        id: m.id,
        name: m.name,
        kind: m.kind,
        url: m.url,
        mimeType: m.mime_type,
        size: m.size,
        width: m.width,
        height: m.height,
        duration: m.duration,
        ratio: m.ratio,
        category: m.category,
        updatedAt: m.updated_at,
        createdAt: m.created_at,
        updatedBy: m.updated_by,
      }));
    }
  }
  const local = readLocal(keys.media, fallback);
  return kind ? local.filter((m) => m.kind === kind) : local;
}

export async function saveMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
  const updated = { ...asset, updatedAt: new Date().toISOString() };
  if (supabase) {
    await supabase.from("media_assets").upsert({
      id: updated.id,
      name: updated.name,
      kind: updated.kind,
      url: updated.url,
      mime_type: updated.mimeType,
      size: updated.size,
      width: updated.width,
      height: updated.height,
      duration: updated.duration,
      ratio: updated.ratio,
      category: updated.category,
      updated_at: updated.updatedAt,
    });
  }
  const list = await getMediaAssets();
  const exists = list.some((x) => x.id === updated.id);
  writeLocal(keys.media, exists ? list.map((x) => (x.id === updated.id ? updated : x)) : [updated, ...list]);
  window.dispatchEvent(new Event("sim:cms-updated"));
  return updated;
}

export async function getSettings(): Promise<SiteSetting[]> {
  if (supabase) {
    const { data, error } = await supabase.from("site_settings").select("*").order("id");
    if (!error && data?.length) return data.map((s) => ({ id: s.id, label: s.label, value: s.value, updatedAt: s.updated_at }));
  }
  return readLocal(keys.settings, defaultSettings);
}

export async function saveSetting(setting: SiteSetting): Promise<SiteSetting> {
  const updated = { ...setting, updatedAt: new Date().toISOString() };
  if (supabase) await supabase.from("site_settings").upsert({ id: updated.id, label: updated.label, value: updated.value, updated_at: updated.updatedAt });
  const list = await getSettings();
  writeLocal(keys.settings, list.map((x) => (x.id === updated.id ? updated : x)));
  window.dispatchEvent(new Event("sim:cms-updated"));
  return updated;
}

export async function uploadToStorage(file: File, path: string, bucket: keyof typeof storageBuckets): Promise<string> {
  if (!supabase || !isSupabaseConfigured) return URL.createObjectURL(file);
  const { error } = await supabase.storage.from(storageBuckets[bucket]).upload(path, file, { upsert: true, cacheControl: "31536000" });
  if (error) throw error;
  const { data } = supabase.storage.from(storageBuckets[bucket]).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}

export function contentMap(items: ContentItem[]) {
  return Object.fromEntries(items.map((item) => [item.id, item.value]));
}

export function mediaMap(items: MediaAsset[]) {
  return Object.fromEntries(items.map((item) => [item.id, item.url]));
}