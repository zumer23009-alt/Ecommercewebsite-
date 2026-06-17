import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store } from './store';

export default function Checkout() {
  const { cart, cartTotal, placeOrder, currency, whatsapp, appliedCoupon } = store;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Tunis',
    address: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  const discount = appliedCoupon?.discount || 0;
  const shipping = cartTotal > 0 ? (cartTotal >= 100 ? 0 : 7) : 0;
  const total = Math.max(0, cartTotal - discount + shipping);

  const cities = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Nabeul', 'Bizerte', 'Gabès', 'Kairouan', 'Gafsa', 'Tozeur', 'Autre'];

  if (cart.length === 0 && !submitted) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const items = cart.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.salePrice ?? i.product.price,
      qty: i.qty,
      size: i.size,
      color: i.color,
      image: i.product.images[0],
    }));
    const orderId = placeOrder({
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      address: form.address,
      items,
      notes: form.notes,
    });
    setSubmitted(orderId);
  };

  const handleWhatsApp = () => {
    const items = cart.map((i) => `- ${i.product.name} (${i.size}/${i.color}) x${i.qty}`).join('%0A');
    const message = encodeURIComponent(
      `Nouvelle commande!%0A%0ANom: ${form.name}%0ATéléphone: ${form.phone}%0AVille: ${form.city}%0AAdresse: ${form.address}%0A%0AArticles:%0A${items}%0A%0ATotal: ${total.toFixed(2)} ${currency}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">Merci pour votre commande!</h1>
        <p className="text-neutral-600 mb-2">Numéro de commande: <strong>{submitted}</strong></p>
        <p className="text-neutral-600 mb-8">Nous vous contacterons bientôt pour confirmer votre commande. Total: <strong>{total.toFixed(2)} {currency}</strong></p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleWhatsApp} className="bg-green-600 text-white px-6 py-3 text-sm font-semibold hover:bg-green-700 transition">
            💬 CONFIRMER SUR WHATSAPP
          </button>
          <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-amber-500 hover:text-black transition">
            RETOUR ACCUEIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Paiement</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Informations client</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Nom complet *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Téléphone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+216 ..." className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Ville *</label>
                <select name="city" value={form.city} onChange={handleChange} className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white">
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Adresse de livraison *</label>
              <textarea name="address" value={form.address} onChange={handleChange} required rows={2} className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Notes (optionnel)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Instructions pour le livreur..." className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Mode de paiement</h2>
            <div className="border-2 border-black p-4 flex items-center gap-3 bg-neutral-50">
              <div className="text-2xl">💰</div>
              <div>
                <div className="font-semibold text-sm">Paiement à la livraison (Cash)</div>
                <div className="text-xs text-neutral-500">Payez à réception de votre commande</div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-4 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition">
            CONFIRMER MA COMMANDE • {total.toFixed(2)} {currency}
          </button>
          <Link to="/cart" className="block text-center text-sm text-neutral-500 underline">← Retour au panier</Link>
        </form>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-neutral-50 border border-neutral-200 p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Votre commande</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
              {cart.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-white border border-neutral-200">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-xs">{item.product.name}</div>
                      <div className="text-[10px] text-neutral-500">{item.size} • {item.color}</div>
                      <div className="text-xs font-semibold mt-1">{(price * item.qty).toFixed(2)} {currency}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
              <div className="flex justify-between"><span>Sous-total</span><span>{cartTotal.toFixed(2)} {currency}</span></div>
              {appliedCoupon && <div className="flex justify-between text-green-700"><span>Coupon</span><span>-{discount.toFixed(2)} {currency}</span></div>}
              <div className="flex justify-between"><span>Livraison</span><span>{shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)} ${currency}`}</span></div>
              <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-3 mt-3">
                <span>Total</span><span>{total.toFixed(2)} {currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
