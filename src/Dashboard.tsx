import AdminLayout from './AdminLayout';
import { store } from './store';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const data = store.load();
  const totalRevenue = data.orders.filter((o) => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = data.orders.filter((o) => o.status === 'Pending').length;

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const stats = [
    { label: 'Total Commandes', value: data.orders.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Revenus (TND)', value: totalRevenue.toFixed(0), icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Clients', value: data.customers.length, icon: '👥', color: 'bg-purple-50 text-purple-700' },
    { label: 'Produits', value: data.products.length, icon: '👟', color: 'bg-amber-50 text-amber-700' },
    { label: 'En attente', value: pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Abonnés Newsletter', value: data.newsletter.length, icon: '📧', color: 'bg-pink-50 text-pink-700' },
  ];

  return (
    <AdminLayout title="Tableau de bord">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} p-4 rounded`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded border border-neutral-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="font-semibold">Commandes récentes</h2>
              <Link to="/admin/orders" className="text-xs text-amber-700 hover:underline">Voir tout →</Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {data.orders.slice(0, 6).map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{o.id}</div>
                    <div className="text-xs text-neutral-500">{o.customerName} • {o.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{o.total} TND</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${statusColors[o.status]}`}>{o.status}</span>
                  </div>
                </div>
              ))}
              {data.orders.length === 0 && <div className="p-8 text-center text-sm text-neutral-500">Aucune commande</div>}
            </div>
          </div>

          <div className="bg-white rounded border border-neutral-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="font-semibold">Top produits</h2>
              <Link to="/admin/products" className="text-xs text-amber-700 hover:underline">Gérer →</Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {data.products.slice(0, 6).map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-3 text-sm">
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-neutral-500">{p.category} • Stock: {p.stock}</div>
                  </div>
                  <div className="font-semibold">{(p.salePrice ?? p.price)} TND</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-neutral-200 p-4">
          <h2 className="font-semibold mb-4">Raccourcis rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/admin/products/new', label: '+ Nouveau produit', icon: '👟' },
              { to: '/admin/categories', label: '+ Catégorie', icon: '📁' },
              { to: '/admin/coupons', label: '+ Coupon', icon: '🎟️' },
              { to: '/admin/banners', label: '+ Bannière', icon: '🖼️' },
            ].map((b) => (
              <Link key={b.to} to={b.to} className="border border-neutral-200 p-4 text-sm text-center hover:border-black transition">
                <div className="text-2xl mb-1">{b.icon}</div>
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
