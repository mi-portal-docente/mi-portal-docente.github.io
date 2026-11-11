/* Configuración de Firebase del portal docente.
   Estos datos NO son secretos (van en toda web que usa Firebase): la seguridad la dan las
   reglas de Firestore, que se despliegan aparte.
   Mientras apiKey o projectId estén vacíos, la web sigue pidiendo el «código de clase» de siempre. */
window.PORTAL_FIREBASE = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};
