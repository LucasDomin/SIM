import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import type { CropPixels } from "../../types/cms";
import { AdminButton } from "./AdminCard";

export default function CropModal({ src, ratio = 16 / 9, onCancel, onConfirm }: { src: string; ratio?: number; onCancel: () => void; onConfirm: (crop: CropPixels) => void }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<CropPixels | null>(null);
  const onComplete = useCallback((_area: Area, areaPixels: Area) => setPixels(areaPixels), []);

  return (
    <div className="fixed inset-0 z-[140] bg-noir-950/90 backdrop-blur-xl p-5 grid place-items-center">
      <div className="glass rounded-3xl p-5 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="font-display text-3xl">Confirmar crop</h2><p className="text-sm text-noir-400">Proporção recomendada: {ratio.toFixed(2)}:1</p></div>
          <div className="text-xs text-noir-400">{pixels ? `${Math.round(pixels.width)} × ${Math.round(pixels.height)}` : "Ajuste a imagem"}</div>
        </div>
        <div className="relative h-[460px] rounded-2xl overflow-hidden bg-noir-900">
          <Cropper image={src} crop={crop} zoom={zoom} aspect={ratio} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onComplete} />
        </div>
        <label className="block mt-5 text-sm text-noir-300">Zoom
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
        </label>
        <div className="flex justify-end gap-3 mt-5">
          <AdminButton tone="dark" onClick={onCancel}>Cancelar</AdminButton>
          <AdminButton onClick={() => pixels && onConfirm(pixels)} disabled={!pixels}>Confirmar Crop</AdminButton>
        </div>
      </div>
    </div>
  );
}