// Fase 1 · Importar JSON, criterio y Exportar JSON
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local }) {
  const pg = T.P.pg;
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, '{ "tipo": "examen", "titulo": "Roto", }');
  await pg.waitForSelector('#jsErr li');
  ok('JSON mal escrito: error en castellano', /No es un JSON válido/.test(await pg.textContent('#jsErr')));
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify({ tipo: 'examen', titulo: 'x', preguntas: [{ tipo: 'test', enunciado: 'a', opciones: ['1', '2'], correcta: 4 }] }));
  await pg.click('.cl-modal [data-m=validar]');
  ok('pregunta mal escrita: error con la ruta y el guardado bloqueado', /preguntas\[0\]\.correcta/.test(await pg.textContent('#jsErr')) && await pg.isDisabled('.cl-modal [data-m=guardar]'));
  await shot(pg, 'f1_importar_errores');
  const EX = { formato: 'superprofe/elemento@1', tipo: 'examen', titulo: 'Examen importado de prueba', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: true },
    preguntas: [
      { id: 'q1', tipo: 'test', enunciado: 'Pregunta A', opciones: ['Uno', 'Dos', 'Tres'], correcta: 1, criterio: 'eee_c1_1' },
      { id: 'q2', tipo: 'vf', enunciado: 'Pregunta B', correcta: true, criterio: 'eee_c1_2' },
      { id: 'q3', tipo: 'corta', enunciado: 'Pregunta C', aceptadas: ['ohm'], criterio: 'eee_c1_2' }] };
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(EX, null, 2));
  await pg.click('.cl-modal [data-m=validar]');
  await pg.waitForSelector('#jsPrev .js-prev');
  ok('JSON correcto: vista previa con las preguntas y su criterio', /Examen importado de prueba/.test(await pg.textContent('#jsPrev')) && /eee_c1_2/.test(await pg.textContent('#jsPrev')));
  await shot(pg, 'f1_importar_vista_previa');
  await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Examen importado de prueba")', { timeout: 15000 });
  ok('se guarda como borrador', /Borrador/.test(await pg.textContent('#asTrabajo .cl-it:has-text("Examen importado de prueba") .cl-est')));
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("Examen importado de prueba")', 'data-item'); T.EX1 = id;
  const ex = JSON.stringify(await docREST('examenes/' + id)); const cl = JSON.stringify(await docREST('claves/' + id));
  ok('examen importado: preguntas sin soluciones, claves aparte, criterio guardado', /eee_c1_1/.test(ex) && !/"ohm"/.test(ex) && /ohm/.test(cl));
  // tarea con criterio
  await pegarJSON(pg, { tipo: 'tarea', titulo: 'Tarea importada', instrucciones: 'Hazla', puntos: 10, criterio: 'eee_c2_1', rubrica: [{ criterio: 'Contenido', puntos: 10 }] });
  await pg.waitForSelector('#jsPrev .js-prev'); await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Tarea importada")', { timeout: 15000 });
  T.TA1 = await pg.getAttribute('#asTrabajo .cl-it:has-text("Tarea importada")', 'data-item');
  // editor: criterio visible y editable
  await menu(pg, T.TA1, 'editar');
  await pg.waitForSelector('#apItemForm [name=criterio]');
  ok('editor: criterio de la tarea visible', (await pg.inputValue('#apItemForm [name=criterio]')) === 'eee_c2_1');
  await pg.fill('#apItemForm [name=criterio]', 'eee_c2_3'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector('#apItemForm', { state: 'detached' });
  ok('editor: criterio editado y guardado', /eee_c2_3/.test(JSON.stringify(await docREST('items/' + T.TA1))));
  await menu(pg, id, 'editar');
  await pg.waitForSelector('.ap-q[data-qi="0"] [data-qf=criterio]');
  await pg.waitForFunction(() => document.querySelector('.ap-q [data-qf=criterio]')?.value);
  ok('editor: criterio de cada pregunta visible', (await pg.$$eval('.ap-q [data-qf=criterio]', (l) => l.map((x) => x.value).join())) === 'eee_c1_1,eee_c1_2,eee_c1_2');
  await shot(pg, 'f1_editor_criterio');
  await pg.click('#apItemForm [data-ed=exportar]');
  await pg.waitForSelector('.cl-modal [data-m-f=out]');
  const out = JSON.parse(await pg.inputValue('.cl-modal [data-m-f=out]'));
  ok('Exportar JSON (desde el editor) incluye preguntas, soluciones y criterio', out.preguntas?.length === 3 && out.preguntas[0].correcta === 1 && out.preguntas[2].aceptadas?.[0] === 'ohm' && out.preguntas[1].criterio === 'eee_c1_2');
  await shot(pg, 'f1_exportar');
  await pg.click('.cl-modal:last-of-type [data-m=cerrar]'); await pg.click('#apItemForm [data-ed=cancelar]');
  // Exportar desde el menú ⋮ y volver a importar (plantilla)
  await menu(pg, T.TA1, 'exportarJSON');
  await pg.waitForSelector('.cl-modal [data-m-f=out]');
  const txt = (await pg.inputValue('.cl-modal [data-m-f=out]')).replace('Tarea importada', 'Tarea desde plantilla');
  await pg.click('.cl-modal [data-m=cerrar]');
  await pegarJSON(pg, txt); await pg.waitForSelector('#jsPrev .js-prev'); await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Tarea desde plantilla")', { timeout: 15000 });
  ok('exportar → importar como plantilla', true);
}
