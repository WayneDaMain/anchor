import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyArA1iZkS4bs3oAasNTV1hoG_uZS67aGCg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'anchor.biblescriptura.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anchor-b8fe6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'anchor-b8fe6.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '470806621484',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:470806621484:web:101dd0646bb649de3a1089',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-WKSWV4C31K',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

