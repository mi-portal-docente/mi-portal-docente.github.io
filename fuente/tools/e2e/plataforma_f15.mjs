// Fase 15 · el profesor revisa el examen de CADA alumno: lista de entregas del cuaderno → abrir una →
// cada pregunta con su respuesta, la solución y los puntos → «Ver y corregir el examen completo» con imágenes, zonas y colores.
// Incluye entregas «antiguas» (hechas antes de las novedades de hoy, sin campos nuevos) y un examen sin terminar.
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local, REST, owner }) {
  const pg = T.P.pg;
  const IMG = 'img/eee/test/eee_t4_componentes.svg';
  const EX = { formato: 'superprofe/elemento@1', tipo: 'examen', titulo: 'Revisión F15 · todos los tipos', puntos: 10,
    examen: { abre: local(Date.now() - 600e3), cierra: local(Date.now() + 7200e3), limiteMin: 30, barajar: false },
    preguntas: [
      { id: 't1', tipo: 'test', enunciado: 'Test con imagen encima', imagen: IMG, alt: 'Componentes', opciones: ['Uno', 'Dos', 'Tres'], correcta: 1 },
      { id: 't2', tipo: 'test', enunciado: 'Test con imágenes en las opciones', opciones: [{ texto: 'R1', imagen: 'img/eee/test/eee_rep_r1.svg' }, { texto: 'R2', imagen: 'img/eee/test/eee_rep_r2.svg' }], correcta: 0 },
      { id: 'v1', tipo: 'vf', enunciado: 'Verdadero o falso', correcta: true },
      { id: 'c1', tipo: 'corta', enunciado: 'Respuesta corta', aceptadas: ['ohm'] },
      { id: 'n1', tipo: 'numerica', enunciado: 'Numérica', valor: 4.7, tolerancia: 0.1, unidad: 'kΩ' },
      { id: 'z1', tipo: 'zonas', enunciado: 'Pulsa la zona A', imagen: IMG, alt: 'Plano', zonas: [{ x: 5, y: 5, w: 40, h: 40, nombre: 'Zona A', correcta: true }, { x: 55, y: 55, w: 30, h: 30, nombre: 'Zona B', correcta: false }] },
      { id: 'k1', tipo: 'colores', enunciado: 'Lee la resistencia', clase: 'resistencia4', bandas: ['Marrón', 'Negro', 'Rojo', 'Oro'], modo: 'leer' },
      { id: 'k2', tipo: 'colores', enunciado: 'Pinta la bobina', clase: 'inductor', bandas: ['Amarillo', 'Violeta', 'Rojo', 'Plata'], modo: 'pintar' }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EX); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }).catch(async (e) => { throw new Error('JSON inválido: ' + (await pg.textContent('#jsErr').catch(() => ''))); }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EX.titulo}")`, 'data-item');
  await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
  await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  // ---- alumno 21: lo hace de verdad en la interfaz
  const A = await T.alumno(T.GE, 21, '4321', { width: 1280, height: 1000 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  await A.pg.click('[data-au=empezar]'); await A.pg.waitForSelector('#auExamen fieldset[data-q=z1] .ex-zonas', { timeout: 20000 });
  await A.pg.check('fieldset[data-q=t1] input[value="1"]'); await A.pg.check('fieldset[data-q=t2] input[value="1"]'); await A.pg.check('fieldset[data-q=v1] input[value="true"]');
  await A.pg.fill('fieldset[data-q=c1] input', 'Ohm'); await A.pg.fill('fieldset[data-q=n1] input', '4,7');
  await A.pg.locator('fieldset[data-q=z1] .ex-zonas').scrollIntoViewIfNeeded(); await A.pg.click('fieldset[data-q=z1] .ex-zonas img', { position: { x: 40, y: 40 } });
  await A.pg.fill('fieldset[data-q=k1] [data-cc=v]', '1'); await A.pg.selectOption('fieldset[data-q=k1] [data-cc=u]', { index: 1 }).catch(() => { });
  await A.pg.click('fieldset[data-q=k2] .cc-b[data-banda="0"]'); await A.pg.click('fieldset[data-q=k2] .cc-pc:has-text("Amarillo")');
  await A.pg.waitForTimeout(800);
  await A.pg.click('#auExamen button[type=submit]'); await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 20000 });
  const tid = (n) => `${id}_${T.GE.id}_${n}`;
  let d21 = null; for (let i = 0; i < 20; i++) { d21 = await docREST('trabajos/' + tid(21)); if (d21.fields?.estado?.stringValue === 'entregado') break; await new Promise((r) => setTimeout(r, 500)); }
  await A.ctx.close();
  ok('F15 · preparación: el alumno 21 entrega el examen con zonas y colores', d21.fields?.estado?.stringValue === 'entregado' && /z1/.test(JSON.stringify(d21.fields.respuestas)) && /k2/.test(JSON.stringify(d21.fields.respuestas)), JSON.stringify(d21.fields?.respuestas).slice(0, 200));
  // ---- alumno 22: entrega «antigua» (como las de antes de hoy: solo test, V/F y corta) y alumno 23: examen empezado sin entregar
  const H = { ...owner.headers, 'Content-Type': 'application/json' };
  const f22 = JSON.parse(JSON.stringify(d21.fields)); f22.respuestas = { mapValue: { fields: { t1: { integerValue: '0' }, v1: { booleanValue: false }, c1: { stringValue: 'ohm' } } } }; if (f22.numero) f22.numero = { integerValue: '22' };
  for (const k of Object.keys(f22)) if (/^(version|reloj|zonas|colores|revision)/i.test(k)) delete f22[k];
  const f23 = JSON.parse(JSON.stringify(f22)); f23.estado = { stringValue: 'en_curso' }; f23.respuestas = { mapValue: { fields: { t1: { integerValue: '2' } } } }; if (f23.numero) f23.numero = { integerValue: '23' };
  for (const [n, f] of [[22, f22], [23, f23]]) { const al = JSON.stringify(f.al || ''); if (f.al) f.al = { stringValue: `${T.GE.id}_${n}` }; await fetch(`${REST}/trabajos/${tid(n)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: f }) }); }
  // ---- profesor: cuaderno
  const snap = async () => JSON.stringify(await Promise.all(['trabajos', 'notas', 'items', 'examenes', 'claves'].map(async (c) => (await (await fetch(`${REST}/${c}?pageSize=500`, owner)).json()).documents?.length)));
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 }); await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`td[data-celda="${id}"][data-n="21"]`, { timeout: 20000 }); await pg.waitForTimeout(1200);
  const antes = await snap();
  const celdas = await pg.$$eval(`td[data-celda="${id}"]`, (l) => l.map((x) => [x.dataset.n, x.className, x.textContent.trim()]));
  const cl = (n) => (celdas.find((c) => c[0] === String(n)) || [])[1] || '';
  ok('F15 · lista del cuaderno: se ve quién ha entregado (21 y 22), quién lo dejó a medias (23) y quién no ha hecho nada', /entregado|nota/.test(cl(21)) && /entregado|nota/.test(cl(22)) && /curso|empez/.test(cl(23)) && !/entregado|nota/.test(cl(1)), JSON.stringify(celdas.filter((c) => [1, 21, 22, 23].includes(+c[0]))));
  // 21: detalle por pregunta
  await pg.click(`td[data-celda="${id}"][data-n="21"]`); await pg.waitForSelector('#apDetalle .ap-resp li', { timeout: 15000 });
  const lis = await pg.$$eval('#apDetalle .ap-resp li', (l) => l.map((x) => ({ c: x.className, t: x.textContent.replace(/\s+/g, ' ').trim().slice(0, 140) })));
  ok('F15 · detalle del alumno 21: una línea por pregunta (8) con su respuesta y la solución', lis.length === 8 && lis.every((x) => /Solución|manual|Puntos/.test(x.t)), JSON.stringify(lis.map((x) => x.c)));
  ok('F15 · detalle: la respuesta de zonas, de colores y de test con imágenes se lee en texto', /punto \(/.test(lis[5].t) && /Amarillo|Marrón/.test(lis[7].t + lis[6].t) && /R2|imagen/.test(lis[1].t), lis[5].t + ' | ' + lis[6].t + ' | ' + lis[7].t);
  await shot(pg, 'f15_detalle_alumno21');
  // examen completo
  ok('F15 · el botón ya no dice «solo lectura»', /Ver y corregir el examen completo/.test(await pg.textContent('[data-ap=verExamen]')) && !/solo lectura/i.test(await pg.textContent('[data-ap=verExamen]')), await pg.textContent('[data-ap=verExamen]'));
  await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal .rv-form fieldset[data-q]', { timeout: 10000 });
  await pg.waitForTimeout(600);
  const rv = await pg.evaluate(() => ({ n: document.querySelectorAll('.rv-form fieldset[data-q]').length, marc: document.querySelectorAll('.rv-form .ia-fb').length, dis: [...document.querySelectorAll('.rv-form fieldset input, .rv-form fieldset select, .rv-form fieldset textarea')].every((e) => e.disabled), ptsOn: [...document.querySelectorAll('.rv-form .aj-bar .ap-qpts')].every((e) => !e.disabled) && document.querySelectorAll('.rv-form .aj-bar').length > 0, radios: [...document.querySelectorAll('.rv-form input[type=radio]:checked')].length, zonaOk: document.querySelectorAll('.rv-form .ex-zona-sol.ok').length, marca: document.querySelectorAll('.rv-form .ex-marca').length, partes: document.querySelectorAll('.rv-form .cc-partes').length, imgs: document.querySelectorAll('.rv-form img').length, zoom: document.querySelectorAll('.rv-form [data-zoom]').length, resumen: document.querySelector('.rv-res')?.textContent.replace(/\s+/g, ' ') || '', aviso: document.querySelector('.rv-aviso')?.textContent.replace(/\s+/g, ' ') || '', cab: document.querySelector('.rv-h-nota')?.textContent.replace(/\s+/g, ' ') || '', btn: document.querySelector('[data-ap=verExamen]')?.textContent.replace(/\s+/g, ' ') || '' }));
  ok('F15 · «Ver y corregir el examen completo»: las 8 preguntas como las contestó, marcadas, respuestas bloqueadas y barra de corrección', rv.n === 8 && rv.marc === 8 && rv.dis && rv.ptsOn && rv.radios === 3 && /no se cambian/.test(rv.aviso) && /dar por válida/i.test(rv.aviso) && /Nota/.test(rv.cab), JSON.stringify(rv));
  ok('F15 · examen completo: la imagen de la zona con la marca del alumno y la zona correcta; colores con su corrección por partes; imágenes ampliables', rv.zonaOk === 1 && rv.marca === 1 && rv.partes === 2 && rv.imgs >= 4 && rv.zoom >= 4, JSON.stringify(rv));
  await shot(pg, 'f15_examen_completo_escritorio');
  await pg.click('.rv-form [data-zoom] >> nth=0'); await pg.waitForSelector('.ex-visor', { timeout: 5000 });
  ok('F15 · examen completo: tocar una imagen la amplía (visor) y Esc vuelve al examen', true);
  await pg.keyboard.press('Escape'); await pg.waitForSelector('.ex-visor', { state: 'detached' });
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(500);
  const sw = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, m: document.querySelector('.rv-dlg').getBoundingClientRect().width, w: innerWidth }));
  ok('F15 · examen completo en el móvil (390 px): cabe en la pantalla, sin scroll lateral', sw.sw <= sw.w + 1 && sw.m <= sw.w + 1, JSON.stringify(sw));
  await shot(pg, 'f15_examen_completo_movil');
  await pg.evaluate(() => document.querySelector('.rv-modal').scrollTo(0, 1400)); await pg.waitForTimeout(200); await shot(pg, 'f15_examen_completo_movil_2');
  await pg.evaluate(() => document.querySelector('.rv-modal').scrollTo(0, 2800)); await pg.waitForTimeout(200); await shot(pg, 'f15_examen_completo_movil_3');
  await pg.setViewportSize({ width: 1440, height: 900 });
  await pg.keyboard.press('Escape'); await pg.waitForSelector('.rv-modal', { state: 'detached' });
  // 22: entrega antigua
  await pg.click(`td[data-celda="${id}"][data-n="22"]`); await pg.waitForSelector('[data-ap=verExamen]', { timeout: 15000 });
  await pg.waitForFunction(() => document.querySelectorAll('#apDetalle .ap-resp li').length === 8, null, { timeout: 10000 });
  const li22 = await pg.$$eval('#apDetalle .ap-resp li', (l) => l.map((x) => x.textContent.replace(/\s+/g, ' ').slice(0, 90)));
  ok('F15 · entrega antigua (sin zonas ni colores): se abre y las preguntas no contestadas salen «sin responder»', /sin responder/.test(li22[5]) && /sin responder/.test(li22[6]) && /sin responder/.test(li22[7]), li22[5]);
  await pg.click('[data-ap=verExamen]'); await pg.waitForSelector('.rv-modal .rv-form fieldset[data-q]');
  const rv22 = await pg.evaluate(() => ({ n: document.querySelectorAll('.rv-form fieldset[data-q]').length, marc: document.querySelectorAll('.rv-form .ia-fb').length, res: document.querySelector('.rv-res')?.textContent.replace(/\s+/g, ' ') }));
  ok('F15 · examen completo de la entrega antigua: 8 preguntas marcadas y su resumen', rv22.n === 8 && rv22.marc === 8, JSON.stringify(rv22));
  await shot(pg, 'f15_examen_completo_antiguo'); await pg.keyboard.press('Escape');
  // 23: sin terminar
  await pg.click(`td[data-celda="${id}"][data-n="23"]`); await pg.waitForSelector('#apDetalle .ap-resp li', { timeout: 15000 });
  ok('F15 · examen empezado sin entregar: se ve lo que lleva contestado', /empezado, sin entregar/.test(await pg.textContent('#apDetalle')) && !!(await pg.$('[data-ap=verExamen]')));
  // sin entrega: no hay botón
  await pg.click(`td[data-celda="${id}"][data-n="1"]`); await pg.waitForSelector('#apDetalle .pn-small', { timeout: 15000 }); await pg.waitForTimeout(500);
  ok('F15 · alumno sin entrega: lo dice y no ofrece el examen completo', /Sin entrega/.test(await pg.textContent('#apDetalle')) && !(await pg.$('[data-ap=verExamen]')));
  ok('F15 · revisar los exámenes no escribe nada (mismo nº de documentos en trabajos, notas, items, examenes y claves)', (await snap()) === antes, antes + ' → ' + (await snap()));
}
