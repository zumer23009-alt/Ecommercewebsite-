import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { store, Order } from './store';

const STATUSES: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function AdminOrdersList() {
  const data = store.load();
  const [orders, setOrders] = useState<Order[]>(data.orders);
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: Order['status']) => {
    const d = store.load();
    d.orders = d.orders.map((o) => (o.id === id ? { ...o, status } : o));
    store.save(d);
    setOrders(d.orders);
  };

  return (
    <AdminLayout title="Gestion des commandes">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded border transition ${filter === s ? 'bg-black text-white border-black' : 'bg-white border-neutral-300 hover:border-black'}`}
            >
              {s} ({s === 'All' ? orders.length : orders.filter((o) => o.status === s).length})
            </button>
          ))}
        </div>

        <div className="bg-white rounded border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
              <tr>
                <th className="p-3">Commande</th>
                <th className="p-3">Client</th>
                <th className="p-3">Ville</th>
                <th className="p-3">Articles</th>
                <th className="p-3">Total</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className="p-3">
                    <a href={`/admin/orders/${o.id}`} className="font-semibold text-blue-600 hover:underline">{o.id}</a>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-neutral-500">{o.phone}</div>
                  </td>
                  <td className="p-3">{o.city}</td>
                  <td className="p-3 text-xs">{o.items.length} article(s)</td>
                  <td className="p-3 font-semibold">{o.total} TND</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                      className={`text-xs px-2 py-1 rounded border-0 ${statusColors[o.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-neutral-500">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-neutral-500">Aucune commande</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = store.load();
  const order = data.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AdminLayout title="Commande introuvable">
        <div className="text-center py-10">
          <p className="mb-4">Commande introuvable</p>
          <button onClick={() => navigate('/admin/orders')} className="bg-black text-white px-4 py-2 text-sm">Retour</button>
        </div>
      </AdminLayout>
    );
  }

  const updateStatus = (status: Order['status']) => {
    const d = store.load();
    d.orders = d.orders.map((o) => (o.id === order.id ? { ...o, status } : o));
    store.save(d);
    window.location.reload();
  };

  return (
    <AdminLayout title={`Détails commande ${order.id}`}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded border border-neutral-200 p-6">
          <h2 className="font-semibold mb-4">Informations client</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Nom:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.email || '—'}</p>
            <p><strong>Téléphone:</strong> {order.phone}</p>
            <p><strong>Ville:</strong> {order.city}</p>
            <p><strong>Adresse:</strong> {order.address}</p>
            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        </div>

        <div className="bg-white rounded border border-neutral-200 p-6">
          <h2 className="font-semibold mb-4">Statut de la commande</h2>
          <div className="mb-4">
            <span className={`text-xs px-3 py-1.5 rounded ${statusColors[order.status]}`}>{order.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={order.status === s}
                className={`text-xs py-2 border rounded transition ${order.status === s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'}`}
              >
                Passer à "{s}"
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded border border-neutral-200 p-6">
          <h2 className="font-semibold mb-4">Articles ({order.items.length})</h2>
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-600">
              <tr><th className="p-3">Produit</th><th className="p-3">Taille</th><th className="p-3">Couleur</th><th className="p-3">Qté</th><th className="p-3 text-right">Prix</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.items.map((it, i) => (
                <tr key={i}>
                  <td className="p-3 flex items-center gap-3">
                    <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded" />
                    <span className="font-medium">{it.name}</span>
                  </td>
                  <td className="p-3">{it.size}</td>
                  <td className="p-3">{it.color}</td>
                  <td className="p-3">x{it.qty}</td>
                  <td className="p-3 text-right font-semibold">{(it.price * it.qty).toFixed(2)} TND</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black">
                <td colSpan={4} className="p-3 text-right font-bold">Total</td>
                <td className="p-3 text-right font-bold text-lg">{order.total} TND</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
