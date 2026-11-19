// Banco de preguntas por asignatura (lógica pura). Cada pregunta del banco lleva su criterio.
// Generar un examen = elegir n preguntas al azar de cada criterio.
import { barajar } from './modelo.js';
import { validarPregunta } from './preguntas.js';

// Cuántas preguntas hay de cada criterio. banco: [{id, criterio, q}]
export function porCriterio(banco) {
  const m = new Map();
  for (const b of banco) m.set(b.criterio, (m.get(b.criterio) || 0) + 1);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es', { numeric: true })).map(([criterio, n]) => ({ criterio, n }));
}
// pedir: {criterio: n}. Devuelve {preguntas, errores}. Las preguntas salen con ids q1, q2… (sin repetir)
export function generarExamen(banco, pedir, seed = Date.now()) {
  const errores = []; const out = [];
  let s = seed >>> 0 || 1;
  for (const [criterio, n0] of Object.entries(pedir || {})) {
    const n = Math.max(0, Math.floor(Number(n0) || 0)); if (!n) continue;
    const L = banco.filter((b) => b.criterio === criterio);
    if (L.length < n) { errores.push(`Del criterio «${criterio}» pides ${n} y en el banco solo hay ${L.length}.`); continue; }
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    out.push(...barajar(L, s).slice(0, n));
  }
  if (!out.length && !errores.length) errores.push('Elige cuántas preguntas quieres de algún criterio.');
  return { errores, preguntas: out.map((b, i) => paraExamen(b, i)) };
}
// Lee preguntas para el banco (JSON: lista de preguntas o {"preguntas": [...]}). Todas necesitan criterio.
export function leerPreguntasBanco(texto, criterioPorDefecto = '') {
  let j; try { j = JSON.parse(String(texto || '')); } catch (e) { return { errores: ['No es un JSON válido. Revisa comas, comillas dobles y corchetes.'], preguntas: [] }; }
  const L = Array.isArray(j) ? j : Array.isArray(j?.preguntas) ? j.preguntas : null;
  if (!L || !L.length) return { errores: ['Tiene que ser una lista de preguntas: [ { … }, { … } ] o { "preguntas": [ … ] }.'], preguntas: [] };
  if (L.length > 300) return { errores: ['Como mucho 300 preguntas de una vez.'], preguntas: [] };
  const errores = []; const preguntas = [];
  L.forEach((q0, i) => {
    const q = { ...q0, criterio: q0?.criterio || criterioPorDefecto || undefined };
    // v5 · «apartados» en una respuesta abierta = su rúbrica (cada apartado con sus puntos; el profesor puntúa por niveles)
    if (q.tipo === 'abierta' && Array.isArray(q0?.apartados) && !q0.rubrica) q.rubrica = q0.apartados.map((a) => ({ c: a?.texto ?? a?.c ?? a?.criterio, p: a?.puntos ?? a?.p, ...(a?.niveles ? { niveles: a.niveles } : {}) }));
    else if (q0?.apartados != null && q.tipo !== 'abierta') errores.push(`Pregunta ${i + 1}: «apartados» solo vale en las de respuesta abierta (para las demás usa «paso»).`);
    const meta = metaPregunta(q0, i, errores);
    const r = validarPregunta(q, i, (ruta, t) => errores.push(t));
    if (r && !r.criterio) errores.push(`Pregunta ${i + 1}: falta el «criterio» (en el banco todas las preguntas lo llevan).`);
    else if (r) preguntas.push({ ...r, ...meta });
  });
  return { errores, preguntas: errores.length ? [] : preguntas };
}

// ------------------------------------------------------------------ v5 · tema, dificultad y plantillas de examen
// En el banco, cada pregunta puede llevar «tema» (texto) y «dificultad» (1 básica, 2 media, 3 avanzada). Van dentro de «q»
// (así no hace falta cambiar las reglas de banco/{id}); al pasar a un examen se quitan.
export const DIFICULTADES = { 1: 'Básica', 2: 'Media', 3: 'Avanzada' };
const DIF_TEXTO = { basica: 1, 'básica': 1, facil: 1, 'fácil': 1, media: 2, medio: 2, avanzada: 3, dificil: 3, 'difícil': 3 };
export function leeDificultad(x) {
  if (x == null || x === '') return null;
  const n = typeof x === 'number' ? x : DIF_TEXTO[String(x).trim().toLowerCase()] ?? Number(x);
  return [1, 2, 3].includes(n) ? n : undefined;
}
function metaPregunta(q0, i, errores) {
  const o = {};
  if (q0?.tema != null && q0.tema !== '') { if (typeof q0.tema !== 'string' || q0.tema.length > 120) errores.push(`Pregunta ${i + 1}: «tema» tiene que ser un texto corto (120 letras).`); else o.tema = q0.tema.trim(); }
  const d = leeDificultad(q0?.dificultad);
  if (d === undefined) errores.push(`Pregunta ${i + 1}: «dificultad» tiene que ser 1 (básica), 2 (media) o 3 (avanzada).`); else if (d) o.dificultad = d;
  return o;
}
export const temaDe = (b) => (typeof b?.q?.tema === 'string' ? b.q.tema : '');
export const dificultadDe = (b) => leeDificultad(b?.q?.dificultad) || null;
export function temasBanco(banco) { return [...new Set(banco.map(temaDe).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es', { numeric: true })); }
// f: { criterio, tema, dificultad } (vacío = todos; tema '-' = sin tema)
export function filtrarBanco(banco, f = {}) {
  return banco.filter((b) => (!f.criterio || b.criterio === f.criterio)
    && (!f.tema || (f.tema === '-' ? !temaDe(b) : temaDe(b) === f.tema))
    && (!f.dificultad || dificultadDe(b) === Number(f.dificultad)));
}
// Pregunta del banco → pregunta de examen (id q1, q2…; con su criterio; sin tema ni dificultad)
export function paraExamen(b, i) { const { tema, dificultad, ...q } = b.q || {}; return { ...q, id: 'q' + (i + 1), criterio: b.criterio }; }

// Plantilla: [{ criterio?, tema?, dificultad?, n }] (máx. 30 filas). Devuelve un texto de error o null.
export function validarPlantilla(reglas) {
  if (!Array.isArray(reglas) || !reglas.length) return 'La plantilla necesita al menos una fila.';
  if (reglas.length > 30) return 'Como mucho 30 filas.';
  for (const [i, r] of reglas.entries()) {
    const n = Number(r?.n); if (!Number.isInteger(n) || n < 1 || n > 50) return `Fila ${i + 1}: el número de preguntas tiene que ser de 1 a 50.`;
    if (r.dificultad != null && r.dificultad !== '' && !leeDificultad(r.dificultad)) return `Fila ${i + 1}: dificultad 1, 2 o 3.`;
  }
  return null;
}
export const limpiarPlantilla = (reglas) => reglas.map((r) => ({ n: Number(r.n), ...(r.criterio ? { criterio: String(r.criterio).slice(0, 60) } : {}), ...(r.tema ? { tema: String(r.tema).slice(0, 120) } : {}), ...(leeDificultad(r.dificultad) ? { dificultad: leeDificultad(r.dificultad) } : {}) }));
const reglaTexto = (r) => [r.criterio ? `criterio ${r.criterio}` : '', r.tema ? `tema «${r.tema}»` : '', r.dificultad ? DIFICULTADES[r.dificultad].toLowerCase() : ''].filter(Boolean).join(', ') || 'cualquiera';

// Genera una prueba a partir de una plantilla: n preguntas al azar por fila, sin repetir y sin las de «excluir»;
// ordenadas de menos a más difícil (las que no tienen dificultad cuentan como media).
export function generarDesdePlantilla(banco, reglas, { seed = Date.now(), excluir = new Set() } = {}) {
  const e = validarPlantilla(reglas); if (e) return { errores: [e], preguntas: [], usados: [] };
  const errores = []; const elegidas = []; const usados = new Set(excluir); let s = seed >>> 0 || 1;
  for (const r of limpiarPlantilla(reglas)) {
    const L = filtrarBanco(banco, r).filter((b) => !usados.has(b.id));
    if (L.length < r.n) { errores.push(`Pides ${r.n} (${reglaTexto(r)}) y solo quedan ${L.length} distintas en el banco.`); continue; }
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    for (const b of barajar(L, s).slice(0, r.n)) { usados.add(b.id); elegidas.push(b); }
  }
  const orden = elegidas.map((b, k) => ({ b, k, d: dificultadDe(b) || 2 })).sort((x, y) => x.d - y.d || x.k - y.k).map((x) => x.b);
  return { errores, preguntas: errores.length ? [] : orden.map(paraExamen), usados: errores.length ? [] : orden.map((b) => b.id) };
}
// Examen, test de repaso y recuperación de la misma plantilla, sin repetir preguntas entre ellos.
export const VERSIONES = { examen: 'Examen', repaso: 'Test de repaso', recuperacion: 'Recuperación' };
export function generarVersiones(banco, reglas, versiones = Object.keys(VERSIONES), seed = Date.now()) {
  const excluir = new Set(); const out = {}; const errores = [];
  versiones.forEach((v, i) => {
    const r = generarDesdePlantilla(banco, reglas, { seed: (seed + i * 7919) >>> 0, excluir });
    if (r.errores.length) errores.push(`${VERSIONES[v] || v}: ${r.errores.join(' ')}`); else { r.usados.forEach((id) => excluir.add(id)); out[v] = r.preguntas; }
  });
  return { errores, versiones: out };
}
