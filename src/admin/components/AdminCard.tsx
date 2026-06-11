export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-5 md:p-6 ${className}`}>{children}</div>;
}

export function AdminButton({ children, onClick, tone = "light", type = "button", disabled = false }: { children: React.ReactNode; onClick?: () => void; tone?: "light" | "dark" | "danger"; type?: "button" | "submit"; disabled?: boolean }) {
  const cls = tone === "danger" ? "bg-red-500 text-white" : tone === "dark" ? "bg-noir-800 text-noir-50" : "bg-noir-50 text-noir-900";
  return <button type={type} disabled={disabled} onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-40 ${cls}`}>{children}</button>;
}