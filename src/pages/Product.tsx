import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';
import { findProduct, CATEGORY_LABEL, SEED_PRODUCTS } from '@/seed/products';
import { formatMoney } from '@/lib/utils';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';
import { ArrowLeft, Check } from 'lucide-react';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    // Lookup by id (we use slug as id in seed) — fall back to local seed
    const ref = doc(db, 'products', slug);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as Product;
  } catch {}
  return findProduct(slug) ?? null;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
  });

  const [variantId, setVariantId] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  if (isLoading) return <div className="container-edit py-20 text-coal-mute">Loading…</div>;
  if (!product) {
    return (
      <div className="container-edit py-32 text-center">
        <p className="font-display text-4xl">Not found.</p>
        <p className="text-coal-mute mt-2">That piece may be sold or retired.</p>
        <Link to="/shop" className="btn-outline mt-6">Back to shop</Link>
      </div>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const stock = variant.inventory;
  const inStock = stock > 0;
  const related = SEED_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  function handleAdd() {
    add({
      productId: product!.id,
      productSlug: product!.slug,
      productName: product!.name,
      productImage: product!.images[0],
      variantId: variant.id,
      variantLabel: variant.label,
      unitPriceCents: variant.priceCents,
      quantity: qty,
    });
    toast.success(`Added ${qty} × ${product!.name} (${variant.label})`, {
      action: { label: 'View cart', onClick: () => nav('/cart') },
    });
  }

  return (
    <div>
      <div className="container-edit pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-coal-mute hover:text-forest">
          <ArrowLeft className="size-4" /> Back to shop
        </Link>
      </div>
      <div className="container-edit py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-bone-100 overflow-hidden border border-line">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden border ${i === activeImg ? 'border-forest' : 'border-line hover:border-coal-soft'}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div>
          <p className="eyebrow mb-3">{CATEGORY_LABEL[product.category]}</p>
          <h1 className="display-md mb-4">{product.name}</h1>
          <p className="text-2xl num">{formatMoney(variant.priceCents)}</p>
          <p className="mt-6 text-coal-soft leading-relaxed">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="mt-10">
              <p className="eyebrow mb-3">Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`px-5 py-3 text-sm border min-h-[44px] transition-colors ${
                      v.id === variant.id
                        ? 'border-forest bg-forest text-bone-50'
                        : 'border-line hover:border-coal'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & add */}
          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div>
              <p className="eyebrow mb-3">Quantity</p>
              <div className="flex items-center border border-line">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 hover:bg-bone-100" aria-label="Decrease">−</button>
                <span className="w-12 text-center num">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(stock, q + 1))} className="w-11 h-11 hover:bg-bone-100" aria-label="Increase">+</button>
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="btn-primary flex-1 min-w-[200px]"
            >
              {inStock ? 'Add to cart' : 'Sold out'}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-coal-mute">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-forest" /> {stock} in stock · ships in 2–3 days</span>
            ) : (
              <span className="text-clay">Out of stock — joins next firing list at sign-in.</span>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-line py-2"><span className="text-coal-mute">SKU</span><span className="num">{variant.sku}</span></div>
            <div className="flex justify-between border-b border-line py-2"><span className="text-coal-mute">Material</span><span>Stoneware</span></div>
            <div className="flex justify-between border-b border-line py-2"><span className="text-coal-mute">Dishwasher</span><span>Yes</span></div>
            <div className="flex justify-between border-b border-line py-2"><span className="text-coal-mute">Made in</span><span>Brattleboro, VT</span></div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line py-20 bg-bone-100">
          <div className="container-edit">
            <p className="eyebrow mb-3">Also from this firing</p>
            <h2 className="display-md mb-10">More from {CATEGORY_LABEL[product.category]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
              {related.map((r) => (
                <Link key={r.id} to={`/p/${r.slug}`} className="group">
                  <div className="aspect-[4/5] bg-bone-50 overflow-hidden">
                    <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <p className="font-display text-xl leading-tight">{r.name}</p>
                    <p className="text-sm num text-coal-soft shrink-0">{formatMoney(r.basePriceCents)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
