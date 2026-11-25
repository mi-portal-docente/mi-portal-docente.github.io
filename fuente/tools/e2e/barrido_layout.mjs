// Barrido de maquetación (alumno y profesor, 1280/1024/768/390): ¿desborda la página en horizontal?, ¿la cabecera
// y el cuerpo comparten ancho y márgenes?, ¿las tablas anchas hacen scroll dentro de su propio contenedor?
// Se invoca desde aula_e2e.mjs con BARRIDO=1 (usa sus datos). Capturas en CAPTURAS_CABECERA.
import { mkdirSync } from 'fs';
export async function barrido({ P, A, rutasP, rutasA, ok, fase }) {
  const CAP = (process.env.CAPTURAS_CABECERA || '').replace(/\/?$/, '/'); if (process.env.CAPTURAS_CABECERA) mkdirSync(CAP, { recursive: true });
  const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
  const ANCHOS = [[1280, 800], [1024, 768], [768, 1024], [390, 844]];
  const medir = () => {
    const W = innerWidth;
    const vis = (el) => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return false; } const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const scr = [...document.querySelectorAll('.screen')].find((x) => getComputedStyle(x).display !== 'none') || null;
    const nombre = (e) => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || e.tagName.toLowerCase();
    const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, scr ? scr.scrollWidth : 0);
    const culp = [];
    if (sw > W + 1) {
      const todos = [...(scr || document.body).querySelectorAll('*')].filter((e) => { if (!vis(e)) return false; if (getComputedStyle(e).position === 'fixed') return false; const r = e.getBoundingClientRect(); if (r.right <= W + 1) return false; for (let p = e.parentElement; p && p !== document.body && p !== scr; p = p.parentElement) { if (getComputedStyle(p).overflowX !== 'visible') return false; } return true; });
      for (const e of todos) if (!todos.includes(e.parentElement)) culp.push(nombre(e) + ' →' + Math.round(e.getBoundingClientRect().right));
    }
    // cabecera: la fija/pegajosa visible más arriba
    const cab = [...document.querySelectorAll('header.top, .scr-top, #asigbar .asb-top, .cx-top, .vv-top')].find((e) => { if (!vis(e)) return false; const p = getComputedStyle(e).position; if (p !== 'fixed' && p !== 'sticky') return false; const r = e.getBoundingClientRect(); return r.top <= 4 && r.bottom > 10; });
    const cr = cab && cab.getBoundingClientRect();
    // contenido: el primer contenedor ancho típico
    const cont = scr && [...scr.querySelectorAll('.subj-wrap, .as-hero-in, .as-wrap, .bib-wrap, .pn-wrap, .pn, .cx-hwrap, .vv-hw, .mt-wrap, .au-wrap, main')].find((e) => vis(e) && e.getBoundingClientRect().width > 200);
    const kr = cont && cont.getBoundingClientRect();
    const sc = scr && scr.scrollWidth > scr.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(scr).overflowX) ? 'pantalla' : '';
    return { W, sw, culp: culp.slice(0, 4), cab: cr ? { n: nombre(cab), l: Math.round(cr.left), r: Math.round(cr.right), w: Math.round(cr.width) } : null, cont: kr ? { n: nombre(cont), l: Math.round(kr.left), r: Math.round(kr.right) } : null, scrollX: scrollX, scrPuedeScroll: sc, bodyW: document.body.getBoundingClientRect().width, htmlSW: document.documentElement.scrollWidth, htmlCW: document.documentElement.clientWidth };
  };
  const lado = () => {
    // intenta el scroll lateral y mira si la cabecera sigue alineada con el cuerpo
    const scr = [...document.querySelectorAll('.screen')].find((x) => getComputedStyle(x).display !== 'none');
    const antes = (document.querySelector('header.top, .scr-top') || {}).getBoundingClientRect?.().left;
    window.scrollTo(300, 0); if (scr) scr.scrollLeft = 300;
    const sx = Math.max(scrollX, scr ? scr.scrollLeft : 0);
    const cabs = [...document.querySelectorAll('header.top, .scr-top')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none'; });
    const h = cabs[0] ? Math.round(cabs[0].getBoundingClientRect().left) : null;
    window.scrollTo(0, 0); if (scr) scr.scrollLeft = 0;
    return { desplazo: sx, cabIzq: h };
  };
  const hallazgos = [];
  for (const [rol, ctx, rutas] of [['profesor', P, rutasP], ['alumno', A, rutasA]]) {
    for (const [w, h] of ANCHOS) {
      await ctx.pg.setViewportSize({ width: w, height: h });
      for (const [etq, ruta, esperar, accion] of rutas) {
        try {
          await ctx.pg.goto(BASE + ruta); if (esperar) await ctx.pg.waitForSelector(esperar, { timeout: 15000 }).catch(() => {});
          if (accion) await accion(ctx.pg).catch((e) => console.log('accion', etq, e.message.split('\n')[0]));
          await ctx.pg.waitForTimeout(500);
          const m = await ctx.pg.evaluate(medir); const l = await ctx.pg.evaluate(lado);
          const mal = m.sw > m.W + 1;
          const desalin = m.cab && m.cont && (Math.abs(m.cab.l - 0) > 1 || Math.abs(m.cab.r - m.W) > 1);
          const linea = `${fase} ${rol} ${w} ${etq}: scrollWidth ${m.sw}/${m.W}${m.culp.length ? ' culpables ' + m.culp.join(', ') : ''}${l.desplazo ? ' · SE PUEDE DESLIZAR ' + l.desplazo + 'px (cabecera x=' + l.cabIzq + ')' : ''}${m.cab ? ` · cab ${m.cab.l}..${m.cab.r}` : ''}`;
          console.log((mal || l.desplazo || desalin ? 'DESBORDA ' : 'ok      ') + linea);
          if (mal || l.desplazo || desalin) hallazgos.push(linea);
          if (process.env.CAPTURAS_CABECERA && (mal || w === 390 || w === 1024)) await ctx.pg.screenshot({ path: `${CAP}${fase}_${rol}_${w}_${etq}.png` });
        } catch (e) { console.log('ERR', rol, w, etq, e.message.split('\n')[0]); }
      }
    }
    await ctx.pg.setViewportSize({ width: 1440, height: 900 });
  }
  ok(`barrido ${fase}: sin scroll lateral en ninguna vista (1280/1024/768/390)`, hallazgos.length === 0, hallazgos.slice(0, 12).join(' || '));
}
