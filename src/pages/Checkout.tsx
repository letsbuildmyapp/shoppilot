import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc } from 'firebase/firestore';
import { functions, db } from '@/lib/firebase';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { formatMoney, shortId } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  line1: z.string().min(3, 'Address required'),
  city: z.string().min(2, 'City required'),
  region: z.string().min(2, 'State required'),
  postal: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const { user, profile } = useAuth();
  const { lines, subtotalCents, clear } = useCart();
  const nav = useNavigate();
  const subtotal = subtotalCents();
  const shipping = subtotal > 15000 || lines.length === 0 ? 0 : 1200;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + tax;
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.displayName ?? '',
      line1: '',
      city: '',
      region: '',
      postal: '',
      country: 'US',
    },
  });

  if (lines.length === 0) {
    return (
      <div className="container-edit py-32 text-center">
        <p className="font-display text-4xl">Nothing to check out.</p>
        <button onClick={() => nav('/shop')} className="btn-primary mt-6">Browse the shop</button>
      </div>
    );
  }

  async function onSubmit(values: FormData) {
    if (!user) return;
    setBusy(true);
    try {
      const orderId = `ord_${shortId()}${shortId()}`;
      const order: Order = {
        id: orderId,
        number: `KR-${Date.now().toString().slice(-6)}`,
        ownerUid: user.uid,
        ownerEmail: user.email ?? '',
        lines,
        subtotalCents: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        totalCents: total,
        status: 'pending',
        shippingAddress: values,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, 'orders', orderId), order);

      const callable = httpsCallable<
        { lines: any[]; successUrl: string; cancelUrl: string; orderId: string },
        { sessionId: string; url: string }
      >(functions, 'createCheckoutSession');
      const origin = window.location.origin;
      const result = await callable({
        lines: lines.map((l) => ({
          productName: l.productName,
          variantLabel: l.variantLabel,
          unitPriceCents: l.unitPriceCents,
          quantity: l.quantity,
          productImage: l.productImage,
        })),
        successUrl: `${origin}/order/success`,
        cancelUrl: `${origin}/cart`,
        orderId,
      });
      clear();
      // The function returns a redirect URL; in real Stripe mode this is checkout.stripe.com.
      window.location.assign(result.data.url);
    } catch (e: any) {
      toast.error(e.message ?? 'Checkout failed');
      setBusy(false);
    }
  }

  return (
    <div className="container-edit py-12 md:py-20">
      <p className="eyebrow mb-3">Checkout</p>
      <h1 className="display-lg mb-12">Where to ship?</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-6">
          <Field label="Full name" error={errors.name?.message}>
            <input className="input-box" {...register('name')} />
          </Field>
          <Field label="Street address" error={errors.line1?.message}>
            <input className="input-box" {...register('line1')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" error={errors.city?.message}>
              <input className="input-box" {...register('city')} />
            </Field>
            <Field label="State / region" error={errors.region?.message}>
              <input className="input-box" {...register('region')} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Postal code" error={errors.postal?.message}>
              <input className="input-box" {...register('postal')} />
            </Field>
            <Field label="Country" error={errors.country?.message}>
              <input className="input-box" {...register('country')} />
            </Field>
          </div>
        </div>

        <aside className="card bg-bone-100 self-start">
          <h2 className="font-display text-2xl mb-5">Order summary</h2>
          <ul className="space-y-3 text-sm mb-5">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span className="truncate">{l.quantity} × {l.productName} <span className="text-coal-mute">({l.variantLabel})</span></span>
                <span className="num shrink-0">{formatMoney(l.unitPriceCents * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="rule mb-4" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-coal-mute">Subtotal</dt><dd className="num">{formatMoney(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-coal-mute">Shipping</dt><dd className="num">{shipping === 0 ? 'Free' : formatMoney(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-coal-mute">Tax</dt><dd className="num">{formatMoney(tax)}</dd></div>
          </dl>
          <div className="rule my-4" />
          <div className="flex justify-between text-lg mb-6"><span>Total</span><span className="num">{formatMoney(total)}</span></div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Redirecting to Stripe…' : 'Continue to payment'}
          </button>
          <p className="text-xs text-coal-mute mt-4 text-center">
            Secure checkout via Stripe (test mode).
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-clay mt-1.5">{error}</p>}
    </div>
  );
}
