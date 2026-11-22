// Pruebas de las prácticas del tablero una a una (vivienda):  node --test viv_practicas_test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICAS, practica, modeloInicial, modeloSolucion, estadoPasos, comprobarPractica, CIRCUITOS_VIV, ACCIONES } from './src/viv/practicas.js';
import { leerViv, escribirViv, vivAbierta, alternarViv, sinTokens, leerGuiadas } from './src/circ/guiadas.js';

const todas = (Pr) => Object.fromEntries(Pr.pasos.filter((s) => s.accion).map((s) => [s.accion, true]));

test('hay 7 prácticas vp1…vp7 en orden y con pasos', () => {
  assert.deepEqual(PRACTICAS.map((p) => p.id), ['vp1', 'vp2', 'vp3', 'vp4', 'vp5', 'vp6', 'vp7']);
  for (const Pr of PRACTICAS) { assert.ok(Pr.pasos.length >= 3, Pr.id); assert.ok(Pr.title, Pr.id); for (const s of Pr.pasos) if (s.accion) assert.ok(ACCIONES[s.accion], s.accion); }
  assert.equal(practica('vp9'), null);
});

test('circuitos ITC-BT-25: PIA y sección de C1…C5', () => {
  const t = Object.fromEntries(CIRCUITOS_VIV.map((c) => [c.c, [c.pia, c.sec]]));
  assert.deepEqual(t, { C1: [10, 1.5], C2: [16, 2.5], C3: [25, 6], C4: [20, 4], C5: [16, 2.5] });
});

for (const Pr of PRACTICAS) {
  test(`${Pr.id}: el montaje de partida no aprueba y la solución sí`, () => {
    const m0 = modeloInicial(Pr);
    assert.equal(comprobarPractica(Pr, m0, { realista: false }).ok, false);
    assert.equal(estadoPasos(Pr, m0, {})[0].ok, false);
    const ms = modeloSolucion(Pr);
    const st = estadoPasos(Pr, ms, todas(Pr));
    assert.ok(st.every((s) => s.ok), st.filter((s) => !s.ok).map((s) => Pr.pasos[s.i].t).join(' | '));
    const r = comprobarPractica(Pr, ms, { realista: false });
    assert.equal(r.ok, true, (r.items || []).filter((i) => !i.ok).map((i) => i.t).join(' | '));
  });
}

test('los pasos van en orden: sin el primero, los siguientes no cuentan', () => {
  const Pr = practica('vp2'); const m = modeloSolucion(Pr); const id = Pr.pasos.find((s) => s.cables).cables[0];
  m.cables = m.cables.filter((c) => c.id !== id);
  const st = estadoPasos(Pr, m, todas(Pr));
  assert.equal(st[0].ok, false); assert.ok(st.slice(1).every((s) => !s.ok)); assert.ok(st[0].faltan.length >= 1);
});

test('candados de vivienda: sin token todo abierto; el token no toca guiadas ni apartados', () => {
  const ids = PRACTICAS.map((p) => p.id); const base = ['teoria', 'guiadas:c1,c2'];
  assert.equal(leerViv(base), null); assert.equal(vivAbierta(base, 'vp3'), true);
  const a = alternarViv(base, 'vp3', false, ids);
  assert.equal(vivAbierta(a, 'vp3'), false); assert.equal(vivAbierta(a, 'vp1'), true);
  assert.deepEqual([...leerGuiadas(a)], ['c1', 'c2']); assert.deepEqual(sinTokens(a), ['teoria']);
  const b = alternarViv(a, 'vp3', true, ids); assert.equal(vivAbierta(b, 'vp3'), true);
  assert.deepEqual(escribirViv(b, null), base);
});
