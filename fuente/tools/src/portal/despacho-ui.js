// «Despacho virtual» (PIAC SA1 T4): editor del alumno (para entrega-ui, como la hoja de cálculo), vista de
// solo lectura del profesor (corrección) y panel de la centralita (asignar empresas y lanzar llamadas).
//  · Arrastrar con eventos de puntero (ratón y dedo) y, como alternativa, tocar/teclado: elegir etiqueta → día y hora.
//  · El tablero se guarda en trabajos/{id}.doc (JSON) con el guardado automático de entrega-ui.
//  · Centralita: despachos/{item}_{grupo} { asign: { nº: empresa }, llamadas: [{ e, k, n, t }] } (solo escribe el profesor).
// Sin nombres de alumnos: solo nº de lista. Sin librerías externas.
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { esc, nombreArchivo } from './util.js';
import { ic } from './ico.js';
import {
  PASO, hhmm, rangoTexto, slots, duracionMin, avisos, nivelPorTrabajo, contador, colocar, quitarTrabajo, asignar, desasignar,
  leerDoc, docVacio, docTexto, anotar, resumenTexto, empresaPara, pendientes, incidenciaOk, repartir, bloques, empresaAzar,
} from '../lms/despacho.js';

const pad = (n) => String(n).padStart(2, '0');
const fHora = (t) => (t ? new Date(t).toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
const NIV_TXT = { rojo: 'Rojo', naranja: 'Naranja', amarillo: 'Amarillo' };
const ACC_TXT = { colocar: 'Coloca', mover: 'Mueve', quitar: 'Quita del tablero', asignar: 'Asigna', desasignar: 'Quita', deshacer: 'Deshace', llamada: 'Atiende llamada', incidencia: 'Escribe incidencia', empresa: 'Empresa' };
const idCentral = (itemId, grupo) => `${itemId}_${grupo}`;
const copia = (o) => JSON.parse(JSON.stringify(o || {}));
const empDe = (cont, id) => cont.empresas.find((e) => e.id === id) || cont.empresas[0];

// ---------- Tablero en SVG (solo lectura: profesor, antes/después, exportar imagen o PDF) ----------
const COL_NIV = { rojo: '#DE0714', naranja: '#E8770E', amarillo: '#D4A800' };
export function tableroSVG(cont, emp, tb, { ancho = 1100, titulo = '' } = {}) {
  const filas = (cont.horario.fin - cont.horario.ini) / PASO; const fh = 22; const top = titulo ? 54 : 30; const izq = 52;
  const nd = cont.dias.length; const cw = (ancho - izq - 8) / nd; const H = top + filas * fh + 10;
  const niv = nivelPorTrabajo(avisos(cont, emp, tb));
  let g = `<rect width="${ancho}" height="${H}" fill="#fff"/>`;
  if (titulo) g += `<text x="10" y="22" font-size="16" font-weight="700" fill="#1d1d1f">${esc(titulo)}</text>`;
  cont.dias.forEach((d, i) => { g += `<text x="${izq + cw * i + cw / 2}" y="${top - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="#506C88">${esc(d)}</text>`; });
  for (let r = 0; r <= filas; r++) {
    const y = top + r * fh; const m = cont.horario.ini + r * PASO; const enHora = m % 60 === 0;
    g += `<line x1="${izq}" x2="${ancho - 8}" y1="${y}" y2="${y}" stroke="${enHora ? '#c7ccd4' : '#eceef2'}" stroke-width="1"/>`;
    if (enHora && r < filas) g += `<text x="${izq - 6}" y="${y + 12}" text-anchor="end" font-size="10" fill="#6b7280">${hhmm(m)}</text>`;
  }
  for (let i = 0; i <= nd; i++) g += `<line x1="${izq + cw * i}" x2="${izq + cw * i}" y1="${top}" y2="${top + filas * fh}" stroke="#c7ccd4"/>`;
  const B = bloques(emp, tb);
  for (let d = 0; d < nd; d++) {
    const L = carriles(B.filter((b) => b.d === d));
    for (const b of L) {
      const w = (cw - 4) / b.nc; const x = izq + cw * d + 2 + w * b.c; const y = top + ((b.ini - cont.horario.ini) / PASO) * fh + 1; const h = Math.max(fh - 2, ((b.fin - b.ini) / PASO) * fh - 2);
      const col = niv[b.id] ? COL_NIV[niv[b.id]] : '#506C88';
      g += `<g><rect x="${x}" y="${y}" width="${w - 2}" height="${h}" rx="6" fill="#eef2f6" stroke="${col}" stroke-width="${niv[b.id] ? 2.5 : 1.5}"/>`;
      g += `<text x="${x + 5}" y="${y + 13}" font-size="11" font-weight="700" fill="#1d1d1f">${esc(clip(`${b.id} ${b.t.cliente}`, w / 6))}</text>`;
      if (h > 30) g += `<text x="${x + 5}" y="${y + 26}" font-size="10" fill="#374151">${esc(clip(b.t.trabajo, w / 5.5))}</text>`;
      if (h > 44) g += `<text x="${x + 5}" y="${y + 39}" font-size="10" fill="#DE0714">${esc(clip(b.p.join(' '), w / 5.5))}</text>`;
      if (h > 58) g += `<text x="${x + 5}" y="${y + 52}" font-size="10" fill="#6b7280">${esc(clip(b.r.join(', '), w / 5.5))}</text>`;
      g += `<title>${esc(`${b.id} · ${b.t.cliente} · ${b.t.trabajo} · ${hhmm(b.ini)}-${hhmm(b.fin)} · ${b.p.join(', ') || 'sin personal'} · ${b.r.join(', ') || 'sin recurso'}`)}</title></g>`;
    }
  }
  return `<svg class="dv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${H}" width="${ancho}" height="${H}" font-family="-apple-system, system-ui, Segoe UI, Roboto, sans-serif" role="img" aria-label="Tablero de la semana">${g}</svg>`;
}
const clip = (s, n) => { s = String(s || ''); n = Math.max(3, Math.floor(n)); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
// Bloques que se solapan en un día → carriles (columnas) para que se vean todos
function carriles(L) {
  L = L.slice().sort((a, b) => a.ini - b.ini || b.fin - a.fin); const fin = []; const grupos = []; let gr = [], hasta = -1;
  for (const b of L) {
    if (b.ini >= hasta && gr.length) { grupos.push(gr); gr = []; fin.length = 0; }
    let c = fin.findIndex((f) => f <= b.ini); if (c < 0) { c = fin.length; fin.push(0); } fin[c] = b.fin; b.c = c; gr.push(b); hasta = Math.max(hasta, b.fin);
  }
  if (gr.length) grupos.push(gr);
  for (const g of grupos) { const nc = Math.max(...g.map((b) => b.c)) + 1; g.forEach((b) => { b.nc = nc; }); }
  return L;
}
const avisosHTML = (A) => (A.length ? `<ul class="dv-avl">${A.map((a) => `<li class="dv-av ${a.nivel}"><span class="dv-avn">${NIV_TXT[a.nivel]}</span><span>${esc(a.texto)}</span></li>`).join('')}</ul>` : `<p class="dv-ok">${ic('circle-check')} Sin avisos.</p>`);

// Exportar: imagen PNG (desde el SVG) o PDF (ventana de impresión del navegador)
export async function svgAPng(svg, nombre) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image(); await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = url; });
    const cv = document.createElement('canvas'); cv.width = img.width * 2; cv.height = img.height * 2; const cx = cv.getContext('2d'); cx.scale(2, 2); cx.drawImage(img, 0, 0);
    const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = (nombreArchivo(nombre, 60) || 'tablero') + '.png'; document.body.appendChild(a); a.click(); a.remove();
  } finally { URL.revokeObjectURL(url); }
}
export function imprimirTablero(html, titulo) {
  const w = window.open('', '_blank'); if (!w) return false;
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>body{font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif;margin:16px;color:#1d1d1f}svg{max-width:100%;height:auto}h1{font-size:18px}li{margin:2px 0}.rojo{color:#DE0714}.naranja{color:#b45309}.amarillo{color:#8a6d00}@page{size:landscape;margin:10mm}</style></head><body>${html}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
  w.document.close(); return true;
}
// Botones de exportar de las vistas de solo lectura (delegación global: también funcionan tras repintar)
if (typeof document !== 'undefined') document.addEventListener('click', (e) => {
  const b = e.target.closest?.('[data-dvx]'); if (!b) return; const box = b.closest('.dv-exp'); const svg = box?.querySelector('svg.dv-svg'); if (!svg) return;
  e.preventDefault(); const t = box.dataset.titulo || 'Tablero';
  if (b.dataset.dvx === 'png') svgAPng(svg.outerHTML, t); else imprimirTablero(`<h1>${esc(t)}</h1>${svg.outerHTML}${box.querySelector('.dv-avl')?.outerHTML || ''}`, t);
});
const expBtns = () => `<div class="dv-expb"><button type="button" class="btn small" data-dvx="png">${ic('image')} Guardar imagen</button><button type="button" class="btn small" data-dvx="pdf">${ic('printer')} PDF / imprimir</button></div>`;

// ---------- Vista de solo lectura (profesor al corregir; alumno tras entregar) ----------
export function despachoLecturaHTML(it, docTxt, { profesor = true } = {}) {
  const cont = it.contenido; const D = leerDoc(docTxt);
  if (!cont?.empresas?.length) return '<p class="pn-small">Actividad sin datos.</p>';
  if (!D) return '<p class="pn-small">El alumno todavía no ha empezado el tablero.</p>';
  const emp = empDe(cont, D.emp); const c = contador(cont, emp, D.b);
  const nRojo = c.A.filter((a) => a.nivel === 'rojo').length;
  let h = `<div class="dv-lect"><div class="dv-cnt"><span class="dv-emp">${ic('briefcase')} ${esc(emp.nombre)}</span><span><b>Trabajos colocados ${c.colocados}/${c.total}</b></span><span class="${c.avisos ? 'dv-hay' : ''}">Avisos ${c.avisos}${nRojo ? ` (${nRojo} rojos)` : ''}</span><span>Llamadas atendidas ${D.at.length}</span><span>Incidencias ${D.inc.length}</span></div>`;
  h += `<div class="dv-exp" data-titulo="${esc(`${it.titulo} · ${emp.nombre}`)}"><div class="dv-svgw">${tableroSVG(cont, emp, D.b)}</div>${expBtns()}<h4>${ic('triangle-exclamation-point')} Avisos que quedan</h4>${avisosHTML(c.A)}</div>`;
  h += `<h4>${ic('radio')} Incidencias (${D.inc.length})</h4>` + (D.inc.length ? D.inc.map((x, i) => incidenciaHTML(cont, emp, x, i)).join('') : '<p class="pn-small">Sin incidencias.</p>');
  const sinInc = D.at.filter((a) => !D.inc.some((x) => x.c === a.c));
  if (sinInc.length) h += `<p class="pn-small dv-hay">${sinInc.length} llamada${sinInc.length === 1 ? '' : 's'} atendida${sinInc.length === 1 ? '' : 's'} sin incidencia escrita.</p>`;
  if (profesor) {
    h += `<details class="dv-det"><summary>${ic('clock')} Historial de movimientos (${D.h.length})</summary><table class="dv-hist"><thead><tr><th>Hora</th><th>Acción</th><th>Trabajo</th><th>Detalle</th></tr></thead><tbody>${D.h.slice().reverse().map(([t, a, id, det]) => `<tr><td>${esc(fHora(t))}</td><td>${esc(ACC_TXT[a] || a)}</td><td>${esc(id)}</td><td>${esc(det)}</td></tr>`).join('')}</tbody></table></details>`;
    h += `<details class="dv-det"><summary>${ic('info')} Registro (solo informativo, solo lo ves tú)</summary><p class="pn-small">Tiempo con la actividad abierta: <b>${Math.round((D.reg.seg || 0) / 60)} min</b> · Cambios de pestaña o de ventana: <b>${D.reg.pest || 0}</b>.</p><p class="pn-small">No cambia la nota: la pones tú con la rúbrica.</p></details>`;
  }
  return h + '</div>';
}
function incidenciaHTML(cont, emp, x, i) {
  const tit = x.k == null ? 'Incidencia propia' : `Llamada ${x.k + 1}${x.tipo ? ' · ' + x.tipo : ''}`;
  return `<details class="dv-inc"><summary><b>${i + 1}. ${esc(tit)}</b> <span class="pn-small">${esc(fHora(x.t))}</span></summary>
    ${x.texto ? `<p class="dv-llt">${ic('radio')} ${x.cuando ? `<b>${esc(x.cuando)}</b> · ` : ''}${esc(x.texto)}</p>` : ''}
    <dl class="dv-dl"><dt>Qué he cambiado</dt><dd>${esc(x.cambio)}</dd><dt>Por qué</dt><dd>${esc(x.porque)}</dd><dt>Trabajo movido</dt><dd>${esc(x.movido || '—')}</dd></dl>
    ${x.antes ? `<div class="dv-ad"><div class="dv-exp" data-titulo="Antes · ${esc(tit)}"><b>Antes</b>${tableroSVG(cont, emp, x.antes, { ancho: 900 })}${expBtns()}</div><div class="dv-exp" data-titulo="Después · ${esc(tit)}"><b>Después</b>${tableroSVG(cont, emp, x.despues || {}, { ancho: 900 })}${expBtns()}</div></div>` : ''}</details>`;
}

// ---------- Editor del alumno ----------
export function crearEditorDespacho(it, { db, ses } = {}) {
  const cont = it.contenido; const S = { D: null, emp: null, undo: [], sel: null, f: null, alCambiar: () => {}, ro: false, lanz: [], asign: {}, modal: null, unsub: null, tReg: null, drag: null };
  const vacio = () => !Object.keys(S.D.b).length && !S.D.h.length;
  function asegurarDoc(v) {
    const d = leerDoc(v?.doc);
    if (d && (!S.D || (d.h.length >= S.D.h.length))) S.D = d;
    if (!S.D) { const e = empresaPara(cont, { itemId: it.id, numero: ses?.numero, asign: S.asign }); S.D = docVacio(e); }
    if (!cont.empresas.some((e) => e.id === S.D.emp)) S.D.emp = cont.empresas[0].id;
    S.emp = empDe(cont, S.D.emp);
  }
  function cambio(fn, accion, id, det) {
    if (S.ro) return; const antes = JSON.stringify(S.D.b); const nb = fn(S.D.b); if (JSON.stringify(nb) === antes) return;
    S.undo.push(antes); if (S.undo.length > 60) S.undo.shift(); S.D.b = nb; anotar(S.D, accion, id, det); pintar(); S.alCambiar();
  }
  const diaTxt = (d) => cont.dias[d] || '';
  const filas = () => (cont.horario.fin - cont.horario.ini) / PASO;
  function chipT(t) {
    const b = S.D.b[t.id]; const pu = b && Number.isInteger(b.d);
    return `<button type="button" class="dv-chip t${pu ? ' puesto' : ''}${S.sel?.k === 't' && S.sel.id === t.id ? ' sel' : ''}" data-drag="t" data-id="${esc(t.id)}" aria-label="Trabajo ${esc(t.id)}: ${esc(t.cliente)}, ${esc(t.trabajo)}">
      <span class="dv-c1"><b>${esc(t.id)}</b> ${esc(t.cliente)}${pu ? ` ${ic('check')}` : ''}</span><span class="dv-c2">${esc(t.trabajo)}</span>
      <span class="dv-c3">${ic('clock')} ${esc(String(t.horas).replace('.', ','))} h · ${esc(rangoTexto(t.ventana))}${t.dia != null ? ` · ${esc(diaTxt(t.dia))}` : ''}</span>
      <span class="dv-c3">${ic('users')} ${t.personas} · ${esc(t.perfil || 'cualquiera')}${t.recurso ? ` · ${ic('box')} ${esc(t.recurso)}` : ''}</span></button>`;
  }
  const chipP = (p) => `<button type="button" class="dv-chip p${S.sel?.k === 'p' && S.sel.id === p.codigo ? ' sel' : ''}" data-drag="p" data-id="${esc(p.codigo)}" aria-label="Persona ${esc(p.codigo)}, ${esc(p.rol)}, turno ${esc(p.turno)}"><span class="dv-c1"><b>${esc(p.codigo)}</b></span><span class="dv-c2">${esc(p.rol)}</span><span class="dv-c3">${esc(p.turno)}</span></button>`;
  const chipR = (r) => `<button type="button" class="dv-chip r${S.sel?.k === 'r' && S.sel.id === r ? ' sel' : ''}" data-drag="r" data-id="${esc(r)}" aria-label="Recurso ${esc(r)}"><span class="dv-c1">${ic('box')} ${esc(r)}</span></button>`;
  function tableroHTML(niv) {
    const nf = filas(); let h = `<div class="dv-board" style="--nf:${nf};--nd:${cont.dias.length}"><div class="dv-hd dv-esq"></div>${cont.dias.map((d, i) => `<div class="dv-hd${S.emp.trabajos.some((t) => t.dia === i) ? '' : ' libre'}">${esc(d)}</div>`).join('')}`;
    h += `<div class="dv-horas">${Array.from({ length: nf }, (_, r) => { const m = cont.horario.ini + r * PASO; return `<div class="dv-hh${m % 60 ? '' : ' en'}">${m % 60 ? '' : hhmm(m)}</div>`; }).join('')}</div>`;
    const B = bloques(S.emp, S.D.b);
    cont.dias.forEach((_, d) => {
      h += `<div class="dv-col" data-d="${d}" aria-label="${esc(cont.dias[d])}">`;
      for (const b of carriles(B.filter((x) => x.d === d))) {
        const top = (b.ini - cont.horario.ini) / PASO; const alto = (b.fin - b.ini) / PASO;
        h += `<div class="dv-blk${niv[b.id] ? ' ' + niv[b.id] : ''}${S.sel?.k === 'b' && S.sel.id === b.id ? ' sel' : ''}" data-drag="b" data-id="${esc(b.id)}" tabindex="0" role="button" aria-label="${esc(`${b.id} ${b.t.cliente}, ${cont.dias[d]} de ${hhmm(b.ini)} a ${hhmm(b.fin)}`)}" style="top:calc(${top} * var(--fila));height:calc(${alto} * var(--fila) - 3px);left:calc(${b.c} * 100% / ${b.nc});width:calc(100% / ${b.nc} - 3px)">
          <div class="dv-b1"><b>${esc(b.id)}</b> ${esc(b.t.cliente)}</div><div class="dv-b2">${hhmm(b.ini)}-${hhmm(b.fin)} · ${esc(b.t.trabajo)}</div>
          <div class="dv-asg">${b.p.map((c) => `<span class="dv-tag p">${esc(c)}<button type="button" class="dv-x" data-quitar="p" data-id="${esc(b.id)}" data-v="${esc(c)}" aria-label="Quitar ${esc(c)} de ${esc(b.id)}">${ic('x')}</button></span>`).join('')}${b.r.map((r) => `<span class="dv-tag r">${esc(r)}<button type="button" class="dv-x" data-quitar="r" data-id="${esc(b.id)}" data-v="${esc(r)}" aria-label="Quitar ${esc(r)} de ${esc(b.id)}">${ic('x')}</button></span>`).join('')}</div></div>`;
      }
      h += '</div>';
    });
    return h + '</div>';
  }
  function kbdHTML() {
    if (!S.sel) return `<p class="dv-ayuda">${ic('mouse-pointer-click')} Arrastra las etiquetas al tablero. Sin ratón: toca una etiqueta y elige dónde va.</p>`;
    const k = S.sel.k;
    if (k === 't' || k === 'b') {
      const t = S.emp.trabajos.find((x) => x.id === S.sel.id); if (!t) return ''; const b = S.D.b[t.id]; const dur = duracionMin(t.horas);
      const horas = []; for (let m = cont.horario.ini; m + dur <= cont.horario.fin; m += PASO) horas.push(m);
      const dSel = b ? b.d : (t.dia ?? 0); const sSel = b ? b.s : (t.ventana?.ini ?? cont.horario.ini);
      return `<div class="dv-kbd-f"><b>${esc(t.id)} ${esc(t.cliente)}</b><label>Día <select data-k="dia">${cont.dias.map((d, i) => `<option value="${i}" ${i === dSel ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select></label>
        <label>Hora <select data-k="hora">${horas.map((m) => `<option value="${m}" ${m === sSel ? 'selected' : ''}>${hhmm(m)}</option>`).join('')}</select></label>
        <button type="button" class="btn primary small" data-dv="colocar">${ic('calendar-days')} ${b ? 'Mover aquí' : 'Colocar'}</button>${b ? `<button type="button" class="btn small" data-dv="quitarT">${ic('x')} Quitar del tablero</button>` : ''}<button type="button" class="btn small" data-dv="nosel">Cancelar</button></div>`;
    }
    const pu = bloques(S.emp, S.D.b);
    return `<div class="dv-kbd-f"><b>${esc(S.sel.id)}</b><label>Trabajo <select data-k="trab">${pu.length ? pu.map((b) => `<option value="${esc(b.id)}">${esc(`${b.id} ${b.t.cliente} · ${diaTxt(b.d)} ${hhmm(b.ini)}`)}</option>`).join('') : '<option value="">(coloca antes algún trabajo)</option>'}</select></label>
      <button type="button" class="btn primary small" data-dv="asignar" ${pu.length ? '' : 'disabled'}>${ic('plus')} Asignar</button><button type="button" class="btn small" data-dv="nosel">Cancelar</button></div>`;
  }
  const pendInc = () => S.D.at.filter((a) => !S.D.inc.some((x) => x.c === a.c));
  function interiorHTML() {
    const c = contador(cont, S.emp, S.D.b); const niv = nivelPorTrabajo(c.A); const nR = c.A.filter((a) => a.nivel === 'rojo').length; const pi = pendInc();
    return `<div class="dv-top"><span class="dv-emp">${ic('briefcase')} ${esc(S.emp.nombre)}</span>
        <span class="dv-cnt1" aria-live="polite"><b>Trabajos colocados ${c.colocados}/${c.total}</b> · <span class="${nR ? 'dv-rojo' : c.avisos ? 'dv-hay' : ''}">Avisos ${c.avisos}</span></span><span class="pn-grow"></span>
        <button type="button" class="btn small" data-dv="deshacer" ${S.undo.length ? '' : 'disabled'}>${ic('undo-2')} Deshacer</button>
        <button type="button" class="btn small" data-dv="incidencia">${ic('notebook-pen')} Incidencia</button>
        <button type="button" class="btn small" data-dv="ampliar" aria-pressed="${S.full ? 'true' : 'false'}">${ic(S.full ? 'minimize-2' : 'maximize-2')} ${S.full ? 'Salir de pantalla completa' : 'Pantalla completa'}</button>
        <button type="button" class="btn small" data-dv="png">${ic('image')} Imagen</button><button type="button" class="btn small" data-dv="pdf">${ic('printer')} PDF</button></div>
      ${pi.length ? `<div class="dv-banner">${ic('radio')} Has atendido ${pi.length === 1 ? 'una llamada' : pi.length + ' llamadas'}. Cambia el tablero y luego explica qué has hecho. <button type="button" class="btn primary small" data-dv="incidencia" data-c="${esc(pi[0].c)}">${ic('notebook-pen')} Escribir la incidencia</button></div>` : ''}
      ${cont.prioridad?.length ? `<details class="dv-prio"><summary>${ic('list-ordered')} Prioridad</summary><ol>${cont.prioridad.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></details>` : ''}
      <div class="dv-kbd">${kbdHTML()}</div>
      <div class="dv-main"><aside class="dv-side" aria-label="Etiquetas">
          <h5>${ic('briefcase')} Trabajos <small>${c.colocados}/${c.total}</small></h5><div class="dv-lista t">${S.emp.trabajos.map(chipT).join('')}</div>
          <h5>${ic('users')} Personal</h5><div class="dv-lista p">${S.emp.personal.map(chipP).join('')}</div>
          ${S.emp.recursos.length ? `<h5>${ic('box')} Recursos</h5><div class="dv-lista r">${S.emp.recursos.map(chipR).join('')}</div>` : ''}
        </aside><div class="dv-boardw">${tableroHTML(niv)}</div></div>
      <details class="dv-avisos" ${c.avisos ? 'open' : ''}><summary>${ic('triangle-exclamation-point')} Avisos (${c.avisos})</summary>${avisosHTML(c.A)}</details>
      ${S.D.inc.length ? `<details class="dv-avisos"><summary>${ic('notebook-pen')} Mis incidencias (${S.D.inc.length})</summary>${S.D.inc.map((x, i) => `<p class="pn-small"><b>${i + 1}. ${x.k == null ? 'Propia' : `Llamada ${x.k + 1}`}</b>: ${esc(x.cambio)} — ${esc(x.porque)}</p>`).join('')}</details>` : ''}`;
  }
  function pintar() {
    const w = S.f?.querySelector('.dv-in'); if (!w) return; const sc = w.querySelector('.dv-boardw'); const st = sc ? [sc.scrollTop, sc.scrollLeft] : null;
    w.innerHTML = interiorHTML(); const sc2 = w.querySelector('.dv-boardw'); if (sc2 && st) { sc2.scrollTop = st[0]; sc2.scrollLeft = st[1]; }
    revisarLlamadas();
  }
  // ----- Modales propios (la llamada no se cierra hasta pulsar «Entendido») -----
  function modal(html) { cerrarModal(); const m = document.createElement('div'); m.className = 'dv-modal'; m.innerHTML = `<div class="dv-mbox" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(m); S.modal = m; m.querySelector('button, textarea, input, select')?.focus(); return m; }
  function cerrarModal() { S.modal?.remove(); S.modal = null; }
  function revisarLlamadas() {
    if (S.ro || S.modal || !S.f?.isConnected) return;
    const P = pendientes(S.lanz, { emp: S.emp.id, numero: ses?.numero, atendidas: S.D.at }); if (!P.length) return;
    const l = P[0]; const ll = S.emp.llamadas[l.k]; if (!ll) { S.D.at.push({ c: l.c, k: l.k, t: Date.now(), antes: copia(S.D.b), sinTexto: true }); return; }
    const m = modal(`<div class="dv-mh rojo">${ic('radio')} Llamada de la centralita</div><p class="dv-mt">${ll.cuando ? `<b>${esc(ll.cuando)}</b>` : ''}${ll.tipo ? ` · ${esc(ll.tipo)}` : ''}</p><p class="dv-mtx">${esc(ll.texto)}</p><div class="dv-mf"><button type="button" class="btn primary" data-m="ok">${ic('check')} Entendido</button></div>`);
    m.querySelector('[data-m=ok]').addEventListener('click', () => {
      S.D.at.push({ c: l.c, k: l.k, tipo: ll.tipo, t: Date.now(), antes: copia(S.D.b) }); anotar(S.D, 'llamada', '', `Llamada ${l.k + 1}${ll.tipo ? ' · ' + ll.tipo : ''}`);
      cerrarModal(); pintar(); S.alCambiar(); editor.guardarYa?.();
    });
    m.addEventListener('keydown', (e) => { if (e.key === 'Escape') e.preventDefault(); });
  }
  function abrirIncidencia(c) {
    if (S.ro) return; const a = c ? S.D.at.find((x) => x.c === c) : pendInc()[0]; const ll = a ? S.emp.llamadas[a.k] : null;
    const m = modal(`<div class="dv-mh">${ic('notebook-pen')} Incidencia${ll ? ` · Llamada ${a.k + 1}` : ''}</div>${ll ? `<p class="dv-mtx small">${esc(ll.texto)}</p>` : '<p class="pn-small">Explica un cambio que has hecho (por ejemplo, un trabajo fuera de su ventana).</p>'}
      <label class="dv-fl">Qué he cambiado<textarea data-i="cambio" rows="2" maxlength="400" placeholder="Por ejemplo: He pasado el trabajo LT03 al martes por la mañana."></textarea></label>
      <label class="dv-fl">Por qué<textarea data-i="porque" rows="2" maxlength="400" placeholder="Por ejemplo: Porque la furgoneta está en el taller."></textarea></label>
      <label class="dv-fl">Qué trabajo he movido<select data-i="movido"><option value="">(ninguno)</option>${S.emp.trabajos.map((t) => `<option value="${esc(t.id)}">${esc(`${t.id} ${t.cliente}`)}</option>`).join('')}</select></label>
      <p class="dv-merr" aria-live="polite"></p><div class="dv-mf"><button type="button" class="btn" data-m="no">Más tarde</button><button type="button" class="btn primary" data-m="ok">${ic('save')} Guardar incidencia</button></div>`);
    m.querySelector('[data-m=no]').addEventListener('click', cerrarModal);
    m.querySelector('[data-m=ok]').addEventListener('click', () => {
      const v = (k) => m.querySelector(`[data-i=${k}]`).value.trim(); const x = { cambio: v('cambio').slice(0, 400), porque: v('porque').slice(0, 400), movido: v('movido') };
      if (!incidenciaOk(x)) { m.querySelector('.dv-merr').textContent = 'Escribe al menos una frase en «Qué he cambiado» y en «Por qué».'; return; }
      S.D.inc.push({ c: a?.c || null, k: a ? a.k : null, tipo: ll?.tipo || '', cuando: ll?.cuando || '', texto: ll?.texto || '', tl: a?.t || null, t: Date.now(), ...x, antes: a?.antes || null, despues: a ? copia(S.D.b) : null });
      if (S.D.inc.length > 20) S.D.inc.splice(0, S.D.inc.length - 20);
      anotar(S.D, 'incidencia', x.movido, a ? `Llamada ${a.k + 1}` : 'Propia'); cerrarModal(); pintar(); S.alCambiar(); editor.guardarYa?.();
    });
  }
  // ----- Arrastrar con eventos de puntero (ratón, dedo y lápiz) -----
  function onDown(e) {
    if (S.ro || e.button > 0) return; const src = e.target.closest('[data-drag]'); if (!src || e.target.closest('.dv-x')) return;
    const r = src.getBoundingClientRect();
    S.drag = { k: src.dataset.drag, id: src.dataset.id, x0: e.clientX, y0: e.clientY, dy: e.clientY - r.top, src, pid: e.pointerId, on: false, ghost: null };
    try { src.setPointerCapture(e.pointerId); } catch (er) { /* sin captura */ }
  }
  function onMove(e) {
    const g = S.drag; if (!g || e.pointerId !== g.pid) return;
    if (!g.on) { if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < 6) return; g.on = true; g.ghost = fantasma(g); document.body.classList.add('dv-arrastrando'); }
    e.preventDefault(); g.ghost.style.transform = `translate(${e.clientX + 8}px, ${e.clientY - (g.k === 'b' ? g.dy : 12)}px)`;
    S.f.querySelectorAll('.dv-drop').forEach((x) => x.classList.remove('dv-drop'));
    const t = destino(e); if (t?.el) t.el.classList.add('dv-drop');
    const sc = S.f.querySelector('.dv-boardw'); if (sc) { const rr = sc.getBoundingClientRect(); if (e.clientY > rr.bottom - 40) sc.scrollTop += 14; else if (e.clientY < rr.top + 40 && e.clientY > rr.top - 60) sc.scrollTop -= 14; }
    if (e.clientY > innerHeight - 40 || e.clientY < 70) { const pc = contenedorScroll(S.f); if (pc) pc.scrollTop += e.clientY < 70 ? -14 : 14; }
  }
  function onUp(e) {
    const g = S.drag; if (!g || e.pointerId !== g.pid) return; S.drag = null;
    try { g.src.releasePointerCapture(g.pid); } catch (er) { /* nada */ }
    if (!g.on) return; g.ghost?.remove(); document.body.classList.remove('dv-arrastrando'); S.f.querySelectorAll('.dv-drop').forEach((x) => x.classList.remove('dv-drop'));
    g.fin = true; S.ignorarClic = Date.now();
    if (e.type === 'pointercancel') return;
    const t = destino(e, g); if (!t) return;
    if (t.tipo === 'celda') { const yaEstaba = !!S.D.b[g.id]; cambio((b) => colocar(cont, S.emp, b, g.id, t.d, t.s), yaEstaba ? 'mover' : 'colocar', g.id, `${diaTxt(t.d)} ${hhmm(Math.max(cont.horario.ini, t.s))}`); }
    else if (t.tipo === 'fuera') cambio((b) => quitarTrabajo(b, g.id), 'quitar', g.id, '');
    else if (t.tipo === 'bloque') cambio((b) => asignar(S.emp, b, t.id, g.k, g.id), 'asignar', t.id, g.id);
  }
  function contenedorScroll(el) { for (let p = el?.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) return p; } return document.scrollingElement; }
  function fantasma(g) {
    const el = document.createElement('div'); el.className = 'dv-ghost ' + (g.k === 'b' ? 't' : g.k);
    const t = S.emp.trabajos.find((x) => x.id === g.id);
    el.textContent = g.k === 't' || g.k === 'b' ? `${g.id} ${t?.cliente || ''}` : g.id;
    if ((g.k === 't' || g.k === 'b') && t) { const fh = parseFloat(getComputedStyle(S.f.querySelector('.dv-board')).getPropertyValue('--fila')) || 26; el.style.height = `${slots(t.horas) * fh}px`; }
    document.body.appendChild(el); return el;
  }
  function destino(e, g = S.drag || {}) {
    const el = document.elementFromPoint(e.clientX, e.clientY); if (!el || !S.f.contains(el)) return null;
    const k = g.k;
    if (k === 't' || k === 'b') {
      if (k === 'b' && el.closest('.dv-side')) return { tipo: 'fuera', el: el.closest('.dv-side') };
      const col = el.closest('.dv-col') || el.closest('.dv-blk')?.closest('.dv-col'); if (!col) return null;
      const r = col.getBoundingClientRect(); const fh = r.height / filas(); const y = e.clientY - r.top - (k === 'b' ? (g.dy || 0) : fh / 2);
      return { tipo: 'celda', el: col, d: +col.dataset.d, s: cont.horario.ini + Math.round(y / fh) * PASO };
    }
    const b = el.closest('.dv-blk'); return b ? { tipo: 'bloque', el: b, id: b.dataset.id } : null;
  }
  function onClick(e) {
    const q = e.target.closest('[data-quitar]');
    if (q) { e.preventDefault(); cambio((b) => desasignar(b, q.dataset.id, q.dataset.quitar, q.dataset.v), 'desasignar', q.dataset.id, q.dataset.v); return; }
    const a = e.target.closest('[data-dv]');
    if (a) {
      e.preventDefault(); const acc = a.dataset.dv;
      if (acc === 'deshacer') { const p = S.undo.pop(); if (p != null) { S.D.b = JSON.parse(p); anotar(S.D, 'deshacer'); pintar(); S.alCambiar(); } return; }
      if (acc === 'incidencia') return abrirIncidencia(a.dataset.c);
      if (acc === 'png') return svgAPng(tableroSVG(cont, S.emp, S.D.b, { titulo: `${it.titulo} · ${S.emp.nombre}` }), `${it.titulo} ${S.emp.nombre}`);
      if (acc === 'pdf') return imprimirTablero(tableroSVG(cont, S.emp, S.D.b, { titulo: `${it.titulo} · ${S.emp.nombre}` }) + `<h3>Avisos</h3>${avisosHTML(avisos(cont, S.emp, S.D.b))}`, it.titulo);
      if (acc === 'ampliar') { S.full = !S.full; S.f.querySelector('.dv')?.classList.toggle('dv-full', S.full); document.documentElement.classList.toggle('dv-full-on', S.full); return pintar(); }
      if (acc === 'nosel') { S.sel = null; return pintar(); }
      const w = S.f.querySelector('.dv-kbd');
      if (acc === 'colocar') { const d = +w.querySelector('[data-k=dia]').value; const s = +w.querySelector('[data-k=hora]').value; const id = S.sel.id; const ya = !!S.D.b[id]; S.sel = null; cambio((b) => colocar(cont, S.emp, b, id, d, s), ya ? 'mover' : 'colocar', id, `${diaTxt(d)} ${hhmm(s)}`); return; }
      if (acc === 'quitarT') { const id = S.sel.id; S.sel = null; cambio((b) => quitarTrabajo(b, id), 'quitar', id, ''); return; }
      if (acc === 'asignar') { const id = w.querySelector('[data-k=trab]').value; if (!id) return; const v = S.sel.id, k = S.sel.k; cambio((b) => asignar(S.emp, b, id, k, v), 'asignar', id, v); return; }
      return;
    }
    const ch = e.target.closest('[data-drag]');
    if (ch && !S.ro) { if (S.ignorarClic && Date.now() - S.ignorarClic < 400) return; e.preventDefault(); const k = ch.dataset.drag; S.sel = S.sel && S.sel.k === k && S.sel.id === ch.dataset.id ? null : { k, id: ch.dataset.id }; pintar(); S.f.querySelector('.dv-kbd select, .dv-kbd button')?.focus(); }
  }
  function onKey(e) {
    if (e.key === 'Escape' && S.sel && !S.modal) { S.sel = null; pintar(); }
    else if (e.key === 'Escape' && S.full && !S.modal) { S.full = false; S.f.querySelector('.dv')?.classList.remove('dv-full'); document.documentElement.classList.remove('dv-full-on'); pintar(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.dv-blk')) { e.preventDefault(); e.target.click(); }
  }
  // ----- Centralita (escucha) y registro informativo -----
  function escuchar() {
    if (S.unsub || !db || !ses?.grupo) return;
    S.unsub = onSnapshot(doc(db, 'despachos', idCentral(it.id, ses.grupo)), (d) => {
      const x = d.exists() ? d.data() : {}; S.lanz = Array.isArray(x.llamadas) ? x.llamadas : []; S.asign = x.asign || {};
      if (S.D && !S.ro && vacio()) { const e = empresaPara(cont, { itemId: it.id, numero: ses.numero, asign: S.asign }); if (e !== S.D.emp) { S.D.emp = e; S.emp = empDe(cont, e); } }
      pintar();
    }, () => { /* sin permiso o sin red: se sigue trabajando sin centralita */ });
  }
  const onVis = () => { if (document.visibilityState === 'hidden' && S.D && !S.ro && S.f?.isConnected) { S.D.reg.pest = (S.D.reg.pest || 0) + 1; S.alCambiar(); } };
  const editor = {
    html(v, ro) {
      asegurarDoc(v); S.ro = !!ro; escuchar();
      if (ro) return `<div class="dv dv-ro">${despachoLecturaHTML(it, docTexto(S.D), { profesor: false })}</div>`;
      return `<div class="dv${S.full ? ' dv-full' : ''}"><div class="dv-in">${interiorHTML()}</div></div>`;
    },
    leer() { return { texto: resumenTexto(cont, S.emp, S.D), doc: docTexto(S.D) }; },
    imprimirHTML(d) { return despachoLecturaHTML(it, d, { profesor: false }); },
    enlazar(f, alCambiar) {
      S.f = f; S.alCambiar = alCambiar;
      f.addEventListener('pointerdown', onDown); f.addEventListener('pointermove', onMove); f.addEventListener('pointerup', onUp); f.addEventListener('pointercancel', onUp);
      f.addEventListener('click', onClick); f.addEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis); document.addEventListener('visibilitychange', onVis);
      clearInterval(S.tReg); S.tReg = setInterval(() => { if (!S.f?.isConnected) { clearInterval(S.tReg); document.removeEventListener('visibilitychange', onVis); S.unsub?.(); S.unsub = null; cerrarModal(); return; } if (document.visibilityState === 'visible' && !S.ro) S.D.reg.seg = (S.D.reg.seg || 0) + 15; }, 15000);
      setTimeout(revisarLlamadas, 50);
    },
    enlazarLectura(f) { S.f = f; },
    pausaGuardado: 900,
    // Antes de entregar: resumen (trabajos colocados, avisos pendientes, llamadas atendidas)
    resumenEntrega() {
      const c = contador(cont, S.emp, S.D.b); const nR = c.A.filter((a) => a.nivel === 'rojo').length; const pi = pendInc().length;
      return `Vas a entregar tu planificación:\n\n· Trabajos colocados: ${c.colocados} de ${c.total}\n· Avisos pendientes: ${c.avisos}${nR ? ` (${nR} rojos)` : ''}\n· Llamadas atendidas: ${S.D.at.length}${pi ? ` (${pi} sin incidencia)` : ''}\n· Incidencias escritas: ${S.D.inc.length}\n\nDespués de entregar ya no podrás mover el tablero. ¿Entregar?`;
    },
  };
  return editor;
}

// ---------- Panel de la centralita (profesor, dentro de la corrección) ----------
export function montarCentralita(el, { db, it, g, numeros, trabajoDe }) {
  if (!el || !it?.contenido?.empresas) return;
  const cont = it.contenido; const id = idCentral(it.id, g.id);
  const prev = el._dv; if (prev && prev.id === id) { prev.numeros = numeros; prev.trabajoDe = trabajoDe; prev.pintar(); return; }
  prev?.unsub?.();
  const S = { id, x: { asign: {}, llamadas: [] }, numeros, trabajoDe, msg: '', unsub: null, pintar };
  el._dv = S;
  const empAl = (n) => { const tr = S.trabajoDe(n); const D = leerDoc(tr?.doc); return { emp: empresaPara(cont, { itemId: it.id, numero: n, asign: S.x.asign, docEmp: D?.emp, tableroVacio: !D || (!Object.keys(D.b).length && !D.h.length) }), D }; };
  async function guardar(nuevo, msg) {
    const datos = { item: it.id, grupo: g.id, asign: nuevo.asign ?? S.x.asign ?? {}, llamadas: (nuevo.llamadas ?? S.x.llamadas ?? []).slice(-200), fecha: serverTimestamp() };
    try { await setDoc(doc(db, 'despachos', id), datos); S.msg = msg; } catch (e) { S.msg = e?.code === 'permission-denied' ? 'No se ha podido guardar: faltan las reglas nuevas de Firestore (despachos).' : 'No se ha podido guardar (¿sin conexión?).'; }
    pintar();
  }
  function lanzada(e, k, n) { return S.x.llamadas.filter((l) => l.k === k && (!l.e || l.e === e) && (!n || !l.n || l.n === n)).sort((a, b) => b.t - a.t)[0]; }
  function pintar() {
    if (!el.isConnected) { S.unsub?.(); return; }
    const filasA = S.numeros.map((n) => ({ n, ...empAl(n) }));
    const porEmp = (e) => filasA.filter((f) => f.emp === e).map((f) => f.n);
    const abierto = el.querySelector('details')?.open ?? true;
    el.innerHTML = `<details class="dv-central pn-card" ${abierto ? 'open' : ''}><summary>${ic('radio')} <b>Centralita y empresas</b> <span class="pn-small">${cont.empresas.length} empresas · ${S.numeros.length} alumnos · ${S.x.llamadas.length} llamadas lanzadas</span></summary>
      <div class="dv-cg">
        <section><h5>${ic('briefcase')} Empresa de cada alumno</h5>
          <div class="pn-acts"><button type="button" class="btn small" data-cv="repartir">${ic('shuffle')} Repartir al azar (equilibrado)</button><button type="button" class="btn small" data-cv="limpiar">${ic('eraser')} Quitar asignaciones</button></div>
          <p class="pn-small">Sin asignar, cada alumno recibe una empresa al azar (siempre la misma). Si ya ha empezado, conserva su tablero.</p>
          <div class="dv-asgt">${filasA.map((f) => { const D = f.D; const pr = S.x.asign[String(f.n)] || ''; const c = D ? contador(cont, empDe(cont, D.emp), D.b) : null;
            return `<label class="dv-asgf"><span>nº <b>${pad(f.n)}</b></span><select data-cv="asign" data-n="${f.n}"><option value="">Azar (${esc(empDe(cont, empresaAzar(cont, it.id, f.n)).nombre)})</option>${cont.empresas.map((e) => `<option value="${esc(e.id)}" ${pr === e.id ? 'selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select><span class="pn-small">${c ? `${esc(empDe(cont, D.emp).nombre)} · ${c.colocados}/${c.total} · ${D.at.length} llam.` : 'sin empezar'}</span></label>`; }).join('')}</div></section>
        <section><h5>${ic('radio')} Llamadas</h5>
          <div class="pn-acts">${[0, 1, 2, 3, 4, 5].filter((k) => cont.empresas.some((e) => e.llamadas[k])).map((k) => `<button type="button" class="btn small primary" data-cv="lanzarTodos" data-k="${k}">${ic('send')} Llamada ${k + 1} a todo el grupo</button>`).join('')}</div>
          <p class="pn-small">«A todo el grupo»: cada alumno recibe la llamada de SU empresa. Si no está conectado, la verá al entrar.</p>
          ${cont.empresas.map((e) => `<div class="dv-cemp"><b>${esc(e.nombre)}</b> <span class="pn-small">alumnos: ${porEmp(e.id).map(pad).join(', ') || '—'}</span>
            ${e.llamadas.map((l, k) => { const la = lanzada(e.id, k); return `<div class="dv-cll"><div><b>${k + 1}.</b> ${l.cuando ? `<b>${esc(l.cuando)}</b> · ` : ''}${l.tipo ? `<i>${esc(l.tipo)}</i> · ` : ''}${esc(l.texto)}${la ? `<div class="pn-small dv-lz">${ic('check')} Lanzada ${la.n ? `al nº ${pad(la.n)}` : la.e ? 'a esta empresa' : 'a todo el grupo'} · ${esc(fHora(la.t))}</div>` : ''}</div>
              <div class="dv-clb"><button type="button" class="btn small" data-cv="lanzarEmp" data-e="${esc(e.id)}" data-k="${k}">${ic('send')} Lanzar a su empresa</button><select data-cv-n="${esc(e.id)}_${k}" aria-label="Alumno">${porEmp(e.id).map((n) => `<option value="${n}">nº ${pad(n)}</option>`).join('') || '<option value="">—</option>'}</select><button type="button" class="btn small" data-cv="lanzarUno" data-e="${esc(e.id)}" data-k="${k}">${ic('user')} A un alumno</button></div></div>`; }).join('') || '<p class="pn-small">Sin llamadas.</p>'}</div>`).join('')}
        </section></div>${S.msg ? `<p class="pn-small dv-cmsg">${esc(S.msg)}</p>` : ''}</details>`;
  }
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cv]'); if (!b || b.tagName === 'SELECT') return; const a = b.dataset.cv; const k = +b.dataset.k; const t = Date.now();
    if (a === 'repartir') return guardar({ asign: repartir(cont, S.numeros) }, 'Empresas repartidas al azar.');
    if (a === 'limpiar') return guardar({ asign: {} }, 'Asignaciones quitadas: cada alumno recibe una al azar.');
    if (a === 'lanzarTodos') return guardar({ llamadas: [...S.x.llamadas, { e: '', k, n: 0, t }] }, `Llamada ${k + 1} lanzada a todo el grupo.`);
    if (a === 'lanzarEmp') return guardar({ llamadas: [...S.x.llamadas, { e: b.dataset.e, k, n: 0, t }] }, `Llamada ${k + 1} lanzada a ${empDe(cont, b.dataset.e).nombre}.`);
    if (a === 'lanzarUno') { const n = +el.querySelector(`[data-cv-n="${b.dataset.e}_${k}"]`)?.value; if (!n) return; return guardar({ llamadas: [...S.x.llamadas, { e: b.dataset.e, k, n, t }] }, `Llamada ${k + 1} lanzada al nº ${pad(n)}.`); }
  });
  el.addEventListener('change', (e) => { const s = e.target.closest('[data-cv=asign]'); if (!s) return; const as = { ...S.x.asign }; if (s.value) as[s.dataset.n] = s.value; else delete as[s.dataset.n]; guardar({ asign: as }, `nº ${pad(s.dataset.n)}: ${s.value ? empDe(cont, s.value).nombre : 'al azar'}.`); });
  S.unsub = onSnapshot(doc(db, 'despachos', id), (d) => { const x = d.exists() ? d.data() : {}; S.x = { asign: x.asign || {}, llamadas: Array.isArray(x.llamadas) ? x.llamadas : [] }; pintar(); }, () => { S.msg = 'No se puede leer la centralita: faltan las reglas nuevas de Firestore (despachos).'; pintar(); });
  pintar();
}
