// Fase 12 · clasificar (arrastrar), completar tabla, respuesta abierta (larga, con rúbrica) y actividad interactiva
// (sin tiempo límite, varios intentos, se guarda el mejor; «Poner notas» en el cuaderno).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const num = (f) => Number(f?.doubleValue ?? f?.integerValue);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local }) {
  const pg = T.P.pg;
  const crear = async (EL) => {
    await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
    await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 });
    const prev = await pg.textContent('#jsPrev');
    try { await guardarJSON(pg); } catch (e) { throw new Error('guardar: ' + (await pg.textContent('#jsMsg').catch(() => '')) + ' ' + (await pg.textContent('#jsErr').catch(() => ''))); }
    await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
    return [await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item'), prev];
  };
  const EX = { tipo: 'examen', titulo: 'Examen F12 materiales', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), barajar: true },
    preguntas: [
      { id: 'cla', tipo: 'clasificar', enunciado: 'Clasifica los materiales', puntos: 4, grupos: [{ nombre: 'Conductores', elementos: ['Cobre', 'Aluminio'] }, { nombre: 'Aislantes', elementos: ['Plástico', 'Madera'] }] },
      { id: 'tab', tipo: 'tabla', enunciado: 'Completa la tabla', puntos: 3, columnas: ['Magnitud', 'Unidad', 'Símbolo'], filas: [['Tensión', '[[voltio]]', '[[V]]'], ['Intensidad', '[[amperio]]', 'A']] },
      { id: 'abi', tipo: 'abierta', enunciado: 'Explica por qué se funde un fusible', extension: 'larga', rubrica: [{ c: 'Explica la causa', p: 2 }, { c: 'Vocabulario técnico', p: 1 }] }] };
  const [id, prev] = await crear(EX);
  ok('importar examen con clasificar, tabla y respuesta abierta', /Clasificar en grupos.*Completar tabla.*Respuesta abierta/s.test(prev), prev.slice(0, 160));
  const exs = JSON.stringify(await docREST('examenes/' + id)); const cls = JSON.stringify(await docREST('claves/' + id));
  ok('examen sin soluciones (los grupos y las celdas están solo en «claves»)', !/voltio|amperio/.test(exs) && /voltio/.test(cls) && /Conductores/.test(exs));
  await menu(pg, id, 'editar'); await pg.waitForSelector('.ap-q [data-qf=grupos]', { timeout: 15000 });
  ok('editor: clasificar, tabla y rúbrica de la abierta se editan en texto', /Conductores: (Cobre; Aluminio|Aluminio; Cobre)/.test(await pg.inputValue('.ap-q [data-qf=grupos]')) && /Tensión \| \[\[voltio\]\] \| \[\[V\]\]/.test(await pg.inputValue('.ap-q [data-qf=tabla]')) && /Explica la causa \| 2/.test(await pg.inputValue('.ap-q [data-qf=rubricaQ]')) && (await pg.inputValue('.ap-q [data-qf=extension]')) === 'larga', [await pg.inputValue('.ap-q [data-qf=grupos]'), await pg.inputValue('.ap-q [data-qf=tabla]'), await pg.inputValue('.ap-q [data-qf=rubricaQ]')].join(' ## '));
  await shot(pg, 'f12_editor_preguntas');
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  ok('publicar tras editar: las soluciones se conservan', /voltio/.test(JSON.stringify(await docREST('claves/' + id))));
  // ---- alumno
  const A = await T.alumno(T.GE, 11, '4321', { width: 1280, height: 950 });
  A.pg.on('pageerror', (e) => console.log('PAGEERR', e.message)); A.pg.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  await A.pg.click('[data-au=empezar]'); await A.pg.waitForSelector('#auExamen fieldset[data-tipo=clasificar] .ex-cl-chip', { timeout: 20000 });
  // arrastrar y soltar (eventos HTML5 con DataTransfer: el arrastre nativo de Playwright no es fiable en headless)
  await A.pg.evaluate(() => {
    const fs = document.querySelector('fieldset[data-q=cla]'); const chip = [...fs.querySelectorAll('.ex-cl-chip')].find((c) => c.textContent.includes('Cobre')); const dest = fs.querySelector('[data-clg="0"]');
    const dt = new DataTransfer(); const ev = (t, el) => el.dispatchEvent(new DragEvent(t, { dataTransfer: dt, bubbles: true, cancelable: true }));
    ev('dragstart', chip); ev('dragover', dest); ev('drop', dest); ev('dragend', chip);
  });
  await A.pg.waitForTimeout(300);
  ok('clasificar: arrastrar un elemento a su grupo', !!(await A.pg.$('fieldset[data-q=cla] [data-clg="0"] .ex-cl-chip:has-text("Cobre")')));
  for (const [e, g] of [['Aluminio', '0'], ['Plástico', '1'], ['Madera', '0']]) await A.pg.selectOption(`fieldset[data-q=cla] .ex-cl-chip:has-text("${e}") select`, g);
  ok('clasificar: también con el desplegable (teclado y móvil); la zona sin clasificar queda vacía', (await A.pg.$$('fieldset[data-q=cla] .ex-cl-pool .ex-cl-chip')).length === 0 && !!(await A.pg.$('fieldset[data-q=cla] [data-clg="1"] .ex-cl-chip:has-text("Plástico")')));
  await A.pg.fill('fieldset[data-q=tab] [data-hueco="0"]', 'Voltio'); await A.pg.fill('fieldset[data-q=tab] [data-hueco="1"]', 'V'); await A.pg.fill('fieldset[data-q=tab] [data-hueco="2"]', 'ohmio');
  await A.pg.click('fieldset[data-q=abi] .ex-ab-ed'); await A.pg.keyboard.type('Se funde por una ');
  await A.pg.click('fieldset[data-q=abi] [data-exab=bold]'); await A.pg.keyboard.type('sobreintensidad'); await A.pg.click('fieldset[data-q=abi] [data-exab=bold]'); await A.pg.keyboard.type(' que calienta el hilo.');
  ok('respuesta larga: editor con formato y contador de palabras', /9 palabras/.test(await A.pg.textContent('fieldset[data-q=abi] .ex-ab-pal')), await A.pg.textContent('fieldset[data-q=abi] .ex-ab-pal'));
  await shot(A.pg, 'f12_alumno_examen');
  await A.pg.waitForTimeout(1500);
  await A.pg.click('#auExamen button[type=submit]'); await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  const tr = JSON.stringify(await docREST(`trabajos/${id}_${T.GE.id}_11`));
  ok('entregado: respuestas de clasificar, tabla y la abierta (HTML limpio con negrita)', /<strong>sobreintensidad<\/strong>/.test(tr) && /ohmio/.test(tr), tr.slice(0, 160));
  // ---- profesor: autocorregir + rúbrica de la abierta
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`th[data-col="${id}"] [data-ap=autocorregir]`, { timeout: 20000 });
  await pg.click(`th[data-col="${id}"] [data-ap=autocorregir]`); await pg.waitForTimeout(2000);
  let nt = await docREST(`notas/${id}_${T.GE.id}_11`);
  ok('autocorrección parcial: clasificar 3/4 → 3 pt, tabla 2/3 → 2 pt, abierta pendiente (0) → 5/10', Math.abs(num(nt.fields?.nota) - 5) < 0.01, String(num(nt.fields?.nota)));
  await pg.click(`td[data-celda="${id}"][data-n="11"]`); await pg.waitForSelector('#apDetalle .ap-qrub', { timeout: 15000 });
  ok('cuaderno: la respuesta larga se ve con formato y la rúbrica con niveles 1–4', !!(await pg.$('#apDetalle .ap-ab strong')) && (await pg.$$('#apDetalle [data-ap-qn]')).length === 8);
  await pg.click('#apDetalle [data-ap-qn="abi|0|2"]'); await pg.click('#apDetalle [data-ap-qn="abi|1|0.5"]');
  ok('niveles de la rúbrica: Excelente (2) + Suficiente (0,5) → 2,5 puntos y nota 7,5', (await pg.inputValue('#apDetalle .ap-qpts[data-qid=abi]')) === '2.5' && Math.abs(Number(await pg.inputValue('#apNota')) - 7.5) < 0.01, await pg.inputValue('#apNota'));
  await shot(pg, 'f12_cuaderno_rubrica');
  await pg.click('#apNotaForm button[type=submit]'); await pg.waitForSelector('#apNotaMsg:has-text("Guardado")', { timeout: 15000 });
  nt = JSON.stringify(await docREST(`notas/${id}_${T.GE.id}_11`));
  ok('la nota guarda el detalle de la rúbrica de la pregunta (abi_r0 = 2, abi_r1 = 0,5)', /"abi_r0":\{"integerValue":"2"\}|abi_r0":\{"doubleValue":2\}/.test(nt) && /abi_r1":\{"doubleValue":0.5\}/.test(nt), nt.slice(0, 300));
  // ---- actividad interactiva
  const IA = { tipo: 'interactiva', titulo: 'Repaso F12 magnitudes', puntos: 10, contenido: { intentos: 2, soluciones: true, preguntas: [
    { id: 'q1', tipo: 'test', enunciado: '¿Qué mide un amperímetro?', opciones: ['La tensión', 'La intensidad', 'La resistencia'], correcta: 1 },
    { id: 'q2', tipo: 'tabla', enunciado: 'Completa', puntos: 1, columnas: ['Magnitud', 'Unidad'], filas: [['Tensión', '[[voltio|V]]']] }] } };
  const [ia] = await crear({ ...IA, publicar: true });
  const ci = JSON.stringify(await docREST('items/' + ia));
  ok('actividad interactiva guardada con preguntas y claves separadas (sin listas anidadas)', /claves/.test(ci) && /voltio\|V/.test(ci));
  await menu(pg, ia, 'editar'); await pg.waitForSelector('#apItemForm [name=contenido]', { timeout: 15000 });
  ok('editor: el JSON se muestra con las soluciones dentro de cada pregunta', /"correcta": 1/.test(await pg.inputValue('#apItemForm [name=contenido]')) && /\[\[voltio\|V\]\]/.test(await pg.inputValue('#apItemForm [name=contenido]')));
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${ia}"]`, { timeout: 15000 });
  await A.pg.goto(BASE + '#trabajo/' + ia); await A.pg.waitForSelector('.ia-form fieldset[data-q=q1]', { timeout: 20000 }).catch(async (e) => { throw new Error('interactiva: ' + (await A.pg.textContent('#aula')).slice(0, 400)); });
  ok('alumno: sin tiempo límite y 0 de 2 intentos', /Sin tiempo límite/.test(await A.pg.textContent('.ia-cab')) && /0 de 2 intentos/.test(await A.pg.textContent('.ia-cab')));
  await A.pg.check('fieldset[data-q=q1] label:has-text("La tensión") input'); await A.pg.fill('fieldset[data-q=q2] [data-hueco="0"]', 'v');
  await A.pg.click('.ia-form button[type=submit]'); await A.pg.waitForSelector('.ia-res', { timeout: 15000 });
  await A.pg.waitForFunction(() => /Guardado/.test(document.querySelector('.ia-res')?.textContent || ''), null, { timeout: 15000 });
  ok('intento 1: corrige al momento (1 de 2) y enseña la solución de lo que falla', /1 \/ 2 puntos/.test(await A.pg.textContent('.ia-res')) && /Solución: La intensidad/.test(await A.pg.textContent('fieldset[data-q=q1]')) && !!(await A.pg.$('fieldset[data-q=q2].ia-ok')));
  await shot(A.pg, 'f12_interactiva_intento');
  await A.pg.click('[data-ia=otra]'); await A.pg.waitForSelector('.ia-form button[type=submit]');
  await A.pg.check('fieldset[data-q=q1] label:has-text("La intensidad") input'); await A.pg.fill('fieldset[data-q=q2] [data-hueco="0"]', 'Voltio');
  await A.pg.click('.ia-form button[type=submit]'); await A.pg.waitForFunction(() => /mejor intento/.test(document.querySelector('.ia-res')?.textContent || ''), null, { timeout: 15000 });
  ok('intento 2: 2/2, es el mejor y ya no quedan intentos', /2 \/ 2 puntos/.test(await A.pg.textContent('.ia-res')) && /No te quedan intentos/.test(await A.pg.textContent('.ia')));
  const ti = await docREST(`trabajos/${ia}_${T.GE.id}_11`);
  ok('se guarda el mejor intento («Aciertos: 2/2») y los datos de los intentos', /Aciertos: 2\/2/.test(ti.fields?.texto?.stringValue || '') && num(ti.fields?.datos?.mapValue?.fields?.intentos) === 2 && num(ti.fields?.datos?.mapValue?.fields?.mejor) === 10);
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`th[data-col="${ia}"] [data-ap=notasActividad]`, { timeout: 20000 });
  await pg.click(`th[data-col="${ia}"] [data-ap=notasActividad]`); await pg.waitForTimeout(2000);
  ok('cuaderno: «Poner notas» pasa el mejor intento a nota (10)', num((await docREST(`notas/${ia}_${T.GE.id}_11`)).fields?.nota) === 10);
  await A.ctx.close();
}
