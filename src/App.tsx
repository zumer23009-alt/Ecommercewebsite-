import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import { useEffect } from 'react';

// Public components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import { AdminProductsList, AdminProductForm } from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import { AdminOrdersList, AdminOrderDetail } from './pages/admin/AdminOrders';
import { AdminCustomers, AdminCoupons, AdminBanners, AdminReviews, AdminNewsletter, AdminMedia, AdminSettings } from './pages/admin/AdminMisc';

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
