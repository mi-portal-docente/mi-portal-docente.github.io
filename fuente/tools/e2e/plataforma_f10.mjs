// Fase 10 · Vista de corrección: un alumno cada vez, rúbrica por niveles (clic), criterio «en clase»,
// anterior / siguiente, comentarios rápidos reutilizables, notas en borrador y publicar a mano (una o todas).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? (f.nullValue !== undefined ? null : f)); };
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  const EL = { tipo: 'tarea', titulo: 'Ficha: la ley de Ohm', texto: 'Resuelve los tres ejercicios y explica el último.', puntos: 10,
    rubrica: [{ criterio: 'Ejercicios resueltos', puntos: 6, niveles: ['Ninguno bien', 'Uno bien', 'Dos bien', 'Los tres bien'] }, { criterio: 'Explicación', puntos: 4 }, { criterio: 'Montaje en el taller', clase: true }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=rubrica]', { timeout: 15000 });
  ok('editor: la rúbrica muestra niveles y «clase» en texto', /Los tres bien/.test(await pg.inputValue('#apItemForm [name=rubrica]')) && /Montaje en el taller \| clase/.test(await pg.inputValue('#apItemForm [name=rubrica]')));
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  // dos alumnos entregan
  for (const n of [7, 8]) {
    const A = await T.alumno(T.GE, n, '4321', { width: 1100, height: 800 });
    await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('#enForm [name=texto]', { timeout: 20000 });
    await A.pg.fill('#enForm [name=texto]', `Respuesta del nº ${n}: V = I · R. En el último, la corriente se reduce a la mitad.`);
    await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
    if (n === 7) T.A7 = A; else await A.ctx.close();
  }
  // vista de corrección
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForFunction((g) => document.querySelector('[data-ap-f=gGrupo]')?.value === g && document.querySelector('[data-ap-f=gAsig]'), T.GE.id, { timeout: 15000 });
  if ((await pg.inputValue('[data-ap-f=gAsig]')) !== 'eee') await pg.selectOption('[data-ap-f=gAsig]', 'eee');
  await pg.waitForSelector(`th[data-col="${id}"] [data-ap=corregir]`, { timeout: 15000 });
  await pg.click(`th[data-col="${id}"] [data-ap=corregir]`); await pg.waitForSelector('#coForm', { timeout: 15000 });
  ok('vista de corrección: empieza por el primer alumno con entrega (nº 07, 1 de 2) con su trabajo al lado', /07/.test(await pg.textContent('.co-nn')) && /1 de 2/.test(await pg.textContent('.co-nn')) && /nº 7/.test(await pg.textContent('#coTrabajo')));
  ok('rúbrica: 4 niveles por criterio con sus descriptores; «Montaje en el taller» lo evalúa el profesor en clase', (await pg.$$('.co-crit[data-ri="0"] .co-n')).length === 4 && /Los tres bien/.test(await pg.textContent('.co-crit[data-ri="0"]')) && /en clase/.test(await pg.textContent('.co-crit.clase')));
  await pg.click('.co-crit[data-ri="0"] .co-n[data-k="4"]'); await pg.click('.co-crit[data-ri="1"] .co-n[data-k="2"]');
  ok('clic en los niveles: 6 + 2 = 8 / 10 → nota 8', (await pg.inputValue('#coNota')) === '8' && /8 \/ 10/.test(await pg.textContent('#coCalc')));
  await pg.click('#coRapidos [data-co=usarRap]:has-text("Muy buen trabajo.")');
  ok('comentario rápido: se añade al comentario', /Muy buen trabajo\./.test(await pg.inputValue('#coCom')));
  await pg.fill('#coCom', 'Revisa las unidades en el último ejercicio.'); await pg.click('[data-co=nuevoRap]');
  await pg.waitForSelector('#coRapidos [data-co=usarRap]:has-text("Revisa las unidades")');
  await shot(pg, 'f10_correccion');
  await pg.click('#coForm button[data-sig="1"]');
  await pg.waitForFunction(() => /08/.test(document.querySelector('.co-nn')?.textContent || ''), null, { timeout: 15000 });
  const n7 = await docREST(`notas/${id}_${T.GE.id}_7`);
  ok('«Guardar y siguiente»: nota 8 en borrador (sin publicar) con los niveles, y pasa al nº 08', campo(n7, 'nota') === 8 && campo(n7, 'publicada') === false && /"n0"/.test(JSON.stringify(n7)));
  await T.A7.pg.reload(); await T.A7.pg.waitForSelector('.en-chip', { timeout: 20000 });
  ok('el alumno todavía no ve la nota en borrador', !(await T.A7.pg.$('.en-chip.en-calificado')));
  await pg.click('.co-crit[data-ri="0"] .co-n[data-k="3"]'); await pg.click('.co-crit[data-ri="1"] .co-n[data-k="3"]');
  ok('nº 08: 4,5 + 3 = 7,5', (await pg.inputValue('#coNota')) === '7.5');
  await pg.click('#coForm button[data-pub="0"]:not([data-sig])'); await pg.waitForFunction(() => /Guardada/.test(document.querySelector('#coMsg')?.textContent || ''), null, { timeout: 15000 });
  await pg.click('[data-co=ant]'); await pg.waitForFunction(() => /07/.test(document.querySelector('.co-nn')?.textContent || ''));
  ok('«Anterior»: vuelve al nº 07 con los niveles marcados', !!(await pg.$('.co-crit[data-ri="0"] .co-n[data-k="4"].on')) && !!(await pg.$('.co-crit[data-ri="1"] .co-n[data-k="2"].on')));
  await pg.click('[data-co=publicarTodas]');
  await pg.waitForFunction(() => !document.querySelector('[data-co=publicarTodas]'), null, { timeout: 15000 });
  const p7 = await docREST(`notas/${id}_${T.GE.id}_7`); const p8 = await docREST(`notas/${id}_${T.GE.id}_8`);
  ok('«Publicar 2»: las dos notas publicadas a la vez', campo(p7, 'publicada') === true && campo(p8, 'publicada') === true);
  await T.A7.pg.waitForSelector('.en-chip.en-calificado', { timeout: 15000 });
  ok('el alumno ve la nota (8) y la rúbrica con «Se evalúa en clase»', /8/.test(await T.A7.pg.textContent('.au-entrega .au-nota')) && /Se evalúa en clase/.test(await T.A7.pg.textContent('.au-t')));
  await shot(T.A7.pg, 'f10_alumno_nota');
  await pg.click('[data-co=cerrar]'); await pg.waitForSelector('.ap-tabla', { timeout: 15000 });
  ok('volver al cuaderno: las dos casillas con nota', (await pg.textContent(`td[data-celda="${id}"][data-n="7"]`)).trim() === '8' && (await pg.textContent(`td[data-celda="${id}"][data-n="8"]`)).trim() === '7,5');
  await T.A7.ctx.close();
}
