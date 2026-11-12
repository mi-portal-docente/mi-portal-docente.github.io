// Inicialización de Firebase (SDK modular empaquetado con la web: sin CDN).
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator, setLogLevel } from 'firebase/firestore';

export function iniciarFirebase(cfg) {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  auth.languageCode = 'es';
  const db = initializeFirestore(app, {});
  setLogLevel('silent');
  // Emuladores locales: solo para pruebas y solo con proyectos «demo-…» (nunca en el proyecto real).
  const emu = window.PORTAL_FIREBASE_EMU;
  if (emu && /^demo-/.test(cfg.projectId)) {
    connectAuthEmulator(auth, emu.auth, { disableWarnings: true });
    connectFirestoreEmulator(db, emu.firestoreHost, emu.firestorePort);
  }
  return { app, auth, db };
}
