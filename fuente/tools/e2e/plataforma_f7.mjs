// Fase 7 · EEE: polímetro con continuidad y «Encuentra la avería» (ejemplo para practicar y tarea calificable
// importada en JSON, entregada por el alumno desde el laboratorio de Circuitos).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const medir = (pg, mode, red, com) => pg.evaluate(([m, r, c]) => { const L = window.__circ; const p = L.part('M1'); p.props.mode = m; p.probes = { red: r, com: c }; L._force = true; }, [mode, red, com]);
const lectura = (pg) => pg.evaluate(() => { const L = window.__circ; return { m: L.lastSim?.res?.M1?.meter || null, led: !!L.lastSim?.res?.L1?.on, alerta: document.querySelector('#cxAlert')?.textContent || '' }; });
const elegir = async (pg, id, tipo) => { await pg.evaluate((i) => window.__circ.select({ kind: i.startsWith('w') ? 'wire' : 'part', id: i }), id); await pg.waitForSelector(`[name=avTipo][value=${tipo}]`); await pg.check(`[name=avTipo][value=${tipo}]`); };
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  await pg.goto(BASE + '#eee/circuitos');
  await pg.waitForSelector('.cx-card[href="#eee/circuitos/averia-ejemplo"]', { timeout: 20000 });
  ok('Circuitos: tarjeta «Encuentra la avería» con icono Lucide', !!(await pg.$('.cx-card[href="#eee/circuitos/averia-ejemplo"] svg.ic')));
  // ------------------------------------------------------------- ejemplo para practicar
  await pg.goto(BASE + '#eee/circuitos/averia-ejemplo');
  await pg.waitForSelector('.cx-avh', { timeout: 20000 }); await pg.waitForTimeout(800);
  ok('el ejemplo se abre en la pestaña «Avería» con el montaje y un polímetro', await pg.evaluate(() => window.__circ.model.parts.map((p) => p.id).join(',')) === 'B1,R1,L1,M1');
  await pg.click('#cxSim'); await pg.waitForTimeout(600);
  await medir(pg, 'V', 'h:a10', 'h:a14'); await pg.waitForTimeout(600);
  let r = await lectura(pg);
  ok('con la avería (R1 abierta) el LED no luce y R1 tiene casi toda la tensión de la pila', !r.led && r.m?.value > 6, JSON.stringify(r.m));
  await shot(pg, 'f7_averia_medir');
  await medir(pg, '·)))', 'h:a10', 'h:a14');
  await pg.waitForFunction(() => window.__circ.lastSim?.res?.M1?.meter?.mode === '·)))' && /continuidad/.test(document.querySelector('#cxAlert')?.textContent || ''), null, { timeout: 8000 }).catch(() => {});
  r = await lectura(pg);
  ok('continuidad (·))) con la pila conectada → aviso de quitar la alimentación', /continuidad/.test(r.alerta) && r.m?.beep === false, r.alerta);
  await pg.click('#cxSim'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const L = window.__circ; L.model.wires = L.model.wires.filter((w) => w.id !== 'w1' && w.id !== 'w2'); });
  await pg.click('#cxSim'); await medir(pg, '·)))', 'h:tp3', 'h:c10'); await pg.waitForTimeout(700);
  await pg.waitForFunction(() => window.__circ.lastSim?.res?.M1?.meter?.beep === true, null, { timeout: 8000 }).catch(() => {}); // la simulación puede tardar (cristal en headless)
  r = await lectura(pg);
  ok('continuidad sin pila en un cable bueno: pita', r.m?.beep === true && /pita/.test(r.m.text), JSON.stringify(r.m));
  await shot(pg, 'f7_continuidad');
  await medir(pg, '·)))', 'h:c10', 'h:c14'); await pg.waitForTimeout(600);
  await pg.waitForFunction(() => window.__circ.lastSim?.res?.M1?.meter?.text === 'OL', null, { timeout: 8000 }).catch(() => {});
  r = await lectura(pg);
  ok('continuidad en la resistencia averiada: OL (no pita)', r.m?.text === 'OL', JSON.stringify(r.m));
  await pg.click('#cxSim');
  await elegir(pg, 'L1', 'abierto'); await pg.click('[data-act=avComprobar]');
  ok('diagnóstico equivocado (L1) → «Ese elemento funciona bien»', /funciona bien/.test(await pg.textContent('.cx-avres')));
  await elegir(pg, 'R1', 'abierto'); await pg.click('[data-act=avComprobar]');
  ok('diagnóstico correcto (R1 abierta) → «¡Avería encontrada!» con la explicación', /Avería encontrada!.*R1/.test(await pg.textContent('.cx-avres.ok')));
  await shot(pg, 'f7_averia_encontrada');
  // ------------------------------------------------------------- tarea importada en JSON
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, { tipo: 'averia', titulo: 'x', contenido: { montaje: '{"parts":[],"wires":[]}', averia: { elemento: 'R1', tipo: 'abierto' } } });
  await pg.waitForSelector('#jsErr li', { timeout: 10000 });
  ok('JSON de avería con un elemento que no existe: error en castellano', /No hay ningún componente ni cable «R1»/.test(await pg.textContent('#jsErr')));
  const MONT = await pg.evaluate(() => JSON.stringify(window.__circ.sanitize({ parts: [{ id: 'B1', type: 'bat9', pos: [-23, -5], rot: 0, props: {}, state: {} }, { id: 'R1', type: 'resistor', at: 'b10', rot: 0, props: { r: 470 }, state: {} }, { id: 'L1', type: 'led', at: 'e14', rot: 0, props: { color: 'rojo' }, state: {} }], wires: [{ id: 'w1', a: 'p:B1:+', b: 'h:tp2', color: 'rojo' }, { id: 'w2', a: 'p:B1:-', b: 'h:tn2', color: 'negro' }, { id: 'w3', a: 'h:tp9', b: 'h:a10', color: 'rojo' }, { id: 'w4', a: 'h:a15', b: 'h:tn15', color: 'negro' }] })));
  const AVE = { tipo: 'averia', titulo: 'El LED no luce', puntos: 10, contenido: { enunciado: 'El LED no se enciende. Busca la avería.', montaje: MONT, averia: { elemento: 'w4', tipo: 'cable' }, pistas: ['Comprueba la continuidad de los cables sin la pila.'] } };
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(AVE)); await pg.click('.cl-modal [data-m=validar]');
  await pg.waitForSelector('#jsPrev .js-prev');
  ok('vista previa: «circuito con 3 componentes y 4 cables · avería oculta»', /3 componentes y 4 cables · avería oculta/.test(await pg.textContent('#jsPrev')));
  await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("El LED no luce")', { timeout: 15000 });
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("El LED no luce")', 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=contenido]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  await pg.goto(BASE + '#trabajo/' + id); await pg.waitForSelector('.avi-sol', { timeout: 15000 });
  ok('el profesor ve la solución en la página del elemento', /w4/.test(await pg.textContent('.avi-sol')));
  // ------------------------------------------------------------- alumno
  const A = T.A3 || await T.alumno(T.GE, 3, '4321', { width: 1280, height: 860 }); T.A3 = A;
  await A.pg.goto(BASE + '#trabajo/' + id);
  await A.pg.waitForSelector('.avi-abrir', { timeout: 20000 });
  ok('el alumno no ve la solución', !(await A.pg.$('.avi-sol')));
  await shot(A.pg, 'f7_alumno_elemento');
  await A.pg.click('.avi-abrir');
  await A.pg.waitForSelector('.cx-avh', { timeout: 20000 }); await A.pg.waitForTimeout(800);
  ok('se abre el circuito de la tarea, sin botón «Comprobar» (se califica)', !(await A.pg.$('[data-act=avComprobar]')) && !!(await A.pg.$('[data-act=avEntregar]')));
  await A.pg.click('[data-act=avPista]');
  ok('pistas: se muestran una a una', /Pista 1:.*continuidad/.test(await A.pg.textContent('.cx-avpistas')));
  await elegir(A.pg, 'w4', 'cable');
  await A.pg.click('[data-act=avEntregar]');
  await A.pg.waitForSelector('.cx-avok', { timeout: 15000 });
  const tr = JSON.stringify(await docREST(`trabajos/${id}_${T.GE.id}_3`));
  ok('entrega del diagnóstico: «w4 · Cable cortado … Aciertos: 2/2»', /w4 · Cable cortado.*Aciertos: 2\/2/.test(tr), tr.slice(0, 300));
  ok('en el laboratorio no se muestra si ha acertado', !/Aciertos/.test(await A.pg.textContent('#cxPanel')) && !(await A.pg.$('.cx-avres')));
  await shot(A.pg, 'f7_alumno_entregado');
  await A.pg.setViewportSize({ width: 390, height: 844 }); await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.avi-ok', { timeout: 15000 });
  ok('la página del elemento muestra «Entregado» con el diagnóstico', /Entregado: w4/.test(await A.pg.textContent('.avi-ok')));
  await shot(A.pg, 'f7_alumno_movil');
  await A.pg.setViewportSize({ width: 1280, height: 860 });
}
