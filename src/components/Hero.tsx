import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { SITE_CONFIG } from "../data/defaults";
import { useHeroBannerVideos, useHeroImages, useHeroReels, useHeroScenes, useHeroVideo } from "./HeroEditor";
import { Logo } from "./Logo";

/* Film timecode formatter: 00:00:00:00 (HH:MM:SS:FF @ 24fps) */
function tc(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * 24);
  const f = totalFrames % 24;
  const s = Math.floor(totalFrames / 24) % 60;
  const m = Math.floor(totalFrames / (24 * 60)) % 60;
  const h = Math.floor(totalFrames / (24 * 3600));
  const p2 = (n: number) => String(n).padStart(2, "0");
  return `${p2(h)}:${p2(m)}:${p2(s)}:${p2(f)}`;
}

export function Hero({ onEnter }: { onEnter: () => void }) {
  const { t } = useLang();
  const defaultImages = useMemo(
    () => [...SITE_CONFIG.hero.images],
    []
  );
  const savedImages = useHeroImages(defaultImages);
  const heroScenes = useHeroScenes(SITE_CONFIG.hero.scenes.length ? SITE_CONFIG.hero.scenes : t.hero.scenes);
  const heroReels = useHeroReels(SITE_CONFIG.hero.reels);
  const heroVideo = useHeroVideo();
  const heroBannerVideos = useHeroBannerVideos(SITE_CONFIG.hero.videos);
  const heroImages = savedImages.length > 0 ? savedImages : defaultImages;
  const [reelOpen, setReelOpen] = useState(false);

  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0); // 0..1 within current slide
  const [timecode, setTimecode] = useState("00:00:00:00");
  const recStartRef = useRef(performance.now());
  const slideStartRef = useRef(performance.now());
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  const SCENE_MS = 4200;

  // URL do vídeo desta cena (se houver) — quando preenchido, substitui a
  // imagem estática e toca automaticamente aqui na frente do site.
  const activeVideoUrl = heroBannerVideos[active] || "";

  const goNext = useCallback(() => {
    setActive((a) => (heroImages.length ? (a + 1) % heroImages.length : 0));
    setProg(0);
    slideStartRef.current = performance.now();
  }, [heroImages.length]);

  // Timecode "Rec" — roda continuamente, independente da troca de cenas.
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      setTimecode(tc(now - recStartRef.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Avanço automático entre cenas:
  // - cenas com imagem avançam por tempo fixo (SCENE_MS)
  // - cenas com vídeo avançam sozinhas quando o vídeo termina (onEnded)
  // Em ambos os casos, ao chegar na última cena volta para a primeira —
  // o ciclo nunca para.
  useEffect(() => {
    if (activeVideoUrl) return; // vídeo cuida do próprio avanço via onEnded
    slideStartRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - slideStartRef.current;
      const within = Math.min(elapsed / SCENE_MS, 1);
      setProg(within);
      if (elapsed >= SCENE_MS) {
        goNext();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, activeVideoUrl, goNext]);

  // Garante que o vídeo da cena ativa sempre comece do zero e toque —
  // inclusive quando volta para o mesmo índice (ex.: só existe 1 cena de vídeo).
  useEffect(() => {
    const v = videoElRef.current;
    if (v && activeVideoUrl) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* navegadores podem bloquear play() fora de gesto do usuário; como
           está mudo (muted) isso normalmente não ocorre. */
      });
    }
  }, [active, activeVideoUrl]);

  // Parallax on scroll — image sinks, title floats: cinematic depth.
  const [sy, setSy] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSy(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const fade = Math.max(0, 1 - sy / 620);

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-noir-950"
    >
      {/* Background: video (priority) or cycling stills */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${sy * 0.32}px) scale(${1 + sy * 0.0002})`, willChange: "transform" }}
      >
        {heroVideo?.url ? (
          <video
            src={heroVideo.url}
            poster={heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        ) : activeVideoUrl ? (
          <video
            ref={videoElRef}
            src={activeVideoUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProg(v.currentTime / v.duration);
            }}
            onEnded={goNext}
            className="h-full w-full object-cover"
          />
        ) : (
          heroImages.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full animate-slow-zoom-loop object-cover"
                style={{ animationDelay: `${i * -6}s` }}
              />
            </div>
          ))
        )}
      </div>

      {/* Cinematic grading overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/35 to-noir-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir-950/80 via-transparent to-noir-950/40" />
      {/* letterbox vibe */}
      <div className="absolute inset-x-0 top-0 h-[6vh] bg-gradient-to-b from-noir-950/80 to-transparent" />

      {/* Top film UI */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-24 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 md:px-10 md:pt-28">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-blink rounded-full bg-spec-2" />
          <span>Rec</span>
          <span className="text-noir-500">·</span>
          <span>{timecode}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-noir-500">2.39 : 1</span>
          <span className="text-cream">{t.hero.reel}</span>
        </div>
      </div>

      {/* Title block */}
      <div
        className="relative z-20 flex h-full flex-col justify-end px-5 pb-28 md:px-10 md:pb-32"
        style={{ transform: `translateY(${sy * -0.12}px)`, opacity: fade }}
      >
        <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide2 text-accent">
          <span className="inline-block h-px w-8 bg-accent" />
          {t.hero.kicker}
        </div>

        <h1 className="font-display font-light leading-[0.92] tracking-[-0.02em] text-cream text-balance">
          <Logo noBar className="!h-auto w-[60vw] sm:w-[50vw] md:w-[38vw] lg:w-[30vw] text-cream" />
        </h1>

        <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {/* Enter reel */}
          <button
            onClick={() => {
              if (heroReels[active]) setReelOpen(true);
              else onEnter();
            }}
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-noir-500/60 px-6 py-3 font-mono text-[11px] uppercase tracking-wide2 text-cream transition-colors hover:border-accent md:self-auto"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            View Reel
          </button>
        </div>
      </div>

      {/* Bottom: film scrubber + ticker */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6 md:px-10 md:pb-8">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wide2 text-noir-400">
          <span>{heroScenes[active] ?? t.hero.scenes[active] ?? ""}</span>
          <span className="hidden items-center gap-2 md:flex">
            {t.hero.scroll}
            <span className="relative flex h-9 w-px justify-center overflow-hidden">
              <span className="absolute top-0 h-3 w-px animate-drift bg-accent" />
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {heroImages.map((_, i) => (
            <div
              key={i}
              className="relative h-px flex-1 overflow-hidden bg-cream/15"
            >
              <div
                className="absolute inset-y-0 left-0 bg-accent"
                style={{
                  width: i < active ? "100%" : i === active ? `${prog * 100}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {reelOpen && heroReels[active] && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-noir-950/90 p-4 backdrop-blur-md fade-in">
          <div className="absolute inset-0" onClick={() => setReelOpen(false)} aria-hidden />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-sm border border-noir-700 bg-noir-900 fade-up">
            <button
              onClick={() => setReelOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-noir-600 bg-noir-950/70 p-2 text-cream backdrop-blur transition-colors hover:border-accent hover:text-accent"
              aria-label="Close reel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <video
              src={heroReels[active]}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-noir-950 object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
