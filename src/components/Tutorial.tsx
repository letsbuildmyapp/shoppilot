import { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ArrowRight, ArrowLeft, X, Sparkles, ShoppingBag, LayoutGrid, RefreshCcw, Boxes, Package, UserCircle } from 'lucide-react';
import { useAuth, role } from '@/store/auth';

const TUTORIAL_KEY_PREFIX = 'shoppilot:tutorial_seen:';
const MOBILE_BREAKPOINT = 768;

type Step = {
  icon: React.ComponentType<any>;
  title: string;
  body: React.ReactNode;
  target?: string;
  placement?: 'right' | 'left' | 'top' | 'bottom';
};

const CUSTOMER_STEPS: Step[] = [
  {
    icon: Sparkles,
    title: 'Welcome to Kiln Ridge',
    body: 'A small-batch ceramics studio storefront. Take half a minute to find your way around — every step is real, end-to-end.',
  },
  {
    icon: LayoutGrid,
    title: 'Browse the catalog',
    body: 'Filter by category, price, or search. Each piece links to a full detail view with multiple photos and variants.',
    target: 'nav',
    placement: 'bottom',
  },
  {
    icon: Search,
    title: 'Search anywhere with ⌘K',
    body: (
      <>
        Hit <span className="kbd">⌘</span> <span className="kbd">K</span> from any screen to jump to a product or page.
      </>
    ),
    target: 'search',
    placement: 'bottom',
  },
  {
    icon: ShoppingBag,
    title: 'Cart and checkout',
    body: 'Add to cart, review, and check out via Stripe (test mode). When a Stripe key is set the SDK is called for real; without one the demo completes via a fixture.',
    target: 'cart',
    placement: 'bottom',
  },
  {
    icon: UserCircle,
    title: 'Your orders live here',
    body: 'Order history, status, and tracking — all under your account.',
    target: 'account',
    placement: 'bottom',
  },
  {
    icon: Sparkles,
    title: "You're set.",
    body: (
      <>
        Try ordering a mug — the seed customer already has a few past orders to look through. Built by{' '}
        <a href="https://letsbuildmyapp.com" className="text-forest underline">letsbuildmyapp.com</a>.
      </>
    ),
  },
];

const ADMIN_STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welcome, studio owner",
    body: "The admin workspace lives behind one menu item. Quick orientation before you dig in.",
  },
  {
    icon: Boxes,
    title: 'Products',
    body: 'Edit the catalog, manage variants, set inventory, archive items.',
    target: 'admin-products',
    placement: 'right',
  },
  {
    icon: Package,
    title: 'Orders',
    body: 'Every order, with status and a quick way to advance through fulfillment.',
    target: 'admin-orders',
    placement: 'right',
  },
  {
    icon: RefreshCcw,
    title: 'Sync from Shopify',
    body: 'In production this pulls product changes from Shopify. The demo shows the UX with a one-click mock sync that updates the "synced" badges.',
    target: 'admin-sync',
    placement: 'left',
  },
];

type Rect = { top: number; left: number; width: number; height: number };

export function Tutorial() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < MOBILE_BREAKPOINT,
  );

  const r = role(profile);
  const STEPS = useMemo<Step[]>(() => (r === 'admin' ? ADMIN_STEPS : CUSTOMER_STEPS), [r]);

  useEffect(() => { setStep(0); }, [STEPS]);

  useEffect(() => {
    if (!user) { setOpen(false); return; }
    const seen = localStorage.getItem(TUTORIAL_KEY_PREFIX + r);
    setOpen(!seen);
    setStep(0);
  }, [user, r]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY_PREFIX + r, '1');
    setOpen(false);
  }, [r]);

  const next = useCallback(() => {
    setStep((s) => {
      if (s < STEPS.length - 1) return s + 1;
      close();
      return s;
    });
  }, [close, STEPS.length]);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, next, back]);

  const currentStep = STEPS[step];
  const targetSel = currentStep.target;

  useLayoutEffect(() => {
    if (!open || isMobile || !targetSel) {
      setRect(null);
      return;
    }
    const compute = () => {
      const el = document.querySelector(`[data-tour="${targetSel}"]`) as HTMLElement | null;
      if (!el) { setRect(null); return; }
      const rr = el.getBoundingClientRect();
      setRect({ top: rr.top, left: rr.left, width: rr.width, height: rr.height });
    };
    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open, isMobile, targetSel, step]);

  if (!open) return null;

  const hasTarget = !!rect && !!targetSel;
  if (isMobile || !hasTarget) {
    return <CenteredModal steps={STEPS} step={step} onClose={close} onNext={next} onBack={back} onJump={setStep} dim />;
  }

  const Icon = currentStep.icon;
  const isLast = step === STEPS.length - 1;

  const PAD = 16;
  const TOOLTIP_W = 380;
  const TOOLTIP_H_EST = 320;
  let top = 0;
  let left = 0;
  if (rect) {
    const placement = currentStep.placement ?? 'bottom';
    if (placement === 'right') {
      left = rect.left + rect.width + PAD;
      top = rect.top;
      if (left + TOOLTIP_W > window.innerWidth - PAD) {
        left = rect.left;
        top = rect.top + rect.height + PAD;
      }
    } else if (placement === 'left') {
      left = rect.left - TOOLTIP_W - PAD;
      top = rect.top;
    } else if (placement === 'bottom') {
      left = rect.left;
      top = rect.top + rect.height + PAD;
    } else {
      left = rect.left;
      top = rect.top - TOOLTIP_H_EST - PAD;
    }
    left = Math.min(Math.max(PAD, left), window.innerWidth - TOOLTIP_W - PAD);
    top = Math.min(Math.max(PAD, top), window.innerHeight - TOOLTIP_H_EST - PAD);
  }
  const tipStyle: React.CSSProperties = { top, left };

  return (
    <AnimatePresence>
      <motion.div
        key="spot-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
        onClick={close}
      >
        {hasTarget && rect ? (
          <motion.div
            initial={false}
            animate={{
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
            }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="absolute pointer-events-none"
            style={{
              boxShadow: '0 0 0 9999px rgba(20,28,22,0.72), 0 0 0 2px oklch(48% 0.075 155)',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-coal/72" />
        )}
      </motion.div>

      <motion.div
        key={`tip-${step}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        className="fixed z-[101] w-[380px] border border-line bg-bone-50 shadow-panel"
        style={tipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-12 border-b border-line">
          <span className="eyebrow">
            Tour · <span className="num">{step + 1}</span> of <span className="num">{STEPS.length}</span>
          </span>
          <button onClick={close} className="text-coal-mute hover:text-coal p-1.5" aria-label="Close tour">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="h-10 w-10 bg-forest/10 border border-forest/30 grid place-items-center mb-4">
            <Icon size={18} className="text-forest" />
          </div>
          <h2 id="tutorial-title" className="font-display text-2xl">{currentStep.title}</h2>
          <div className="text-sm text-coal-soft mt-2 leading-relaxed">{currentStep.body}</div>
        </div>
        <div className="flex items-center justify-between px-4 h-14 border-t border-line bg-bone-100">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={
                  i === step
                    ? 'h-1.5 w-5 bg-forest transition-all'
                    : 'h-1.5 w-1.5 bg-line hover:bg-coal-mute transition-all'
                }
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 ? (
              <button onClick={back} className="inline-flex items-center gap-1.5 h-9 px-3 text-xs text-coal-mute hover:text-coal hover:bg-bone-200 transition-colors">
                <ArrowLeft size={13} /> Back
              </button>
            ) : (
              <button onClick={close} className="inline-flex items-center h-9 px-3 text-xs text-coal-mute hover:text-coal transition-colors">
                Skip
              </button>
            )}
            <button onClick={next} className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-medium bg-forest hover:bg-forest-deep text-bone-50 transition-colors">
              {isLast ? 'Done' : 'Next'} {!isLast ? <ArrowRight size={13} /> : null}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CenteredModal({
  steps, step, onClose, onNext, onBack, onJump,
}: {
  steps: Step[]; step: number; onClose: () => void; onNext: () => void; onBack: () => void; onJump: (i: number) => void; dim?: boolean;
}) {
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;
  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] grid place-items-center px-4 py-8 bg-coal/72 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-md border border-line bg-bone-50 shadow-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 h-12 border-b border-line">
            <span className="eyebrow">Tour · <span className="num">{step + 1}</span> of <span className="num">{steps.length}</span></span>
            <button onClick={onClose} className="text-coal-mute hover:text-coal p-1.5" aria-label="Close tour"><X size={16} /></button>
          </div>
          <div className="p-7">
            <div className="h-12 w-12 bg-forest/10 border border-forest/30 grid place-items-center mb-5">
              <Icon size={20} className="text-forest" />
            </div>
            <h2 className="font-display text-3xl leading-[1.1]">{current.title}</h2>
            <div className="text-base text-coal-soft mt-4 leading-relaxed">{current.body}</div>
          </div>
          <div className="flex items-center justify-between px-4 h-16 border-t border-line bg-bone-100">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onJump(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={i === step ? 'h-1.5 w-6 bg-forest transition-all' : 'h-1.5 w-1.5 bg-line hover:bg-coal-mute transition-all'}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button onClick={onBack} className="inline-flex items-center gap-1.5 h-10 px-3 text-sm text-coal-mute hover:text-coal hover:bg-bone-200 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <button onClick={onClose} className="inline-flex items-center h-10 px-3 text-sm text-coal-mute hover:text-coal transition-colors">Skip</button>
              )}
              <button onClick={onNext} className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-medium bg-forest hover:bg-forest-deep text-bone-50 transition-colors">
                {isLast ? 'Done' : 'Next'} {!isLast ? <ArrowRight size={14} /> : null}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
