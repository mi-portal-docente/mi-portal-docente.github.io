// Verificación del Laboratorio de Circuitos (playwright-core + Chrome headless)
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { SHOTS, SITE_URL, codigoClase } from './rutas.mjs';
const base = process.env.PORTAL_BASE || SITE_URL + 'index.html';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
// Nunca usar el proyecto Firebase real en las pruebas: modo «código de clase»
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
{
  const _cfg = leerConfig();
  const _code = codigoClase();
  const _hash = hashCodigo(_code, _cfg.salt);
  await ctx.addInitScript(([key, val]) => { localStorage.setItem(key, val); }, ['portal.acceso', JSON.stringify({ version: _cfg.version, hash: _hash })]);
}
const pg = await ctx.newPage();
const errs = []; const results = [];
pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
pg.on('dialog', d => d.accept());
const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const wait = (ms) => pg.waitForTimeout(ms);
async function go(h, ms = 1500) { await pg.evaluate((h) => { location.hash = h; }, h); await wait(ms); }
// coordenadas de pantalla de un terminal/agujero
async function scr(key) { return pg.evaluate((key) => { const L = window.__circ; const v = L.termWorld(key).clone(); v.project(L.camera); const r = L.renderer.domElement.getBoundingClientRect(); return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height }; }, key); }
async function clickKey(key) { const p = await scr(key); await pg.mouse.move(p.x, p.y, { steps: 3 }); await pg.mouse.down(); await pg.mouse.up(); await wait(120); }
async function clearAll() { await pg.evaluate(() => { Object.keys(localStorage).filter(k => k.startsWith('circ:')).forEach(k => localStorage.removeItem(k)); }); }

await pg.goto(base + '#inicio'); await wait(1500);
await clearAll();

// 1) Apartados
await go('#eee', 1200);
ok('#eee (enlace antiguo) → página de EEE', await pg.evaluate(() => location.hash.startsWith('#asig/eee') && document.body.classList.contains('scr-asig')));
await go('#asig/eee/laboratorio', 1200);
ok('#asig/eee/laboratorio: ESP32, Circuitos e Instalación de vivienda', await pg.evaluate(() => document.querySelectorAll('#asig a.ap-card').length === 3 && !document.querySelector('#asig a.ap-card[href="#eee/placa"]') && document.querySelector('#tab-laboratorio')?.getAttribute('aria-selected') === 'true'));
await pg.screenshot({ path: SHOTS + 'circuitos_apartados.png' });

// 2) Enlaces antiguos del apartado ESP32
await go('#p3-2', 2500);
let st = await pg.evaluate(() => ({ h: location.hash, n: window.__app.state.lesson?.n, s: window.__app.state.step, cls: document.body.className, cr: document.querySelector('#crumbs').textContent }));
ok('#p3-2 abre el proyecto 3, paso 2', st.h === '#p3-2' && st.n === 3 && st.s === 1 && !/scr-/.test(st.cls), JSON.stringify(st));
await go('#eee/esp32', 2000);
st = await pg.evaluate(() => ({ h: location.hash, l: window.__app.state.lesson, home: document.body.classList.contains('home') }));
ok('#eee/esp32 muestra el inicio ESP32', st.h === '#eee/esp32' && !st.l && st.home);

// 3) Portada del laboratorio + modo libre con ratón real
await go('#eee/circuitos', 1200);
ok('Portada de Circuitos con 12 prácticas + modo libre', await pg.evaluate(() => document.querySelectorAll('.cx-card').length === 13));
ok('Sin logotipo salesiano dentro de Circuitos', await pg.evaluate(() => !document.querySelector('#circ img[src*="salesian"]') && !/salesian/i.test(document.querySelector('#circ').innerHTML)));
await go('#eee/circuitos/libre', 2500);
await pg.click('[data-cxtab="comp"]').catch(() => {}); await wait(300);
// arrastrar una resistencia desde el catálogo a la protoboard (ratón real)
const card = await pg.locator('[data-add="resistor"]').first().boundingBox();
const dst = await scr('h:b12');
await pg.mouse.move(card.x + card.width / 2, card.y + card.height / 2); await pg.mouse.down();
for (let i = 1; i <= 15; i++) await pg.mouse.move(card.x + (dst.x - card.x) * i / 15, card.y + (dst.y - card.y) * i / 15);
await pg.mouse.move(dst.x, dst.y); await wait(100); await pg.mouse.up(); await wait(400);
st = await pg.evaluate(() => window.__circ.model.parts.map(p => ({ t: p.type, at: p.at, rot: p.rot })));
ok('Arrastrar componente del catálogo a la protoboard', st.length === 1 && st[0].t === 'resistor' && !!st[0].at, JSON.stringify(st));
// recolocar con API para un montaje conocido: R 470 b10-b14, LED rojo e14-e15, pila 9V
await pg.evaluate(() => { const L = window.__circ; const r = L.model.parts[0]; L.commit(() => { r.at = 'b10'; r.rot = 0; r.props.r = 470; });
  L.autoPlace(L.freshPart('led', { color: 'rojo' }), { at: 'e14', rot: 0 }); L.autoPlace(L.freshPart('bat9'), { pos: [-23, -5], rot: 0 }); L.select(null); });
await wait(300);
const bid = await pg.evaluate(() => window.__circ.model.parts.find(p => p.type === 'bat9').id);
// cables con clics reales
await pg.keyboard.press('t'); await wait(400);
// un Dupont macho-macho no se puede enganchar a la lengüeta de una pila de 9 V: se rechaza y explica por qué
await pg.click('#cxWBar [data-wkind="mm"]'); await wait(100);
await clickKey(`p:${bid}:+`); await wait(200);
st = await pg.evaluate(() => ({ t: document.querySelector('#cxToast').textContent, pend: !!window.__circ.wiring, sug: [...document.querySelectorAll('#cxToast [data-wkind]')].map(b => b.dataset.wkind) }));
ok('Cable Dupont macho-macho en la lengüeta de la pila: rechazado con explicación y sugerencia', !st.pend && /no encaja|no se puede|no entra|lengüeta/i.test(st.t) && st.sug.includes('cm'), st.t.slice(0, 120) + ' · sugiere ' + st.sug.join(','));
await pg.click('#cxWBar [data-wkind="cm"]'); await wait(100);
await clickKey(`p:${bid}:+`); await clickKey('h:tp9');
await clickKey(`p:${bid}:-`); await clickKey('h:tn2');
await pg.click('#cxWBar [data-wkind="mm"]'); await wait(100);
await clickKey('h:tp11'); await clickKey('h:a10');
await clickKey('h:a15'); await clickKey('h:tn15');
st = await pg.evaluate(() => window.__circ.model.wires.map(w => w.a + '→' + w.b + ' ' + w.color));
ok('Tender 4 cables con clics', st.length === 4, st.join(' | '));
st = await pg.evaluate(() => window.__circ.model.wires.map(w => w.kind));
ok('Tipos de cable guardados: 2 cocodrilo-macho + 2 Dupont macho-macho', st.join(',') === 'cm,cm,mm,mm', st.join(','));
// pasar el ratón por una pata del LED muestra su nombre y su agujero
{ const p = await scr('h:e15'); await pg.mouse.move(p.x, p.y - 2, { steps: 3 }); await wait(300);
  const tip = await pg.evaluate(() => document.querySelector('#cxTip')?.textContent || '');
  ok('Al pasar por la pata del LED se ve «cátodo» y su agujero', /cátodo/i.test(tip) && /15/.test(tip), tip.slice(0, 120)); }
// tabla de patas en el inspector
await pg.evaluate(() => { const L = window.__circ; L.select({ kind: 'part', id: L.model.parts.find(p => p.type === 'led').id }); }); await wait(300);
st = await pg.evaluate(() => [...document.querySelectorAll('#cxInsp .cx-ptbl tr')].map(r => r.textContent));
ok('Inspector: tabla con las 2 patas del LED (ánodo/cátodo) y dónde están', st.length === 2 && /ánodo/i.test(st[0]) && /cátodo/i.test(st[1]), st.join(' | ').slice(0, 140));
await pg.screenshot({ path: SHOTS + 'circ_despues_inspector.png' });
// rayos X: tiras internas de la protoboard
await pg.evaluate(() => window.__circ.select(null)); await pg.keyboard.press('x'); await wait(400);
ok('Rayos X (tecla X) muestra las tiras metálicas', await pg.evaluate(() => window.__circ.xray === true && window.__circ.board.getObjectByName('strips')?.visible === true));
await pg.screenshot({ path: SHOTS + 'circ_despues_xray.png' });
await pg.keyboard.press('x'); await wait(200);
await pg.keyboard.press('n'); await wait(300);
ok('Etiquetas de patas (tecla N)', await pg.evaluate(() => document.querySelectorAll('.cx-plab').length >= 6));
await pg.screenshot({ path: SHOTS + 'circ_despues_cables.png' });
await pg.keyboard.press('n'); await wait(200);
await pg.evaluate(() => window.__circ.select(null)); await pg.keyboard.press('h'); await wait(400);
await pg.click('[data-cxtab="comp"]'); await wait(200);
await pg.screenshot({ path: SHOTS + 'circuitos_editor.png' });
await pg.screenshot({ path: SHOTS + 'circ_despues_editor.png' });
// buscador del catálogo
await pg.fill('#cxQ', 'rele'); await wait(300);
st = await pg.evaluate(() => [...document.querySelectorAll('.cx-comp')].map(b => b.dataset.add));
ok('Buscador de componentes («rele» → relé)', st.length >= 1 && st.includes('relay') && st.length < 4, st.join(','));
await pg.fill('#cxQ', ''); await wait(200); await pg.evaluate(() => document.activeElement?.blur());
await pg.click('#cxSim'); await wait(1200);
st = await pg.evaluate(() => { const L = window.__circ; return { on: L.showFlow, vis: L.dots.visible, n: L.dots.count, wi: Object.values(L.lastSim.wireI || {}).map(x => Math.abs(x)) }; });
ok('Puntos de corriente animados por los cables (≈15 mA en cada cable)', st.on && st.vis && st.n > 10 && st.wi.length === 4 && st.wi.every(x => x > 0.012 && x < 0.018), `${st.n} puntos · ${st.wi.map(x => (x * 1000).toFixed(1)).join(', ')} mA`);
await pg.keyboard.press('c'); await wait(200);
st = await pg.evaluate(() => ({ f: window.__circ.showFlow, n: window.__circ.dots.count, a: document.activeElement?.id || document.activeElement?.tagName }));
ok('Botón/tecla C oculta los puntos de corriente', !st.f && st.n === 0, JSON.stringify(st));
await pg.keyboard.press('c'); await wait(200);
st = await pg.evaluate(() => { const L = window.__circ; const led = L.model.parts.find(p => p.type === 'led'); const r = L.lastSim.res[led.id]; return { bright: r.bright, i: r.i, burnt: !!L.runtime[led.id]?.burnt }; });
ok('Simulación: el LED se enciende (≈15 mA)', st.bright > 0.3 && st.i > 0.012 && st.i < 0.018 && !st.burnt, `I=${(st.i * 1000).toFixed(1)} mA`);
// selecciona el LED para ver lecturas en vivo
await pg.evaluate(() => { const L = window.__circ; L.select({ kind: 'part', id: L.model.parts.find(p => p.type === 'led').id }); }); await wait(500);
await pg.screenshot({ path: SHOTS + 'circuitos_led.png' });
// interruptor real: clic en el LED no debe romper nada; detener
await pg.click('#cxSim'); await wait(300);

// polímetro: medir tensión del LED
await pg.evaluate(() => { const L = window.__circ; L.select(null); L.autoPlace(L.freshPart('meter'), { pos: [27, 0], rot: 0 }); L.select(null); });
const mid = await pg.evaluate(() => window.__circ.model.parts.find(p => p.type === 'meter').id);
await pg.click('#cxSim'); await wait(400);
// arrastrar puntas con el ratón
async function dragProbe(pin, key) {
  const from = await pg.evaluate(([id, pin]) => { const L = window.__circ; const v = L.probeTip(L.part(id), pin).clone(); v.project(L.camera); const r = L.renderer.domElement.getBoundingClientRect(); return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height }; }, [mid, pin]);
  const to = await scr(key);
  await pg.mouse.move(from.x, from.y); await pg.mouse.down();
  for (let i = 1; i <= 12; i++) await pg.mouse.move(from.x + (to.x - from.x) * i / 12, from.y + (to.y - from.y) * i / 12);
  await pg.mouse.up(); await wait(200);
}
await dragProbe('red', 'h:c14'); await dragProbe('com', 'h:c15'); await wait(800);
st = await pg.evaluate((id) => { const L = window.__circ; return { probes: L.part(id).probes, m: L.lastSim.res[id].meter }; }, mid);
ok('Polímetro (V) mide la tensión del LED ≈ 2 V', st.m && Math.abs(st.m.value - 2.02) < 0.1, `${st.m?.text} · puntas ${JSON.stringify(st.probes)}`);
await pg.evaluate(() => { window.__circ.select(null); }); await wait(400);
await pg.screenshot({ path: SHOTS + 'circuitos_polimetro.png' });
// amperímetro en paralelo -> fusible
await pg.evaluate((id) => { const L = window.__circ; const m = L.part(id); m.props.mode = 'A'; L.stateChanged(m, true); L.setProbe(m, 'red', 'h:tp20'); L.setProbe(m, 'com', 'h:tn20'); }, mid); await wait(800);
st = await pg.evaluate((id) => ({ fuse: !!window.__circ.runtime[id]?.fuse, toast: document.querySelector('#cxToast').textContent }), mid);
ok('Amperímetro en paralelo con la pila: se funde el fusible y avisa', st.fuse, st.toast.slice(0, 80));
await pg.click('#cxSim'); await wait(300);

// LED sin resistencia -> se funde
await pg.evaluate(() => { const L = window.__circ; L.commit(() => { L.model = { parts: [], wires: [] }; }); L.afterChange();
  L.autoPlace(L.freshPart('led', { color: 'rojo' }), { at: 'e14', rot: 0 }); const B = L.autoPlace(L.freshPart('bat9'), { pos: [-23, -5], rot: 0 });
  L.commit(() => { L.model.wires.push({ id: 'w1', a: `p:${B.id}:+`, b: 'h:a14', color: 'rojo' }, { id: 'w2', a: `p:${B.id}:-`, b: 'h:a15', color: 'negro' }); }); L.select(null); });
await pg.click('#cxSim'); await wait(1500);
st = await pg.evaluate(() => { const L = window.__circ; const led = L.model.parts.find(p => p.type === 'led'); return { burnt: !!L.runtime[led.id]?.burnt, alert: document.querySelector('#cxAlert').textContent, toast: document.querySelector('#cxToast').textContent }; });
ok('LED sin resistencia: se funde y avisa', st.burnt && /fundido/i.test(st.alert + st.toast), st.alert.slice(0, 90));
await pg.screenshot({ path: SHOTS + 'circ_led_quemado.png' });
await pg.click('#cxSim'); await wait(300);

// Cortocircuito
await pg.evaluate(() => { const L = window.__circ; L.commit(() => { L.model = { parts: [], wires: [] }; }); L.afterChange();
  const B = L.autoPlace(L.freshPart('bat9'), { pos: [-23, -5], rot: 0 }); L.autoPlace(L.freshPart('bulb'), { at: 'c10', rot: 0 });
  L.commit(() => { L.model.wires.push({ id: 'w1', a: `p:${B.id}:+`, b: 'h:tp3', color: 'rojo' }, { id: 'w2', a: `p:${B.id}:-`, b: 'h:tn3', color: 'negro' }, { id: 'w3', a: 'h:tp9', b: 'h:a10', color: 'rojo' }, { id: 'w4', a: 'h:a12', b: 'h:tn11', color: 'negro' }, { id: 'w5', a: 'h:tp20', b: 'h:tn20', color: 'amarillo' }); }); L.select(null); });
await pg.click('#cxSim'); await wait(1000);
st = await pg.evaluate(() => { const L = window.__circ; const bulb = L.model.parts.find(p => p.type === 'bulb'); return { warn: L.lastSim.warnings.map(w => w.msg), alert: document.querySelector('#cxAlert').textContent, bright: L.lastSim.res[bulb.id].bright }; });
ok('Cortocircuito detectado y avisado (la bombilla no luce)', /cortocircuito/i.test(st.alert) && st.bright < 0.05, st.alert.slice(0, 110));
await pg.screenshot({ path: SHOTS + 'circ_corto.png' });
await pg.click('#cxSim'); await wait(300);

// 4) Prácticas guiadas: ejecutar todos los pasos como lo haría el alumno
async function runPractice(id, shotAt, after) {
  await go('#eee/circuitos/' + id, 2200);
  const n = await pg.evaluate(() => window.__circ.pr.steps.length);
  let guard = 0, shot = false;
  while (guard++ < 60) {
    const s = await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; if (!st) return null; return { idx: L.g.idx, kind: st.place ? 'place' : st.wire ? 'wire' : st.remove ? 'remove' : st.setMode ? 'setMode' : st.sim ? 'sim' : st.stop ? 'stop' : st.act ? 'act' : st.measure ? 'measure' : '?' }; });
    if (!s) break;
    if (shotAt && !shot && s.idx === shotAt) { await pg.evaluate(() => window.__circ.select(null)); await wait(400); await pg.screenshot({ path: SHOTS + 'circuitos_practica.png' }); shot = true; }
    if (['place', 'wire', 'remove', 'setMode'].includes(s.kind)) await pg.evaluate(() => window.__circ.autoStep());
    else if (s.kind === 'sim') await pg.click('#cxSim');
    else if (s.kind === 'stop') await pg.click('#cxSim');
    else if (s.kind === 'act') await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; const p = L.part(L.g.map[st.act.part]);
      if (p.type === 'switch') p.state.closed = !p.state.closed; else if (p.type === 'spdt' || p.type === 'slide') p.state.pos = p.state.pos ? 0 : 1;
      else if (p.type === 'tact' || p.type === 'button') p.state.pressed = true;
      else if (p.type === 'pot') p.state.pos = st.act.test({ pos: 0.95 }) ? 0.95 : 0.05; else if (p.type === 'ldr') p.state.light = st.act.test({ light: 0.1 }) ? 0.1 : 0.95;
      L.stateChanged(p, true); });
    else if (s.kind === 'measure') await pg.evaluate(() => { const L = window.__circ; const st = L.pr.steps[L.g.idx]; const map = L.g.map; const mk = (k) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m ? `p:${map[m[1]]}:${m[2]}` : k; };
      const M = L.meterPart(); if (M.props.mode !== st.measure.mode) { M.props.mode = st.measure.mode; }
      L.setProbe(M, 'red', mk(st.measure.red)); L.setProbe(M, 'com', mk(st.measure.com)); });
    await wait(s.kind === 'sim' || s.kind === 'measure' || s.kind === 'act' ? 700 : 150);
    await pg.evaluate(() => window.__circ.evalGuide());
    const after = await pg.evaluate(() => window.__circ.g.idx);
    if (after === s.idx) { const info = await pg.evaluate(() => { const L = window.__circ; return JSON.stringify({ step: L.pr.steps[L.g.idx].t, meter: L.meterText?.() }); }); return { ok: false, msg: `atascado en paso ${s.idx + 1} (${s.kind}) ${info}` }; }
  }
  if (after) { if (!(await pg.evaluate(() => window.__circ.running))) await pg.click('#cxSim'); await wait(900); await pg.evaluate(() => window.__circ.select(null)); await wait(500); await pg.screenshot({ path: SHOTS + 'circ_despues_' + after + '.png' }); }
  // comprobar circuito (botón real) y responder preguntas
  await pg.click('[data-act="check"]'); await wait(300);
  const chk = await pg.evaluate(() => { const r = window.__circ.checkResult; return { ok: r.ok, items: r.items.map(i => (i.ok ? '✔ ' : '✘ ') + i.label) }; });
  const green = await pg.evaluate(() => !!document.querySelector('.cx-check.ok'));
  const q = await pg.evaluate(() => { const L = window.__circ; L.pr.questions.forEach((q, i) => { L.g.answers[i] = q.choices ? String(q.ans) : String(q.ans).replace('.', ','); }); L.guideAction('answers'); return L.qres; });
  if (await pg.evaluate(() => window.__circ.running)) await pg.click('#cxSim');
  return { ok: chk.ok && green && q.every(x => x === true), steps: n, msg: chk.items.join(' / ') + ` · preguntas ${q.filter(Boolean).length}/${q.length}` };
}
const PRS = await pg.evaluate(() => window.__circ ? null : null);
const ids = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12'];
const SH = { c10: 'pulsador', c11: 'interruptor', c12: 'rele' };
for (const id of ids) { const r = await runPractice(id, id === 'c2' ? 3 : 0, SH[id]); ok(`Práctica ${id}: todos los pasos + comprobación en verde + preguntas`, r.ok, `${r.steps} pasos · ${r.msg}`); }
// botón Ver solución en c4 (desde cero)
await clearAll(); await go('#eee/circuitos/c5', 2000);
await pg.click('[data-act="solution"]'); await wait(500); await pg.click('#cxSim'); await wait(800);
st = await pg.evaluate(() => { const L = window.__circ; return L.model.parts.filter(p => p.type === 'bulb').map(p => L.lastSim.res[p.id].bright); });
ok('Ver solución (c5) carga el montaje y las bombillas lucen', st.length === 2 && st.every(x => x > 0.3), st.map(x => x.toFixed(2)).join(', '));
await pg.click('[data-act="check"]'); await wait(300);
ok('Comprobación de la solución cargada en verde', await pg.evaluate(() => window.__circ.checkResult.ok));
await pg.click('#cxSim'); await wait(200);
// deshacer
const before = await pg.evaluate(() => window.__circ.model.parts.length);
await pg.evaluate(() => { const L = window.__circ; L.select({ kind: 'part', id: L.model.parts[0].id }); }); await pg.keyboard.press('Delete'); await wait(200);
const mid2 = await pg.evaluate(() => window.__circ.model.parts.length);
await pg.keyboard.press('Control+z'); await wait(200);
const aft = await pg.evaluate(() => window.__circ.model.parts.length);
ok('Borrar (Supr) y deshacer (Ctrl+Z)', mid2 === before - 1 && aft === before, `${before}→${mid2}→${aft}`);
// exportar / importar
const exp = await pg.evaluate(() => JSON.stringify(window.__circ.model));
await pg.evaluate((t) => { const L = window.__circ; L.commit(() => { L.model = { parts: [], wires: [] }; }); L.afterChange(); L.importText(JSON.stringify({ app: 'circuitos', model: JSON.parse(t) })); }, exp); await wait(300);
ok('Importar montaje (JSON)', await pg.evaluate((t) => JSON.stringify(window.__circ.model.parts.map(p => p.type)) === JSON.stringify(JSON.parse(t).parts.map(p => p.type)), exp));
// persistencia
await wait(1500); // dar tiempo a Chrome a guardar localStorage antes de recargar
await pg.reload(); await wait(2500);
st = await pg.evaluate(() => ({ n: window.__circ.model.parts.length, h: location.hash, v: window.__circ.view, ls: (localStorage.getItem('circ:v1:auto:c5') || '').length }));
ok('Montaje recuperado tras recargar (localStorage)', st.n === before, JSON.stringify(st));
// vuelta al ESP32 tras Circuitos
await go('#p3-2', 2000);
ok('Volver a #p3-2 desde Circuitos', await pg.evaluate(() => window.__app.state.lesson?.n === 3 && !document.body.classList.contains('scr-circ')));
// móvil / tablet
await pg.setViewportSize({ width: 820, height: 1180 }); await go('#eee/circuitos/c2', 1800);
await pg.screenshot({ path: SHOTS + 'circ_tablet.png' });
await pg.setViewportSize({ width: 390, height: 844 }); await wait(800);
await pg.screenshot({ path: SHOTS + 'circ_movil.png' });
ok('Sin errores en consola', errs.length === 0, errs.slice(0, 5).join(' | '));
console.log(`\n${results.filter(r => r.ok).length}/${results.length} comprobaciones OK`);
await b.close();
