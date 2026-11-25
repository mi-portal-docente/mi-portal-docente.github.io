// Fase 16 · Ajustes del profesor al corregir un examen (t174u): «Dar por válida», deshacer, «válida para todos».
// Comprueba que la nota se recalcula en el detalle, el cuaderno, el examen completo y la vista del alumno; que deshacer
// devuelve la nota original; que una nota antigua sin ajustes no cambia; y que las respuestas del alumno no se tocan.
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local, REST, owner }) {
  const pg = T.P.pg;
  const EX = { formato: 'superprofe/elemento@1', tipo: 'examen', titulo: 'Ajustes F16 · dar por válida', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: false },
    preguntas: [
      { id: 't1', tipo: 'test', enunciado: '¿Cuál es la unidad de la resistencia?', opciones: ['Voltio', 'Ohmio', 'Amperio'], correcta: 1 },
      { id: 'v1', tipo: 'vf', enunciado: 'El LED tiene polaridad', correcta: true },
      { id: 'c1', tipo: 'corta', enunciado: 'Símbolo de la unidad de resistencia (en letras)', aceptadas: ['ohm'] }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EX); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  // alumno 21 lo hace en la interfaz: t1 mal (Voltio), v1 bien, c1 «ohmio» (no coincide)
  const A = await T.alumno(T.GE, 21, '4321', { width: 1280, height: 1000 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  await A.pg.click('[data-au=empezar]'); await A.pg.waitForSelector('#auExamen fieldset[data-q=t1]', { timeout: 20000 });
  await A.pg.check('fieldset[data-q=t1] input[value="0"]'); await A.pg.check('fieldset[data-q=v1] input[value="true"]'); await A.pg.fill('fieldset[data-q=c1] input', 'ohmio');
  await A.pg.waitForTimeout(800);
  await A.pg.click('#auExamen button[type=submit]'); await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  const tid = (n) => `${id}_${T.GE.id}_${n}`;
  let d21 = null; for (let i = 0; i < 20; i++) { d21 = await docREST('trabajos/' + tid(21)); if (d21.fields?.estado?.stringValue === 'entregado') break; await new Promise((r) => setTimeout(r, 500)); }
  // 24: misma respuesta en t1 (para «válida para todos»); 22: otra respuesta y una nota ANTIGUA ya puesta (sin ajustes)
  const H = { ...owner.headers, 'Content-Type': 'application/json' };
  const copia = (n, resp) => { const f = JSON.parse(JSON.stringify(d21.fields)); f.numero = { integerValue: String(n) }; f.al = { stringValue: `${T.GE.id}_${n}` }; if (resp) f.respuestas = { mapValue: { fields: resp } }; return f; };
  await fetch(`${REST}/trabajos/${tid(24)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: copia(24) }) });
  await fetch(`${REST}/trabajos/${tid(22)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: copia(22, { t1: { integerValue: '2' }, v1: { booleanValue: true }, c1: { stringValue: 'ohm' } }) }) });
  const n22 = { item: { stringValue: id }, curso: d21.fields.curso, asig: d21.fields.asig || { stringValue: 'eee' }, al: { stringValue: `${T.GE.id}_22` }, grupo: { stringValue: T.GE.id }, numero: { integerValue: '22' }, nota: { doubleValue: 6.67 }, puntos: { integerValue: '2' }, max: { integerValue: '3' }, detalle: { mapValue: { fields: { t1: { integerValue: '0' }, v1: { integerValue: '1' }, c1: { integerValue: '1' } } } }, comentario: { stringValue: '' }, publicada: { booleanValue: true }, fecha: { integerValue: '1' } };
  await fetch(`${REST}/notas/${tid(22)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: n22 }) });
  const resp21 = JSON.stringify(d21.fields.respuestas); const viejo22 = JSON.stringify((await docREST('notas/' + tid(22))).fields);
  // profesor: cuaderno → casilla del 21
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 }); await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`td[data-celda="${id}"][data-n="21"]`, { timeout: 20000 }); await pg.waitForTimeout(1200);
  await pg.click(`td[data-celda="${id}"][data-n="21"]`); await pg.waitForSelector('#apDetalle .ap-resp li [data-ap=ajValida]', { timeout: 15000 });
  const h0 = await pg.textContent('#apDetalle h4');
  ok('F16 · Respuestas: cada pregunta fallada ofrece «Dar por válida» y la del mismo error, «para todos (2)»', /1 \/ 3 puntos/.test(h0) && (await pg.$$('#apDetalle [data-ap=ajValida]')).length === 2 && /\(2\)/.test(await pg.textContent('#apDetalle [data-ap=ajTodos][data-qid=t1]')), h0);
  await shot(pg, 'f16_respuestas_antes');
  await pg.click('#apDetalle [data-ap=ajValida][data-qid=t1]');
  let n21 = null; for (let i = 0; i < 20; i++) { n21 = await docREST('notas/' + tid(21)); if (n21.fields?.nota) break; await new Promise((r) => setTimeout(r, 300)); }
  const nv = (d) => Number(d?.fields?.nota?.doubleValue ?? d?.fields?.nota?.integerValue ?? NaN);
  const dm = (d) => d?.fields?.detalle?.mapValue?.fields || {};
  ok('F16 · «Dar por válida»: la nota se recalcula (3,33 → 6,67) y se guarda el ajuste con los puntos automáticos', nv(n21) === 6.67 && !!dm(n21)['aj:t1'] && dm(n21)['aj:t1'].mapValue.fields.a.integerValue === '0', JSON.stringify(n21.fields).slice(0, 300));
  await pg.waitForSelector('#apDetalle .aj-badge', { timeout: 10000 });
  ok('F16 · el detalle marca «Ajustada por el profesor», suma 2 / 3 y propone la nota 6,67', /2 \/ 3 puntos/.test(await pg.textContent('#apDetalle h4')) && /Ajustada por el profesor/.test(await pg.textContent('#apDetalle')) && (await pg.inputValue('#apNota')) === '6.67');
  ok('F16 · las respuestas del alumno no cambian', JSON.stringify((await docREST('trabajos/' + tid(21))).fields.respuestas) === resp21);
  await pg.waitForFunction((s) => /6,67/.test(document.querySelector(s)?.textContent || ''), `td[data-celda="${id}"][data-n="21"]`, { timeout: 10000 }).catch(() => { });
  ok('F16 · el cuaderno muestra la nota nueva (6,67)', /6,67/.test(await pg.textContent(`td[data-celda="${id}"][data-n="21"]`)), await pg.textContent(`td[data-celda="${id}"][data-n="21"]`));
  await shot(pg, 'f16_respuestas_ajustada');
  // publicar con «Guardar nota»: el ajuste se conserva
  await pg.check('#apNotaForm [name=publicada]'); await pg.click('#apNotaForm button[type=submit]'); await pg.waitForSelector('#apNotaMsg.ok', { timeout: 10000 });
  n21 = await docREST('notas/' + tid(21));
  ok('F16 · «Guardar nota» (publicada) conserva el ajuste', nv(n21) === 6.67 && !!dm(n21)['aj:t1'] && !!dm(n21)['aj:_'] && n21.fields.publicada.booleanValue === true, JSON.stringify(dm(n21)));
  // alumno 21 ve su nota ajustada
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.rb-nota', { timeout: 20000 });
  const tA = await A.pg.textContent('.rb-nota');
  ok('F16 · el alumno ve 6,67 con «Ajustada por el profesor»', /6,67/.test(tA) && /Ajustada por el profesor/.test(tA), tA.replace(/\s+/g, ' '));
  await shot(A.pg, 'f16_alumno_nota_ajustada');
  // examen completo: deshacer desde ahí
  await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal .aj-bar [data-rv=deshacer]', { timeout: 10000 });
  await shot(pg, 'f16_examen_completo_ajustada');
  await pg.click('.rv-modal [data-rv=deshacer][data-qid=t1]'); await pg.waitForFunction(() => !document.querySelector('.rv-modal [data-rv=deshacer]') && document.querySelector('.rv-modal [data-rv=valida][data-qid=t1]'), null, { timeout: 10000 });
  for (let i = 0; i < 20; i++) { n21 = await docREST('notas/' + tid(21)); if (!dm(n21)['aj:t1']) break; await new Promise((r) => setTimeout(r, 300)); }
  ok('F16 · «Deshacer» (examen completo): vuelve la nota original 3,33, sin marcas de ajuste y sigue publicada', nv(n21) === 3.33 && !Object.keys(dm(n21)).some((k) => k.startsWith('aj:')) && dm(n21).t1.integerValue === '0' && n21.fields.publicada.booleanValue === true, JSON.stringify(n21.fields.nota) + JSON.stringify(dm(n21)));
  await pg.waitForFunction(() => /1 \/ 3 puntos/.test(document.querySelector('.rv-res')?.textContent || ''), null, { timeout: 5000 }).catch(() => { });
  ok('F16 · examen completo: el resumen vuelve a 1 / 3 puntos', /1 \/ 3 puntos/.test(await pg.textContent('.rv-res')));
  // dar por válida desde el examen completo
  await pg.click('.rv-modal [data-rv=valida][data-qid=c1]'); await pg.waitForSelector('.rv-modal .aj-badge', { timeout: 10000 });
  n21 = await docREST('notas/' + tid(21));
  ok('F16 · «Dar por válida» desde el examen completo (c1): 6,67 y marca en la ventana', nv(n21) === 6.67 && !!dm(n21)['aj:c1'], String(nv(n21)));
  await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  await A.pg.waitForFunction(() => /6,67/.test(document.querySelector('.rb-nota')?.textContent || ''), null, { timeout: 10000 }).catch(() => { });
  ok('F16 · el alumno ve el cambio al momento', /6,67/.test(await A.pg.textContent('.rb-nota')));
  // válida para todos los que respondieron igual (21 y 24) en t1
  await pg.waitForSelector('#apDetalle [data-ap=ajTodos][data-qid=t1]', { timeout: 10000 });
  await pg.click('#apDetalle [data-ap=ajTodos][data-qid=t1]');
  let n24 = null; for (let i = 0; i < 20; i++) { n24 = await docREST('notas/' + tid(24)); n21 = await docREST('notas/' + tid(21)); if (n24.fields && dm(n21)['aj:t1']) break; await new Promise((r) => setTimeout(r, 300)); }
  ok('F16 · «Válida para todos»: el 21 (10) y el 24 (6,67, sin publicar) reciben el ajuste; el 22 no', nv(n21) === 10 && nv(n24) === 6.67 && n24.fields.publicada.booleanValue === false && !!dm(n24)['aj:t1'], `${nv(n21)} ${nv(n24)}`);
  ok('F16 · la nota antigua del 22 (sin ajustes) está exactamente igual', JSON.stringify((await docREST('notas/' + tid(22))).fields) === viejo22);
  await pg.click(`td[data-celda="${id}"][data-n="22"]`); await pg.waitForSelector('#apDetalle .ap-resp li', { timeout: 15000 }); await pg.waitForTimeout(400);
  ok('F16 · el 22 se abre como siempre: sin marcas de ajuste, nota 6,67', !(await pg.$('#apDetalle .aj-badge')) && (await pg.inputValue('#apNota')) === '6.67');
  // deshacer en el 24: vuelve la automática
  await pg.click(`td[data-celda="${id}"][data-n="24"]`); await pg.waitForSelector('#apDetalle [data-ap=ajDeshacer][data-qid=t1]', { timeout: 15000 });
  await pg.click('#apDetalle [data-ap=ajDeshacer][data-qid=t1]');
  for (let i = 0; i < 20; i++) { n24 = await docREST('notas/' + tid(24)); if (!dm(n24)['aj:t1']) break; await new Promise((r) => setTimeout(r, 300)); }
  ok('F16 · deshacer en el 24: vuelve su nota automática (3,33)', nv(n24) === 3.33 && !Object.keys(dm(n24)).some((k) => k.startsWith('aj:')), String(nv(n24)));
  // puntos parciales
  await pg.fill('#apDetalle .ap-qpts[data-qid=c1]', '0.5'); await pg.click('#apDetalle [data-ap=ajPuntos][data-qid=c1]');
  for (let i = 0; i < 20; i++) { n24 = await docREST('notas/' + tid(24)); if (dm(n24)['aj:c1']) break; await new Promise((r) => setTimeout(r, 300)); }
  ok('F16 · puntos parciales (0,5 en c1): nota 5', nv(n24) === 5, String(nv(n24)));
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  const sw = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth }));
  ok('F16 · móvil 390 px: sin scroll lateral', sw.sw <= sw.w + 1, JSON.stringify(sw));
  await pg.locator('#apDetalle .aj-bar').first().scrollIntoViewIfNeeded(); await shot(pg, 'f16_movil');
  await pg.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark')); await pg.waitForTimeout(200); await shot(pg, 'f16_movil_oscuro');
  await pg.evaluate(() => document.documentElement.removeAttribute('data-theme')); await pg.setViewportSize({ width: 1440, height: 900 });
  await A.ctx.close();
}
