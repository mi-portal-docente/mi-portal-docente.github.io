// Fase 20 · Progreso de laboratorios en Seguimiento + Concurso anónimo para los alumnos (t182u).
//  - Los tres paneles (Prácticas guiadas, Progreso en Circuitos y Vivienda) salen de «Grupos y códigos» y viven en
//    Seguimiento › Progreso de laboratorios, con todas sus funciones.
//  - El concurso: interruptor por grupo; los alumnos ven solo «Nº xx» y «Tú»; nunca nombres, correos ni códigos.
export default async function ({ T, BASE, ok, shot, docREST, REST, owner }) {
  const pg = T.P.pg; const gid = T.GE.id;
  const comp = (practica) => ({ practica, tipo: 'circuitos', titulo: 'Práctica ' + practica, datos: { comprobacion: { ok: true } } });
  const entregar = (A, e) => A.pg.evaluate(async (x) => { try { await window.PORTAL.entregar(x); return 'ok'; } catch (er) { return er?.mensaje || String(er); } }, e);
  const tema = (p, t) => p.evaluate((x) => { document.documentElement.dataset.theme = x; }, t);

  // ---- 1) «Grupos y códigos» ya no lleva los tres paneles; Seguimiento sí
  await pg.goto(BASE + '#panel/grupos'); await pg.reload(); await pg.waitForSelector(`.pn-grupo[data-grupo="${gid}"]`, { timeout: 20000 });
  const tarj = await pg.$eval(`.pn-grupo[data-grupo="${gid}"]`, (el) => ({ viejo: !!el.querySelector('[data-pn=guiadas],[data-pn=progreso],[data-pn=progresoViv],.pn-progreso,.pn-guiadas'), enlace: el.querySelector('a[href^="#panel/progreso/"]')?.getAttribute('href') || '', txt: el.textContent }));
  ok('F20 · Grupos y códigos: ya no están Prácticas guiadas, Progreso en Circuitos ni en Vivienda (queda un enlace al nuevo sitio)', !tarj.viejo && tarj.enlace === '#panel/progreso/' + gid && !/Progreso en Circuitos|Progreso en Vivienda/.test(tarj.txt), JSON.stringify(tarj).slice(0, 200));
  const sinEee = await pg.$eval(`.pn-grupo[data-grupo="${T.GB.id}"]`, (el) => !el.querySelector('a[href^="#panel/progreso/"]'));
  ok('F20 · el grupo sin EEE no muestra el enlace', sinEee);

  await pg.goto(BASE + '#panel/progreso/' + gid); await pg.reload(); await pg.waitForSelector('#pnProg [data-grupo]', { timeout: 20000 });
  const tabs = await pg.$$eval('#pnTabs .pn-g:nth-child(2) a', (L) => L.map((a) => a.dataset.pnTab));
  ok('F20 · Seguimiento: «Progreso de laboratorios» va justo después de Laboratorio', tabs.join() === 'notas,trabajos,tareas,test,examenes,entregas,progreso,analitica,conectados', tabs.join());
  const alias = []; for (const h of ['#panel/laboratorios', '#panel/concurso', '#panel/progreso']) { await pg.goto(BASE + h); await pg.reload(); await pg.waitForSelector('#pnTabs .pn-g a.on', { timeout: 15000 }); if ((await pg.getAttribute('#pnTabs .pn-g a.on', 'data-pn-tab')) !== 'progreso') alias.push(h); }
  ok('F20 · rutas #panel/progreso, laboratorios y concurso abren la pestaña', !alias.length, alias.join(' '));
  await pg.goto(BASE + '#panel/progreso/' + gid); await pg.waitForSelector('#pnProg [data-grupo]');
  const pills = await pg.$$eval('.pn-pill', (L) => L.map((x) => x.textContent.trim()));
  ok('F20 · pastillas: Concurso · Circuitos · Vivienda · Prácticas guiadas', pills.join() === 'Concurso,Circuitos,Vivienda,Prácticas guiadas', pills.join());
  ok('F20 · el concurso está apagado por defecto', !(await pg.isChecked('input[data-pn-conc]')));
  await pg.click('.pn-pill[data-v=circ]'); await pg.waitForSelector('#pnProg table.pn-pg');
  const fc = await pg.$$eval('#pnProg table.pn-pg tbody tr', (L) => L.length);
  ok('F20 · Circuitos: la tabla de progreso sale con una fila por nº de lista (12)', fc === 12, 'filas ' + fc);
  await pg.click('.pn-pill[data-v=viv]'); await pg.waitForSelector('#pnProg table.pn-pg');
  ok('F20 · Vivienda: tabla con guiadas, autónomas y niveles N1–N3', /N1/.test(await pg.textContent('#pnProg table.pn-pg thead')) && /N3/.test(await pg.textContent('#pnProg table.pn-pg thead')));
  await pg.click('.pn-pill[data-v=guiadas]'); await pg.waitForSelector('#pnProg [data-gd=modo]');
  ok('F20 · Prácticas guiadas: el desbloqueo uno a uno, la evaluación y la vivienda siguen ahí', (await pg.$$('#pnProg [data-gev]')).length > 0 && (await pg.$$('#pnProg [data-gviv]')).length > 0 && (await pg.$$('#pnProg [data-gvev]')).length > 0);
  await pg.check('#pnProg [data-gd=modo]'); await pg.waitForFunction(() => document.querySelector('#pnProg [data-gd=modo]')?.checked && document.querySelector('#pnProg [data-pn=gd-sig]'), null, { timeout: 15000 });
  await pg.click('#pnProg [data-pn=gd-sig]'); await pg.waitForFunction(() => /1 de \d+ desbloqueadas/.test(document.querySelector('#pnProg')?.textContent || ''), null, { timeout: 15000 });
  const apart = JSON.stringify((await docREST('grupos/' + gid)).fields?.apartados || {});
  ok('F20 · desbloquear la siguiente guiada se guarda en el grupo (se conserva lo demás)', /gd|guiada|g:/i.test(apart) || apart.length > 10, apart.slice(0, 160));
  await pg.uncheck('#pnProg [data-gd=modo]'); await pg.waitForFunction(() => !document.querySelector('#pnProg [data-pn=gd-sig]'), null, { timeout: 15000 });

  // ---- 2) alumnos que hacen prácticas
  const A3 = await T.alumno(T.GE, 31), A5 = await T.alumno(T.GE, 32), A7 = await T.alumno(T.GE, 33);
  const regV = (p) => ({ practica: 'v6', tipo: 'vivienda', titulo: 'Registro de vivienda', datos: { montaje: JSON.stringify({ practicas: p }) } });
  const r1 = [await entregar(A3, comp('c1')), await entregar(A3, comp('c2')), await entregar(A3, comp('a1'))];
  const r2 = [await entregar(A5, comp('c1')), await entregar(A5, comp('c2')), await entregar(A5, comp('c3')), await entregar(A5, comp('c4'))];
  const r3 = [await entregar(A7, regV({ vp1: { guiada: true }, vp2: { guiada: true, autonoma: true } }))];
  ok('F20 · las entregas de los alumnos se aceptan', [...r1, ...r2, ...r3].every((x) => x === 'ok'), [...r1, ...r2, ...r3].join());
  // el resumen público de cada nº (solo números) se publica solo
  const resumen = async (n) => { const d = await docREST(`clasificacion/${gid}_${n}`); const f = d.fields || {}; return f.cg ? { cg: +f.cg.integerValue, ca: +f.ca.integerValue, vg: +f.vg.integerValue, va: +f.va.integerValue, claves: Object.keys(f).sort().join() } : null; };
  let R3 = null; for (let i = 0; i < 20 && !R3; i++) { R3 = await resumen(31); if (!R3) await pg.waitForTimeout(500); }
  ok('F20 · el alumno nº 31 publica su resumen: 2 guiadas y 1 autónoma de Circuitos (la autónoma cuenta también como guiada)', R3 && R3.cg === 2 && R3.ca === 1 && R3.vg === 0, JSON.stringify(R3));
  ok('F20 · el resumen solo lleva números (sin nombre, correo ni código)', R3 && R3.claves === 'ca,cg,fecha,grupo,numero,va,vg', R3?.claves);
  let R7 = null; for (let i = 0; i < 20 && !R7; i++) { R7 = await resumen(33); if (!R7) await pg.waitForTimeout(500); }
  ok('F20 · el nº 33 publica Vivienda: 2 guiadas y 1 autónoma', R7 && R7.vg === 2 && R7.va === 1, JSON.stringify(R7));

  // ---- 3) concurso apagado: el alumno no lo ve
  ok('F20 · con el concurso apagado, el alumno no tiene el enlace «Concurso»', !(await A3.pg.$('nav.top-nav a[href="#concurso"]')));
  await A3.pg.evaluate(() => { location.hash = '#concurso'; }); await A3.pg.waitForSelector('.cc .cc-msg', { timeout: 15000 });
  ok('F20 · con el concurso apagado dice que el profesor no lo ha activado y no lista a nadie', /no ha activado/.test(await A3.pg.textContent('.cc .cc-msg')) && !(await A3.pg.$('.cc-list')));
  await A3.pg.evaluate(() => { location.hash = '#asignaturas'; });

  // ---- 4) el profesor lo activa
  await pg.goto(BASE + '#panel/progreso/' + gid); await pg.waitForSelector('.pn-pill[data-v=concurso]', { timeout: 20000 }); await pg.click('.pn-pill[data-v=concurso]'); await pg.waitForSelector('input[data-pn-conc]', { timeout: 20000 });
  await pg.check('input[data-pn-conc]');
  await pg.waitForFunction(() => /Visible para los alumnos/.test(document.querySelector('.pn-sw-t')?.textContent || ''), null, { timeout: 15000 });
  ok('F20 · el interruptor guarda concursos/<grupo> con activo = true', (await docREST('concursos/' + gid)).fields?.activo?.booleanValue === true);
  const filasProf = await pg.$$eval('#pnProg .pn-cl tbody tr', (L) => L.map((r) => r.textContent.replace(/\s+/g, ' ').trim()));
  ok('F20 · el profesor ve la clasificación general con los tres nº', filasProf.length >= 3 && /31/.test(filasProf.join('|')) && /32/.test(filasProf.join('|')) && /33/.test(filasProf.join('|')), filasProf.slice(0, 4).join(' | '));
  await pg.waitForSelector('.pn-conc', { timeout: 10000 }); await shot(pg, 'f20_profesor_concurso');

  // ---- 5) el alumno lo ve en directo
  await A3.pg.waitForSelector('nav.top-nav a[href="#concurso"]', { timeout: 20000 });
  ok('F20 · al activarlo aparece el enlace «Concurso» en la barra del alumno, sin recargar', true);
  await A3.pg.click('nav.top-nav a[href="#concurso"]'); await A3.pg.waitForSelector('.cc-list .cc-fila', { timeout: 20000 });
  await A3.pg.waitForFunction(() => document.querySelectorAll('.cc-list .cc-fila').length >= 3, null, { timeout: 20000 });
  const lista = await A3.pg.$$eval('.cc-list .cc-fila', (L) => L.map((f) => f.textContent.replace(/\s+/g, ' ').trim()));
  const pos = (await A3.pg.textContent('.cc-pos')).trim();
  ok('F20 · general: 3 participantes; tú (nº 31) vas 2.º con 3 puntos, empatado con el nº 33 y por detrás del nº 32', lista.length === 3 && pos === '2' && /Nº 31 Tú/.test(lista.join('|')) && /Nº 32/.test(lista[0]) , `${pos} · ${lista.join(' | ')}`);
  ok('F20 · tu fila está resaltada y marcada «Tú»', await A3.pg.$eval('.cc-fila.yo', (e) => /Tú/.test(e.textContent) && e.getAttribute('aria-current') === 'true'));
  const html = await A3.pg.evaluate(() => document.querySelector('.cc').innerText);
  ok('F20 · la vista no muestra códigos, correos ni nombres (solo «Nº xx»)', !html.includes(T.GE.codigo) && !/@/.test(html) && lista.every((x) => /^(\d+ )?(Nº \d{2})( Tú)? \d+ \/ \d+$/.test(x)), lista.join(' | '));
  const todos = JSON.stringify(await (await fetch(`${REST}/clasificacion`, owner)).json());
  ok('F20 · los documentos publicados no contienen el código del grupo ni correos', !todos.includes(T.GE.codigo) && !/@/.test(todos));
  await shot(A3.pg, 'f20_alumno_general');
  await A3.pg.click('.cc-tab[data-v=circ]'); await A3.pg.waitForSelector('.cc-tab.on[data-v=circ]');
  const filasC = await A3.pg.$$eval('.cc-list .cc-fila', (L) => L.map((f) => f.textContent.replace(/\s+/g, ' ').trim()));
  ok('F20 · pestaña Circuitos: nº 32 primero (4 pts), tú segundo (3), el nº 33 no sale', filasC.length === 2 && /Nº 32/.test(filasC[0]) && /Nº 31 Tú/.test(filasC[1]), filasC.join(' | '));
  await A3.pg.click('.cc-tab[data-v=viv]'); await A3.pg.waitForSelector('.cc-tab.on[data-v=viv]');
  ok('F20 · pestaña Vivienda: solo el nº 33; tú todavía sin puesto', (await A3.pg.$$eval('.cc-list .cc-fila', (L) => L.length)) === 1 && /sin puesto/.test(await A3.pg.textContent('.cc-de')) && /Completa tu primera práctica/.test(await A3.pg.textContent('.cc-msg')));
  await shot(A3.pg, 'f20_alumno_vivienda');
  // en directo: dos compañeros suben y tú bajas
  await A3.pg.click('.cc-tab[data-v=general]');
  await entregar(A5, comp('c5')); await entregar(A7, comp('c1')); await entregar(A7, comp('c2'));
  await A3.pg.waitForFunction(() => document.querySelector('.cc-pos')?.textContent.trim() === '3', null, { timeout: 25000 });
  ok('F20 · en directo: cuando otros suman puntos tu puesto baja a 3.º sin recargar', true);
  // tú subes con una práctica nueva
  await entregar(A3, comp('c3')); await entregar(A3, comp('c4')); await entregar(A3, comp('a2'));
  await A3.pg.waitForFunction(() => document.querySelector('.cc-pos')?.textContent.trim() === '2' || document.querySelector('.cc-pos')?.textContent.trim() === '1', null, { timeout: 25000 });
  ok('F20 · y vuelves a subir al completar prácticas', true, (await A3.pg.textContent('.cc-pos')).trim());

  // ---- 6) el profesor detecta un resumen que no coincide con las entregas
  await fetch(`${REST}/clasificacion/${gid}_33?updateMask.fieldPaths=cg&updateMask.fieldPaths=ca`, { method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { cg: { integerValue: '7' }, ca: { integerValue: '7' } } }) });
  await pg.waitForSelector('.pn-conc-av', { timeout: 15000 });
  ok('F20 · si el resumen de un alumno no coincide con sus entregas, el profesor ve el aviso y se cuenta lo de las entregas', /33/.test(await pg.textContent('.pn-conc-av')));

  // ---- 7) móvil y oscuro
  for (const [t, w, h] of [['claro', 390, 844], ['oscuro', 390, 844], ['oscuro', 1280, 800]]) {
    await A3.pg.setViewportSize({ width: w, height: h }); await tema(A3.pg, t === 'oscuro' ? 'dark' : 'light'); await A3.pg.waitForTimeout(400);
    const sw = await A3.pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`F20 · alumno ${t} ${w}px: sin scroll lateral`, sw <= 1, 'sobra ' + sw);
    await shot(A3.pg, `f20_alumno_${t}_${w}`);
  }
  await pg.setViewportSize({ width: 390, height: 844 }); await tema(pg, 'dark'); await pg.waitForTimeout(400);
  ok('F20 · profesor oscuro 390px: sin scroll lateral', (await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 1);
  await shot(pg, 'f20_profesor_oscuro_390');
  await pg.click('.pn-pill[data-v=circ]'); await pg.waitForSelector('#pnProg table.pn-pg'); await shot(pg, 'f20_profesor_circuitos_390');
  await pg.setViewportSize({ width: 1440, height: 900 }); await tema(pg, 'light');
  await pg.click('.pn-pill[data-v=circ]'); await shot(pg, 'f20_profesor_circuitos');

  // ---- 8) apagarlo
  await pg.click('.pn-pill[data-v=concurso]'); await pg.waitForSelector('input[data-pn-conc]'); await pg.uncheck('input[data-pn-conc]');
  await pg.waitForFunction(() => /Oculto para los alumnos/.test(document.querySelector('.pn-sw-t')?.textContent || ''), null, { timeout: 15000 });
  await A3.pg.waitForFunction(() => !document.querySelector('nav.top-nav a[href="#concurso"]'), null, { timeout: 20000 });
  ok('F20 · al apagarlo, el enlace desaparece de la barra del alumno', true);
  await A3.pg.setViewportSize({ width: 1440, height: 900 }); await tema(A3.pg, 'light');
  for (const A of [A3, A5, A7]) await A.ctx.close();
}
