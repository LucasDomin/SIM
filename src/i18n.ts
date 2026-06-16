// SIM — bilingual content (PT default · EN toggle)
// The brand is Portuguese; copy stays editorial and precise.

export type Lang = "pt" | "en";

export const translations = {
  pt: {
    nav: {
      works: "Trabalhos",
      studio: "Estúdio",
      manifesto: "Manifesto",
      contact: "Contato",
      admin: "Acesso",
    },
    hero: {
      reel: "REEL 2025",
      title1: "Capturas que",
      titleEm: "permanecem",
      title2: "em movimento.",
      kicker: "Still In Movement",
      subtitle:
        "Estúdio independente dedicado à fotografia editorial e ao cinema de marca — para quem entende o valor do detalhe.",
      scroll: "Rolar para descobrir",
      scenes: ["Atlas · 2025", "Noctilucent · 2024", "Kintsugi · 2024"],
    },
    manifesto: {
      label: "Manifesto",
      lead: "Still In Movement",
      body: "Acreditamos numa contradição bonita: a imagem parada que contém o movimento. Entre o instante congelado da fotografia e o tempo contínuo do cinema, existe um espaço onde vivem as marcas que respeitam o silêncio.",
      body2:
        "Filmamos a luz como matéria. Construímos ritmo no corte. Deixamos a respiração entrar em cada quadro.",
      toggleStill: "Still",
      toggleMove: "Movement",
    },
    works: {
      label: "Trabalhos Selecionados",
      title: "Quadros em sequência",
      desc: "Uma curadoria de cinema de marca, documentário e editorial.",
      view: "Ver case",
      play: "Reproduzir",
    },
    frames: {
      label: "Galeria",
      title: "Cada quadro, um movimento",
      desc: "Stills extraídos das produções — a sequência que se torna filme.",
    },
    capabilities: {
      label: "O que fazemos",
      title: "Disciplinas",
      list: [
        {
          k: "01",
          t: "Cinema de Marca",
          d: "Filmes e campanhas com direção autoral, fotografia cinematográfica e design de som.",
        },
        {
          k: "02",
          t: "Fotografia Editorial",
          d: "Imagens para moda, arquitetura e retrato — do conceito à pós-produção.",
        },
        {
          k: "03",
          t: "Documentário",
          d: "Narrativas íntimas e retratos humanos filmados com honestidade e tempo.",
        },
        {
          k: "04",
          t: "Fashion Film",
          d: "Tradução de coleções em pura atmosfera, luz e materialidade.",
        },
      ],
    },
    clients: { label: "Confiam no SIM", title: "Clientes" },
    recognition: {
      label: "Reconhecimento",
      title: "Premiações",
      stats: [
        { n: "12+", l: "Anos em cena" },
        { n: "180", l: "Produções" },
        { n: "9", l: "Países" },
        { n: "24", l: "Prêmios" },
      ],
    },
    estimate: {
      label: "Orçamento",
      title: "Inicie um projeto",
      desc: "Simule o investimento do seu filme ou editorial em segundos.",
      cta: "Pedir orçamento",
      summary: "Estimativa",
      currency: "R$",
    },
    footer: {
      tagline: "Capturas que permanecem em movimento.",
      contact: "Contato",
      studio: "Estúdio",
      locations: "São Paulo - Brasil",
      rights: "Todos os direitos reservados.",
      email: "Olá, vamos conversar",
    },
    ai: {
      title: "Assistente SIM",
      greeting:
        "Olá. Sou o assistente do SIM. Posso ajudar a pensar o seu próximo filme.",
      placeholder: "Escreva sua mensagem…",
    },
  },
  en: {
    nav: {
      works: "Works",
      studio: "Studio",
      manifesto: "Manifesto",
      contact: "Contact",
      admin: "Access",
    },
    hero: {
      reel: "REEL 2025",
      title1: "Captures that",
      titleEm: "remain",
      title2: "in motion.",
      kicker: "Still In Movement",
      subtitle:
        "An independent studio devoted to editorial photography and brand cinema — for those who understand the value of detail.",
      scroll: "Scroll to discover",
      scenes: ["Atlas · 2025", "Noctilucent · 2024", "Kintsugi · 2024"],
    },
    manifesto: {
      label: "Manifesto",
      lead: "Still In Movement",
      body: "We believe in a beautiful contradiction: the still image that holds movement within. Between the frozen instant of a photograph and the continuous time of cinema, there is a space where brands that respect silence live.",
      body2:
        "We film light as matter. We build rhythm in the cut. We let breath enter every frame.",
      toggleStill: "Still",
      toggleMove: "Movement",
    },
    works: {
      label: "Selected Works",
      title: "Frames in sequence",
      desc: "A curated selection of brand cinema, documentary and editorial.",
      view: "View case",
      play: "Play",
    },
    frames: {
      label: "Gallery",
      title: "Each frame, a movement",
      desc: "Stills pulled from our productions — the sequence that becomes film.",
    },
    capabilities: {
      label: "What we do",
      title: "Disciplines",
      list: [
        {
          k: "01",
          t: "Brand Cinema",
          d: "Films and campaigns with authored direction, cinematic photography and sound design.",
        },
        {
          k: "02",
          t: "Editorial Photography",
          d: "Images for fashion, architecture and portraiture — from concept to post.",
        },
        {
          k: "03",
          t: "Documentary",
          d: "Intimate narratives and human portraits filmed with honesty and time.",
        },
        {
          k: "04",
          t: "Fashion Film",
          d: "Translating collections into pure atmosphere, light and materiality.",
        },
      ],
    },
    clients: { label: "They trust SIM", title: "Clients" },
    recognition: {
      label: "Recognition",
      title: "Awards",
      stats: [
        { n: "12+", l: "Years on set" },
        { n: "180", l: "Productions" },
        { n: "9", l: "Countries" },
        { n: "24", l: "Awards" },
      ],
    },
    estimate: {
      label: "Quote",
      title: "Start a project",
      desc: "Estimate the investment for your film or editorial in seconds.",
      cta: "Request quote",
      summary: "Estimate",
      currency: "R$",
    },
    footer: {
      tagline: "Captures that remain in motion.",
      contact: "Contact",
      studio: "Studio",
      locations: "São Paulo - Brasil",
      rights: "All rights reserved.",
      email: "Say hello, let's talk",
    },
    ai: {
      title: "SIM Assistant",
      greeting:
        "Hi. I'm the SIM assistant. I can help shape your next film.",
      placeholder: "Type your message…",
    },
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends ReadonlyArray<infer U>
  ? readonly Widen<U>[]
  : { [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<(typeof translations)["pt"]>;
