// Fase 11 · Documento: editor propio (títulos, negrita, listas, tablas, enlaces, imágenes, código), plantilla del
// profesor, contador de palabras, guardado automático, imprimir / PDF, .docx, registro informativo y limpieza (XSS).
import { readFileSync } from 'node:fs';
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? (f.nullValue !== undefined ? null : f)); };
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, PROMPT, REST, owner }) {
  const pg = T.P.pg;
  const EL = { tipo: 'documento', titulo: 'Informe: el circuito de mi casa', texto: 'Describe el circuito eléctrico de una habitación.', puntos: 10,
    contenido: { plantilla: '<h2>Introducción</h2><p>Escribe aquí.</p><h2>Componentes</h2><p>…</p>', palabrasMin: 20 }, rubrica: [{ criterio: 'Contenido', puntos: 10 }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#dcPlantilla', { timeout: 15000 });
  ok('profesor: el editor muestra la plantilla con formato (no JSON) y el mínimo de palabras', /Introducción/.test(await pg.textContent('#dcPlantilla')) && (await pg.inputValue('[name=dcMin]')) === '20');
  await pg.click('#dcPlantilla h2 >> nth=1'); await pg.keyboard.press('End'); await pg.keyboard.type(' y función');
  await shot(pg, 'f11_plantilla_profesor');
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  ok('la plantilla editada se guarda limpia en el elemento', /Componentes y función/.test(JSON.stringify(await docREST('items/' + id))));
  // ---- alumno
  const A = await T.alumno(T.GE, 9, '4321', { width: 1280, height: 950 });
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.dc-ed[contenteditable]', { timeout: 20000 });
  ok('alumno: editor con barra de formato y la plantilla del profesor', (await A.pg.$$('.dc-barra .dc-b')).length >= 12 && /Componentes y función/.test(await A.pg.textContent('.dc-ed')));
  const tid = `${id}_${T.GE.id}_9`;
  await A.pg.click('.dc-ed p >> nth=0'); await A.pg.keyboard.press('Control+A');
  await A.pg.keyboard.press('End');
  await A.pg.evaluate(() => { const p = document.querySelector('.dc-ed p'); const r = document.createRange(); r.selectNodeContents(p); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await A.pg.keyboard.type('En mi habitación hay un circuito con un interruptor y una lámpara. ');
  await A.pg.keyboard.press('Control+B'); await A.pg.keyboard.type('Es muy sencillo.'); await A.pg.keyboard.press('Control+B');
  await A.pg.keyboard.press('Enter'); await A.pg.click('[data-dc=ul]'); await A.pg.keyboard.type('Interruptor'); await A.pg.keyboard.press('Enter'); await A.pg.keyboard.type('Lámpara'); await A.pg.keyboard.press('Enter'); await A.pg.keyboard.press('Enter');
  await A.pg.click('[data-dc=pre]'); await A.pg.keyboard.type('V = I · R');
  await A.pg.keyboard.press('Enter'); await A.pg.keyboard.press('Enter');
  PROMPT.push('2', '2'); await A.pg.click('[data-dc=tabla]'); await A.pg.waitForSelector('.dc-ed table');
  await A.pg.click('.dc-ed table td >> nth=0'); await A.pg.keyboard.type('Bombilla');
  // enlace sobre el texto seleccionado
  await A.pg.evaluate(() => { const h = document.querySelectorAll('.dc-ed h2')[1]; const r = document.createRange(); r.selectNodeContents(h); getSelection().removeAllRanges(); getSelection().addRange(r); });
  PROMPT.push('https://es.wikipedia.org/wiki/Circuito_eléctrico'); await A.pg.click('[data-dc=enlace]');
  // pegado grande (anotado) y limpio
  await A.pg.evaluate(() => { const p = document.querySelectorAll('.dc-ed p'); const el = p[p.length - 1]; const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); getSelection().removeAllRanges(); getSelection().addRange(r);
    const dt = new DataTransfer(); dt.setData('text/plain', 'Texto pegado. '.repeat(30)); dt.setData('text/html', '<p onclick="alert(1)">Texto pegado. <script>window.__xss=1</script>'.concat('x'.repeat(10), '</p>')); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); });
  // imagen (se comprime en el navegador)
  const b64 = await A.pg.evaluate(() => { const c = document.createElement('canvas'); c.width = 2400; c.height = 1800; const g = c.getContext('2d'); const d = g.createImageData(2400, 1800); for (let i = 0; i < d.data.length; i++) d.data[i] = (i * 2654435761 >>> 24) & 255; g.putImageData(d, 0, 0); return c.toDataURL('image/png').split(',')[1]; });
  await A.pg.setInputFiles('.dc-file', { name: 'foto.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') });
  await A.pg.waitForFunction(() => document.querySelector('.dc-ed img[data-img="img1"]') || /No se ha podido/.test(document.querySelector('#enMsg')?.textContent || ''), null, { timeout: 60000 });
  if (!(await A.pg.$('.dc-ed img[data-img="img1"]'))) throw new Error('imagen: ' + await A.pg.textContent('#enMsg'));
  const kb = await A.pg.textContent('#enMsg');
  ok('imagen: comprimida en el navegador a ≤ 300 KB y guardada en el trabajo (subcolección)', /Imagen añadida \((\d+) KB\)/.test(kb) && +kb.match(/(\d+) KB/)[1] <= 300, kb);
  await A.pg.waitForFunction(() => /Guardado \d\d:\d\d/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 20000 });
  const pal = await A.pg.textContent('.dc-pal');
  ok('contador de palabras (y el mínimo del profesor)', /\d+ palabras/.test(pal) && /mín\. 20/.test(pal), pal);
  let d = await docREST('trabajos/' + tid); const h = campo(d, 'doc') || '';
  ok('guardado automático del documento con formato: negrita, lista, código, tabla, enlace e imagen', /<strong>Es muy sencillo\.<\/strong>/.test(h) && /<ul><li>Interruptor<\/li><li>Lámpara<\/li><\/ul>/.test(h) && /<pre>V = I · R/.test(h) && /<table>/.test(h) && /<a href="https:\/\/es\.wikipedia\.org/.test(h) && /data-img="img1"/.test(h) && !/src="data:/.test(h), h.slice(0, 300));
  ok('el pegado se limpia (sin script ni onclick)', !/script|onclick/.test(h) && /Texto pegado/.test(h));
  const im = await docREST(`trabajos/${tid}/imagenes/img1`);
  ok('la imagen está en trabajos/…/imagenes/img1 (≤ 410 000 caracteres)', (campo(im, 'data') || '').startsWith('data:image/jpeg;base64,') && campo(im, 'data').length <= 410000);
  await shot(A.pg, 'f11_editor_alumno');
  // .docx
  const [dl] = await Promise.all([A.pg.waitForEvent('download'), A.pg.click('[data-dc=docx]')]);
  const ruta = await dl.path(); const z = readFileSync(ruta); const zs = z.toString('latin1');
  ok('descargar .docx: ZIP de Word con el documento, títulos, lista, tabla y la imagen', z[0] === 0x50 && z[1] === 0x4b && zs.includes('word/document.xml') && zs.includes('word/media/imagen1.jpeg') && /Heading2/.test(zs) && /Interruptor/.test(zs) && /<w:tbl>/.test(zs), dl.suggestedFilename());
  // imprimir / PDF
  await A.pg.evaluate(() => { window.print = () => { window.__impHTML = document.getElementById('enImprimir')?.innerHTML || ''; }; });
  await A.pg.click('[data-en=imprimir]'); await A.pg.waitForTimeout(800);
  const imp = await A.pg.evaluate(() => [window.__impHTML, document.querySelector('#enImprimir img')?.getAttribute('src')?.slice(0, 20)]);
  ok('imprimir / PDF: el documento con su formato y la imagen', /<table>/.test(imp[0]) && /<strong>/.test(imp[0]) && imp[1] === 'data:image/jpeg;base', String(imp[1]));
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  ok('entregado: el documento queda de solo lectura (sin barra)', !(await A.pg.$('.dc-ed[contenteditable]')) && !!(await A.pg.$('.dc-ro')));
  const reg = await docREST('registros/' + tid);
  ok('registro informativo (solo profesor): tiempo editando y 1 pegado grande', (campo(reg, 'seg') ?? 0) >= 1 && /"n":\{"integerValue":"420"\}|integerValue":"420"/.test(JSON.stringify(reg)), JSON.stringify(reg).slice(0, 200));
  // ---- XSS: un documento manipulado no ejecuta nada en la vista del profesor
  const malo = { fields: { ...d.fields, doc: { stringValue: '<p>ok</p><img src=x onerror="window.__xss=1"><script>window.__xss=2</script><a href="javascript:window.__xss=3">x</a>' } } };
  const tidX = `${id}_${T.GE.id}_10`; malo.fields.numero = { integerValue: '10' }; malo.fields.al = { stringValue: `${T.GE.id}_10` }; malo.fields.estado = { stringValue: 'entregado' };
  await fetch(`${REST}/trabajos/${tidX}`, { ...owner, method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify(malo) });
  // ---- profesor: vista de corrección
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForFunction((g) => document.querySelector('[data-ap-f=gGrupo]')?.value === g && document.querySelector('[data-ap-f=gAsig]'), T.GE.id, { timeout: 15000 });
  if ((await pg.inputValue('[data-ap-f=gAsig]')) !== 'eee') await pg.selectOption('[data-ap-f=gAsig]', 'eee');
  await pg.waitForSelector(`th[data-col="${id}"] [data-ap=corregir]`, { timeout: 15000 }); await pg.click(`th[data-col="${id}"] [data-ap=corregir]`);
  await pg.waitForSelector('#coTrabajo .co-doc', { timeout: 15000 });
  await pg.waitForFunction(() => document.querySelector('#coTrabajo .co-doc img')?.src?.startsWith('data:image/jpeg'), null, { timeout: 15000 });
  await pg.waitForSelector('#coTrabajo .co-reg', { timeout: 15000 });
  await pg.click('#coTrabajo .co-reg summary');
  ok('corrección: el profesor ve el documento con la imagen y el registro (tiempo y pegado de 420 caracteres)', /420 caracteres/.test(await pg.textContent('#coTrabajo .co-reg')) && /Tiempo editando/.test(await pg.textContent('#coTrabajo .co-reg')));
  await shot(pg, 'f11_correccion_documento');
  const [dl2] = await Promise.all([pg.waitForEvent('download'), pg.click('[data-co=docx]')]);
  ok('el profesor también descarga el .docx', /\.docx$/.test(dl2.suggestedFilename()), dl2.suggestedFilename());
  await pg.click('[data-co=sig]'); await pg.waitForFunction(() => /10/.test(document.querySelector('.co-nn')?.textContent || ''), null, { timeout: 15000 });
  await pg.waitForTimeout(800);
  const xss = await pg.evaluate(() => [window.__xss, document.querySelector('#coTrabajo .co-doc')?.innerHTML]);
  ok('documento manipulado (onerror, script, javascript:): se limpia y no ejecuta nada', xss[0] === undefined && !/onerror|script|javascript/.test(xss[1] || ''), String(xss[1]).slice(0, 120));
  await A.ctx.close();
}
