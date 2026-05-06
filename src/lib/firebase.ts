import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// Public config — Firebase web keys are not secrets, but real client secrets stay in functions env.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY ?? 'demo-api-key',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN ?? 'demo-shoppilot.firebaseapp.com',
  projectId: import.meta.env.VITE_FB_PROJECT_ID ?? 'demo-shoppilot',
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET ?? 'demo-shoppilot.appspot.com',
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID ?? '0',
  appId: import.meta.env.VITE_FB_APP_ID ?? 'demo',
};

const useEmulator = import.meta.env.VITE_USE_EMULATOR !== 'false';

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const functions: Functions = getFunctions(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

let connected = false;
if (useEmulator && !connected && typeof window !== 'undefined') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connected = true;
    // eslint-disable-next-line no-console
    console.info('[ShopPilot] Connected to Firebase emulators');
  } catch (e) {
    console.warn('[ShopPilot] Could not connect to emulators', e);
  }
}
