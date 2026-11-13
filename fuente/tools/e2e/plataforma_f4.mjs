// Fase 4 · Explicación interactiva (importar, editar, publicar, alumno, entregar, nota) y pregunta en directo.
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  const EXP = { tipo: 'explicacion', titulo: 'Explicación de prueba', puntos: 10, criterio: 'eee_c2_1', contenido: { diapositivas: [
    { titulo: 'Qué vamos a ver', texto: 'Texto de la **primera** diapositiva.', imagen: 'img/fotos/eee.webp', alt: 'Foto' },
    { titulo: 'Comprueba', texto: 'Pregunta de control:', pregunta: { tipo: 'vf', enunciado: 'La afirmación de prueba es verdadera.', correcta: true, explicacion: 'Porque sí.' } },
    { titulo: 'Pruébalo', texto: 'Laboratorio incrustado.', lab: '#eee/circuitos' }], resumen: 'Resumen de prueba.' } };
  await pegarJSON(pg, { ...EXP, contenido: { diapositivas: [{ titulo: '' }] } });
  await pg.waitForSelector('#jsErr li', { timeout: 10000 });
  ok('explicación con errores: mensaje en castellano con la ruta', /contenido\.diapositivas\[0\]/.test(await pg.textContent('#jsErr')));
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(EXP)); await pg.click('.cl-modal [data-m=validar]');
  await pg.waitForSelector('#jsPrev .js-prev');
  ok('vista previa con el resumen del contenido', /3 diapositivas · 1 pregunta de control · con laboratorio/.test(await pg.textContent('#jsPrev')));
  await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Explicación de prueba")', { timeout: 15000 });
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("Explicación de prueba")', 'data-item'); T.EXP = id;
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=contenido]', { timeout: 15000 });
  const txt = await pg.inputValue('#apItemForm [name=contenido]');
  ok('editor: el contenido se ve y se edita como JSON', /Pruébalo/.test(txt));
  await pg.fill('#apItemForm [name=contenido]', txt.replace('Resumen de prueba.', 'Resumen editado.'));
  await shot(pg, 'f4_editor_explicacion');
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  ok('editar y publicar la explicación', /Resumen editado/.test(JSON.stringify(await docREST('items/' + id))));

  // ------------------------------------------------------------- alumno
  const A = T.A3 || await T.alumno(T.GE, 3, '4321', { width: 1280, height: 860 }); T.A3 = A;
  await A.pg.goto(BASE + '#trabajo/' + id);
  await A.pg.waitForSelector('.xp .xp-diapo', { timeout: 20000 });
  ok('alumno: la explicación se abre en la diapositiva 1 de 4', /1 \/ 4/.test(await A.pg.textContent('.xp-n')) && /Qué vamos a ver/.test(await A.pg.textContent('.xp-diapo')));
  await shot(A.pg, 'f4_explicacion_alumno');
  await A.pg.keyboard.press('Tab'); await A.pg.click('[data-xp=sig]');
  await A.pg.waitForSelector('.xp-ctrl');
  await A.pg.click('.xp-ctrl [data-xr="true"]');
  await A.pg.waitForSelector('.xp-fb.ok');
  ok('pregunta de control: respuesta inmediata (correcta) con la explicación', /Correcto.*Porque sí/.test(await A.pg.textContent('.xp-fb')));
  await A.pg.click('[data-xp=sig]');
  await A.pg.waitForSelector('.xp-lab iframe');
  const src = await A.pg.getAttribute('.xp-lab iframe', 'src');
  ok('laboratorio del portal incrustado', /index\.html\?incrustado=1#eee\/circuitos/.test(src), src);
  await A.pg.waitForTimeout(4000);
  const fr = A.pg.frames().find((f) => /incrustado=1/.test(f.url()));
  const inc = fr ? await fr.evaluate(() => document.documentElement.classList.contains('incrustado')).catch(() => false) : false;
  ok('el laboratorio incrustado se abre sin la cabecera del portal', inc);
  await shot(A.pg, 'f4_explicacion_lab');
  await A.pg.click('[data-xp=sig]');
  await A.pg.waitForSelector('[data-xp=entregar]');
  ok('resumen final con las preguntas de control acertadas', /Resumen editado/.test(await A.pg.textContent('.xp-diapo')) && /1 de 1 acertadas/.test(await A.pg.textContent('.xp-diapo')));
  await A.pg.click('[data-xp=entregar]');
  await A.pg.waitForFunction(() => /Entregado/.test(document.querySelector('.xp-diapo')?.textContent || ''), null, { timeout: 15000 });
  const tr = JSON.stringify(await docREST(`trabajos/${id}_${T.GE.id}_3`));
  ok('entregar: «Aciertos: 1/1» en el trabajo', /Aciertos: 1\/1/.test(tr));
  await shot(A.pg, 'f4_explicacion_resumen');

  // ------------------------------------------------------------- pregunta en directo
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=directo]', { timeout: 20000 });
  await pg.click('#asTrabajo [data-cl=directo]');
  await pg.waitForSelector('#dirForm');
  await pg.selectOption('#dirForm [name=grupo]', T.GE.id);
  await pg.fill('#dirForm [name=enunciado]', '¿Qué color prefieres?');
  await pg.fill('#dirForm [name=opciones]', 'Rojo\nVerde\nAzul');
  await pg.click('#dirForm button[type=submit]');
  await pg.waitForSelector('.dir-pant', { timeout: 15000 });
  await A.pg.goto(BASE + '#asignaturas');
  await A.pg.waitForSelector('.dir-al .dir-al-op', { timeout: 20000 });
  ok('alumno: le aparece la pregunta en directo en cualquier página', /Qué color prefieres/.test(await A.pg.textContent('.dir-al')));
  await A.pg.click('.dir-al [data-dr="1"]');
  await pg.waitForFunction(() => /^1/.test(document.querySelectorAll('.dir-pant .dir-fila')[1]?.querySelector('.dir-n')?.textContent || ''), null, { timeout: 15000 });
  ok('profesor: el gráfico se actualiza en tiempo real (anónimo)', /1 respuesta/.test(await pg.textContent('.dir-pant')) && !/03|nº/.test(await pg.textContent('.dir-pant')));
  await A.pg.click('.dir-al [data-dr="2"]');
  await pg.waitForFunction(() => /^1/.test(document.querySelectorAll('.dir-pant .dir-fila')[2]?.querySelector('.dir-n')?.textContent || '') && /^0/.test(document.querySelectorAll('.dir-pant .dir-fila')[1]?.querySelector('.dir-n')?.textContent || ''), null, { timeout: 15000 });
  ok('el alumno puede cambiar su respuesta (cuenta una vez)', /1 respuesta/.test(await pg.textContent('.dir-pant')));
  await pg.check('.dir-pant [data-d=mostrar]');
  await A.pg.waitForSelector('.dir-al .dir-graf', { timeout: 15000 });
  ok('«Mostrar el gráfico a los alumnos»: lo ven en su tarjeta', true);
  await shot(pg, 'f4_directo_profesor');
  await A.pg.setViewportSize({ width: 390, height: 844 }); await A.pg.waitForTimeout(300);
  await shot(A.pg, 'f4_directo_alumno_movil');
  await A.pg.setViewportSize({ width: 1280, height: 860 });
  await pg.click('.dir-pant [data-d=cerrarP]');
  await A.pg.waitForSelector('.dir-al', { state: 'detached', timeout: 15000 });
  ok('al cerrar la pregunta desaparece de la pantalla del alumno', true);
  await pg.click('.dir-modal [data-d=cerrar]');

  // ------------------------------------------------------------- nota desde el cuaderno
  await pg.goto(BASE + '#panel/notas');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(400);
  await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`th[data-col="${id}"] [data-ap=notasActividad]`, { timeout: 20000 });
  await pg.click(`th[data-col="${id}"] [data-ap=notasActividad]`);
  await pg.waitForTimeout(2000);
  const n = await docREST(`notas/${id}_${T.GE.id}_3`);
  ok('cuaderno: «Poner notas» pasa «Aciertos: 1/1» a un 10', Number(n.fields?.nota?.integerValue ?? n.fields?.nota?.doubleValue) === 10);
}
