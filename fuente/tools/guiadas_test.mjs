// Pruebas: desbloqueo de prácticas guiadas por grupo (token en «apartados»).
import { leerGuiadas, escribirGuiadas, guiadaAbierta, sinTokens } from './src/circ/guiadas.js';
let ok = 0, fallos = 0; const t = (n, c) => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n); } };
t('Sin token: todas abiertas (grupos de antes)', leerGuiadas(['circuitos', 'esp32']) === null && guiadaAbierta(['circuitos'], 'c9'));
t('Activar el control sin ninguna: todas cerradas', guiadaAbierta(escribirGuiadas(['circuitos'], []), 'c1') === false);
const a = escribirGuiadas(['circuitos', 'esp32'], ['c1', 'c2']);
t('Conserva los apartados y añade un solo token', a.length === 3 && a[0] === 'circuitos' && a[1] === 'esp32' && a[2] === 'guiadas:c1,c2');
t('Solo las desbloqueadas están abiertas', guiadaAbierta(a, 'c1') && guiadaAbierta(a, 'c2') && !guiadaAbierta(a, 'c3'));
const b = escribirGuiadas(a, ['c1', 'c2', 'c3', 'c3']);
t('Reescribir sustituye el token (sin duplicados)', b.filter((x) => x.startsWith('guiadas:')).length === 1 && b[2] === 'guiadas:c1,c2,c3');
t('Quitar el control deja los apartados como estaban', JSON.stringify(escribirGuiadas(b, null)) === '["circuitos","esp32"]');
t('sinTokens para mostrar los apartados', JSON.stringify(sinTokens(b)) === '["circuitos","esp32"]');
t('Ignora identificadores raros', [...leerGuiadas(['guiadas:c1,<x>, c2'])].join() === 'c1,c2');
t('Cabe en la lista corta de las reglas (≤ 20)', escribirGuiadas(Array(19).fill('x'), ['c1']).length === 20);
console.log(`\n${ok}/${ok + fallos} pruebas de prácticas guiadas OK`); if (fallos) process.exit(1);
