/* Configuración de acceso del portal.
   No pongas códigos en claro aquí. Para cambiarlos, desde la carpeta tools:
     node set-codigo.mjs "palabra-palabra-00" ["otro-codigo-12"]
   Al cambiar el conjunto de códigos se sube "version" y los navegadores
   que ya habían entrado tendrán que volver a introducir un código. */
window.PORTAL_ACCESO = {
  "version": 1,
  "salt": "72b4b697119e7813c782163fdb791b62",
  "hashes": [
    "322b55c08935d437861c0add694556c5c7f6be211d9af9d5da241a8db412da7e"
  ]
};
