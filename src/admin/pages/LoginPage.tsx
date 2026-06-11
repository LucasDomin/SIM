import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { signIn, isDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-noir-950 text-noir-100 grid place-items-center px-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await signIn(email, password);
          setError(result.error ?? "");
        }}
        className="glass rounded-3xl p-8 w-full max-w-md"
      >
        <div className="font-display italic text-5xl mb-2">sim</div>
        <p className="text-noir-400 mb-8">Acesso administrativo</p>
        <label className="block mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full bg-noir-800 rounded-xl px-4 py-3 outline-none" type="email" required />
        </label>
        <label className="block mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-noir-400">Senha</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full bg-noir-800 rounded-xl px-4 py-3 outline-none" type="password" required />
        </label>
        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
        {isDemo && <p className="text-noir-500 text-xs mb-4">Acesso: jay@admin.com.br / JayAdmin01</p>}
        <button className="w-full rounded-full bg-noir-50 text-noir-900 py-3 font-medium">Entrar</button>
      </form>
    </div>
  );
}