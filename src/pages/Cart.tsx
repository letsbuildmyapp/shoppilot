import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { lines, setQuantity, remove, subtotalCents } = useCart();
  const nav = useNavigate();
  const subtotal = subtotalCents();
  const shipping = subtotal > 15000 || lines.length === 0 ? 0 : 1200;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + tax;

  if (lines.length === 0) {
    return (
      <div className="container-edit py-32 text-center">
        <ShoppingBag className="size-10 mx-auto text-coal-mute mb-6" />
        <p className="font-display text-4xl">Your cart is empty.</p>
        <p className="text-coal-mute mt-3">Pick a piece from the spring firing.</p>
        <Link to="/shop" className="btn-primary mt-8">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container-edit py-12 md:py-20">
      <p className="eyebrow mb-3">Cart</p>
      <h1 className="display-lg mb-12">Your cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-6">
          {lines.map((l) => (
            <div key={l.id} className="flex gap-5 border-b border-line pb-6">
              <Link to={`/p/${l.productSlug}`} className="shrink-0 w-28 sm:w-32 aspect-[4/5] bg-bone-100 overflow-hidden">
                <img src={l.productImage} alt={l.productName} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/p/${l.productSlug}`} className="font-display text-2xl hover:text-forest">{l.productName}</Link>
                    <p className="text-sm text-coal-mute mt-1">{l.variantLabel}</p>
                  </div>
                  <p className="text-sm num text-coal-soft shrink-0">{formatMoney(l.unitPriceCents * l.quantity)}</p>
                </div>
                <div className="mt-5 flex items-center gap-5">
                  <div className="flex items-center border border-line">
                    <button onClick={() => setQuantity(l.id, l.quantity - 1)} className="w-10 h-10 hover:bg-bone-100" aria-label="Decrease">−</button>
                    <span className="w-10 text-center num">{l.quantity}</span>
                    <button onClick={() => setQuantity(l.id, l.quantity + 1)} className="w-10 h-10 hover:bg-bone-100" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-coal-mute hover:text-clay text-sm inline-flex items-center gap-2">
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card bg-bone-100 self-start">
          <h2 className="font-display text-2xl mb-5">Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-coal-mute">Subtotal</dt><dd className="num">{formatMoney(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-coal-mute">Shipping</dt><dd className="num">{shipping === 0 ? 'Free' : formatMoney(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-coal-mute">Tax (est.)</dt><dd className="num">{formatMoney(tax)}</dd></div>
          </dl>
          <div className="rule my-5" />
          <div className="flex justify-between text-lg"><span>Total</span><span className="num">{formatMoney(total)}</span></div>
          <button onClick={() => nav('/checkout')} className="btn-primary w-full mt-6">Checkout</button>
          <p className="text-xs text-coal-mute mt-4 text-center">Free shipping over $150. Returns within 30 days.</p>
        </aside>
      </div>
    </div>
  );
}
