/**
 * youtube.ts
 * Suporte a vídeos do YouTube (inclusive "não listados") nos projetos.
 * Basta colar o link do vídeo no painel — qualquer formato abaixo funciona:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/shorts/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/live/ID
 */

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeId(url: string | undefined | null): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = u.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/);
      if (m) id = m[2];
    }
  }
  return id && ID_RE.test(id) ? id : null;
}

export const isYouTube = (url: string | undefined | null) => getYouTubeId(url) !== null;

/** Thumbnail automática do YouTube — usada quando não há capa (poster). */
export function youTubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/** Versão menor que sempre existe — fallback se a maxres não existir. */
export function youTubeThumbFallback(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * URL de embed.
 * - "background": mudo, sem controles, em loop (prévia no hover)
 * - "player": player normal com controles (página do projeto)
 */
export function youTubeEmbedUrl(id: string, mode: "background" | "player"): string {
  const p = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (mode === "background") {
    p.set("autoplay", "1");
    p.set("mute", "1");
    p.set("controls", "0");
    p.set("loop", "1");
    p.set("playlist", id); // necessário para o loop funcionar
    p.set("disablekb", "1");
    p.set("iv_load_policy", "3");
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}
