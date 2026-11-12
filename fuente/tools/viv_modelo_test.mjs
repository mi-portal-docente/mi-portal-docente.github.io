// Pruebas unitarias del modelo y el simulador del laboratorio «Instalación de vivienda»:  node --test viv_modelo_test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { solucionTablero, averia, AVERIAS, materiales, presupuesto, sanear, clone } from './src/viv/modelo.js';
import { simular, comprobar, comprobarTablero } from './src/viv/sim.js';

const conInt = (m, i1, i2) => { const x = clone(m); x.parts.find((p) => p.id === 'I1').on = i1; x.parts.find((p) => p.id === 'I2').on = i2; return x; };
const luces = (r) => r.bombillas.map((b) => (b.encendida ? 1 : 0)).join('');

test('la solución del tablero de la SA1 pasa la autocomprobación completa', () => {
  const r = comprobarTablero(solucionTablero());
  assert.equal(r.ok, true, r.items.filter((i) => !i.ok).map((i) => i.t).join(' | '));
});
test('tabla de verdad: B1 = I1 y B2 = B3 = I2; enchufe a 230 V', () => {
  const m = solucionTablero();
  assert.equal(luces(simular(conInt(m, false, false), { enchufada: true })), '000');
  assert.equal(luces(simular(conInt(m, true, false), { enchufada: true })), '100');
  assert.equal(luces(simular(conInt(m, false, true), { enchufada: true })), '011');
  const r = simular(conInt(m, true, true), { enchufada: true });
  assert.equal(luces(r), '111');
  assert.ok(r.enchufes[0].v > 225 && r.enchufes[0].vCarcasa < 1);
  assert.equal(r.fuga < 0.001, true);
});
test('sin enchufar no hay tensión', () => { assert.equal(luces(simular(conInt(solucionTablero(), true, true), { enchufada: false })), '000'); });
test('botón de prueba T: salta el diferencial', () => {
  const r = simular(conInt(solucionTablero(), true, true), { enchufada: true, test: true });
  assert.ok(r.abiertos.includes('ID')); assert.equal(luces(r), '000');
});
test('cada avería produce su efecto', () => {
  const s = (id, est = {}) => simular(conInt(averia(id), true, true), { enchufada: true, ...est });
  assert.equal(AVERIAS.length, 12);
  assert.ok(s('corto').abiertos.includes('C2') && !s('corto').abiertos.includes('ID'));
  assert.ok(s('sobrecarga').disparos.some((d) => d.por === 'sobrecarga'));
  assert.ok(s('fuga').abiertos.includes('ID'));
  const st = s('sinTierra'); assert.ok(st.avisos.some((a) => /Peligro/.test(a)) && !st.abiertos.includes('ID'));
  assert.ok(s('sinTierra', { tocar: true }).abiertos.includes('ID'));
  assert.ok(s('seccion').avisos.some((a) => /1,5 mm²/.test(a)));
  assert.ok(comprobar(averia('neutro')).items.some((i) => !i.ok && /NEUTRO/.test(i.t)));
  assert.ok(comprobar(averia('sinTierra')).items.some((i) => !i.ok && /SIN toma de tierra/.test(i.t)));
  assert.ok(comprobar(averia('seccion')).items.some((i) => !i.ok));
  for (const id of ['neutro', 'sinTierra', 'seccion']) assert.equal(comprobarTablero(averia(id)).ok, false, id);
});
test('materiales y presupuesto: precios editables', () => {
  const L = materiales(solucionTablero());
  const k = (x) => L.find((l) => l.k === x);
  assert.ok(k('id') && k('mt10') && k('mt16') && k('bombilla').cant === 3 && k('interruptor').cant === 2 && k('caja').cant === 2 && k('enchufe').cant === 1);
  assert.ok(L.some((l) => /Tubo/.test(l.concepto) && l.cant > 1));
  const p1 = presupuesto(L).total, p2 = presupuesto(L, { id: 1000 }).total;
  assert.ok(p1 > 0 && p2 > p1);
});
test('sanear descarta piezas y cables no válidos', () => {
  const m = sanear({ parts: [{ id: 'x', type: 'misil', x: 1, y: 1 }, { id: 'b', type: 'bombilla', x: 9999, y: 5 }], tubos: [{ id: 't', a: 'b', b: 'zz' }], cables: [{ id: 'c', a: { p: 'b', t: 'L' }, b: { p: 'nope', t: 'N' }, color: 'rosa', sec: 9 }] });
  assert.equal(m.parts.length, 1); assert.ok(m.parts[0].x <= 120); assert.equal(m.tubos.length, 0); assert.equal(m.cables.length, 0);
});

// ---- emulador ampliado: medidas, puntas, fichas, cuadro y vivienda real
import { medir, buscapolos } from './src/viv/sim.js';
import { BORNES, PUNTAS, FICHAS, PROTEGE, CALIBRES, HERRAMIENTAS, tuboMinimo } from './src/viv/catalogo.js';
import { solucionCasa, comprobarCasa, simularCasa, casaVacia, minimos, PLANO, materialesCasa, sanearCasa } from './src/viv/casa.js';

test('polímetro: sin tensión el enchufe da OL entre L y N; con tensión unos 230 V; buscapolos solo en la fase', () => {
  const m = solucionTablero(); const L = { p: 'E1', t: 'L' }, N = { p: 'E1', t: 'N' };
  assert.equal(medir(m, { enchufada: false }, L, N, 'ohm').r, Infinity);
  assert.equal(medir(m, { enchufada: true }, L, N, 'ohm').error, 'tension');
  const v = medir(m, { enchufada: true }, L, N, 'V').v; assert.ok(v > 220 && v < 240, String(v));
  assert.equal(buscapolos(m, { enchufada: true }, L).luz, true);
  assert.equal(buscapolos(m, { enchufada: true }, N).luz, false);
});
test('catálogo: cada borne con tornillo usa puntas que existen; las fichas de palanca no llevan tornillo', () => {
  for (const b of Object.values(BORNES)) { if (b.puntas) for (const p of b.puntas) assert.ok(PUNTAS[p], p); assert.ok(b.ideal >= b.pel[0] && b.ideal <= b.pel[1]); }
  assert.equal(BORNES.palanca.puntas, null);
  for (const f of Object.values(FICHAS)) { assert.ok(f.vias >= 2 && f.smax > f.smin && f.A > 0); }
  assert.ok(FICHAS.i3.smax < 4, 'la ficha de inserción no admite 4 mm²');
  assert.equal(PROTEGE[1.5], 10); assert.equal(PROTEGE[2.5], 16); assert.ok(CALIBRES.includes(32));
  assert.ok(HERRAMIENTAS.length >= 12 && HERRAMIENTAS.every((h) => h.id && h.n));
  assert.equal(tuboMinimo([1.5, 1.5, 1.5]), 16); assert.ok(tuboMinimo([6, 6, 6, 6, 6]) > 16);
});
test('vivienda real: la solución cumple los mínimos del REBT y enciende todas las luces con sus mandos', () => {
  const m = solucionCasa(); const r = comprobarCasa(m);
  assert.equal(r.ok, true, r.items.filter((i) => !i.ok).map((i) => i.t).join(' | '));
  const x = clone(m); for (const p of x.puntos) if (p.manda) p.on = true;
  const s = simularCasa(x); assert.ok(s.con && s.luces.length > 0);
  assert.ok(s.luces.some((l) => l.on));
  assert.ok(materialesCasa(m).length > 3);
});
test('vivienda real: vacía no cumple; mínimos de la cocina (ITC-BT-25)', () => {
  assert.equal(comprobarCasa(casaVacia()).ok, false);
  const k = minimos(PLANO.estancias.find((e) => e.tipo === 'cocina')); assert.equal(k.C3, 1); assert.equal(k.C4, 3); assert.ok(k.C5 >= 2);
  const m = solucionCasa(); m.prot.mts.C1 = { In: 20, curva: 'C' };
  assert.equal(comprobarCasa(m).ok, false, 'un magnetotérmico de 20 A en alumbrado (1,5 mm²) no cumple');
  const s = sanearCasa({ puntos: [{ id: 'z', tipo: 'misil', x: 1, y: 1 }], tubos: [{ a: 'z', b: 'q' }] }); assert.equal(s.puntos.length, 0); assert.equal(s.tubos.length, 0);
});

// ── v2: montaje paso a paso (juego), enchufe doble, minutero, empotrar y tapa de registro ──
import { PASOS, CINTO, NOMBRE_HERR, nota as notaMontaje, estrellas } from './src/viv/montaje.js';
import { TIPOS as TIPOS2, PALETA as PALETA2, esEnchufe, esMecanismo } from './src/viv/modelo.js';
test('montaje: cada paso pide una herramienta del cinturón y la nota descuenta 0,5 por fallo', () => {
  assert.ok(PASOS.length >= 20);
  const ids = new Set(CINTO.map(([id]) => id));
  for (const p of PASOS) { assert.ok(ids.has(p.herr), `herramienta ${p.herr} en el cinturón`); assert.ok(NOMBRE_HERR[p.herr]); assert.ok(p.ok && p.ok.length > 5); }
  assert.equal(PASOS[0].herr, 'epi', 'primero los EPI');
  assert.ok(PASOS.findIndex((p) => p.herr === 'buscapolos') > PASOS.findIndex((p) => p.herr === 'destornillador'), 'verificar al final');
  assert.equal(notaMontaje(0, 300), 10); assert.equal(notaMontaje(3, 300), 8.5); assert.equal(notaMontaje(2, 1500), 8); assert.equal(notaMontaje(40, 100), 0);
  assert.deepEqual([estrellas(0), estrellas(2), estrellas(7)], [3, 2, 1]);
});
const base2 = (extra, cables) => ({ parts: [{ id: 'q', type: 'cuadro', x: 20, y: 20 }, { id: 'id', type: 'id', cuadro: 'q', slot: 0 }, { id: 'c1', type: 'mt10', cuadro: 'q', slot: 2 }, { id: 'm', type: 'manguera', cuadro: 'q' }, ...extra], tubos: [], cables });
const w = (id, a, ta, b, tb, color = 'marron') => ({ id, a: { p: a, t: ta }, b: { p: b, t: tb }, color, sec: 1.5 });
test('minutero: con el borne 3 a 230 V y la salida activada, la bombilla luce; sin activar, no', () => {
  assert.ok(TIPOS2.minutero && TIPOS2.enchufe2 && PALETA2.includes('minutero') && PALETA2.includes('enchufe2'));
  const cab = [w('1', 'c1', 'L', 'mn', 'L'), w('2', 'c1', 'N', 'mn', 'N', 'azul'), w('3', 'c1', 'L', 'p1', '1'), w('4', 'p1', '2', 'mn', '3', 'gris'), w('5', 'mn', '4', 'b', 'L', 'negro'), w('6', 'b', 'N', 'c1', 'N', 'azul')];
  const mk = (on, pul) => sanear(base2([{ id: 'mn', type: 'minutero', x: 50, y: 50, on, seg: 20 }, { id: 'p1', type: 'pulsador', x: 70, y: 30, on: pul }, { id: 'b', type: 'bombilla', x: 90, y: 60 }], cab));
  const r0 = simular(mk(false, false), { enchufada: true }); assert.equal(r0.bombillas[0].encendida, false); assert.ok(r0.minuteros[0].v3 < 50);
  const r1 = simular(mk(false, true), { enchufada: true }); assert.ok(r1.minuteros[0].v3 > 200, 'pulsar da tensión al borne 3');
  const r2 = simular(mk(true, false), { enchufada: true }); assert.equal(r2.bombillas[0].encendida, true);
});
test('enchufe doble empotrado y caja con tapa: tensión, sanear y lista de materiales', () => {
  const m = sanear(base2([{ id: 'e2', type: 'enchufe2', x: 60, y: 20, montaje: 'empotrar', carga: 'nada' }, { id: 'ce', type: 'caja', x: 85, y: 45, tapa: true }], [{ ...w('1', 'c1', 'L', 'e2', 'L'), sec: 2.5 }, { ...w('2', 'c1', 'N', 'e2', 'N', 'azul'), sec: 2.5 }]));
  const e2 = m.parts.find((p) => p.id === 'e2'); assert.equal(e2.montaje, 'empotrar'); assert.ok(esEnchufe(e2) && esMecanismo(e2));
  assert.equal(m.parts.find((p) => p.id === 'ce').tapa, true);
  const r = simular(m, { enchufada: true }); assert.ok(Math.round(r.enchufes.find((x) => x.id === 'e2').v) === 230);
  const mat = materiales(m).map((f) => f.concepto).join(' | ');
  assert.match(mat, /Marco doble/); assert.match(mat, /empotrar/); assert.match(mat, /Tapa de registro/);
});

// ==== v3: proyectos paso a paso ====
const PJ = await import('./src/viv/proyectos.js');
test('proyectos: 8 numerados; cada solución funciona, cumple el REBT y las medidas coinciden con lo esperado', () => {
  assert.deepEqual(PJ.PROYECTOS.map((p) => p.n), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const P of PJ.PROYECTOS) {
    assert.ok(P.quiz.length >= 3 && PJ.pasosDe(P).length >= 3, P.id);
    for (const s of PJ.pasosDe(P)) assert.ok(s.opts.includes(s.herr), `${P.id}: la herramienta correcta está entre las opciones (${s.t})`);
    if (!P.modelo) continue;
    const R = PJ.comprobarProyecto(P, PJ.solucion(P)); assert.ok(R.ok, `${P.id}: ${R.items.filter((i) => !i.ok).map((i) => i.t).join(' | ')}`);
    for (const pr of P.pruebas) assert.ok(PJ.medirPrueba(P, pr).ok, `${P.id}: ${pr.t}`);
    PJ.pasosDe(P).forEach((_, i) => assert.ok(PJ.modeloPaso(P, i)));
    assert.equal(PJ.modeloMontar(P).cables.length, 0);
    assert.match(PJ.planoSVG(PJ.solucion(P)), /^<svg/);
  }
});
test('proyectos: errores de conexión reales detectados y explicados', () => {
  const fall = (id, f) => { const P = PJ.proyecto(id); const m = PJ.solucion(P); f(m); return PJ.comprobarProyecto(P, m); };
  const sw = (m, p, a, b) => { for (const w of m.cables) for (const e of [w.a, w.b]) if (e.p === p) e.t = e.t === a ? b : e.t === b ? a : e.t; };
  let R = fall('luz', (m) => sw(m, 'B1', 'L', 'N')); assert.ok(!R.ok); assert.ok(R.items.some((i) => /rosca/.test(i.t)), 'portalámparas: neutro a la rosca');
  R = fall('luz', (m) => sw(m, 'I1', '1', '2')); assert.ok(!R.ok); assert.ok(R.items.some((i) => /Interruptor 1/.test(i.t)), 'interruptor: L entrada y ↓ salida');
  R = fall('enchufe', (m) => sw(m, 'E1', 'L', 'N')); assert.ok(!R.ok, 'Schuko con L y N cambiados');
  R = fall('conmutada', (m) => sw(m, 'CM1', 'C', '1')); assert.ok(!R.ok); assert.ok(R.pistas.length > 0); assert.ok(R.items[0].t.startsWith('No funciona'));
  R = fall('conmutada', (m) => sw(m, 'CM1', '1', '2')); assert.ok(R.ok, 'viajeros cruzados entre sí: válido');
  R = fall('cruzamiento', (m) => sw(m, 'X1', '2', '3')); assert.ok(!R.ok, 'cruzamiento con los pares mezclados');
  R = fall('cuadro', (m) => { m.cables.find((c) => c.id === 'mL').b.t = 'L'; }); assert.ok(!R.ok); assert.ok(R.items.some((i) => /ARRIBA/.test(i.t)), 'IGA alimentado por abajo');
  R = fall('enchufe', (m) => { m.cables.find((c) => c.id === 'f').sec = 1.5; }); assert.ok(!R.ok, 'enchufe con 1,5 mm²');
  R = fall('minutero', (m) => sw(m, 'MN', 'L', '3')); assert.ok(!R.ok, 'minutero: L a la fase y pulsadores al 3');
});
