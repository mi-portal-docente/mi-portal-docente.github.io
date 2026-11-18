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
ok('Portada de Circuitos con 29 prácticas en 4 temas + modo libre', await pg.evaluate(() => document.querySelectorAll('.cx-card:not(.free)').length === 29 && document.querySelectorAll('.cx-tema').length === 5 && !!document.querySelector('.cx-card.free[href="#eee/circuitos/libre"]')));
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
      if (p.type === 'switch') p.state.closed = !p.state.closed; else if (p.type === 'spdt' || p.type === 'slide' || p.type === 'limit') p.state.pos = p.state.pos ? 0 : 1;
      else if (p.type === 'fuse') { for (const q of L.model.parts) if (q.type === 'tact') q.state.pressed = false; L.select({ kind: 'part', id: p.id }); L.guideAction('fusible'); return; }
      else if (p.type === 'tact' || p.type === 'button') p.state.pressed = !!st.act.test({ pressed: true });
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
const ids = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29'];
const SH = { c10: 'pulsador', c11: 'interruptor', c12: 'rele', c17: 'fusible', c18: 'final_carrera', c19: 'diodo', c20: 'transistor', c21: 'automatismo', c22: 'led_serie', c23: 'resistencia_comun', c24: 'control_ramas', c25: 'tres_interruptores', c26: 'reto_combinaciones', c27: 'condensador', c28: 'rgb', c29: 'luz_nocturna' };
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
await wait(3500); // dar tiempo a Chrome a guardar localStorage antes de recargar (con 1,5 s fallaba a veces también en main)
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
// estado de la entrega de una guiada: corrección automática («Guiada completada»), nunca «Pendiente de corregir»;
// y al superar «Comprobar circuito» el alumno la deja registrada sola (el profesor la ve en su progreso)
await go('#eee/circuitos/c16', 2000);
st = await pg.evaluate(async () => {
  const L = window.__circ, prev = window.PORTAL; const llamadas = [];
  window.PORTAL = { rol: 'alumno', estadoEntrega: () => null, entregar: (x) => { llamadas.push(x); return Promise.resolve(); } };
  try {
    const out = {};
    for (const ok of [true, false]) { window.PORTAL.estadoEntrega = () => ({ fecha: Date.now(), nota: null, datos: { comprobacion: { ok } } }); out[ok ? 'bien' : 'mal'] = L.entregaHTML(); }
    window.PORTAL.estadoEntrega = () => null;
    L.loadSolution(); L.guideAction('check'); await new Promise(r => setTimeout(r, 200));
    out.auto = llamadas.map(x => x.practica + ':' + x.datos.comprobacion.ok).join(',');
    return out;
  } finally { window.PORTAL = prev; }
});
ok('Práctica 14 (c16): la entrega muestra «Guiada completada» (corrección automática) y no «Pendiente de corregir»', /Guiada completada/.test(st.bien) && !/Pendiente de corregir/i.test(st.bien + st.mal) && /sin superar/.test(st.mal), (st.bien + ' || ' + st.mal).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200));
ok('Al superar «Comprobar circuito» la guiada del alumno queda registrada sola', st.auto === 'c16:true', st.auto);
// candados del profesor en la lista (prácticas y niveles), sincronizados con los tokens del panel
await go('#eee/circuitos', 1500);
st = await pg.evaluate(async () => {
  const L = window.__circ, prev = window.PORTAL, prevS = window.PORTAL_SESION; const G = [{ id: 'g1', nombre: '1º A', apartados: ['circuitos'] }, { id: 'g2', nombre: '1º B', apartados: ['circuitos'] }]; const llam = [];
  window.PORTAL = { rol: 'profesor', ambito: () => null, estadoEntrega: () => null, circ: { grupos: () => G.map(g => ({ ...g, apartados: g.apartados.slice() })), guardarApartados: async (id, ap) => { llam.push(id + '=' + ap.join('|')); G.find(g => g.id === id).apartados = ap.slice(); } } };
  const out = {};
  try {
    L.refrescarHome();
    out.bar = document.querySelector('.cx-gbar select')?.value; out.nCand = document.querySelectorAll('#cxHome .cx-cand').length;
    out.emoji = /[\u{1F300}-\u{1FAFF}]/u.test([...document.querySelectorAll('#cxHome .cx-cand')].map(b => b.textContent).join(''));
    document.querySelector('#cxHome [data-lock="c16"]').click(); await new Promise(r => setTimeout(r, 150));
    out.cerrada = document.querySelector('#cxHome [data-lock="c16"]')?.classList.contains('ce') && document.querySelector('#cxHome a[href="#eee/circuitos/c16"]')?.classList.contains('cerrada');
    out.g1 = G[0].apartados.join('|'); out.g2 = G[1].apartados.join('|');
    const sel = document.querySelector('.cx-gbar select'); sel.value = 'g2'; sel.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 50));
    out.g2abierta = document.querySelector('#cxHome [data-lock="c16"]')?.classList.contains('ab');
    sel.value !== 'g1' && (document.querySelector('.cx-gbar select').value = 'g1', document.querySelector('.cx-gbar select').dispatchEvent(new Event('change', { bubbles: true })));
    location.hash = '#eee/circuitos/evaluacion'; await new Promise(r => setTimeout(r, 600));
    out.nCandEv = document.querySelectorAll('#cxHome .cx-evcard .cx-cand').length;
    document.querySelector('#cxHome [data-lock="n1"]').click(); await new Promise(r => setTimeout(r, 150));
    out.n1 = G[0].apartados.join('|');
    // alumno del grupo 1º A
    window.PORTAL = { rol: 'alumno', ambito: () => null, estadoEntrega: () => null }; window.PORTAL_SESION = { apartados: G[0].apartados.slice(), asignaturas: ['eee'] };
    location.hash = '#eee/circuitos'; await new Promise(r => setTimeout(r, 600));
    out.alC16 = !!document.querySelector('#cxHome div.cx-card.locked') && !document.querySelector('#cxHome a[href="#eee/circuitos/c16"]') && !!document.querySelector('#cxHome a[href="#eee/circuitos/c15"]') && !document.querySelector('#cxHome .cx-cand');
    location.hash = '#eee/circuitos/c16'; await new Promise(r => setTimeout(r, 900));
    out.url = location.hash;
    location.hash = '#eee/circuitos/a16'; await new Promise(r => setTimeout(r, 900));
    out.urlA = location.hash;
    location.hash = '#eee/circuitos/n1'; await new Promise(r => setTimeout(r, 900));
    out.urlN1 = location.hash + ':' + (L.view);
  } finally { window.PORTAL = prev; window.PORTAL_SESION = prevS; }
  out.llam = llam.length; return out;
});
ok('Candados del profesor: selector de grupo, un candado (icono de línea) por práctica y por nivel', st.bar === 'g1' && st.nCand === 29 && st.nCandEv === 5 && !st.emoji, JSON.stringify(st).slice(0, 300));
ok('Candado: cerrar la práctica 14 (c16) solo en 1º A, con los mismos tokens que el panel', st.cerrada && /guiadas:/.test(st.g1) && !/c16/.test(st.g1.split('guiadas:')[1]) && st.g2 === 'circuitos' && st.g2abierta, `${st.g1} · ${st.g2}`);
ok('Candado de nivel: abre el nivel 1 de evaluación para 1º A', /evaluacion:n1/.test(st.n1), st.n1);
ok('Alumno: la práctica cerrada se ve difuminada y no se puede entrar (ni por URL a la guiada ni a la autónoma); el nivel abierto sí', st.alC16 && st.url === '#eee/circuitos' && !/a16/.test(st.urlA) && st.urlN1 === '#eee/circuitos/n1:n1', JSON.stringify({ a: st.alC16, u: st.url, ua: st.urlA, n: st.urlN1 }));
await go('#eee/circuitos', 1200);
// borrar cables: tocar/pinchar un cable lo selecciona (aunque debajo haya agujeros) y se borra con Supr o con «Borrar cable»
async function wireCase(page, mobile) {
  if (!mobile) { await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(600); }
  await page.evaluate(() => { location.hash = '#eee/circuitos/libre'; }); await page.waitForTimeout(2000);
  await page.evaluate(() => { const L = window.__circ; L.cancelWire(); L.commit(() => { L.model = { parts: [], wires: [] }; }); L.afterChange();
    L.autoPlace(L.freshPart('resistor'), { at: 'b10', rot: 0 }); L.autoPlace(L.freshPart('led', { color: 'rojo' }), { at: 'e20', rot: 0 });
    L.commit(() => L.model.wires.push({ id: 'wA', a: 'h:j11', b: 'h:j21', color: 'rojo' }, { id: 'wB', a: 'h:f9', b: 'h:f23', color: 'negro' })); L.select(null); L.homeView(false, true, true); });
  await page.waitForTimeout(1600);
  // punto del cable visible en pantalla (no tapado por botones ni paneles), empezando por la fracción t
  const pt = (id, t0) => page.evaluate(([id, t0]) => { const L = window.__circ; const cv = L.renderer.domElement; const r = cv.getBoundingClientRect(); let first = null;
    for (const t of [t0, 0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) { const v = L.wobjs.get(id).curve.getPoint(t).clone(); v.project(L.camera); const p = { x: r.left + (v.x * .5 + .5) * r.width, y: r.top + (-v.y * .5 + .5) * r.height }; first = first || p; if (document.elementFromPoint(p.x, p.y + 4) === cv && document.elementFromPoint(p.x, p.y) === cv) return p; } return first; }, [id, t0]);
  const out = {};
  out.asig = await page.evaluate(() => document.body.classList.contains('con-asigbar') && !!document.querySelector('#asigbar, .asigbar'));
  let p = await pt('wA', 0.3);
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); const q = await pt('wA', 0.3); const quieto = Math.hypot(q.x - p.x, q.y - p.y) < 0.5; p = q; if (quieto) break; } // cámara ya quieta
  out.p = [Math.round(p.x), Math.round(p.y)]; out.cv = await page.evaluate(() => { const r = window.__circ.renderer.domElement.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round).join(',') + ' sy=' + scrollY + ' vv=' + innerWidth + 'x' + innerHeight; });
  if (mobile) await page.touchscreen.tap(p.x, p.y + 1); else { await page.mouse.move(p.x, p.y + 2); await page.mouse.down(); await page.mouse.up(); }
  await page.waitForTimeout(250);
  out.selA = await page.evaluate(() => ({ s: window.__circ.sel?.id || null, wiring: !!window.__circ.wiring }));
  if (mobile) { const vis = await page.evaluate(() => { const b = document.querySelector('#cxInsp [data-tool="del"]'); if (!b) return false; const r = b.getBoundingClientRect(), q = document.querySelector('#cxInsp').getBoundingClientRect(); return r.height > 0 && r.bottom <= q.bottom + 1 && r.top >= q.top - 1; }); out.btnVisible = vis; if (vis) await page.tap('#cxInsp [data-tool="del"]'); else out.top = await page.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y + 1); const L = window.__circ; return (e?.id || e?.className || e?.tagName) + ' · toast=' + (document.querySelector('#cxToast')?.textContent || '').slice(0, 80) + ' · hw=' + L.hitWire({ clientX: x, clientY: y + 1, pointerType: 'touch' }); }, p); }
  else await page.keyboard.press('Delete');
  await page.waitForTimeout(250);
  out.left = await page.evaluate(() => window.__circ.model.wires.map(w => w.id).join(','));
  p = await pt('wB', 0.6);
  if (mobile) await page.touchscreen.tap(p.x, p.y); else { await page.mouse.move(p.x, p.y); await page.mouse.down(); await page.mouse.up(); }
  await page.waitForTimeout(250);
  out.selB = await page.evaluate(() => window.__circ.sel?.id || null);
  if (mobile) { if (await page.$('#cxInsp [data-tool="del"]')) await page.tap('#cxInsp [data-tool="del"]'); } else await page.keyboard.press('Backspace');
  await page.waitForTimeout(250);
  out.left2 = await page.evaluate(() => window.__circ.model.wires.length);
  return out;
}
{ const r = await wireCase(pg, false);
  ok('Escritorio: pinchar un cable (vista superior, sobre agujeros) lo selecciona y Supr/Retroceso lo borran', r.selA.s === 'wA' && !r.selA.wiring && r.left === 'wB' && r.left2 === 0, JSON.stringify(r)); }
{ const mctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  { const _cfg = leerConfig(); await mctx.addInitScript(([key, val]) => { localStorage.setItem(key, val); }, ['portal.acceso', JSON.stringify({ version: _cfg.version, hash: hashCodigo(codigoClase(), _cfg.salt) })]); }
  const mp = await mctx.newPage(); mp.on('pageerror', e => errs.push('móvil pageerror: ' + e.message));
  await mp.goto(base + '#asig/eee/laboratorio'); await mp.waitForTimeout(1500);
  const r = await wireCase(mp, true);
  await mp.screenshot({ path: SHOTS + 'circ_movil_borrar_cable.png' });
  ok('Móvil (con la barra de la asignatura): tocar un cable fino lo selecciona y «Borrar cable» (visible) lo borra', r.selA.s === 'wA' && !r.selA.wiring && r.btnVisible && r.left === 'wB' && r.left2 === 0, JSON.stringify(r));
  await mctx.close(); }
ok('Sin errores en consola', errs.length === 0, errs.slice(0, 5).join(' | '));
console.log(`\n${results.filter(r => r.ok).length}/${results.length} comprobaciones OK`);
await b.close();
