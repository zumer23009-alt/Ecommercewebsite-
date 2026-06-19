// Centralized data store using localStorage for persistence
// Production-ready structure compatible with MySQL/Node.js backend later

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  items: { productId: string; name: string; price: number; qty: number; size: string; color: string; image: string }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  orders: number;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiry: string;
  usageLimit: number;
  used: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: number;
};

export type Newsletter = {
  id: string;
  email: string;
  createdAt: number;
};

export type Settings = {
  storeName: string;
  tagline: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  currency: string;
  logo: string;
};

// Default seed data
const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: 'Sandales SAMBA Cuir',
    description: 'Sandales confortables en cuir premium, parfaites pour l\'été. Livraison 24h à travers toute la Tunisie.',
    price: 75,
    salePrice: 59,
    sku: 'ZENO-SAMBA-001',
    stock: 24,
    category: 'SAMBA',
    subcategory: 'Sandales',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Noir', hex: '#1a1a1a' },
      { name: 'Beige', hex: '#d4b896' },
      { name: 'Marron', hex: '#6b4226' },
    ],
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
    featured: true,
    bestSeller: true,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'p2',
    name: 'Espadrilles Bohème',
    description: 'Espadrilles tendance pour un style décontracté et chic. Confectionnées avec soin en Tunisie.',
    price: 45,
    sku: 'ZENO-ESP-002',
    stock: 35,
    category: 'Espadrilles',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Naturel', hex: '#e8dcc4' },
      { name: 'Bleu Marine', hex: '#1e3a5f' },
      { name: 'Rose', hex: '#e8b4b8' },
    ],
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'],
    featured: true,
    bestSeller: true,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'p3',
    name: 'Sabot Cuir Véritable',
    description: 'Sabots élégants en cuir véritable. Confort premium pour toutes les journées.',
    price: 69,
    sku: 'ZENO-SAB-003',
    stock: 18,
    category: 'Sabot',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Noir', hex: '#1a1a1a' },
      { name: 'Marron', hex: '#6b4226' },
    ],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
    featured: false,
    bestSeller: true,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'p4',
    name: 'Sandales Plage Luxe',
    description: 'Sandales de plage design et légères. Parfaites pour vos vacances d\'été.',
    price: 45,
    salePrice: 39,
    sku: 'ZENO-PLG-004',
    stock: 50,
    category: 'SAMBA',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Or', hex: '#d4af37' },
      { name: 'Argent', hex: '#c0c0c0' },
      { name: 'Rose Gold', hex: '#b76e79' },
    ],
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'],
    featured: true,
    bestSeller: false,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'p5',
    name: 'Espadrilles Classique',
    description: 'Espadrilles classiques intemporelles. Le must-have de chaque garde-robe.',
    price: 45,
    sku: 'ZENO-ESP-C-005',
    stock: 42,
    category: 'Espadrilles',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Blanc', hex: '#ffffff' },
      { name: 'Noir', hex: '#1a1a1a' },
      { name: 'Rouge', hex: '#8b0000' },
    ],
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'],
    featured: false,
    bestSeller: true,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'p6',
    name: 'Sabot Confort Plus',
    description: 'Sabots ultra-confortables avec semelle rembourrée. Idéaux pour un usage quotidien.',
    price: 59,
    sku: 'ZENO-SAB-C-006',
    stock: 30,
    category: 'Sabot',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Beige', hex: '#d4b896' },
      { name: 'Taupe', hex: '#8b7355' },
    ],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
    featured: true,
    bestSeller: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'p7',
    name: 'Sandales Bohème Chic',
    description: 'Sandales bohèmes avec détails perlés. Style unique pour femmes modernes.',
    price: 75,
    sku: 'ZENO-SAM-B-007',
    stock: 20,
    category: 'SAMBA',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Doré', hex: '#d4af37' },
      { name: 'Bronze', hex: '#cd7f32' },
    ],
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'],
    featured: false,
    bestSeller: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'p8',
    name: 'Espadrilles Luxe Cuir',
    description: 'Espadrilles en cuir haut de gamme. Élégance et confort réunis.',
    price: 59,
    salePrice: 49,
    sku: 'ZENO-ESP-L-008',
    stock: 28,
    category: 'Espadrilles',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Noir', hex: '#1a1a1a' },
      { name: 'Marron Foncé', hex: '#3d2314' },
    ],
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'],
    featured: true,
    bestSeller: false,
    createdAt: Date.now() - 86400000,
  },
];

const defaultCategories: Category[] = [
  { id: 'c1', name: 'SAMBA', slug: 'samba', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80', description: 'Collection sandales tendance' },
  { id: 'c2', name: 'Espadrilles', slug: 'espadrilles', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', description: 'Espadrilles confortables' },
  { id: 'c3', name: 'Sabot', slug: 'sabot', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', description: 'Sabots élégants' },
  { id: 'c4', name: 'Nouveautés', slug: 'new', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80', description: 'Derniers arrivages' },
];

const defaultBanners: Banner[] = [
  { id: 'b1', title: 'Collection Été 2026', subtitle: 'Sandales & Espadrilles Tendance', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1600&q=80', link: '/products', active: true },
  { id: 'b2', title: 'Livraison 24h en Tunisie', subtitle: 'Paiement à la livraison disponible', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80', link: '/products', active: true },
  { id: 'b3', title: 'Qualité Premium', subtitle: 'Cuir véritable - Fabriqué avec soin', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=80', link: '/products', active: true },
];

const defaultSettings: Settings = {
  storeName: 'ZENO Collection',
  tagline: 'Magasin de vente en ligne - Chaussures & Sandales pour Femmes',
  whatsapp: '21692765464',
  email: 'contact@zenocollection.tn',
  phone: '+216 92 765 464',
  address: 'Tunis, Tunisie',
  instagram: '@zeno_col',
  facebook: 'zenocollection',
  currency: 'TND',
  logo: '',
};

const defaultCoupons: Coupon[] = [
  { id: 'cp1', code: 'BIENVENUE10', type: 'percentage', value: 10, expiry: '2026-12-31', usageLimit: 100, used: 12 },
  { id: 'cp2', code: 'ETE2026', type: 'fixed', value: 15, expiry: '2026-08-31', usageLimit: 50, used: 5 },
];

const defaultReviews: Review[] = [
  { id: 'r1', productId: 'p1', author: 'Fatma S.', rating: 5, comment: 'Très belle qualité, livraison rapide!', approved: true, createdAt: Date.now() - 86400000 * 3 },
  { id: 'r2', productId: 'p2', author: 'Meryem B.', rating: 5, comment: 'Confortables et élégantes, je recommande.', approved: true, createdAt: Date.now() - 86400000 * 2 },
  { id: 'r3', productId: 'p3', author: 'Lina K.', rating: 4, comment: 'Bonne finition, taille conforme.', approved: true, createdAt: Date.now() - 86400000 },
];

// Helpers
const LS_KEY = 'zeno_store_v1';

export type StoreData = {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  banners: Banner[];
  reviews: Review[];
  newsletter: Newsletter[];
  settings: Settings;
  admin: { email: string; password: string };
};

function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: StoreData = {
    products: defaultProducts,
    categories: defaultCategories,
    orders: [
      {
        id: 'ORD-1001',
        customerName: 'Fatma Ben Ali',
        email: 'fatma@example.com',
        phone: '+216 92 765 464',
        city: 'Tunis',
        address: '12 Rue de la Liberté',
        items: [{ productId: 'p1', name: 'Sandales SAMBA Cuir', price: 59, qty: 1, size: '38', color: 'Noir', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&q=80' }],
        total: 59,
        status: 'Delivered',
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'ORD-1002',
        customerName: 'Meryem Bouaziz',
        email: 'meryem@example.com',
        phone: '+216 98 123 456',
        city: 'Sfax',
        address: '5 Avenue Habib Bourguiba',
        items: [
          { productId: 'p2', name: 'Espadrilles Bohème', price: 45, qty: 2, size: '37', color: 'Naturel', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&q=80' },
        ],
        total: 90,
        status: 'Shipped',
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'ORD-1003',
        customerName: 'Lina Khelifi',
        email: 'lina@example.com',
        phone: '+216 97 888 999',
        city: 'Sousse',
        address: '8 Rue de la Plage',
        items: [{ productId: 'p3', name: 'Sabot Cuir Véritable', price: 69, qty: 1, size: '39', color: 'Marron', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80' }],
        total: 69,
        status: 'Pending',
        createdAt: Date.now() - 86400000,
      },
    ],
    customers: [
      { id: 'cu1', name: 'Fatma Ben Ali', email: 'fatma@example.com', phone: '+216 92 765 464', createdAt: Date.now() - 86400000 * 15, orders: 3 },
      { id: 'cu2', name: 'Meryem Bouaziz', email: 'meryem@example.com', phone: '+216 98 123 456', createdAt: Date.now() - 86400000 * 10, orders: 2 },
      { id: 'cu3', name: 'Lina Khelifi', email: 'lina@example.com', phone: '+216 97 888 999', createdAt: Date.now() - 86400000 * 5, orders: 1 },
    ],
    coupons: defaultCoupons,
    banners: defaultBanners,
    reviews: defaultReviews,
    newsletter: [
      { id: 'n1', email: 'subscriber1@mail.tn', createdAt: Date.now() - 86400000 * 7 },
      { id: 'n2', email: 'subscriber2@mail.tn', createdAt: Date.now() - 86400000 * 3 },
    ],
    settings: defaultSettings,
    admin: { email: 'admin@zeno.tn', password: 'admin123' },
  };
  localStorage.setItem(LS_KEY, JSON.stringify(initial));
  return initial;
}

function saveStore(data: StoreData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export const store = {
  load: loadStore,
  save: saveStore,
  reset: () => {
    localStorage.removeItem(LS_KEY);
    return loadStore();
  },
  // Auth
  loginAdmin: (email: string, password: string): boolean => {
    const d = loadStore();
    if (d.admin.email === email && d.admin.password === password) {
      sessionStorage.setItem('zeno_admin', JSON.stringify({ email, loggedAt: Date.now() }));
      return true;
    }
    return false;
  },
  isAdminLoggedIn: (): boolean => {
    try {
      const raw = sessionStorage.getItem('zeno_admin');
      return !!raw;
    } catch {
      return false;
    }
  },
  logoutAdmin: () => {
    sessionStorage.removeItem('zeno_admin');
  },
};

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
