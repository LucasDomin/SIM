import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-noir-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display italic text-4xl text-noir-50">
            SIM<span className="text-accent">.</span>
          </h1>
          <p className="text-sm text-noir-400 mt-2">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-noir-900 rounded-2xl p-8 border border-noir-100/10">
          <h2 className="text-xl text-noir-50 mb-6">Acesso Administrativo</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.2em] text-noir-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-noir-800 border border-noir-100/10 rounded-lg px-4 py-3 text-noir-50 outline-none focus:border-accent transition-colors"
                placeholder="admin@sim.studio"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.2em] text-noir-400 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-noir-800 border border-noir-100/10 rounded-lg px-4 py-3 text-noir-50 outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-noir-50 text-noir-900 rounded-lg py-3 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Help */}
        <p className="text-center text-xs text-noir-500 mt-6">
          Acesso restrito a administradores autorizados
        </p>
      </div>
    </div>
  );
}
