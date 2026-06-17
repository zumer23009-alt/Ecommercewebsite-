import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (form.password !== form.confirm) {
        setMsg('Les mots de passe ne correspondent pas');
        return;
      }
      setMsg('✓ Compte créé avec succès! Vous pouvez maintenant vous connecter.');
      setMode('login');
    } else if (mode === 'forgot') {
      setMsg('✓ Un email de réinitialisation a été envoyé.');
    } else {
      setMsg('✓ Connexion réussie!');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-4">Z</div>
        <h1 className="font-serif text-3xl font-bold">
          {mode === 'login' ? 'Connexion' : mode === 'register' ? 'Créer un compte' : 'Mot de passe oublié'}
        </h1>
        <p className="text-sm text-neutral-500 mt-2">ZENO Collection • Espace client</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border border-neutral-200 p-6">
        {mode === 'register' && (
          <div>
            <label className="text-xs font-semibold block mb-1.5">Nom complet</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold block mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
        </div>
        {mode !== 'forgot' && (
          <>
            <div>
              <label className="text-xs font-semibold block mb-1.5">Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
            </div>
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold block mb-1.5">Confirmer le mot de passe</label>
                <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
            )}
          </>
        )}

        <button type="submit" className="w-full bg-black text-white py-3 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition">
          {mode === 'login' ? 'SE CONNECTER' : mode === 'register' ? 'CRÉER UN COMPTE' : 'RÉINITIALISER'}
        </button>

        {msg && <p className={`text-xs ${msg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      </form>

      <div className="text-center mt-6 text-sm space-y-2">
        {mode === 'login' && (
          <>
            <p>Pas encore de compte? <button onClick={() => setMode('register')} className="font-semibold underline">S'inscrire</button></p>
            <p><button onClick={() => setMode('forgot')} className="text-neutral-500 underline">Mot de passe oublié?</button></p>
          </>
        )}
        {mode === 'register' && <p>Déjà inscrit? <button onClick={() => setMode('login')} className="font-semibold underline">Se connecter</button></p>}
        {mode === 'forgot' && <p><button onClick={() => setMode('login')} className="font-semibold underline">Retour à la connexion</button></p>}
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-6 text-center">
        <Link to="/" className="text-xs text-neutral-500 hover:text-black">← Retour à l'accueil</Link>
      </div>
    </div>
  );
}
