// Fase 23 · «Despacho virtual» en Proyecto (asignatura con secciones, apartado Tareas): el profesor ve el tablero
// («Probar como alumno», sin guardar nada, con llamada simulada) y el alumno del mismo grupo/código lo abre desde
// Proyecto › Tareas. Aviso «Ningún grupo la ve» cuando ninguna clase tiene la asignatura. Capturas en /workspace/capturas-clase/.
import { readFileSync, mkdirSync } from 'node:fs';
const CAP = process.env.CAP_CLASE || '/workspace/capturas-clase/';
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
export default async function ({ T, BASE, ok, docREST, pegarJSON, guardarJSON, REST, owner }) {
  try { mkdirSync(CAP, { recursive: true }); } catch (e) { /* ya existe */ }
  const foto = (p, n) => p.screenshot({ path: CAP + n + '.png' });
  const pg = T.P.pg;
  const EL = JSON.parse(readFileSync(new URL('../src/lms/semilla/despacho_ejemplo.json', import.meta.url)));
  EL.titulo = 'Despacho F23 · Proyecto'; EL.seccion = 'tareas';
  await pg.goto(BASE + '#asig/proy2/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  const item = JSON.stringify(await docREST('items/' + id));
  ok('F23 · despacho importado en Proyecto (proy2), sección Tareas, visible para el grupo de EEE y Proyecto', /"proy2"/.test(item) && /"tareas"/.test(item) && item.includes(T.GE.id));

  // ---- Profesor: la página del elemento ofrece «Probar como alumno»
  await pg.goto(BASE + '#trabajo/' + id); await pg.waitForSelector('#dvProf [data-au=dvProbar]', { timeout: 15000 });
  ok('F23 · profesor: la tarea muestra «Tablero del alumno» con «Probar como alumno»', /Probar como alumno/.test(await pg.textContent('#dvProf')));
  ok('F23 · profesor: sin aviso «Ningún grupo la ve» (el grupo tiene Proyecto)', !(await pg.$('.au-sin-grupo')));
  await pg.click('[data-au=dvProbar]'); await pg.waitForSelector('#dvPrueba .dv-board', { timeout: 10000 });
  ok('F23 · profesor: se abre el tablero con 15 trabajos y la barra de prueba', (await pg.$$('#dvPrueba .dv-chip.t')).length === 15 && /prueba sin guardar/.test(await pg.textContent('#dvPruebaOn')));
  // colocar un trabajo con el teclado/toque (elegir etiqueta → día y hora)
  const t0 = await pg.getAttribute('#dvPrueba .dv-chip.t', 'data-id');
  await pg.click(`#dvPrueba .dv-chip.t[data-id="${t0}"]`); await pg.waitForSelector('#dvPrueba [data-dv=colocar]'); await pg.click('#dvPrueba [data-dv=colocar]');
  await pg.waitForSelector(`#dvPrueba .dv-blk[data-id="${t0}"]`, { timeout: 5000 });
  ok('F23 · profesor: puede colocar un trabajo en el tablero de prueba', /Trabajos colocados 1\//.test(await pg.textContent('#dvPrueba .dv-cnt1')));
  await pg.waitForTimeout(1500); // el repintado del aula no debe cerrar la prueba
  ok('F23 · la prueba sigue abierta tras los repintados del aula', !!(await pg.$(`#dvPrueba .dv-blk[data-id="${t0}"]`)));
  await foto(pg, '01_profesor_probar_despacho');
  await pg.click('[data-au=dvLlamada][data-k="0"]'); await pg.waitForSelector('.dv-modal [data-m=ok]', { timeout: 5000 });
  ok('F23 · profesor: «Llamada 1» simulada abre la ventana de la centralita', /Llamada de la centralita/.test(await pg.textContent('.dv-modal')));
  await foto(pg, '02_profesor_llamada_simulada');
  await pg.click('.dv-modal [data-m=ok]');
  const otra = await pg.$$eval('#dvPruebaOn [data-au-dv=emp] option', (o) => o[1]?.value);
  await pg.selectOption('#dvPruebaOn [data-au-dv=emp]', otra); await pg.waitForFunction(() => /Trabajos colocados 0\//.test(document.querySelector('#dvPrueba .dv-cnt1')?.textContent || ''), null, { timeout: 5000 });
  ok('F23 · profesor: cambiar de empresa empieza un tablero vacío', true);
  const tr = await docREST(`trabajos/${id}_${T.GE.id}_0`);
  ok('F23 · la prueba del profesor no escribe nada en Firestore', !!tr.error || !tr.fields);
  await pg.click('[data-au=dvFin]'); await pg.waitForSelector('#dvProf [data-au=dvProbar]', { timeout: 5000 });
  ok('F23 · «Cerrar la prueba» vuelve a la ficha', !(await pg.$('#dvPruebaOn')));

  // ---- Alumno del mismo código (2º CFGB: EEE + Proyecto): Proyecto › Tareas › tablero
  const A = await T.alumno(T.GE, 5, '4321', { width: 1366, height: 820 });
  await A.pg.goto(BASE + '#asig/proy2/tareas');
  const enLista = await A.pg.waitForSelector(`a.cl-it[data-item="${id}"]`, { timeout: 20000 }).then(() => true).catch(() => false);
  ok('F23 · alumno: la tarea aparece en Proyecto › Tareas', enLista, enLista ? '' : (await A.pg.evaluate(() => document.body.innerText)).slice(0, 400).replace(/\n+/g, ' | '));
  await A.pg.goto(BASE + '#trabajo/' + id);
  const vio = await A.pg.waitForSelector('.dv-board', { timeout: 20000 }).then(() => true).catch(() => false);
  ok('F23 · alumno: al abrir la tarea ve el tablero con sus etiquetas', vio && (await A.pg.$$('.dv-chip.t')).length === 15);
  await foto(A.pg, '03_alumno_proyecto_tablero');
  await A.ctx.close();

  // ---- Aviso cuando ninguna clase tiene la asignatura (elemento con grupos = [])
  await fetch(`${REST}/items/${id}?updateMask.fieldPaths=grupos`, { method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { grupos: { arrayValue: {} } } }) });
  await pg.goto(BASE + '#asig/proy2/trabajo'); await pg.waitForTimeout(500); await pg.goto(BASE + '#trabajo/' + id);
  const aviso = await pg.waitForSelector('.au-sin-grupo a[href="#panel/grupos"]', { timeout: 15000 }).then(() => true).catch(() => false);
  ok('F23 · elemento sin grupos: aviso «Ningún grupo la ve» con enlace a Grupos y códigos', aviso);
  await foto(pg, '04_profesor_aviso_sin_grupo');
  await fetch(`${REST}/items/${id}?updateMask.fieldPaths=grupos`, { method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { grupos: { arrayValue: { values: [{ stringValue: T.GE.id }] } } } }) });
  T.idDespachoProy = id;
}
