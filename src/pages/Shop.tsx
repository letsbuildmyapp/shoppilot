import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category, Product } from '@/types';
import { CATEGORY_LABEL, SEED_PRODUCTS } from '@/seed/products';
import { formatMoney } from '@/lib/utils';
import { Search } from 'lucide-react';

const PRICE_BUCKETS = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 5000 },
  { label: '$50–100', min: 5000, max: 10000 },
  { label: '$100–200', min: 10000, max: 20000 },
  { label: 'Over $200', min: 20000, max: Infinity },
];

async function fetchProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), where('active', '==', true), orderBy('basePriceCents'));
    const snap = await getDocs(q);
    if (snap.empty) return SEED_PRODUCTS;
    return snap.docs.map((d) => d.data() as Product);
  } catch (e) {
    // Emulator / offline fallback
    return SEED_PRODUCTS;
  }
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = (params.get('category') ?? 'all') as Category | 'all';
  const search = params.get('q') ?? '';
  const priceIdx = Number(params.get('p') ?? 0);
  const [searchInput, setSearchInput] = useState(search);

  const { data: products, isLoading, error } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const filtered = useMemo(() => {
    if (!products) return [];
    const bucket = PRICE_BUCKETS[priceIdx] ?? PRICE_BUCKETS[0];
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (p.basePriceCents < bucket.min || p.basePriceCents >= bucket.max) return false;
      if (search && !`${p.name} ${p.shortDescription}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, category, search, priceIdx]);

  function setParam(key: string, val: string | null) {
    const next = new URLSearchParams(params);
    if (val === null || val === '') next.delete(key);
    else next.set(key, val);
    setParams(next, { replace: true });
  }

  return (
    <div className="container-edit py-12 md:py-20">
      <div className="mb-12">
        <p className="eyebrow mb-3">Catalog</p>
        <h1 className="display-lg">{category === 'all' ? 'All work' : CATEGORY_LABEL[category]}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
        <aside className="space-y-10">
          <div>
            <p className="eyebrow mb-4">Search</p>
            <div className="flex items-center gap-2 border-b border-line py-2">
              <Search className="size-4 text-coal-mute" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', searchInput); }}
                onBlur={() => setParam('q', searchInput)}
                placeholder="Search…"
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">Category</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setParam('category', null)} className={category === 'all' ? 'text-forest' : 'text-coal hover:text-forest'}>
                  All work
                </button>
              </li>
              {Object.entries(CATEGORY_LABEL).map(([slug, label]) => (
                <li key={slug}>
                  <button
                    onClick={() => setParam('category', slug)}
                    className={category === slug ? 'text-forest' : 'text-coal hover:text-forest'}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Price</p>
            <ul className="space-y-2 text-sm">
              {PRICE_BUCKETS.map((b, i) => (
                <li key={b.label}>
                  <button
                    onClick={() => setParam('p', i === 0 ? null : String(i))}
                    className={priceIdx === i ? 'text-forest' : 'text-coal hover:text-forest'}
                  >
                    {b.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section>
          {isLoading && <div className="py-20 text-center text-coal-mute">Loading the catalog…</div>}
          {error && <div className="py-20 text-center text-clay">Couldn't load. Try again shortly.</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-3xl">Nothing matches.</p>
              <p className="text-coal-mute mt-2">Try another category or clear your filters.</p>
              <button onClick={() => setParams(new URLSearchParams())} className="btn-outline mt-6">Clear filters</button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((p) => (
              <Link key={p.id} to={`/p/${p.slug}`} className="group">
                <div className="aspect-[4/5] bg-bone-100 overflow-hidden">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-display text-xl leading-tight">{p.name}</p>
                    <p className="text-xs text-coal-mute mt-1 uppercase tracking-[0.12em]">{CATEGORY_LABEL[p.category]}</p>
                  </div>
                  <p className="text-sm num text-coal-soft shrink-0">{formatMoney(p.basePriceCents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
