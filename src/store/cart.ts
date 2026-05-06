import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '@/types';
import { shortId } from '@/lib/utils';

interface CartState {
  lines: CartLine[];
  add(line: Omit<CartLine, 'id'>): void;
  remove(id: string): void;
  setQuantity(id: string, qty: number): void;
  clear(): void;
  count(): number;
  subtotalCents(): number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add(line) {
        const lines = get().lines;
        // Merge by productId+variantId
        const existing = lines.find(
          (l) => l.productId === line.productId && l.variantId === line.variantId,
        );
        if (existing) {
          set({
            lines: lines.map((l) =>
              l.id === existing.id ? { ...l, quantity: l.quantity + line.quantity } : l,
            ),
          });
        } else {
          set({ lines: [...lines, { ...line, id: shortId() }] });
        }
      },
      remove(id) {
        set({ lines: get().lines.filter((l) => l.id !== id) });
      },
      setQuantity(id, qty) {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.id !== id) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.id === id ? { ...l, quantity: qty } : l)),
        });
      },
      clear() {
        set({ lines: [] });
      },
      count() {
        return get().lines.reduce((acc, l) => acc + l.quantity, 0);
      },
      subtotalCents() {
        return get().lines.reduce((acc, l) => acc + l.unitPriceCents * l.quantity, 0);
      },
    }),
    { name: 'shoppilot-cart' },
  ),
);
