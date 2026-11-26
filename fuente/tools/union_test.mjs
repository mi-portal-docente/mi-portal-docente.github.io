// Pruebas de la lógica de «una clase = un código» (añadir asignatura, unir y separar grupos). node union_test.mjs
import { planUnion, planSeparar, planAsignatura, itemConGrupo, itemSinGrupo, leerUnion, tokenUnion, conUnion } from './src/lms/union.js';
let n = 0, f = 0; const ok = (t, c) => { n++; if (!c) { f++; console.log('FAIL', t); } else console.log('OK  ', t); };
const P = { id: 'gEEE', nombre: '2º CFGB', asignaturas: ['eee'], apartados: ['circuitos'], curso: 'c1' };
const D = { id: 'gPRO', nombre: '2º CFGB Proyecto', asignaturas: ['proy2'], apartados: [], curso: 'c1' };
const items = [
  { id: 'i1', titulo: 'Despacho', asig: 'proy2', tipo: 'despacho', grupos: ['gPRO'], visible: ['gPRO'], publicado: true, curso: 'c1' },
  { id: 'i2', titulo: 'Borrador', asig: 'proy2', tipo: 'tarea', grupos: ['gPRO'], visible: [], publicado: false, curso: 'c1' },
  { id: 'i3', titulo: 'Rec', asig: 'proy2', tipo: 'recuperacion', grupos: ['gPRO'], visible: [], visibleAl: ['gPRO_3', 'gPRO_7'], publicado: true, curso: 'c1' },
  { id: 'i4', titulo: 'EEE', asig: 'eee', tipo: 'tarea', grupos: ['gEEE'], visible: ['gEEE'], publicado: true, curso: 'c1' },
  { id: 'i5', titulo: 'Sin grupo', asig: 'proy2', tipo: 'despacho', grupos: [], visible: [], publicado: true, curso: 'c1' },
];
const anuncios = [{ id: 'a1', grupos: ['gPRO'], visible: ['gPRO'] }, { id: 'a2', grupos: ['gPRO'], visible: [] }];
const desp = new Map([['i1_gPRO', { asign: { 1: 'e1' }, llamadas: [{ e: '', k: 0, n: 0, t: 1 }] }]]);
const p = planUnion({ principal: P, duplicado: D, items, anuncios, despachos: desp });
ok('unir: Proyecto pasa a la clase principal', JSON.stringify(p.asignaturas) === '["eee","proy2"]' && JSON.stringify(p.asigNuevas) === '["proy2"]');
ok('unir: 3 elementos del duplicado (no toca los de EEE ni los que no son del duplicado)', p.items.map((x) => x.id).join() === 'i1,i2,i3');
ok('unir: publicado → grupos y visible iguales (lo exigen las reglas)', JSON.stringify(p.items[0].cambios) === JSON.stringify({ grupos: ['gPRO', 'gEEE'], visible: ['gPRO', 'gEEE'] }));
ok('unir: borrador → visible vacío', JSON.stringify(p.items[1].cambios) === JSON.stringify({ grupos: ['gPRO', 'gEEE'] }));
ok('unir: recuperación → mismos nº de lista con la clase principal', JSON.stringify(p.items[2].cambios.visibleAl) === JSON.stringify(['gPRO_3', 'gPRO_7', 'gEEE_3', 'gEEE_7']) && !('visible' in p.items[2].cambios));
ok('unir: el duplicado nunca se quita de ningún elemento', p.items.every((x) => x.cambios.grupos.includes('gPRO')));
ok('unir: anuncios publicados y programados', JSON.stringify(p.anuncios.map((a) => a.cambios)) === JSON.stringify([{ grupos: ['gPRO', 'gEEE'], visible: ['gPRO', 'gEEE'] }, { grupos: ['gPRO', 'gEEE'], visible: [] }]));
ok('unir: copia la centralita del despacho (no la mueve)', p.despachos.length === 1 && p.despachos[0].a === 'i1_gEEE' && p.despachos[0].datos.asign[1] === 'e1');
ok('unir: marca «union:» con la principal y las asignaturas añadidas', p.token === 'union:gEEE:proy2' && JSON.stringify(leerUnion(conUnion(D.apartados, p.token))) === JSON.stringify({ principal: 'gEEE', asigs: ['proy2'] }));
ok('unir: errores (misma clase, ya unida)', planUnion({ principal: P, duplicado: P }).error && planUnion({ principal: P, duplicado: { ...D, apartados: [tokenUnion('x', [])] } }).error);
// aplicar el plan en memoria y separar
const tras = items.map((it) => { const x = p.items.find((y) => y.id === it.id); return x ? { ...it, ...x.cambios } : it; });
const P2 = { ...P, asignaturas: p.asignaturas }; const D2 = { ...D, apartados: conUnion(D.apartados, p.token), activo: false };
const s = planSeparar({ duplicado: D2, principal: P2, items: tras, anuncios: anuncios.map((a, i) => ({ ...a, ...p.anuncios[i].cambios })) });
const vuelta = tras.map((it) => { const x = s.items.find((y) => y.id === it.id); return x ? { ...it, ...x.cambios } : it; });
ok('separar: los elementos vuelven a estar como antes', ['i1', 'i2', 'i3'].every((id) => { const a = items.find((x) => x.id === id), b = vuelta.find((x) => x.id === id); return JSON.stringify(a.grupos) === JSON.stringify(b.grupos) && JSON.stringify(a.visible) === JSON.stringify(b.visible) && JSON.stringify(a.visibleAl || null) === JSON.stringify(b.visibleAl || null); }));
ok('separar: quita Proyecto de la clase principal y deja EEE', JSON.stringify(s.asignaturas) === '["eee"]');
ok('separar: no toca elementos solo de la principal', !s.items.some((x) => x.id === 'i4'));
// añadir asignatura a la clase
const pa = planAsignatura(P, 'proy2', items);
ok('añadir asignatura: lleva a la clase los elementos de Proyecto del curso (también el que no tenía grupo)', pa.map((x) => x.id).join() === 'i1,i2,i3,i5');
ok('añadir asignatura: el que no tenía grupo pasa a verse', JSON.stringify(pa.find((x) => x.id === 'i5').cambios) === JSON.stringify({ grupos: ['gEEE'], visible: ['gEEE'] }));
ok('itemConGrupo: no cambia nada si ya lo tiene', itemConGrupo(items[3], 'gEEE') === null && itemSinGrupo(items[0], 'gEEE') === null);
ok('añadir asignatura: otros cursos y papelera fuera', planAsignatura(P, 'proy2', [{ ...items[0], curso: 'c0' }, { ...items[0], id: 'z', papelera: true }]).length === 0);
console.log(`${n - f}/${n} OK`); process.exit(f ? 1 : 0);
