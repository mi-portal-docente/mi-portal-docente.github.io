// Fase 26 · PIP-6 (t198u, t199u): las correcciones de un examen de EEE (dar por válida, aplicar puntos, deshacer, válida para
// todos, puntos escritos a mano, desde el cuaderno y desde el examen completo) se ven AL MOMENTO y tras recargar en TODAS las
// vistas del profesor: Exámenes, Cuaderno (por actividad y por criterio), Analítica (alumno × criterio) y examen completo,
// y en la del alumno. Las respuestas del alumno no se tocan.
import { mkdirSync } from 'node:fs';
const CAP = process.env.CAP_NOTAS || '/workspace/capturas-notas/';
export default async function ({ T, BASE, ok, docREST, pegarJSON, guardarJSON, local, REST, owner }) {
  try { mkdirSync(CAP, { recursive: true }); } catch (e) { /* ya existe */ }
  const foto = (p, n) => p.screenshot({ path: CAP + n + '.png' });
  const pg = T.P.pg; await pg.setViewportSize({ width: 1440, height: 900 });
  const EX = { formato: 'superprofe/elemento@1', tipo: 'examen', seccion: 'examenes', titulo: 'Notas F26 · tema 4', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: false },
    preguntas: [
      { id: 't1', tipo: 'test', criterio: 'CE1', enunciado: '¿Cuál es la unidad de la resistencia?', opciones: ['Voltio', 'Ohmio', 'Amperio'], correcta: 1 },
      { id: 'v1', tipo: 'vf', criterio: 'CE2', enunciado: 'El LED tiene polaridad', correcta: true },
      { id: 'c1', tipo: 'corta', criterio: 'CE1', enunciado: 'Símbolo de la unidad de resistencia (en letras)', aceptadas: ['ohm'] }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EX); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  const A = await T.alumno(T.GE, 31, '4321', { width: 1280, height: 1000 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  await A.pg.click('[data-au=empezar]'); await A.pg.waitForSelector('#auExamen fieldset[data-q=t1]', { timeout: 20000 });
  await A.pg.check('fieldset[data-q=t1] input[value="0"]'); await A.pg.check('fieldset[data-q=v1] input[value="true"]'); await A.pg.fill('fieldset[data-q=c1] input', 'ohmio');
  await A.pg.waitForTimeout(800); await A.pg.click('#auExamen button[type=submit]'); await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  const tid = (n) => `${id}_${T.GE.id}_${n}`;
  let d31 = null; for (let i = 0; i < 20; i++) { d31 = await docREST('trabajos/' + tid(31)); if (d31.fields?.estado?.stringValue === 'entregado') break; await new Promise((r) => setTimeout(r, 500)); }
  const H = { ...owner.headers, 'Content-Type': 'application/json' };
  const f34 = JSON.parse(JSON.stringify(d31.fields)); f34.numero = { integerValue: '34' }; f34.al = { stringValue: `${T.GE.id}_34` };
  await fetch(`${REST}/trabajos/${tid(34)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: f34 }) });
  const resp31 = JSON.stringify(d31.fields.respuestas);
  const nv = (d) => Number(d?.fields?.nota?.doubleValue ?? d?.fields?.nota?.integerValue ?? NaN);
  const esperar = async (n, val) => { let d = null; for (let i = 0; i < 25; i++) { d = await docREST('notas/' + tid(n)); if (nv(d) === val) return d; await new Promise((r) => setTimeout(r, 300)); } return d; };
  const fmt = (v) => String(v).replace('.', ',');

  // ---- lecturas de todas las vistas del profesor (sin recargar: «en vivo»; con recarga: «tras recargar»)
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  async function elegir(vista) {
    await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
    if ((await pg.inputValue('[data-ap-f=gGrupo]')) !== T.GE.id) { await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); }
    if (await pg.$('[data-ap-f=gAsig]')) await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  }
  async function leer(n) {
    const R = {};
    for (const [k, h] of [['examenes', '#panel/examenes'], ['cuaderno', '#panel/notas']]) {
      await pg.evaluate((x) => { location.hash = x; }, h); await elegir(); await pg.waitForSelector(`td[data-celda="${id}"][data-n="${n}"]`, { timeout: 20000 }); await pg.waitForTimeout(500);
      R[k] = norm(await pg.textContent(`td[data-celda="${id}"][data-n="${n}"]`));
    }
    // Por criterio (CE1 = t1 + c1, CE2 = v1)
    await pg.click('[data-ap=vistaNotas][data-v=criterio]'); await pg.waitForSelector('#apCritW table', { timeout: 20000 }); await pg.waitForTimeout(400);
    R.criterio = await pg.evaluate((n) => { const tr = [...document.querySelectorAll('#apCritW tbody tr')].find((x) => +x.querySelector('th').textContent === n); return tr ? [...tr.querySelectorAll('td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()).join('|') : null; }, n);
    await pg.click('[data-ap=vistaNotas][data-v=actividad]'); await pg.waitForSelector('#apTablaW table', { timeout: 20000 });
    // Analítica (alumno × criterio de este examen)
    await pg.evaluate(() => { location.hash = '#panel/analitica'; }); await pg.waitForSelector('[data-ap-f=anEx]', { timeout: 20000 });
    await pg.selectOption('[data-ap-f=anEx]', id); await pg.waitForSelector('#anAlCrit tbody tr', { timeout: 20000 }); await pg.waitForTimeout(300);
    R.analitica = await pg.evaluate((n) => { const tr = [...document.querySelectorAll('#anAlCrit tbody tr')].find((x) => +x.querySelector('th').textContent === n); return tr ? [...tr.querySelectorAll('td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()).join('|') : null; }, n);
    await pg.evaluate(() => { location.hash = '#panel/examenes'; }); await elegir();
    return R;
  }
  // nota esperada → texto esperado en cada vista (CE1: t1+c1 de 2 pt; CE2: v1 de 1 pt)
  const crit = (ce1, ce2) => `${fmt(Math.round(ce1 / 2 * 1000) / 100)}${/,/.test(fmt(ce1)) ? '' : ''}`;
  const celdaOk = (R, nota) => R.examenes.startsWith(fmt(nota)) && R.cuaderno.startsWith(fmt(nota));
  const verTodo = async (etiqueta, n, nota, got) => {
    let R = await leer(n);
    ok(`F26 · ${etiqueta}: Exámenes y Cuaderno muestran ${fmt(nota)} (en vivo)`, celdaOk(R, nota), JSON.stringify(R));
    ok(`F26 · ${etiqueta}: «Por criterio» y Analítica reflejan los puntos (CE1 ${got.ce1} / CE2 ${got.ce2})`, R.criterio?.startsWith(got.criterio) && R.analitica?.includes(got.analitica), `${R.criterio} || ${R.analitica}`);
    await pg.reload(); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 30000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]');
    R = await leer(n);
    ok(`F26 · ${etiqueta}: lo mismo tras recargar`, celdaOk(R, nota) && R.criterio?.startsWith(got.criterio) && R.analitica?.includes(got.analitica), JSON.stringify(R));
  };
  const abrir = async (n) => { await pg.evaluate(() => { location.hash = '#panel/examenes'; }); await elegir(); await pg.waitForSelector(`td[data-celda="${id}"][data-n="${n}"]`, { timeout: 20000 }); await pg.click(`td[data-celda="${id}"][data-n="${n}"]`); await pg.waitForSelector('#apDetalle .ap-resp li', { timeout: 15000 }); await pg.waitForTimeout(300); };

  // 0 · «Corregir» automático (en la pestaña Exámenes)
  await pg.evaluate(() => { location.hash = '#panel/examenes'; }); await elegir(); await pg.waitForSelector(`th[data-col="${id}"] [data-ap=autocorregir]`, { timeout: 20000 });
  await pg.click(`th[data-col="${id}"] [data-ap=autocorregir]`); await esperar(31, 3.33);
  // CE1: t1 0 + c1 0 = 0/2 → 0 · CE2: v1 1/1 → 10
  await verTodo('autocorrección', 31, 3.33, { ce1: 0, ce2: 10, criterio: '0|10', analitica: '0 0/2 pt' });
  await foto(pg, 'n01_examenes_autocorregido');

  // 1 · Dar por válida (vista normal)
  await abrir(31); await pg.click('#apDetalle [data-ap=ajValida][data-qid=t1]'); await esperar(31, 6.67);
  await foto(pg, 'n02_valida_normal');
  await verTodo('«Dar por válida» (vista normal)', 31, 6.67, { ce1: 5, ce2: 10, criterio: '5|10', analitica: '5 1/2 pt' });

  // 2 · Aplicar puntos 0,5 en c1 (vista normal)
  await abrir(31); await pg.fill('#apDetalle .ap-qpts[data-qid=c1]', '0.5'); await pg.click('#apDetalle [data-ap=ajPuntos][data-qid=c1]'); await esperar(31, 8.33);
  await verTodo('«Aplicar puntos» (vista normal)', 31, 8.33, { ce1: 7.5, ce2: 10, criterio: '7,5|10', analitica: '7,5 1,5/2 pt' });

  // 3 · Deshacer c1 desde el examen completo
  await abrir(31); await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal [data-rv=deshacer][data-qid=c1]', { timeout: 10000 });
  await pg.click('.rv-modal [data-rv=deshacer][data-qid=c1]'); await esperar(31, 6.67);
  await foto(pg, 'n03_examen_completo_deshacer'); await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  await verTodo('«Deshacer» (examen completo)', 31, 6.67, { ce1: 5, ce2: 10, criterio: '5|10', analitica: '5 1/2 pt' });

  // 4 · Dar por válida c1 desde el examen completo
  await abrir(31); await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal [data-rv=valida][data-qid=c1]', { timeout: 10000 });
  await pg.click('.rv-modal [data-rv=valida][data-qid=c1]'); await esperar(31, 10); await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  await verTodo('«Dar por válida» (examen completo)', 31, 10, { ce1: 10, ce2: 10, criterio: '10|10', analitica: '10 2/2 pt' });

  // 5 · Aplicar puntos desde el examen completo (c1 → 1)
  await abrir(31); await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal [data-rv=puntos][data-qid=c1]', { timeout: 10000 });
  await pg.fill('.rv-modal .ap-qpts[data-qid=c1]', '0'); await pg.click('.rv-modal [data-rv=puntos][data-qid=c1]'); await esperar(31, 6.67); await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  await verTodo('«Aplicar puntos» (examen completo)', 31, 6.67, { ce1: 5, ce2: 10, criterio: '5|10', analitica: '5 1/2 pt' });

  // 6 · Válida para todos (31 y 34) → el 34 también cambia en todas las vistas
  await abrir(31); await pg.click('#apDetalle [data-ap=ajDeshacer][data-qid=t1]'); await esperar(31, 3.33);
  await abrir(31); await pg.click('#apDetalle [data-ap=ajTodos][data-qid=t1]'); await esperar(31, 6.67); const n34 = await esperar(34, 6.67);
  ok('F26 · «Válida para todos»: el 34 recibe el ajuste en su nota', nv(n34) === 6.67, String(nv(n34)));
  await verTodo('«Válida para todos» (34)', 34, 6.67, { ce1: 5, ce2: 10, criterio: '5|10', analitica: '5 1/2 pt' });

  // 6b · SIN pulsar ningún botón: escribir puntos y salir de la casilla (Tab) guarda solo, en la vista normal y en el examen completo
  await abrir(31); await pg.fill('#apDetalle .ap-qpts[data-qid=c1]', '0.5'); await pg.keyboard.press('Tab'); await esperar(31, 8.33);
  await verTodo('puntos escritos + salir de la casilla (vista normal, sin pulsar nada)', 31, 8.33, { ce1: 7.5, ce2: 10, criterio: '7,5|10', analitica: '7,5 1,5/2 pt' });
  await abrir(31); await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal .ap-qpts[data-qid=c1]', { timeout: 10000 });
  await pg.fill('.rv-modal .ap-qpts[data-qid=c1]', '1'); await pg.keyboard.press('Tab'); await esperar(31, 10);
  await pg.waitForFunction(() => /Nota guardada: 10/.test(document.querySelector('.rv-res')?.textContent || ''), null, { timeout: 10000 });
  ok('F26 · examen completo: al escribir puntos y salir de la casilla, «Nota guardada» ya es la nueva (10)', true);
  await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  await verTodo('puntos escritos + salir de la casilla (examen completo)', 31, 10, { ce1: 10, ce2: 10, criterio: '10|10', analitica: '10 2/2 pt' });

  // 7 · Puntos escritos a mano en el cuaderno + «Guardar nota» (el flujo clásico) y nota publicada que el alumno ve
  await abrir(31); await pg.fill('#apDetalle .ap-qpts[data-qid=c1]', '1'); await pg.check('#apNotaForm [name=publicada]'); await pg.click('#apNotaForm button[type=submit]'); await esperar(31, 10);
  await verTodo('puntos a mano + «Guardar nota»', 31, 10, { ce1: 10, ce2: 10, criterio: '10|10', analitica: '10 2/2 pt' });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.rb-nota', { timeout: 20000 }); await A.pg.waitForTimeout(500);
  ok('F26 · el alumno ve la misma nota que el profesor (10)', /10/.test(await A.pg.textContent('.rb-nota')), await A.pg.textContent('.rb-nota'));
  ok('F26 · las respuestas del alumno no cambian', JSON.stringify((await docREST('trabajos/' + tid(31))).fields.respuestas) === resp31);
  await foto(pg, 'n04_final');
  // 8 · examen con respuesta abierta y rúbrica: pulsar un nivel guarda la nota solo (sin «Guardar nota»)
  const EX2 = { formato: 'superprofe/elemento@1', tipo: 'examen', seccion: 'examenes', titulo: 'Notas F26 · tema 5', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: false },
    preguntas: [{ id: 't1', tipo: 'test', enunciado: '¿Unidad de tensión?', opciones: ['Voltio', 'Ohmio'], correcta: 0 },
      { id: 'abi', tipo: 'abierta', enunciado: 'Explica la ley de Ohm', extension: 'corta', rubrica: [{ c: 'Explica la relación', p: 2 }] }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EX2); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EX2.titulo}")`, { timeout: 15000 });
  const id2 = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EX2.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id2);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id2}"]`, { timeout: 15000 });
  await A.pg.goto(BASE + '#trabajo/' + id2); await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  await A.pg.click('[data-au=empezar]'); await A.pg.waitForSelector('#auExamen fieldset[data-q=t1]', { timeout: 20000 });
  await A.pg.check('fieldset[data-q=t1] input[value="0"]'); await A.pg.fill('fieldset[data-q=abi] [contenteditable], fieldset[data-q=abi] textarea, fieldset[data-q=abi] input', 'Es V = I · R').catch(() => { });
  await A.pg.waitForTimeout(800); await A.pg.click('#auExamen button[type=submit]'); await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  await pg.evaluate(() => { location.hash = '#panel/examenes'; }); await elegir();
  await pg.waitForSelector(`th[data-col="${id2}"] [data-ap=autocorregir]`, { timeout: 20000 }); await pg.click(`th[data-col="${id2}"] [data-ap=autocorregir]`);
  const tid2 = `${id2}_${T.GE.id}_31`; const esp2 = async (val) => { let d = null; for (let i = 0; i < 25; i++) { d = await docREST('notas/' + tid2); if (nv(d) === val) return d; await new Promise((r) => setTimeout(r, 300)); } return d; };
  await esp2(3.33);
  await pg.click(`td[data-celda="${id2}"][data-n="31"]`); await pg.waitForSelector('#apDetalle [data-ap-qn^="abi|0|"]', { timeout: 15000 });
  await pg.click('#apDetalle [data-ap-qn="abi|0|2"]'); const n2 = await esp2(10);
  ok('F26 · respuesta abierta: pulsar el nivel guarda la nota solo (10) y el cuaderno la muestra', nv(n2) === 10, String(nv(n2)));
  await pg.waitForFunction((s) => /^10/.test(document.querySelector(s)?.textContent.trim() || ''), `td[data-celda="${id2}"][data-n="31"]`, { timeout: 10000 });
  await pg.evaluate(() => { location.hash = '#panel/notas'; }); await elegir(); await pg.waitForSelector(`td[data-celda="${id2}"][data-n="31"]`, { timeout: 20000 });
  ok('F26 · respuesta abierta: el Cuaderno también muestra 10', /^10/.test((await pg.textContent(`td[data-celda="${id2}"][data-n="31"]`)).trim()));
  await foto(pg, 'n05_abierta_rubrica');
  await A.ctx.close();
}
