import { useEffect, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { SITE_CONFIG } from "../data/defaults";
import { ImageCropper } from "./ImageCropper";
import {
  sanitizeImageUrl,
  sanitizeMediaUrl,
  sanitizeText,
  approxByteSize,
  MAX_IMAGE_BYTES,
  MAX_SOURCE_IMAGE_BYTES,
} from "../lib/sanitize";
import { compressImageFile } from "../lib/imageProcessing";
import { fetchHeroConfig, saveHeroConfig } from "../lib/siteRepo";
import { isSupabaseConfigured } from "../lib/supabase";

const MAX_HERO_ITEMS = 3;

function emitHeroUpdate() {
  window.dispatchEvent(new Event("sim-hero-updated"));
}

export function HeroEditor({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const [images, setImages] = useState<string[]>(SITE_CONFIG.hero.images);
  const [scenes, setScenes] = useState<string[]>(SITE_CONFIG.hero.scenes);
  const [reels, setReels] = useState<string[]>(SITE_CONFIG.hero.reels);
  const [videos, setVideos] = useState<string[]>(SITE_CONFIG.hero.videos);
  const [videoUrl, setVideoUrl] = useState(SITE_CONFIG.hero.backgroundVideo.url);
  const [videoPoster, setVideoPoster] = useState(SITE_CONFIG.hero.backgroundVideo.poster);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<{
    idx: number;
    url: string;
  } | null>(null);

  // Carrega do Supabase ao abrir
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchHeroConfig()
      .then((cfg) => {
        setImages(cfg.images.slice(0, MAX_HERO_ITEMS));
        setScenes(cfg.scenes.slice(0, MAX_HERO_ITEMS));
        setReels(cfg.reels.slice(0, MAX_HERO_ITEMS));
        setVideos(cfg.videos.slice(0, MAX_HERO_ITEMS));
        setVideoUrl(cfg.backgroundVideo.url);
        setVideoPoster(cfg.backgroundVideo.poster);
      })
      .catch(() => {
        // Fallback para defaults se Supabase falhar
        setImages(SITE_CONFIG.hero.images);
        setScenes(SITE_CONFIG.hero.scenes);
        setReels(SITE_CONFIG.hero.reels);
        setVideos(SITE_CONFIG.hero.videos);
        setVideoUrl(SITE_CONFIG.hero.backgroundVideo.url);
        setVideoPoster(SITE_CONFIG.hero.backgroundVideo.poster);
      })
      .finally(() => setLoading(false));
  }, [open]);

  const saveAll = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase não configurado. Configure VITE_SUPABASE_URL/ANON_KEY.");
      return;
    }
    setLoading(true);
    const res = await saveHeroConfig({
      images: images.map(sanitizeImageUrl).filter(Boolean),
      scenes: scenes.map((s) => sanitizeText(s, 80)),
      reels: reels.map(sanitizeMediaUrl),
      videos: videos.map(sanitizeMediaUrl),
      backgroundVideo: { url: sanitizeMediaUrl(videoUrl), poster: sanitizeImageUrl(videoPoster) },
    });
    setLoading(false);
    if (res.ok) {
      emitHeroUpdate();
      onClose();
    } else {
      setError(res.error ?? "Erro ao salvar.");
    }
  };

  const onFile = async (f: File) => {
    setError(null);
    if (!f.type.startsWith("image/")) {
      setError(lang === "pt" ? "Arquivo precisa ser uma imagem." : "File must be an image.");
      return;
    }
    if (f.size > MAX_SOURCE_IMAGE_BYTES) {
      setError(
        lang === "pt"
          ? "Imagem acima de 15MB. Use uma imagem menor."
          : "Image larger than 15MB. Use a smaller image."
      );
      return;
    }
    try {
      const url = await compressImageFile(f);
      if (approxByteSize(url) > MAX_IMAGE_BYTES) {
        setError(lang === "pt" ? "Imagem muito grande." : "Image too large.");
        return;
      }
      if (images.length >= MAX_HERO_ITEMS) return;
      setImages([...images, url]);
      setScenes([...scenes, `Cena ${String(images.length + 1).padStart(2, "0")}`]);
      setReels([...reels, ""]);
      setVideos([...videos, ""]);
    } catch {
      setError(
        lang === "pt"
          ? "Não foi possível processar esta imagem. Tente outro arquivo."
          : "Could not process this image. Try another file."
      );
    }
  };

  const onCropSave = (payload: { url: string; crop: { x: number; y: number; scale: number } }) => {
    if (cropperTarget === null) return;
    const safe = sanitizeImageUrl(payload.url);
    if (!safe) return;
    const next = [...images];
    next[cropperTarget.idx] = safe;
    setImages(next);
    setCropperOpen(false);
    setCropperTarget(null);
  };

  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const addImageUrl = () => {
    if (images.length >= MAX_HERO_ITEMS) return;
    setImages([...images, ""]);
    setScenes([...scenes, `Cena ${String(images.length + 1).padStart(2, "0")}`]);
    setReels([...reels, ""]);
    setVideos([...videos, ""]);
  };

  const exportConfig = async () => {
    const config = {
      hero: {
        images,
        scenes,
        reels,
        videos,
        backgroundVideo: { url: videoUrl, poster: videoPoster },
      },
    };
    const text = JSON.stringify(config, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(text);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[180] overflow-y-auto bg-noir-950/90 p-4 backdrop-blur-md fade-in">
      <div className="relative mx-auto max-w-4xl rounded-sm border border-noir-700 bg-noir-900 p-6 md:p-10 fade-up">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-cream">
              {label("Editar Banner Principal", "Edit Hero Banner")}
            </h3>
            <p className="mt-1 text-sm text-noir-400">
              {label(
                "Troque até 3 imagens do banner (ou vídeos curtos de ~20s com reprodução automática) e edite o texto que aparece na linha inferior. As alterações são salvas no Supabase e aparecem para todos.",
                "Replace up to 3 banner images (or short ~20s autoplay videos) and edit the text shown in the bottom line. Changes are saved to Supabase and appear for everyone."
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="mb-6 rounded-sm border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {label("Carregando do Supabase...", "Loading from Supabase...")}
          </div>
        )}

        <div className="mb-8">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
            {label("Imagens do banner", "Banner images")} ({images.length}/{MAX_HERO_ITEMS})
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((url, i) => (
              <div key={i} className="rounded-sm border border-noir-700 bg-noir-950">
                <div className="group relative overflow-hidden">
                  {url ? (
                    <img src={url} alt="" className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-noir-800/30 text-center font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                      {label("Cole a URL abaixo", "Paste URL below")}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-noir-950/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (!url) return;
                        setCropperTarget({ idx: i, url });
                        setCropperOpen(true);
                      }}
                      disabled={!url}
                      className="rounded-full bg-cream px-3 py-1.5 font-mono text-[9px] uppercase tracking-wide2 text-noir-950 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {label("Crop", "Crop")}
                    </button>
                    <button
                      type="button"
                      disabled={images.length <= 1}
                      onClick={() => {
                        if (images.length <= 1) return;
                        setImages(images.filter((_, j) => j !== i));
                        setScenes(scenes.filter((_, j) => j !== i));
                        setReels(reels.filter((_, j) => j !== i));
                        setVideos(videos.filter((_, j) => j !== i));
                      }}
                      className="rounded-full border border-spec-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wide2 text-spec-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {label("Remover", "Remove")}
                    </button>
                  </div>
                  <span className="absolute left-2 top-2 rounded-full bg-noir-950/70 px-2 py-0.5 font-mono text-[9px] text-cream">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-3 border-t border-noir-800 p-3">
                  <label className="block">
                    <span className="font-mono text-[8px] uppercase tracking-wide2 text-noir-500">
                      {label("URL da imagem", "Image URL")}
                    </span>
                    <input
                      value={url}
                      onChange={(e) => {
                        const next = [...images];
                        next[i] = e.target.value;
                        setImages(next);
                      }}
                      placeholder="https://.../imagem.jpg"
                      className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-2 py-2 text-[11px] text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[8px] uppercase tracking-wide2 text-accent">
                      {label("Vídeo do banner (autoplay, ~20s)", "Banner video (autoplay, ~20s)")}
                    </span>
                    <input
                      value={videos[i] ?? ""}
                      onChange={(e) => {
                        const next = [...videos];
                        next[i] = e.target.value;
                        setVideos(next);
                      }}
                      placeholder="https://.../cena-20s.mp4"
                      className="mt-1 w-full rounded-sm border border-accent/30 bg-noir-950 px-2 py-2 text-[11px] text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
                    <span className="mt-1 block text-[10px] leading-snug text-noir-500">
                      {label(
                        "Se preenchido, este vídeo toca automaticamente aqui na frente do site no lugar da imagem, e avança sozinho para a próxima cena assim que terminar.",
                        "If filled, this video autoplays right here on the site's front page instead of the image, and automatically advances to the next scene once it ends."
                      )}
                    </span>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[8px] uppercase tracking-wide2 text-noir-500">
                      {label("Texto inferior", "Bottom text")}
                    </span>
                    <input
                      value={scenes[i] ?? ""}
                      onChange={(e) => {
                        const next = [...scenes];
                        next[i] = e.target.value;
                        setScenes(next);
                      }}
                      placeholder="Noctilucent · 2024"
                      className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-2 py-2 font-mono text-[10px] uppercase tracking-wide2 text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[8px] uppercase tracking-wide2 text-noir-500">
                      {label("URL do reel (View Reel)", "View Reel URL")}
                    </span>
                    <input
                      value={reels[i] ?? ""}
                      onChange={(e) => {
                        const next = [...reels];
                        next[i] = e.target.value;
                        setReels(next);
                      }}
                      placeholder="https://.../reel.mp4"
                      className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-2 py-2 text-[11px] text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}

            {images.length < MAX_HERO_ITEMS && (
              <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-noir-700 bg-noir-950 transition-colors hover:border-noir-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-noir-500">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("Adicionar", "Add")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </label>
            )}
          </div>
          {images.length < MAX_HERO_ITEMS && (
            <button
              onClick={addImageUrl}
              className="mt-3 rounded-full border border-noir-700 px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream"
            >
              {label("Adicionar por URL", "Add by URL")}
            </button>
          )}
        </div>

        <div className="mb-8 border-t border-noir-800 pt-8">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wide2 text-accent">
            {label("Vídeo de fundo (opcional)", "Background video (optional)")}
          </div>
          <p className="mb-4 text-sm text-noir-400">
            {label(
              "Cole uma URL direta de vídeo. Adicione uma capa para o estado parado.",
              "Paste a direct video URL. Add a poster for the idle state."
            )}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block">
                <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("URL do vídeo", "Video URL")}
                </span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-sm text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                  {label("URL da capa (poster)", "Poster URL")}
                </span>
                <input
                  value={videoPoster}
                  onChange={(e) => setVideoPoster(e.target.value)}
                  placeholder="https://.../poster.jpg"
                  className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-sm text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-sm border border-spec-2/40 bg-spec-2/5 px-3 py-2 text-sm text-spec-2"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 md:flex-row">
          <button
            onClick={exportConfig}
            className="w-full rounded-full border border-noir-700 py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-500 hover:text-cream"
          >
            {copied
              ? label("Configuração copiada", "Config copied")
              : label("Copiar configuração do banner", "Copy banner config")}
          </button>
          <button
            onClick={saveAll}
            disabled={loading}
            className="w-full rounded-full bg-cream py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading
              ? label("Salvando...", "Saving...")
              : label("Salvar alterações", "Save changes")}
          </button>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        initialImage={cropperTarget?.url}
        onClose={() => {
          setCropperOpen(false);
          setCropperTarget(null);
        }}
        onSave={onCropSave}
      />
    </div>
  );
}

export function useHeroImages(defaultImages: string[]): string[] {
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cfg = await fetchHeroConfig();
        if (cfg.images.length > 0) setImages(cfg.images.slice(0, MAX_HERO_ITEMS));
      } catch {
        /* ignore, usa default */
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, []);

  return images;
}

export function useHeroScenes(defaultScenes: readonly string[]): string[] {
  const [scenes, setScenes] = useState<string[]>([...defaultScenes]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cfg = await fetchHeroConfig();
        if (cfg.scenes.length > 0) setScenes(cfg.scenes.slice(0, MAX_HERO_ITEMS));
      } catch {
        /* ignore */
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, [defaultScenes]);

  return scenes;
}

export function useHeroReels(defaultReels: readonly string[] = []): string[] {
  const [reels, setReels] = useState<string[]>([...defaultReels]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cfg = await fetchHeroConfig();
        if (cfg.reels.length > 0) setReels(cfg.reels.slice(0, MAX_HERO_ITEMS));
      } catch {
        /* ignore */
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, [defaultReels]);

  return reels;
}

export function useHeroBannerVideos(defaultVideos: readonly string[] = []): string[] {
  const [videos, setVideos] = useState<string[]>([...defaultVideos]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cfg = await fetchHeroConfig();
        // Mantém o mesmo tamanho de heroImages: entradas vazias ("") indicam
        // que aquela cena usa a imagem estática, não um vídeo.
        setVideos(cfg.videos.slice(0, MAX_HERO_ITEMS));
      } catch {
        /* ignore, mantém defaults */
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, [defaultVideos]);

  return videos;
}

export function useHeroVideo(): { url: string; poster: string } | null {
  const [video, setVideo] = useState<{ url: string; poster: string } | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const cfg = await fetchHeroConfig();
        if (cfg.backgroundVideo.url && cfg.backgroundVideo.poster) {
          setVideo(cfg.backgroundVideo);
        } else {
          setVideo(null);
        }
      } catch {
        setVideo(null);
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, []);

  return video;
}
