// Corrección por archivo JSON (la puede preparar Claude u otra persona y la revisa el profesor).
// «Exportar para corregir» genera este archivo con la rúbrica y lo entregado por cada nº de lista;
// se rellenan «niveles» y «comentario» y se importa: las notas quedan en BORRADOR (sin publicar) y
// el profesor las revisa en la vista de corrección antes de publicarlas. Sin nombres de alumnos.
import { NIVELES, puntosNivel, notaRubrica, redondea } from './modelo.js';

export const FORMATO_CORRECCION = 'superprofe-correccion-1';
const norm = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const NOMBRES = { insuficiente: 1, suficiente: 2, bien: 3, bueno: 3, notable: 3, excelente: 4, sobresaliente: 4 };

/** Nivel 1-4 desde un número o un nombre («Bien», «excelente»…). null si está vacío; NaN si no vale. */
export function leeNivel(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isInteger(v) && v >= 1 && v <= 4 ? v : NaN;
  const t = norm(v); if (/^[1-4]$/.test(t)) return +t;
  return NOMBRES[t] ?? NaN;
}

/** Aplica una corrección a la rúbrica. niveles: lista por orden de criterio u objeto {nº de criterio (1…) o texto del criterio: nivel}. */
export function aplicarCorreccion(rubrica, entrada) {
  const R = rubrica || []; const errores = []; const detalle = {}; const valores = {};
  const N = entrada?.niveles; const porCrit = new Array(R.length).fill(undefined);
  if (Array.isArray(N)) N.forEach((v, i) => { if (i < R.length) porCrit[i] = v; else errores.push(`hay más niveles (${N.length}) que criterios (${R.length})`); });
  else if (N && typeof N === 'object') {
    for (const [k, v] of Object.entries(N)) {
      let i = /^\d+$/.test(k) ? +k - 1 : R.findIndex((r) => norm(r.c) === norm(k));
      if (i < 0 || i >= R.length) { errores.push(`criterio desconocido: «${k}»`); continue; }
      porCrit[i] = v;
    }
  }
  R.forEach((r, i) => {
    if (r.clase) return;
    const k = leeNivel(porCrit[i]);
    if (Number.isNaN(k)) { errores.push(`nivel no válido en «${r.c}»: ${JSON.stringify(porCrit[i])}`); return; }
    if (k == null) return;
    detalle['n' + i] = k; detalle['r' + i] = valores[i] = puntosNivel(r.p, k);
  });
  const c = Object.keys(valores).length ? notaRubrica(R, valores) : null;
  let nota = c?.nota ?? null;
  if (!R.length || entrada?.nota != null) { const x = Number(String(entrada?.nota ?? '').replace(',', '.')); if (entrada?.nota != null && entrada.nota !== '') { if (x >= 0 && x <= 10) nota = redondea(x); else errores.push(`nota fuera de 0-10: ${entrada.nota}`); } }
  const comentario = String(entrada?.comentario ?? '').trim().slice(0, 2000);
  return { detalle, puntos: c?.puntos ?? null, max: c?.max ?? null, nota, comentario, errores };
}

/** Lee el archivo completo: { formato, item, grupo, correcciones: [{ n, niveles, comentario, nota? }] }. */
export function leeArchivoCorreccion(json, { itemId, rubrica }) {
  let d; try { d = typeof json === 'string' ? JSON.parse(json) : json; } catch (e) { return { error: 'El archivo no es un JSON válido.' }; }
  const L = Array.isArray(d) ? d : d?.correcciones;
  if (!Array.isArray(L)) return { error: 'Falta la lista «correcciones».' };
  if (d?.item && itemId && d.item !== itemId) return { error: 'El archivo es de otra actividad.' };
  const out = []; const avisos = [];
  for (const x of L) {
    const n = Number(x?.n ?? x?.numero);
    if (!Number.isInteger(n) || n < 1 || n > 99) { avisos.push(`nº de lista no válido: ${JSON.stringify(x?.n)}`); continue; }
    const vacio = x.niveles == null && (x.nota == null || x.nota === '') && !String(x.comentario || '').trim();
    if (vacio) continue;
    const r = aplicarCorreccion(rubrica, x);
    r.errores.forEach((e) => avisos.push(`nº ${String(n).padStart(2, '0')}: ${e}`));
    if (r.nota == null && !r.comentario) continue;
    out.push({ n, ...r });
  }
  return { correcciones: out, avisos };
}

export const NOMBRES_NIVELES = NIVELES.map(([k, t]) => `${k} = ${t}`).join(', ');
