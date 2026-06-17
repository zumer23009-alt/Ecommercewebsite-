import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { store } from './store';

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const data = store.load();

  if (!store.isAdminLoggedIn()) {
    navigate('/admin');
    return null;
  }

  const menu = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Produits', href: '/admin/products', icon: '👟' },
    { name: 'Catégories', href: '/admin/categories', icon: '📁' },
    { name: 'Commandes', href: '/admin/orders', icon: '📦' },
    { name: 'Clients', href: '/admin/customers', icon: '👥' },
    { name: 'Coupons', href: '/admin/coupons', icon: '🎟️' },
    { name: 'Bannières', href: '/admin/banners', icon: '🖼️' },
    { name: 'Avis', href: '/admin/reviews', icon: '⭐' },
    { name: 'Newsletter', href: '/admin/newsletter', icon: '📧' },
    { name: 'Médiathèque', href: '/admin/media', icon: '🗂️' },
    { name: 'Paramètres', href: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    store.logoutAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-neutral-950 text-white transition-transform z-40 overflow-y-auto`}>
        <div className="p-6 border-b border-neutral-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-serif font-bold">Z</div>
            <div>
              <div className="font-serif font-bold text-sm">ZENO ADMIN</div>
              <div className="text-[10px] text-neutral-400">Panel de gestion</div>
            </div>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {menu.map((m) => {
            const active = location.pathname === m.href || location.pathname.startsWith(m.href + '/');
            return (
              <Link
                key={m.href}
                to={m.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${active ? 'bg-amber-500 text-black font-semibold' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-4 border-t border-neutral-800">
          <button onClick={handleLogout} className="w-full text-left text-sm text-neutral-400 hover:text-white px-3 py-2.5">
            🚪 Déconnexion
          </button>
          <Link to="/" target="_blank" className="block w-full text-left text-sm text-neutral-400 hover:text-white px-3 py-2.5">
            🌐 Voir le site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-neutral-700">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              </button>
              <div>
                <h1 className="font-serif text-xl md:text-2xl font-bold text-neutral-900">{title}</h1>
                <div className="text-xs text-neutral-500 hidden sm:block">{data.settings.storeName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-neutral-500">👤 Admin</span>
              <button onClick={handleLogout} className="text-xs bg-neutral-900 text-white px-3 py-1.5 hover:bg-amber-500 hover:text-black transition">
                Sortir
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
