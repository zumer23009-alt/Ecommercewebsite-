import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { store, Product, uid } from '../../data/store';

export function AdminProductsList() {
  const data = store.load();
  const [products, setProducts] = useState<Product[]>(data.products);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce produit?')) return;
    const d = store.load();
    d.products = d.products.filter((p) => p.id !== id);
    store.save(d);
    setProducts(d.products);
  };

  return (
    <AdminLayout title="Gestion des produits">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="border border-neutral-300 bg-white px-4 py-2 text-sm w-full md:w-80 focus:outline-none focus:border-black"
          />
          <Link to="/admin/products/new" className="bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">
            + Nouveau produit
          </Link>
        </div>

        <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              <tr>
                <th className="p-3">Produit</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3">Prix</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-neutral-500">SKU: {p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">
                    <div className="font-semibold">{(p.salePrice ?? p.price)} TND</div>
                    {p.salePrice && <div className="text-xs text-neutral-400 line-through">{p.price}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/edit/${p.id}`} className="text-xs text-blue-600 hover:underline">Éditer</Link>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Aucun produit</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = store.load();
  const editing = id ? data.products.find((p) => p.id === id) : null;

  const defaultColors = [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Beige', hex: '#d4b896' }];

  const [form, setForm] = useState<Product>(
    editing || {
      id: uid('p'),
      name: '',
      description: '',
      price: 0,
      salePrice: undefined,
      sku: '',
      stock: 10,
      category: 'SAMBA',
      subcategory: '',
      sizes: ['36', '37', '38', '39', '40', '41'],
      colors: defaultColors,
      images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'],
      featured: false,
      bestSeller: false,
      createdAt: Date.now(),
    }
  );
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newImage, setNewImage] = useState('');
  const [sizesInput, setSizesInput] = useState(form.sizes.join(', '));
  const [msg, setMsg] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm((f) => ({ ...f, images: [...f.images, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageUrl = () => {
    if (!newImage.startsWith('http')) return;
    setForm((f) => ({ ...f, images: [...f.images, newImage] }));
    setNewImage('');
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addColor = () => {
    if (!newColor.name) return;
    setForm((f) => ({ ...f, colors: [...f.colors, newColor] }));
    setNewColor({ name: '', hex: '#000000' });
  };

  const removeColor = (idx: number) => {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const product: Product = { ...form, sizes };
    if (!product.name || !product.price || product.images.length === 0) {
      setMsg('Veuillez remplir les champs obligatoires (nom, prix, au moins une image)');
      return;
    }
    const d = store.load();
    if (editing) {
      d.products = d.products.map((p) => (p.id === product.id ? product : p));
    } else {
      d.products.unshift(product);
    }
    store.save(d);
    setMsg('✓ Produit sauvegardé avec succès!');
    setTimeout(() => navigate('/admin/products'), 1000);
  };

  return (
    <AdminLayout title={editing ? 'Éditer produit' : 'Nouveau produit'}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        <div className="bg-white rounded border border-neutral-200 p-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold block mb-1.5">Nom du produit *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Prix (TND) *</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Prix promo</label>
            <input type="number" step="0.01" value={form.salePrice ?? ''} onChange={(e) => setForm({ ...form, salePrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Catégorie</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Sous-catégorie</label>
            <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5">Tailles (séparées par virgule)</label>
            <input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> En vedette
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} /> Best seller
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded border border-neutral-200 p-6">
          <h3 className="font-semibold text-sm mb-3">Couleurs</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 border border-neutral-200 px-3 py-1.5 rounded text-xs">
                <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                {c.name}
                <button type="button" onClick={() => removeColor(i)} className="text-red-500 hover:text-red-700">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="Nom" value={newColor.name} onChange={(e) => setNewColor({ ...newColor, name: e.target.value })} className="border border-neutral-300 px-3 py-2 text-sm" />
            <input type="color" value={newColor.hex} onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })} className="w-12 h-10 border border-neutral-300" />
            <button type="button" onClick={addColor} className="bg-neutral-900 text-white px-4 text-xs">Ajouter</button>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded border border-neutral-200 p-6">
          <h3 className="font-semibold text-sm mb-3">Images ({form.images.length})</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-square border border-neutral-200">
                <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input placeholder="URL de l'image" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="flex-1 border border-neutral-300 px-3 py-2 text-sm" />
              <button type="button" onClick={addImageUrl} className="bg-neutral-900 text-white px-4 text-xs">Ajouter URL</button>
            </div>
            <div>
              <label className="text-xs text-neutral-500">Ou télécharger des images:</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="block text-xs mt-1" />
            </div>
          </div>
        </div>

        {msg && <div className={`text-sm ${msg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>}

        <div className="flex gap-3">
          <button type="submit" className="bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">
            {editing ? 'Mettre à jour' : 'Créer le produit'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-neutral-300 px-8 py-3 text-sm font-semibold hover:border-black transition">
            Annuler
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
