# ShopPilot — Kiln Ridge

E-commerce / Shopify-connected storefront portfolio app for letsbuildmyapp.com.

**Niche:** small-batch artisan ceramics — Kiln Ridge Studio (Brattleboro, VT).

## Visual archetype

Editorial commerce. Warm off-white background, deep forest-green primary, sage secondary, charcoal text. Cardo + Cormorant Garamond display, Geist body. `rounded-none` only. Magazine-quality whitespace.

## Stack

React 18 + TS + Vite, Tailwind, React Router v6, TanStack Query, Zustand, react-hook-form + zod, Framer Motion, lucide-react, sonner, cmdk. Firebase (Auth, Firestore, Storage, Functions TS, Hosting). Stripe Checkout (real call when `STRIPE_SECRET_KEY` set, fixture fallback otherwise).

## Run locally

```bash
npm install
cd functions && npm install && npm run build && cd ..
firebase emulators:start --project demo-shoppilot --only auth,firestore,functions,storage
# in another tab
npm run dev
```

The Vite app runs on `http://localhost:5173`. Firebase emulator hosting port is `5050`.

## Demo accounts (seeded)

- `customer@shoppilot.test` — Mira Holloway, customer with 7 sample orders
- `admin@shoppilot.test` — Kiln Ridge Studio, admin

Password for both: `demo1234`

## Stripe wiring

Checkout calls `createCheckoutSession` (Cloud Function). When `STRIPE_SECRET_KEY` is set in the function env, the function makes a **real** `stripe.checkout.sessions.create` call and returns the live Stripe URL. Without a key, the function returns a fixture redirect to `/order/success?demo=1` so the demo always completes.

```bash
firebase functions:config:set stripe.key="sk_test_..."   # production
# or for emulator:
STRIPE_SECRET_KEY=sk_test_... firebase emulators:start --project demo-shoppilot
```

## Tour

- Customer: 6 steps (welcome, browse, ⌘K, cart/checkout, orders, done)
- Admin: 4 steps (welcome, products, orders, sync from Shopify)

Storage key: `shoppilot:tutorial_seen:<role>`.
