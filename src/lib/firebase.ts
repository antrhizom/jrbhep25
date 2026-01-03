// Firebase Configuration und Initialisierung
// src/lib/firebase.ts

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase-Konfiguration - DEINE ECHTEN WERTE
const firebaseConfig = {
  apiKey: "AIzaSyA8a691g5Vu0iVkBW6_VUXm2JzWeyYtnw8",
  authDomain: "jrbhep25.firebaseapp.com",
  projectId: "jrbhep25",
  storageBucket: "jrbhep25.firebasestorage.app",
  messagingSenderId: "326352030158",
  appId: "1:326352030158:web:452de23b67ba7d38ee039f"
}

// Firebase nur initialisieren, wenn noch keine App existiert
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Firebase Services exportieren
export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
