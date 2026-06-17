import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, Order, store } from './store';

type CartItem = {
  product: Product;
  qty: number;
  size: string;
  color: string;
};

type Ctx = {
  cart: CartItem[];
  addToCart: (p: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQty: (id: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'total'>) => string;
  currency: string;
  whatsapp: string;
  storeName: string;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => string;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('zeno_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('zeno_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const data = store.load();
  const currency = data.settings.currency;
  const whatsapp = data.settings.whatsapp;
  const storeName = data.settings.storeName;

  useEffect(() => {
    localStorage.setItem('zeno_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('zeno_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart: Ctx['addToCart'] = (p, size, color, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === p.id && i.size === size && i.color === color);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { product: p, qty, size, color }];
    });
  };

  const removeFromCart: Ctx['removeFromCart'] = (id, size, color) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === id && i.size === size && i.color === color)));
  };

  const updateQty: Ctx['updateQty'] = (id, size, color, qty) => {
    if (qty < 1) return removeFromCart(id, size, color);
    setCart((prev) => prev.map((i) => (i.product.id === id && i.size === size && i.color === color ? { ...i, qty } : i)));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => {
    const price = i.product.salePrice ?? i.product.price;
    return sum + price * i.qty;
  }, 0);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const placeOrder: Ctx['placeOrder'] = (order) => {
    const d = store.load();
    const total = cart.reduce((sum, i) => {
      const price = i.product.salePrice ?? i.product.price;
      return sum + price * i.qty;
    }, 0);
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + (1000 + d.orders.length + 1),
      status: 'Pending',
      createdAt: Date.now(),
      total: Math.round(total * 100) / 100,
    };
    d.orders.unshift(newOrder);
    store.save(d);
    clearCart();
    return newOrder.id;
  };

  const applyCoupon: Ctx['applyCoupon'] = (code) => {
    const d = store.load();
    const coupon = d.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return 'Coupon invalide';
    if (new Date(coupon.expiry) < new Date()) return 'Coupon expiré';
    if (coupon.used >= coupon.usageLimit) return 'Coupon épuisé';
    const discount = coupon.type === 'percentage' ? Math.round((cartTotal * coupon.value) / 100) : coupon.value;
    setAppliedCoupon({ code: coupon.code, discount });
    return '';
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        placeOrder,
        currency,
        whatsapp,
        storeName,
        appliedCoupon,
        applyCoupon,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
