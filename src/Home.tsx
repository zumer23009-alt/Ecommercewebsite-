import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './StoreContext';
import { Product } from './store';
import ProductCard from './ProductCard';

export default function Home() {
  const { products, banners, categories, reviews, settings } = useStore();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % activeBanners.length), 5000);
    return () => clearInterval(t);
  }, [activeBanners.length]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const onSale = products.filter((p) => p.salePrice).slice(0, 4);

  const instaImages = [
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
  ];

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative bg-neutral-50 overflow-hidden">
        <div className="relative h-[70vh] min-h-[480px]">
          {activeBanners.map((b, i) => (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-xl text-white">
                    <div className="text-amber-400 text-xs tracking-[0.3em] mb-3">ZENO COLLECTION • ÉTÉ 2026</div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-4">{b.title}</h1>
                    <p className="text-lg text-neutral-200 mb-8">{b.subtitle}</p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-white text-black px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-amber-400 transition"
                      >
                        DÉCOUVRIR LA COLLECTION
                      </button>
                      <a
                        href={`https://wa.me/${settings.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-white text-white px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition"
                      >
                        COMMANDER SUR WHATSAPP
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-amber-400' : 'w-4 bg-white/50'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '🚚', title: 'Livraison 24h', sub: 'Dans toute la Tunisie' },
            { icon: '💰', title: 'Paiement à la livraison', sub: 'Cash à réception' },
            { icon: '✨', title: 'Qualité Premium', sub: 'Cuir véritable garanti' },
            { icon: '↩️', title: 'Retour Facile', sub: '7 jours satisfait ou remboursé' },
          ].map((t, i) => (
            <div key={i} className="py-2">
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-sm font-semibold text-neutral-900">{t.title}</div>
              <div className="text-xs text-neutral-500">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">NOS CATÉGORIES</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Explorez la Collection</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/products?cat=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100"
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-serif text-xl md:text-2xl font-bold">{c.name}</h3>
                <p className="text-xs text-neutral-200 mt-1">{c.description}</p>
                <div className="text-xs mt-2 tracking-wider opacity-0 group-hover:opacity-100 transition">
                  VOIR LA COLLECTION →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">LES PLUS VENDUS</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Best Sellers</h2>
            </div>
            <a href="/products" className="text-sm font-semibold tracking-wider border-b-2 border-black pb-1 hover:text-amber-700 hover:border-amber-700 transition">
              TOUT VOIR →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="relative rounded-sm overflow-hidden bg-neutral-900 text-white">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <div className="text-amber-400 text-xs tracking-[0.3em] mb-3">QUALITÉ PREMIUM</div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4">
                  Chaussures faites pour vous.
                </h2>
                <p className="text-neutral-300 mb-6 max-w-md">
                  Découvrez notre sélection de sandales, espadrilles et sabots en cuir véritable. Confectionnés avec passion en Tunisie.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="self-start bg-amber-400 text-black px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-white transition"
                >
                  ACHETER MAINTENANT
                </button>
              </div>
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=80"
                  alt="Collection"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">NOUVEAUTÉS</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Nouveaux Arrivages</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {onSale.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-neutral-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[0.3em] text-red-600 mb-2">⚡ PROMOTIONS</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Flash Sale</h2>
              <p className="text-sm text-neutral-500 mt-2">Profitez de réductions exclusives sur une sélection limitée</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {onSale.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">TENDANCE</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Produits en Vedette</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-neutral-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] text-amber-400 mb-2">AVIS CLIENT</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Ce qu'elles disent de nous</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.filter((r) => r.approved).slice(0, 3).map((r) => (
              <div key={r.id} className="bg-neutral-900 p-6 rounded-sm">
                <div className="text-amber-400 mb-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className="text-neutral-300 text-sm italic mb-4">\"'{r.comment}'\"</p>
                <div className="text-xs font-semibold tracking-wider text-neutral-400">— {r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs tracking-[0.3em] text-amber-600 mb-2">INSTAGRAM</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Suivez @zeno_col</h2>
          <p className="text-sm text-neutral-500 mb-10">Rejoignez la communauté et partagez vos looks #ZENOCollection</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {instaImages.map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/zeno_col"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group"
              >
                <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}