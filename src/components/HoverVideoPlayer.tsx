import { useRef, useState, useEffect } from "react";
import {
  getYouTubeId,
  youTubeEmbedUrl,
  youTubeThumb,
  youTubeThumbFallback,
} from "../lib/youtube";

/**
 * HoverVideoPlayer — exibe uma capa (poster) estática.
 * Ao passar o mouse, inicia o vídeo com fade suave.
 * Ao sair, pausa e volta para a capa.
 *
 * Aceita dois tipos de vídeo:
 *  - arquivo direto (.mp4 etc.) → <video>
 *  - link do YouTube (inclusive não listado) → iframe mudo, sem controles,
 *    montado só durante o hover (não pesa o carregamento da página).
 *    Se não houver capa, usa a thumbnail do próprio YouTube.
 */
export function HoverVideoPlayer({
  videoUrl,
  posterUrl,
  aspectRatio = "16 / 10",
  className = "",
}: {
  videoUrl: string;
  posterUrl?: string;
  aspectRatio?: string;
  className?: string;
}) {
  const ytId = getYouTubeId(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [poster, setPoster] = useState(posterUrl || (ytId ? youTubeThumb(ytId) : ""));

  useEffect(() => {
    setPoster(posterUrl || (ytId ? youTubeThumb(ytId) : ""));
  }, [posterUrl, ytId]);

  useEffect(() => {
    if (ytId) return;
    const v = videoRef.current;
    if (!v) return;
    v.load(); // força recarregar quando URL muda
  }, [videoUrl, ytId]);

  const onEnter = () => {
    setPlaying(true);
    if (ytId) return; // o iframe é montado pelo estado `playing`
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // alguns navegadores bloqueiam autoplay — fallback silencioso
      setPlaying(false);
    });
  };

  const onLeave = () => {
    setPlaying(false);
    if (ytId) {
      setLoaded(false); // o iframe é desmontado
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const showVideo = playing && loaded;

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Capa estática — aparece instantaneamente */}
      {poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: showVideo ? 0 : 1 }}
          onError={() => {
            if (ytId && poster === youTubeThumb(ytId)) setPoster(youTubeThumbFallback(ytId));
          }}
        />
      )}

      {ytId ? (
        playing && (
          // iframe 16:9 ampliado para cobrir o quadro (efeito object-cover)
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{ opacity: showVideo ? 1 : 0 }}
          >
            <iframe
              src={youTubeEmbedUrl(ytId, "background")}
              title=""
              tabIndex={-1}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 border-0"
              onLoad={() => {
                // pequeno atraso para esconder a tela preta inicial do player
                window.setTimeout(() => setLoaded(true), 600);
              }}
            />
          </div>
        )
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: showVideo ? 1 : 0 }}
          onLoadedData={() => setLoaded(true)}
        />
      )}

      {/* Indicador sutil de vídeo */}
      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-noir-950/50 px-2.5 py-1 backdrop-blur-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${showVideo ? "bg-accent animate-pulse" : "bg-cream/40"}`} />
        <span className="font-mono text-[8px] uppercase tracking-wide2 text-cream/70">
          {showVideo ? "PLAY" : "REEL"}
        </span>
      </div>
    </div>
  );
}
import { useRef, useState, useEffect } from "react";

/**
 * HoverVideoPlayer — exibe uma capa (poster) estática.
 * Ao passar o mouse, inicia o vídeo com fade suave.
 * Ao sair, pausa e volta para a capa.
 *
 * Estratégia de performance:
 *  - preload="metadata" (não baixa o vídeo inteiro de cara)
 *  - muted + playsInline (permite autoplay sem interação do usuário)
 *  - fade de 400ms para não parecer "piscada"
 */
export function HoverVideoPlayer({
  videoUrl,
  posterUrl,
  aspectRatio = "16 / 10",
  className = "",
}: {
  videoUrl: string;
  posterUrl: string;
  aspectRatio?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load(); // força recarregar quando URL muda
  }, [videoUrl]);

  const onEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(true);
    v.play().catch(() => {
      // alguns navegadores bloqueiam autoplay — fallback silencioso
      setPlaying(false);
    });
  };

  const onLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Capa estática — aparece instantaneamente */}
      <img
        src={posterUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: playing && loaded ? 0 : 1 }}
      />

      {/* Vídeo — inicia no hover */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: playing && loaded ? 1 : 0 }}
        onLoadedData={() => setLoaded(true)}
      />

      {/* Indicador sutil de vídeo */}
      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-noir-950/50 px-2.5 py-1 backdrop-blur-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${playing && loaded ? "bg-accent animate-pulse" : "bg-cream/40"}`} />
        <span className="font-mono text-[8px] uppercase tracking-wide2 text-cream/70">
          {playing && loaded ? "PLAY" : "REEL"}
        </span>
      </div>
    </div>
  );
}
