import { useEffect, useMemo, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useConsent, makeSafeStorage } from "../contexts/ConsentContext";
import { SITE_CONFIG } from "../data/siteConfig";
import { ImageCropper } from "./ImageCropper";
import { Reveal } from "./ui";
import {
  sanitizeImageUrl,
  sanitizeMediaUrl,
  sanitizeText,
  approxByteSize,
  MAX_IMAGE_BYTES,
  MAX_SOURCE_IMAGE_BYTES,
} from "../lib/sanitize";
import { compressImageFile } from "../lib/imageProcessing";

const HERO_KEY = "sim-hero-images";
const HERO_VIDEO_KEY = "sim-hero-video";
const HERO_SCENES_KEY = "sim-hero-scenes";
const HERO_REELS_KEY = "sim-hero-reels";
const MAX_HERO_ITEMS = 3;
const DEFAULT_HERO_IMAGES = [...SITE_CONFIG.hero.images];
const DEFAULT_HERO_SCENES = [...SITE_CONFIG.hero.scenes];
const DEFAULT_HERO_REELS = [...SITE_CONFIG.hero.reels];

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
  const { canPersist } = useConsent();
  const storage = useMemo(() => makeSafeStorage(canPersist), [canPersist]);
  const [images, setImages] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>(DEFAULT_HERO_SCENES);
  const [reels, setReels] = useState<string[]>(DEFAULT_HERO_REELS);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPoster, setVideoPoster] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<{
    idx: number;
    url: string;
  } | null>(null);

  // Load from localStorage on open — sempre sanitiza o que veio do storage.
  useEffect(() => {
    if (!open) return;
    try {
      const saved = storage.get(HERO_KEY);
      const parsedImages = saved ? JSON.parse(saved) : DEFAULT_HERO_IMAGES;
      setImages(
        Array.isArray(parsedImages)
          ? parsedImages
              .map((u: unknown) => sanitizeImageUrl(u))
              .filter(Boolean)
              .slice(0, MAX_HERO_ITEMS)
          : DEFAULT_HERO_IMAGES
      );
      const savedScenes = storage.get(HERO_SCENES_KEY);
      const parsedScenes = savedScenes ? JSON.parse(savedScenes) : DEFAULT_HERO_SCENES;
      setScenes(
        Array.isArray(parsedScenes)
          ? parsedScenes.map((s: unknown) => sanitizeText(s, 80)).slice(0, MAX_HERO_ITEMS)
          : DEFAULT_HERO_SCENES
      );
      const savedReels = storage.get(HERO_REELS_KEY);
      const parsedReels = savedReels ? JSON.parse(savedReels) : DEFAULT_HERO_REELS;
      setReels(
        Array.isArray(parsedReels)
          ? parsedReels.map((u: unknown) => sanitizeMediaUrl(u)).slice(0, MAX_HERO_ITEMS)
          : DEFAULT_HERO_REELS
      );
      const vid = storage.get(HERO_VIDEO_KEY);
      if (vid) {
        const parsed = JSON.parse(vid);
        setVideoUrl(sanitizeMediaUrl(parsed.url));
        setVideoPoster(sanitizeImageUrl(parsed.poster));
      }
    } catch {
      /* ignore */
    }
  }, [open, storage]);

  const persistWarn = () => {
    if (!canPersist) {
      setError(
        lang === "pt"
          ? "Aceite o aviso de privacidade para salvar alterações neste navegador."
          : "Accept the privacy notice to save changes in this browser."
      );
    }
  };

  const saveImages = (next: string[]) => {
    const capped = next
      .map((u) => sanitizeImageUrl(u))
      .filter(Boolean)
      .slice(0, MAX_HERO_ITEMS);
    setImages(capped);
    const ok = storage.set(HERO_KEY, JSON.stringify(capped));
    if (!ok) persistWarn();
    emitHeroUpdate();
  };

  const saveScenes = (next: string[]) => {
    const capped = next.map((s) => sanitizeText(s, 80)).slice(0, MAX_HERO_ITEMS);
    setScenes(capped);
    const ok = storage.set(HERO_SCENES_KEY, JSON.stringify(capped));
    if (!ok) persistWarn();
    emitHeroUpdate();
  };

  const saveReels = (next: string[]) => {
    const capped = next.map((u) => sanitizeMediaUrl(u)).slice(0, MAX_HERO_ITEMS);
    setReels(capped);
    const ok = storage.set(HERO_REELS_KEY, JSON.stringify(capped));
    if (!ok) persistWarn();
    emitHeroUpdate();
  };

  const saveVideo = (rawUrl: string, rawPoster: string) => {
    const url = sanitizeMediaUrl(rawUrl);
    const poster = sanitizeImageUrl(rawPoster);
    setVideoUrl(url);
    setVideoPoster(poster);
    const ok = storage.set(HERO_VIDEO_KEY, JSON.stringify({ url, poster }));
    if (!ok) persistWarn();
    emitHeroUpdate();
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
      saveImages([...images, url]);
      saveScenes([...scenes, `Cena ${String(images.length + 1).padStart(2, "0")}`]);
      saveReels([...reels, ""]);
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
    saveImages(next);
    setCropperOpen(false);
    setCropperTarget(null);
  };

  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const addImageUrl = () => {
    if (images.length >= MAX_HERO_ITEMS) return;
    setImages([...images, ""]);
    saveScenes([...scenes, `Cena ${String(images.length + 1).padStart(2, "0")}`]);
    saveReels([...reels, ""]);
  };

  const exportConfig = async () => {
    const config = {
      hero: {
        images,
        scenes,
        reels,
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-cream">
              {label("Editar Banner Principal", "Edit Hero Banner")}
            </h3>
            <p className="mt-1 text-sm text-noir-400">
              {label(
                "Troque até 3 imagens do banner e edite o texto que aparece na linha inferior.",
                "Replace up to 3 banner images and edit the text shown in the bottom line."
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

        {!canPersist && (
          <div className="mb-6 rounded-sm border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {label(
              "Para salvar imagens e textos no navegador, aceite o aviso de privacidade no rodapé da tela.",
              "To save images and text in the browser, accept the privacy notice at the bottom of the screen."
            )}
          </div>
        )}

        {/* Images grid */}
        <div className="mb-8">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
            {label("Imagens do banner", "Banner images")} ({images.length}/{MAX_HERO_ITEMS})
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((url, i) => (
              <div key={i} className="rounded-sm border border-noir-700 bg-noir-950">

                {/* Área da imagem — hover só aqui, isolado dos inputs */}
                <div className="group relative overflow-hidden">
                  {url ? (
                    <img src={url} alt="" className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-noir-800/30 text-center font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
                      {label("Cole a URL abaixo", "Paste URL below")}
                    </div>
                  )}
                  {/* Overlay de ações — só cobre a imagem */}
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
                        saveImages(images.filter((_, j) => j !== i));
                        saveScenes(scenes.filter((_, j) => j !== i));
                        saveReels(reels.filter((_, j) => j !== i));
                      }}
                      className="rounded-full border border-spec-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wide2 text-spec-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {label("Remover", "Remove")}
                    </button>
                  </div>
                  {/* Número */}
                  <span className="absolute left-2 top-2 rounded-full bg-noir-950/70 px-2 py-0.5 font-mono text-[9px] text-cream">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Campos de edição — fora do overflow-hidden, totalmente clicáveis */}
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
                      onBlur={() => saveImages(images)}
                      placeholder="https://.../imagem.jpg"
                      className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-2 py-2 text-[11px] text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
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
                        saveScenes(next);
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
                      onBlur={() => saveReels(reels)}
                      placeholder="https://.../reel.mp4"
                      className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-2 py-2 text-[11px] text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}

            {/* Add new */}
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

        {/* Video section */}
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
                  onBlur={() => saveVideo(videoUrl, videoPoster)}
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
                  onBlur={() => saveVideo(videoUrl, videoPoster)}
                  placeholder="https://.../poster.jpg"
                  className="mt-1 w-full rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-sm text-cream placeholder:text-noir-600 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {videoUrl && videoPoster && (
            <Reveal className="mt-4">
              <div className="overflow-hidden rounded-sm border border-noir-700">
                <video
                  src={videoUrl}
                  poster={videoPoster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="aspect-[16/10] w-full object-cover"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </div>
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wide2 text-noir-500">
                {label("Passe o mouse para testar", "Hover to test")}
              </p>
            </Reveal>
          )}
        </div>

        {/* Mensagens de erro / aviso */}
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-sm border border-spec-2/40 bg-spec-2/5 px-3 py-2 text-sm text-spec-2"
          >
            {error}
          </p>
        )}
        {!canPersist && !error && (
          <p
            role="status"
            className="mb-4 rounded-sm border border-noir-700 bg-noir-950 px-3 py-2 text-xs text-noir-400"
          >
            {label(
              "Aceite o aviso de privacidade para salvar alterações neste navegador.",
              "Accept the privacy notice to save changes in this browser."
            )}
          </p>
        )}

        {/* Actions */}
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
            onClick={onClose}
            className="w-full rounded-full bg-cream py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.01]"
          >
            {label("Salvar alterações", "Save changes")}
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

/**
 * Hook para consumir imagens do Hero salvas no localStorage.
 * Sanitiza tudo o que vem do storage — defesa em profundidade contra
 * URLs perigosas que tenham sido injetadas em algum momento.
 */
export function useHeroImages(defaultImages: string[]): string[] {
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(HERO_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const safe = parsed
              .map((u: unknown) => sanitizeImageUrl(u))
              .filter(Boolean)
              .slice(0, MAX_HERO_ITEMS);
            if (safe.length > 0) setImages(safe);
          }
        }
      } catch {
        /* ignore */
      }
    };
    hydrate();
    window.addEventListener("sim-hero-updated", hydrate);
    return () => window.removeEventListener("sim-hero-updated", hydrate);
  }, []);

  return images;
}

/**
 * Hook para consumir os textos inferiores do Hero salvos no localStorage.
 */
export function useHeroScenes(defaultScenes: readonly string[]): string[] {
  const [scenes, setScenes] = useState<string[]>([...defaultScenes]);

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(HERO_SCENES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setScenes(
              parsed
                .map((s: unknown) => sanitizeText(s, 80))
                .slice(0, MAX_HERO_ITEMS)
            );
          }
        }
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

/** Hook para consumir URLs de reel por imagem do Hero. */
export function useHeroReels(defaultReels: readonly string[] = DEFAULT_HERO_REELS): string[] {
  const [reels, setReels] = useState<string[]>([...defaultReels]);

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(HERO_REELS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setReels(parsed.map((u: unknown) => sanitizeMediaUrl(u)).slice(0, MAX_HERO_ITEMS));
          }
        }
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

/**
 * Hook para consumir vídeo do Hero salvo no localStorage.
 */
export function useHeroVideo(): { url: string; poster: string } | null {
  const [video, setVideo] = useState<{ url: string; poster: string } | null>(null);

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(HERO_VIDEO_KEY);
        if (!saved) {
          setVideo(null);
          return;
        }
        const parsed = JSON.parse(saved);
        const url = sanitizeMediaUrl(parsed?.url);
        const poster = sanitizeImageUrl(parsed?.poster);
        setVideo(url && poster ? { url, poster } : null);
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
