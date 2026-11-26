// Fase 25 · Alta y baja de un nº de lista EN UNA asignatura de la clase (PIP-11, parte C): el nº 5 sigue en EEE pero no en
// Proyecto. Con el mismo código, nº y PIN no ve Proyecto ni sus tareas; el resto de la clase no cambia; el profesor conserva su
// trabajo (marcado) y lo recupera al dar de alta. Nada se borra y no hay reglas nuevas.
import { mkdirSync } from 'node:fs';
const CAP = process.env.CAP_CLASE || '/workspace/capturas-clase/';
const arr = (d, k) => (d?.fields?.[k]?.arrayValue?.values || []).map((v) => v.stringValue);
export default async function ({ T, BASE, ok, docREST, pegarJSON, guardarJSON }) {
  try { mkdirSync(CAP, { recursive: true }); } catch (e) { /* ya existe */ }
  const foto = (p, n) => p.screenshot({ path: CAP + n + '.png' });
  const pg = T.P.pg;
  await pg.setViewportSize({ width: 1440, height: 900 }); await pg.goto(BASE + '#panel/grupos'); await pg.reload();
  await pg.waitForFunction(() => [...(document.querySelector('#pnGrupoForm [name=curso]')?.options || [])].some((o) => o.textContent.includes('2026/27')), null, { timeout: 20000 });
  await pg.evaluate(() => { const s = document.querySelector('#pnGrupoForm [name=curso]'); const o = [...s.options].find((x) => x.textContent.includes('2026/27')); if (s.value !== o.value) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } });
  await pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
  await pg.fill('#pnGrupoForm [name=nombre]', '4º CFGB'); await pg.fill('#pnGrupoForm [name=alumnos]', '8');
  for (const cb of await pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if (['eee', 'proy2'].includes(v) !== await cb.isChecked()) await cb.click(); }
  await pg.click('#pnGrupoForm button[type=submit]');
  await pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 20000 });
  const G = await pg.evaluate(() => { const g = [...document.querySelectorAll('.pn-grupo')].find((x) => x.querySelector('h3').textContent === '4º CFGB'); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; });

  // una tarea publicada en cada asignatura
  async function tarea(asig, titulo) {
    await pg.goto(BASE + '#asig/' + asig + '/gestion'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
    await pegarJSON(pg, { tipo: 'tarea', titulo, texto: 'Hazla.', puntos: 10, publicar: true, seccion: 'tareas' }); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
    await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${titulo}")`, { timeout: 15000 });
    const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${titulo}")`, 'data-item');
    await pg.evaluate((i) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=editar]`).click(), id); await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
    await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
    await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
    return id;
  }
  const idP = await tarea('proy2', 'Tarea F25 proyecto'); const idE = await tarea('eee', 'Tarea F25 EEE');
  // el profesor pone una nota al nº 5 en Proyecto (trabajo que debe conservarse)
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]'); await pg.selectOption('[data-ap-f=gGrupo]', G.id);
  await pg.waitForSelector('[data-ap-f=gAsig]'); await pg.selectOption('[data-ap-f=gAsig]', 'proy2'); await pg.waitForSelector(`td[data-celda="${idP}"][data-n="5"]`, { timeout: 15000 });
  await pg.click(`td[data-celda="${idP}"][data-n="5"]`); await pg.waitForSelector('#apNotaForm');
  await pg.fill('#apNota', '7'); await pg.check('#apNotaForm [name=publicada]'); await pg.click('#apNotaForm button[type=submit]');
  await pg.waitForFunction(() => /Guardado/.test(document.querySelector('#apNotaMsg')?.textContent || ''), null, { timeout: 15000 });
  const filasP = async () => pg.$$eval('.ap-tabla tbody tr', (tr) => tr.map((r) => ({ n: r.querySelector('th').textContent.trim(), baja: r.classList.contains('ap-baja') })));
  ok('F25 · por defecto: el cuaderno de Proyecto lista los 8 nº, ninguno de baja', (await filasP()).length === 8 && (await filasP()).every((f) => !f.baja));

  // alumnos 5 y 4: ven EEE y Proyecto con la tarea
  const A5 = await T.alumno(G, 5, '5555', { width: 1280, height: 820 }); const A4 = await T.alumno(G, 4, '4444', { width: 1280, height: 820 });
  const veTarea = async (A, asig, id) => { await A.pg.goto(BASE + '#asig/' + asig + '/tareas'); await A.pg.waitForTimeout(600); return A.pg.waitForSelector(`a.cl-it[data-item="${id}"]`, { timeout: 12000 }).then(() => true).catch(() => false); };
  const itP = await docREST('items/' + idP); ok('F25 · la tarea de Proyecto es de la clase', arr(itP, 'grupos').includes(G.id) && arr(itP, 'visible').includes(G.id), JSON.stringify(itP.fields?.visible) + JSON.stringify(itP.fields?.grupos));
  ok('F25 · antes: el nº 5 ve la tarea de Proyecto y la de EEE', await veTarea(A5, 'proy2', idP) && await veTarea(A5, 'eee', idE));
  ok('F25 · antes: el nº 4 ve la tarea de Proyecto y la de EEE', await veTarea(A4, 'proy2', idP) && await veTarea(A4, 'eee', idE));

  // ---- Tarjeta de la clase: Alumnos › alta y baja por asignatura
  await pg.goto(BASE + '#panel/grupos'); const card = `.pn-grupo[data-grupo="${G.id}"]`;
  await pg.waitForSelector(`${card} [data-pn=altas]`, { timeout: 15000 }); await pg.click(`${card} [data-pn=altas]`); await pg.waitForSelector(`${card} .mt-t`, { timeout: 10000 });
  ok('F25 · tarjeta: tabla nº × asignatura (EEE y Proyecto), todos de alta', (await pg.$$(`${card} .mt-sw`)).length === 16 && (await pg.$$(`${card} .mt-sw.baja`)).length === 0);
  await foto(pg, 'c_01_tarjeta_matricula');
  await pg.click(`${card} .mt-sw[data-a=proy2][data-n="5"]`);
  await pg.waitForSelector(`${card} .mt-sw.baja[data-a=proy2][data-n="5"]`, { timeout: 15000 });
  const [gd, cd, bq] = await Promise.all([docREST('grupos/' + G.id), docREST('codigos/' + G.codigo), docREST(`bloqueos/${G.id}_5`)]);
  ok('F25 · baja del nº 5 en Proyecto: marca en grupo y código, sin bloquear al alumno', arr(gd, 'apartados').includes('baja:proy2:5') && arr(cd, 'apartados').includes('baja:proy2:5') && !!bq.error && arr(cd, 'asignaturas').length === 2, JSON.stringify([arr(gd, 'apartados'), arr(cd, 'apartados'), bq.error?.code, arr(cd, 'asignaturas')]));
  ok('F25 · solo cambia el nº 5 de Proyecto (EEE y el resto siguen de alta)', (await pg.$$(`${card} .mt-sw.baja`)).length === 1 && !(await pg.$(`${card} .mt-sw.baja[data-a=eee]`)));
  await foto(pg, 'c_02_tarjeta_baja_proyecto');
  // móvil y modo oscuro
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await pg.locator(`${card} .mt-clase`).scrollIntoViewIfNeeded(); await foto(pg, 'c_06_movil_oscuro_matricula');
  await pg.evaluate(() => { delete document.documentElement.dataset.theme; }); await pg.setViewportSize({ width: 1440, height: 900 });

  // ---- El alumno 5 (sin recargar): Proyecto desaparece, EEE sigue
  await A5.pg.waitForFunction(() => window.PORTAL_SESION && !window.PORTAL_SESION.asignaturas.includes('proy2') && window.PORTAL_SESION.asignaturas.includes('eee'), null, { timeout: 15000 });
  ok('F25 · el nº 5 deja de tener Proyecto al momento y conserva EEE', true);
  ok('F25 · el nº 5 sigue viendo EEE y su tarea', await veTarea(A5, 'eee', idE));
  ok('F25 · el nº 5 ya no ve la tarea de Proyecto', !(await veTarea(A5, 'proy2', idP)));
  await A5.pg.goto(BASE + '#asignaturas'); await A5.pg.waitForTimeout(800);
  const hrefs = await A5.pg.$$eval('a[href^="#asig/"]', (a) => a.map((x) => x.getAttribute('href').split('/')[1]));
  ok('F25 · el nº 5 no tiene Proyecto en su lista de asignaturas', !hrefs.includes('proy2') && hrefs.includes('eee'), hrefs.join());
  await foto(A5.pg, 'c_03_alumno_baja_proyecto');
  ok('F25 · el nº 4 sigue viendo las dos', await veTarea(A4, 'proy2', idP) && await veTarea(A4, 'eee', idE));
  // entrar de nuevo con el mismo código, nº y PIN
  await A5.ctx.close(); const A5b = await T.alumno(G, 5, '5555', { width: 1280, height: 820 });
  ok('F25 · al volver a entrar el nº 5 sigue sin Proyecto y con EEE', !(await veTarea(A5b, 'proy2', idP)) && await veTarea(A5b, 'eee', idE));
  await A5b.pg.goto(BASE + '#trabajo/' + idP); await A5b.pg.waitForTimeout(1200);
  ok('F25 · y no abre la tarea de Proyecto por su enlace directo', !(await A5b.pg.$(`.au-trabajo, .au-entrega, form[data-au]`)));

  // ---- Profesor: dar de baja también al nº 6 y mirar el cuaderno de Proyecto y EEE
  await pg.click(`${card} .mt-sw[data-a=proy2][data-n="6"]`); await pg.waitForSelector(`${card} .mt-sw.baja[data-a=proy2][data-n="6"]`, { timeout: 15000 });
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]'); await pg.selectOption('[data-ap-f=gGrupo]', G.id);
  await pg.waitForSelector('[data-ap-f=gAsig]'); await pg.selectOption('[data-ap-f=gAsig]', 'proy2'); await pg.waitForSelector(`td[data-celda="${idP}"][data-n="5"]`, { timeout: 15000 });
  let F = await filasP();
  ok('F25 · cuaderno de Proyecto: el nº 6 (de baja, sin trabajo) no sale', !F.some((f) => f.n === '06') && F.length === 7, F.map((f) => f.n).join());
  ok('F25 · cuaderno de Proyecto: el nº 5 (de baja, con nota) sale marcado y conserva su nota', F.find((f) => f.n.startsWith('05'))?.baja === true && /7/.test(await pg.textContent(`td[data-celda="${idP}"][data-n="5"]`)));
  await foto(pg, 'c_04_cuaderno_proyecto_baja');
  await pg.selectOption('[data-ap-f=gAsig]', 'eee'); await pg.waitForSelector(`td[data-celda="${idE}"][data-n="5"]`, { timeout: 15000 });
  F = await filasP(); ok('F25 · cuaderno de EEE: los 8 nº, ninguno de baja', F.length === 8 && F.every((f) => !f.baja));

  // ---- Dentro de la asignatura: «Alumnos de esta asignatura»
  await pg.goto(BASE + '#asig/proy2/gestion'); const det = `details[data-cl-set="mtAb:${G.id}"]`;
  await pg.waitForSelector(`${det} > summary`, { timeout: 10000 }); await pg.click(`${det} > summary`); await pg.waitForSelector(`${det} .mt-n`, { timeout: 10000 });
  ok('F25 · en la asignatura: el nº 5 y el 6 salen «De baja» y el resto «De alta»', (await pg.$$(`${det} .mt-n.baja`)).length === 2 && /De baja/.test(await pg.textContent(`${det} .mt-n[data-n="5"]`)));
  await foto(pg, 'c_05_asignatura_alumnos');
  await pg.click(`${det} .mt-n[data-a=proy2][data-n="6"]`); await pg.waitForSelector(`${det} .mt-n[data-n="6"]:not(.baja)`, { timeout: 15000 });
  ok('F25 · el panel sigue abierto tras cambiar y el nº 6 vuelve a estar de alta', (await pg.$$(`${det} .mt-n.baja`)).length === 1 && await pg.$eval(det, (d) => d.open));
  const c2 = await docREST('codigos/' + G.codigo); ok('F25 · código: solo queda «baja:proy2:5»', arr(c2, 'apartados').filter((x) => x.startsWith('baja:')).join() === 'baja:proy2:5');

  // ---- Dar de alta al nº 5: vuelve todo
  await pg.click(`${det} .mt-n[data-a=proy2][data-n="5"]`); await pg.waitForSelector(`${det} .mt-n.baja`, { state: 'detached', timeout: 15000 });
  const c3 = await docREST('codigos/' + G.codigo); ok('F25 · alta del nº 5: no queda ninguna marca de baja', !arr(c3, 'apartados').some((x) => x.startsWith('baja:')));
  ok('F25 · el nº 5 recupera Proyecto y su tarea', await veTarea(A5b, 'proy2', idP) && await veTarea(A5b, 'eee', idE));
  const nota = await docREST(`notas/${idP}_${G.id}_5`); ok('F25 · su nota de Proyecto estaba intacta', !nota.error && nota.fields?.nota?.integerValue === '7' || nota.fields?.nota?.doubleValue === 7, JSON.stringify(nota.fields?.nota));
  await A5b.ctx.close(); await A4.ctx.close();

  // ---- Editar la clase conserva las marcas; quitar la asignatura las olvida
  await pg.goto(BASE + '#panel/grupos'); await pg.waitForSelector(`${card} [data-pn=altas]`, { timeout: 15000 }); if (!await pg.$(`${card} .mt-sw`)) await pg.click(`${card} [data-pn=altas]`);
  await pg.waitForSelector(`${card} .mt-sw`, { timeout: 10000 }); await pg.click(`${card} .mt-sw[data-a=proy2][data-n="3"]`); await pg.waitForSelector(`${card} .mt-sw.baja[data-a=proy2][data-n="3"]`, { timeout: 15000 });
  await pg.click(`${card} [data-pn=quitarAsig][data-asig=proy2]`);
  await pg.waitForFunction((c) => /ya no está/.test(document.querySelector(c + ' .cl-msg')?.textContent || ''), card, { timeout: 15000 });
  const g4 = await docREST('grupos/' + G.id); const c4 = await docREST('codigos/' + G.codigo);
  ok('F25 · quitar Proyecto de la clase olvida sus bajas (grupo y código)', !arr(g4, 'apartados').some((x) => x.startsWith('baja:')) && !arr(c4, 'apartados').some((x) => x.startsWith('baja:')) && arr(g4, 'asignaturas').join() === 'eee');
}
