import { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from './store';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const data = store.load();
  const s = data.settings;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const d = store.load();
    d.newsletter.push({ id: 'n' + Date.now(), email, createdAt: Date.now() });
    store.save(d);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-20">
      {/* Newsletter */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">Rejoignez la communauté ZENO</h3>
            <p className="text-sm text-neutral-400">Inscrivez-vous à notre newsletter et recevez -10% sur votre première commande.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
              required
            />
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 text-sm transition">
              S'INSCRIRE
            </button>
          </form>
          {subscribed && <p className="md:col-span-2 text-green-400 text-sm">✓ Merci pour votre inscription!</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-serif font-bold">Z</div>
            <div className="font-serif text-lg text-white font-bold">ZENO</div>
          </div>
          <p className="text-xs leading-relaxed text-neutral-400">
            {s.tagline}. Qualité premium, livraison rapide à travers toute la Tunisie.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider">BOUTIQUE</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products" className="hover:text-amber-400">Tous les produits</Link></li>
            <li><Link to="/products?cat=SAMBA" className="hover:text-amber-400">SAMBA</Link></li>
            <li><Link to="/products?cat=Espadrilles" className="hover:text-amber-400">Espadrilles</Link></li>
            <li><Link to="/products?cat=Sabot" className="hover:text-amber-400">Sabot</Link></li>
            <li><Link to="/cart" className="hover:text-amber-400">Panier</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider">INFOS</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/account" className="hover:text-amber-400">Mon compte</Link></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Livraison</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Retours</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">FAQ</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">À propos</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider">CONTACT</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2"><span>📍</span><span>{s.address}</span></li>
            <li className="flex items-start gap-2"><span>📞</span><span>{s.phone}</span></li>
            <li className="flex items-start gap-2"><span>✉️</span><span>{s.email}</span></li>
            <li className="flex items-start gap-2"><span>📷</span><span>Instagram {s.instagram}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ZENO Collection. Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-300">💵 Cash à la livraison</span>
            <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-300">🚚 Livraison 24h</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
