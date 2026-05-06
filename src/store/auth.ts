import { create } from 'zustand';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AccountProfile } from '@/types';

interface AuthState {
  user: User | null;
  profile: AccountProfile | null;
  loading: boolean;
  init(): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signInGoogle(): Promise<void>;
  signOut(): Promise<void>;
}

const ADMIN_EMAILS = new Set(['admin@shoppilot.test']);

async function loadOrCreateProfile(user: User): Promise<AccountProfile> {
  const ref = doc(db, 'accounts', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as AccountProfile;

  const profile: AccountProfile = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? undefined,
    isAdmin: !!user.email && ADMIN_EMAILS.has(user.email),
    createdAt: Date.now(),
  };
  await setDoc(ref, profile);
  return profile;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  init() {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ user: null, profile: null, loading: false });
        return;
      }
      const profile = await loadOrCreateProfile(user);
      set({ user, profile, loading: false });
    });
    return unsub;
  },
  async signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  },
  async signUp(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
  },
  async signInGoogle() {
    await signInWithPopup(auth, googleProvider);
  },
  async signOut() {
    await signOut(auth);
  },
}));

export function role(profile: AccountProfile | null): 'admin' | 'customer' {
  return profile?.isAdmin ? 'admin' : 'customer';
}
