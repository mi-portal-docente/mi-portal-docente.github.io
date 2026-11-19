// v5 · «Exportar asignatura en PDF» para otro compañero. Lógica pura (sin Firebase ni DOM): qué entra en el ZIP,
// con qué carpeta y nombre, el manifiesto y el texto de las preguntas de los cuestionarios para pasarlos a PDF.
//  ZIP: 1_Teoria/, 2_Ejercicios_clase/, 3_Tareas/, 4_Test/, 5_Examenes/, 6_Laboratorio/ con una carpeta por tema,
//  indice.pdf y manifiesto.json (sección, tema, título, archivo, origen). Sin datos de alumnos: solo lo que prepara
//  el profesor (elementos, archivos del portal, preguntas y soluciones). El portal no se conecta a Drive.
import { SECCIONES, seccionDe } from './secciones.js';
import { pdfDe } from './caras.js';
import { alternativas } from './preguntas.js';

export const FORMATO_MANIFIESTO = 'superprofe/exportacion@1';
// Nombre de archivo o carpeta sin tildes ni símbolos (vale en Windows, macOS, Linux y Drive)
export function nombreSeguro(t, max = 60) {
  const s = String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
    .replace(/[^A-Za-z0-9._-]+/g, '_').replace(/_+/g, '_').replace(/^[_.-]+|[_.-]+$/g, '');
  return (s || 'sin_nombre').slice(0, max).replace(/[_.-]+$/, '') || 'sin_nombre';
}
const pad2 = (n) => String(n).padStart(2, '0');
const RE_ARCH = /^#archivo\/([A-Za-z0-9]{6,40})(\/descarga)?$/;
const RE_MAT = /^materiales\/[\w\-./]+\.pdf$/i;

// PDF de un elemento: el oficial (campo «pdf» o el primer adjunto PDF) y los demás adjuntos PDF del portal.
export function pdfsDe(it) {
  const L = []; const vistos = new Set();
  const add = (x) => { const k = x.id || x.url; if (!k || vistos.has(k)) return; vistos.add(k); L.push(x); };
  const p = pdfDe(it);
  if (p) add(p.id ? { id: p.id, nombre: p.titulo } : { url: p.href, nombre: p.titulo });
  for (const e of it?.enlaces || []) {
    const u = String(e?.u || ''); const m = u.match(RE_ARCH);
    if (m && /\.pdf$/i.test(String(e.t || '').trim())) add({ id: m[1], nombre: e.t });
    else if (RE_MAT.test(u) && !u.includes('..')) add({ url: u, nombre: e.t || u.split('/').pop() });
  }
  return L;
}
const conPdf = (n) => (/\.pdf$/i.test(n) ? n : n + '.pdf');
const sinPdf = (n) => String(n || '').replace(/\.pdf$/i, '');
const esCuestionario = (it) => it?.tipo === 'examen';

// Plan del ZIP.
//  items: elementos de la asignatura (los de la papelera no entran) · temas: [{ id, nombre, orden }]
//  secciones: las de la asignatura (seccionesDe) · sel: { secciones: [ids], temas: [ids] | null } ('' = sin tema; null = todos)
//  → { entradas: [{ itemId, titulo, tipo, seccion, tema, carpeta, archivos: [{ ruta, id? | url? | cuestionario: 'preguntas'|'soluciones' }] }] }
export function planExportar({ items = [], temas = [], secciones = SECCIONES, sel = {} } = {}) {
  const S = new Map(SECCIONES.map((s) => [s.id, s]));
  const okSec = new Set(sel.secciones || SECCIONES.map((s) => s.id).filter((x) => x !== 'avisos'));
  const okTema = sel.temas ? new Set(sel.temas) : null;
  const T = temas.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)); const idx = new Map(T.map((t, i) => [t.id, i]));
  const carpetaTema = (tid) => (idx.has(tid) ? `${pad2(idx.get(tid) + 1)}_${nombreSeguro(T[idx.get(tid)].nombre, 50)}` : '00_Sin_tema');
  const L = items.filter((it) => it && !it.papelera)
    .map((it) => ({ it, sec: seccionDe(it), tema: idx.has(it.tema) ? it.tema : '' }))
    .filter((x) => x.sec !== 'avisos' && okSec.has(x.sec) && (!okTema || okTema.has(x.tema)))
    .sort((a, b) => (S.get(a.sec).orden - S.get(b.sec).orden) || ((a.tema ? idx.get(a.tema) + 1 : 0) - (b.tema ? idx.get(b.tema) + 1 : 0)) || ((a.it.orden ?? 0) - (b.it.orden ?? 0)) || String(a.it.titulo).localeCompare(String(b.it.titulo), 'es', { numeric: true }));
  const usados = new Set(); const unico = (ruta) => { let r = ruta, n = 2; while (usados.has(r.toLowerCase())) r = ruta.replace(/(\.pdf)$/i, `_${n++}$1`); usados.add(r.toLowerCase()); return r; };
  const entradas = L.map(({ it, sec, tema }) => {
    const carpeta = `${S.get(sec).carpeta}/${carpetaTema(tema)}`; const base = nombreSeguro(it.titulo);
    const archivos = [];
    const P = pdfsDe(it);
    P.forEach((p, i) => archivos.push({ ruta: unico(`${carpeta}/${i === 0 ? base : base + '_' + nombreSeguro(sinPdf(p.nombre), 40)}.pdf`), ...(p.id ? { id: p.id } : { url: p.url }), nombre: conPdf(String(p.nombre || base)) }));
    if (esCuestionario(it)) {
      archivos.push({ ruta: unico(`${carpeta}/${base}${P.length ? '_cuestionario' : ''}.pdf`), cuestionario: 'preguntas' });
      archivos.push({ ruta: unico(`${carpeta}/${base}_soluciones.pdf`), cuestionario: 'soluciones' });
    }
    return { itemId: it.id, titulo: String(it.titulo || ''), tipo: it.tipo, seccion: sec, tema: tema ? T[idx.get(tema)].nombre : '', carpeta, archivos };
  });
  return { entradas };
}

// Manifiesto del ZIP (sin datos de alumnos). origenes: Map(itemId → { drive, ruta, version }) solo del profesor.
export function manifiesto(plan, { asignatura = '', curso = '', fecha = new Date().toISOString(), origenes = new Map(), fallos = [] } = {}) {
  const nomSec = (id) => SECCIONES.find((s) => s.id === id)?.nombre || id;
  const archivos = [];
  for (const e of plan.entradas) {
    const o = origenes.get(e.itemId) || null;
    const base = { seccion: e.seccion, seccionNombre: nomSec(e.seccion), tema: e.tema, titulo: e.titulo, tipo: e.tipo };
    if (!e.archivos.length) archivos.push({ ...base, archivo: null, ...(o ? { origen: o } : {}) });
    for (const a of e.archivos) archivos.push({ ...base, archivo: a.ruta, ...(a.cuestionario ? { contenido: a.cuestionario } : {}), ...(o ? { origen: o } : {}) });
  }
  return { formato: FORMATO_MANIFIESTO, asignatura, curso, fecha, total: archivos.filter((a) => a.archivo).length, archivos, ...(fallos.length ? { noIncluidos: fallos } : {}) };
}

// Texto de una pregunta (forma del profesor: exportarPregunta) para el PDF.
//  → { enunciado, lineas: [..] (opciones / lo que ve el alumno), solucion: [..] }
export function textoPregunta(q) {
  const L = []; const S = []; const letra = (i) => String.fromCharCode(97 + i) + ') ';
  const enunciado = String(q?.enunciado || '').trim();
  switch (q?.tipo) {
    case 'test': (q.opciones || []).forEach((o, i) => L.push(letra(i) + o)); S.push(letra(Number(q.correcta) || 0) + ((q.opciones || [])[Number(q.correcta) || 0] ?? '')); break;
    case 'vf': L.push('Verdadero / Falso'); S.push(q.correcta ? 'Verdadero' : 'Falso'); break;
    case 'corta': L.push('Respuesta: ______________________'); S.push((q.aceptadas || []).length ? 'Se acepta: ' + q.aceptadas.join(' · ') : 'La corrige el profesor.'); break;
    case 'emparejar': { const der = [...(q.pares || []).map((p) => p[1]), ...(q.distractores || [])].sort((a, b) => String(a).localeCompare(String(b), 'es'));
      (q.pares || []).forEach((p, i) => L.push(`${i + 1}. ${p[0]}`)); der.forEach((d, i) => L.push(letra(i) + d));
      (q.pares || []).forEach((p, i) => S.push(`${i + 1}. ${p[0]} → ${p[1]}`)); break; }
    case 'ordenar': [...(q.elementos || [])].sort((a, b) => String(a).localeCompare(String(b), 'es')).forEach((x) => L.push('[  ] ' + x)); (q.elementos || []).forEach((x, i) => S.push(`${i + 1}. ${x}`)); break;
    case 'huecos': L.push(String(q.texto || '').replace(/\[\[[^\]]*\]\]/g, '________')); { let n = 0; String(q.texto || '').replace(/\[\[([^\]]*)\]\]/g, (_, a) => { S.push(`Hueco ${++n}: ${alternativas(a).join(' / ')}`); return ''; }); } break;
    case 'numerica': L.push('Resultado: ____________' + (q.unidad ? ' ' + q.unidad : '')); S.push(`${q.valor}${q.unidad ? ' ' + q.unidad : ''}${q.tolerancia ? ` (tolerancia ${q.tolerancia}${q.modo === 'pct' ? ' %' : ''})` : ''}`); break;
    case 'variables': { const V = Object.entries(q.variables || {}).map(([k, v]) => `${k} = ${Array.isArray(v) ? v.join('…') : typeof v === 'object' && v ? `${v.min ?? ''}…${v.max ?? ''}` : v}`);
      if (V.length) L.push('Datos (cambian para cada alumno): ' + V.join(' · ')); L.push('Resultado: ____________' + (q.unidad ? ' ' + q.unidad : '')); S.push('Fórmula: ' + (q.formula || '')); break; }
    case 'zonas': L.push('(Pregunta sobre una imagen: márcala en la versión interactiva.)'); (q.zonas || []).filter((z) => z.correcta !== false).forEach((z) => S.push('Zona correcta: ' + (z.nombre || `${z.x}, ${z.y}`))); break;
    case 'clasificar': { const el = (q.grupos || []).flatMap((g) => g.elementos || []).sort((a, b) => String(a).localeCompare(String(b), 'es'));
      L.push('Grupos: ' + (q.grupos || []).map((g) => g.nombre).join(' · ')); el.forEach((x) => L.push('[  ] ' + x)); (q.grupos || []).forEach((g) => S.push(`${g.nombre}: ${(g.elementos || []).join(', ')}`)); break; }
    case 'tabla': L.push((q.columnas || []).join(' | ')); (q.filas || []).forEach((f) => L.push((f.c || []).map((x) => String(x).replace(/^\[\[[^\]]*\]\]$/, '____')).join(' | ')));
      (q.filas || []).forEach((f) => (f.c || []).forEach((x) => { const m = String(x).match(/^\[\[([^\]]*)\]\]$/); if (m) S.push(alternativas(m[1]).join(' / ')); })); break;
    case 'abierta': L.push(q.extension === 'larga' ? '(Respuesta desarrollada)' : '(Respuesta breve)'); S.push(q.rubrica?.length ? 'Rúbrica: ' + q.rubrica.map((r) => `${r.criterio || r.c} (${r.puntos ?? r.p})`).join(' · ') : 'La corrige el profesor.'); break;
    default: break;
  }
  return { enunciado, lineas: L, solucion: S };
}

// Texto apto para las fuentes estándar de PDF (WinAnsi): se conservan tildes, ñ, ¿ ¡ € y se cambian los demás signos.
const CAMBIOS = { '→': '->', '←': '<-', '≈': '~', '≤': '<=', '≥': '>=', '≠': '!=', '×': 'x', '÷': ':', 'Ω': 'ohm', 'µ': 'u', 'μ': 'u', '·': '·', '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '…': '...', '√': 'raiz', 'π': 'pi', '±': '+/-', '°': '°', '²': '²', '³': '³', '\u00a0': ' ' };
export function aWinAnsi(s) {
  return String(s ?? '').replace(/[^\n\x20-\x7e\u00a1-\u00ff€]/g, (c) => CAMBIOS[c] ?? (/\s/.test(c) ? ' ' : '?'));
}
