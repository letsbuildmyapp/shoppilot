import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ShoppingBag, Package, Boxes, Home, Info, LogOut, User as UserIcon } from 'lucide-react';
import { SEED_PRODUCTS, CATEGORY_LABEL } from '@/seed/products';
import { useAuth } from '@/store/auth';

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const nav = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (path: string) => {
    onOpenChange(false);
    nav(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-coal/60 backdrop-blur-sm grid place-items-start pt-[12vh] px-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="w-full max-w-xl bg-bone-50 border border-line shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Search" className="font-sans">
              <div className="flex items-center gap-3 px-5 h-14 border-b border-line">
                <Search className="size-4 text-coal-mute" />
                <Command.Input
                  autoFocus
                  placeholder="Search products, pages…"
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-coal-mute"
                />
                <kbd className="kbd">Esc</kbd>
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="p-8 text-center text-sm text-coal-mute">No results.</Command.Empty>

                <Command.Group heading="Pages" className="text-xs uppercase tracking-[0.18em] text-coal-mute px-3 py-2">
                  <Item onSelect={() => go('/')} icon={<Home size={15} />} label="Home" />
                  <Item onSelect={() => go('/shop')} icon={<Boxes size={15} />} label="Shop everything" />
                  <Item onSelect={() => go('/about')} icon={<Info size={15} />} label="About the studio" />
                  {user && <Item onSelect={() => go('/account')} icon={<UserIcon size={15} />} label="Account" />}
                  {user && <Item onSelect={() => go('/orders')} icon={<Package size={15} />} label="Order history" />}
                  {profile?.isAdmin && <Item onSelect={() => go('/admin')} icon={<Boxes size={15} />} label="Admin · Products" />}
                  {profile?.isAdmin && <Item onSelect={() => go('/admin/orders')} icon={<Package size={15} />} label="Admin · Orders" />}
                  <Item onSelect={() => go('/cart')} icon={<ShoppingBag size={15} />} label="Cart" />
                  {user && (
                    <Item
                      onSelect={async () => { onOpenChange(false); await signOut(); nav('/'); }}
                      icon={<LogOut size={15} />}
                      label="Sign out"
                    />
                  )}
                </Command.Group>

                <Command.Group heading="Categories" className="text-xs uppercase tracking-[0.18em] text-coal-mute px-3 py-2">
                  {Object.entries(CATEGORY_LABEL).map(([slug, label]) => (
                    <Item key={slug} onSelect={() => go(`/shop?category=${slug}`)} icon={<Boxes size={15} />} label={label} />
                  ))}
                </Command.Group>

                <Command.Group heading="Products" className="text-xs uppercase tracking-[0.18em] text-coal-mute px-3 py-2">
                  {SEED_PRODUCTS.map((p) => (
                    <Item
                      key={p.id}
                      onSelect={() => go(`/p/${p.slug}`)}
                      icon={<img src={p.images[0]} alt="" className="size-6 object-cover" />}
                      label={p.name}
                      hint={CATEGORY_LABEL[p.category]}
                    />
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({ onSelect, icon, label, hint }: { onSelect: () => void; icon: React.ReactNode; label: string; hint?: string }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 h-10 text-sm cursor-pointer aria-selected:bg-bone-200 hover:bg-bone-100"
    >
      <span className="flex items-center justify-center w-6 h-6 text-coal-mute">{icon}</span>
      <span className="flex-1 text-coal">{label}</span>
      {hint && <span className="text-xs text-coal-mute">{hint}</span>}
    </Command.Item>
  );
}
