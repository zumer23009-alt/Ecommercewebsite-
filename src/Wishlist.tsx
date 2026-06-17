import { Link, useNavigate } from 'react-router-dom';
import { store, Product } from '../data/store';
import { useStore } from './StoreContext';
import { store, Product } from './store';

export default function Wishlist() {
  const { wishlist } = useStore();
  const data = store.load();
  const navigate = useNavigate();
  const products = data.products.filter((p: Product) => wishlist.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">♡</div>
        <h1 className="font-serif text-3xl font-bold mb-3">Votre liste est vide</h1>
        <p className="text-neutral-500 mb-8">Ajoutez vos produits préférés à votre liste de souhaits.</p>
        <button onClick={() => navigate('/products')} className="bg-black text-white px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition">
          DÉCOUVRIR LA BOUTIQUE
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Liste de souhaits</h1>
      <p className="text-sm text-neutral-500 mb-8">{products.length} produit(s)</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/products" className="text-sm font-semibold border-b-2 border-black pb-1 hover:text-amber-700 hover:border-amber-700">
          ← CONTINUER LES ACHATS
        </Link>
      </div>
    </div>
  );
}
