// Fase 11 · «Documento»: el alumno escribe un documento con formato en el portal (sustituye a Google Docs).
// contenido: { plantilla: HTML de partida (opcional), palabrasMin, palabrasMax, imagenes: true|false }
import { registrarMotor } from '../elemento.js';
import { limpiarDoc } from '../doc-html.js';

export function validarDocumento(c, err) {
  const o = {};
  if (c.plantilla != null && typeof c.plantilla !== 'string') err('plantilla', '«plantilla» tiene que ser un texto (HTML sencillo: <h2>, <p>, <ul>, <table>…).');
  else o.plantilla = limpiarDoc(c.plantilla || '', { plantilla: true });
  for (const k of ['palabrasMin', 'palabrasMax']) {
    if (c[k] == null || c[k] === '') continue;
    const n = Number(c[k]); if (!Number.isInteger(n) || n < 1 || n > 20000) err(k, `«${k}» tiene que ser un número entero entre 1 y 20000.`); else o[k] = n;
  }
  if (o.palabrasMin && o.palabrasMax && o.palabrasMin > o.palabrasMax) err('palabrasMax', '«palabrasMax» no puede ser menor que «palabrasMin».');
  o.imagenes = c.imagenes !== false;
  return o;
}
registrarMotor('documento', {
  nombre: 'Documento', validar: validarDocumento, entregable: false, documento: true,
  resumen: (c) => `documento${c.plantilla ? ' con plantilla' : ''}${c.palabrasMin ? ` · mín. ${c.palabrasMin} palabras` : ''}`,
  ejemplo: {
    plantilla: '<h2>Introducción</h2><p>Explica de qué trata tu trabajo.</p><h2>Desarrollo</h2><p></p><h2>Conclusión</h2><p></p><h3>Fuentes</h3><ul><li></li></ul>',
    palabrasMin: 150, palabrasMax: 800, imagenes: true,
  },
});
