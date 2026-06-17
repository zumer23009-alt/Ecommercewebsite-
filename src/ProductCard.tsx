import { Link } from 'react-router-dom';
import { store, Product } from './store';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist, currency } = store;
  const inWishlist = wishlist.includes(product.id);
  const price = product.salePrice ?? product.price;

  return (
    <div className="group bg-white border border-neutral-100 hover:border-neutral-300 transition rounded-sm overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        </Link>
        {product.salePrice && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] px-2 py-1 font-semibold tracking-wider">
            -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
          </span>
        )}
        {product.bestSeller && (
          <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] px-2 py-1 font-semibold tracking-wider">
            BEST
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
          aria-label="Ajouter aux favoris"
        >
          <svg width="16" height="16" fill={inWishlist ? '#000' : 'none'} stroke="#000" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-serif text-base font-medium text-neutral-900 line-clamp-1 hover:text-amber-700 transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-neutral-900">{price} {currency}</span>
          {product.salePrice && (
            <span className="text-xs text-neutral-400 line-through">{product.price} {currency}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
          className="mt-3 w-full text-xs tracking-wider font-semibold py-2.5 bg-neutral-900 text-white hover:bg-amber-500 hover:text-black transition"
        >
          AJOUTER AU PANIER
        </button>
      </div>
    </div>
  );
}
