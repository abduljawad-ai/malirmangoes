import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if we have the config
const app = !getApps().length && firebaseConfig.projectId ? initializeApp(firebaseConfig) : getApp();

let firestoreDb = null;
if (app) {
  try {
    // Force long polling to avoid GRPC errors in Next.js Server Components
    firestoreDb = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch (e) {
    // Fallback if already initialized
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;
