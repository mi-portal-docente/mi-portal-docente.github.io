// Fase 17 · Seguimiento (t175u): «Entregas del laboratorio» con filtro por alumno y grupos plegables por alumno
// (solo grupo + nº de lista, sin nombres). Siembra entregas por REST y no toca nada más.
export default async function ({ T, BASE, ok, shot, REST, owner }) {
  const pg = T.P.pg; const H = { ...owner.headers, 'Content-Type': 'application/json' };
  const dia = 864e5; const ahora = Date.now();
  const sembrar = async (grupo, n, practica, dt, nota) => {
    const f = { uid: { stringValue: 'uidF17' + n }, codigo: { stringValue: grupo.codigo }, grupo: { stringValue: grupo.id }, numero: { integerValue: String(n) }, al: { stringValue: `${grupo.id}_${n}` },
      practica: { stringValue: practica }, tipo: { stringValue: 'circuitos' }, titulo: { stringValue: 'Práctica ' + practica }, fecha: { timestampValue: new Date(ahora - dt).toISOString() },
      datos: { mapValue: { fields: { aciertos: { stringValue: '3/4' } } } } };
    if (nota != null) f.nota = { doubleValue: nota };
    await fetch(`${REST}/entregas/${grupo.id}_${n}_${practica}`, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: f }) });
  };
  // nº 3: c3 (hoy), c1 (hace 3 días), c2 (hace 2 días, con nota) · nº 7: c1, c2 · nº 12: c1 · otro grupo, nº 5: c1
  await sembrar(T.GE, 3, 'c3', 0.1 * dia); await sembrar(T.GE, 3, 'c1', 3 * dia); await sembrar(T.GE, 3, 'c2', 2 * dia, 8);
  await sembrar(T.GE, 7, 'c1', 1 * dia); await sembrar(T.GE, 7, 'c2', 0.5 * dia); await sembrar(T.GE, 12, 'c1', 4 * dia); await sembrar(T.GB, 5, 'c1', 2 * dia);
  await pg.evaluate(() => localStorage.removeItem('pd.lab.filtro'));
  await pg.goto(BASE + '#panel/entregas');
  await pg.waitForSelector('#pnTabla .pn-al', { timeout: 20000 });
  await pg.waitForFunction(() => document.querySelectorAll('#pnTabla .pn-al').length >= 4, null, { timeout: 15000 });
  const grupos = await pg.$$eval('#pnTabla .pn-al', (L) => L.map((x) => ({ id: x.dataset.al, t: x.querySelector('.pn-al-t').textContent.trim(), n: x.querySelector('.pn-n').textContent.trim(), ab: x.classList.contains('open') })));
  const g3 = grupos.find((x) => x.id === `${T.GE.id}_3`);
  ok('F17 · «Todos» sale agrupado por alumno, con su cuenta, ordenado por grupo y nº', grupos.length >= 4 && g3?.n === '3 entregas' && /nº 03$/.test(g3.t) && grupos.findIndex((x) => x.id === `${T.GE.id}_3`) < grupos.findIndex((x) => x.id === `${T.GE.id}_7`), JSON.stringify(grupos.slice(0, 5)));
  ok('F17 · con varios alumnos los grupos salen plegados y no hay una pila de filas', grupos.every((x) => !x.ab) && (await pg.$$('#pnTabla .pn-al-c:not([hidden]) tr[data-ent]')).length === 0);
  await shot(pg, 'f17_entregas_agrupadas_plegadas');
  await pg.click(`#pnTabla [data-al="${T.GE.id}_3"] .pn-al-b`);
  await pg.waitForSelector(`#pnTabla [data-al="${T.GE.id}_3"].open .pn-al-c:not([hidden]) tr[data-ent]`);
  const orden = await pg.$$eval(`#pnTabla [data-al="${T.GE.id}_3"] tr[data-ent]`, (L) => L.map((r) => r.dataset.ent.split('_').pop()));
  ok('F17 · dentro de cada alumno, las entregas van por fecha (la más antigua primero)', orden.join() === 'c1,c2,c3', orden.join());
  await pg.click('#pnTabla [data-pn=alTodos][data-v="1"]');
  ok('F17 · «Desplegar todos» abre todos los alumnos y «Plegar todos» los cierra', (await pg.$$('#pnTabla .pn-al.open')).length >= 4);
  await shot(pg, 'f17_entregas_agrupadas_abiertas');
  await pg.click('#pnTabla [data-pn=alTodos][data-v="0"]'); ok('F17 · Plegar todos', (await pg.$$('#pnTabla .pn-al.open')).length === 0);
  // filtro por alumno
  await pg.selectOption('[data-pn-f=alumno]', `${T.GE.id}_3`);
  await pg.waitForSelector('#pnTabla .pn-resumen-al');
  const filas = await pg.$$eval('#pnTabla tr[data-ent]', (L) => L.map((r) => r.dataset.ent.split('_').pop()));
  ok('F17 · filtro por alumno: solo sus entregas, por fecha', filas.join() === 'c1,c2,c3' && /3\s+entregas/.test(await pg.textContent('.pn-resumen-al')), filas.join());
  ok('F17 · el alumno elegido queda en la dirección (#panel/entregas/grupo_nº) y en el navegador', (await pg.evaluate(() => location.hash)) === `#panel/entregas/${T.GE.id}_3` && JSON.parse(await pg.evaluate(() => localStorage.getItem('pd.lab.filtro'))).alumno === `${T.GE.id}_3`);
  await shot(pg, 'f17_entregas_filtro_alumno');
  await pg.goto(BASE + '#panel/ajustes'); await pg.goto(BASE + '#panel/entregas'); await pg.waitForSelector('#pnTabla .pn-resumen-al', { timeout: 20000 });
  ok('F17 · al volver a la pestaña se recuerda el alumno', (await pg.$$('#pnTabla tr[data-ent]')).length === 3);
  await pg.click('[data-pn=quitarFiltros]'); await pg.waitForSelector('#pnTabla .pn-al');
  ok('F17 · «Quitar filtros» vuelve al agrupado', (await pg.$$('#pnTabla .pn-al')).length >= 4 && (await pg.evaluate(() => location.hash)) === '#panel/entregas');
  // enlace directo
  await pg.evaluate(() => localStorage.removeItem('pd.lab.filtro'));
  await pg.goto(BASE + `#panel/entregas/${T.GE.id}_7`); await pg.reload(); await pg.waitForSelector('#pnTabla .pn-resumen-al', { timeout: 20000 });
  ok('F17 · enlace directo a un alumno (#panel/entregas/grupo_nº)', (await pg.$$('#pnTabla tr[data-ent]')).length === 2);
  // filtro de práctica sobre agrupado
  await pg.click('[data-pn=quitarFiltros]'); await pg.waitForSelector('#pnTabla .pn-al'); await pg.selectOption('[data-pn-f=practica]', 'c2');
  await pg.waitForFunction(() => document.querySelectorAll('#pnTabla .pn-al').length === 2, null, { timeout: 10000 });
  ok('F17 · filtro de práctica sobre el agrupado', true);
  await pg.click('[data-pn=quitarFiltros]'); await pg.waitForSelector('#pnTabla .pn-al');
  // datos intactos
  const d = await (await fetch(`${REST}/entregas/${T.GE.id}_3_c2`, owner)).json();
  ok('F17 · las entregas no se han tocado', Number(d.fields?.nota?.doubleValue) === 8);
  // móvil
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  await pg.click('#pnTabla [data-pn=alTodos][data-v="1"]'); await pg.waitForTimeout(300);
  const sw = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('F17 · a 390 px no hay scroll lateral en las entregas agrupadas', sw <= 1, 'sobra ' + sw);
  await shot(pg, 'f17_entregas_movil');
  await pg.setViewportSize({ width: 1440, height: 900 });
}
