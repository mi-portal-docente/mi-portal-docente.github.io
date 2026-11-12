// Convierte el contenido real de Classroom (contenido_<ASIG>_2627.md, copiado en modo lectura) a la
// semilla del portal (tools/src/lms/semilla/<asig>.json, formato portal-docente/classroom@1).
//   node importar-classroom.mjs [carpeta]      (o CLASSROOM_DIR; por defecto /workspace/classroom-inventario)
// Mantiene el orden de temas y elementos, el tipo, el estado (Borrador se queda en borrador), la fecha,
// los puntos, las instrucciones y los adjuntos. Los enlaces de Formularios «/edit» se cambian a «/viewform»
// (la versión para responder). Los extras del portal (lms/semilla/extras.json) se añaden al final.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const DIR = dirname(fileURLToPath(import.meta.url));
const SEM = join(DIR, 'src', 'lms', 'semilla');
const ORIGEN = process.argv[2] || process.env.CLASSROOM_DIR || '/workspace/classroom-inventario';
const MAPA = { EEE: 'eee', TIC1: 'tic1', CDPC: 'cdpc1', CDPC1: 'cdpc1', TIC2: 'tic2', PROYECTO: 'proy2', PROY: 'proy2' };
const MESES = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sept: 9, sep: 9, oct: 10, nov: 11, dic: 12 };
const NO_TEMAS = /^(accesibilidad|notas?|observaciones|convenciones)/i;

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'tema';
export function limpiaUrl(u) {
  let s = u.replace(/[).,;”"]+$/, '');
  s = s.replace(/([?&])authuser=\d+&?/, '$1').replace(/[?&]$/, '');
  s = s.replace(/(docs\.google\.com\/forms\/d\/[^/]+)\/edit[^\s]*/, '$1/viewform');
  return s;
}
// Pone saltos de línea donde Classroom los perdió al copiar (fin de frase pegado a la siguiente).
export function parrafos(t) {
  return t.replace(/\s+/g, ' ')
    .replace(/(?<!\d)([.:!?])\s*(?=[A-ZÁÉÍÓÚÑ¿¡][a-záéíóúñ])/g, '$1\n')
    .replace(/\.\s*-\s*/g, '.\n- ')
    .replace(/\s(?=\d+\.\d+\.\s)/g, '\n')
    .replace(/\s(?=\d\)\s?[A-ZÁÉÍÓÚ])/g, '\n')
    .replace(/\s+(?=PASO \d)/g, '\n\n').trim();
}
function fechaDe(txt, anioCurso) {
  const m = txt.match(/(?:Fecha(?: de entrega)?|Entrega):\s*(\d{1,2})\s+([a-z]+)\.?,?\s*(\d{1,2}:\d{2})?/i);
  if (!m || !MESES[m[2].toLowerCase()]) return null;
  const mes = MESES[m[2].toLowerCase()]; const anio = mes >= 8 ? anioCurso : anioCurso + 1;
  return `${anio}-${String(mes).padStart(2, '0')}-${m[1].padStart(2, '0')}T${(m[3] || '23:59').padStart(5, '0')}`;
}
// El portal no lleva el nombre del centro: se sustituye en títulos e instrucciones.
export function neutro(t) {
  return String(t).replace(/\ben Salesianos\b/gi, 'en el cole').replace(/\bserie Salesiana\b/gi, 'serie del cole')
    .replace(/\bSalesian[oa]s?\b/gi, 'el centro');
}
function tipoDe(t) {
  const x = t.toLowerCase();
  if (x.startsWith('tarea (cuestionario)') || x.startsWith('tarea de cuestionario')) return 'cuestionario';
  if (x.startsWith('tarea')) return 'tarea'; if (x.startsWith('material')) return 'material'; if (x.startsWith('pregunta')) return 'pregunta';
  return null;
}
function adjuntos(blob) {
  const out = []; const vistos = new Set();
  const add = (titulo, url, tipo) => { const u = limpiaUrl(url); if (vistos.has(u)) return; vistos.add(u); out.push({ titulo: titulo || new URL(u).hostname.replace(/^www\./, ''), url: u, ...(tipo ? { tipo } : {}) }); };
  for (const m of blob.matchAll(/“([^”]+)”\s*—\s*([^—\n]+?)\s*—\s*(https?:\/\/[^\s;]+)/g)) add(m[1].trim(), m[3], m[2].trim());
  for (const m of blob.matchAll(/(?:Enlace(?: web| del material)?|URL):\s*(https?:\/\/[^\s;]+)/gi)) add('', m[1]);
  for (const m of blob.matchAll(/https?:\/\/[^\s;”]+/g)) add('', m[0]);
  return out;
}
function instrucciones(blob) {
  // texto entre comillas tras «Instrucciones…:», «instrucciones:», «instructions…:» o directamente «— “…”»
  const m = blob.match(/(?:instrucciones|instructions)[^:“\n.]*:\s*“/i) || blob.match(/\*\*\s*—\s*“/);
  if (!m) return '';
  const ini = m.index + m[0].length; const fin = blob.lastIndexOf('”');
  if (fin <= ini) return '';
  return parrafos(blob.slice(ini, fin));
}
export function parsear(md, { anioCurso = 2026 } = {}) {
  const lineas = md.split('\n'); const temas = []; let t = null; let it = null; let enLista = false;
  const cerrar = () => { if (it && t) t.items.push(it); it = null; };
  for (const l of lineas) {
    const h = l.match(/^##\s+(.+?)\s*$/);
    if (h) { cerrar(); if (NO_TEMAS.test(h[1])) { t = null; continue; } t = { nombre: h[1], items: [], intro: '' }; temas.push(t); enLista = false; continue; }
    if (!t) continue;
    const m = l.match(/^(?:\d+\.|[-*])\s+\*\*(.+?)\*\*(.*)$/);
    if (m) { cerrar(); enLista = true; it = { cab: m[1].trim(), resto: m[2], blob: l }; continue; }
    if (it && /^\s+\S/.test(l)) { it.blob += '\n' + l; continue; }
    if (!enLista && l.trim()) t.intro += ' ' + l;
  }
  cerrar();
  return temas.map((t, ti) => {
    const porDefecto = { estado: /borrador/i.test(t.intro) ? 'borrador' : null, tipo: /Todos:\s*\*\*Tarea/i.test(t.intro) ? 'tarea' : null };
    const sinTema = /^sin tema$/i.test(t.nombre.trim());
    const id = sinTema ? 'sin-tema' : `t${String(ti).padStart(2, '0')}-${slug(t.nombre)}`;
    return { id, nombre: t.nombre, ...(sinTema ? { sinTema: true } : {}), items: t.items.map((x, i) => {
      const p = x.cab.split(/\s+—\s+/); const tipo = tipoDe(p[0]);
      let titulo = (tipo ? p.slice(1).join(' — ') : x.cab).trim();
      if (/^“[^”]*”$/.test(titulo)) titulo = titulo.slice(1, -1);
      const est = x.blob.match(/Estado:\s*(Borrador|Publicado|Programado)/i) || (x.resto || '').match(/^\s*—\s*(Borrador|Publicado|Programado)\b/i);
      const estado = est ? est[1].toLowerCase() : porDefecto.estado || 'publicado';
      const pts = x.blob.match(/Puntos:\s*(\d+(?:[.,]\d+)?)/i) || x.blob.match(/(\d+(?:[.,]\d+)?)\s+puntos\b/i);
      const fecha = fechaDe(x.blob, anioCurso);
      const sinDia = !fecha && /Fecha:\s*\d{1,2}:\d{2}/.test(x.blob);
      const ins = instrucciones(x.blob);
      const notas = [];
      if (sinDia) notas.push('En Classroom la fecha de entrega se veía solo con la hora (23:59): revisa el día.');
      if (/nombres de estudiantes omitidos/i.test(x.blob)) notas.push('Se quitaron nombres de alumnos de las instrucciones.');
      if (!fecha && /entrega:\s*(mañana|hoy|ayer)/i.test(x.blob)) notas.push('En Classroom la entrega aparecía como fecha relativa («' + x.blob.match(/entrega:\s*([^.(]+)/i)[1].trim() + '»): pon el día exacto.');
      const enl = adjuntos(x.blob.replace(/“[^”]*”\s*(?=$)/, ''));
      const tipoF = tipo || porDefecto.tipo || 'tarea';
      const falta = [!ins && 'instrucciones', !enl.length && 'adjuntos/enlaces', tipoF !== 'material' && !pts && 'puntos', tipoF !== 'material' && !fecha && 'fecha de entrega'].filter(Boolean);
      const pendiente = !ins && !enl.length;
      if (pendiente) notas.unshift(`Pendiente de completar: en la copia de Classroom no constan ${falta.join(', ')}.`);
      return { id: `${id}.${String(i + 1).padStart(2, '0')}`, tipo: tipoF, titulo: neutro(titulo).slice(0, 150), estado,
        ...(fecha ? { fechaEntrega: fecha } : {}), ...(pts ? { puntos: Number(pts[1].replace(',', '.')) } : {}),
        ...(ins ? { instrucciones: neutro(ins.replace(/\[nombres de estudiantes omitidos\]/gi, '(reparto en clase)')) } : {}),
        enlaces: enl.map((e) => ({ ...e, titulo: neutro(e.titulo) })), real: true, ...(pendiente ? { pendiente: true } : {}), ...(notas.length ? { nota: notas.join(' ') } : {}) };
    }) };
  });
}
function extras(asig) {
  const f = join(SEM, 'extras.json'); if (!existsSync(f)) return null;
  return JSON.parse(readFileSync(f, 'utf8'))[asig] || null;
}
// Aplica los extras del portal: instrucciones y PDFs alojados en la web para elementos concretos
// (por título) y elementos nuevos al final de un tema.
function aplicarExtras(asig, temas) {
  const ex = extras(asig); if (!ex) return;
  for (const e of ex.completar || []) {
    const t = temas.find((x) => x.nombre === e.tema); const it = t?.items.find((x) => x.titulo === e.titulo);
    if (!it) { console.warn(`  ⚠ extra sin destino: ${e.tema} › ${e.titulo}`); continue; }
    if (e.instrucciones && !it.instrucciones) it.instrucciones = e.instrucciones;
    it.enlaces = [...(e.enlacesAntes || []), ...it.enlaces, ...(e.enlaces || [])];
  }
  for (const e of ex.nuevos || []) {
    const t = temas.find((x) => x.nombre === e.tema); if (!t) { console.warn(`  ⚠ tema no encontrado: ${e.tema}`); continue; }
    t.items.push({ ...e.item, id: `${t.id}.${e.item.id}` });
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = readdirSync(ORIGEN).filter((f) => /^contenido_([A-Z0-9]+)_(\d{4})\.md$/.test(f));
  if (!files.length) { console.log('No hay archivos contenido_<ASIG>_2627.md en ' + ORIGEN); process.exit(0); }
  for (const f of files) {
    const [, cod, curso] = f.match(/^contenido_([A-Z0-9]+)_(\d{4})\.md$/);
    const asig = MAPA[cod]; if (!asig) { console.warn('¿Asignatura desconocida? ' + f); continue; }
    const md = readFileSync(join(ORIGEN, f), 'utf8');
    const clase = (md.match(/^Clase:\s*(.+)$/m) || md.match(/^#\s+(.+)$/m) || [])[1] || '';
    const temas = parsear(md, { anioCurso: 2000 + +curso.slice(0, 2) });
    aplicarExtras(asig, temas);
    const anterior = existsSync(join(SEM, asig + '.json')) ? JSON.parse(readFileSync(join(SEM, asig + '.json'), 'utf8')) : {};
    const s = { formato: 'portal-docente/classroom@1', asignatura: asig, clase: clase.trim(), cursoEscolar: `${curso.slice(0, 2)}/${curso.slice(2)}`,
      fuente: `Copia de solo lectura de «Trabajo de clase» de Google Classroom (${f}). Mismo orden de temas y elementos; los borradores siguen en borrador.`,
      ...(anterior.temasAnteriores ? { temasAnteriores: anterior.temasAnteriores } : {}), temas };
    writeFileSync(join(SEM, asig + '.json'), JSON.stringify(s, null, 1) + '\n');
    const n = temas.reduce((a, t) => a + t.items.length, 0);
    console.log(`✔ ${f} → semilla/${asig}.json · ${temas.length} temas · ${n} elementos · ${temas.flatMap((t) => t.items).filter((i) => i.estado === 'borrador').length} borradores`);
  }
}
