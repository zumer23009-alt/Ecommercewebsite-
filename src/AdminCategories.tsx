import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { store, Category, uid } from './store';

export default function AdminCategories() {
  const data = store.load();
  const [categories, setCategories] = useState<Category[]>(data.categories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Category>({ id: '', name: '', slug: '', image: '', description: '' });

  const startNew = () => {
    setEditing(null);
    setForm({ id: uid('c'), name: '', slug: '', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80', description: '' });
  };

  const startEdit = (c: Category) => {
    setEditing(c);
    setForm(c);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const d = store.load();
    if (editing) {
      d.categories = d.categories.map((c) => (c.id === form.id ? form : c));
    } else {
      d.categories.push(form);
    }
    store.save(d);
    setCategories(d.categories);
    setEditing(null);
    setForm({ id: '', name: '', slug: '', image: '', description: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer cette catégorie?')) return;
    const d = store.load();
    d.categories = d.categories.filter((c) => c.id !== id);
    store.save(d);
    setCategories(d.categories);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, image: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout title="Gestion des catégories">
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-semibold">Catégories ({categories.length})</h2>
            <button onClick={startNew} className="bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-amber-500 hover:text-black transition">
              + Nouvelle
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
              <tr><th className="p-3">Nom</th><th className="p-3">Slug</th><th className="p-3">Image</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-xs text-neutral-500">{c.slug}</td>
                  <td className="p-3"><img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded" /></td>
                  <td className="p-3">
                    <button onClick={() => startEdit(c)} className="text-xs text-blue-600 hover:underline mr-3">Éditer</button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded border border-neutral-200 p-6 space-y-3 h-fit">
          <h2 className="font-semibold text-sm">{editing ? 'Éditer' : 'Nouvelle catégorie'}</h2>
          <div>
            <label className="text-xs font-semibold block mb-1">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full border border-neutral-300 px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">URL image</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block text-xs mt-2" />
            {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded mt-2" />}
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">
            {editing ? 'Mettre à jour' : 'Créer'}
          </button>
          {editing && <button type="button" onClick={startNew} className="w-full text-xs text-neutral-500 underline">Nouvelle catégorie</button>}
        </form>
      </div>
    </AdminLayout>
  );
}
