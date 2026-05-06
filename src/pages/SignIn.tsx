import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const TILES = [
  {
    title: 'Customer',
    email: 'customer@shoppilot.test',
    sub: 'Browse, order, history',
  },
  {
    title: 'Studio admin',
    email: 'admin@shoppilot.test',
    sub: 'Products, orders, sync',
  },
];

export default function SignIn() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('customer@shoppilot.test');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp, signInGoogle } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === 'signin') await signIn(email, password);
      else await signUp(email, password);
      toast.success(tab === 'signin' ? 'Welcome back' : 'Account created');
      nav(next);
    } catch (err: any) {
      toast.error(err.code || err.message || 'Auth failed');
    } finally {
      setBusy(false);
    }
  }

  async function quickSignIn(em: string) {
    setBusy(true);
    try {
      await signIn(em, 'demo1234');
      toast.success('Signed in as ' + em.split('@')[0]);
      nav(next);
    } catch (err: any) {
      toast.error(err.code || 'Demo sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      await signInGoogle();
      nav(next);
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-edit py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: editorial */}
        <div className="lg:pr-12">
          <p className="eyebrow mb-4">Account</p>
          <h1 className="display-lg leading-[1.05]">Sign in to your studio account.</h1>
          <p className="text-coal-soft mt-6 max-w-[48ch] text-lg leading-relaxed">
            Track orders, save favorites, get early access to new firings.
          </p>

          <div className="mt-12">
            <p className="eyebrow mb-4">Try a demo account</p>
            <div className="grid grid-cols-1 gap-3">
              {TILES.map((t) => (
                <button
                  key={t.email}
                  onClick={() => quickSignIn(t.email)}
                  disabled={busy}
                  className="group flex items-center justify-between text-left border border-line hover:border-forest p-5 transition-colors bg-bone-50"
                >
                  <div>
                    <p className="font-display text-2xl">{t.title}</p>
                    <p className="text-sm text-coal-mute mt-1">{t.sub} · <code className="num">{t.email}</code></p>
                  </div>
                  <ArrowRight className="size-5 text-coal-mute group-hover:text-forest transition-colors" />
                </button>
              ))}
            </div>
            <p className="text-xs text-coal-mute mt-4">Password for both: <code>demo1234</code></p>
          </div>
        </div>

        {/* Right: form */}
        <div className="border-l border-line pl-12 hidden lg:block" />
        <div className="lg:-ml-[calc(50%-1px)] max-w-md w-full lg:pt-2">
          <div className="flex gap-1 mb-8 border-b border-line">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm border-b-2 -mb-px ${
                  tab === t ? 'border-forest text-forest' : 'border-transparent text-coal-mute hover:text-coal'
                }`}
              >
                {t === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="eyebrow block mb-2">Email</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="eyebrow block mb-2">Password</label>
              <input type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button disabled={busy} type="submit" className="btn-primary w-full">
              {busy ? 'Working…' : tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-coal-mute">
            <div className="rule flex-1" /> or <div className="rule flex-1" />
          </div>
          <button onClick={handleGoogle} disabled={busy} className="btn-outline w-full">
            Continue with Google
          </button>

          <div className="mt-10">
            <Link to="/" className="text-sm text-coal-mute hover:text-forest">← Back home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
