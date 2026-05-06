import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Package, ShoppingBag, LogOut } from 'lucide-react';

export default function Account() {
  const { profile, signOut } = useAuth();
  if (!profile) return null;

  return (
    <div className="container-edit py-12 md:py-20">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="display-lg mb-3">{profile.displayName || profile.email}</h1>
      <p className="text-coal-mute">{profile.email}</p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Tile to="/orders" icon={<Package className="size-5" />} title="Order history" sub="See every order, with status and items." />
        <Tile to="/cart" icon={<ShoppingBag className="size-5" />} title="Your cart" sub="Pick up where you left off." />
        {profile.isAdmin && (
          <Tile to="/admin" icon={<Package className="size-5" />} title="Studio admin" sub="Manage products and orders." />
        )}
      </div>

      <button onClick={() => signOut()} className="mt-10 inline-flex items-center gap-2 text-sm text-coal-mute hover:text-clay">
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}

function Tile({ to, icon, title, sub }: { to: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="card bg-bone-100 hover:border-forest transition-colors">
      <div className="size-10 grid place-items-center bg-forest/10 border border-forest/30 mb-4">{icon}</div>
      <p className="font-display text-2xl">{title}</p>
      <p className="text-sm text-coal-mute mt-2">{sub}</p>
    </Link>
  );
}
