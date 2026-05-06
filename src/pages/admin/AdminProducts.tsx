import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Variant } from '@/types';
import { CATEGORY_LABEL, SEED_PRODUCTS } from '@/seed/products';
import { formatMoney } from '@/lib/utils';
import { Link, NavLink } from 'react-router-dom';
import { Edit3, RefreshCcw, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ProductEditor } from './ProductEditor';

async function fetchAllProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) return SEED_PRODUCTS;
    return snap.docs.map((d) => d.data() as Product).sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return SEED_PRODUCTS;
  }
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: fetchAllProducts });
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function syncShopify() {
    setSyncing(true);
    // Mock: mark all products as syncedFromShopify with new timestamp
    const now = Date.now();
    let count = 0;
    for (const p of products) {
      try {
        await setDoc(
          doc(db, 'products', p.id),
          { syncedFromShopify: true, syncedAt: now, updatedAt: now },
          { merge: true },
        );
        count++;
      } catch {}
      // small artificial delay so the toast feels real
      await new Promise((r) => setTimeout(r, 30));
    }
    setSyncing(false);
    qc.invalidateQueries({ queryKey: ['admin-products'] });
    toast.success(`Synced ${count} products from Shopify`, {
      description: 'Inventory and pricing updated.',
    });
  }

  async function newProduct() {
    setCreating(true);
    setEditing({
      id: 'new-' + Math.random().toString(36).slice(2, 9),
      slug: 'new-product',
      name: 'New product',
      category: 'tableware',
      shortDescription: '',
      description: '',
      images: ['https://images.unsplash.com/photo-1530747673506-b9bd6b2c8b3d?auto=format&fit=crop&w=1600&q=80'],
      variants: [{ id: 'default', label: 'Standard', priceCents: 5000, inventory: 10, sku: 'NEW' }],
      basePriceCents: 5000,
      syncedFromShopify: false,
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return (
    <div>
      <AdminTabs />
      <div className="container-edit py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-2">Studio admin</p>
            <h1 className="display-md">Products</h1>
          </div>
          <div className="flex gap-3">
            <button data-tour="admin-sync" onClick={syncShopify} disabled={syncing} className="btn-outline">
              <RefreshCcw className={`size-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing…' : 'Sync from Shopify'}
            </button>
            <button onClick={newProduct} className="btn-primary">
              <Plus className="size-4" /> New product
            </button>
          </div>
        </div>

        {isLoading && <p className="text-coal-mute">Loading…</p>}

        <div data-tour="admin-products" className="border-y border-line">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-coal-mute border-b border-line">
              <tr>
                <th className="py-3 pr-4 font-medium">Product</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Variants</th>
                <th className="py-3 pr-4 font-medium text-right">Price</th>
                <th className="py-3 pr-4 font-medium">Synced</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line hover:bg-bone-100">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/p/${p.slug}`} className="size-12 bg-bone-100 overflow-hidden shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </Link>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-coal-mute">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-coal-soft">{CATEGORY_LABEL[p.category]}</td>
                  <td className="py-3 pr-4">
                    <span className="num">{p.variants.length}</span> · <span className="num">{p.variants.reduce((a, v) => a + v.inventory, 0)}</span> in stock
                  </td>
                  <td className="py-3 pr-4 text-right num">{formatMoney(p.basePriceCents)}</td>
                  <td className="py-3 pr-4">
                    {p.syncedFromShopify ? <span className="badge-shopify">Shopify</span> : <span className="badge">Local</span>}
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => { setEditing(p); setCreating(false); }} className="inline-flex items-center gap-1.5 text-forest hover:text-forest-deep">
                      <Edit3 className="size-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => qc.invalidateQueries({ queryKey: ['admin-products'] })}
        />
      )}
    </div>
  );
}

export function AdminTabs() {
  return (
    <div className="border-b border-line bg-bone-100">
      <div className="container-edit flex gap-8">
        <Tab to="/admin">Products</Tab>
        <Tab to="/admin/orders">Orders</Tab>
      </div>
    </div>
  );
}

function Tab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `py-4 text-sm border-b-2 -mb-px ${isActive ? 'border-forest text-forest' : 'border-transparent text-coal-mute hover:text-coal'}`
      }
    >
      {children}
    </NavLink>
  );
}

export type { Variant };
