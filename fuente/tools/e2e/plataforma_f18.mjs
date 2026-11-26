// Fase 18 · Seguimiento (t175u): orden de las pestañas (Cuaderno · trabajos de clase · tareas · test · exámenes ·
// laboratorio · analítica · usuarios y conectados), rutas antiguas que siguen funcionando y vistas por tipo de entrega.
export default async function ({ T, BASE, ok, shot, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  const mk = (titulo, seccion) => ({ formato: 'superprofe/elemento@1', tipo: 'tarea', titulo, seccion, instrucciones: 'F18', puntos: 10 });
  const ELS = [mk('F18 Ejercicio de clase', 'clase'), mk('F18 Tarea normal', 'tareas'), mk('F18 Test de prueba', 'test'), mk('F18 Examen de prueba', 'examenes')];
  await pg.goto(BASE + '#asig/eee/trabajo'); await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000, state: 'attached' });
  for (const el of ELS) {
    await pegarJSON(pg, el); await pg.waitForSelector('#jsPrev .js-prev', { timeout: 10000 }); await guardarJSON(pg);
    await pg.waitForSelector(`#asTrabajo .cl-it:has-text("${el.titulo}")`, { timeout: 15000 });
    const id = await pg.getAttribute(`#asTrabajo .cl-it:has-text("${el.titulo}")`, 'data-item');
    await pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), id);
    await pg.waitForSelector('#apItemForm [name=estado][value=publicar]', { timeout: 15000 });
    await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
    await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  }
  await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('#pnTabs .pn-g');
  const tabs = await pg.$$eval('#pnTabs .pn-g:nth-child(2) a', (L) => L.map((a) => a.dataset.pnTab));
  ok('F18 · Seguimiento: Cuaderno · trabajos de clase · tareas · test · exámenes · laboratorio · analítica · usuarios', tabs.join() === 'notas,trabajos,tareas,test,examenes,entregas,progreso,analitica,conectados', tabs.join());
  const nombres = await pg.$$eval('#pnTabs .pn-g:nth-child(2) a', (L) => L.map((a) => a.textContent.replace(/\s+/g, ' ').trim()));
  ok('F18 · nombres de las pestañas', /^Cuaderno de calificaciones/.test(nombres[0]) && /^Trabajos de clase/.test(nombres[1]) && /^Tareas/.test(nombres[2]) && /^Test/.test(nombres[3]) && /^Exámenes/.test(nombres[4]) && /^Laboratorio/.test(nombres[5]) && /^Progreso de laboratorios/.test(nombres[6]) && /^Analítica/.test(nombres[7]) && /^Usuarios y conectados/.test(nombres[8]), nombres.join(' | '));
  await shot(pg, 'f18_pestanas_seguimiento');
  // rutas antiguas y alias
  const ruta = async (h, esp) => { await pg.goto(BASE + h); await pg.reload(); await pg.waitForSelector('#pnTabs .pn-g a.on', { timeout: 15000 }); return (await pg.getAttribute('#pnTabs .pn-g a.on', 'data-pn-tab')) === esp; };
  const RT = [['#panel/entregas', 'entregas'], ['#panel/laboratorio', 'entregas'], ['#panel/usuarios', 'conectados'], ['#panel/conectados', 'conectados'], ['#panel/cuaderno', 'notas'], ['#panel/analitica', 'analitica'], ['#panel/analítica', 'analitica'], ['#panel/exámenes', 'examenes']];
  const malas = []; for (const [h, e] of RT) if (!(await ruta(h, e))) malas.push(h);
  ok('F18 · rutas antiguas y alias: entregas, laboratorio, usuarios, conectados, cuaderno, analitica, analítica, exámenes', !malas.length, malas.join(' '));
  // vistas por tipo
  const vista = async (sub) => {
    await pg.goto(BASE + '#panel/' + sub); await pg.reload(); await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
    await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(500); await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
    await pg.waitForFunction(() => document.querySelector('#apTablaW th[data-col]') || document.querySelector('.pn-vacio'), null, { timeout: 20000 }); await pg.waitForTimeout(600);
    return pg.$$eval('#apTablaW th[data-col]', (L) => L.map((x) => x.getAttribute('title')));
  };
  const todas = await vista('notas');
  ok('F18 · el Cuaderno sigue mostrando todas las columnas', ELS.every((e) => todas.includes(e.titulo)), todas.join(' | '));
  await shot(pg, 'f18_cuaderno_completo');
  const esp = { trabajos: 0, tareas: 1, test: 2, examenes: 3 };
  for (const [sub, i] of Object.entries(esp)) {
    const c = await vista(sub);
    ok(`F18 · #panel/${sub}: solo muestra «${ELS[i].titulo}»`, c.includes(ELS[i].titulo) && !ELS.some((e, j) => j !== i && c.includes(e.titulo)), c.join(' | '));
    if (sub === 'test' || sub === 'trabajos') await shot(pg, 'f18_vista_' + sub);
  }
  await pg.setViewportSize({ width: 390, height: 844 }); await vista('tareas'); await pg.waitForTimeout(300);
  const sw = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('F18 · a 390 px las vistas por tipo no ensanchan la página', sw <= 1, 'sobra ' + sw);
  await shot(pg, 'f18_vista_movil'); await pg.setViewportSize({ width: 1440, height: 900 });
}
