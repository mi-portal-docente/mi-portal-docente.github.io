// Prueba de «Evaluación de vivienda» (src/viv/evaluacion.js): node viv_eval_test.mjs
import test from 'node:test'; import assert from 'node:assert/strict';
import { EVALS_VIV, modeloExamen, corregirMontaje, corregirNivelViv } from './src/viv/evaluacion.js';
import { modeloSolucion, practica } from './src/viv/practicas.js';
import { leerVivEv, escribirVivEv, vivEvAbierta, sinTokens } from './src/circ/guiadas.js';
test('tres niveles con entregas v7, v8 y v9', () => { assert.deepEqual(EVALS_VIV.map((e) => e.entrega), ['v7', 'v8', 'v9']); });
test('cada montaje de partida suspende y la solución saca un 10', () => {
  for (const ev of EVALS_VIV) {
    for (const mt of ev.montajes) assert.equal(corregirMontaje(mt, modeloExamen(mt)).ok, false, `${ev.id} ${mt.de} de partida`);
    const R = corregirNivelViv(ev, ev.montajes.map((mt) => modeloSolucion(practica(mt.de)))); assert.equal(R.ok, true, ev.id); assert.equal(R.nota, 10, ev.id);
    const V = corregirNivelViv(ev, ev.montajes.map((mt) => modeloExamen(mt))); assert.equal(V.nota, 0, ev.id + ': entregar sin hacer nada saca un 0');
  }
});
test('la avería del nivel 3 tiene el retorno azul y la base sin tierra', () => {
  const mt = EVALS_VIV[2].montajes[1]; const m = modeloExamen(mt);
  assert.equal(m.cables.find((c) => c.id === 'r2').color, 'azul'); assert.ok(!m.cables.some((c) => c.id === 'epe'));
  const R = corregirMontaje(mt, m); assert.ok(R.score < 1 && R.score >= 0);
});
test('candados de la evaluación: cerrados sin token, se abren uno a uno y no se ven como apartados', () => {
  assert.equal(vivEvAbierta([], 've1'), false);
  const a = escribirVivEv(['circuitos'], ['ve1']); assert.equal(vivEvAbierta(a, 've1'), true); assert.equal(vivEvAbierta(a, 've2'), false);
  assert.deepEqual([...leerVivEv(a)], ['ve1']); assert.deepEqual(sinTokens(a), ['circuitos']);
  assert.deepEqual(escribirVivEv(a, []), ['circuitos']);
});
import { VIV_PR, VIV_EV, progresoRegistro } from './src/viv/indice.js';
import { PRACTICAS as PRS } from './src/viv/practicas.js';
test('el índice ligero del panel coincide con las prácticas y los niveles', () => {
  assert.deepEqual(VIV_PR.map((p) => [p.id, p.n, p.title]), PRS.map((p) => [p.id, p.n, p.title]));
  assert.deepEqual(VIV_EV.map((e) => [e.id, e.entrega, e.nivel, e.title]), EVALS_VIV.map((e) => [e.id, e.entrega, e.nivel, e.title]));
  assert.deepEqual(progresoRegistro({ datos: { montaje: JSON.stringify({ practicas: { vp2: { guiada: true, autonoma: false } } }) } }), { vp2: { guiada: true, autonoma: false } });
  assert.deepEqual(progresoRegistro({ datos: { montaje: 'no-json' } }), {});
});
import { lsKeyViv, migrarViv } from './src/viv/almacen.js';
test('avance por usuario en el mismo navegador y migración sin perder nada', () => {
  const mapa = new Map(); const ls = { get length() { return mapa.size; }, key: (i) => [...mapa.keys()][i], getItem: (k) => (mapa.has(k) ? mapa.get(k) : null), setItem: (k, v) => mapa.set(k, String(v)), removeItem: (k) => mapa.delete(k) };
  assert.equal(lsKeyViv('pr:done:vp2', null), 'viv:v1:pr:done:vp2');
  assert.equal(lsKeyViv('pr:done:vp2', 'g1_07'), 'viv:v1:u:g1_07:pr:done:vp2');
  assert.equal(lsKeyViv('sa1', 'g1_07'), 'viv:v1:sa1', 'la SA1 y los proyectos no cambian de sitio');
  ls.setItem('viv:v1:pr:done:vp2', 'true'); ls.setItem('viv:v1:evres:ve1', '{"nota":10}'); ls.setItem('viv:v1:sa1', '{}');
  assert.equal(migrarViv('g1_07', ls), 2);
  assert.equal(ls.getItem('viv:v1:u:g1_07:pr:done:vp2'), 'true'); assert.equal(ls.getItem('viv:v1:u:g1_07:evres:ve1'), '{"nota":10}');
  assert.equal(ls.getItem('viv:v1:pr:done:vp2'), null); assert.equal(ls.getItem('viv:v1:sa1'), '{}');
  assert.equal(migrarViv('g1_08', ls), 0, 'el segundo usuario del navegador empieza de cero');
});
