import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';

export function Layout() {
  const [openSearch, setOpenSearch] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenSearch((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <div className="min-h-full flex flex-col">
      <Header onSearch={() => setOpenSearch(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette open={openSearch} onOpenChange={setOpenSearch} />
    </div>
  );
}
