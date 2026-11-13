// Fase 13 · Hoja de cálculo del alumno (editor para entrega-ui) y su vista de solo lectura (corrección, imprimir).
// Fórmulas en castellano (lms/hoja.js), gráfico de barras o líneas en SVG, tabla dinámica sencilla y retos que se
// comprueban solos. Se guarda en trabajos/{id}.doc como JSON { v: 1, c: { A1: … }, g: gráfico, p: tabla dinámica }.
import { esc } from './util.js';
import { ic } from './ico.js';
import { crearHoja, nombreCelda, letra, mostrar, comprobarReto, tablaDinamica, datosGrafico, csvHoja, parteCelda } from '../lms/hoja.js';

export function leerDocHoja(doc, c = {}) {
  try { const o = JSON.parse(doc || 'null'); if (o && o.v === 1 && o.c) return { c: o.c, g: o.g || null, p: o.p || null }; } catch (e) { /* no es una hoja */ }
  return { c: { ...(c.celdas || {}) }, g: null, p: null };
}
const COLORES = ['#007aff', '#34c759', '#ff9500', '#af52de', '#ff3b30', '#5ac8fa'];
export function graficoSVG(d, tipo = 'barras') {
  if (!d || !d.etiquetas.length || !d.series.length) return '<p class="au-small">Sin datos para el gráfico.</p>';
  const W = 560, Hh = 260, m = { l: 48, r: 12, t: 12, b: 46 }; const iw = W - m.l - m.r, ih = Hh - m.t - m.b;
  const todos = d.series.flatMap((s) => s.valores); const max = Math.max(0, ...todos), min = Math.min(0, ...todos); const rango = max - min || 1;
  const y = (v) => m.t + ih - ((v - min) / rango) * ih; const n = d.etiquetas.length; const bw = iw / n;
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = min + (rango * k) / 4; g += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" class="hj-gl"/><text x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end" class="hj-gt">${esc(mostrar(Math.round(v * 100) / 100))}</text>`; }
  d.etiquetas.forEach((e, i) => { g += `<text x="${m.l + bw * i + bw / 2}" y="${Hh - m.b + 16}" text-anchor="middle" class="hj-gt">${esc(String(e).slice(0, 14))}</text>`; });
  d.series.forEach((s, j) => {
    const col = COLORES[j % COLORES.length];
    if (tipo === 'lineas') g += `<polyline fill="none" stroke="${col}" stroke-width="2.5" points="${s.valores.map((v, i) => `${m.l + bw * i + bw / 2},${y(v)}`).join(' ')}"/>${s.valores.map((v, i) => `<circle cx="${m.l + bw * i + bw / 2}" cy="${y(v)}" r="3.5" fill="${col}"><title>${esc(s.nombre)}: ${esc(mostrar(v))}</title></circle>`).join('')}`;
    else { const w = (bw * 0.75) / d.series.length; s.valores.forEach((v, i) => { const x = m.l + bw * i + bw * 0.125 + w * j; g += `<rect class="hj-bar" x="${x}" y="${Math.min(y(v), y(0))}" width="${Math.max(1, w - 2)}" height="${Math.abs(y(v) - y(0))}" rx="3" fill="${col}"><title>${esc(d.etiquetas[i])} · ${esc(s.nombre)}: ${esc(mostrar(v))}</title></rect>`; }); }
  });
  const ley = d.series.map((s, j) => `<span><i style="background:${COLORES[j % COLORES.length]}"></i>${esc(s.nombre)}</span>`).join('');
  return `<svg class="hj-svg" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Gráfico de ${tipo === 'lineas' ? 'líneas' : 'barras'}">${g}</svg><div class="hj-ley">${ley}</div>`;
}
function pivotHTML(H, p) {
  if (!p) return ''; let t; try { t = tablaDinamica(H, p); } catch (e) { return '<p class="au-small">El rango de la tabla dinámica no es válido.</p>'; }
  if (!t.filas.length) return '<p class="au-small">No hay datos: revisa el rango (con los títulos en la 1.ª fila) y los campos.</p>';
  return `<table class="hj-piv"><thead><tr><th>${esc(t.cab[0])}</th><th>${esc(t.cab[1])}</th></tr></thead><tbody>${t.filas.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="n">${esc(mostrar(v))}</td></tr>`).join('')}</tbody><tfoot><tr><th>Total</th><th class="n">${esc(mostrar(t.total))}</th></tr></tfoot></table>`;
}
function graficoDe(H, g) { if (!g) return ''; try { return graficoSVG(datosGrafico(H, g.rango), g.tipo); } catch (e) { return '<p class="au-small">El rango del gráfico no es válido.</p>'; } }
const retosHTML = (H, retos) => (retos?.length ? `<ol class="hj-retos">${retos.map((r) => { const okk = comprobarReto(H, r); return `<li class="${okk ? 'ok' : ''}">${ic(okk ? 'circle-check' : 'circle-dashed')} <span>${esc(r.texto)}</span></li>`; }).join('')}</ol>` : '');
export function resumenHoja(H, retos) { const n = Object.keys(H.celdas).length; if (!retos?.length) return `Hoja de cálculo · ${n} celda${n === 1 ? '' : 's'} con datos`; const a = retos.filter((r) => comprobarReto(H, r)).length; return `Hoja de cálculo · Retos superados · Aciertos: ${a}/${retos.length}`; }
// Vista de solo lectura (profesor al corregir, imprimir)
export function hojaLecturaHTML(it, doc) {
  const c = it.contenido || {}; const d = leerDocHoja(doc, c); const H = crearHoja(d.c);
  let mf = 0, mc = 0; for (const k of Object.keys(d.c)) { const p = parteCelda(k); if (p) { mf = Math.max(mf, p.f + 1); mc = Math.max(mc, p.c + 1); } }
  mf = Math.max(mf, 3); mc = Math.max(mc, 3);
  let h = `<div class="hj-scroll ro"><table class="hj-t hj-ro"><thead><tr><th></th>${Array.from({ length: mc }, (_, j) => `<th>${letra(j)}</th>`).join('')}</tr></thead><tbody>`;
  for (let f = 0; f < mf; f++) h += `<tr><th>${f + 1}</th>${Array.from({ length: mc }, (_, j) => { const r = nombreCelda(f, j); const raw = d.c[r]; const fx = typeof raw === 'string' && raw.startsWith('='); const v = H.valor(r); return `<td class="${typeof v === 'number' ? 'n' : ''}${fx ? ' fx' : ''}" ${fx ? `title="${esc(raw)}"` : ''}>${esc(mostrar(v))}</td>`; }).join('')}</tr>`;
  h += '</tbody></table></div>';
  const fx = Object.entries(d.c).filter(([, v]) => String(v).startsWith('='));
  if (fx.length) h += `<details class="hj-fxl"><summary>${ic('sheet')} Fórmulas (${fx.length})</summary><ul>${fx.map(([k, v]) => `<li><b>${esc(k)}</b> <code>${esc(v)}</code></li>`).join('')}</ul></details>`;
  h += retosHTML(H, c.retos) + (d.g ? `<div class="hj-graf">${graficoDe(H, d.g)}</div>` : '') + (d.p ? `<div class="hj-pivw">${pivotHTML(H, d.p)}</div>` : '');
  return `<div class="hj-lect">${h}</div>`;
}

export function crearEditorHoja(it) {
  const c = it.contenido || {}; const NF = c.filas || 30, NC = c.columnas || 10;
  let H = crearHoja(c.celdas || {}); let G = null, Pv = null; let sel = 'A1';
  const recargar = (v) => { const d = leerDocHoja(v.doc, c); H = crearHoja(d.c); G = d.g; Pv = d.p; };
  const celda = (f, r) => f.querySelector(`.hj-c[data-r="${r}"]`);
  function refrescar(f) {
    f.querySelectorAll('.hj-c').forEach((i) => { if (i !== document.activeElement) { const v = H.valor(i.dataset.r); i.value = mostrar(v); i.classList.toggle('n', typeof v === 'number'); i.classList.toggle('err', !!(v && v.err)); } });
    const rt = f.querySelector('.hj-retos-w'); if (rt) rt.innerHTML = retosHTML(H, c.retos);
    const gr = f.querySelector('.hj-graf'); if (gr) gr.innerHTML = graficoDe(H, G);
    const pv = f.querySelector('.hj-pivw'); if (pv) pv.innerHTML = pivotHTML(H, Pv);
  }
  const editor = {
    html(v, ro) {
      recargar(v);
      if (ro) return `<div class="hj-wrap">${hojaLecturaHTML(it, JSON.stringify({ v: 1, c: H.celdas, g: G, p: Pv }))}<div class="dc-pie"><span class="pn-grow"></span><button type="button" class="btn small" data-hj="csv">${ic('file-down')} Descargar CSV</button></div></div>`;
      let t = `<table class="hj-t"><thead><tr><th class="hj-esq"></th>${Array.from({ length: NC }, (_, j) => `<th>${letra(j)}</th>`).join('')}</tr></thead><tbody>`;
      for (let f = 0; f < NF; f++) t += `<tr><th>${f + 1}</th>${Array.from({ length: NC }, (_, j) => { const r = nombreCelda(f, j); const val = H.valor(r); return `<td><input class="hj-c${typeof val === 'number' ? ' n' : ''}${val && val.err ? ' err' : ''}" data-r="${r}" value="${esc(mostrar(val))}" aria-label="Celda ${r}" autocomplete="off" spellcheck="false"></td>`; }).join('')}</tr>`;
      t += '</tbody></table>';
      return `<div class="hj-wrap">
        <div class="hj-barra"><span class="hj-ref" aria-live="polite">${sel}</span><span class="hj-fxi">fx</span><input class="hj-fx" aria-label="Contenido de la celda" placeholder="Valor o fórmula: =SUMA(A1:A5)" autocomplete="off" spellcheck="false"></div>
        <div class="hj-scroll">${t}</div>
        ${c.retos?.length ? `<div class="hj-retos-w">${retosHTML(H, c.retos)}</div>` : ''}
        <div class="hj-herr">
          <details class="hj-det"><summary>${ic('chart-bar')} Gráfico</summary><div class="ap-fila"><label class="pn-f">Rango (1.ª columna = etiquetas)<input class="hj-gr" value="${esc(G?.rango || 'A1:B5')}" maxlength="9"></label><label class="pn-f">Tipo<select class="hj-gtp"><option value="barras">Barras</option><option value="lineas" ${G?.tipo === 'lineas' ? 'selected' : ''}>Líneas</option></select></label><button type="button" class="btn small" data-hj="graf">${ic('chart-bar')} Dibujar</button><button type="button" class="btn small" data-hj="nograf">${ic('x')} Quitar</button></div></details>
          <details class="hj-det"><summary>${ic('table-2')} Tabla dinámica</summary><div class="ap-fila"><label class="pn-f">Rango con títulos<input class="hj-pr" value="${esc(Pv?.rango || 'A1:B10')}" maxlength="9"></label><label class="pn-f">Agrupar por (título)<input class="hj-pf" value="${esc(Pv?.fila || '')}" maxlength="60"></label><label class="pn-f">Valor (título)<input class="hj-pv" value="${esc(Pv?.valor || '')}" maxlength="60"></label><label class="pn-f">Resumen<select class="hj-po">${['SUMA', 'PROMEDIO', 'CONTAR'].map((o) => `<option ${Pv?.op === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label><button type="button" class="btn small" data-hj="piv">${ic('table-2')} Calcular</button><button type="button" class="btn small" data-hj="nopiv">${ic('x')} Quitar</button></div></details>
          <details class="hj-det"><summary>${ic('info')} Funciones</summary><p class="au-small">=SUMA(A1:A5) · =PROMEDIO(B2:B9) · =SI(A1&gt;=5; "Sí"; "No") · =CONTAR.SI(A1:A9; "&gt;5") · =BUSCARV(D2; A2:B9; 2; FALSO) · MIN · MAX · CONTAR · REDONDEAR · Y · O. Operadores + - * / ^ &amp; y coma decimal.</p></details>
          <span class="pn-grow"></span><button type="button" class="btn small" data-hj="csv">${ic('file-down')} Descargar CSV</button></div>
        <div class="hj-graf">${graficoDe(H, G)}</div><div class="hj-pivw">${pivotHTML(H, Pv)}</div></div>`;
    },
    leer() { return { texto: resumenHoja(H, c.retos), doc: JSON.stringify({ v: 1, c: H.celdas, ...(G ? { g: G } : {}), ...(Pv ? { p: Pv } : {}) }) }; },
    imprimirHTML(doc) { return hojaLecturaHTML(it, doc); },
    enlazar(f, alCambiar) {
      const fx = f.querySelector('.hj-fx'); const ref = f.querySelector('.hj-ref');
      const enfocar = (r) => { const i = celda(f, r); if (i) { i.focus(); i.select?.(); } };
      const confirmar = (i) => { const nuevo = i.value; if ((H.celdas[i.dataset.r] ?? '') !== nuevo) { H.poner(i.dataset.r, nuevo.trim() === '' ? '' : nuevo.slice(0, 500)); alCambiar(); } refrescar(f); };
      f.addEventListener('focusin', (e) => { const i = e.target.closest?.('.hj-c'); if (!i) return; sel = i.dataset.r; ref.textContent = sel; i.value = H.celdas[sel] ?? ''; fx.value = i.value; i.classList.remove('err'); });
      f.addEventListener('focusout', (e) => { const i = e.target.closest?.('.hj-c'); if (i) confirmar(i); });
      f.addEventListener('input', (e) => { const i = e.target.closest?.('.hj-c'); if (i) fx.value = i.value; else if (e.target === fx) { const ci = celda(f, sel); if (ci) ci.value = fx.value; } });
      f.addEventListener('keydown', (e) => {
        if (e.target === fx && e.key === 'Enter') { e.preventDefault(); const ci = celda(f, sel); if (ci) { ci.value = fx.value; H.poner(sel, fx.value); alCambiar(); refrescar(f); const p = parteCelda(sel); enfocar(nombreCelda(Math.min(NF - 1, p.f + 1), p.c)); } return; }
        const i = e.target.closest?.('.hj-c'); if (!i) return; const p = parteCelda(i.dataset.r);
        if (e.key === 'Escape') { i.value = H.celdas[i.dataset.r] ?? ''; i.blur(); return; }
        const mov = { Enter: 1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (mov) { e.preventDefault(); const nf = Math.max(0, Math.min(NF - 1, p.f + mov)); if (nf === p.f) { i.blur(); return; } enfocar(nombreCelda(nf, p.c)); }
      });
      f.addEventListener('click', (e) => {
        const b = e.target.closest('[data-hj]'); if (!b || !f.contains(b)) return; e.preventDefault(); const k = b.dataset.hj;
        if (k === 'csv') return descargarCSV(H, NF, NC, it.titulo);
        if (k === 'graf') G = { rango: f.querySelector('.hj-gr').value.trim().toUpperCase(), tipo: f.querySelector('.hj-gtp').value };
        if (k === 'nograf') G = null;
        if (k === 'piv') Pv = { rango: f.querySelector('.hj-pr').value.trim().toUpperCase(), fila: f.querySelector('.hj-pf').value.trim(), valor: f.querySelector('.hj-pv').value.trim(), op: f.querySelector('.hj-po').value };
        if (k === 'nopiv') Pv = null;
        refrescar(f); alCambiar();
      });
    },
    enlazarLectura(f) { f.addEventListener('click', (e) => { const b = e.target.closest('[data-hj=csv]'); if (b) { e.preventDefault(); descargarCSV(H, NF, NC, it.titulo); } }); },
  };
  return editor;
}
function descargarCSV(H, nf, nc, titulo) {
  const url = URL.createObjectURL(new Blob(['\ufeff' + csvHoja(H, nf, nc)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = (String(titulo || 'hoja').replace(/[^\p{L}\p{N} _.-]+/gu, '').trim().slice(0, 60) || 'hoja') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
}
