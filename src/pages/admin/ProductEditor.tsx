import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Variant, Category } from '@/types';
import { CATEGORY_LABEL } from '@/seed/products';
import { shortId, slugify } from '@/lib/utils';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ConfirmModal';

export function ProductEditor({
  product,
  isNew,
  onClose,
  onSaved,
}: {
  product: Product;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Product>(product);
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();

  function patch<K extends keyof Product>(key: K, val: Product[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }

  function patchVariant(idx: number, p: Partial<Variant>) {
    setDraft((d) => ({ ...d, variants: d.variants.map((v, i) => (i === idx ? { ...v, ...p } : v)) }));
  }

  function addVariant() {
    setDraft((d) => ({
      ...d,
      variants: [...d.variants, { id: 'v-' + shortId(), label: 'New variant', priceCents: 5000, inventory: 0, sku: 'SKU' }],
    }));
  }

  function removeVariant(idx: number) {
    setDraft((d) => ({ ...d, variants: d.variants.filter((_, i) => i !== idx) }));
  }

  async function save() {
    if (!draft.name.trim()) return toast.error('Name required');
    if (draft.variants.length === 0) return toast.error('At least one variant required');
    setBusy(true);
    try {
      const slug = slugify(draft.slug || draft.name);
      const id = isNew ? slug : draft.id;
      const base = Math.min(...draft.variants.map((v) => v.priceCents));
      const next: Product = { ...draft, id, slug, basePriceCents: base, updatedAt: Date.now() };
      await setDoc(doc(db, 'products', id), next, { merge: true });
      toast.success(isNew ? 'Product created' : 'Product saved');
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function destroy() {
    const ok = await confirm({
      title: 'Delete this product?',
      message: 'This removes the product from the catalog. Existing orders are not affected.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'products', draft.id));
      toast.success('Product deleted');
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-coal/60 backdrop-blur-sm grid place-items-stretch sm:place-items-center px-0 sm:px-4 py-0 sm:py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-bone-50 border border-line shadow-panel w-full max-w-3xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-bone-50 border-b border-line flex items-center justify-between px-6 h-16 z-10">
            <div>
              <p className="eyebrow">{isNew ? 'New product' : 'Edit product'}</p>
              <h2 className="font-display text-xl">{draft.name || 'Untitled'}</h2>
            </div>
            <button onClick={onClose} className="text-coal-mute hover:text-coal p-2" aria-label="Close"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Name">
                <input className="input-box" value={draft.name} onChange={(e) => patch('name', e.target.value)} />
              </Field>
              <Field label="Slug">
                <input className="input-box num" value={draft.slug} onChange={(e) => patch('slug', e.target.value)} />
              </Field>
              <Field label="Category">
                <select className="input-box" value={draft.category} onChange={(e) => patch('category', e.target.value as Category)}>
                  {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Active">
                <label className="inline-flex items-center gap-2 mt-3">
                  <input type="checkbox" checked={draft.active} onChange={(e) => patch('active', e.target.checked)} />
                  <span>Visible in catalog</span>
                </label>
              </Field>
            </div>
            <Field label="Short description">
              <input className="input-box" value={draft.shortDescription} onChange={(e) => patch('shortDescription', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className="input-box min-h-[120px]" value={draft.description} onChange={(e) => patch('description', e.target.value)} />
            </Field>
            <Field label="Image URLs (one per line)">
              <textarea
                className="input-box min-h-[80px] num text-xs"
                value={draft.images.join('\n')}
                onChange={(e) => patch('images', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow">Variants</p>
                <button onClick={addVariant} className="text-sm text-forest hover:text-forest-deep inline-flex items-center gap-1.5">
                  <Plus className="size-3.5" /> Add variant
                </button>
              </div>
              <div className="space-y-3">
                {draft.variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-12 gap-3 border border-line p-3 bg-bone-100 items-center">
                    <input className="input-box col-span-4" placeholder="Label" value={v.label} onChange={(e) => patchVariant(i, { label: e.target.value })} />
                    <input
                      className="input-box col-span-3 num"
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={(v.priceCents / 100).toFixed(2)}
                      onChange={(e) => patchVariant(i, { priceCents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                    />
                    <input
                      className="input-box col-span-2 num"
                      type="number"
                      placeholder="Inventory"
                      value={v.inventory}
                      onChange={(e) => patchVariant(i, { inventory: parseInt(e.target.value || '0', 10) })}
                    />
                    <input className="input-box col-span-2 num" placeholder="SKU" value={v.sku} onChange={(e) => patchVariant(i, { sku: e.target.value })} />
                    <button onClick={() => removeVariant(i)} className="col-span-1 text-coal-mute hover:text-clay" aria-label="Remove variant">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-bone-50 border-t border-line px-6 h-16 flex items-center justify-between">
            <div>
              {!isNew && (
                <button onClick={destroy} disabled={busy} className="btn-ghost text-clay hover:!bg-clay/10">
                  <Trash2 className="size-4" /> Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-ghost">Cancel</button>
              <button onClick={save} disabled={busy} className="btn-primary">{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-2">{label}</label>
      {children}
    </div>
  );
}
