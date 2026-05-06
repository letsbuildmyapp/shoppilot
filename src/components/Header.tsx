import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { ShoppingBag, User as UserIcon, Search } from 'lucide-react';

export function Header({ onSearch }: { onSearch?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const cartCount = useCart((s) => s.lines.reduce((a, l) => a + l.quantity, 0));

  return (
    <header className="border-b border-line bg-bone-50 sticky top-0 z-30">
      <div className="container-edit flex items-center justify-between h-20">
        <Link to="/" data-tour="brand" className="font-display text-2xl tracking-tight">
          Kiln <span className="text-forest">Ridge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm" data-tour="nav">
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-forest' : 'hover:text-forest'}>Shop</NavLink>
          <NavLink to="/shop?category=tableware" className={() => 'hover:text-forest'}>Tableware</NavLink>
          <NavLink to="/shop?category=mugs" className={() => 'hover:text-forest'}>Mugs</NavLink>
          <NavLink to="/shop?category=vases" className={() => 'hover:text-forest'}>Vases</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-forest' : 'hover:text-forest'}>Studio</NavLink>
          {profile?.isAdmin && (
            <NavLink to="/admin" data-tour="nav-admin" className={({ isActive }) => isActive ? 'text-forest' : 'hover:text-forest'}>Admin</NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            data-tour="search"
            aria-label="Search"
            className="hidden sm:inline-flex items-center gap-2 px-3 h-10 text-sm text-coal-mute hover:text-coal hover:bg-bone-100 transition-colors"
          >
            <Search className="size-4" />
            <span className="hidden lg:inline">Search</span>
            <span className="hidden lg:inline-flex items-center gap-1 ml-2 text-coal-mute">
              <kbd className="kbd">⌘</kbd><kbd className="kbd">K</kbd>
            </span>
          </button>
          <Link to="/cart" data-tour="cart" className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] hover:text-forest" aria-label="Cart">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-forest text-bone-50 text-[10px] num min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center font-semibold leading-none">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account" data-tour="account" className="hidden sm:inline-flex items-center gap-2 px-3 h-10 text-sm hover:text-forest">
                <UserIcon className="size-4" />
                <span className="hidden md:inline">{profile?.displayName || profile?.email?.split('@')[0]}</span>
              </Link>
              <button onClick={() => signOut()} className="hidden sm:inline-flex items-center h-10 px-3 text-sm text-coal-mute hover:text-forest">Sign out</button>
            </div>
          ) : (
            <Link to="/signin" className="btn-outline !py-2.5 !px-5 text-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
