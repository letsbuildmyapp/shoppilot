/**
 * ShopPilot Cloud Functions
 *
 * createCheckoutSession makes a REAL Stripe Checkout call when STRIPE_SECRET_KEY
 * is present in the function environment. When it is absent (default in
 * emulator / demo), it returns a deterministic fixture so the demo UX still
 * completes end-to-end. This intentionally differs from the OrderPilot stub —
 * here, the Stripe SDK is wired and exercised the moment a real key is set.
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";

initializeApp();
const db = getFirestore();

interface CheckoutLine {
  productName: string;
  variantLabel: string;
  unitPriceCents: number;
  quantity: number;
  productImage?: string;
}

interface CreateCheckoutInput {
  lines: CheckoutLine[];
  successUrl: string;
  cancelUrl: string;
  orderId: string;
}

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion }) : null;

export const createCheckoutSession = onCall<CreateCheckoutInput>(async (req) => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Sign in required");
  const { lines, successUrl, cancelUrl, orderId } = req.data;
  if (!lines?.length) throw new HttpsError("invalid-argument", "No line items");

  if (stripe) {
    // REAL Stripe call — test mode if STRIPE_SECRET_KEY starts with sk_test_
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "usd",
          unit_amount: l.unitPriceCents,
          product_data: {
            name: `${l.productName} — ${l.variantLabel}`,
            images: l.productImage ? [l.productImage] : undefined,
          },
        },
      })),
      success_url: `${successUrl}?session={CHECKOUT_SESSION_ID}&order=${encodeURIComponent(orderId)}`,
      cancel_url: cancelUrl,
      metadata: { orderId },
    });
    await db.collection("orders").doc(orderId).set(
      { stripeSessionId: session.id, updatedAt: Date.now() },
      { merge: true },
    );
    return { sessionId: session.id, url: session.url };
  }

  // No Stripe key configured — deterministic fixture URL the client routes to /order/success.
  const fakeSessionId = "cs_demo_" + Math.random().toString(36).slice(2);
  await db.collection("orders").doc(orderId).set(
    { stripeSessionId: fakeSessionId, status: "paid", updatedAt: Date.now() },
    { merge: true },
  );
  const url = `${successUrl}?session=${fakeSessionId}&order=${encodeURIComponent(orderId)}&demo=1`;
  return { sessionId: fakeSessionId, url };
});

export const onOrderCreated = onDocumentCreated("orders/{id}", async (event) => {
  const data = event.data?.data();
  if (!data) return;
  console.log("[shoppilot] new order", event.params.id, data.totalCents);
  // In production: send confirmation email via Resend.
});
