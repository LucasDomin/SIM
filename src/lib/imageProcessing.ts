import { MAX_IMAGE_BYTES, approxByteSize, sanitizeImageUrl } from "./sanitize";

type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem."));
    img.src = src;
  });
}

/**
 * Compacta imagens locais antes de salvar no localStorage.
 * Evita falhas silenciosas por quota do navegador e melhora performance.
 */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 2200,
    maxHeight = 1400,
    quality = 0.84,
  } = options;

  const original = sanitizeImageUrl(await readAsDataUrl(file));
  if (!original) throw new Error("Arquivo de imagem inválido.");

  const img = await loadImage(original);
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível.");
  ctx.drawImage(img, 0, 0, width, height);

  let q = quality;
  let output = canvas.toDataURL("image/jpeg", q);

  // Reduz qualidade progressivamente até caber no limite final.
  while (approxByteSize(output) > MAX_IMAGE_BYTES && q > 0.55) {
    q -= 0.08;
    output = canvas.toDataURL("image/jpeg", q);
  }

  const safe = sanitizeImageUrl(output);
  if (!safe) throw new Error("Imagem processada inválida.");
  return safe;
}