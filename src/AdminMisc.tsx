import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { store, Customer, Coupon, Banner, Review, uid, Settings } from '../../data/store';

// ============ CUSTOMERS ============
export function AdminCustomers() {
  const data = store.load();
  const [customers] = useState<Customer[]>(data.customers);

  return (
    <AdminLayout title="Gestion des clients">
      <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
            <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Téléphone</th><th className="p-3">Commandes</th><th className="p-3">Inscrit le</th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-xs">{c.email}</td>
                <td className="p-3 text-xs">{c.phone}</td>
                <td className="p-3">{c.orders}</td>
                <td className="p-3 text-xs text-neutral-500">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Aucun client</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

// ============ COUPONS ============
export function AdminCoupons() {
  const data = store.load();
  const [coupons, setCoupons] = useState<Coupon[]>(data.coupons);
  const [form, setForm] = useState<Coupon>({
    id: uid('cp'), code: '', type: 'percentage', value: 10, expiry: '2026-12-31', usageLimit: 100, used: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    const d = store.load();
    d.coupons.push({ ...form, id: uid('cp'), code: form.code.toUpperCase() });
    store.save(d);
    setCoupons(d.coupons);
    setForm({ id: uid('cp'), code: '', type: 'percentage', value: 10, expiry: '2026-12-31', usageLimit: 100, used: 0 });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer?')) return;
    const d = store.load();
    d.coupons = d.coupons.filter((c) => c.id !== id);
    store.save(d);
    setCoupons(d.coupons);
  };

  return (
    <AdminLayout title="Gestion des coupons">
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
              <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Valeur</th><th className="p-3">Expire</th><th className="p-3">Utilisation</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono font-bold">{c.code}</td>
                  <td className="p-3 text-xs">{c.type}</td>
                  <td className="p-3 font-semibold">{c.type === 'percentage' ? `${c.value}%` : `${c.value} TND`}</td>
                  <td className="p-3 text-xs">{c.expiry}</td>
                  <td className="p-3 text-xs">{c.used}/{c.usageLimit}</td>
                  <td className="p-3"><button onClick={() => handleDelete(c.id)} className="text-xs text-red-600 hover:underline">Supprimer</button></td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-neutral-500">Aucun coupon</td></tr>}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded border border-neutral-200 p-6 space-y-3 h-fit">
          <h2 className="font-semibold text-sm">Nouveau coupon</h2>
          <div>
            <label className="text-xs font-semibold block mb-1">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ETE2026" className="w-full border border-neutral-300 px-3 py-2 text-sm font-mono" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white">
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe (TND)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Valeur</label>
            <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Date d'expiration</label>
            <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Limite d'utilisation</label>
            <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">Créer le coupon</button>
        </form>
      </div>
    </AdminLayout>
  );
}

// ============ BANNERS ============
export function AdminBanners() {
  const data = store.load();
  const [banners, setBanners] = useState<Banner[]>(data.banners);
  const [form, setForm] = useState<Banner>({
    id: uid('b'), title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1600&q=80', link: '/products', active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    const d = store.load();
    d.banners.push({ ...form, id: uid('b') });
    store.save(d);
    setBanners(d.banners);
  };

  const toggleActive = (id: string) => {
    const d = store.load();
    d.banners = d.banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    store.save(d);
    setBanners(d.banners);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer?')) return;
    const d = store.load();
    d.banners = d.banners.filter((b) => b.id !== id);
    store.save(d);
    setBanners(d.banners);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, image: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout title="Gestion des bannières">
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded border border-neutral-200 p-3 flex items-center gap-4">
              <img src={b.image} alt={b.title} className="w-32 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{b.title}</div>
                <div className="text-xs text-neutral-500">{b.subtitle}</div>
                <div className="text-xs text-neutral-400 mt-1">→ {b.link}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => toggleActive(b.id)} className={`text-xs px-3 py-1 rounded ${b.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                  {b.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded border border-neutral-200 p-6 space-y-3 h-fit">
          <h2 className="font-semibold text-sm">Nouvelle bannière</h2>
          <div>
            <label className="text-xs font-semibold block mb-1">Titre</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Sous-titre</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">URL image</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block text-xs mt-2" />
            {form.image && <img src={form.image} alt="preview" className="w-full h-24 object-cover rounded mt-2" />}
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Lien</label>
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
          </label>
          <button type="submit" className="w-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">Créer</button>
        </form>
      </div>
    </AdminLayout>
  );
}

// ============ REVIEWS ============
export function AdminReviews() {
  const data = store.load();
  const [reviews, setReviews] = useState<Review[]>(data.reviews);

  const toggleApprove = (id: string) => {
    const d = store.load();
    d.reviews = d.reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r));
    store.save(d);
    setReviews(d.reviews);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer?')) return;
    const d = store.load();
    d.reviews = d.reviews.filter((r) => r.id !== id);
    store.save(d);
    setReviews(d.reviews);
  };

  return (
    <AdminLayout title="Gestion des avis">
      <div className="bg-white rounded border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
            <tr><th className="p-3">Auteur</th><th className="p-3">Produit</th><th className="p-3">Note</th><th className="p-3">Commentaire</th><th className="p-3">Statut</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {reviews.map((r) => {
              const product = data.products.find((p) => p.id === r.productId);
              return (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-medium">{r.author}</td>
                  <td className="p-3 text-xs">{product?.name || 'Produit supprimé'}</td>
                  <td className="p-3 text-amber-500">{'★'.repeat(r.rating)}</td>
                  <td className="p-3 text-xs max-w-xs truncate">{r.comment}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${r.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.approved ? 'Approuvé' : 'En attente'}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => toggleApprove(r.id)} className="text-xs text-blue-600 hover:underline">{r.approved ? 'Désapprouver' : 'Approuver'}</button>
                    <button onClick={() => handleDelete(r.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              );
            })}
            {reviews.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-neutral-500">Aucun avis</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

// ============ NEWSLETTER ============
export function AdminNewsletter() {
  const data = store.load();
  const [subscribers] = useState(data.newsletter);

  const exportCSV = () => {
    const csv = 'Email,Date\n' + subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString('fr-FR')}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-zeno.csv';
    a.click();
  };

  return (
    <AdminLayout title="Newsletter">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-600">{subscribers.length} abonné(s)</div>
        <button onClick={exportCSV} className="bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-amber-500 hover:text-black transition">
          📥 Exporter CSV
        </button>
      </div>
      <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
            <tr><th className="p-3">Email</th><th className="p-3">Date d'inscription</th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50">
                <td className="p-3 font-medium">{s.email}</td>
                <td className="p-3 text-xs text-neutral-500">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {subscribers.length === 0 && <tr><td colSpan={2} className="p-8 text-center text-neutral-500">Aucun abonné</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

// ============ MEDIA LIBRARY ============
export function AdminMedia() {
  const [images, setImages] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('zeno_media');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newImages = [...images, ev.target.result as string];
          setImages(newImages);
          localStorage.setItem('zeno_media', JSON.stringify(newImages));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (idx: number) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    localStorage.setItem('zeno_media', JSON.stringify(newImages));
  };

  return (
    <AdminLayout title="Médiathèque">
      <div className="bg-white rounded border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-semibold text-sm">{images.length} image(s) stockée(s)</h2>
          <label className="bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-amber-500 hover:text-black transition cursor-pointer">
            📤 Télécharger des images
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square border border-neutral-200 group">
              <img src={img} alt={`media-${i}`} className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(i)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">×</button>
            </div>
          ))}
          {images.length === 0 && <div className="col-span-full text-center py-10 text-neutral-500 text-sm">Aucune image. Téléchargez vos images ci-dessus.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}

// ============ SETTINGS ============
export function AdminSettings() {
  const data = store.load();
  const [settings, setSettings] = useState<Settings>(data.settings);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const d = store.load();
    d.settings = settings;
    store.save(d);
    setMsg('✓ Paramètres sauvegardés avec succès!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSettings({ ...settings, logo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout title="Paramètres du store">
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm rounded">{msg}</div>}

        <div className="bg-white rounded border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-sm border-b pb-2">Informations du store</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Nom du store</label>
              <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Slogan</label>
              <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Devise</label>
              <input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Logo (upload)</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs" />
              {settings.logo && <img src={settings.logo} alt="logo" className="w-16 h-16 object-contain mt-2 border rounded" />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-sm border-b pb-2">Contact</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">WhatsApp (sans +)</label>
              <input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="21692765464" className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Téléphone</label>
              <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Email</label>
              <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Adresse</label>
              <input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-neutral-200 p-6 space-y-4">
          <h2 className="font-semibold text-sm border-b pb-2">Réseaux sociaux</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Instagram</label>
              <input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Facebook</label>
              <input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">
          💾 Sauvegarder les paramètres
        </button>
      </form>
    </AdminLayout>
  );
}
