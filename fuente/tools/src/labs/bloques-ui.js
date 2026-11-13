// Retos por bloques: Blockly (vendor/blockly, se carga al abrir) con bloques propios en castellano y un
// robot en una cuadrícula. El programa se traduce a una lista de órdenes y se ejecuta paso a paso.
import { ic } from '../ui/iconos.js';
import { ejecutar, inicio, superado, BLOQUES } from '../lms/motores/bloques.js';
import { esc, leerJSON, guardar, cajaEntrega, cargarScript } from './comun.js';

let definidos = false;
function definirBloques(B) {
  if (definidos) return; definidos = true;
  B.defineBlocksWithJsonArray([
    { type: 'rb_inicio', message0: 'al empezar', nextStatement: null, colour: 45, tooltip: 'El programa empieza aquí', deletable: false },
    { type: 'rb_avanzar', message0: 'avanzar', previousStatement: null, nextStatement: null, colour: 210, tooltip: 'Avanza una casilla' },
    { type: 'rb_girar', message0: 'girar a la %1', args0: [{ type: 'field_dropdown', name: 'LADO', options: [['izquierda', 'izq'], ['derecha', 'der']] }], previousStatement: null, nextStatement: null, colour: 260 },
    { type: 'rb_repetir', message0: 'repetir %1 veces', args0: [{ type: 'field_number', name: 'N', value: 2, min: 1, max: 20, precision: 1 }], message1: 'hacer %1', args1: [{ type: 'input_statement', name: 'CUERPO' }], previousStatement: null, nextStatement: null, colour: 120 },
    { type: 'rb_mientras', message0: 'repetir hasta la meta', message1: 'hacer %1', args1: [{ type: 'input_statement', name: 'CUERPO' }], previousStatement: null, nextStatement: null, colour: 120 },
    { type: 'rb_si', message0: 'si hay camino %1', args0: [{ type: 'field_dropdown', name: 'DIR', options: [['delante', 'delante'], ['a la izquierda', 'izq'], ['a la derecha', 'der']] }], message1: 'hacer %1', args1: [{ type: 'input_statement', name: 'CUERPO' }], message2: 'si no %1', args2: [{ type: 'input_statement', name: 'SINO' }], previousStatement: null, nextStatement: null, colour: 20 },
  ]);
}
const TIPO = { avanzar: 'rb_avanzar', girar: 'rb_girar', repetir: 'rb_repetir', mientras: 'rb_mientras', si: 'rb_si' };
function aPrograma(b) {
  const L = [];
  while (b) {
    const t = b.type; const hijos = (n) => aPrograma(b.getInputTargetBlock(n));
    if (t === 'rb_avanzar') L.push({ op: 'avanzar' });
    else if (t === 'rb_girar') L.push({ op: 'girar', lado: b.getFieldValue('LADO') });
    else if (t === 'rb_repetir') L.push({ op: 'repetir', n: Number(b.getFieldValue('N')) || 0, cuerpo: hijos('CUERPO') });
    else if (t === 'rb_mientras') L.push({ op: 'mientras', cuerpo: hijos('CUERPO') });
    else if (t === 'rb_si') L.push({ op: 'si', dir: b.getFieldValue('DIR'), cuerpo: hijos('CUERPO'), sino: hijos('SINO') });
    b = b.getNextBlock();
  }
  return L;
}
const ROT = { N: 0, E: 90, S: 180, O: 270 };
function mapaSVG(nivel, r) {
  const H = nivel.mapa.length, W = nivel.mapa[0].length;
  return `<svg viewBox="0 0 ${W} ${H}" class="bl-svg" role="img" aria-label="Mapa: robot en la fila ${r.y + 1}, columna ${r.x + 1}">${nivel.mapa.map((f, y) => [...f].map((c, x) => `<rect x="${x}" y="${y}" width="1" height="1" class="${c === '#' ? 'muro' : c === 'G' ? 'meta' : 'suelo'}"/>`).join('')).join('')}
    ${(() => { const g = nivel.mapa.findIndex((f) => f.includes('G')); const gx = nivel.mapa[g].indexOf('G'); return `<circle cx="${gx + 0.5}" cy="${g + 0.5}" r="0.28" class="meta-c"/>`; })()}
    <g class="robot${r.choque ? ' choque' : ''}" transform="translate(${r.x + 0.5} ${r.y + 0.5}) rotate(${ROT[r.d]})"><circle r="0.36"/><path d="M0 -0.3 L0.22 0.12 L-0.22 0.12 Z"/></g></svg>`;
}
export function montarBloques(nodo, contenido, ctx = {}) {
  const N = contenido.niveles; const clave = ctx.clave || 'bloqueslab'; const est = { i: 0, ok: leerJSON(clave + ':ok', {}), anim: 0, ws: null };
  nodo.classList.add('bll');
  nodo.innerHTML = `${N.length > 1 ? '<nav class="p5-retos" aria-label="Niveles" data-b-nav></nav>' : ''}<div class="bl-grid"><section class="p5-izq"><div data-b="enun"></div><div class="bl-ws" data-b="ws"><p class="muted">Cargando los bloques…</p></div>
    <div class="p5-bot"><button type="button" class="btn" data-ba="ejecutar">${ic('play')} Ejecutar</button><button type="button" class="btn sec" data-ba="reiniciar">${ic('rotate-ccw')} Volver a empezar</button></div></section>
    <section class="p5-der"><div data-b="mapa"></div><div class="p5-res" data-b="res" aria-live="polite"></div><div data-b="ent"></div></section></div>`;
  const $ = (s) => nodo.querySelector(s);
  const aciertos = () => N.filter((n) => est.ok[n.id]).length;
  let ultimo = {};
  const ent = cajaEntrega($('[data-b=ent]'), ctx, () => ({ a: aciertos(), t: N.length, texto: `${ctx.titulo || 'Retos por bloques'}. Aciertos: ${aciertos()}/${N.length}\n\n${N.map((n, i) => `Nivel ${i + 1}: ${n.titulo} (${est.ok[n.id] ? 'superado' : 'sin superar'})${ultimo[n.id] ? ` · ${ultimo[n.id]} bloques` : ''}`).join('\n')}` }));
  function pintarNav() { const n = $('[data-b-nav]'); if (n) n.innerHTML = N.map((x, i) => `<button type="button" class="p5-rt${i === est.i ? ' on' : ''}" data-br="${i}" ${i === est.i ? 'aria-current="step"' : ''}>${ic(est.ok[x.id] ? 'circle-check' : 'circle-dot')} ${i + 1}. ${esc(x.titulo)}</button>`).join(''); }
  function toolbox(n) { return { kind: 'flyoutToolbox', contents: n.bloques.map((b) => ({ kind: 'block', type: TIPO[b] })) }; }
  function guardarWS() { if (!est.ws) return; try { guardar(`${clave}:${N[est.i].id}`, JSON.stringify(window.Blockly.serialization.workspaces.save(est.ws))); } catch (e) { /* nada */ } }
  async function pintarNivel() {
    const n = N[est.i]; cancelAnimationFrame(est.anim); clearTimeout(est.anim);
    $('[data-b=enun]').innerHTML = `<h2 class="p5-tit">${esc(n.titulo)}</h2>${n.enunciado ? `<p>${esc(n.enunciado)}</p>` : ''}<p class="muted">Bloques: ${n.bloques.map((b) => esc(BLOQUES[b])).join(' · ')}${n.maxBloques ? ` · máximo ${n.maxBloques} bloques` : ''}</p>`;
    $('[data-b=mapa]').innerHTML = mapaSVG(n, inicio(n)); $('[data-b=res]').innerHTML = ''; pintarNav();
    try { await cargarScript('vendor/blockly/blockly_compressed.js?v=11.2.2'); await cargarScript('vendor/blockly/msg/es.js?v=11.2.2'); }
    catch (e) { $('[data-b=ws]').innerHTML = `<p class="p5-veredicto mal">${ic('circle-x')} No se han podido cargar los bloques. Revisa la conexión y recarga.</p>`; return; }
    const B = window.Blockly; definirBloques(B);
    if (est.ws) { guardarWS(); est.ws.dispose(); }
    const caja = $('[data-b=ws]'); caja.innerHTML = '';
    est.ws = B.inject(caja, { toolbox: toolbox(n), trashcan: true, sounds: false, media: new URL('vendor/blockly/media/', document.baseURI).href, renderer: 'zelos', zoom: { controls: true, startScale: 0.8 }, move: { scrollbars: true, drag: true, wheel: true } });
    const prev = leerJSON(`${clave}:${n.id}`, null);
    if (prev) { try { B.serialization.workspaces.load(prev, est.ws); } catch (e) { /* nada */ } }
    if (!est.ws.getBlocksByType('rb_inicio').length) { const b = est.ws.newBlock('rb_inicio'); b.initSvg(); b.render(); b.moveBy(20, 20); }
    est.ws.addChangeListener((e) => { if (!e.isUiEvent) guardarWS(); });
  }
  function correr() {
    const n = N[est.i]; if (!est.ws) return; const ini = est.ws.getBlocksByType('rb_inicio')[0];
    const prog = aPrograma(ini?.getNextBlock() || null); const res = ejecutar(n, prog); ultimo[n.id] = res.bloques;
    clearTimeout(est.anim); let k = 0; const box = $('[data-b=res]'); box.innerHTML = `<p class="muted">${ic('play')} Ejecutando…</p>`;
    const paso = () => {
      $('[data-b=mapa]').innerHTML = mapaSVG(n, res.pasos[k]);
      if (++k < res.pasos.length) { est.anim = setTimeout(paso, 280); return; }
      const ok = superado(n, res); if (ok) { est.ok[n.id] = true; guardar(clave + ':ok', JSON.stringify(est.ok)); }
      box.innerHTML = ok ? `<div class="p5-veredicto ok">${ic('circle-check')} ¡Nivel superado! (${res.bloques} bloques)</div>`
        : `<div class="p5-veredicto mal">${ic('circle-x')} ${esc(res.error || (res.meta ? `Llegas, pero con ${res.bloques} bloques: el máximo es ${n.maxBloques}.` : prog.length ? 'El robot no ha llegado a la meta.' : 'Engancha bloques debajo de «al empezar».'))}</div>`;
      pintarNav(); ent.pintar();
    };
    paso();
  }
  nodo.addEventListener('click', (e) => {
    const r = e.target.closest('[data-br]'); if (r) { guardarWS(); est.i = Number(r.dataset.br); return pintarNivel(); }
    const b = e.target.closest('[data-ba]'); if (!b) return;
    if (b.dataset.ba === 'ejecutar') correr();
    else { clearTimeout(est.anim); const n = N[est.i]; $('[data-b=mapa]').innerHTML = mapaSVG(n, inicio(n)); $('[data-b=res]').innerHTML = ''; }
  });
  pintarNivel();
  return { destruir() { clearTimeout(est.anim); guardarWS(); est.ws?.dispose(); est.ws = null; }, actualizar: (o) => ent.actualizar(o), correr, ws: () => est.ws };
}
