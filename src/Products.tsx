import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store, Product } from '../data/store';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [params] = useSearchParams();
  const cat = params.get('cat') || '';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(cat);
  const [sort, setSort] = useState('new');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  useEffect(() => {
    setCategory(cat);
  }, [cat]);

  const data = store.load();

  const products = useMemo(() => {
    let list: Product[] = [...data.products];
    if (category) list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (sort === 'price-asc') list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    else if (sort === 'price-desc') list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    else if (sort === 'new') list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [data.products, category, search, sort, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">BOUTIQUE</div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold">
          {category || 'Tous les Produits'}
        </h1>
        <p className="text-sm text-neutral-500 mt-2">{products.length} produit(s) trouvé(s)</p>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="border border-neutral-200 p-4">
            <h3 className="font-serif font-bold text-sm tracking-wider mb-3">CATÉGORIES</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCategory('')}
                  className={`w-full text-left ${!category ? 'text-amber-700 font-semibold' : 'text-neutral-700'}`}
                >
                  Tous ({data.products.length})
                </button>
              </li>
              {data.categories.map((c) => {
                const count = data.products.filter((p) => p.category === c.name).length;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setCategory(c.name)}
                      className={`w-full text-left ${category === c.name ? 'text-amber-700 font-semibold' : 'text-neutral-700 hover:text-black'}`}
                    >
                      {c.name} ({count})
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border border-neutral-200 p-4">
            <h3 className="font-serif font-bold text-sm tracking-wider mb-3">TRIER PAR</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            >
              <option value="new">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <div className="border border-neutral-200 p-4">
            <h3 className="font-serif font-bold text-sm tracking-wider mb-3">PRIX (TND)</h3>
            <div className="text-xs text-neutral-600 mb-2">
              {priceRange[0]} TND - {priceRange[1]} TND
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-amber-600"
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div>
          {products.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <p className="text-lg mb-2">Aucun produit trouvé</p>
              <p className="text-sm">Essayez d'autres critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
