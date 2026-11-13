// Tipos de pregunta del examen autocorregido. Cada tipo define:
//  · validar(q, err): comprueba la pregunta tal y como la escribe el profesor (JSON o editor) y la normaliza;
//  · separar(q, seed): la divide en lo que ve el alumno (examenes/{id}, SIN solución) y la clave (claves/{id});
//  · exportar(qPublica, clave): vuelve a la forma del profesor (para «Exportar JSON» y para editar);
//  · corregir(qPublica, clave, respuesta) → fracción acertada (0…1). Puntuación parcial donde tiene sentido.
import { normaliza, barajar, semilla } from './modelo.js';

const esTexto = (x) => typeof x === 'string';
const listaTextos = (L) => Array.isArray(L) && L.every(esTexto);
const corto = (t, n = 500) => String(t ?? '').trim().slice(0, n);

export const alternativas = (a) => (Array.isArray(a) ? a : String(a ?? '').split('|')).map((x) => String(x).trim()).filter(Boolean);

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
  // ---- Fase 2: tipos nuevos (con puntuación parcial donde tiene sentido)
  emparejar: {
    nombre: 'Emparejar', parcial: true,
    validar(q, err) {
      const P = q.pares;
      if (!Array.isArray(P) || P.length < 2 || P.some((p) => !Array.isArray(p) || p.length !== 2 || !esTexto(p[0]) || !esTexto(p[1]) || !p[0].trim() || !p[1].trim())) { err('pares', '«pares» tiene que ser una lista de al menos 2 parejas: [["izquierda", "derecha"], …].'); return null; }
      if (P.length > 12) err('pares', 'Máximo 12 parejas.');
      const D = q.distractores ?? [];
      if (!listaTextos(D)) { err('distractores', '«distractores» tiene que ser una lista de textos (opciones de la derecha que no van con ninguna).'); return null; }
      const der = [...P.map((p) => corto(p[1], 300)), ...D.map((d) => corto(d, 300))];
      if (new Set(der.map(normaliza)).size !== der.length) { err('pares', 'Hay textos de la derecha repetidos: cada opción de la derecha tiene que ser distinta.'); return null; }
      return { pares: P.map((p) => [corto(p[0], 300), corto(p[1], 300)]), distractores: D.map((d) => corto(d, 300)).filter(Boolean).slice(0, 6) };
    },
    // la derecha se guarda barajada; la clave dice qué opción de la derecha va con cada una de la izquierda
    separar(q, seed) {
      const der = [...q.pares.map((p) => p[1]), ...(q.distractores || [])];
      const orden = barajar(der.map((_, i) => i), seed);
      return { publica: { izquierda: q.pares.map((p) => p[0]), derecha: orden.map((i) => der[i]) }, clave: q.pares.map((_, i) => orden.indexOf(i)) };
    },
    exportar(q, k) {
      const K = Array.isArray(k) ? k : []; const usados = new Set(K);
      return { pares: (q.izquierda || []).map((iz, i) => [iz, (q.derecha || [])[K[i]] ?? '']), distractores: (q.derecha || []).filter((_, j) => !usados.has(j)) };
    },
    corregir(q, k, r) { if (!Array.isArray(k) || !k.length || !Array.isArray(r)) return 0; return k.filter((x, i) => r[i] != null && Number(r[i]) === x).length / k.length; },
  },
  ordenar: {
    nombre: 'Ordenar', parcial: true,
    validar(q, err) {
      const L = q.elementos;
      if (!listaTextos(L) || L.filter((x) => x.trim()).length < 2) { err('elementos', '«elementos» tiene que ser una lista de al menos 2 textos, EN EL ORDEN CORRECTO.'); return null; }
      if (L.length > 12) err('elementos', 'Máximo 12 elementos.');
      return { elementos: L.map((x) => corto(x, 300)) };
    },
    // se guardan barajados; la clave es el orden correcto (índices de la lista barajada)
    separar(q, seed) {
      let orden = barajar(q.elementos.map((_, i) => i), seed);
      if (orden.every((x, i) => x === i)) orden = [...orden.slice(1), orden[0]];
      return { publica: { elementos: orden.map((i) => q.elementos[i]) }, clave: q.elementos.map((_, i) => orden.indexOf(i)) };
    },
    exportar: (q, k) => ({ elementos: (Array.isArray(k) ? k : []).map((i) => (q.elementos || [])[i]) }),
    // parcial: posiciones bien colocadas / total
    corregir(q, k, r) { if (!Array.isArray(k) || !k.length || !Array.isArray(r)) return 0; return k.filter((x, i) => Number(r[i]) === x).length / k.length; },
  },
  huecos: {
    // clave: una entrada por hueco, «respuesta|otra válida» (texto: Firestore no guarda listas dentro de listas)
    nombre: 'Completar huecos', parcial: true,
    // texto: «La ley de [[Ohm]] relaciona tensión, [[intensidad|corriente]] y resistencia.» (| = otras respuestas válidas)
    validar(q, err) {
      if (!esTexto(q.texto) || !/\[\[[^\]]+\]\]/.test(q.texto)) { err('texto', '«texto» tiene que llevar al menos un hueco escrito así: [[respuesta]] o [[respuesta|otra válida]].'); return null; }
      const n = (q.texto.match(/\[\[[^\]]+\]\]/g) || []).length; if (n > 20) err('texto', 'Máximo 20 huecos.');
      return { texto: corto(q.texto, 3000) };
    },
    separar(q) {
      const clave = []; const texto = q.texto.replace(/\[\[([^\]]+)\]\]/g, (_, a) => { clave.push(a.split('|').map((x) => x.trim()).filter(Boolean).join('|')); return `[[${clave.length}]]`; });
      return { publica: { texto, huecos: clave.length }, clave };
    },
    exportar: (q, k) => ({ texto: String(q.texto || '').replace(/\[\[(\d+)\]\]/g, (_, n) => `[[${alternativas((Array.isArray(k) ? k : [])[n - 1]).join('|')}]]`) }),
    corregir(q, k, r) { if (!Array.isArray(k) || !k.length || !Array.isArray(r)) return 0; return k.filter((acc, i) => r[i] != null && String(r[i]).trim() !== '' && alternativas(acc).some((a) => normaliza(a) === normaliza(r[i]))).length / k.length; },
  },
  numerica: {
    nombre: 'Numérica',
    validar(q, err) {
      const v = Number(q.valor); if (q.valor == null || !Number.isFinite(v)) { err('valor', '«valor» tiene que ser un número (la respuesta correcta).'); return null; }
      const t = q.tolerancia == null ? 0 : Number(q.tolerancia); if (!(t >= 0)) { err('tolerancia', '«tolerancia» tiene que ser un número mayor o igual que 0.'); return null; }
      const modo = q.modo ?? 'abs'; if (!['abs', 'pct'].includes(modo)) { err('modo', '«modo» tiene que ser "abs" (tolerancia absoluta) o "pct" (en %).'); return null; }
      return { valor: v, tolerancia: t, modo, unidad: corto(q.unidad ?? '', 20) };
    },
    separar: (q) => ({ publica: q.unidad ? { unidad: q.unidad } : {}, clave: { v: q.valor, t: q.tolerancia, m: q.modo } }),
    exportar: (q, k) => ({ valor: k?.v ?? 0, tolerancia: k?.t ?? 0, modo: k?.m || 'abs', ...(q.unidad ? { unidad: q.unidad } : {}) }),
    corregir(q, k, r) {
      const x = leeNumero(r); if (x == null || !k) return 0;
      const tol = k.m === 'pct' ? Math.abs(k.v) * (k.t || 0) / 100 : (k.t || 0);
      return Math.abs(x - k.v) <= tol + 1e-9 ? 1 : 0;
    },
  },
  zonas: {
    nombre: 'Imagen con zonas',
    // imagen + zonas rectangulares en % de la imagen ({x, y, w, h}); el alumno pulsa un punto de la imagen.
    validar(q, err) {
      if (!esTexto(q.imagen) || !/^(https:\/\/\S+|materiales\/[\w\-./]+|img\/[\w\-./]+)$/.test(q.imagen) || q.imagen.includes('..')) { err('imagen', '«imagen» tiene que ser una URL https://… o una ruta materiales/… / img/…'); return null; }
      const Z = q.zonas;
      if (!Array.isArray(Z) || !Z.length) { err('zonas', '«zonas» tiene que ser una lista: [{ "x": 10, "y": 20, "w": 15, "h": 10, "correcta": true }] (en % de la imagen).'); return null; }
      const zonas = [];
      for (const [i, z] of Z.entries()) {
        const n = ['x', 'y', 'w', 'h'].map((c) => Number(z?.[c]));
        if (n.some((v) => !Number.isFinite(v) || v < 0 || v > 100) || n[2] <= 0 || n[3] <= 0) { err(`zonas[${i}]`, `Zona ${i + 1}: x, y, w, h tienen que ser números de 0 a 100 (% de la imagen).`); return null; }
        zonas.push({ x: n[0], y: n[1], w: n[2], h: n[3], correcta: z.correcta !== false, ...(z.nombre ? { nombre: corto(z.nombre, 80) } : {}) });
      }
      if (!zonas.some((z) => z.correcta)) { err('zonas', 'Al menos una zona tiene que ser la correcta.'); return null; }
      return { imagen: q.imagen, zonas: zonas.slice(0, 20), alt: corto(q.alt ?? '', 200) };
    },
    separar: (q) => ({ publica: { imagen: q.imagen, ...(q.alt ? { alt: q.alt } : {}) }, clave: q.zonas }),
    exportar: (q, k) => ({ imagen: q.imagen, zonas: Array.isArray(k) ? k : [], ...(q.alt ? { alt: q.alt } : {}) }),
    corregir(q, k, r) {
      if (!Array.isArray(k) || !r || typeof r !== 'object') return 0; const x = Number(r.x), y = Number(r.y);
      return k.some((z) => z.correcta && x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) ? 1 : 0;
    },
  },
};
// «3,5» o «3.5» → 3.5
export function leeNumero(r) { if (r == null || String(r).trim() === '') return null; const x = Number(String(r).trim().replace(/\s/g, '').replace(',', '.')); return Number.isFinite(x) ? x : null; }


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
