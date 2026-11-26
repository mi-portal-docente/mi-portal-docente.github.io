// Fase 21 · «Despacho virtual» (PIAC SA1 T4): importar el JSON, tablero del alumno (arrastrar con ratón, con el dedo
// —eventos de puntero táctiles— y con teclado), avisos, deshacer, guardado, centralita (asignar empresa y lanzar
// llamadas), incidencia con antes/después, resumen al entregar y vista del profesor. Capturas en /workspace/capturas-despacho/.
import { readFileSync, mkdirSync } from 'node:fs';
const CAP = process.env.CAP_DESPACHO || '/workspace/capturas-despacho/';
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? f); };
export default async function ({ T, BASE, ok, docREST, pegarJSON, guardarJSON }) {
  try { mkdirSync(CAP, { recursive: true }); } catch (e) { /* ya existe */ }
  const foto = (p, n) => p.screenshot({ path: CAP + n + '.png' });
  const pg = T.P.pg;
  const EL = JSON.parse(readFileSync(new URL('../src/lms/semilla/despacho_ejemplo.json', import.meta.url)));
  EL.titulo = 'Despacho F21 · Jefe por un día';
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }).catch(async (e) => { throw new Error('importar: ' + (await pg.evaluate(() => (document.querySelector('#jsErr')?.innerText || '') + ' | ' + (document.querySelector('.cl-modal')?.innerText || '').slice(0, 600)))); });
  ok('F21 · importador: la vista previa reconoce el despacho (4 empresas · 60 trabajos · 12 llamadas)', /4 empresas · 60 trabajos · 12 llamadas/.test(await pg.textContent('#jsPrev')), (await pg.textContent('#jsPrev')).slice(0, 200));
  await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  const item = await docREST('items/' + id);
  ok('F21 · el elemento se guarda con tipo «despacho» y sus empresas', campo(item, 'tipo') === 'despacho' && /Limpiezas Brillo/.test(JSON.stringify(item)));

  // ---- Profesor: asigna al nº 21 la empresa «Manitas Hogar» desde la centralita (antes de que empiece)
  const abrirCorreccion = async () => {
    await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
    await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForFunction((g) => document.querySelector('[data-ap-f=gGrupo]')?.value === g && document.querySelector('[data-ap-f=gAsig]'), T.GE.id, { timeout: 15000 });
    if ((await pg.inputValue('[data-ap-f=gAsig]')) !== 'eee') await pg.selectOption('[data-ap-f=gAsig]', 'eee');
    await pg.waitForSelector(`th[data-col="${id}"] [data-ap=corregir]`, { timeout: 15000 }); await pg.click(`th[data-col="${id}"] [data-ap=corregir]`);
    await pg.waitForSelector('#dvCentral .dv-central', { timeout: 15000 });
  };
  await abrirCorreccion();
  ok('F21 · corrección: aparece «Centralita y empresas» con las llamadas de cada empresa', /Centralita y empresas/.test(await pg.textContent('#dvCentral')) && (await pg.$$('#dvCentral [data-cv=lanzarEmp]')).length === 12);
  await pg.selectOption('#dvCentral select[data-cv=asign][data-n="1"]', 'reparaciones');
  await pg.waitForFunction(() => /Manitas Hogar/.test(document.querySelector('#dvCentral .dv-cmsg')?.textContent || ''), null, { timeout: 15000 });
  const cen = await docREST(`despachos/${id}_${T.GE.id}`);
  ok('F21 · la asignación se guarda en despachos/{item}_{grupo} (solo nº de lista e id de empresa)', /reparaciones/.test(JSON.stringify(cen)) && !/@/.test(JSON.stringify(cen)), JSON.stringify(cen).slice(0, 200));
  await foto(pg, '01_profesor_centralita');

  // ---- Alumno nº 1 (portátil)
  const A = await T.alumno(T.GE, 1, '4321', { width: 1366, height: 820 });
  A.pg.on('pageerror', (e) => console.log('PAGEERR', e.message)); A.pg.on('console', (m) => { if (/^dv /.test(m.text())) console.log('CONSOLE', m.text()); }); await A.pg.evaluate(() => { window.DV_DEBUG = 1; });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.dv-board', { timeout: 20000 }).catch(async () => { throw new Error('despacho: ' + (await A.pg.evaluate(() => document.body.innerText)).slice(0, 1200).replace(/\n+/g, ' | ')); });
  await A.pg.waitForFunction(() => /Manitas Hogar/.test(document.querySelector('.dv-emp')?.textContent || ''), null, { timeout: 15000 });
  ok('F21 · el alumno recibe la empresa que le asignó el profesor', true);
  ok('F21 · contador «Trabajos colocados 0/15 · Avisos 0»', /Trabajos colocados 0\/15/.test(await A.pg.textContent('.dv-cnt1')) && /Avisos 0/.test(await A.pg.textContent('.dv-cnt1')));
  ok('F21 · tres listas: 15 trabajos, 6 personas y 4 recursos', (await A.pg.$$('.dv-chip.t')).length === 15 && (await A.pg.$$('.dv-chip.p')).length === 6 && (await A.pg.$$('.dv-chip.r')).length === 4);
  await foto(A.pg, '02_alumno_vacio');
  // arrastrar con el ratón: MT01 (Fontanero/a, 1,5 h, 8:00-12:00) → lunes 9:00
  const fila = async () => A.pg.evaluate(() => { const c = document.querySelector('.dv-col'); return c.getBoundingClientRect().height / ((22 * 60 - 8 * 60) / 30); });
  const arrastrar = async (sel, destino) => {
    const a = await A.pg.$(sel); await a.scrollIntoViewIfNeeded(); const r = await a.boundingBox();
    await A.pg.mouse.move(r.x + r.width / 2, r.y + Math.min(14, r.height / 2)); await A.pg.mouse.down();
    await A.pg.mouse.move(r.x + r.width / 2 + 20, r.y + 20, { steps: 3 });
    const p = await destino(); await A.pg.mouse.move(p.x, p.y, { steps: 8 }); await A.pg.mouse.up(); await A.pg.waitForTimeout(150);
  };
  const celda = (d, hora) => async () => A.pg.evaluate(([d, hora]) => { const sc = document.querySelector('.dv-boardw'); const c = document.querySelector(`.dv-col[data-d="${d}"]`); const fh = c.getBoundingClientRect().height / 28; const y0 = ((hora - 8) * 2) * fh; sc.scrollTop = Math.max(0, y0 - 60); const r0 = sc.getBoundingClientRect(); if (r0.top < 0 || r0.bottom > innerHeight) sc.scrollIntoView({ block: 'end' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + y0 + fh / 2 }; }, [d, hora]);
  const bloque = (tid) => async () => A.pg.evaluate((t) => { const b = document.querySelector(`.dv-blk[data-id="${t}"]`); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + Math.min(12, r.height / 2) }; }, tid);
  await arrastrar('.dv-chip.t[data-id=MT01]', celda(0, 9));
  const tb = async () => A.pg.evaluate(() => { const b = {}; document.querySelectorAll('.dv-blk').forEach((x) => { b[x.dataset.id] = { d: +x.closest('.dv-col').dataset.d, txt: x.querySelector('.dv-b2').textContent, tags: [...x.querySelectorAll('.dv-tag')].map((t) => t.textContent.trim()) }; }); return b; });
  let B = await tb();
  ok('F21 · ratón: MT01 cae el lunes a las 9:00 y ocupa 1,5 h (9:00-10:30)', B.MT01?.d === 0 && /^9:00-10:30/.test(B.MT01.txt), JSON.stringify(B));
  ok('F21 · contador 1/15 y aviso rojo de perfil (no tiene a nadie)', /Trabajos colocados 1\/15/.test(await A.pg.textContent('.dv-cnt1')) && /perfil «Fontanero\/a»/.test(await A.pg.textContent('.dv-avisos')));
  await arrastrar('.dv-chip.p[data-id=M1]', bloque('MT01'));
  await arrastrar('.dv-chip.r[data-id="Furgoneta 1"]', bloque('MT01'));
  B = await tb();
  ok('F21 · ratón: persona M1 y Furgoneta 1 asignadas dentro del bloque', B.MT01.tags.join() === 'M1,Furgoneta 1', B.MT01.tags.join());
  ok('F21 · sin avisos con el bloque bien montado', /Avisos 0/.test(await A.pg.textContent('.dv-cnt1')), await A.pg.textContent('.dv-cnt1'));
  // solape de personal y de recurso: MT08 (Fontanero/a, 2 personas, 8:00-10:00) el lunes a las 9:00 con M1 y Furgoneta 1
  await arrastrar('.dv-chip.t[data-id=MT08]', celda(0, 9));
  await arrastrar('.dv-chip.p[data-id=M1]', bloque('MT08'));
  await arrastrar('.dv-chip.r[data-id="Furgoneta 1"]', bloque('MT08'));
  const av = await A.pg.textContent('.dv-avisos');
  ok('F21 · aviso rojo: la misma persona en dos bloques que se solapan', /M1 está en dos trabajos a la vez/.test(av), av.slice(0, 300));
  ok('F21 · aviso rojo: el mismo recurso en dos bloques que se solapan', /«Furgoneta 1» está en dos trabajos a la vez/.test(av));
  ok('F21 · aviso naranja: nº de personas distinto (MT08 necesita 2)', /MT08.*necesita 2 personas y tiene 1/.test(av));
  ok('F21 · los bloques con avisos rojos se marcan en rojo', await A.pg.$eval('.dv-blk[data-id=MT08]', (b) => b.classList.contains('rojo')));
  await foto(A.pg, '03_alumno_avisos');
  // deshacer (3 veces: recurso, persona, colocación)
  for (let i = 0; i < 3; i++) await A.pg.click('[data-dv=deshacer]');
  B = await tb();
  ok('F21 · Deshacer quita los tres últimos cambios', !B.MT08 && B.MT01 && /Avisos 0/.test(await A.pg.textContent('.dv-cnt1')), JSON.stringify(B));
  // teclado: seleccionar MT02 → miércoles 15:00 → Colocar
  await A.pg.focus('.dv-chip.t[data-id=MT02]'); await A.pg.keyboard.press('Enter');
  await A.pg.waitForSelector('.dv-kbd select[data-k=dia]');
  await A.pg.selectOption('.dv-kbd select[data-k=dia]', '2'); await A.pg.selectOption('.dv-kbd select[data-k=hora]', String(15 * 60)); await A.pg.click('[data-dv=colocar]');
  B = await tb();
  ok('F21 · teclado: elegir etiqueta, día y hora en un menú y «Colocar»', B.MT02?.d === 2 && /^15:00-16:00/.test(B.MT02.txt), JSON.stringify(B.MT02));
  // dedo: eventos de puntero táctiles (pointerType «touch») arrastran M2 encima de MT02
  await A.pg.evaluate(() => {
    const src = document.querySelector('.dv-chip.p[data-id=M2]'); src.scrollIntoView({ block: 'center' }); const r = src.getBoundingClientRect(); const dst = document.querySelector('.dv-blk[data-id=MT02]'); dst.scrollIntoView({ block: 'center' });
    const r2 = dst.getBoundingClientRect(); const r1 = src.getBoundingClientRect();
    const ev = (t, x, y, el) => el.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0 }));
    ev('pointerdown', r1.left + 10, r1.top + 10, src); ev('pointermove', r1.left + 30, r1.top + 30, src);
    for (let i = 1; i <= 5; i++) ev('pointermove', r1.left + (r2.left + 20 - r1.left) * i / 5, r1.top + (r2.top + 10 - r1.top) * i / 5, src);
    ev('pointerup', r2.left + 20, r2.top + 10, src);
  });
  B = await tb();
  ok('F21 · dedo (eventos de puntero táctiles): M2 asignada a MT02', B.MT02?.tags.includes('M2'), JSON.stringify(B.MT02));
  // quitar con el botón de la etiqueta
  await A.pg.click('.dv-blk[data-id=MT02] [data-quitar=p][data-v=M2]');
  B = await tb(); ok('F21 · botón para quitar una persona del bloque', !B.MT02.tags.includes('M2'));
  await A.pg.waitForFunction(() => /Guardado \d\d:\d\d/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 20000 });
  const tid = `${id}_${T.GE.id}_1`;
  let tr = await docREST('trabajos/' + tid); let D = JSON.parse(campo(tr, 'doc') || '{}');
  ok('F21 · guardado automático en Firebase: tablero, historial y empresa', D.v === 'dv1' && D.emp === 'reparaciones' && D.b?.MT01?.p?.[0] === 'M1' && D.b?.MT02?.d === 2 && D.h.length >= 8 && campo(tr, 'estado') === 'borrador', JSON.stringify(D).slice(0, 200));
  await A.pg.reload(); await A.pg.waitForSelector('.dv-blk[data-id=MT02]', { timeout: 20000 });
  ok('F21 · al cerrar y volver, el tablero sigue igual', !!(await A.pg.$('.dv-blk[data-id=MT01] .dv-tag')));

  // ---- Centralita: el profesor lanza la llamada 1 a todo el grupo
  await pg.click('#dvCentral [data-cv=lanzarTodos][data-k="0"]');
  await pg.waitForFunction(() => /lanzada a todo el grupo/.test(document.querySelector('#dvCentral .dv-cmsg')?.textContent || ''), null, { timeout: 15000 });
  await A.pg.waitForSelector('.dv-modal .dv-mh.rojo', { timeout: 20000 });
  ok('F21 · al alumno le salta la llamada de SU empresa con hora y texto', /La fuga ha empeorado/.test(await A.pg.textContent('.dv-modal')) && /Lunes 8:45/.test(await A.pg.textContent('.dv-modal')));
  await A.pg.keyboard.press('Escape'); await A.pg.mouse.click(5, 5);
  ok('F21 · la llamada no se cierra hasta pulsar «Entendido»', !!(await A.pg.$('.dv-modal')));
  await foto(A.pg, '04_alumno_llamada');
  await A.pg.click('.dv-modal [data-m=ok]');
  await A.pg.waitForSelector('.dv-banner', { timeout: 5000 });
  // replanifica: MT01 al lunes a las 8:00
  await arrastrar('.dv-blk[data-id=MT01]', celda(0, 8));
  B = await tb(); ok('F21 · replanificar: mover un bloque ya colocado', /^8:00-9:30/.test(B.MT01.txt), B.MT01.txt);
  await A.pg.click('.dv-banner [data-dv=incidencia]'); await A.pg.waitForSelector('.dv-modal [data-i=cambio]');
  await A.pg.fill('.dv-modal [data-i=cambio]', 'corto'); await A.pg.click('.dv-modal [data-m=ok]');
  ok('F21 · incidencia: pide al menos una frase en «qué» y «por qué»', /al menos una frase/.test(await A.pg.textContent('.dv-modal .dv-merr')));
  await A.pg.fill('.dv-modal [data-i=cambio]', 'He adelantado la fuga de Luna 4 a las 8:00.'); await A.pg.fill('.dv-modal [data-i=porque]', 'Porque está cayendo agua al vecino y es urgente.'); await A.pg.selectOption('.dv-modal [data-i=movido]', 'MT01');
  await foto(A.pg, '05_alumno_incidencia');
  await A.pg.click('.dv-modal [data-m=ok]'); await A.pg.waitForSelector('.dv-modal', { state: 'detached' });
  ok('F21 · tras guardar la incidencia desaparece el aviso de llamada pendiente', !(await A.pg.$('.dv-banner')));
  await A.pg.waitForFunction(() => /Guardado \d\d:\d\d/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 20000 });
  await A.pg.waitForTimeout(1500);
  tr = await docREST('trabajos/' + tid); D = JSON.parse(campo(tr, 'doc') || '{}');
  const inc = D.inc?.[0];
  ok('F21 · la incidencia se guarda con hora, tipo y el tablero antes y después', inc && inc.k === 0 && inc.tipo === 'Urgencia del cliente' && inc.antes?.MT01?.s === 540 && inc.despues?.MT01?.s === 480 && inc.t > 0 && D.at.length === 1, JSON.stringify(inc || {}).slice(0, 300));
  // ---- un alumno que no estaba conectado ve la llamada al entrar
  const A2 = await T.alumno(T.GE, 2, '4321', { width: 1180, height: 820 });
  await A2.pg.goto(BASE + '#trabajo/' + id); await A2.pg.waitForSelector('.dv-board', { timeout: 20000 });
  await A2.pg.waitForSelector('.dv-modal .dv-mh.rojo', { timeout: 20000 });
  const emp2 = await A2.pg.textContent('.dv-emp');
  ok('F21 · un alumno que entra después ve la llamada al entrar (la de su empresa, asignada al azar)', !!emp2.trim(), emp2);
  await A2.pg.click('.dv-modal [data-m=ok]');
  await foto(A2.pg, '06_tablet_1180');
  // ---- Entregar: resumen antes de entregar y tablero congelado
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('dialog.dlg-portal', { timeout: 10000 });
  const res = await A.pg.textContent('dialog.dlg-portal .dlg-txt');
  ok('F21 · resumen antes de entregar: trabajos colocados, avisos pendientes y llamadas atendidas', /Trabajos colocados: 2 de 15/.test(res) && /Avisos pendientes/.test(res) && /Llamadas atendidas: 1/.test(res), res);
  await foto(A.pg, '07_alumno_resumen_entregar');
  await A.pg.click('dialog.dlg-portal .dlg-ok'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  ok('F21 · entregado: el tablero queda congelado (solo lectura, sin etiquetas arrastrables)', !(await A.pg.$('[data-drag]')) && !!(await A.pg.$('.dv-ro svg.dv-svg')));
  tr = await docREST('trabajos/' + tid);
  ok('F21 · la entrega lleva el resumen en texto', /Trabajos colocados 2\/15/.test(campo(tr, 'texto')) && campo(tr, 'estado') === 'entregado', campo(tr, 'texto'));
  // ---- Profesor: vista del alumno
  await abrirCorreccion();
  if (!(await pg.$('#coTrabajo .dv-lect'))) { await pg.selectOption('#dvCentral select', { index: 0 }).catch(() => {}); }
  await pg.waitForSelector('#coTrabajo .dv-lect', { timeout: 15000 });
  const vt = await pg.textContent('#coTrabajo');
  ok('F21 · profesor: tablero final, avisos que quedan, incidencia con antes/después, historial y registro', !!(await pg.$('#coTrabajo .dv-svgw svg')) && /Avisos que quedan/.test(vt) && /He adelantado la fuga/.test(vt) && (await pg.$$('#coTrabajo .dv-inc svg')).length === 2 && /Historial de movimientos/.test(vt) && /Cambios de pestaña/.test(vt), vt.slice(0, 300));
  ok('F21 · la nota la pone el profesor con la rúbrica (la vista de corrección sigue igual)', !!(await pg.$('#coForm #coNota')));
  ok('F21 · la centralita marca la llamada como lanzada', /Lanzada a todo el grupo/.test(await pg.textContent('#dvCentral')));
  await pg.click('#coTrabajo .dv-inc summary'); await pg.click('#coTrabajo details.dv-det summary');
  await foto(pg, '08_profesor_correccion');
  await pg.evaluate(() => { document.documentElement.dataset.theme = 'dark'; }); await foto(pg, '09_profesor_oscuro'); await pg.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  // ---- Móvil en horizontal y modo oscuro (alumno nº 3)
  const M = await T.alumno(T.GE, 3, '4321', { width: 844, height: 390 });
  await M.pg.goto(BASE + '#trabajo/' + id); await M.pg.waitForSelector('.dv-board', { timeout: 20000 });
  if (await M.pg.$('.dv-modal [data-m=ok]')) await M.pg.click('.dv-modal [data-m=ok]');
  const anch = await M.pg.evaluate(() => ({ doc: document.documentElement.scrollWidth, vw: innerWidth }));
  ok('F21 · móvil en horizontal (844×390): la página no se sale de ancho (el tablero desplaza dentro)', anch.doc <= anch.vw + 1, JSON.stringify(anch));
  await M.pg.evaluate(() => document.querySelector('.dv')?.scrollIntoView()); await foto(M.pg, '10_movil_horizontal');
  await M.pg.evaluate(() => { document.documentElement.dataset.theme = 'dark'; }); await foto(M.pg, '11_movil_oscuro');
}
