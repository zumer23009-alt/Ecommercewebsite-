import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import { useEffect } from 'react';

// Public components
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

import Home from './Home';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Account from './Account';
import Wishlist from './Wishlist';

import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';

import { AdminProductsList, AdminProductForm } from './AdminProducts';
import AdminCategories from './AdminCategories';

import { AdminOrdersList, AdminOrderDetail } from './AdminOrders';

import {
  AdminCustomers,
  AdminCoupons,
  AdminBanners,
  AdminReviews,
  AdminNewsletter,
  AdminMedia,
  AdminSettings
} from './AdminMisc';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
          <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />
          <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProductsList />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrdersList />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="font-serif text-7xl font-bold mb-4">404</div>
      <h1 className="font-serif text-2xl font-bold mb-3">Page introuvable</h1>
      <p className="text-neutral-500 mb-8">La page que vous cherchez n'existe pas.</p>
      <LinkStyled />
    </div>
  );
}

function LinkStyled() {
  return (
    <a href="/" className="bg-black text-white px-8 py-3.5 text-sm font-semibold tracking-wider hover:bg-amber-500 hover:text-black transition inline-block">
      RETOUR À L'ACCUEIL
    </a>
  );
}
