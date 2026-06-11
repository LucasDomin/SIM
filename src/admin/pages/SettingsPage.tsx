import { useEffect, useState } from "react";
import { getSettings, saveSetting } from "../../lib/cmsRepository";
import type { SiteSetting } from "../../types/cms";
import { AdminButton, AdminCard } from "../components/AdminCard";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  useEffect(() => { getSettings().then(setSettings); }, []);
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Configurações</p>
      <h1 className="font-display text-5xl mb-8">Settings</h1>
      <div className="space-y-3">
        {settings.map((setting) => <SettingRow key={setting.id} setting={setting} onSave={(next) => setSettings((s) => s.map((x) => x.id === next.id ? next : x))} />)}
      </div>
    </section>
  );
}

function SettingRow({ setting, onSave }: { setting: SiteSetting; onSave: (setting: SiteSetting) => void }) {
  const [value, setValue] = useState(setting.value);
  return (
    <AdminCard className="grid md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-3"><div className="text-noir-50">{setting.label}</div><div className="text-xs text-noir-500">{setting.id}</div></div>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="md:col-span-7 bg-noir-800 rounded-xl px-4 py-3 outline-none" />
      <div className="md:col-span-2 text-right"><AdminButton onClick={async () => onSave(await saveSetting({ ...setting, value }))}>Salvar</AdminButton></div>
    </AdminCard>
  );
}