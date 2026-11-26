// Fase 22 · Editor «Crear tarea» (t192u / PIP-10): la ventana cabe en 1280×800, 1024 y 390 px,
// sin desborde horizontal, con cabecera y pie fijos, lo esencial primero y lo avanzado plegado.
import { mkdirSync } from 'node:fs';

const OUT = '/workspace/capturas-crear-tarea/';
mkdirSync(OUT, { recursive: true });

const medir = (pg) => pg.evaluate(() => {
  const dlg = document.querySelector('#apEditor');
  const modal = document.querySelector('.cl-modal');
  const body = document.querySelector('#apEditor .cl-dlg-b');
  if (!dlg || !modal || !body) return { ok: false };
  const r = dlg.getBoundingClientRect();
  const header = document.querySelector('#apEditor .cl-dlg-h')?.getBoundingClientRect();
  const footer = document.querySelector('#apEditor .cl-dlg-f')?.getBoundingClientRect();
  const visibleReal = (el) => {
    if (el.closest('details:not([open])') && !el.closest('summary')) return false;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return false;
    const er = el.getBoundingClientRect();
    return er.width > 0 && er.height > 0;
  };
  const overflowEls = [...dlg.querySelectorAll('*')].filter((el) => {
    if (el.tagName === 'OPTION' || el.tagName === 'SCRIPT') return false;
    if (!visibleReal(el)) return false;
    if (el.closest('.rb-scroll, .tbl-scroll, .cl-dlg-b, .cl-dlg-b1')) {
      const sc = el.closest('.rb-scroll, .tbl-scroll, .cl-dlg-b, .cl-dlg-b1');
      const sr = sc.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      // Un hijo más ancho dentro de un contenedor con scroll horizontal no cuenta como desborde de la ventana
      if ((getComputedStyle(sc).overflowX === 'auto' || getComputedStyle(sc).overflowX === 'scroll' || sc.classList.contains('cl-dlg-b')) && er.right > sr.right + 1 && sr.width > 0) return false;
    }
    const er = el.getBoundingClientRect();
    return er.right > r.right + 2 || er.left < r.left - 2;
  }).slice(0, 8).map((el) => el.tagName + '.' + String(el.className || '').slice(0, 40));
  const visible = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const er = el.getBoundingClientRect();
    return er.width > 0 && er.bottom > (header?.bottom || 0) && er.top < (footer?.top || innerHeight);
  };
  return {
    ok: true,
    dlg: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    vw: innerWidth, vh: innerHeight,
    clip: r.top < -2 || r.bottom > innerHeight + 4 || r.left < -2 || r.right > innerWidth + 4,
    modalOverflowX: modal.scrollWidth - modal.clientWidth,
    bodyOverflowX: body.scrollWidth - body.clientWidth,
    dlgOverflowX: dlg.scrollWidth - dlg.clientWidth,
    docOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headerVisible: !!header && header.top >= -1 && header.bottom <= innerHeight + 1,
    footerVisible: !!footer && footer.bottom <= innerHeight + 1 && footer.top >= 0,
    essentials: ['[name=titulo]', '[name=texto]', '[name=puntos]', '[name=fechaEntrega]', '[name=tema]'].every(visible),
    grupos: ['adjuntos', 'rubrica', 'nota', 'avanzado', 'caras'].every((id) => !!document.querySelector(`#apItemForm [data-ed-grupo="${id}"]`)),
    unPrimary: document.querySelectorAll('#apEditor .cl-dlg-f .btn.primary').length === 1,
    overflowEls,
  };
});

async function abrirCrear(pg, BASE, hash) {
  await pg.goto(BASE + hash);
  await pg.evaluate(() => { document.documentElement.dataset.theme = 'light'; try { localStorage.removeItem('pd.tema'); } catch (e) {} });
  await pg.waitForSelector('#asTrabajo [data-cl=crear]', { timeout: 20000 });
  if (await pg.$('#apItemForm')) await pg.click('#apItemForm [data-ed=cancelar]').catch(() => {});
  await pg.click('#asTrabajo [data-cl=crear]');
  await pg.waitForSelector('#asTrabajo [data-cl=nuevo][data-tipo=tarea]', { timeout: 8000 });
  await pg.click('#asTrabajo [data-cl=nuevo][data-tipo=tarea]');
  await pg.waitForSelector('#apItemForm [name=titulo]', { timeout: 15000 });
  await pg.waitForFunction(() => {
    const el = document.querySelector('#apEditor');
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return Number(getComputedStyle(el).opacity) > 0.9 && r.height > 120 && r.bottom > 0 && r.top < innerHeight;
  }, null, { timeout: 8000 });
}

const foto = async (pg, n) => {
  const path = OUT + n + '.png';
  await pg.screenshot({ path, fullPage: false });
  return path;
};

const esperaDialogo = (pg) => pg.waitForFunction(() => {
  const el = document.querySelector('#apEditor');
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return Number(getComputedStyle(el).opacity) > 0.99 && r.height > 120 && r.top >= -2 && r.bottom <= innerHeight + 4;
}, null, { timeout: 8000 });

export default async function ({ T, BASE, ok, shot }) {
  const pg = T.P.pg;
  const prev = pg.viewportSize();
  await abrirCrear(pg, BASE, '#asig/proy2/tareas');
  ok('F22 · en Proyecto › Tareas se abre «Crear: Tarea»', /Crear: Tarea/.test(await pg.textContent('#apEditor .cl-dlg-h')));

  const sizes = [
    { name: '1280', w: 1280, h: 800 },
    { name: '1024', w: 1024, h: 768 },
    { name: '390', w: 390, h: 844 },
  ];
  for (const s of sizes) {
    await pg.setViewportSize({ width: s.w, height: s.h });
    await pg.waitForTimeout(250);
    const m = await medir(pg);
    ok(`F22 · a ${s.name} px la ventana cabe, sin recorte ni scroll horizontal`,
      !!m.ok && !m.clip && m.modalOverflowX <= 1 && m.bodyOverflowX <= 1 && m.dlgOverflowX <= 1 && m.docOverflowX <= 1 && m.headerVisible && m.footerVisible && !m.overflowEls.length,
      JSON.stringify(m).slice(0, 500));
    ok(`F22 · a ${s.name} px se ven título, instrucciones, puntos, fecha y tema, y un solo botón principal`,
      !!m.essentials && !!m.grupos && !!m.unPrimary, JSON.stringify({ essentials: m.essentials, grupos: m.grupos, unPrimary: m.unPrimary }));
    await foto(pg, `despues_${s.name}_light`);
    await shot(pg, `f22_${s.name}_light`);
  }

  // URL larga y palabra sin espacios: se parten, no empujan el ancho
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.evaluate(() => { const d = document.querySelector('#apItemForm [data-ed-grupo=adjuntos]'); if (d) d.open = true; });
  const largo = 'https://drive.google.com/file/d/abcdefghijklmnopqrstuvwxyz0123456789xxxxx/view?usp=sharing y textopegadosinSpacesParaVerSiSeSaleDeLosMargenesDelDialogo';
  await pg.fill('#apItemForm [name=texto]', largo);
  await pg.waitForTimeout(150);
  const wrap = await medir(pg);
  ok('F22 · a 390 px una URL y una palabra largas no provocan desborde horizontal',
    !!wrap.ok && wrap.bodyOverflowX <= 1 && wrap.dlgOverflowX <= 1 && wrap.docOverflowX <= 1 && !wrap.overflowEls.length,
    JSON.stringify(wrap).slice(0, 400));
  await foto(pg, 'despues_390_adjuntos');

  for (const tema of ['dark']) {
    await pg.setViewportSize({ width: 1280, height: 800 });
    await pg.evaluate((t) => { document.documentElement.dataset.theme = t; }, tema);
    await pg.waitForTimeout(300);
    const m = await medir(pg);
    ok('F22 · en modo oscuro a 1280×800 cabe y no pierde contraste en cabecera ni pie',
      !!m.ok && !m.clip && m.headerVisible && m.footerVisible && m.docOverflowX <= 1, JSON.stringify(m).slice(0, 300));
    await foto(pg, 'despues_1280_dark');
    await shot(pg, 'f22_1280_dark');
    await pg.setViewportSize({ width: 390, height: 844 });
    await pg.waitForTimeout(250);
    const m2 = await medir(pg);
    ok('F22 · en modo oscuro a 390 px cabe, sin scroll horizontal',
      !!m2.ok && !m2.clip && m2.docOverflowX <= 1 && m2.bodyOverflowX <= 1 && m2.headerVisible && m2.footerVisible, JSON.stringify(m2).slice(0, 300));
    await foto(pg, 'despues_390_dark');
    await shot(pg, 'f22_390_dark');
  }
  await pg.evaluate(() => { document.documentElement.dataset.theme = 'light'; try { localStorage.removeItem('pd.tema'); } catch (e) { } });

  // El mismo editor, otros tipos: examen y material, sin romper el encaje
  await pg.setViewportSize({ width: 1024, height: 768 });
  await pg.evaluate(() => { const d = document.querySelector('#apItemForm [data-ed-grupo=avanzado]'); if (d) d.open = true; });
  await pg.selectOption('#apItemForm [name=tipo]', 'examen');
  await pg.waitForSelector('#apItemForm [name=desde]', { timeout: 10000 });
  await esperaDialogo(pg);
  const exBotones = await pg.evaluate(() => !!document.querySelector('#apItemForm [data-ed="q+test"]') && !!document.querySelector('#apItemForm [name=hasta]'));
  const ex = await medir(pg);
  ok('F22 · al cambiar a cuestionario siguen las fechas del examen y la ventana cabe',
    exBotones && !ex.clip && ex.docOverflowX <= 1 && ex.headerVisible && ex.footerVisible,
    JSON.stringify({ exBotones, ...ex }).slice(0, 500));
  await foto(pg, 'despues_1024_examen');
  await shot(pg, 'f22_1024_examen');
  await pg.evaluate(() => { const d = document.querySelector('#apItemForm [data-ed-grupo=avanzado]'); if (d) d.open = true; });
  await pg.selectOption('#apItemForm [name=tipo]', 'material');
  await pg.waitForFunction(() => document.querySelector('#apItemForm [name=titulo]') && !document.querySelector('#apItemForm [name=puntos]'), null, { timeout: 10000 });
  await esperaDialogo(pg);
  const mat = await medir(pg);
  ok('F22 · el material no pide puntos y la ventana sigue cabiendo',
    !(await pg.$('#apItemForm [name=puntos]')) && !mat.clip && mat.docOverflowX <= 1,
    JSON.stringify(mat).slice(0, 400));
  await pg.click('#apItemForm [data-ed=cancelar]');
  await pg.waitForSelector('#apItemForm', { state: 'detached', timeout: 10000 });

  // Asignatura desde Trabajo de clase (misma ventana)
  await pg.setViewportSize({ width: 1280, height: 800 });
  await abrirCrear(pg, BASE, '#asig/eee/trabajo');
  const eee = await medir(pg);
  ok('F22 · desde EEE › Trabajo de clase se abre el mismo editor y cabe a 1280×800',
    /Crear: Tarea/.test(await pg.textContent('#apEditor .cl-dlg-h') || '') && !eee.clip && eee.essentials && eee.headerVisible && eee.footerVisible,
    JSON.stringify({ txt: await pg.textContent('#apEditor .cl-dlg-h'), ...eee }).slice(0, 500));
  await foto(pg, 'despues_1280_eee');
  await shot(pg, 'f22_1280_eee');
  await pg.click('#apItemForm [data-ed=cancelar]');
  await pg.waitForSelector('#apItemForm', { state: 'detached', timeout: 10000 });

  if (prev) await pg.setViewportSize(prev);
  else await pg.setViewportSize({ width: 1440, height: 900 });
}
