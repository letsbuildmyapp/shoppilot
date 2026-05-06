import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, doc, setDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/types';
import { formatMoney, formatDate } from '@/lib/utils';
import { AdminTabs } from './AdminProducts';
import { toast } from 'sonner';

const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'fulfilling', 'shipped', 'delivered'];

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-bone-200 text-coal',
  paid: 'bg-sage/30 text-forest-deep',
  fulfilling: 'bg-forest/15 text-forest-deep',
  shipped: 'bg-forest text-bone-50',
  delivered: 'bg-coal text-bone-50',
  refunded: 'bg-clay/15 text-clay',
  cancelled: 'bg-bone-200 text-coal-mute',
};

async function fetchAllOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => d.data() as Order);
  } catch {
    return [];
  }
}

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: fetchAllOrders });

  async function advance(o: Order) {
    const idx = STATUS_FLOW.indexOf(o.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    await setDoc(doc(db, 'orders', o.id), { status: next, updatedAt: Date.now() }, { merge: true });
    toast.success(`${o.number} → ${next}`);
    qc.invalidateQueries({ queryKey: ['admin-orders'] });
  }

  return (
    <div>
      <AdminTabs />
      <div className="container-edit py-10">
        <div className="mb-10">
          <p className="eyebrow mb-2">Studio admin</p>
          <h1 className="display-md">Orders</h1>
        </div>

        {isLoading && <p className="text-coal-mute">Loading…</p>}
        {!isLoading && orders.length === 0 && (
          <p className="text-coal-mute">No orders yet.</p>
        )}

        <div data-tour="admin-orders" className="border-y border-line">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-coal-mute border-b border-line">
              <tr>
                <th className="py-3 pr-4 font-medium">Order</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium text-right">Total</th>
                <th className="py-3 pr-4 font-medium">Placed</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line hover:bg-bone-100">
                  <td className="py-3 pr-4 font-medium">{o.number}</td>
                  <td className="py-3 pr-4 text-coal-soft">{o.ownerEmail}</td>
                  <td className="py-3 pr-4 num">{o.lines.reduce((a, l) => a + l.quantity, 0)}</td>
                  <td className="py-3 pr-4 text-right num">{formatMoney(o.totalCents)}</td>
                  <td className="py-3 pr-4 text-coal-soft">{formatDate(o.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${STATUS_COLOR[o.status] ?? ''}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    {STATUS_FLOW.indexOf(o.status) >= 0 && STATUS_FLOW.indexOf(o.status) < STATUS_FLOW.length - 1 ? (
                      <button onClick={() => advance(o)} className="text-forest hover:text-forest-deep text-sm">
                        Advance →
                      </button>
                    ) : (
                      <span className="text-coal-mute text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
