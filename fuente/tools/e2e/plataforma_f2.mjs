// Fase 2 · tipos de pregunta nuevos, modo examen (registro de salidas), puntuación parcial y banco
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local }) {
  const pg = T.P.pg;
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  const EX = { tipo: 'examen', titulo: 'Examen tipos nuevos', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: true, pantallaCompleta: true },
    preguntas: [
      { id: 'emp', tipo: 'emparejar', enunciado: 'Une cada magnitud con su unidad', puntos: 2, pares: [['Tensión', 'Voltio'], ['Intensidad', 'Amperio'], ['Resistencia', 'Ohmio']], distractores: ['Julio'], criterio: 'eee_c1_1' },
      { id: 'ord', tipo: 'ordenar', enunciado: 'Ordena los pasos', puntos: 2, elementos: ['Primero', 'Segundo', 'Tercero', 'Cuarto'], criterio: 'eee_c1_2' },
      { id: 'hue', tipo: 'huecos', enunciado: 'Completa', puntos: 2, texto: 'La ley de [[Ohm]] relaciona tensión e [[intensidad|corriente]].', criterio: 'eee_c1_2' },
      { id: 'num', tipo: 'numerica', enunciado: 'Calcula I', puntos: 1, valor: 0.5, tolerancia: 10, modo: 'pct', unidad: 'A', criterio: 'eee_c1_3' },
      { id: 'zon', tipo: 'zonas', enunciado: 'Pulsa en el centro de la foto', puntos: 1, imagen: 'img/fotos/eee.webp', alt: 'Foto', zonas: [{ x: 35, y: 35, w: 30, h: 30, nombre: 'Centro' }], criterio: 'eee_c1_3' }] };
  await pegarJSON(pg, EX); await pg.waitForSelector('#jsPrev .js-prev');
  ok('importar examen con emparejar, ordenar, huecos, numérica y zonas (modo examen)', /Emparejar.*Ordenar.*Completar huecos.*Numérica.*Imagen con zonas/s.test(await pg.textContent('#jsPrev')) && /modo examen/.test(await pg.textContent('#jsPrev')));
  try { await guardarJSON(pg); } catch (e) { throw new Error('guardar: ' + (await pg.textContent('#jsMsg').catch(() => '')) + ' ' + (await pg.textContent('#jsErr').catch(() => ''))); }
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Examen tipos nuevos")', { timeout: 15000 });
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("Examen tipos nuevos")', 'data-item'); T.EX2 = id;
  const ex = JSON.stringify(await docREST('examenes/' + id));
  ok('examen guardado sin soluciones (zonas, valor, pares y orden fuera de «examenes»)', !/Centro|"0.5"|doubleValue":0.5|Tercero.*Cuarto.*Primero.*Segundo$/.test(ex) && !/"Ohm"/.test(ex));
  // editor: los tipos nuevos se ven y se pueden editar
  await menu(pg, id, 'editar'); await pg.waitForSelector('.ap-q [data-qf=pares]', { timeout: 15000 });
  ok('editor: tipos nuevos editables (parejas, orden, huecos, numérica, zonas) y modo examen marcado', (await pg.inputValue('.ap-q [data-qf=pares]')).includes('Tensión | Voltio') && (await pg.inputValue('.ap-q [data-qf=elementos]')).startsWith('Primero\nSegundo') && /\[\[Ohm\]\]/.test(await pg.inputValue('.ap-q [data-qf=texto]')) && await pg.isChecked('#apItemForm [name=pantallaCompleta]'));
  await pg.evaluate(() => document.querySelector('.ap-q [data-qf=zonasTxt]').scrollIntoView());
  await shot(pg, 'f2_editor_tipos_nuevos');
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  ok('publicar el examen después de editarlo (las soluciones se conservan)', /Ohm/.test(JSON.stringify(await docREST('claves/' + id))));

  // ---------------------------------------------------------------- alumno
  const A = await T.alumno(T.GE, 3, '4321', { width: 1280, height: 860 }); T.A3 = A;
  await A.pg.goto(BASE + '#trabajo/' + id);
  await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  ok('alumno: aviso de modo examen antes de empezar', /Modo examen/.test(await A.pg.textContent('#aula')));
  await A.pg.click('[data-au=empezar]');
  await A.pg.waitForSelector('#auExamen fieldset[data-tipo=zonas]', { timeout: 20000 });
  ok('alumno: el examen se abre con la franja de modo examen', !!(await A.pg.$('#exModo')));
  for (const [iz, de] of [['Tensión', 'Voltio'], ['Intensidad', 'Amperio'], ['Resistencia', 'Ohmio']]) {
    const sel = await A.pg.$(`fieldset[data-q=emp] label:has-text("${iz}") select`); await sel.selectOption({ label: de });
  }
  const objetivo = ['Primero', 'Segundo', 'Tercero', 'Cuarto'];
  for (let i = 0; i < objetivo.length; i++) {
    for (let k = 0; k < 6; k++) {
      const actual = await A.pg.$$eval('fieldset[data-q=ord] .ex-ord-t', (l) => l.map((x) => x.textContent));
      const j = actual.indexOf(objetivo[i]); if (j <= i) break;
      await A.pg.click(`fieldset[data-q=ord] li:nth-child(${j + 1}) [data-ord="-1"]`);
    }
  }
  const ordenFinal = await A.pg.$$eval('fieldset[data-q=ord] .ex-ord-t', (l) => l.map((x) => x.textContent).join());
  ok('ordenar con los botones ↑ ↓ (accesible con teclado)', ordenFinal === objetivo.join(), ordenFinal);
  await A.pg.fill('fieldset[data-q=hue] [data-hueco="0"]', 'ohm'); await A.pg.fill('fieldset[data-q=hue] [data-hueco="1"]', 'voltaje');
  await A.pg.fill('fieldset[data-q=num] input', '0,52');
  await A.pg.waitForFunction(() => { const i = document.querySelector('fieldset[data-q=zon] img'); return i?.complete && i.naturalHeight > 0; }, null, { timeout: 15000 });
  await A.pg.$eval('fieldset[data-q=zon] img', (i) => i.scrollIntoView({ block: 'center' })); await A.pg.waitForTimeout(300);
  const img = await A.pg.$('fieldset[data-q=zon] img'); const bb = await img.boundingBox();
  await A.pg.mouse.click(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5);
  ok('zonas: la marca aparece donde se pulsa', !!(await A.pg.$('fieldset[data-q=zon] .ex-marca')));
  await shot(A.pg, 'f2_alumno_examen_tipos');
  // simular una salida de la pestaña de 2 s
  await A.pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await A.pg.waitForTimeout(2200);
  await A.pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await A.pg.waitForTimeout(1500);
  await A.pg.click('#auExamen button[type=submit]');
  await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  ok('alumno: entrega el examen', true);
  const inc = JSON.stringify(await docREST(`incidencias/${id}_${T.GE.id}_3`));
  ok('modo examen: la salida de la pestaña queda anotada (hora y duración)', /pestaña/.test(inc) && /"dur":\{"integerValue":"[23]"\}|integerValue":"2"|integerValue":"3"/.test(inc), inc.slice(0, 200));

  // ---------------------------------------------------------------- profesor: cuaderno
  await pg.goto(BASE + '#panel/notas');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500);
  await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`th[data-col="${id}"]`, { timeout: 20000 });
  await pg.click(`th[data-col="${id}"] [data-ap=autocorregir]`);
  await pg.waitForTimeout(2000);
  const nota = await docREST(`notas/${id}_${T.GE.id}_3`);
  const n = Number(nota.fields?.nota?.doubleValue ?? nota.fields?.nota?.integerValue);
  ok('puntuación parcial: huecos 1 de 2 → 7 de 8 puntos → 8,75', Math.abs(n - 8.75) < 0.01, String(n));
  await pg.click(`td[data-celda="${id}"][data-n="3"]`);
  await pg.waitForSelector('#apDetalle .ex-sal, #apDetalle :text("Sin salidas")', { timeout: 15000 });
  ok('cuaderno: el profesor ve las salidas (informativo) y la respuesta de cada tipo', /la pestaña/.test(await pg.textContent('#apDetalle')) && /Tensión → Voltio/.test(await pg.textContent('#apDetalle')) && /no cambia la nota/.test(await pg.textContent('#apDetalle')));
  await shot(pg, 'f2_cuaderno_salidas');

  // ---------------------------------------------------------------- banco
  await pg.goto(BASE + '#asig/eee/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=banco]', { timeout: 20000 });
  await pg.click('#asTrabajo [data-cl=banco]');
  await pg.waitForSelector('.cl-modal .bk');
  await pg.click('.cl-modal summary:has-text("Pegar JSON")');
  const B = [1, 2, 3].map((i) => ({ tipo: 'vf', enunciado: 'Afirmación A' + i, correcta: true, criterio: 'eee_c1_1' })).concat([1, 2].map((i) => ({ tipo: 'test', enunciado: 'Pregunta B' + i, opciones: ['x', 'y'], correcta: 0, criterio: 'eee_c2_1' })));
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(B));
  await pg.click('.cl-modal [data-m=añadirJSON]');
  await pg.waitForSelector('.cl-modal [data-bk-n="eee_c2_1"]', { timeout: 15000 });
  const total = () => pg.$$eval('.cl-modal [data-bk-n]', (l) => l.reduce((a, x) => a + Number(x.max), 0));
  ok('banco: preguntas añadidas y agrupadas por criterio', (await pg.$$('.cl-modal [data-bk-n]')).length === 2 && await total() === 5);
  await pg.click('.cl-modal summary:has-text("Copiar las preguntas")');
  await pg.selectOption('.cl-modal [data-m-f=ex]', id); await pg.click('.cl-modal [data-m=deExamen]');
  await pg.waitForFunction(() => [...document.querySelectorAll('.cl-modal [data-bk-n]')].reduce((a, x) => a + Number(x.max), 0) === 10, null, { timeout: 15000 });
  ok('banco: copiar las preguntas de un examen (con su criterio)', true);
  await pg.fill('.cl-modal [data-bk-n="eee_c1_1"]', '2'); await pg.fill('.cl-modal [data-bk-n="eee_c2_1"]', '1');
  await pg.fill('.cl-modal [data-m-f=titulo]', 'Examen generado del banco');
  await shot(pg, 'f2_banco');
  await pg.click('.cl-modal [data-m=generar]');
  await pg.waitForSelector('#bkGenMsg [data-m=abrirEx]', { timeout: 15000 });
  const idG = await pg.getAttribute('#bkGenMsg [data-m=abrirEx]', 'data-id');
  const gen = await docREST('examenes/' + idG);
  const qs = gen.fields?.preguntas?.arrayValue?.values || [];
  const crits = qs.map((v) => v.mapValue.fields.criterio?.stringValue).sort().join();
  ok('generar examen: 2 del criterio c1_1 (de 4) y 1 del c2_1 (de 2), en borrador', crits === 'eee_c1_1,eee_c1_1,eee_c2_1', crits);
  await pg.click('.cl-modal [data-m=cerrar]');
}
