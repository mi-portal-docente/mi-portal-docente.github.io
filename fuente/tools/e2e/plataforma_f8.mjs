// Fase 8 · Proyecto en equipo (PIAC), «Recuperación» para algunos nº de lista, calendario del alumno,
// avisos programados en el tablón, «Duplicar en otro grupo o curso», plantilla de rúbrica y lectura en voz alta.
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const local = (ms) => { const d = new Date(ms); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
async function importarYPublicar(pg, BASE, asig, el, { pegarJSON, guardarJSON }, antes) {
  await pg.goto(BASE + `#asig/${asig}/trabajo`);
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, el); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${el.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${el.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=titulo]', { timeout: 15000 });
  if (antes) await antes(pg);
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  return id;
}
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  // ------------------------------------------------------------- PIAC
  const PIAC = { tipo: 'piac', titulo: 'Proyecto: estación meteorológica', contenido: { instrucciones: 'Organizad el proyecto en el tablero y escribid el diario cada sesión.', equipos: [{ id: 'e1', nombre: 'Equipo Sol', miembros: [1, 2, 3] }, { id: 'e2', nombre: 'Equipo Luna', miembros: [4, 5, 6] }] } };
  const idP = await importarYPublicar(pg, BASE, 'proy2', PIAC, { pegarJSON, guardarJSON });
  const docP = JSON.stringify(await docREST('items/' + idP));
  ok('PIAC importado y publicado: equipos asignados al grupo (mapas para las reglas)', docP.includes('grupoDe') && docP.includes(T.GE.id) && /Autoría/.test(docP));
  await pg.goto(BASE + '#trabajo/' + idP); await pg.waitForSelector('.pi-conf textarea', { timeout: 15000, state: 'attached' });
  ok('profesor: equipos editables como «Nombre: nº, nº»', /Equipo Sol: 1, 2, 3/.test(await pg.inputValue('.pi-conf textarea')));
  const A = T.A3 || await T.alumno(T.GE, 3, '4321', { width: 1280, height: 860 }); T.A3 = A;
  await A.pg.goto(BASE + '#trabajo/' + idP); await A.pg.waitForSelector('.pi-eq', { timeout: 20000 });
  ok('alumno nº 3: ve su equipo (Equipo Sol) con los nº de lista', /Equipo Sol.*Tú \(nº 3\)/.test(await A.pg.textContent('.pi-eq')));
  await A.pg.fill('[data-pf=tarea] [name=texto]', 'Montar el sensor de temperatura'); await A.pg.selectOption('[data-pf=tarea] [name=resp]', '3');
  await A.pg.fill('[data-pf=tarea] [name=fecha]', new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10));
  await A.pg.click('[data-pf=tarea] button[type=submit]');
  await A.pg.waitForSelector('.pi-pendiente .pi-tarea', { timeout: 15000 });
  await A.pg.fill('[data-pf=tarea] [name=texto]', 'Buscar la hoja de datos'); await A.pg.click('[data-pf=tarea] button[type=submit]');
  await A.pg.waitForFunction(() => document.querySelectorAll('.pi-pendiente .pi-tarea').length === 2, null, { timeout: 15000 });
  await A.pg.click('.pi-pendiente .pi-tarea:has-text("Montar") [data-pa=mover]');
  await A.pg.waitForSelector('.pi-encurso .pi-tarea:has-text("Montar")', { timeout: 15000 });
  ok('tablero: crear tareas con responsable y fecha y pasarlas a «En curso»', /Tú \(nº 3\)/.test(await A.pg.textContent('.pi-encurso .pi-tarea')));
  await shot(A.pg, 'f8_piac_tablero');
  await A.pg.click('[data-pa=vista][data-v=diario]'); await A.pg.fill('[data-pf=diario] [name=texto]', 'Hoy hemos repartido las tareas y probado el sensor.');
  await A.pg.click('[data-pf=diario] button[type=submit]'); await A.pg.waitForSelector('.pi-entrada', { timeout: 15000 });
  ok('diario del equipo: entrada con fecha y nº', /repartido las tareas/.test(await A.pg.textContent('.pi-diario')));
  await A.pg.click('[data-pa=vista][data-v=evaluacion]'); await A.pg.waitForSelector('[data-pe="3"]');
  ok('evaluación: autoevaluación + coevaluación de los compañeros (nº 1 y 2), 5 criterios con uno de autoría', (await A.pg.$$('form.pi-eval')).length === 3 && (await A.pg.$$('[data-pe="3"] .pi-crit')).length === 5 && !!(await A.pg.$('[data-pe="3"] .pi-aut')));
  for (const k of ['contenido', 'proceso', 'comunicacion', 'herramientas', 'autoria']) await A.pg.check(`[data-pe="3"] [name=${k}][value="4"]`);
  await A.pg.click('[data-pe="3"] button[type=submit]'); await A.pg.waitForSelector('[data-pe="3"] .pi-ok', { timeout: 15000 });
  for (const k of ['contenido', 'proceso', 'comunicacion', 'herramientas', 'autoria']) await A.pg.check(`[data-pe="1"] [name=${k}][value="2"]`);
  await A.pg.click('[data-pe="1"] button[type=submit]'); await A.pg.waitForSelector('[data-pe="1"] .pi-ok', { timeout: 15000 });
  ok('autoevaluación guardada: 10 sobre 10 (rúbrica ponderada)', /10/.test(await A.pg.textContent('[data-pe="3"] .pi-ok')));
  await shot(A.pg, 'f8_piac_evaluacion');
  await pg.goto(BASE + '#trabajo/' + idP); await pg.waitForSelector('.pi-resumen', { timeout: 15000 });
  await pg.waitForFunction(() => /En curso: 1/.test(document.querySelector('.pi-resumen')?.textContent || ''), null, { timeout: 15000 });
  const res = await pg.textContent('.pi-resumen');
  ok('profesor: resumen del equipo (tareas por estado, diario, auto y coevaluación)', /Pendiente: 1/.test(res) && /Diario: 1/.test(res) && /Nº 3\s*10/.test(res.replace(/\s+/g, ' ')) && /Nº 1\s*—\s*5/.test(res.replace(/\s+/g, ' ')), res.replace(/\s+/g, ' ').slice(0, 300));
  await pg.click('.pi-resumen [data-pa=abrir]'); await pg.waitForSelector('.pi-resumen .pi-tablero');
  await shot(pg, 'f8_piac_profesor');
  // ------------------------------------------------------------- Recuperación solo para el nº 3
  const REC = { tipo: 'recuperacion', titulo: 'Recuperación: práctica de soldadura', texto: 'Repite la práctica de soldadura y entrega una foto del resultado.', puntos: 10 };
  const manana = Date.now() + 864e5;
  const idR = await importarYPublicar(pg, BASE, 'eee', REC, { pegarJSON, guardarJSON }, async (p) => {
    await p.fill('#apItemForm [name=para]', '3'); await p.fill('#apItemForm [name=fechaEntrega]', local(manana));
    await p.click('[data-ed=plantillaRubrica]');
    ok('plantilla de rúbrica: 5 criterios ponderados con autoría', /Autoría.*\| 1,5/.test(await p.inputValue('#apItemForm [name=rubrica]')) && (await p.inputValue('#apItemForm [name=rubrica]')).split('\n').length === 5);
  });
  const docR = JSON.stringify(await docREST('items/' + idR));
  ok('recuperación publicada solo para el nº 3 (visible vacío, visibleAl = grupo_3)', docR.includes(`${T.GE.id}_3`) && /"visible":\{"arrayValue":\{\}\}/.test(docR.replace(/\s/g, '')), docR.slice(0, 200));
  await A.pg.goto(BASE + '#trabajo/' + idR); await A.pg.waitForSelector('#enForm', { timeout: 20000 });
  ok('el nº 3 la ve, con «Leer en voz alta»', !!(await A.pg.$('[data-au=leer]')));
  await A.pg.fill('#enForm [name=texto]', 'Hecha de nuevo.'); await A.pg.click('[data-en=entregar]');
  await A.pg.waitForFunction(() => /Entregad|entregad/.test(document.querySelector('#aula')?.textContent || ''), null, { timeout: 15000 });
  ok('el nº 3 entrega la recuperación', /Hecha de nuevo/.test(JSON.stringify(await docREST(`trabajos/${idR}_${T.GE.id}_3`))));
  await shot(A.pg, 'f8_recuperacion_alumno');
  const A4 = await T.alumno(T.GE, 4, '4321', { width: 1280, height: 860 });
  await A4.pg.goto(BASE + '#asig/eee/trabajo'); await A4.pg.waitForSelector('#asTrabajo', { timeout: 20000 }); await A4.pg.waitForTimeout(2500);
  const lista4 = await A4.pg.textContent('#asTrabajo');
  await A4.pg.goto(BASE + '#trabajo/' + idR); await A4.pg.waitForSelector('#aula .au-vacio', { timeout: 20000 });
  ok('el nº 4 del mismo grupo no la ve (ni en la lista ni con el enlace)', !lista4.includes('Recuperación: práctica') && /no existe/.test(await A4.pg.textContent('#aula .au-vacio')));
  // ------------------------------------------------------------- Calendario
  await A.pg.goto(BASE + '#calendario'); await A.pg.waitForSelector('.ca-grid', { timeout: 15000 });
  ok('calendario del alumno: la recuperación aparece en «Próximos 15 días» y en el mes', /Recuperación: práctica/.test(await A.pg.textContent('.ca-prox')) && (await A.pg.$$('.ca-ev')).length >= 1);
  await shot(A.pg, 'f8_calendario');
  await A.pg.setViewportSize({ width: 390, height: 844 }); await A.pg.reload(); await A.pg.waitForSelector('.ca-grid', { timeout: 15000 });
  await shot(A.pg, 'f8_calendario_movil'); await A.pg.setViewportSize({ width: 1280, height: 860 });
  // ------------------------------------------------------------- Aviso programado
  await pg.goto(BASE + '#asig/eee/tablon'); await pg.waitForSelector('#clAnuncio');
  await pg.fill('#clAnuncio [name=texto]', 'Recordatorio: el lunes empieza la evaluación del proyecto.');
  await pg.check('#clAnuncio [name=programar]'); await pg.fill('#clAnuncio [name=pubAn]', local(Date.now() + 2 * 864e5));
  await pg.click('#clAnuncio button[type=submit]');
  await pg.waitForFunction(() => /Programado/.test(document.querySelector('.cl-misan')?.textContent || ''), null, { timeout: 15000 });
  ok('tablón: aviso programado (sale como «Programado» en «Tus anuncios»)', true);
  await shot(pg, 'f8_aviso_programado');
  await A.pg.goto(BASE + '#asig/eee/tablon'); await A.pg.waitForTimeout(2500);
  ok('el alumno todavía no ve el aviso programado', !(await A.pg.textContent('#asig')).includes('empieza la evaluación del proyecto'));
  // ------------------------------------------------------------- Duplicar en otro grupo o curso
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector(`#asTrabajo [data-item="${idR}"]`, { timeout: 15000 });
  await menu(pg, idR, 'duplicarEn'); await pg.waitForSelector('[data-dup=titulo]');
  await pg.fill('[data-dup=titulo]', 'Recuperación (copia para 2º CFGB)'); await pg.check(`[name=dupG][value="${T.GE.id}"]`);
  await shot(pg, 'f8_duplicar');
  await pg.click('[data-m=dupOk]');
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Recuperación (copia para 2º CFGB)")', { timeout: 15000 });
  ok('«Duplicar en otro grupo o curso» crea la copia como borrador', !(await pg.$('#asTrabajo .cl-it.pub:has-text("Recuperación (copia para 2º CFGB)")')));
}
