import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist, storeName } = useStore();
  const navigate = useNavigate();

  const links = [
    { name: 'Accueil', href: '/' },
    { name: 'Boutique', href: '/products' },
    { name: 'SAMBA', href: '/products?cat=SAMBA' },
    { name: 'Espadrilles', href: '/products?cat=Espadrilles' },
    { name: 'Sabot', href: '/products?cat=Sabot' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      {/* Top bar */}
      <div className="bg-black text-white text-xs py-1.5 text-center tracking-wide">
        ✨ Livraison 24h en Tunisie • Paiement à la livraison disponible ✨
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => setOpen(!open)} className="md:hidden text-neutral-800" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm font-bold">
            Z
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-bold tracking-wider">{storeName.toUpperCase()}</div>
            <div className="text-[10px] text-neutral-500 tracking-widest hidden sm:block">CHAUSSURES FEMMES • TUNISIE</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="text-neutral-700 hover:text-black transition">
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/account" className="hidden sm:block text-neutral-700 hover:text-black" aria-label="Compte">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <Link to="/wishlist" className="relative text-neutral-700 hover:text-black" aria-label="Liste de souhaits">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button onClick={() => navigate('/cart')} className="relative text-neutral-700 hover:text-black" aria-label="Panier">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-sm border-b border-neutral-100 text-neutral-700"
              >
                {l.name}
              </Link>
            ))}
            <Link to="/account" onClick={() => setOpen(false)} className="px-6 py-3 text-sm border-b border-neutral-100 text-neutral-700">
              Mon Compte
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
