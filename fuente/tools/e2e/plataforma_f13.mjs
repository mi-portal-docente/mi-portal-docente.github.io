// Fase 13 · hoja de cálculo (fórmulas en castellano, retos, gráfico, tabla dinámica, entregar y corregir),
// visor de PDF dentro del portal (pdf.js) y modelo 3D (STL pequeño subido por el alumno, visto al corregir).
const campo = (d, k) => { const f = d?.fields?.[k]; if (!f) return undefined; return f.stringValue ?? (f.integerValue != null ? +f.integerValue : f.doubleValue ?? f.booleanValue ?? f); };
const STL = () => { let s = 'solid cubo\n'; const v = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 10], [10, 0, 10], [10, 10, 10], [0, 10, 10]];
  for (const [a, b, c] of [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]])
    s += `facet normal 0 0 0\n outer loop\n${[a, b, c].map((i) => `  vertex ${v[i].join(' ')}\n`).join('')} endloop\nendfacet\n`;
  return Buffer.from(s + 'endsolid cubo\n'); };
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  const crear = async (EL) => {
    await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
    await pegarJSON(pg, EL); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 });
    try { await guardarJSON(pg); } catch (e) { throw new Error('guardar: ' + (await pg.textContent('#jsErr').catch(() => ''))); }
    await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, { timeout: 15000 });
    const i = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${EL.titulo}")`, 'data-item');
    await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), i);
    await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
    await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
    await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${i}"]`, { timeout: 15000 });
    return i;
  };
  // ---- hoja de cálculo
  const HJ = { tipo: 'hoja', titulo: 'Presupuesto F13 de la instalación', puntos: 10, publicar: true, texto: 'Calcula el total y la media.',
    contenido: { filas: 12, columnas: 5, celdas: { A1: 'Material', B1: 'Tipo', C1: 'Precio', A2: 'Cable', B2: 'Eléctrico', C2: '12,5', A3: 'Enchufe', B3: 'Eléctrico', C3: '4', A4: 'Tornillos', B4: 'Ferretería', C4: '3,5' },
      retos: [{ texto: 'En C5, el total con SUMA', comprobar: [{ celda: 'C5', valor: 20, formula: 'SUMA' }] }, { texto: 'En C6, la media con PROMEDIO', comprobar: [{ celda: 'C6', valor: 6.67, formula: 'PROMEDIO' }] }] } };
  const id = await crear(HJ);
  ok('importar y publicar una hoja de cálculo con retos (los retos se conservan al editar)', !!id && /En C5, el total/.test(JSON.stringify(await docREST('items/' + id))));
  const A = await T.alumno(T.GE, 13, '4321', { width: 1280, height: 950 });
  A.pg.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await A.pg.goto(BASE + '#trabajo/' + id); await A.pg.waitForSelector('.hj-c[data-r=C5]', { timeout: 20000 }).catch(async () => { throw new Error('hoja: ' + (await A.pg.evaluate(() => document.body.innerText)).slice(0, 1500).replace(/\n+/g, ' | ')); });
  ok('alumno: la hoja con las celdas iniciales y los retos pendientes', (await A.pg.inputValue('.hj-c[data-r=C2]')) === '12,5' && (await A.pg.$$('.hj-retos li.ok')).length === 0);
  await A.pg.click('.hj-c[data-r=C5]'); await A.pg.keyboard.type('=SUMA(C2:C4)'); await A.pg.keyboard.press('Enter');
  await A.pg.click('.hj-c[data-r=C6]'); await A.pg.fill('.hj-fx', '=REDONDEAR(PROMEDIO(C2:C4);2)'); await A.pg.press('.hj-fx', 'Enter');
  await A.pg.click('.hj-c[data-r=D2]'); await A.pg.keyboard.type('=SI(C2>10;"Caro";"Barato")'); await A.pg.keyboard.press('Enter');
  await A.pg.click('.hj-c[data-r=E2]'); await A.pg.keyboard.type('=CONTAR.SI(B2:B4;"Eléctrico")'); await A.pg.keyboard.press('Tab');
  await A.pg.click('.hj-c[data-r=A1]');
  const vs = await A.pg.evaluate(() => ['C5', 'C6', 'D2', 'E2'].map((r) => document.querySelector(`.hj-c[data-r=${r}]`).value));
  ok('fórmulas: SUMA 20, PROMEDIO 6,67, SI «Caro», CONTAR.SI 2', vs.join('|') === '20|6,67|Caro|2', vs.join('|'));
  ok('los dos retos se marcan como superados', (await A.pg.$$('.hj-retos li.ok')).length === 2);
  await A.pg.click('.hj-det summary:has-text("Gráfico")'); await A.pg.fill('.hj-gr', 'A1:C4'); await A.pg.click('[data-hj=graf]');
  await A.pg.click('.hj-det summary:has-text("Tabla dinámica")'); await A.pg.fill('.hj-pr', 'A1:C4'); await A.pg.fill('.hj-pf', 'Tipo'); await A.pg.fill('.hj-pv', 'Precio'); await A.pg.click('[data-hj=piv]');
  await A.pg.waitForSelector('.hj-graf svg', { timeout: 5000 }); await A.pg.waitForSelector('.hj-pivw table', { timeout: 5000 });
  ok('gráfico de barras y tabla dinámica (Eléctrico 16,5 · Ferretería 3,5)', /Eléctrico\s*16,5/.test(await A.pg.textContent('.hj-pivw')) && /Ferretería\s*3,5/.test(await A.pg.textContent('.hj-pivw')), await A.pg.textContent('.hj-pivw'));
  await shot(A.pg, 'f13_hoja_alumno');
  await A.pg.waitForFunction(() => /Guardado \d\d:\d\d/.test(document.querySelector('#enGuardado')?.textContent || ''), null, { timeout: 20000 });
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 });
  const tid = `${id}_${T.GE.id}_13`; const tr = await docREST('trabajos/' + tid); const d = JSON.parse(campo(tr, 'doc') || '{}');
  ok('entregado: la hoja se guarda (fórmulas, gráfico, tabla dinámica) con el resumen «Aciertos: 2/2»', d.c?.C5 === '=SUMA(C2:C4)' && d.g?.rango === 'A1:C4' && d.p?.fila === 'Tipo' && /Aciertos: 2\/2/.test(campo(tr, 'texto')), campo(tr, 'texto'));
  ok('entregada: solo lectura', !(await A.pg.$('.hj-c')) && !!(await A.pg.$('.hj-ro')));
  // ---- profesor: corrección
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForFunction((g) => document.querySelector('[data-ap-f=gGrupo]')?.value === g && document.querySelector('[data-ap-f=gAsig]'), T.GE.id, { timeout: 15000 });
  if ((await pg.inputValue('[data-ap-f=gAsig]')) !== 'eee') await pg.selectOption('[data-ap-f=gAsig]', 'eee');
  await pg.waitForSelector(`th[data-col="${id}"] [data-ap=corregir]`, { timeout: 15000 }); await pg.click(`th[data-col="${id}"] [data-ap=corregir]`);
  await pg.waitForSelector('#coTrabajo .hj-ro', { timeout: 15000 });
  ok('corrección: el profesor ve la hoja con valores calculados, el gráfico y la tabla dinámica', /Caro/.test(await pg.textContent('#coTrabajo .hj-ro')) && !!(await pg.$('#coTrabajo svg')) && /Ferretería/.test(await pg.textContent('#coTrabajo')));
  await shot(pg, 'f13_hoja_correccion');
  await pg.click('[data-co=cerrar]'); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
  // ---- visor de PDF
  await pg.evaluate(() => window.PORTAL_PDF('materiales/eee/sa1/SA1_Trabajo1_catalogo_herramientas.pdf', 'Catálogo de herramientas'));
  await pg.waitForSelector('#visorPdf .vp-pg canvas', { timeout: 30000 }).catch(async () => { throw new Error('pdf: ' + await pg.textContent('#visorPdf').catch(() => '')); });
  await shot(pg, 'f13_visor_pdf');
  const np = await pg.$$eval('#visorPdf .vp-pg', (l) => l.length);
  ok('visor de PDF dentro del portal: pinta las páginas (pdf.js) con barra de páginas y zoom', np >= 1 && /\/\s*\d+/.test(await pg.textContent('#visorPdf .vp-pag')), String(np));
  await pg.click('#visorPdf [data-vp=mas]'); await pg.waitForTimeout(400);
  ok('zoom +', /1[1-9]\d %|2\d\d %/.test(await pg.textContent('#visorPdf .vp-zoom')), await pg.textContent('#visorPdf .vp-zoom'));
  
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
  ok('Esc cierra el visor', !(await pg.$('#visorPdf')));
  // ---- modelo 3D (STL) en una tarea
  const TA = { tipo: 'tarea', titulo: 'Pieza 3D F13', texto: 'Sube tu pieza en STL.', puntos: 10, publicar: true };
  const ta = await crear(TA);
  await A.pg.goto(BASE + '#trabajo/' + ta); await A.pg.waitForSelector('.m3-file', { state: 'attached', timeout: 20000 });
  await A.pg.setInputFiles('.m3-file', { name: 'pieza.stl', mimeType: 'model/stl', buffer: STL() });
  await A.pg.waitForSelector('[data-v3d-tid]', { timeout: 20000 }).catch(async () => { throw new Error('stl: ' + await A.pg.textContent('#enMsg').catch(() => '?') + ' | ' + await A.pg.textContent('.m3').catch(() => '?')); });
  const tt = `${ta}_${T.GE.id}_13`; const m1 = await docREST(`trabajos/${tt}/modelos/m1`);
  ok('el alumno sube un STL pequeño: se guarda en trabajos/…/modelos/m1 (base64) y el resumen en el trabajo', /^[A-Za-z0-9+/=]+$/.test(campo(m1, 'data') || '') && campo(m1, 'nombre') === 'pieza.stl' && /pieza\.stl/.test(JSON.stringify(await docREST('trabajos/' + tt))));
  await A.pg.click('[data-v3d-tid]'); await A.pg.waitForSelector('.v3 canvas', { timeout: 20000 });
  await A.pg.waitForFunction(() => /10,0 × 10,0 × 10,0/.test(document.querySelector('.v3-med')?.textContent || ''), null, { timeout: 15000 }).catch(() => { });
  ok('visor 3D: abre el modelo y muestra sus medidas', /10,0 × 10,0 × 10,0/.test(await A.pg.textContent('.v3-med').catch(() => '')), await A.pg.textContent('.v3').catch(() => ''));
  await shot(A.pg, 'f13_visor_3d');
  await A.pg.keyboard.press('Escape'); await A.pg.waitForTimeout(300);
  ok('Esc cierra el visor 3D', !(await A.pg.$('.v3')));
  await A.pg.click('[data-en=entregar]'); await A.pg.waitForSelector('.en-chip.en-entregado', { timeout: 15000 }).catch(async () => { throw new Error('entregar: ' + await A.pg.textContent('#enMsg').catch(() => '?')); });
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('[data-ap-f=gGrupo], [data-co=cerrar]', { timeout: 20000 }); if (await pg.$('[data-co=cerrar]')) await pg.click('[data-co=cerrar]'); await pg.waitForSelector(`[data-ap-f=gGrupo], th[data-col="${ta}"]`, { timeout: 15000 });
  if (!(await pg.$(`th[data-col="${ta}"] [data-ap=corregir]`))) { if ((await pg.inputValue('[data-ap-f=gGrupo]').catch(() => T.GE.id)) !== T.GE.id) await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); }
  await pg.waitForSelector(`th[data-col="${ta}"] [data-ap=corregir]`, { timeout: 15000 }); await pg.click(`th[data-col="${ta}"] [data-ap=corregir]`);
  await pg.waitForSelector('#coTrabajo [data-v3d-tid]', { timeout: 15000 });
  await pg.click('#coTrabajo [data-v3d-tid]'); await pg.waitForSelector('.v3 canvas', { timeout: 20000 });
  ok('corrección: el profesor abre el modelo 3D del alumno', !!(await pg.$('.v3 canvas')));
  await pg.keyboard.press('Escape');
  await A.ctx.close();
}
