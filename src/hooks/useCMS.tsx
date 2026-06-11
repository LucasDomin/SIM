import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { contentMap, getContentItems, getMediaAssets, mediaMap } from "../lib/cmsRepository";
import type { ContentItem, MediaAsset } from "../types/cms";

type CMSContextValue = {
  content: ContentItem[];
  media: MediaAsset[];
  t: (id: string, fallback: string) => string;
  m: (id: string, fallback: string) => string;
  refresh: () => Promise<void>;
};

const CMSContext = createContext<CMSContextValue | null>(null);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);

  const refresh = async () => {
    const [contentItems, mediaItems] = await Promise.all([getContentItems(), getMediaAssets()]);
    setContent(contentItems);
    setMedia(mediaItems);
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("sim:cms-updated", onUpdate);
    return () => window.removeEventListener("sim:cms-updated", onUpdate);
  }, []);

  const value = useMemo(() => {
    const text = contentMap(content);
    const mediaUrls = mediaMap(media);
    return {
      content,
      media,
      refresh,
      t: (id: string, fallback: string) => text[id] ?? fallback,
      m: (id: string, fallback: string) => mediaUrls[id] || fallback,
    };
  }, [content, media]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) throw new Error("useCMS must be used within CMSProvider");
  return context;
}