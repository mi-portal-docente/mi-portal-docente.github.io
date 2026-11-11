/* Control de acceso con la Hoja de Google (Apps Script).
   ENDPOINT: pega entre las comillas la URL de la aplicación web de Apps Script
   (empieza por https://script.google.com/macros/s/ y termina en /exec).
   Mientras esté vacío, la web sigue pidiendo el «código de clase» antiguo
   (js/acceso-config.js). */
window.PORTAL_CONFIG = {
  ENDPOINT: '',
  LATIDO_SEGUNDOS: 60
};
