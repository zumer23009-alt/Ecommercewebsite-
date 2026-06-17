import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../data/store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (store.loginAdmin(email.trim(), password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-4">Z</div>
          <h1 className="font-serif text-2xl font-bold">Administration</h1>
          <p className="text-xs text-neutral-400 mt-1 tracking-widest">ZENO COLLECTION • PANEL</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              placeholder="admin@zeno.tn"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-amber-500 text-black py-3 text-sm font-bold tracking-wider hover:bg-amber-400 transition">
            SE CONNECTER
          </button>
          <div className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-800">
            Défaut: admin@zeno.tn / admin123
          </div>
        </form>

        <button onClick={() => navigate('/')} className="block w-full text-center text-xs text-neutral-500 mt-6 hover:text-white">
          ← Retour au site
        </button>
      </div>
    </div>
  );
}
