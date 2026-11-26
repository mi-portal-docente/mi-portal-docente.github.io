import { readFileSync } from 'node:fs';
// Fase 10 · Vista de corrección: un alumno cada vez, rúbrica por niveles (clic), criterio «en clase»,
// anterior / siguiente, comentarios rápidos reutilizables, notas en borrador y publicar a mano (una o todas).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? (f.nullValue !== undefined ? null : f)); };
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  const EL = { tipo: 'tarea', titulo: 'Ficha: la ley de Ohm', texto: 'Resuelve los tres ejercicios y explica el último.', puntos: 10,
    rubrica: [{ criterio: 'Ejercicios resueltos', puntos: 6, niveles: ['Ninguno bien', 'Uno bien', 'Dos bien', 'Los tres bien'] }, { criterio: 'Explicación', puntos: 4 }, { criterio: 'Montaje en el taller', clase: true }] };
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
  await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
  const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [data-rb-ed] .rb-fila', { timeout: 15000 });
  ok('editor: la rúbrica es una tabla con los niveles y el criterio «clase»', /Los tres bien/.test(await pg.inputValue('#apItemForm [data-rb-texto]')) && /Montaje en el taller \| clase/.test(await pg.inputValue('#apItemForm [data-rb-texto]')) && !!(await pg.$('#apItemForm .rb-fila.clase [data-rb=clase]:checked')) && (await pg.$$('#apItemForm .rb-fila')).length >= 3);
  // Subir un PDF al portal (sin Drive): 2 MB → 3 partes; luego el alumno lo ve en el visor
  const pdfB = (() => { // PDF válido de 2 páginas con un relleno de 2 MB
    const objs = ['<</Type/Catalog/Pages 2 0 R>>', '<</Type/Pages/Kids[3 0 R 4 0 R]/Count 2>>', '<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 5 0 R>>', '<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 5 0 R>>', '<</Length 31>>\nstream\n0 0 1 rg 20 20 200 100 re f\n\nendstream', `<</Length ${2 * 1024 * 1024}>>\nstream\n${'A'.repeat(2 * 1024 * 1024)}\nendstream`];
    let out = '%PDF-1.4\n'; const off = [];
    objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => String(n).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${x}\n%%EOF\n`;
    return Buffer.from(out, 'latin1');
  })();
  await pg.evaluate(() => { const d = document.querySelector('#apItemForm [data-ed-grupo=adjuntos]'); if (d) d.open = true; });
  await pg.setInputFiles('#apItemForm [name=adjF]', { name: 'Ficha Ohm.pdf', mimeType: 'application/pdf', buffer: pdfB });
  await pg.waitForFunction(() => /#archivo\//.test(document.querySelector('#apItemForm [name=enlaces]')?.value || ''), null, { timeout: 30000 });
  const uArch = (await pg.inputValue('#apItemForm [name=enlaces]')).match(/#archivo\/(\w+)/)[1];
  const casilla = '#apItemForm [data-ed-arch] [data-ed-desc]';
  const c0 = await pg.isChecked(casilla); await pg.check(casilla); const conD = /#archivo\/\w+\/descarga$/.test(await pg.inputValue('#apItemForm [name=enlaces]')); await pg.uncheck(casilla);
  ok('editor: el archivo queda «solo para ver»; la casilla «Permitir descargar» cambia el adjunto', c0 === false && conD && /#archivo\/\w+$/.test(await pg.inputValue('#apItemForm [name=enlaces]')));
  const dArch = await docREST('archivos/' + uArch);
  ok('editor: «Subir archivo» guarda el PDF en el portal (3 partes, huella y tamaño)', campo(dArch, 'partes') === 3 && campo(dArch, 'bytes') === pdfB.length && campo(dArch, 'tipo') === 'pdf' && campo(dArch, 'asig') === 'eee' && /^[0-9a-f]{64}$/.test(campo(dArch, 'hash')));
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  // dos alumnos entregan
  for (const n of [7, 8]) {
    const A = await T.alumno(T.GE, n, '4321', { width: 1100, height: 800 });
    await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('#enForm [name=texto]', { timeout: 20000 });
    await A.pg.fill('#enForm [name=texto]', `Respuesta del nº ${n}: V = I · R. En el último, la corriente se reduce a la mitad.`);
    await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
    if (n === 7) {
      await A.pg.click(`a.cl-adj-c[href="#archivo/${uArch}"]`);
      await A.pg.waitForSelector('#visorArchivo .vz-pag canvas, #visorArchivo .vz-msg.ko', { timeout: 30000 });
      const vz = await A.pg.evaluate(() => ({ pags: document.querySelectorAll('#visorArchivo .vz-pag').length, cv: document.querySelectorAll('#visorArchivo .vz-pag canvas').length, desc: !!document.querySelector('#visorArchivo .vz-desc, #visorArchivo a[download], #visorArchivo iframe, #visorArchivo a[href^="blob:"]'), solo: /Solo lectura/.test(document.querySelector('#visorArchivo .vz-bar')?.textContent || ''), ko: document.querySelector('#visorArchivo .vz-msg.ko')?.textContent, hash: location.hash }));
      ok('alumno: el PDF subido se ve dentro del portal (2 páginas pintadas, sin Drive) y NO se puede descargar: solo lectura', vz.pags === 2 && vz.cv >= 1 && !vz.desc && vz.solo && !/archivo/.test(vz.hash), JSON.stringify(vz).slice(0, 160));
      await shot(A.pg, 'f10_visor_archivo');
      await A.pg.click('#visorArchivo [data-vz=cerrar]');
      // con permiso del profesor en ese adjunto: aparece «Descargar» y baja el archivo entero
      await A.pg.evaluate((u) => { const a = document.querySelector(`a.cl-adj-c[href="#archivo/${u}"]`); a.setAttribute('href', `#archivo/${u}/descarga`); a.click(); }, uArch);
      await A.pg.waitForSelector('#visorArchivo .vz-desc:not([hidden])', { timeout: 30000 });
      const vd = await A.pg.evaluate(async () => { const a = document.querySelector('#visorArchivo .vz-desc'); return { n: (await (await fetch(a.href)).blob()).size, ad: a.download }; });
      ok('alumno: si el adjunto lleva «Permitir descargar», aparece el botón y baja el archivo entero', vd.n === pdfB.length && vd.ad === 'Ficha Ohm.pdf', JSON.stringify(vd));
      await A.pg.click('#visorArchivo [data-vz=cerrar]');
      T.A7 = A;
    } else {
      await A.ctx.close();
    }
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
  // Corrección por archivo (la prepara Claude u otro; queda en borrador para revisar)
  const [dlC] = await Promise.all([pg.waitForEvent('download'), pg.evaluate(() => { document.querySelector('.co-mas')?.setAttribute('open', ''); document.querySelector('[data-co=exportarCorr]').click(); })]);
  const corrJ = JSON.parse(readFileSync(await dlC.path(), 'utf8'));
  ok('«Exportar para corregir»: JSON con la rúbrica y lo entregado por nº, sin nombres', corrJ.formato === 'superprofe-correccion-1' && corrJ.rubrica.length >= 3 && corrJ.correcciones.some((x) => x.n === 8 && /nº 8/.test(x.entrega?.texto || '')) && /^\d{8}_Correccion_/.test(dlC.suggestedFilename()));
  const c8 = corrJ.correcciones.find((x) => x.n === 8); c8.niveles = corrJ.rubrica.map((r) => (r.clase ? null : 'Excelente')); c8.comentario = 'Propuesta: todo correcto.';
  await pg.evaluate((j) => window.importarCorreccionSuperProfe(j), JSON.stringify({ ...corrJ, correcciones: [c8, { n: 99, niveles: [1] }] }));
  await pg.waitForFunction(() => /importadas en borrador/.test(document.querySelector('#coMsg')?.textContent || ''), null, { timeout: 15000 });
  const i8 = await docREST(`notas/${id}_${T.GE.id}_8`);
  ok('«Importar corrección»: nº 08 → 10 en borrador con el comentario (el nº 99 se ignora)', campo(i8, 'nota') === 10 && campo(i8, 'publicada') === false && /todo correcto/.test(campo(i8, 'comentario')));
  await pg.click('[data-co=ant]'); await pg.waitForFunction(() => /07/.test(document.querySelector('.co-nn')?.textContent || ''));
  ok('«Anterior»: vuelve al nº 07 con los niveles marcados', !!(await pg.$('.co-crit[data-ri="0"] .co-n[data-k="4"].on')) && !!(await pg.$('.co-crit[data-ri="1"] .co-n[data-k="2"].on')));
  await pg.click('[data-co=publicarTodas]');
  await pg.waitForFunction(() => !document.querySelector('[data-co=publicarTodas]'), null, { timeout: 15000 });
  const p7 = await docREST(`notas/${id}_${T.GE.id}_7`); const p8 = await docREST(`notas/${id}_${T.GE.id}_8`);
  ok('«Publicar 2»: las dos notas publicadas a la vez', campo(p7, 'publicada') === true && campo(p8, 'publicada') === true);
  await T.A7.pg.waitForSelector('.en-chip.en-calificado', { timeout: 15000 });
  ok('el alumno ve la nota (8) y la rúbrica en tabla con su nivel marcado y «en clase»', /8/.test(await T.A7.pg.textContent('.au-entrega .au-nota')) && /evalúa el profesor en clase/.test(await T.A7.pg.textContent('.rb-ver')) && !!(await T.A7.pg.$('.rb-ver td.rb-c.on')));
  await shot(T.A7.pg, 'f10_alumno_nota');
  await pg.click('[data-co=cerrar]'); await pg.waitForSelector('.ap-tabla', { timeout: 15000 });
  ok('volver al cuaderno: las dos casillas con nota', (await pg.textContent(`td[data-celda="${id}"][data-n="7"]`)).trim() === '8' && (await pg.textContent(`td[data-celda="${id}"][data-n="8"]`)).trim() === '10');
  await T.A7.ctx.close();
}
