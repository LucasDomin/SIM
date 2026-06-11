import { useMemo, useState } from "react";
import { useCMS } from "../../hooks/useCMS";
import { saveMediaAsset, uploadToStorage } from "../../lib/cmsRepository";
import { allowedImageTypes, allowedVideoTypes, cropImageToFile, formatBytes, getImageDimensions, getVideoMeta, ratio, sanitizeFileName, maxUploadSize } from "../../lib/mediaUtils";
import type { CropPixels, MediaAsset } from "../../types/cms";
import { AdminButton, AdminCard } from "../components/AdminCard";
import CropModal from "../components/CropModal";

export default function MediaPage() {
  const { media, refresh } = useCMS();
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const filtered = useMemo(() => kind === "all" ? media : media.filter((m) => m.kind === kind), [media, kind]);
  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Assets</p><h1 className="font-display text-5xl">Mídia</h1></div>
        <div className="glass-light rounded-full p-1 flex gap-1">{(["all", "image", "video"] as const).map((x) => <button key={x} onClick={() => setKind(x)} className={`rounded-full px-4 py-2 text-sm ${kind === x ? "bg-noir-50 text-noir-900" : "text-noir-300"}`}>{x}</button>)}</div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((asset) => <MediaCard key={asset.id} asset={asset} onEdit={() => setEditing(asset)} />)}
      </div>
      {editing && <MediaEditor asset={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await refresh(); }} />}
    </section>
  );
}

function MediaCard({ asset, onEdit }: { asset: MediaAsset; onEdit: () => void }) {
  return (
    <AdminCard>
      <div className="aspect-video rounded-xl bg-noir-800 overflow-hidden mb-4 grid place-items-center">
        {asset.kind === "image" ? <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" loading="lazy" /> : asset.url ? <video src={asset.url} className="w-full h-full object-cover" muted /> : <span className="text-noir-500">Sem vídeo</span>}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div><div className="text-noir-50 font-medium">{asset.name}</div><div className="text-xs text-noir-500">{asset.mimeType || "remoto"} · {formatBytes(asset.size)} · {asset.width || "-"} × {asset.height || "-"} · {asset.ratio || ratio(asset.width, asset.height)}</div></div>
        <AdminButton onClick={onEdit}>Editar</AdminButton>
      </div>
    </AdminCard>
  );
}

function MediaEditor({ asset, onClose, onSaved }: { asset: MediaAsset; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState(asset);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [cropSrc, setCropSrc] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (next: File) => {
    setError("");
    if (next.size > maxUploadSize) return setError("Arquivo acima do limite de 50MB.");
    if (asset.kind === "image" && !allowedImageTypes.includes(next.type)) return setError("Formato de imagem inválido.");
    if (asset.kind === "video" && !allowedVideoTypes.includes(next.type)) return setError("Formato de vídeo inválido.");
    const url = URL.createObjectURL(next);
    setPreview(url);
    if (asset.kind === "image") {
      const dim = next.type === "image/svg+xml" ? { width: asset.width || 0, height: asset.height || 0 } : await getImageDimensions(next);
      setDraft({ ...draft, name: next.name, mimeType: next.type, size: next.size, width: dim.width, height: dim.height, ratio: ratio(dim.width, dim.height) });
      setFile(next);
      if (next.type !== "image/svg+xml" && next.type !== "image/avif") setCropSrc(url);
    } else {
      const meta = await getVideoMeta(next);
      setDraft({ ...draft, name: next.name, mimeType: next.type, size: next.size, width: meta.width, height: meta.height, duration: meta.duration, ratio: ratio(meta.width, meta.height) });
      setFile(next);
    }
  };

  const save = async (crop?: CropPixels) => {
    let uploadFile = file;
    if (uploadFile && asset.kind === "image" && crop) uploadFile = await cropImageToFile(uploadFile, crop, uploadFile.name);
    const url = uploadFile ? await uploadToStorage(uploadFile, `${asset.id}/${Date.now()}-${sanitizeFileName(uploadFile.name)}`, asset.kind === "video" ? "videos" : "images") : draft.url;
    await saveMediaAsset({ ...draft, url, mimeType: uploadFile?.type ?? draft.mimeType, size: uploadFile?.size ?? draft.size });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-noir-950/85 backdrop-blur-xl grid place-items-center p-5">
      <div className="glass rounded-3xl p-6 w-full max-w-3xl">
        <h2 className="font-display text-3xl mb-2">{asset.name}</h2>
        <p className="text-xs text-noir-500 mb-5">{asset.id} · {asset.category}</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="aspect-video rounded-xl overflow-hidden bg-noir-800 grid place-items-center">{asset.kind === "image" ? <img src={preview || draft.url} className="w-full h-full object-cover" /> : <video src={preview || draft.url} className="w-full h-full object-cover" controls />}</div>
          <div className="space-y-3 text-sm text-noir-300">
            <div>Formato: <span className="text-noir-50">{draft.mimeType}</span></div><div>Peso: <span className="text-noir-50">{formatBytes(draft.size)}</span></div><div>Dimensões: <span className="text-noir-50">{draft.width || "-"} × {draft.height || "-"}</span></div><div>Proporção: <span className="text-noir-50">{draft.ratio || ratio(draft.width, draft.height)}</span></div>{asset.kind === "video" && <div>Duração: <span className="text-noir-50">{draft.duration ? `${draft.duration.toFixed(1)}s` : "-"}</span></div>}
            <input type="file" accept={asset.kind === "image" ? allowedImageTypes.join(",") : allowedVideoTypes.join(",")} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="block w-full text-sm" />
            {error && <div className="text-red-300">{error}</div>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><AdminButton tone="dark" onClick={onClose}>Cancelar</AdminButton><AdminButton onClick={() => file && asset.kind === "image" && cropSrc ? setCropSrc(cropSrc) : save()}>Salvar</AdminButton></div>
      </div>
      {cropSrc && <CropModal src={cropSrc} ratio={16 / 9} onCancel={() => { setCropSrc(""); setFile(null); setPreview(""); }} onConfirm={(crop) => save(crop)} />}
    </div>
  );
}