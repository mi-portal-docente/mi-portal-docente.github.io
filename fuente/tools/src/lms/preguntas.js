// Tipos de pregunta del examen autocorregido. Cada tipo define:
//  · validar(q, err): comprueba la pregunta tal y como la escribe el profesor (JSON o editor) y la normaliza;
//  · separar(q, seed): la divide en lo que ve el alumno (examenes/{id}, SIN solución) y la clave (claves/{id});
//  · exportar(qPublica, clave): vuelve a la forma del profesor (para «Exportar JSON» y para editar);
//  · corregir(qPublica, clave, respuesta) → fracción acertada (0…1). Puntuación parcial donde tiene sentido.
import { normaliza, barajar, semilla } from './modelo.js';

const esTexto = (x) => typeof x === 'string';
const listaTextos = (L) => Array.isArray(L) && L.every(esTexto);
const corto = (t, n = 500) => String(t ?? '').trim().slice(0, n);

export const TIPOS_PREGUNTA = {
  test: {
    nombre: 'Test',
    validar(q, err) {
      if (!listaTextos(q.opciones) || q.opciones.filter((o) => o.trim()).length < 2) { err('opciones', 'Una pregunta de test necesita «opciones»: al menos 2 textos.'); return null; }
      if (q.opciones.length > 8) err('opciones', 'Máximo 8 opciones.');
      const c = Number(q.correcta);
      if (!Number.isInteger(c) || c < 0 || c >= q.opciones.length) { err('correcta', `«correcta» tiene que ser el número de la opción buena, empezando en 0 (de 0 a ${q.opciones.length - 1}).`); return null; }
      return { opciones: q.opciones.map((o) => corto(o)), correcta: c };
    },
    separar: (q) => ({ publica: { opciones: q.opciones }, clave: q.correcta }),
    exportar: (q, k) => ({ opciones: q.opciones || [], correcta: Number(k ?? 0) }),
    corregir: (q, k, r) => (r != null && Number(r) === Number(k) ? 1 : 0),
  },
  vf: {
    nombre: 'Verdadero / falso',
    validar(q, err) { if (typeof q.correcta !== 'boolean') { err('correcta', '«correcta» tiene que ser true (verdadero) o false (falso), sin comillas.'); return null; } return { correcta: q.correcta }; },
    separar: (q) => ({ publica: {}, clave: q.correcta }),
    exportar: (q, k) => ({ correcta: k === true }),
    corregir: (q, k, r) => (typeof r === 'boolean' && r === Boolean(k) ? 1 : 0),
  },
  corta: {
    nombre: 'Respuesta corta',
    validar(q, err) {
      const L = q.aceptadas ?? q.correcta ?? [];
      if (!listaTextos(L)) { err('aceptadas', '«aceptadas» tiene que ser una lista de textos (vacía = la corriges tú).'); return null; }
      return { correcta: L.map((s) => corto(s, 300)).filter(Boolean).slice(0, 20) };
    },
    separar: (q) => ({ publica: {}, clave: q.correcta }),
    exportar: (q, k) => ({ aceptadas: Array.isArray(k) ? k : [] }),
    corregir: (q, k, r) => (Array.isArray(k) && r != null && String(r).trim() !== '' && k.some((a) => normaliza(a) === normaliza(r)) ? 1 : 0),
    revisar: (q, k, r) => r != null && String(r).trim() !== '' && !(Array.isArray(k) && k.some((a) => normaliza(a) === normaliza(r))),
  },
};

// Valida una pregunta escrita por el profesor. Devuelve la forma normalizada (con solución) o null.
export function validarPregunta(q, i, err) {
  if (!q || typeof q !== 'object') { err('', `La pregunta ${i + 1} tiene que ser un objeto { … }.`); return null; }
  const T = TIPOS_PREGUNTA[q.tipo];
  if (!T) { err('tipo', `Pregunta ${i + 1}: tipo «${q.tipo ?? ''}» desconocido. Puede ser: ${Object.keys(TIPOS_PREGUNTA).join(', ')}.`); return null; }
  if (!esTexto(q.enunciado) || !q.enunciado.trim()) err('enunciado', `Pregunta ${i + 1}: falta el «enunciado».`);
  const puntos = q.puntos == null ? 1 : Number(q.puntos);
  if (!(puntos > 0 && puntos <= 100)) err('puntos', `Pregunta ${i + 1}: «puntos» tiene que estar entre 0 y 100.`);
  let criterio = null;
  if (q.criterio != null && q.criterio !== '') { criterio = String(q.criterio).trim(); if (!/^[\p{L}\p{N}_.\-]{1,60}$/u.test(criterio)) err('criterio', `Pregunta ${i + 1}: criterio «${q.criterio}» no válido (sin espacios; p. ej. "eee_c1_1").`); }
  const id = q.id != null && /^[\w-]{1,30}$/.test(String(q.id)) ? String(q.id) : 'q' + (i + 1);
  const extra = T.validar(q, (ruta, t) => err(ruta, /^Pregunta \d/.test(t) ? t : `Pregunta ${i + 1}: ${t}`));
  if (!extra) return null;
  return { id, tipo: q.tipo, enunciado: corto(q.enunciado, 2000), puntos, ...(criterio ? { criterio } : {}), ...extra };
}

// Pregunta del profesor → { publica (para examenes), clave (para claves) }
export function separarPregunta(q) {
  const T = TIPOS_PREGUNTA[q.tipo]; const s = T.separar(q, semilla(q.id + '|' + q.enunciado));
  return { publica: { id: q.id, tipo: q.tipo, enunciado: q.enunciado, puntos: q.puntos ?? 1, ...(q.criterio ? { criterio: q.criterio } : {}), ...s.publica }, clave: s.clave ?? null };
}
// Pregunta pública + clave → forma del profesor
export function unirPregunta(q, k) {
  const T = TIPOS_PREGUNTA[q.tipo];
  return { id: q.id, tipo: q.tipo, enunciado: q.enunciado, puntos: q.puntos ?? 1, ...(q.criterio ? { criterio: q.criterio } : {}), ...(T ? T.exportar(q, k) : {}) };
}
export { barajar };
