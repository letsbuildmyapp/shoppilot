export type Role = 'customer' | 'admin';

export interface AccountProfile {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: number;
}

export type Category =
  | 'tableware'
  | 'vases'
  | 'mugs'
  | 'serving'
  | 'planters'
  | 'tea';

export interface Variant {
  id: string;
  label: string; // e.g. "Bone white", "12oz"
  priceCents: number;
  inventory: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  shortDescription: string;
  description: string;
  images: string[]; // full URLs
  variants: Variant[]; // at least one
  basePriceCents: number; // mirror of cheapest variant for filtering
  syncedFromShopify: boolean;
  syncedAt?: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CartLine {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantLabel: string;
  unitPriceCents: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fulfilling'
  | 'shipped'
  | 'delivered'
  | 'refunded'
  | 'cancelled';

export interface Order {
  id: string;
  number: string;
  ownerUid: string;
  ownerEmail: string;
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  shippingAddress?: {
    name: string;
    line1: string;
    city: string;
    region: string;
    postal: string;
    country: string;
  };
  stripeSessionId?: string;
  createdAt: number;
  updatedAt: number;
}
