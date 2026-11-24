// Bloque 4 · «Código de colores» en pantalla: dibujo propio del componente (SVG), tabla de colores siempre
// visible que se ilumina al pasar el dedo o el ratón por una banda (fila de su color + columna que le toca),
// respuesta «leer» (valor + unidad + tolerancia [+ tensión]) o «pintar» (paleta por banda) y corrección por
// partes. Sirve en exámenes, test, actividades interactivas y en la práctica libre de Circuitos 3D.
import { esc } from './util.js';
import { ic } from './ico.js';
import { CLASES, COLORES, HEX, columnasDe, textoCelda, tolerancias, tensiones, partesLeer, bandasOk, textoValor, calcular, colorNormal, fmtPct, aleatorios } from '../lms/colores.js';

const claro = (c) => ['Blanco', 'Amarillo', 'Plata', 'Oro', 'Naranja'].includes(c);
// Dibujo del componente. B: lista de colores (o null en las bandas sin pintar). pintar: bandas pulsables.
export function svgComponente(clase, B, { pintar = false, idp = '' } = {}) {
  const n = B.length; const cols = columnasDe(clase, n);
  const lab = (j) => cols[j][1].replace(' cifra', '').replace('Multiplicador', '×').replace('Tolerancia', '±').replace('Tensión', 'V');
  const banda = (j, x, y, w, h, extra = '') => { const c = B[j]; const fill = c ? HEX[c] : `url(#ccR${idp})`;
    return `<g class="cc-b${c ? '' : ' vacia'}" data-banda="${j}" data-col="${esc(c || '')}" ${pintar ? `tabindex="0" role="button" aria-label="Banda ${j + 1} (${esc(cols[j][1])}): ${esc(c || 'sin pintar')}"` : `aria-label="Banda ${j + 1}: ${esc(c || '')}"`}>
      <rect x="${x - 6}" y="${y - 8}" width="${w + 12}" height="${h + 16}" fill="transparent"/><rect class="cc-bf" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="${c && claro(c) ? '#9a8b6a' : 'rgba(0,0,0,.35)'}" stroke-width="1"${extra}/></g>`; };
  const etq = (j, x, y) => `<text class="cc-lab" x="${x}" y="${y}" text-anchor="middle">${esc(lab(j))}</text>`;
  const defs = `<defs><pattern id="ccR${idp}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#eef1f4"/><rect width="3" height="8" fill="#c5ced8"/></pattern>
    <linearGradient id="ccG${idp}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`;
  if (clase === 'condensador') {
    // condensador de poliéster «tubular» de pie: cuerpo redondeado con las bandas horizontales y dos patas abajo
    let h = `<svg class="cc-svg" viewBox="0 0 300 300" role="img" aria-label="${esc(CLASES[clase].nombre)}">${defs}
      <line x1="125" y1="230" x2="125" y2="296" stroke="#9aa3ad" stroke-width="5" stroke-linecap="round"/><line x1="175" y1="230" x2="175" y2="296" stroke="#9aa3ad" stroke-width="5" stroke-linecap="round"/>
      <rect x="90" y="14" width="120" height="226" rx="46" fill="#E4D9BD" stroke="#7d7360" stroke-width="2"/>`;
    const y0 = 40, paso = 34, alto = 22; for (let j = 0; j < n; j++) { h += banda(j, 91, y0 + j * paso, 118, alto); h += `<text class="cc-lab" x="226" y="${y0 + j * paso + 16}">${esc(lab(j))}</text>`; }
    return h + `<rect x="90" y="14" width="120" height="226" rx="46" fill="url(#ccG${idp})" pointer-events="none"/></svg>`;
  }
  const ind = clase === 'inductor';
  const body = ind ? '#86BB93' : '#E9D7A8'; const borde = ind ? '#4f7a5a' : '#8a7550';
  let h = `<svg class="cc-svg" viewBox="0 0 440 150" role="img" aria-label="${esc(CLASES[clase].nombre)}">${defs}
    <line x1="4" y1="64" x2="436" y2="64" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/>`;
  h += ind ? `<rect x="92" y="22" width="256" height="84" rx="40" fill="${body}" stroke="${borde}" stroke-width="2"/>`
    : `<path d="M110 26 q-26 0 -26 38 q0 38 26 38 h12 q14 -10 30 -10 h136 q16 0 30 10 h12 q26 0 26 -38 q0 -38 -26 -38 h-12 q-14 10 -30 10 h-136 q-16 0 -30 -10 z" fill="${body}" stroke="${borde}" stroke-width="2"/>`;
  // posiciones: las cifras juntas, el multiplicador y la tolerancia algo separados
  const X = n === 5 ? [118, 152, 186, 220, 300] : n === 4 ? [128, 168, 208, 300] : [128, 168, 208];
  const top = ind ? 22 : 36, alto = ind ? 84 : 56;
  for (let j = 0; j < n; j++) {
    const x = X[j]; const enCuello = !ind && x > 140 && x < 290; const y = j === 0 && !ind ? 27 : enCuello ? top : 27; const hh = j === 0 && !ind ? 74 : enCuello ? alto : 74;
    h += banda(j, x, ind ? top : y, 22, ind ? alto : hh); h += etq(j, x + 11, 136);
  }
  h += ind ? `<rect x="92" y="22" width="256" height="84" rx="40" fill="url(#ccG${idp})" pointer-events="none"/>` : `<path d="M110 26 q-26 0 -26 38 q0 38 26 38 h12 q14 -10 30 -10 h136 q16 0 30 10 h12 q26 0 26 -38 q0 -38 -26 -38 h-12 q-14 10 -30 10 h-136 q-16 0 -30 -10 z" fill="url(#ccG${idp})" pointer-events="none"/>`;
  return h + '</svg>';
}
// Tabla de colores de la clase. Solo las filas de colores con algún valor.
export function tablaHTML(clase, n) {
  const cols = columnasDe(clase, n);
  const filas = COLORES.filter((c) => cols.some(([, , T]) => T[c] != null));
  return `<div class="cc-tw"><table class="cc-t"><caption>${esc(CLASES[clase].nombre)}${CLASES[clase].sinTol != null ? ` · sin banda de tolerancia: ${fmtPct(CLASES[clase].sinTol)}` : ''}${clase === 'condensador' ? ' · valor en pF' : clase === 'inductor' ? ' · valor en µH' : ''}</caption>
    <thead><tr><th scope="col">Color</th>${cols.map(([id, t], j) => `<th scope="col" data-c="${j}">${esc(t)}</th>`).join('')}</tr></thead>
    <tbody>${filas.map((c) => `<tr data-f="${esc(c)}"><th scope="row"><i class="cc-sw" style="background:${HEX[c]}"></i>${esc(c)}</th>${cols.map(([id, , T], j) => `<td data-c="${j}">${esc(textoCelda(id, T[c]))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
let nId = 0;
// Cuerpo de una pregunta «colores» (q: forma pública). r: respuesta guardada.
export function coloresHTML(q, r) {
  const clase = q.clase; const K = CLASES[clase]; if (!K) return '<p class="au-small">Componente desconocido.</p>';
  const pintar = q.modo === 'pintar'; const n = pintar ? q.n || K.columnas.length : (q.bandas || []).length;
  const B = pintar ? Array.from({ length: n }, (_, j) => colorNormal((r?.b || [])[j]) || null) : q.bandas;
  const idp = 'c' + (++nId);
  const sel = (dc, L, v, fmt, lbl) => `<label class="cc-f"><span>${lbl}</span><select data-cc="${dc}"><option value="">—</option>${L.map((x) => `<option value="${x}" ${String(v ?? '') === String(x) ? 'selected' : ''}>${esc(fmt(x))}</option>`).join('')}</select></label>`;
  const resp = pintar
    ? `<div class="cc-dato">${ic('target')} Pinta las bandas de: <b>${esc(q.valor || '')}</b></div><input type="hidden" data-cc="b" value="${esc(JSON.stringify(B.map((x) => x || '')))}"><div class="cc-paleta" hidden></div><p class="au-small cc-ayuda">Toca cada banda y elige su color en la paleta.</p>`
    : `<div class="cc-resp"><label class="cc-f cc-fv"><span>Valor</span><input type="text" inputmode="decimal" data-cc="v" maxlength="20" value="${esc(r?.v ?? '')}" placeholder="p. ej. 4,7" aria-label="Valor"></label>
        <label class="cc-f"><span>Unidad</span><select data-cc="u">${K.unidades.map((u) => `<option ${(r?.u || K.unidades[0]) === u ? 'selected' : ''}>${u}</option>`).join('')}</select></label>
        ${sel('t', tolerancias(clase), r?.t, fmtPct, 'Tolerancia')}${tensiones(clase).length ? sel('te', tensiones(clase), r?.te, (x) => x + ' V', 'Tensión') : ''}</div>`;
  return `<div class="cc" data-cc-raiz data-clase="${esc(clase)}" data-modo="${pintar ? 'pintar' : 'leer'}"><div class="cc-comp">${svgComponente(clase, B, { pintar, idp })}</div>${tablaHTML(clase, n)}${resp}</div>`;
}
export function leerColores(fs) {
  const c = fs.querySelector('[data-cc-raiz]'); if (!c) return undefined;
  if (c.dataset.modo === 'pintar') { let b = []; try { b = JSON.parse(c.querySelector('[data-cc=b]').value || '[]'); } catch (e) { } return b.some(Boolean) ? { b } : undefined; }
  const g = (k) => c.querySelector(`[data-cc=${k}]`)?.value || '';
  const v = g('v').trim().slice(0, 20); const t = g('t'); const te = g('te');
  if (!v && !t && !te) return undefined;
  return { v, u: g('u'), t, ...(c.querySelector('[data-cc=te]') ? { te } : {}) };
}
function iluminar(c, j, color, fijo = false) {
  c.querySelectorAll('.cc-on, .cc-fila, .cc-col').forEach((x) => x.classList.remove('cc-on', 'cc-fila', 'cc-col'));
  if (j == null) return;
  c.querySelectorAll(`.cc-t [data-c="${j}"]`).forEach((x) => x.classList.add('cc-col'));
  if (color) { const tr = c.querySelector(`.cc-t tr[data-f="${CSS.escape(color)}"]`); tr?.classList.add('cc-fila'); const td = tr?.querySelector(`td[data-c="${j}"]`); td?.classList.add('cc-on'); const tw = td?.closest('.cc-tw'); if (tw && td) { const L = td.offsetLeft, R = L + td.offsetWidth; if (L < tw.scrollLeft || R > tw.scrollLeft + tw.clientWidth) tw.scrollLeft = Math.max(0, L - tw.clientWidth / 3); } }
  c.querySelector(`.cc-b[data-banda="${j}"]`)?.classList.add('cc-on');
  c.dataset.fijo = fijo ? j : '';
}
function abrirPaleta(c, j) {
  const cols = columnasDe(c.dataset.clase, c.querySelectorAll('.cc-b').length); const [, tit, T] = cols[j];
  const pal = c.querySelector('.cc-paleta'); pal.hidden = false; pal.dataset.banda = j;
  pal.innerHTML = `<div class="cc-pal-h">Banda ${j + 1} · <b>${esc(tit)}</b></div><div class="cc-pal-g">${COLORES.filter((x) => T[x] != null).map((x) => `<button type="button" class="cc-pc" data-pinta="${esc(x)}"><i class="cc-sw" style="background:${HEX[x]}"></i>${esc(x)}</button>`).join('')}</div>`;
  iluminar(c, j, c.querySelector(`.cc-b[data-banda="${j}"]`)?.dataset.col || null, true);
  pal.querySelector('.cc-pc')?.focus({ preventScroll: true });
}
function pintarBanda(c, j, color) {
  const g = c.querySelector(`.cc-b[data-banda="${j}"]`); if (!g) return;
  g.dataset.col = color; g.classList.remove('vacia'); const r = g.querySelector('.cc-bf'); r.setAttribute('fill', HEX[color]); r.setAttribute('stroke', claro(color) ? '#9a8b6a' : 'rgba(0,0,0,.35)');
  g.setAttribute('aria-label', g.getAttribute('aria-label').replace(/: [^:]*$/, ': ' + color));
  const h = c.querySelector('[data-cc=b]'); let b = []; try { b = JSON.parse(h.value || '[]'); } catch (e) { } b[j] = color; h.value = JSON.stringify(b);
}
// Interacción (una vez por raíz): iluminar la tabla y pintar las bandas
export function enlazarColores(raiz, alCambiar) {
  if (raiz.dataset.ccOk) return; raiz.dataset.ccOk = '1';
  raiz.addEventListener('pointerover', (e) => { const b = e.target.closest?.('.cc-b'); const c = b?.closest('[data-cc-raiz]'); if (!c || c.dataset.fijo) return; iluminar(c, +b.dataset.banda, b.dataset.col || null); });
  raiz.addEventListener('pointerout', (e) => { const b = e.target.closest?.('.cc-b'); const c = b?.closest('[data-cc-raiz]'); if (!c || c.dataset.fijo || (e.relatedTarget && b.contains(e.relatedTarget))) return; iluminar(c, null); });
  raiz.addEventListener('focusin', (e) => { const b = e.target.closest?.('.cc-b'); const c = b?.closest('[data-cc-raiz]'); if (c && !c.dataset.fijo) iluminar(c, +b.dataset.banda, b.dataset.col || null); });
  const pulsar = (b) => { const c = b.closest('[data-cc-raiz]'); if (!c || c.closest('fieldset')?.disabled) return; if (c.dataset.modo === 'pintar') abrirPaleta(c, +b.dataset.banda); else if (c.dataset.fijo === b.dataset.banda) iluminar(c, null); else iluminar(c, +b.dataset.banda, b.dataset.col || null, true); };
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest?.('.cc-b'); if (b) { pulsar(b); return; }
    const p = e.target.closest?.('[data-pinta]');
    if (p) { const c = p.closest('[data-cc-raiz]'); const pal = p.closest('.cc-paleta'); const j = +pal.dataset.banda; pintarBanda(c, j, p.dataset.pinta); alCambiar?.({ id: c.closest('fieldset')?.dataset.q });
      const n = c.querySelectorAll('.cc-b').length; const sig = [...c.querySelectorAll('.cc-b')].findIndex((g, k) => k > j && !g.dataset.col);
      if (sig >= 0) abrirPaleta(c, sig); else if (j + 1 < n) abrirPaleta(c, j + 1); else { pal.hidden = true; iluminar(c, null); } }
  });
  raiz.addEventListener('keydown', (e) => { const b = e.target.closest?.('.cc-b'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pulsar(b); } });
}
// Corrección por partes: verde lo bueno, rojo lo malo, y en la tabla las casillas que había que mirar
export function marcarColores(fs, q, k, r) {
  const c = fs.querySelector('[data-cc-raiz]'); const bandas = k?.bandas || q.bandas; if (!c || !Array.isArray(bandas)) return;
  const cols = columnasDe(q.clase, bandas.length); const sol = (pred) => cols.forEach(([id], j) => { if (pred(id)) c.querySelector(`.cc-t tr[data-f="${CSS.escape(bandas[j])}"] td[data-c="${j}"]`)?.classList.add('cc-sol'); });
  if (q.modo === 'pintar') {
    const ok = bandasOk(q.clase, bandas, r);
    ok.forEach((x, j) => { const g = c.querySelector(`.cc-b[data-banda="${j}"]`); g?.classList.add(x ? 'cc-ok' : 'cc-ko'); if (!x) sol((id) => id === cols[j][0]); });
    c.insertAdjacentHTML('beforeend', `<div class="cc-partes">${ok.map((x, j) => `<span class="cc-parte ${x ? 'ok' : 'ko'}">${ic(x ? 'check' : 'x')} Banda ${j + 1}${x ? '' : `: era ${esc(bandas[j])}`}</span>`).join('')}</div>`);
    return;
  }
  const P = partesLeer(q.clase, bandas, r); const E = { cifras: ['v'], valor: ['v', 'u'], tol: ['t'], ten: ['te'] };
  P.forEach((p) => { (E[p.id] || []).forEach((dc) => { const el = c.querySelector(`[data-cc=${dc}]`); if (el && !el.classList.contains('cc-ko')) { el.classList.remove('cc-ok'); el.classList.add(p.ok ? 'cc-ok' : 'cc-ko'); } });
    if (!p.ok) sol((id) => (p.id === 'cifras' ? id.startsWith('c') : p.id === 'valor' ? id.startsWith('c') || id === 'mult' : id === p.id)); });
  c.insertAdjacentHTML('beforeend', `<div class="cc-partes">${P.map((p) => `<span class="cc-parte ${p.ok ? 'ok' : 'ko'}">${ic(p.ok ? 'check' : 'x')} ${esc(p.nombre)}</span>`).join('')}</div>`);
}
export const solucionColores = (q, k) => { const b = k?.bandas || q.bandas || []; return b.length && CLASES[q.clase] ? `${b.join(' – ')} = ${textoValor(q.clase, b)}` : ''; };
export const respuestaColores = (q, v) => (v?.b ? v.b.map((x) => x || '—').join(' – ') : `${v?.v || '—'} ${v?.u || ''}${v?.t ? ' ' + fmtPct(v.t) : ''}${v?.te ? ' · ' + v.te + ' V' : ''}`.trim());

// ---- Práctica libre (Circuitos 3D · «Código de colores»): aleatoria, sin nota y sin guardar nada
const NOMBRE_CLASE = { resistencia4: 'Resistencia 4 bandas', resistencia5: 'Resistencia 5 bandas', condensador: 'Condensador', inductor: 'Inductor' };
export function montarPracticaColores(nodo, { clases = Object.keys(CLASES) } = {}) {
  const S = { clase: clases[0], modo: 'leer', n: 0, bien: 0, hechos: 0, fin: false, q: null };
  function nuevo() {
    const comp = aleatorios(S.clase, 1, (Date.now() ^ (++S.n * 2654435761)) >>> 0)[0];
    S.q = S.modo === 'pintar' ? { id: 'cc', tipo: 'colores', clase: S.clase, modo: 'pintar', n: comp.bandas.length, valor: textoValor(S.clase, comp.bandas) } : { id: 'cc', tipo: 'colores', clase: S.clase, modo: 'leer', bandas: comp.bandas };
    S.k = { bandas: comp.bandas }; S.fin = false; pintar();
  }
  function pintar() {
    nodo.innerHTML = `<div class="ccp">
      <div class="ccp-cab"><div class="ccp-pills" role="tablist">${clases.map((c) => `<button type="button" class="ccp-pill ${S.clase === c ? 'on' : ''}" data-ccp-clase="${c}" role="tab" aria-selected="${S.clase === c}">${esc(NOMBRE_CLASE[c])}</button>`).join('')}</div>
        <div class="ccp-pills ccp-modo">${[['leer', 'Leer', 'eye'], ['pintar', 'Pintar', 'palette']].map(([m, t, i]) => `<button type="button" class="ccp-pill ${S.modo === m ? 'on' : ''}" data-ccp-modo="${m}">${ic(i)} ${t}</button>`).join('')}</div>
        <div class="ccp-marcador" aria-live="polite"><b>${S.bien}</b><span>de ${S.hechos} bien</span></div></div>
      <fieldset class="au-q ccp-q" data-q="cc"><legend>${S.modo === 'pintar' ? 'Pinta las bandas del componente' : '¿Qué valor tiene este componente?'}</legend>${coloresHTML(S.q)}</fieldset>
      <div class="pn-acts ccp-acts">${S.fin ? `<button type="button" class="btn primary" data-ccp="otro">${ic('shuffle')} Otro componente</button>` : `<button type="button" class="btn primary" data-ccp="comprobar">${ic('check')} Comprobar</button><button type="button" class="btn" data-ccp="otro">${ic('shuffle')} Otro</button>`}</div>
      <p class="au-small">Práctica libre: no tiene nota y no se guarda nada.</p></div>`;
  }
  nodo.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ccp], [data-ccp-clase], [data-ccp-modo]'); if (!b) return;
    if (b.dataset.ccpClase) { S.clase = b.dataset.ccpClase; return nuevo(); }
    if (b.dataset.ccpModo) { S.modo = b.dataset.ccpModo; return nuevo(); }
    if (b.dataset.ccp === 'otro') return nuevo();
    if (b.dataset.ccp === 'comprobar') {
      const fs = nodo.querySelector('fieldset'); const r = leerColores(fs);
      if (!r) { const m = nodo.querySelector('.ccp-acts'); if (!m.querySelector('.au-msg')) m.insertAdjacentHTML('beforeend', '<span class="au-msg ko">Responde primero.</span>'); return; }
      const L = S.q.modo === 'pintar' ? bandasOk(S.clase, S.k.bandas, r) : partesLeer(S.clase, S.k.bandas, r).map((p) => p.ok);
      S.hechos++; if (L.every(Boolean)) S.bien++; S.fin = true;
      const f3 = fs; f3.disabled = true; marcarColores(f3, S.q, S.k, r);
      nodo.querySelector('.ccp-marcador').innerHTML = `<b>${S.bien}</b><span>de ${S.hechos} bien</span>`;
      nodo.querySelector('.ccp-acts').innerHTML = `<button type="button" class="btn primary" data-ccp="otro">${ic('shuffle')} Otro componente</button>`;
      f3.insertAdjacentHTML('beforeend', `<div class="ia-fb ${L.every(Boolean) ? 'ok' : L.some(Boolean) ? 'med' : 'ko'}">${ic(L.every(Boolean) ? 'circle-check' : 'circle-x')} ${L.every(Boolean) ? '¡Correcto!' : `${L.filter(Boolean).length} de ${L.length} bien`} · ${esc(solucionColores(S.q, S.k))}</div>`);
    }
  });
  enlazarColores(nodo, () => { });
  nuevo();
  return { destruir() { nodo.innerHTML = ''; } };
}
export { calcular };
