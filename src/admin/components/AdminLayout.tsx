import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/content', label: 'Conteúdo' },
    { path: '/admin/media', label: 'Mídia' },
    { path: '/admin/settings', label: 'Configurações' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-noir-950 text-noir-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-noir-900 border-r border-noir-100/10 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-noir-100/10">
            <h1 className="font-display italic text-2xl text-noir-50">
              SIM<span className="text-accent">.</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-noir-400 mt-1">
              Admin Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-accent/10 text-accent'
                    : 'text-noir-300 hover:text-noir-50 hover:bg-noir-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-noir-100/10">
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <p className="text-noir-50">{user?.email}</p>
                <p className="text-noir-400 text-[10px]">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-noir-400 hover:text-noir-50 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
