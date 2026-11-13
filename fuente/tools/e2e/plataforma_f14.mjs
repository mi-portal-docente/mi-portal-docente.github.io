// Fase 14 · «Exportar todo» (JSON del curso escolar) y «Limpiar curso escolar» (copia automática + doble confirmación).
import { readFileSync } from 'node:fs';
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, PROMPT }) {
  const pg = T.P.pg;
  const EL = { tipo: 'tarea', titulo: 'Tarea F14 para la copia', texto: 'Describe un fusible.', puntos: 10 };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  const A = await T.alumno(T.GE, 14, '4321', { width: 1280, height: 950 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('#enForm [name=texto]', { timeout: 20000 });
  await A.pg.fill('#enForm [name=texto]', 'Un fusible protege el circuito de las sobreintensidades.');
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  await A.ctx.close();
  const tid = `${id}_${T.GE.id}_14`;
  ok('preparación: un trabajo entregado en el curso', !!(await docREST('trabajos/' + tid)).fields);
  // ---- exportar todo
  await pg.goto(BASE + '#panel/ajustes'); await pg.waitForSelector('[data-ap=exportarCurso]', { timeout: 20000 });
  const curso = (await pg.textContent('#apBorrarCurso option:checked')).trim();
  await shot(pg, 'f14_ajustes_copia');
  const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=exportarCurso]')]);
  const cp = JSON.parse(readFileSync(await dl.path(), 'utf8'));
  await pg.waitForFunction(() => /Copia descargada/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 30000 });
  ok('«Exportar todo»: JSON del curso con elementos, trabajos y notas (formato copia-curso@1)', cp.formato === 'portal-docente/copia-curso@1' && /^copia-curso-.*\.json$/.test(dl.suggestedFilename())
    && cp.colecciones.items.some((x) => x.id === id) && cp.colecciones.trabajos.some((x) => x.id === tid && /fusible/.test(x.texto)) && Array.isArray(cp.colecciones.notas) && Array.isArray(cp.subcolecciones.comentarios), dl.suggestedFilename());
  ok('las fechas van en ISO y no hay datos de otros cursos', JSON.stringify(cp).includes('"__fecha":"20') && cp.colecciones.trabajos.every((x) => x.curso === cp.curso.id));
  // ---- limpiar: la segunda confirmación (escribir el nombre) mal → no borra nada
  PROMPT.push('no es el curso');
  const [dl2] = await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=limpiarCurso]')]);
  await pg.waitForFunction(() => /Cancelado/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 30000 });
  ok('limpiar: descarga antes la copia y, si el nombre no coincide, no borra nada', /^copia-curso-/.test(dl2.suggestedFilename()) && !!(await docREST('trabajos/' + tid)).fields);
  // ---- limpiar de verdad (el contenido se conserva)
  PROMPT.push(curso);
  await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=limpiarCurso]')]);
  await pg.waitForFunction(() => /Borrados \d+/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 60000 });
  await shot(pg, 'f14_limpiar_hecho');
  ok('limpiar curso escolar: borra los trabajos y notas del alumnado y conserva el contenido', !(await docREST('trabajos/' + tid)).fields && !!(await docREST('items/' + id)).fields, await pg.textContent('#apBorrarMsg'));
}
