import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import type { Order } from '@/types';
import { formatMoney } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('order') ?? '';
  const isDemo = params.get('demo') === '1';

  const { data: order } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const snap = await getDoc(doc(db, 'orders', orderId));
      return snap.exists() ? (snap.data() as Order) : null;
    },
    enabled: !!orderId,
  });

  // In real Stripe, payment confirmation arrives via webhook.
  // For the demo fixture path, we mark the order as paid client-side once the success URL loads.
  useEffect(() => {
    if (!isDemo || !order || order.status !== 'pending') return;
    setDoc(doc(db, 'orders', order.id), { status: 'paid', updatedAt: Date.now() }, { merge: true });
  }, [isDemo, order]);

  return (
    <div className="container-edit py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle2 className="size-12 mx-auto text-forest mb-6" />
        <p className="eyebrow mb-3">Order received</p>
        <h1 className="display-lg">Thank you.</h1>
        <p className="mt-6 text-coal-soft text-lg leading-relaxed">
          We'll send a confirmation email shortly. You can track this order from your account at any time.
        </p>

        {order && (
          <div className="mt-12 card bg-bone-100 text-left">
            <div className="flex items-baseline justify-between mb-5">
              <p className="font-display text-2xl">Order {order.number}</p>
              <span className="badge">{order.status}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {order.lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3 border-b border-line pb-3">
                  <span>{l.quantity} × {l.productName} <span className="text-coal-mute">({l.variantLabel})</span></span>
                  <span className="num shrink-0">{formatMoney(l.unitPriceCents * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="rule my-5" />
            <div className="flex justify-between text-lg"><span>Total</span><span className="num">{formatMoney(order.totalCents)}</span></div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link to="/orders" className="btn-primary">View order history</Link>
          <Link to="/shop" className="btn-outline">Keep browsing</Link>
        </div>
      </div>
    </div>
  );
}
