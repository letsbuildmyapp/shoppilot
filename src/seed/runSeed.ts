import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AccountProfile, Order, OrderStatus } from '@/types';
import { SEED_PRODUCTS } from './products';
import { shortId } from '@/lib/utils';

const SEED_FLAG = 'shoppilot_seed_v1';

const SEED_USERS: Array<{ email: string; password: string; isAdmin: boolean; displayName: string }> = [
  { email: 'customer@shoppilot.test', password: 'demo1234', isAdmin: false, displayName: 'Mira Holloway' },
  { email: 'admin@shoppilot.test', password: 'demo1234', isAdmin: true, displayName: 'Kiln Ridge Studio' },
];

async function ensureUser(u: typeof SEED_USERS[number]) {
  let uid: string | null = null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
    uid = cred.user.uid;
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, u.email, u.password);
      uid = cred.user.uid;
    } else {
      throw e;
    }
  }
  if (!uid) return null;

  const ref = doc(db, 'accounts', uid);
  const snap = await getDoc(ref);
  const profile: AccountProfile = snap.exists()
    ? { ...(snap.data() as AccountProfile), isAdmin: u.isAdmin, displayName: u.displayName }
    : {
        uid,
        email: u.email,
        displayName: u.displayName,
        isAdmin: u.isAdmin,
        createdAt: Date.now(),
      };
  await setDoc(ref, profile);
  return uid;
}

async function seedProducts() {
  // Run while signed in as admin so security rules pass.
  for (const p of SEED_PRODUCTS) {
    await setDoc(doc(db, 'products', p.id), p, { merge: true });
  }
}

async function seedOrders(customerUid: string, customerEmail: string) {
  const statuses: OrderStatus[] = ['paid', 'fulfilling', 'shipped', 'delivered', 'pending', 'shipped', 'delivered'];
  const productPicks: Array<{ pid: string; vid: string; qty: number }[]> = [
    [{ pid: 'haystack-mug', vid: 'haystack-oat', qty: 2 }],
    [{ pid: 'tide-bowl', vid: 'tide-9', qty: 1 }, { pid: 'spoonful-bowl', vid: 'spoon-bone', qty: 1 }],
    [{ pid: 'nocturne-vase', vid: 'nocturne-std', qty: 1 }],
    [{ pid: 'field-dinner-plate', vid: 'field-bone', qty: 4 }, { pid: 'oat-side-plate', vid: 'oat-bone', qty: 1 }],
    [{ pid: 'cabin-mug', vid: 'cabin-iron', qty: 1 }],
    [{ pid: 'kettle-teapot', vid: 'kettle-std', qty: 1 }, { pid: 'thicket-tea-cup', vid: 'thicket-pair', qty: 2 }],
    [{ pid: 'meadow-planter', vid: 'meadow-bone', qty: 1 }],
  ];

  for (let i = 0; i < statuses.length; i++) {
    const id = `seed-${i}-${customerUid.slice(0, 6)}`;
    const status = statuses[i];
    const lines = productPicks[i].map((pp) => {
      const product = SEED_PRODUCTS.find((p) => p.id === pp.pid)!;
      const variant = product.variants.find((v) => v.id === pp.vid)!;
      return {
        id: shortId(),
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        productImage: product.images[0],
        variantId: variant.id,
        variantLabel: variant.label,
        unitPriceCents: variant.priceCents,
        quantity: pp.qty,
      };
    });
    const subtotalCents = lines.reduce((a, l) => a + l.unitPriceCents * l.quantity, 0);
    const shippingCents = subtotalCents > 15000 ? 0 : 1200;
    const taxCents = Math.round(subtotalCents * 0.07);
    const totalCents = subtotalCents + shippingCents + taxCents;
    const createdAt = Date.now() - 86400000 * (i + 1) * 3;
    const order: Order = {
      id,
      number: `KR-${(1000 + i).toString()}`,
      ownerUid: customerUid,
      ownerEmail: customerEmail,
      lines,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      status,
      shippingAddress: {
        name: 'Mira Holloway',
        line1: '218 Lupine Lane',
        city: 'Brattleboro',
        region: 'VT',
        postal: '05301',
        country: 'US',
      },
      createdAt,
      updatedAt: createdAt + 86400000,
    };
    await setDoc(doc(db, 'orders', id), order, { merge: true });
  }
}

export async function ensureSeed() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEED_FLAG) === 'done') return;

  const useEmulator =
    import.meta.env.VITE_USE_EMULATOR !== 'false' &&
    (import.meta.env.DEV || !import.meta.env.VITE_FB_API_KEY);
  if (!useEmulator) {
    localStorage.setItem(SEED_FLAG, 'done');
    return;
  }

  console.log('[shoppilot] seeding emulator…');
  try {
    let customerUid = '';
    let customerEmail = '';
    let adminUid = '';
    for (const u of SEED_USERS) {
      const uid = await ensureUser(u);
      if (!uid) continue;
      if (u.isAdmin) adminUid = uid;
      else { customerUid = uid; customerEmail = u.email; }
    }
    // Sign in as admin to seed products under admin write rules.
    await signInWithEmailAndPassword(auth, 'admin@shoppilot.test', 'demo1234');
    await seedProducts();
    // Sign in as customer to seed their orders.
    await signInWithEmailAndPassword(auth, 'customer@shoppilot.test', 'demo1234');
    await seedOrders(customerUid, customerEmail);

    await signOut(auth).catch(() => {});
    localStorage.setItem(SEED_FLAG, 'done');
    console.log('[shoppilot] seed complete', { adminUid, customerUid });
  } catch (e) {
    console.warn('[shoppilot] seed error', e);
  }
}
