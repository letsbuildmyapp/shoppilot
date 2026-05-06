import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ConfirmOpts {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type Resolver = (value: boolean) => void;

const Ctx = createContext<{ confirm: (opts: ConfirmOpts) => Promise<boolean> } | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOpts | null>(null);
  const [resolver, setResolver] = useState<Resolver | null>(null);

  const confirm = useCallback((o: ConfirmOpts) => {
    return new Promise<boolean>((resolve) => {
      setOpts(o);
      setResolver(() => resolve);
    });
  }, []);

  const close = useCallback(
    (val: boolean) => {
      resolver?.(val);
      setOpts(null);
      setResolver(null);
    },
    [resolver],
  );

  useEffect(() => {
    if (!opts) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
      else if (e.key === 'Enter') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [opts, close]);

  return (
    <Ctx.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {opts && (
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-coal/60 backdrop-blur-sm grid place-items-center px-4"
            onClick={() => close(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="bg-bone-50 border border-line shadow-panel max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="p-7">
                <h2 className="font-display text-2xl">{opts.title}</h2>
                {opts.message && <p className="mt-3 text-coal-soft">{opts.message}</p>}
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-line bg-bone-100">
                <button onClick={() => close(false)} className="btn-ghost">{opts.cancelLabel ?? 'Cancel'}</button>
                <button
                  onClick={() => close(true)}
                  className={opts.destructive ? 'btn bg-clay text-bone-50 hover:bg-clay/90' : 'btn-primary'}
                >
                  {opts.confirmLabel ?? 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function useConfirm() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useConfirm must be used inside ConfirmProvider');
  return v.confirm;
}
