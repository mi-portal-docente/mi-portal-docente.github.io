// Auditoría de TODAS las prácticas de Circuitos (guiadas cN, autónomas aN y niveles de evaluación nN):
// cada guiada se monta siguiendo sus pasos tal como los ve el alumno y se comprueba que
//  (a) el resultado supera «Comprobar circuito» (y la autónoma / los niveles con la misma solución),
//  (b) el simulador no da ningún aviso (cortocircuito, polaridad, fundido, «se quemaría»…) durante ni al final,
//  (c) ningún cable atraviesa el cuerpo de un componente ni se enchufa debajo de él (cajas 3D).
// Uso: node circ_auditoria_test.mjs [c12,c19…]   ·   SHOTS_DIR=/ruta para guardar una captura de cada una
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { SITE_URL, codigoClase } from './rutas.mjs';
import { PRACTICES } from './src/circ/practices.js';
import { solutionModel } from './src/circ/guide.js';
import { EVALS, autonomaDe, idAutonoma, corregirCircuito, corregirNivel } from './src/circ/evaluaciones.js';
const base = process.env.PORTAL_BASE || SITE_URL + 'index.html';
const DIR = process.env.SHOTS_DIR || ''; if (DIR) mkdirSync(DIR, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 1366, height: 800 } });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
{ const cfg = leerConfig(); await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(codigoClase(), cfg.salt) })]); }
const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
const wait = (ms) => pg.waitForTimeout(ms);
await pg.goto(base + '#eee/circuitos'); await wait(2000);
// avisos que ve el alumno: el recuadro de alertas del simulador y los avisos emergentes de error
await pg.evaluate(() => {
  window.__avisos = [];
  const L = window.__circ; const sa = L.setAlert.bind(L), to = L.toast.bind(L);
  const esperado = () => { const st = L.pr?.steps || []; const i = L.g?.idx ?? 0; return !!(st[i]?.avisoEsperado || st[i - 1]?.avisoEsperado); }; // p. ej. el cortocircuito provocado de la práctica del fusible
  L.setAlert = (list) => { if (!esperado()) for (const m of list) window.__avisos.push('alerta: ' + m); return sa(list); };
  L.toast = (m, ...r) => { if (m == null) return to(m, ...r); const t = String(m).replace(/<[^>]+>/g, ''); if (/⚠|💥|❌|cortocircuito|fundid|al revés|quemar/i.test(t) && !esperado()) window.__avisos.push('aviso: ' + t.slice(0, 160)); return to(m, ...r); };
});
const ids = process.argv[2] ? process.argv[2].split(',') : PRACTICES.map(p => p.id);
const res = [];
for (const id of ids) {
  await pg.evaluate(() => { Object.keys(localStorage).filter(k => k.startsWith('circ:')).forEach(k => localStorage.removeItem(k)); });
  await pg.evaluate((h) => { location.hash = h; }, '#eee/circuitos/' + id); await wait(1800);
  await pg.evaluate(() => { const L = window.__circ; if (L.running) L.toggleSim(false); L.commit(() => { L.model = { parts: [], wires: [] }; }); Object.assign(L.g, { idx: 0, map: {}, measured: {}, answers: {}, snap: null }); L.afterChange(); L.renderSide(); window.__avisos = []; });
  let guard = 0, msg = '';
  while (guard++ < 70) {
    const s = await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; if (!st) return null; return { idx: L.g.idx, kind: st.place ? 'place' : st.wire ? 'wire' : st.remove ? 'remove' : st.setMode ? 'setMode' : st.sim ? 'sim' : st.stop ? 'stop' : st.act ? 'act' : st.measure ? 'measure' : '?' }; });
    if (!s) break;
    if (s.kind === 'wire') await pg.evaluate(() => { // como el alumno: clic en un extremo y en el otro con el tipo de cable que tenga elegido
      const L = window.__circ; const st = L.pr.steps[L.g.idx].wire; const map = L.g.map; const mk = (k) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m ? `p:${map[m[1]]}:${m[2]}` : k; };
      if (L.running) L.toggleSim(false);
      const n = window.__avisos.length; L.wireClick(mk(st.a)); if (L.wiring) L.wireClick(mk(st.b));
      if (window.__avisos.length > n || L.wiring || L.g.idx === L.pr.steps.indexOf(L.pr.steps[L.g.idx]) && !L.model.wires.some(w => w.a === mk(st.a) && w.b === mk(st.b))) { // lo que haría el alumno tras el aviso: elegir el cable que indica el paso
        L.cancelWire?.(); const b = document.querySelector('#cxCur [data-wkind]'); if (b) L.setWireKind(b.dataset.wkind); L.wireClick(mk(st.a)); if (L.wiring) L.wireClick(mk(st.b)); }
    });
    else if (['place', 'remove', 'setMode'].includes(s.kind)) await pg.evaluate(() => window.__circ.autoStep());
    else if (s.kind === 'sim' || s.kind === 'stop') await pg.click('#cxSim');
    else if (s.kind === 'act') await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; const p = L.part(L.g.map[st.act.part]);
      if (p.type === 'switch') p.state.closed = !p.state.closed; else if (p.type === 'spdt' || p.type === 'slide' || p.type === 'limit') p.state.pos = p.state.pos ? 0 : 1;
      else if (p.type === 'fuse') { for (const q of L.model.parts) if (q.type === 'tact') q.state.pressed = false; L.select({ kind: 'part', id: p.id }); L.guideAction('fusible'); return; }
      else if (p.type === 'tact' || p.type === 'button') p.state.pressed = !!st.act.test({ pressed: true });
      else if (p.type === 'pot') p.state.pos = st.act.test({ pos: 0.95 }) ? 0.95 : 0.05; else if (p.type === 'ldr') p.state.light = st.act.test({ light: 0.1 }) ? 0.1 : 0.95;
      L.stateChanged(p, true); });
    else if (s.kind === 'measure') await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; const map = L.g.map; const mk = (k) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m ? `p:${map[m[1]]}:${m[2]}` : k; };
      const M = L.meterPart(); if (M.props.mode !== st.measure.mode) M.props.mode = st.measure.mode; L.setProbe(M, 'red', mk(st.measure.red)); L.setProbe(M, 'com', mk(st.measure.com)); });
    await wait(['sim', 'measure', 'act'].includes(s.kind) ? 800 : 120);
    await pg.evaluate(() => window.__circ.evalGuide());
    const after = await pg.evaluate(() => window.__circ.g.idx);
    if (after === s.idx) { msg = `atascado en el paso ${s.idx + 1} (${s.kind})`; break; }
  }
  if (!(await pg.evaluate(() => window.__circ.running))) await pg.click('#cxSim');
  await wait(900);
  await pg.click('[data-act="check"]'); await wait(300);
  const chk = await pg.evaluate(() => { const r = window.__circ.checkResult; return { ok: !!r?.ok, ko: (r?.items || []).filter(i => !i.ok).map(i => i.label) }; });
  const geo = await pg.evaluate(() => window.__circ.auditarCables());
  const avisos = await pg.evaluate(() => [...new Set(window.__avisos)]);
  if (DIR) { await pg.evaluate(() => { const L = window.__circ; L.select(null); L.homeView(false, true, true); }); await wait(900); await pg.screenshot({ path: `${DIR}/${id}.png` }); }
  await pg.click('#cxSim').catch(() => { }); await wait(150);
  const n = await pg.evaluate(() => window.__circ.pr.n);
  const ok = !msg && chk.ok && !avisos.length && !geo.length;
  res.push({ id, n, ok }); console.log(`${ok ? 'OK  ' : 'FAIL'} ${id} (práctica ${n})${msg ? ' · ' + msg : ''}${chk.ok ? '' : ' · comprobación: ' + chk.ko.join(' | ')}${avisos.length ? ' · avisos: ' + avisos.join(' | ') : ''}${geo.length ? ' · cables: ' + geo.join(' | ') : ''}`);
}
// autónomas y niveles: son los mismos circuitos que las guiadas auditadas; se corrigen solos con su montaje
const auditadas = new Set(res.filter(r => r.ok).map(r => r.id)); const solo = [];
if (!process.argv[2]) {
  for (const pr of PRACTICES) { const A = autonomaDe(idAutonoma(pr.id)); const ok = !!A && A.practica === pr.id && corregirCircuito(pr, solutionModel(pr)).ok && auditadas.has(pr.id); solo.push({ id: idAutonoma(pr.id), ok, msg: ok ? '' : 'la autónoma no sale bien con el montaje guiado' }); }
  for (const ev of EVALS) { const r = corregirNivel(ev, ev.circuitos.map(c => solutionModel(PRACTICES.find(p => p.id === c.de)))); const mal = ev.circuitos.map(c => c.de).filter(id => !auditadas.has(id)); solo.push({ id: ev.id, ok: r.ok && r.nota === 10 && !mal.length, msg: `nota ${r.nota}${mal.length ? ' · usa guiadas con fallos: ' + mal.join(', ') : ''}` }); }
}
for (const s of solo) console.log(`${s.ok ? 'OK  ' : 'FAIL'} ${s.id}${s.ok ? '' : ' · ' + s.msg}`);
if (errs.length) console.log('FAIL errores de página: ' + errs.slice(0, 3).join(' | '));
const f = res.filter(r => !r.ok).length + solo.filter(s => !s.ok).length + (errs.length ? 1 : 0);
console.log(`\n${res.length + solo.length - f + (errs.length ? 1 : 0)}/${res.length + solo.length} prácticas sin fallos`); await b.close(); process.exit(f ? 1 : 0);
