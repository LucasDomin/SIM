import type { CropPixels } from "../types/cms";

export const maxUploadSize = 50 * 1024 * 1024;
export const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/avif"];
export const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

export function formatBytes(bytes: number) {
  if (!bytes) return "Remoto";
  const unit = bytes > 1024 * 1024 ? "MB" : "KB";
  const value = unit === "MB" ? bytes / 1024 / 1024 : bytes / 1024;
  return `${value.toFixed(value > 10 ? 0 : 1)} ${unit}`;
}

export function ratio(width?: number | null, height?: number | null) {
  if (!width || !height) return "-";
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(width, height);
  return `${Math.round(width / g)}:${Math.round(height / g)}`;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

export function getVideoMeta(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight, duration: video.duration });
    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
}

export async function cropImageToFile(file: File, crop: CropPixels, outputName: string) {
  if (file.type === "image/svg+xml" || file.type === "image/avif") return file;
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.width);
  canvas.height = Math.round(crop.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao otimizar imagem"))), "image/webp", 0.92));
  return new File([blob], outputName.replace(/\.(png|jpe?g|webp)$/i, ".webp"), { type: "image/webp" });
}

export function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-");
}