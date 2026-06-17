import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store, Product } from './store';
import { useStore } from './StoreContext';
import ProductCard from './ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = store.load();
  const product = data.products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, wishlist, currency, whatsapp } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [qty, setQty] = useState(1);
  const [showZoom, setShowZoom] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Produit introuvable</h1>
        <button onClick={() => navigate('/products')} className="bg-black text-white px-6 py-3 text-sm font-semibold">
          RETOUR À LA BOUTIQUE
        </button>
      </div>
    );
  }

  const price = product.salePrice ?? product.price;
  const inWishlist = wishlist.includes(product.id);
  const related = data.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const reviews = data.reviews.filter((r) => r.productId === product.id && r.approved);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
    navigate('/checkout');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour! Je suis intéressé par:\n\nProduit: ${product.name}\nPrix: ${price} ${currency}\nTaille: ${selectedSize || 'à préciser'}\nCouleur: ${selectedColor}\n\nhttps://zenocollection.tn/product/${product.id}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black">Accueil</Link> / <Link to="/products" className="hover:text-black">Boutique</Link> /{' '}
          <Link to={`/products?cat=${encodeURIComponent(product.category)}`} className="hover:text-black">{product.category}</Link> /{' '}
          <span className="text-neutral-900">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-neutral-50 overflow-hidden cursor-zoom-in" onClick={() => setShowZoom(true)}>
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.salePrice && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 font-semibold">
                  -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </span>
              )}
              <span className="absolute top-4 right-4 bg-white text-xs px-3 py-1.5 border border-neutral-200">
                {product.stock > 0 ? `✓ En stock (${product.stock})` : '✗ Rupture'}
              </span>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 border-2 overflow-hidden ${selectedImage === i ? 'border-black' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">{product.category}</div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <span className="text-xs text-neutral-500">({reviews.length} avis)</span>
              <span className="text-xs text-neutral-400">| SKU: {product.sku}</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-neutral-900">{price} {currency}</span>
              {product.salePrice && <span className="text-lg text-neutral-400 line-through">{product.price} {currency}</span>}
            </div>

            <p className="text-neutral-600 leading-relaxed mb-6">{product.description}</p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="border border-neutral-200 p-3 text-xs"><span className="text-amber-600">🚚</span> Livraison 24h Tunisie</div>
              <div className="border border-neutral-200 p-3 text-xs"><span className="text-amber-600">💰</span> Paiement à la livraison</div>
              <div className="border border-neutral-200 p-3 text-xs"><span className="text-amber-600">✨</span> Qualité Premium Garantie</div>
              <div className="border border-neutral-200 p-3 text-xs"><span className="text-amber-600">↩️</span> Retour Facile 7 jours</div>
            </div>

            {/* Color */}
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">Couleur: <span className="font-normal text-neutral-600">{selectedColor}</span></div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === c.name ? 'border-black ring-2 ring-offset-2 ring-black' : 'border-neutral-300'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Taille</div>
                <button className="text-xs text-neutral-500 underline">Guide des tailles</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 text-sm border transition ${
                      selectedSize === s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <div className="text-sm font-semibold mb-2">Quantité</div>
              <div className="inline-flex border border-neutral-300">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hover:bg-neutral-100">−</button>
                <div className="w-12 h-10 flex items-center justify-center text-sm">{qty}</div>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 hover:bg-neutral-100">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-neutral-100 border-2 border-black text-black font-semibold text-sm tracking-wider hover:bg-black hover:text-white transition"
              >
                AJOUTER AU PANIER • {(price * qty).toFixed(2)} {currency}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-amber-500 text-black font-semibold text-sm tracking-wider hover:bg-amber-600 transition"
              >
                COMMANDER MAINTENANT
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 bg-green-600 text-white font-semibold text-sm tracking-wider hover:bg-green-700 transition"
              >
                💬 COMMANDER SUR WHATSAPP
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-3.5 border border-neutral-300 text-neutral-700 font-semibold text-sm tracking-wider hover:border-black transition"
              >
                {inWishlist ? '♥ DANS LA LISTE DE SOUHAITS' : '♡ AJOUTER AUX FAVORIS'}
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-neutral-50 p-4 text-xs text-neutral-600 space-y-1.5">
              <p>📍 <strong>Livraison:</strong> 24h à 48h dans tout la Tunisie</p>
              <p>💰 <strong>Paiement:</strong> Cash à la livraison disponible</p>
              <p>📞 <strong>Contact:</strong> {data.settings.phone}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-10">
            <h2 className="font-serif text-2xl font-bold mb-6">Avis clients ({reviews.length})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-neutral-200 p-5">
                  <div className="text-amber-500 mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <p className="text-sm text-neutral-700 italic mb-3">"{r.comment}"</p>
                  <div className="text-xs font-semibold text-neutral-500">— {r.author}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-10">
            <h2 className="font-serif text-2xl font-bold mb-6">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {showZoom && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowZoom(false)}>
          <img src={product.images[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
          <button className="absolute top-5 right-5 text-white text-3xl" aria-label="Fermer">×</button>
        </div>
      )}
    </div>
  );
}
