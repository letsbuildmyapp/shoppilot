import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/auth';
import type { Order } from '@/types';
import { formatMoney, formatDate } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-bone-200 text-coal',
  paid: 'bg-sage/30 text-forest-deep',
  fulfilling: 'bg-forest/15 text-forest-deep',
  shipped: 'bg-forest text-bone-50',
  delivered: 'bg-coal text-bone-50',
  refunded: 'bg-clay/15 text-clay',
  cancelled: 'bg-bone-200 text-coal-mute',
};

async function fetchOrders(uid: string): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), where('ownerUid', '==', uid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  } catch {
    return [];
  }
}

export function Orders() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => fetchOrders(user!.uid),
    enabled: !!user,
  });

  return (
    <div className="container-edit py-12 md:py-20">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="display-lg mb-12">Your orders</h1>

      {isLoading && <p className="text-coal-mute">Loading…</p>}

      {!isLoading && orders.length === 0 && (
        <div className="border border-line p-12 text-center bg-bone-100">
          <p className="font-display text-3xl">No orders yet.</p>
          <p className="text-coal-mute mt-2">When you place one, it'll show up here.</p>
          <Link to="/shop" className="btn-primary mt-6">Browse the shop</Link>
        </div>
      )}

      <ul className="divide-y divide-line border-t border-b border-line">
        {orders.map((o) => (
          <li key={o.id} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-6 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Link to={`/orders/${o.id}`} className="font-display text-2xl hover:text-forest">{o.number}</Link>
                <span className={`badge ${STATUS_COLOR[o.status] ?? ''}`}>{o.status}</span>
              </div>
              <p className="text-sm text-coal-mute mt-1">
                {formatDate(o.createdAt)} · {o.lines.length} item{o.lines.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="text-right">
              <p className="num text-lg">{formatMoney(o.totalCents)}</p>
              <Link to={`/orders/${o.id}`} className="text-sm text-forest hover:text-forest-deep">View</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => fetchOrders(user!.uid),
    enabled: !!user,
  });
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="container-edit py-32 text-center">
        <p className="font-display text-3xl">Order not found.</p>
        <Link to="/orders" className="btn-outline mt-6">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="container-edit py-12 md:py-20">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-coal-mute hover:text-forest mb-6">
        <ArrowLeft className="size-4" /> All orders
      </Link>
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
        <h1 className="display-md">Order {order.number}</h1>
        <span className={`badge ${STATUS_COLOR[order.status] ?? ''}`}>{order.status}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <div>
          <ul className="divide-y divide-line border-t border-b border-line">
            {order.lines.map((l) => (
              <li key={l.id} className="flex gap-5 py-5 items-center">
                <Link to={`/p/${l.productSlug}`} className="shrink-0 w-20 aspect-square bg-bone-100 overflow-hidden">
                  <img src={l.productImage} alt={l.productName} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/p/${l.productSlug}`} className="font-display text-xl hover:text-forest">{l.productName}</Link>
                  <p className="text-sm text-coal-mute mt-1">{l.variantLabel} · qty <span className="num">{l.quantity}</span></p>
                </div>
                <p className="num text-sm shrink-0">{formatMoney(l.unitPriceCents * l.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-8">
          <div className="card bg-bone-100">
            <p className="eyebrow mb-3">Summary</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-coal-mute">Subtotal</dt><dd className="num">{formatMoney(order.subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-coal-mute">Shipping</dt><dd className="num">{formatMoney(order.shippingCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-coal-mute">Tax</dt><dd className="num">{formatMoney(order.taxCents)}</dd></div>
              <div className="rule my-2" />
              <div className="flex justify-between text-base"><dt>Total</dt><dd className="num">{formatMoney(order.totalCents)}</dd></div>
            </dl>
          </div>
          {order.shippingAddress && (
            <div className="card bg-bone-100">
              <p className="eyebrow mb-3">Ship to</p>
              <p>{order.shippingAddress.name}</p>
              <p className="text-coal-mute">{order.shippingAddress.line1}</p>
              <p className="text-coal-mute">{order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postal}</p>
              <p className="text-coal-mute">{order.shippingAddress.country}</p>
            </div>
          )}
          <div className="card bg-bone-100">
            <p className="eyebrow mb-3">Placed</p>
            <p>{formatDate(order.createdAt)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
