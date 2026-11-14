// P3 · Evidencias ligeras de una actividad (para reclamaciones) y visor.
//  · «Exportar evidencias» (profesor): un JSON por actividad con enunciado, preguntas, rúbrica y, por cada nº de lista,
//    su respuesta o documento, enlaces con su fecha, copias congeladas (nombre, fecha y huella; sin los bytes: la copia
//    sigue en el portal y va entera en «Exportar todo»), nota y puntuación, fechas, versiones, registro de edición,
//    salidas y bloqueos de la prueba y comentarios. Sin nombres: solo grupo y nº de lista.
//  · Visor: abre ese JSON en el propio navegador (no se sube a ningún sitio) e imprime a PDF un solo alumno.
import { collection, getDocs, query, where } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { aJSON } from '../lms/copia.js';
import { fmtNota, semillaAlumno } from '../lms/modelo.js';
import { limpiarDoc } from '../lms/doc-html.js';
import { valoresAlumno, sustituir } from '../lms/formula.js';
import { resumenSalidas } from './modo-examen.js';

export const FORMATO_EVIDENCIAS = 'superprofe/evidencias@1';
const hoy = (d = new Date()) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const slug = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
export const nombreEvidencias = (it, d) => `${hoy(d)}_Evidencias_${slug(it.asig)}_${slug(it.titulo)}.json`;
const sinBytes = ({ data: _d, ...c }) => c;
const porAl = (L) => { const m = new Map(); for (const x of L) { const k = x.al || `${x.grupo}_${x.numero}`; if (!m.has(k)) m.set(k, []); m.get(k).push(x); } return m; };

export async function leerEvidencias(db, it, { aula, grupos = new Map() } = {}) {
  const q = (col) => getDocs(query(collection(db, col), where('item', '==', it.id))).then((qs) => qs.docs.map((d) => ({ id: d.id, ...aJSON(d.data()) }))).catch(() => []);
  const [trabajos, notas, versiones, registros, incidencias, pruebas] = await Promise.all(['trabajos', 'notas', 'versiones', 'registros', 'incidencias', 'pruebas'].map(q));
  let examen = null, claves = null;
  if (it.tipo === 'examen' && aula?.examen) { try { const r = await aula.examen(it.id, { claves: true }); examen = r.examen; claves = r.claves; } catch (e) { /* sin examen */ } }
  const sub = async (tid, col) => getDocs(collection(db, 'trabajos', tid, col)).then((qs) => qs.docs.map((d) => ({ id: d.id, ...aJSON(sinBytes(d.data())) }))).catch(() => []);
  const extra = new Map();
  for (const t of trabajos) extra.set(t.id, { comentarios: await sub(t.id, 'comentarios'), copias: await sub(t.id, 'copias') });
  const T = new Map(trabajos.map((t) => [t.al, t])); const N = new Map(notas.map((n) => [n.al, n]));
  const V = porAl(versiones); const R = new Map(registros.map((r) => [r.al, r])); const I = new Map(incidencias.map((r) => [r.al, r])); const P = new Map(pruebas.map((r) => [r.al, r]));
  const als = [...new Set([...T.keys(), ...N.keys(), ...I.keys(), ...P.keys()])].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  const varQ = (examen?.preguntas || []).filter((x) => x.tipo === 'variables');
  return {
    formato: FORMATO_EVIDENCIAS, fecha: new Date().toISOString(),
    elemento: { id: it.id, titulo: it.titulo, tipo: it.tipo, asig: it.asig, curso: it.curso, texto: it.texto || '', criterio: it.criterio || null, rubrica: it.rubrica || [], puntos: it.puntos ?? null,
      fechaEntrega: it.fechaEntrega || null, copia: it.copia !== false, sinExternos: !!(it.sinExternos || it.examen?.sinExternos), contenido: it.contenido || null,
      examen: examen ? { desde: examen.desde, hasta: examen.hasta, limiteMin: examen.limiteMin, barajar: examen.barajar, preguntas: examen.preguntas || [] } : null, claves: claves?.respuestas || null },
    alumnos: als.map((al) => {
      const t = T.get(al) || null; const [grupo, numero] = al.split('_'); const x = t ? extra.get(t.id) : null;
      return {
        al, grupo, grupoNombre: grupos.get(grupo)?.nombre || grupo, numero: Number(numero),
        trabajo: t ? { estado: t.estado || 'entregado', fecha: t.fecha, inicio: t.inicio || null, entregadoEn: t.entregadoEn || null, nEntregas: t.nEntregas || null, devFecha: t.devFecha || null,
          texto: t.texto || '', doc: t.doc || null, respuestas: t.respuestas || null, enlaces: (t.enlaces || []).map((u, i) => ({ u, fecha: t.enlacesT?.[i] || null })), modelo: t.modelo || null } : null,
        datosExamen: varQ.length ? Object.fromEntries(varQ.map((qq) => [qq.id, valoresAlumno(qq.variables, semillaAlumno(it.id, al), qq.id)])) : null,
        copias: x?.copias || [], comentarios: x?.comentarios || [],
        nota: N.get(al) || null, versiones: (V.get(al) || []).sort((a, b) => (a.n || 0) - (b.n || 0)),
        registro: R.get(al) || null, incidencias: I.get(al)?.salidas || [], prueba: P.get(al) ? { nBloqueos: P.get(al).nBloqueos || 0, bloqueado: !!P.get(al).bloqueado } : null,
      };
    }),
  };
}
export async function exportarEvidencias(db, it, opts) {
  const E = await leerEvidencias(db, it, opts);
  const b = new Blob([JSON.stringify(E, null, 1)], { type: 'application/json' }); const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = nombreEvidencias(it); document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  return E;
}

// ---------------------------------------------------------------- visor (página dentro del portal)
const f = (x) => { const t = x?.__fecha ? Date.parse(x.__fecha) : typeof x === 'number' ? x : null; return t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—'; };
const CSS = `.ev-capa{position:fixed;inset:0;z-index:2147482000;overflow:auto;background:var(--fondo,#f5f5f7);color:var(--tinta,#1d1d1f);padding:16px}
.ev-cab{display:flex;gap:10px;align-items:center;flex-wrap:wrap;position:sticky;top:0;background:inherit;padding:8px 0;z-index:1}
.ev-al{background:var(--card,#fff);border-radius:14px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.ev-al h3{margin:0 0 6px}.ev-al table{border-collapse:collapse;width:100%;font-size:.9rem}.ev-al td,.ev-al th{border-bottom:1px solid rgba(0,0,0,.08);padding:4px 6px;text-align:left;vertical-align:top}
.ev-doc{border:1px solid rgba(0,0,0,.12);border-radius:10px;padding:10px;max-height:420px;overflow:auto;background:#fff;color:#1d1d1f}
@media print{body.ev-imp>*:not(.ev-capa){display:none!important}.ev-capa{position:static;overflow:visible;padding:0;background:#fff;color:#000}.ev-cab,.ev-al:not(.ev-sel),.ev-noimp{display:none!important}.ev-doc{max-height:none}}`;
const respTxt = (q, r) => { if (r == null || r === '') return '—'; if (q.tipo === 'test') return (q.opciones || [])[r] ?? String(r); if (q.tipo === 'vf') return r ? 'Verdadero' : 'Falso'; return typeof r === 'string' ? r : JSON.stringify(r); };
function alumnoHTML(E, a) {
  const t = a.trabajo; const n = a.nota; const el = E.elemento;
  const sal = resumenSalidas(a.incidencias || []);
  return `<section class="ev-al" data-al="${esc(a.al)}"><h3>${esc(a.grupoNombre)} · nº ${String(a.numero).padStart(2, '0')}</h3>
    <div class="ev-noimp"><button class="btn small" data-ev="imprimir">${ic('printer')} Imprimir / PDF de este alumno</button></div>
    <table><tbody>
      <tr><th>Estado</th><td>${esc(t?.estado || 'sin entrega')}${t?.nEntregas ? ` · ${t.nEntregas} entrega(s)` : ''}</td></tr>
      <tr><th>Fechas</th><td>${t ? `Última escritura ${f(t.fecha)}${t.inicio ? ' · inicio ' + f(t.inicio) : ''}${t.entregadoEn ? ' · entregado ' + f(t.entregadoEn) : ''}${t.devFecha ? ' · devuelto ' + f(t.devFecha) : ''}` : '—'}</td></tr>
      <tr><th>Nota</th><td>${n && n.nota != null ? `<b>${esc(fmtNota(n.nota))}</b>${n.puntos != null ? ` (${esc(fmtNota(n.puntos))} / ${esc(fmtNota(n.max))})` : ''} · ${n.publicada ? 'publicada' : 'sin publicar'}${n.comentario ? ' · ' + esc(n.comentario) : ''}` : '—'}</td></tr>
      ${a.datosExamen ? `<tr><th>Datos de sus preguntas</th><td>${Object.entries(a.datosExamen).map(([q, v]) => `${esc(q)}: ${esc(Object.entries(v).map(([k, x]) => `${k} = ${x}`).join(', '))}`).join(' · ')}</td></tr>` : ''}
      <tr><th>Enlaces</th><td>${(t?.enlaces || []).map((e) => `${esc(e.u)} <span class="pn-small">(añadido ${f(e.fecha)}; enlace vivo)</span>`).join('<br>') || '—'}</td></tr>
      <tr><th>Copias congeladas</th><td>${a.copias.map((c) => `${esc(c.nombre)} · ${esc(c.tipo)} · ${Math.round((c.bytes || 0) / 1024)} KB · ${f(c.fecha)}<br><code>SHA-256 ${esc(c.hash)}</code>`).join('<br>') || '—'}</td></tr>
      <tr><th>Salidas / bloqueos</th><td>${sal.length ? sal.map((s) => `${new Date(s.t).toLocaleTimeString('es-ES')} ${esc(s.tipo)}${s.dur != null ? ` (${s.dur} s)` : ''}`).join(' · ') : '—'}${a.prueba ? ` · bloqueos: ${a.prueba.nBloqueos}` : ''}</td></tr>
      <tr><th>Registro de edición</th><td>${a.registro ? `${Math.round((a.registro.seg || 0) / 60)} min escribiendo${a.registro.pegados?.length ? ` · ${a.registro.pegados.length} pegado(s)` : ''}` : '—'}</td></tr>
      <tr><th>Versiones</th><td>${a.versiones.map((v) => `${v.n}.ª · ${f(v.fecha)}`).join(' · ') || '—'}</td></tr>
      <tr><th>Comentarios</th><td>${a.comentarios.map((c) => `${f(c.fecha)} ${esc(c.autor)}: ${esc(c.texto)}`).join('<br>') || '—'}</td></tr>
    </tbody></table>
    ${t?.respuestas ? `<h4>Respuestas</h4><ol>${(el.examen?.preguntas || []).map((q) => `<li>${esc(q.tipo === 'variables' && a.datosExamen?.[q.id] ? sustituir(q.enunciado, a.datosExamen[q.id]) : q.enunciado)}<br><b>${esc(respTxt(q, t.respuestas[q.id]))}</b>${n?.detalle?.[q.id] != null ? ` · ${esc(fmtNota(n.detalle[q.id]))} pt` : ''}</li>`).join('')}</ol>` : ''}
    ${t?.doc ? `<h4>Documento entregado</h4><div class="ev-doc">${String(t.doc).startsWith('{"v":1') ? '<p class="pn-small">(hoja de cálculo: ver en el portal)</p>' : limpiarDoc(t.doc)}</div>` : t?.texto ? `<h4>Respuesta</h4><div class="ev-doc">${esc(t.texto).replace(/\n/g, '<br>')}</div>` : ''}
  </section>`;
}
export function abrirVisor(E) {
  if (E?.formato !== FORMATO_EVIDENCIAS) throw new Error('Este archivo no es de «Exportar evidencias».');
  if (!document.getElementById('ev-css')) { const s = document.createElement('style'); s.id = 'ev-css'; s.textContent = CSS; document.head.appendChild(s); }
  document.querySelector('.ev-capa')?.remove();
  const el = E.elemento; const c = document.createElement('div'); c.className = 'ev-capa'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', 'Evidencias');
  c.innerHTML = `<div class="ev-cab"><h2 style="margin:0">${ic('file-text')} ${esc(el.titulo)}</h2><span class="pn-small">${esc(el.asig)} · ${esc(el.tipo)} · exportado ${f({ __fecha: E.fecha })} · ${E.alumnos.length} alumno(s)</span><span style="flex:1"></span><button class="btn" data-ev="cerrar">Cerrar</button></div>
    ${el.texto ? `<details class="ev-al"><summary><b>Enunciado y rúbrica</b></summary><div>${esc(el.texto).replace(/\n/g, '<br>')}</div>${el.rubrica?.length ? `<ul>${el.rubrica.map((r) => `<li>${esc(r.c)} · ${esc(r.p)}</li>`).join('')}</ul>` : ''}</details>` : ''}
    ${E.alumnos.map((a) => alumnoHTML(E, a)).join('') || '<p>Sin datos del alumnado.</p>'}`;
  c.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ev]'); if (!b) return;
    if (b.dataset.ev === 'cerrar') { c.remove(); document.body.classList.remove('ev-imp'); }
    if (b.dataset.ev === 'imprimir') {
      c.querySelectorAll('.ev-al').forEach((s) => s.classList.remove('ev-sel')); b.closest('.ev-al').classList.add('ev-sel'); document.body.classList.add('ev-imp');
      const fin = () => { document.body.classList.remove('ev-imp'); window.removeEventListener('afterprint', fin); }; window.addEventListener('afterprint', fin); window.print(); setTimeout(fin, 1500);
    }
  });
  document.body.appendChild(c);
}
export function elegirYAbrirVisor() {
  return new Promise((res, rej) => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json';
    i.onchange = async () => { try { const t = await i.files[0].text(); abrirVisor(JSON.parse(t)); res(); } catch (e) { rej(e); } };
    i.click();
  });
}
