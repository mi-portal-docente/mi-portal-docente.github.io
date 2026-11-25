// Fase 19 · Etiquetas con el mismo cristal que la barra superior (t175u): mismo desenfoque, translucidez y borde,
// en claro y en oscuro, a 1280 y a 390 px. Compara estilos calculados con los de «.scr-top».
export default async function ({ T, BASE, ok, shot }) {
  const pg = T.P.pg;
  const medir = () => pg.evaluate(() => {
    const cs = (el) => { const c = getComputedStyle(el); return { bf: c.backdropFilter || c.webkitBackdropFilter, bg: c.backgroundColor, bd: c.borderTopWidth + ' ' + c.borderTopColor, sh: c.boxShadow }; };
    const q = (s) => document.querySelector(s);
    const top = q('.scr-top:not([hidden])') ? cs([...document.querySelectorAll('.scr-top')].find((e) => e.offsetParent !== null) || q('.scr-top')) : null;
    const r = { top };
    for (const [k, s] of [['tabs', '.as-tabs'], ['n', '.pn-n'], ['vista', '.ap-vista'], ['chip', '.pchip-b']]) { const e = [...document.querySelectorAll(s)].find((x) => x.offsetParent !== null); r[k] = e ? cs(e) : null; }
    return r;
  });
  for (const tema of ['light', 'dark']) {
    await pg.goto(BASE + '#asig/eee/tareas'); await pg.waitForSelector('.as-tabs a', { timeout: 20000 });
    await pg.evaluate((t) => { document.documentElement.dataset.theme = t; }, tema); await pg.waitForTimeout(500);
    const m = await medir();
    ok(`F19 · ${tema}: las pestañas de la asignatura usan el mismo desenfoque y borde de cristal que la barra superior`, !!m.tabs && !!m.top && m.tabs.bf === m.top.bf && m.tabs.bg === m.top.bg && /^(0\.5|1)px/.test(m.tabs.bd) && m.tabs.bf !== 'none', JSON.stringify({ tabs: m.tabs, top: m.top }).slice(0, 400));
    await shot(pg, `f19_asignatura_${tema}`);
    await pg.goto(BASE + '#panel/notas'); await pg.waitForSelector('.pn-nav a', { timeout: 20000 }); await pg.waitForSelector('.ap-vista', { timeout: 20000 }).catch(() => { });
    await pg.evaluate((t) => { document.documentElement.dataset.theme = t; }, tema); await pg.waitForTimeout(500);
    const p = await medir();
    ok(`F19 · ${tema}: insignias y selector de vista con cristal`, (!p.n || (p.n.bf === p.top.bf && /^(0\.5|1)px/.test(p.n.bd))) && (!p.vista || p.vista.bf === p.top.bf), JSON.stringify(p).slice(0, 300));
    await shot(pg, `f19_panel_${tema}`);
  }
  await pg.setViewportSize({ width: 390, height: 844 });
  for (const tema of ['light', 'dark']) {
    await pg.goto(BASE + '#asig/eee/tareas'); await pg.waitForSelector('.as-tabs a', { timeout: 20000 });
    await pg.evaluate((t) => { document.documentElement.dataset.theme = t; }, tema); await pg.waitForTimeout(400);
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`F19 · ${tema} a 390 px sin scroll lateral`, sw <= 1, 'sobra ' + sw);
    await shot(pg, `f19_asignatura_movil_${tema}`);
  }
  await pg.evaluate(() => { document.documentElement.dataset.theme = 'light'; try { localStorage.removeItem('pd.tema'); } catch (e) { } });
  await pg.setViewportSize({ width: 1440, height: 900 });
}
