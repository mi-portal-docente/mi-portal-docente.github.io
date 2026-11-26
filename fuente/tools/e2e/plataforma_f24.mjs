// Fase 24 · Una clase = un código (PIP-11): unir un grupo duplicado (vista previa, unir, el alumno entra con el
// código de la clase principal y ve Proyecto, el código duplicado queda cerrado, separar = deshacer), añadir y quitar
// asignaturas de una clase desde su tarjeta, y alumnos de alta y baja por nº de lista. Nada se borra.
import { readFileSync, mkdirSync } from 'node:fs';
const CAP = process.env.CAP_CLASE || '/workspace/capturas-clase/';
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const arr = (d, k) => (d?.fields?.[k]?.arrayValue?.values || []).map((v) => v.stringValue);
const bool = (d, k) => d?.fields?.[k]?.booleanValue;
export default async function ({ T, BASE, ok, docREST, pegarJSON, guardarJSON }) {
  try { mkdirSync(CAP, { recursive: true }); } catch (e) { /* ya existe */ }
  const foto = (p, n) => p.screenshot({ path: CAP + n + '.png' });
  const pg = T.P.pg;
  async function crearGrupo(nombre, asigs) {
    await pg.setViewportSize({ width: 1440, height: 900 }); await pg.goto(BASE + '#panel/grupos'); await pg.reload();
    await pg.waitForFunction(() => [...(document.querySelector('#pnGrupoForm [name=curso]')?.options || [])].some((o) => o.textContent.includes('2026/27')), null, { timeout: 20000 });
    await pg.evaluate(() => { const s = document.querySelector('#pnGrupoForm [name=curso]'); const o = [...s.options].find((x) => x.textContent.includes('2026/27')); if (s.value !== o.value) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } });
    await pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
    await pg.fill('#pnGrupoForm [name=nombre]', nombre); await pg.fill('#pnGrupoForm [name=alumnos]', '8');
    for (const cb of await pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if (asigs.includes(v) !== await cb.isChecked()) await cb.click(); }
    await pg.click('#pnGrupoForm button[type=submit]');
    await pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 20000 }).catch(async (e) => { await foto(pg, 'debug_f24_grupo'); throw new Error('crear grupo: ' + (await pg.textContent('#pnFormMsg').catch(() => '?')) + ' · ' + e.message.split('\n')[0]); });
    return pg.evaluate((n) => { const g = [...document.querySelectorAll('.pn-grupo')].find((x) => x.querySelector('h3').textContent === n); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; }, nombre);
  }
  const GA = await crearGrupo('3º CFGB', ['eee']);
  const GP = await crearGrupo('3º CFGB Proyecto', ['proy2']);
  // tarea de Proyecto creada cuando la clase estaba duplicada (va para los grupos con Proyecto)
  const EL = JSON.parse(readFileSync(new URL('../src/lms/semilla/despacho_ejemplo.json', import.meta.url))); EL.titulo = 'Despacho F24 · clase'; EL.seccion = 'tareas';
  await pg.goto(BASE + '#asig/proy2/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  let it = await docREST('items/' + id);
  ok('F24 · antes: la tarea de Proyecto es del duplicado y no de la clase de EEE', arr(it, 'grupos').includes(GP.id) && !arr(it, 'grupos').includes(GA.id));

  // alumno nº 4 con el código de EEE: no ve la tarea de Proyecto
  const A = await T.alumno(GA, 4, '4321', { width: 1280, height: 820 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.au-vacio, .dv-board', { timeout: 20000 });
  ok('F24 · antes: con el código de EEE no se ve la tarea de Proyecto', !!(await A.pg.$('.au-vacio')));
  await A.ctx.close();

  // ---- Unir: vista previa
  await pg.goto(BASE + '#panel/grupos'); await pg.waitForSelector('#clUnir [data-cl-u=principal]', { timeout: 15000 });
  await pg.selectOption('#clUnir [data-cl-u=principal]', GA.id); await pg.selectOption('#clUnir [data-cl-u=duplicado]', GP.id);
  await pg.click('#clUnir [data-pn=unirVer]'); await pg.waitForSelector('#clUnir .cl-prev', { timeout: 15000 });
  const prev = await pg.textContent('#clUnir .cl-prev');
  ok('F24 · vista previa: Proyecto pasa a la clase principal y la tarea se ve también allí', /tendrá también: Proyecto/.test(prev) && /Despacho F24/.test(prev) && /no se borra nada|No se borra nada/i.test(prev), prev.slice(0, 300));
  it = await docREST('items/' + id);
  ok('F24 · la vista previa no cambia nada', !arr(it, 'grupos').includes(GA.id));
  await pg.locator('#clUnir').scrollIntoViewIfNeeded(); await foto(pg, '05_unir_vista_previa');
  await pg.click('#clUnir [data-pn=unirAplicar]'); await pg.waitForFunction(() => /Hecho/.test(document.querySelector('#clUnir .cl-msg')?.textContent || ''), null, { timeout: 15000 });
  const [gA, gP, cA, cP] = await Promise.all([docREST('grupos/' + GA.id), docREST('grupos/' + GP.id), docREST('codigos/' + GA.codigo), docREST('codigos/' + GP.codigo)]);
  it = await docREST('items/' + id);
  ok('F24 · unir: la clase principal tiene EEE y Proyecto (grupo y código)', arr(gA, 'asignaturas').join() === 'eee,proy2' && arr(cA, 'asignaturas').join() === 'eee,proy2');
  ok('F24 · unir: el duplicado sigue existiendo, cerrado y marcado (no se borra)', !gP.error && bool(gP, 'activo') === false && bool(cP, 'activo') === false && arr(gP, 'apartados').some((x) => x.startsWith('union:' + GA.id)) && arr(gP, 'asignaturas').join() === 'proy2');
  ok('F24 · unir: la tarea es de las dos clases (solo se añade; visible = grupos)', arr(it, 'grupos').includes(GA.id) && arr(it, 'grupos').includes(GP.id) && arr(it, 'visible').join() === arr(it, 'grupos').join());
  await pg.waitForSelector(`.pn-grupo[data-grupo="${GP.id}"] .cl-unida`, { timeout: 10000 });
  ok('F24 · tarjeta del duplicado: «Unida a 3º CFGB»', /Unida a 3º CFGB/.test(await pg.textContent(`.pn-grupo[data-grupo="${GP.id}"] .cl-unida`)));
  await foto(pg, '06_unir_hecho');

  // alumno con el código de la clase principal: ve Proyecto y su tablero
  const A2 = await T.alumno(GA, 4, '4321', { width: 1280, height: 820 });
  await A2.pg.goto(BASE + '#asig/proy2/tareas');
  const enLista = await A2.pg.waitForSelector(`a.cl-it[data-item="${id}"]`, { timeout: 20000 }).then(() => true).catch(() => false);
  ok('F24 · después: con el mismo código, nº y PIN el alumno ve Proyecto › Tareas con la tarea', enLista);
  await A2.pg.goto(BASE + '#trabajo/' + id); const vio = await A2.pg.waitForSelector('.dv-board', { timeout: 20000 }).then(() => true).catch(() => false);
  ok('F24 · después: abre el tablero del Despacho', vio);
  await A2.ctx.close();
  // ---- Separar (deshacer)
  await pg.click(`#clUnir .cl-unidos li[data-grupo="${GP.id}"] [data-pn=separar]`);
  await pg.waitForFunction(() => /Separadas/.test(document.querySelector('#clUnir .cl-msg')?.textContent || ''), null, { timeout: 15000 });
  const [gA2, gP2] = await Promise.all([docREST('grupos/' + GA.id), docREST('grupos/' + GP.id)]); it = await docREST('items/' + id);
  ok('F24 · separar: todo vuelve como estaba (asignaturas, duplicado abierto, tarea solo del duplicado)', arr(gA2, 'asignaturas').join() === 'eee' && bool(gP2, 'activo') === true && !arr(gP2, 'apartados').some((x) => x.startsWith('union:')) && !arr(it, 'grupos').includes(GA.id) && arr(it, 'grupos').includes(GP.id));

  // ---- Añadir y quitar asignaturas desde la tarjeta de la clase
  const card = `.pn-grupo[data-grupo="${GA.id}"]`;
  await pg.selectOption(`${card} [data-pn-asig]`, 'proy2'); await pg.click(`${card} [data-pn=ponerAsig]`);
  await pg.waitForFunction((c) => /añadida/.test(document.querySelector(c + ' .cl-msg')?.textContent || ''), card, { timeout: 15000 });
  const gA3 = await docREST('grupos/' + GA.id); it = await docREST('items/' + id);
  ok('F24 · añadir Proyecto a la clase: mismo código y la tarea de Proyecto pasa a la clase', arr(gA3, 'asignaturas').join() === 'eee,proy2' && arr(it, 'grupos').includes(GA.id) && arr(it, 'grupos').includes(GP.id));
  await pg.locator(card).scrollIntoViewIfNeeded(); await foto(pg, '07_tarjeta_asignaturas');
  await pg.click(`${card} [data-pn=quitarAsig][data-asig=proy2]`);
  await pg.waitForFunction((c) => /ya no está/.test(document.querySelector(c + ' .cl-msg')?.textContent || ''), card, { timeout: 15000 });
  const gA4 = await docREST('grupos/' + GA.id); it = await docREST('items/' + id);
  ok('F24 · quitar Proyecto: la clase vuelve a solo EEE y no se toca ninguna tarea', arr(gA4, 'asignaturas').join() === 'eee' && arr(it, 'grupos').includes(GA.id));

  // ---- Alumnos: alta y baja (conserva nº, PIN y datos)
  await pg.click(`${card} [data-pn=altas]`); await pg.waitForSelector(`${card} .cl-altas`, { timeout: 10000 });
  ok('F24 · alumnos: lista del 1 al 8 con su estado y PIN', (await pg.$$(`${card} .cl-num`)).length === 8 && /Con PIN/.test(await pg.textContent(`${card} .cl-num[data-usu="${GA.id}_4"]`)));
  await pg.click(`${card} .cl-num[data-usu="${GA.id}_6"] [data-pn=baja]`);
  await pg.waitForSelector(`${card} .cl-num.baja[data-usu="${GA.id}_6"]`, { timeout: 10000 });
  const bq = await docREST(`bloqueos/${GA.id}_6`);
  ok('F24 · dar de baja el nº 06: queda «De baja» (bloqueos) sin borrar nada', !bq.error && /De baja/.test(await pg.textContent(`${card} .cl-num[data-usu="${GA.id}_6"]`)));
  await foto(pg, '08_alumnos_alta_baja');
  await pg.click(`${card} .cl-num[data-usu="${GA.id}_6"] [data-pn=alta]`);
  await pg.waitForSelector(`${card} .cl-num[data-usu="${GA.id}_6"]:not(.baja)`, { timeout: 10000 });
  const bq2 = await docREST(`bloqueos/${GA.id}_6`);
  ok('F24 · dar de alta el nº 06: vuelve a entrar con su PIN de siempre', !!bq2.error);
  const pin4 = await docREST(`pines/${GA.id}_4`);
  ok('F24 · los PIN siguen en su sitio', !pin4.error);
  // móvil y modo oscuro
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.evaluate(() => { document.documentElement.dataset.theme = 'dark'; }); await pg.locator(card).scrollIntoViewIfNeeded(); await foto(pg, '09_movil_oscuro_tarjeta');
  await pg.locator('#clUnir').scrollIntoViewIfNeeded(); await foto(pg, '10_movil_oscuro_unir');
  await pg.evaluate(() => { delete document.documentElement.dataset.theme; }); await pg.setViewportSize({ width: 1440, height: 900 });
  await pg.click(`${card} [data-pn=altas]`);
}
