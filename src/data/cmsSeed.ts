import type { ContentItem, MediaAsset, SiteSetting } from "../types/cms";
import { projects } from "./projects";

const now = new Date().toISOString();

export const defaultContent: ContentItem[] = [
  { id: "nav.home", friendlyName: "Menu Início", category: "Navegação", type: "text", value: "Início", updatedAt: now },
  { id: "nav.work", friendlyName: "Menu Trabalhos", category: "Navegação", type: "text", value: "Trabalhos", updatedAt: now },
  { id: "nav.studio", friendlyName: "Menu Estrada", category: "Navegação", type: "text", value: "Estrada", updatedAt: now },
  { id: "nav.estimate", friendlyName: "Menu Orçamento", category: "Navegação", type: "text", value: "Orçamento", updatedAt: now },
  { id: "hero.eyebrow", friendlyName: "Hero Eyebrow", category: "Hero", type: "text", value: "Cinematic Photography · Audiovisual Studio", updatedAt: now },
  { id: "hero.title.1", friendlyName: "Hero Título Linha 1", category: "Hero", type: "text", value: "Capturas que", updatedAt: now },
  { id: "hero.title.em", friendlyName: "Hero Palavra em Destaque", category: "Hero", type: "text", value: "permanecem", updatedAt: now },
  { id: "hero.title.2", friendlyName: "Hero Título Linha 2", category: "Hero", type: "text", value: "em movimento.", updatedAt: now },
  { id: "hero.subtitle", friendlyName: "Hero Subtítulo", category: "Hero", type: "text", value: "Estúdio independente dedicado à fotografia editorial e ao cinema de marca para clientes que entendem o valor do detalhe.", updatedAt: now },
  { id: "hero.cta.primary", friendlyName: "Hero CTA Primário", category: "Hero", type: "text", value: "Assistir reel", updatedAt: now },
  { id: "hero.cta.secondary", friendlyName: "Hero CTA Secundário", category: "Hero", type: "text", value: "Solicitar orçamento inteligente →", updatedAt: now },
  { id: "work.eyebrow", friendlyName: "Trabalhos Eyebrow", category: "Trabalhos", type: "text", value: "· 01 / Selected Work", updatedAt: now },
  { id: "work.title.1", friendlyName: "Trabalhos Título", category: "Trabalhos", type: "text", value: "Casos selecionados", updatedAt: now },
  { id: "work.title.2", friendlyName: "Trabalhos Subtítulo", category: "Trabalhos", type: "text", value: "do nosso arquivo.", updatedAt: now },
  { id: "manifesto.eyebrow", friendlyName: "Manifesto Eyebrow", category: "Manifesto", type: "text", value: "· 02 / Manifesto", updatedAt: now },
  { id: "manifesto.text", friendlyName: "Manifesto Texto", category: "Manifesto", type: "text", value: "Acreditamos que a melhor imagem é aquela que continua a existir depois de fechar os olhos. Não fabricamos atenção — construímos memória.", updatedAt: now },
  { id: "manifesto.meta", friendlyName: "Manifesto Meta", category: "Manifesto", type: "text", value: "Estúdio Still In Moviment · Est. 2017 · Lisboa / São Paulo", updatedAt: now },
  { id: "services.eyebrow", friendlyName: "Serviços Eyebrow", category: "Serviços", type: "text", value: "· 03 / Studio", updatedAt: now },
  { id: "services.title.1", friendlyName: "Serviços Título", category: "Serviços", type: "text", value: "Quatro disciplinas.", updatedAt: now },
  { id: "services.title.2", friendlyName: "Serviços Subtítulo", category: "Serviços", type: "text", value: "Uma só linguagem.", updatedAt: now },
  { id: "ai.title", friendlyName: "IA Título", category: "IA", type: "text", value: "Conheça Vera.", updatedAt: now },
  { id: "estimate.title", friendlyName: "Orçamento Título", category: "Orçamento", type: "text", value: "Um orçamento em 90 segundos.", updatedAt: now },
  { id: "footer.brand", friendlyName: "Rodapé Marca Escrita", category: "Rodapé", type: "text", value: "Still In Moviment", updatedAt: now },
  { id: "footer.tagline", friendlyName: "Rodapé Frase", category: "Rodapé", type: "text", value: "Capturas que permanecem em movimento.", updatedAt: now },
  { id: "footer.copyright", friendlyName: "Copyright", category: "Rodapé", type: "text", value: "© 2026 Estúdio Still In Moviment · Todos os direitos reservados", updatedAt: now },
];

export const defaultMedia: MediaAsset[] = [
  { id: "hero.image.1", name: "Hero 01", kind: "image", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2800&q=85", mimeType: "image/jpeg", size: 0, width: 2800, height: 1800, ratio: "16:9", category: "Hero", updatedAt: now },
  { id: "hero.image.2", name: "Hero 02", kind: "image", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2800&q=85", mimeType: "image/jpeg", size: 0, width: 2800, height: 1800, ratio: "16:9", category: "Hero", updatedAt: now },
  { id: "hero.image.3", name: "Hero 03", kind: "image", url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=2800&q=85", mimeType: "image/jpeg", size: 0, width: 2800, height: 1800, ratio: "16:9", category: "Hero", updatedAt: now },
  ...projects.flatMap((project) => [
    { id: `project.${project.slug}.cover`, name: `${project.title} Cover`, kind: "image" as const, url: project.cover, mimeType: "image/jpeg", size: 0, width: 2400, height: 1600, ratio: "3:2", category: "Cases", updatedAt: now },
    ...project.stills.map((url, index) => ({ id: `project.${project.slug}.still.${index + 1}`, name: `${project.title} Still ${index + 1}`, kind: "image" as const, url, mimeType: "image/jpeg", size: 0, width: 2000, height: 1125, ratio: "16:9", category: "Cases", updatedAt: now })),
  ]),
];

export const defaultVideos: MediaAsset[] = [
  { id: "video.reel", name: "Reel Principal", kind: "video", url: "", mimeType: "video/mp4", size: 0, width: 1920, height: 1080, duration: 0, ratio: "16:9", category: "Vídeos", updatedAt: now },
];

export const defaultSettings: SiteSetting[] = [
  { id: "brand.name", label: "Nome da marca", value: "Still In Moviment", updatedAt: now },
  { id: "whatsapp.number", label: "WhatsApp", value: "351900000000", updatedAt: now },
  { id: "contact.email", label: "Email de contato", value: "studio@momentum.film", updatedAt: now },
];