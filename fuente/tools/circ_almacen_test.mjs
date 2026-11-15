// Pruebas: el avance de las prácticas guiadas es de cada identidad (profesor / nº de lista) y la migración no pierde datos.
import { lsKey, migrarLegado } from './src/circ/almacen.js';
let ok = 0, fallos = 0; const t = (n, c) => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n); } };
const mem = () => { const m = new Map(); return { get length() { return m.size; }, key: (i) => [...m.keys()][i], getItem: (k) => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }; };
t('Profesor y alumno usan claves distintas', lsKey('done:c1', 'p') !== lsKey('done:c1', 'a123'));
t('Dos alumnos usan claves distintas', lsKey('auto:c1', 'a1') !== lsKey('auto:c1', 'a2'));
t('Las preferencias son del navegador', lsKey('pref:hq', 'p') === lsKey('pref:hq', 'a1'));
t('Sin sesión se usa la clave antigua', lsKey('done:c1', null) === 'circ:v1:done:c1');
const ls = mem(); ls.setItem('circ:v1:done:c1', 'true'); ls.setItem('circ:v1:auto:c2', '{"model":{}}'); ls.setItem('circ:v1:pref:hq', 'false'); ls.setItem('otra', 'x');
t('La primera identidad hereda el avance antiguo', migrarLegado('a1', ls) === 2 && ls.getItem(lsKey('done:c1', 'a1')) === 'true' && ls.getItem(lsKey('auto:c2', 'a1')) === '{"model":{}}');
t('El avance antiguo se borra tras migrar (no pasa a otra identidad)', ls.getItem('circ:v1:done:c1') === null && migrarLegado('p', ls) === 0 && ls.getItem(lsKey('done:c1', 'p')) === null);
t('No toca preferencias ni otras claves', ls.getItem('circ:v1:pref:hq') === 'false' && ls.getItem('otra') === 'x');
const ls2 = mem(); ls2.setItem(lsKey('done:c1', 'a1'), 'nuevo'); ls2.setItem('circ:v1:done:c1', 'viejo'); migrarLegado('a1', ls2);
t('No pisa datos nuevos de esa identidad', ls2.getItem(lsKey('done:c1', 'a1')) === 'nuevo');
t('Sin identidad no migra', migrarLegado(null, mem()) === 0);
console.log(`\n${ok}/${ok + fallos} pruebas de almacenamiento OK`); if (fallos) process.exit(1);
