// Fase 9 · Entregas completas: borrador con guardado automático (también sin red), entregar, anular,
// devolver para corregir con comentario, comentarios privados, versiones, imprimir, «Mis trabajos»
// y entregas del laboratorio ligadas a grupo + nº (con migración de las antiguas).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
async function importarYPublicar(pg, BASE, asig, el, { pegarJSON, guardarJSON }) {
  await pg.goto(BASE + `#asig/${asig}/trabajo`);
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, el); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${el.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${el.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=titulo]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  return id;
}
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? (f.nullValue !== undefined ? null : f)); };

export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, REST, owner }) {
  const pg = T.P.pg;
  const TAREA = { tipo: 'tarea', titulo: 'Informe: medidas con el polímetro', texto: 'Explica cómo has medido la tensión y la resistencia. Añade una conclusión.', puntos: 10 };
  const id = await importarYPublicar(pg, BASE, 'eee', TAREA, { pegarJSON, guardarJSON });
  const tid = `${id}_${T.GE.id}_6`;
  const A = await T.alumno(T.GE, 6, '4321', { width: 1280, height: 900 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('#enForm [name=texto]', { timeout: 20000 });
  ok('alumno: la tarea empieza «Sin empezar» con Guardar, Entregar e Imprimir', /Sin empezar/.test(await A.pg.textContent('.en-cab')) && !!(await A.pg.$('[data-en=guardar]')) && !!(await A.pg.$('[data-en=imprimir]')));
  // ---- borrador con guardado automático
  await A.pg.type('#enForm [name=texto]', 'Primero he puesto el polímetro en V.', { delay: 5 });
  await A.pg.waitForFunction(() => /Guardado \d\d:\d\d/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 15000 });
  let d = await docREST('trabajos/' + tid);
  ok('guardado automático: borrador en Firestore a los pocos segundos con «Guardado hh:mm»', campo(d, 'estado') === 'borrador' && /polímetro en V/.test(campo(d, 'texto')));
  await shot(A.pg, 'f9_borrador_guardado');
  // ---- corte de red: copia local y se envía al volver
  await A.ctx.setOffline(true);
  await A.pg.type('#enForm [name=texto]', ' Sin red sigo escribiendo.', { delay: 5 });
  const local = await A.pg.evaluate((k) => localStorage.getItem(k), 'borr:' + tid);
  ok('sin conexión: el borrador queda guardado en este ordenador', /Sin red sigo/.test(local || ''));
  await A.pg.waitForFunction(() => /Sin conexión|Guardando|sin guardar/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 20000 });
  await A.ctx.setOffline(false);
  await A.pg.evaluate(() => window.dispatchEvent(new Event('online')));
  let llegado = false; for (let i = 0; i < 40 && !llegado; i++) { await A.pg.waitForTimeout(1000); llegado = /Sin red sigo/.test(campo(await docREST('trabajos/' + tid), 'texto') || ''); }
  ok('al volver la red, el borrador llega a Firestore', llegado);
  // ---- entregar, anular, volver a entregar
  await A.pg.waitForFunction(() => /Guardado/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 30000 });
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  d = await docREST('trabajos/' + tid);
  ok('entregar: estado «entregado», 1.ª entrega y texto de solo lectura', campo(d, 'estado') === 'entregado' && campo(d, 'nEntregas') === 1 && !!(await A.pg.$('#enForm [name=texto][readonly]')));
  await A.pg.click('[data-en=anular]'); await A.pg.waitForSelector('.en-chip.en-borrador', { timeout: 15000 });
  ok('anular la entrega (sin nota): vuelve a borrador y se puede editar', campo(await docREST('trabajos/' + tid), 'estado') === 'borrador' && !(await A.pg.$('#enForm [name=texto][readonly]')));
  await A.pg.fill('#enForm [name=texto]', 'Medí 4,5 V en la pila y 220 Ω en la resistencia. Conclusión: coincide con lo esperado.');
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  ok('volver a entregar: 2.ª entrega', campo(await docREST('trabajos/' + tid), 'nEntregas') === 2);
  await shot(A.pg, 'f9_entregado');
  // ---- imprimir / PDF
  await A.pg.evaluate(() => { window.__imp = 0; window.print = () => { window.__imp++; window.__impHTML = document.getElementById('enImprimir')?.innerHTML || ''; }; });
  await A.pg.click('[data-en=imprimir]');
  const imp = await A.pg.evaluate(() => [window.__imp, window.__impHTML]);
  ok('imprimir / guardar como PDF: hoja con el título, nº y el texto', imp[0] === 1 && /polímetro/.test(imp[1]) && /220 Ω/.test(imp[1]) && /nº 6/.test(imp[1]), String(imp[0]) + ' ' + String(imp[1]).slice(0, 300));
  // ---- profesor: estados, versiones, devolver con comentario
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForFunction((g) => document.querySelector('[data-ap-f=gGrupo]')?.value === g && document.querySelector('[data-ap-f=gAsig]'), T.GE.id, { timeout: 15000 });
  if ((await pg.inputValue('[data-ap-f=gAsig]')) !== 'eee') await pg.selectOption('[data-ap-f=gAsig]', 'eee');
  await pg.waitForSelector('.ap-tabla', { timeout: 15000 });
  await pg.waitForSelector(`td[data-celda="${id}"][data-n="6"].e-entregado`, { timeout: 15000 });
  await pg.click(`td[data-celda="${id}"][data-n="6"]`); await pg.waitForSelector('#apDevForm', { timeout: 15000 });
  await pg.click('.ap-vers summary'); await pg.waitForFunction(() => document.querySelectorAll('#apVers .ap-ver').length === 2, null, { timeout: 15000 });
  ok('profesor: estado «Entregado», 2.ª entrega y las 2 versiones con fecha', /Entregado/.test(await pg.textContent('.ap-est')) && /2\.ª entrega/.test(await pg.textContent('#apVers')));
  await pg.fill('#apDevForm [name=c]', 'Falta explicar cómo mediste la resistencia (sin alimentar el circuito).');
  await pg.click('#apDevForm button[type=submit]');
  await pg.waitForSelector(`td[data-celda="${id}"][data-n="6"].e-devuelto`, { timeout: 15000 });
  await pg.waitForFunction(() => /sin alimentar/.test(document.querySelector('#apComs')?.textContent || ''), null, { timeout: 15000 });
  ok('«Devolver para corregir» con comentario: casilla devuelta y comentario privado', campo(await docREST('trabajos/' + tid), 'estado') === 'devuelto');
  await shot(pg, 'f9_profesor_devolver');
  // ---- alumno: ve la devolución y el comentario, contesta, corrige y vuelve a entregar
  await A.pg.waitForSelector('.en-chip.en-devuelto', { timeout: 15000 });
  await A.pg.waitForFunction(() => /sin alimentar/.test(document.querySelector('#enComs')?.textContent || ''), null, { timeout: 15000 });
  ok('alumno: «Devuelto para corregir» con el comentario del profesor y el texto editable', !(await A.pg.$('#enForm [name=texto][readonly]')) && /devuelto/i.test(await A.pg.textContent('.au-aviso')));
  await A.pg.fill('#enComF textarea', 'Vale, lo añado.'); await A.pg.click('[data-en=comentar]');
  await A.pg.waitForFunction(() => /lo añado/.test(document.querySelector('#enComs')?.textContent || ''), null, { timeout: 15000 });
  await A.pg.fill('#enForm [name=texto]', 'Medí 4,5 V en la pila y, con el circuito sin alimentar, 220 Ω en la resistencia. Conclusión: coincide.');
  await shot(A.pg, 'f9_alumno_devuelto');
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  d = await docREST('trabajos/' + tid);
  ok('alumno: vuelve a entregar tras la devolución (3.ª entrega)', campo(d, 'estado') === 'entregado' && campo(d, 'nEntregas') === 3);
  await pg.waitForFunction(() => /lo añado/.test(document.querySelector('#apComs')?.textContent || ''), null, { timeout: 15000 });
  ok('profesor: ve la respuesta del alumno en los comentarios', true);
  // ---- nota publicada → calificado: ya no se anula
  await pg.click(`td[data-celda="${id}"][data-n="6"]`); await pg.waitForSelector('#apNotaForm');
  await pg.fill('#apNota', '8'); await pg.check('#apNotaForm [name=publicada]'); await pg.click('#apNotaForm button[type=submit]');
  await pg.waitForFunction(() => /Guardado/.test(document.querySelector('#apNotaMsg')?.textContent || ''), null, { timeout: 15000 });
  await A.pg.waitForSelector('.en-chip.en-calificado', { timeout: 15000 });
  ok('alumno: «Calificado» con la nota, sin «Anular» y de solo lectura', /8/.test(await A.pg.textContent('.au-entrega .au-nota')) && !(await A.pg.$('[data-en=anular]')) && !!(await A.pg.$('#enForm [name=texto][readonly]')));
  // ---- Mis trabajos
  await A.pg.goto(BASE + '#mis-trabajos'); await A.pg.waitForSelector('.mt-t', { timeout: 15000 });
  const mt = await A.pg.textContent('.mt-t');
  ok('«Mis trabajos»: la tarea con estado «Calificado» y nota 8', mt.includes(TAREA.titulo) && /Calificado/.test(mt) && (await A.pg.textContent(`.mt-t tbody tr:has-text("${TAREA.titulo}") td:last-child`)).trim() === '8', mt.replace(/\s+/g, ' ').slice(0, 300));
  await shot(A.pg, 'f9_mis_trabajos');
  // ---- entregas del laboratorio: antigua (ligada al uid) → migrada a grupo + nº
  const viejo = { fields: { uid: { stringValue: 'uidViejo123' }, codigo: { stringValue: T.GE.codigo }, grupo: { stringValue: T.GE.id }, numero: { integerValue: '6' }, practica: { stringValue: 'c2' }, tipo: { stringValue: 'circuitos' }, titulo: { stringValue: 'Práctica 2' }, fecha: { timestampValue: new Date(Date.now() - 864e5).toISOString() }, datos: { mapValue: { fields: { aciertos: { stringValue: '3/4' } } } }, nota: { doubleValue: 7.5 }, comentario: { stringValue: 'Bien montado' } } };
  await fetch(`${REST}/entregas/uidViejo123_${T.GE.id}_6_c2`, { ...owner, method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify(viejo) });
  await pg.goto(BASE + '#panel/entregas'); await pg.waitForSelector('#pnTabla', { timeout: 15000 });
  let mig = null; for (let i = 0; i < 20 && !mig?.fields; i++) { await pg.waitForTimeout(500); mig = await docREST(`entregas/${T.GE.id}_6_c2`); }
  const orig = await docREST(`entregas/uidViejo123_${T.GE.id}_6_c2`);
  ok('migración: la entrega antigua se copia al nº de lista con su nota y se conserva la original', campo(mig, 'nota') === 7.5 && campo(mig, 'migradaDe') === `uidViejo123_${T.GE.id}_6_c2` && campo(mig, 'al') === `${T.GE.id}_6` && !!orig.fields, JSON.stringify(mig).slice(0, 200) + ' | ' + JSON.stringify(orig).slice(0, 120));
  await pg.waitForFunction(() => document.querySelectorAll('#pnTabla tr[data-ent]').length >= 1, null, { timeout: 15000 });
  ok('migración: el profesor no la ve duplicada', (await pg.$$(`#pnTabla tr[data-ent*="_6_c2"]`)).length === 1);
  // el alumno (otro ordenador: otro uid) ve su práctica calificada
  await A.ctx.close();
  const B = await T.alumno(T.GE, 6, '4321', { width: 1280, height: 900 });
  await B.pg.goto(BASE + '#mis-trabajos'); await B.pg.waitForSelector('.mt-t', { timeout: 15000 });
  await B.pg.waitForFunction(() => /Práctica 2/.test(document.querySelector('.mt-t')?.textContent || ''), null, { timeout: 15000 });
  const mt2 = await B.pg.textContent('.mt-t');
  ok('otro ordenador (nº + PIN): ve la práctica del laboratorio migrada (7,5) y su tarea', /Práctica 2/.test(mt2) && /7,5/.test(mt2) && mt2.includes(TAREA.titulo));
  await B.pg.goto(BASE + '#trabajo/' + id); await B.pg.waitForSelector('.en-chip.en-calificado', { timeout: 15000 });
  ok('otro ordenador: abre la tarea calificada con su texto', /sin alimentar/.test(await B.pg.inputValue('#enForm [name=texto]')));
  // nueva entrega del laboratorio desde el portal: ID por grupo + nº
  const r = await B.pg.evaluate(async () => { try { await window.PORTAL.entregar({ practica: 'c3', tipo: 'circuitos', titulo: 'Práctica 3', datos: { aciertos: '2/2' } }); return 'ok'; } catch (e) { return e?.mensaje || String(e); } });
  const nueva = await docREST(`entregas/${T.GE.id}_6_c3`);
  ok('entrega nueva del laboratorio: ID por grupo + nº (no por ordenador)', r === 'ok' && campo(nueva, 'al') === `${T.GE.id}_6`, r);
  const r2 = await B.pg.evaluate(async () => { try { await window.PORTAL.entregar({ practica: 'c2', tipo: 'circuitos', titulo: 'Práctica 2', datos: {} }); return 'ok'; } catch (e) { return e?.mensaje || String(e); } });
  ok('una práctica ya calificada (aunque sea antigua) no se puede volver a entregar', /corregida/.test(r2), r2);
  await shot(B.pg, 'f9_mis_trabajos_otro_ordenador');
  await B.ctx.close();
}
