/**
 * Fotografia — ensaios publicados na aba "Fotografia" do bloco O QUÊ?.
 * As imagens ficam em /public/fotos/<pasta>/ (otimizadas, ~1800px).
 * Para adicionar um ensaio: suba as fotos na pasta e acrescente aqui.
 */
export type Photo = { src: string; w: number; h: number };
export type PhotoSet = { slug: string; title: string; client: string; year: string; photos: Photo[] };

const ms = (n: number, w: number, h: number): Photo => ({
  src: `/fotos/motorspirit/motorspirit-${String(n).padStart(2, "0")}.jpg`,
  w,
  h,
});

export const photoSets: PhotoSet[] = [
  {
    slug: "motor-spirit",
    title: "Motor Spirit",
    client: "Porsche Cup · Interlagos",
    year: "2026",
    photos: [
      ms(1, 1200, 1800), ms(2, 1800, 1200), ms(3, 1484, 1800), ms(4, 1684, 1800),
      ms(5, 1014, 1800), ms(6, 1800, 1484), ms(7, 1800, 1200), ms(8, 1800, 1200),
      ms(9, 1800, 1200), ms(10, 1800, 1154), ms(11, 1800, 1200), ms(12, 1800, 1200),
      ms(13, 1366, 1800), ms(14, 1800, 1200), ms(15, 1800, 1200), ms(16, 1800, 1200),
      ms(17, 1800, 1200), ms(18, 1200, 1800),
    ],
  },
];
