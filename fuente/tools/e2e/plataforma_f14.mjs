// Fase 14 · «Exportar todo» (JSON del curso escolar) y «Limpiar curso escolar» (copia automática + doble confirmación).
import { readFileSync } from 'node:fs';
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, PROMPT }) {
  const pg = T.P.pg;
  const EL = { tipo: 'tarea', titulo: 'Tarea F14 para la copia', texto: 'Describe un fusible.', puntos: 10 };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
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
  const tid = `${id}_${T.GE.id}_14`;
  let dT = null; for (let i = 0; i < 20; i++) { dT = await docREST('trabajos/' + tid); if (dT.fields?.estado?.stringValue === 'entregado') break; await new Promise((r) => setTimeout(r, 500)); }
  await A.ctx.close();
  ok('preparación: un trabajo entregado en el curso', dT.fields?.estado?.stringValue === 'entregado');
  // ---- exportar todo
  await pg.goto(BASE + '#panel/ajustes'); await pg.waitForSelector('[data-ap=exportarCurso]', { timeout: 20000 });
  const curso = (await pg.textContent('#apBorrarCurso option:checked')).trim();
  await shot(pg, 'f14_ajustes_copia');
  const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=exportarCurso]')]);
  const cp = JSON.parse(readFileSync(await dl.path(), 'utf8'));
  await pg.waitForFunction(() => /Copia descargada/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 30000 });
  ok('«Exportar todo»: JSON del curso con elementos, trabajos y notas (formato copia-curso@1)', cp.formato === 'portal-docente/copia-curso@1' && /^\d{8}_SuperProfe_Alumnos_.*\.json$/.test(dl.suggestedFilename())
    && cp.colecciones.items.some((x) => x.id === id) && cp.colecciones.trabajos.some((x) => x.id === tid && /fusible/.test(x.texto)) && Array.isArray(cp.colecciones.notas) && Array.isArray(cp.subcolecciones.comentarios), dl.suggestedFilename());
  ok('las fechas van en ISO y no hay datos de otros cursos', JSON.stringify(cp).includes('"__fecha":"20') && cp.colecciones.trabajos.every((x) => x.curso === cp.curso.id));
  // ---- P1: con el curso abierto (o cerrado hace menos de 6 meses) no se puede limpiar
  await pg.click('[data-ap=limpiarCurso]');
  await pg.waitForFunction(() => /no está cerrado/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 30000 });
  ok('P1 · limpiar con el curso abierto: no deja y no borra nada', !!(await docREST('trabajos/' + tid)).fields);
  // se simula un curso cerrado hace 200 días (con permisos de administrador del emulador)
  const cid = await pg.inputValue('#apBorrarCurso');
  const R = docREST.base || `http://127.0.0.1:${process.env.E2E_FS_PORT || '8080'}/v1/projects/demo-portal/databases/(default)/documents`;
  await fetch(`${R}/cursos/${cid}?updateMask.fieldPaths=activo&updateMask.fieldPaths=cerrado`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { activo: { booleanValue: false }, cerrado: { timestampValue: new Date(Date.now() - 200 * 864e5).toISOString() } } }) });
  await pg.waitForTimeout(1500);
  // ---- limpiar: la segunda confirmación (escribir el nombre) mal → no borra nada
  PROMPT.push('no es el curso');
  const [dl2] = await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=limpiarCurso]')]);
  await pg.waitForFunction(() => /Cancelado/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 30000 });
  ok('limpiar: descarga antes la copia y, si el nombre no coincide, no borra nada', /_SuperProfe_Alumnos_/.test(dl2.suggestedFilename()) && !!(await docREST('trabajos/' + tid)).fields);
  // ---- limpiar de verdad (el contenido se conserva)
  PROMPT.push(curso);
  await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.click('[data-ap=limpiarCurso]')]);
  await pg.waitForFunction(() => /Borrados \d+/.test(document.querySelector('#apBorrarMsg')?.textContent || ''), null, { timeout: 60000 });
  await shot(pg, 'f14_limpiar_hecho');
  ok('limpiar curso escolar: borra los trabajos y notas del alumnado y conserva el contenido', !(await docREST('trabajos/' + tid)).fields && !!(await docREST('items/' + id)).fields, await pg.textContent('#apBorrarMsg'));
}
