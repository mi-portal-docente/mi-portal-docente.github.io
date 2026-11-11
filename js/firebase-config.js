/* Configuración de Firebase del portal docente.
   Estos datos NO son secretos (van en toda web que usa Firebase): la seguridad la dan las
   reglas de Firestore, que se despliegan aparte.
   Mientras apiKey o projectId estén vacíos, la web sigue pidiendo el «código de clase» de siempre. */
window.PORTAL_FIREBASE = {
  apiKey: 'AIzaSyCTgxt2zKpH_4Gfq98b47FMTI_jlm4SAeU',
  authDomain: 'portal-docente-eu.firebaseapp.com',
  projectId: 'portal-docente-eu',
  storageBucket: 'portal-docente-eu.firebasestorage.app',
  messagingSenderId: '566720934854',
  appId: '1:566720934854:web:c94f98c31721bd5bf7f8c7'
};
