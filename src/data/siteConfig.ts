import { projects } from "./projects";

/**
 * Configuração publicada/versionada do site.
 *
 * IMPORTANTE:
 * - O editor no navegador salva em localStorage (só naquele navegador).
 * - Para as alterações ficarem em deploys futuros e para todos os visitantes,
 *   copie a configuração exportada pelo painel para este arquivo e faça deploy.
 */

export const SITE_CONFIG = {
  hero: {
    images: [projects[0].cover, projects[5].cover, projects[3].cover],
    scenes: ["Atlas · 2025", "Noctilucent · 2024", "Kintsugi · 2024"],
    reels: ["", "", ""],
    backgroundVideo: {
      url: "",
      poster: "",
    },
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;