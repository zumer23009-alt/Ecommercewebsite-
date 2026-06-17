import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from './StoreContext';

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, currency, applyCoupon, appliedCoupon, whatsapp } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const err = applyCoupon(couponCode);
    setCouponMsg(err || `✓ Coupon "${couponCode.toUpperCase()}" appliqué!`);
    setCouponCode('');
  };

  const discount = appliedCoupon?.discount || 0;
  const shipping = cartTotal > 0 ? (cartTotal >= 100 ? 0 : 7) : 0;
  const total = Math.max(0, cartTotal - discount + shipping);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-serif text-3xl font-bold mb-3">Votre panier est vide</h1>
        <p className="text-neutral-500 mb-8">Découvrez notre collection et trouvez votre prochaine paire favorite.</p>
        <button onClick={() => navigate('/products')} className="bg-black text-white px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition">
          CONTINUER LES ACHATS
        </button>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const items = cart.map((i) => `- ${i.product.name} (Taille: ${i.size}, Couleur: ${i.color}) x${i.qty} = ${((i.product.salePrice || i.product.price) * i.qty).toFixed(2)} ${currency}`).join('%0A');
    const message = encodeURIComponent(`Bonjour! Je voudrais commander:%0A%0A${items}%0A%0ATotal: ${total.toFixed(2)} ${currency}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Panier ({cart.length})</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div>
          {cart.map((item) => {
            const price = item.product.salePrice ?? item.product.price;
            return (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-5 border-b border-neutral-200">
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 bg-neutral-100 flex-shrink-0 overflow-hidden">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-serif font-semibold hover:text-amber-700 transition">{item.product.name}</h3>
                  </Link>
                  <div className="text-xs text-neutral-500 mt-1">Taille: {item.size} • Couleur: {item.color}</div>
                  <div className="text-sm font-semibold mt-1">{price} {currency}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex border border-neutral-300">
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.qty - 1)} className="w-8 h-8 hover:bg-neutral-100">−</button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.qty + 1)} className="w-8 h-8 hover:bg-neutral-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.size, item.color)} className="text-xs text-neutral-500 hover:text-red-600 underline">
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold">{(price * item.qty).toFixed(2)} {currency}</div>
              </div>
            );
          })}
          <Link to="/products" className="inline-block mt-6 text-sm font-semibold border-b-2 border-black pb-1 hover:text-amber-700 hover:border-amber-700">
            ← CONTINUER LES ACHATS
          </Link>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-neutral-50 p-6 border border-neutral-200">
            <h2 className="font-serif text-xl font-bold mb-4">Récapitulatif</h2>

            <form onSubmit={handleCoupon} className="mb-4 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Code promo"
                className="flex-1 border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-amber-500 hover:text-black transition">
                OK
              </button>
            </form>
            {couponMsg && <p className={`text-xs mb-3 ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>{couponMsg}</p>}

            <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
              <div className="flex justify-between"><span>Sous-total</span><span>{cartTotal.toFixed(2)} {currency}</span></div>
              {appliedCoupon && <div className="flex justify-between text-green-700"><span>Coupon ({appliedCoupon.code})</span><span>-{discount.toFixed(2)} {currency}</span></div>}
              <div className="flex justify-between"><span>Livraison</span><span>{shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)} ${currency}`}</span></div>
              <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-3 mt-3">
                <span>Total</span><span>{total.toFixed(2)} {currency}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="w-full mt-5 bg-black text-white py-3.5 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition">
              PASSER À LA CAISSE
            </button>
            <button onClick={handleWhatsAppOrder} className="w-full mt-2 bg-green-600 text-white py-3.5 text-sm font-semibold tracking-wider hover:bg-green-700 transition">
              💬 COMMANDER SUR WHATSAPP
            </button>
            <div className="text-xs text-neutral-500 mt-4 text-center">
              🔒 Paiement sécurisé • Cash à la livraison
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
