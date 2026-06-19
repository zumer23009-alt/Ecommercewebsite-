import React, { createContext, useContext, useState, useEffect } from 'react';
import { store, Product, StoreData, uid } from './store';
import type { Order } from './store';

type CartItem = {
  product: Product;
  size: string;
  color: string;
  qty: number;
};

type AppliedCoupon = {
  code: string;
  discount: number;
};

interface StoreContextType extends StoreData {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, size: string, color: string) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => string | null;
  placeOrder: (data: Omit<Order, 'id' | 'total' | 'status' | 'createdAt'>) => string;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  storeName: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(() => store.load());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zeno_cart');
      return saved? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zeno_wishlist');
      return saved? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    localStorage.setItem('zeno_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zeno_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
           ? {...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { product, size, color, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev =>
      prev.filter(i =>!(i.product.id === productId && i.size === size && i.color === color))
    );
  };

  const updateQty = (productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev =>
        prev.filter(i =>!(i.product.id === productId && i.size === size && i.color === color))
      );
      return;
    }
    setCart(prev =>
      prev.map(i =>
        i.product.id === productId && i.size === size && i.color === color? {...i, qty } : i
      )
    );
  };

  const cartTotal = cart.reduce(
    (sum, i) => sum + (i.product.salePrice?? i.product.price) * i.qty,
    0
  );
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const applyCoupon = (code: string): string | null => {
    const d = store.load();
    const coupon = d.coupons.find(
      c => c.code.toUpperCase() === code.toUpperCase().trim()
    );
    if (!coupon) return 'Code promo invalide';
    if (coupon.used >= coupon.usageLimit) return "Ce code a atteint sa limite d'utilisation";
    const now = new Date().toISOString().split('T')[0];
    if (coupon.expiry < now) return 'Ce code promo a expiré';
    const discount =
      coupon.type === 'percentage'? (cartTotal * coupon.value) / 100 : coupon.value;
    setAppliedCoupon({ code: coupon.code, discount });
    return null;
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'total' | 'status' | 'createdAt'>): string => {
    const d = store.load();
    const shipping = cartTotal >= 100? 0 : 7;
    const discount = appliedCoupon?.discount?? 0;
    const total = Math.max(0, cartTotal - discount + shipping);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
     ...orderData,
      id: orderId,
      total,
      status: 'Pending',
      createdAt: Date.now(),
    };
    d.orders = [newOrder,...d.orders];
    const existingCustomer = d.customers.find(
      c => c.email === orderData.email || c.phone === orderData.phone
    );
    if (existingCustomer) {
      d.customers = d.customers.map(c =>
        c.id === existingCustomer.id? {...c, orders: c.orders + 1 } : c
      );
    } else {
      d.customers = [
       ...d.customers,
        {
          id: uid('cu'),
          name: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          createdAt: Date.now(),
          orders: 1,
        },
      ];
    }
    store.save(d);
    setData(d);
    setCart([]);
    setAppliedCoupon(null);
    return orderId;
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id)? prev.filter(item => item!== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const contextValue: StoreContextType = {
   ...data,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    placeOrder,
    wishlist,
    toggleWishlist,
    isInWishlist,
    storeName: data.settings.storeName,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
  }
