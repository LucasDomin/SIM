/**
 * sanitize.ts
 * Pequena camada de defesa para inputs vindos do painel de edição.
 * O React já escapa text-content por padrão, mas precisamos:
 *  - bloquear URLs com esquemas perigosos (javascript:, data:, vbscript:)
 *  - remover tags HTML em campos de texto (mesmo que React escape, evita
 *    confusão visual e dados sujos no localStorage / exportação futura)
 *  - limitar tamanho para evitar abuso de storage
 */

const DANGEROUS_SCHEMES = /^\s*(javascript|vbscript|data|file):/i;
const ALLOWED_IMAGE_SCHEMES = /^(https?:|data:image\/(png|jpe?g|webp|gif|svg\+xml);)/i;
const ALLOWED_MEDIA_SCHEMES = /^(https?:)/i;

const TEXT_MAX = 5000;
const URL_MAX = 4096;

/** Remove tags HTML básicas e normaliza espaços. Limita tamanho. */
export function sanitizeText(input: unknown, max = TEXT_MAX): string {
  if (typeof input !== "string") return "";
  const stripped = input
    // remove tags inteiras (<script>, <iframe>, etc)
    .replace(/<\/?[a-z][\s\S]*?>/gi, "")
    // remove handlers inline-style/javascript residuais
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\u0000/g, "");
  return stripped.slice(0, max).trim();
}

/**
 * Sanitiza URL de imagem.
 * - Permite http(s) ou data:image/*;base64,...
 * - Rejeita qualquer outro esquema (javascript:, vbscript:, file:)
 * Retorna string vazia se inválido.
 */
export function sanitizeImageUrl(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, URL_MAX);
  if (!trimmed) return "";
  if (DANGEROUS_SCHEMES.test(trimmed)) return "";
  if (!ALLOWED_IMAGE_SCHEMES.test(trimmed)) return "";
  return trimmed;
}

/**
 * Sanitiza URL de mídia (vídeo): só permite http(s).
 * Vídeos em data: são pesados demais para um build single-file
 * e geralmente indicam tentativa de abuso.
 */
export function sanitizeMediaUrl(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, URL_MAX);
  if (!trimmed) return "";
  if (DANGEROUS_SCHEMES.test(trimmed)) return "";
  if (!ALLOWED_MEDIA_SCHEMES.test(trimmed)) return "";
  return trimmed;
}

/** Bytes aproximados de uma string (útil para travar uploads gigantes em base64). */
export function approxByteSize(str: string): number {
  // base64: cada 4 chars ~ 3 bytes
  if (str.startsWith("data:")) {
    const base64 = str.split(",")[1] ?? "";
    return Math.floor(base64.length * 0.75);
  }
  return str.length;
}

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
