// Formato JSON de UN elemento del «Trabajo de clase» («superprofe/elemento@1»): importar (pegar un JSON),
// validar con errores en castellano, vista previa y exportar. Lógica pura (sin Firebase ni DOM): se usa
// en la web y en las pruebas. Documentación y ejemplos: lms/semilla/FORMATO_IMPORTAR.md
import { TIPOS } from './biblioteca.js';
import { enlaceValido, redondea } from './modelo.js';
import { validarPregunta, TIPOS_PREGUNTA } from './preguntas.js';

export const FORMATO_EL = 'superprofe/elemento@1';
// Motores de contenido (tipos nuevos): cada uno registra su validador con registrarMotor().
// validar(contenido, err) añade errores con err(ruta, texto) y devuelve el contenido limpio.
const MOTORES = new Map();
export function registrarMotor(id, def) { MOTORES.set(id, def); }
export const motor = (id) => MOTORES.get(id) || null;
export const motores = () => [...MOTORES.entries()].map(([id, d]) => ({ id, ...d }));

export const TIPOS_JSON = ['tarea', 'examen', 'material', 'pregunta', 'cuestionario', 'actividad', 'practica', 'proyecto'];
const tiposValidos = () => [...TIPOS_JSON, ...Object.keys(TIPOS).filter((t) => !TIPOS_JSON.includes(t))];
const esTexto = (x) => typeof x === 'string';
export const criterioValido = (c) => /^[\p{L}\p{N}_.\-]{1,60}$/u.test(String(c ?? ''));

// Fecha: «2026-10-27T23:59» (hora local), ISO completo o milisegundos → ms (o NaN si no vale)
export function aMs(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  const t = new Date(String(v)).getTime(); return Number.isFinite(t) ? t : NaN;
}
export function deMs(t) {
  if (t == null) return null; const d = new Date(t);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

// Valida un elemento ya leído (objeto) y lo devuelve normalizado. errores: [{ruta, texto}]
export function validarElemento(j) {
  const errores = []; const err = (ruta, texto) => errores.push({ ruta, texto });
  if (!j || typeof j !== 'object' || Array.isArray(j)) { err('', 'Tiene que ser un objeto JSON entre llaves { … }.'); return { errores, el: null }; }
  if (j.formato != null && j.formato !== FORMATO_EL) err('formato', `Formato desconocido «${j.formato}». Usa «${FORMATO_EL}» (o quita la línea).`);
  const tipo = String(j.tipo ?? '');
  if (!tipo) err('tipo', `Falta «tipo». Puede ser: ${tiposValidos().join(', ')}.`);
  else if (!tiposValidos().includes(tipo)) err('tipo', `Tipo «${tipo}» desconocido. Puede ser: ${tiposValidos().join(', ')}.`);
  if (!esTexto(j.titulo) || !j.titulo.trim()) err('titulo', 'Falta el «titulo» (texto).');
  else if (j.titulo.length > 150) err('titulo', `El título es demasiado largo (${j.titulo.length} caracteres; máximo 150).`);
  const instr = j.instrucciones ?? j.texto ?? '';
  if (!esTexto(instr)) err('instrucciones', '«instrucciones» tiene que ser texto.');
  else if (instr.length > 20000) err('instrucciones', 'Las instrucciones pasan de 20 000 caracteres.');
  const enlaces = [];
  if (j.enlaces != null) {
    if (!Array.isArray(j.enlaces)) err('enlaces', '«enlaces» tiene que ser una lista: [ { "titulo": "…", "url": "https://…" } ].');
    else j.enlaces.forEach((e, i) => {
      const u = typeof e === 'string' ? e : e?.url; const t = typeof e === 'string' ? '' : e?.titulo || '';
      if (!enlaceValido(u)) err(`enlaces[${i}]`, `El enlace ${i + 1} no es válido: tiene que empezar por https:// (o ser materiales/… o #…).`);
      else enlaces.push({ t: String(t).slice(0, 120), u: String(u).slice(0, 500) });
    });
    if (enlaces.length > 20) err('enlaces', 'Máximo 20 enlaces.');
  }
  let puntos = null;
  if (j.puntos != null) { puntos = Number(j.puntos); if (!(puntos > 0 && puntos <= 1000)) err('puntos', '«puntos» tiene que ser un número entre 0 y 1000 (o quítalo para «sin calificar»).'); }
  let fechaEntrega = null;
  if (j.fechaEntrega != null && j.fechaEntrega !== '') { fechaEntrega = aMs(j.fechaEntrega); if (Number.isNaN(fechaEntrega)) err('fechaEntrega', 'Fecha de entrega no válida. Ejemplo: "2026-11-20T23:59".'); }
  let criterio = null;
  if (j.criterio != null && j.criterio !== '') { criterio = String(j.criterio).trim(); if (!criterioValido(criterio)) err('criterio', `Criterio «${j.criterio}» no válido: usa letras, números, «_», «.» o «-» (p. ej. "eee_c1_1"), sin espacios.`); }
  const rubrica = [];
  if (j.rubrica != null) {
    if (!Array.isArray(j.rubrica)) err('rubrica', '«rubrica» tiene que ser una lista: [ { "criterio": "…", "puntos": 4 } ].');
    else j.rubrica.forEach((r, i) => {
      const c = r?.criterio ?? r?.c; const p = Number(r?.puntos ?? r?.p);
      const niv = Array.isArray(r?.niveles) ? r.niveles.slice(0, 4).map((x) => String(x ?? '').slice(0, 200)) : null;
      if (niv) while (niv.length < 4) niv.push('');
      if (!esTexto(c) || !c.trim()) err(`rubrica[${i}]`, `La fila ${i + 1} de la rúbrica no tiene «criterio».`);
      else if (r.clase === true) rubrica.push({ c: c.trim().slice(0, 200), p: 0, clase: true });
      else if (r?.niveles != null && !Array.isArray(r.niveles)) err(`rubrica[${i}]`, `«niveles» de la fila ${i + 1} tiene que ser una lista de 4 textos (Insuficiente → Excelente).`);
      else if (!(p > 0)) err(`rubrica[${i}]`, `La fila ${i + 1} de la rúbrica necesita «puntos» mayores que 0.`);
      else rubrica.push({ c: c.trim().slice(0, 200), p: redondea(p), ...(r.peso != null ? { peso: Number(r.peso) } : {}), ...(r.autoria ? { autoria: true } : {}), ...(niv && niv.some(Boolean) ? { niveles: niv } : {}) });
    });
    if (rubrica.length > 20) err('rubrica', 'Máximo 20 filas en la rúbrica.');
  }
  let opciones = null;
  if (tipo === 'pregunta') {
    if (j.opciones != null && (!Array.isArray(j.opciones) || j.opciones.some((o) => !esTexto(o)))) err('opciones', '«opciones» tiene que ser una lista de textos (o quítala para respuesta corta).');
    else opciones = (j.opciones || []).map((o) => o.trim().slice(0, 300)).filter(Boolean).slice(0, 10);
  }
  let preguntas = null; let examen = null;
  if (tipo === 'examen') {
    if (!Array.isArray(j.preguntas) || !j.preguntas.length) err('preguntas', 'Un examen necesita «preguntas»: una lista con al menos una pregunta.');
    else {
      if (j.preguntas.length > 100) err('preguntas', 'Máximo 100 preguntas.');
      const ids = new Set();
      preguntas = j.preguntas.map((q, i) => {
        const r = validarPregunta(q, i, (ruta, t) => err(`preguntas[${i}]${ruta ? '.' + ruta : ''}`, t));
        if (r && ids.has(r.id)) { err(`preguntas[${i}].id`, `El id «${r.id}» está repetido.`); r.id = r.id + '_' + i; }
        if (r) ids.add(r.id); return r;
      }).filter(Boolean);
    }
    const x = j.examen || {};
    const desde = aMs(x.abre ?? x.desde); const hasta = aMs(x.cierra ?? x.hasta);
    if (Number.isNaN(desde)) err('examen.abre', 'Fecha «abre» no válida. Ejemplo: "2026-11-20T09:00".');
    if (Number.isNaN(hasta)) err('examen.cierra', 'Fecha «cierra» no válida. Ejemplo: "2026-11-20T10:00".');
    const lim = x.limiteMin == null || x.limiteMin === '' ? null : Number(x.limiteMin);
    if (lim != null && !(Number.isInteger(lim) && lim >= 1 && lim <= 600)) err('examen.limiteMin', '«limiteMin» tiene que ser un número entero de minutos (1–600) o null.');
    const d = Number.isFinite(desde) && desde ? desde : null; const h = Number.isFinite(hasta) && hasta ? hasta : null;
    if (d && h && d >= h) err('examen', 'El examen tiene que abrirse antes de cerrarse.');
    examen = { desde: d, hasta: h, limiteMin: lim, barajar: x.barajar !== false, pantallaCompleta: !!x.pantallaCompleta };
  }
  let contenido = null;
  const m = MOTORES.get(tipo);
  if (m) {
    if (j.contenido == null || typeof j.contenido !== 'object') err('contenido', `El tipo «${tipo}» necesita «contenido» (ver FORMATO_IMPORTAR.md).`);
    else contenido = m.validar(j.contenido, (ruta, t) => err(`contenido${ruta ? '.' + ruta : ''}`, t));
  }
  const categoria = j.categoria != null ? String(j.categoria) : null;
  const el = { tipo, titulo: esTexto(j.titulo) ? j.titulo.trim().slice(0, 150) : '', texto: esTexto(instr) ? instr.slice(0, 20000) : '', enlaces, puntos: tipo === 'material' ? null : puntos,
    fechaEntrega, criterio, rubrica, opciones, preguntas, examen, contenido, categoria, nota: esTexto(j.nota) ? j.nota.slice(0, 2000) : null };
  return { errores, el: errores.length ? null : el };
}

// Lee el texto pegado: un elemento, una lista de elementos o { "elementos": [ … ] }.
export function leerJSON(texto) {
  let j;
  try { j = JSON.parse(String(texto || '').replace(/^\uFEFF/, '')); }
  catch (e) {
    const m = /position (\d+)/.exec(e.message || ''); let donde = '';
    if (m) { const pos = +m[1]; const antes = String(texto).slice(0, pos); const lin = antes.split('\n').length; const col = pos - antes.lastIndexOf('\n'); donde = ` (línea ${lin}, columna ${col})`; }
    return { errores: [{ ruta: '', texto: `No es un JSON válido${donde}. Revisa comas, comillas dobles "…" y llaves.` }], elementos: [] };
  }
  const L = Array.isArray(j) ? j : Array.isArray(j?.elementos) ? j.elementos : [j];
  if (!L.length) return { errores: [{ ruta: '', texto: 'La lista está vacía.' }], elementos: [] };
  if (L.length > 50) return { errores: [{ ruta: '', texto: 'Como mucho 50 elementos de una vez.' }], elementos: [] };
  const errores = []; const elementos = [];
  L.forEach((x, i) => {
    const r = validarElemento(x);
    r.errores.forEach((e) => errores.push({ ruta: (L.length > 1 ? `[${i}]` + (e.ruta ? '.' : '') : '') + e.ruta, texto: (L.length > 1 ? `Elemento ${i + 1}: ` : '') + e.texto }));
    if (r.el) elementos.push(r.el);
  });
  return { errores, elementos: errores.length ? [] : elementos };
}

// Elemento del portal (item + preguntas con su solución) → JSON exportable (sirve de copia y de plantilla).
export function exportarElemento(it, { preguntas = null, claves = null, examen = null } = {}) {
  const o = { formato: FORMATO_EL, tipo: it.tipo, titulo: it.titulo };
  if (it.texto) o.instrucciones = it.texto;
  if (it.enlaces?.length) o.enlaces = it.enlaces.map((e) => ({ titulo: e.t || '', url: e.u }));
  if (it.puntos != null) o.puntos = it.puntos;
  if (it.fechaEntrega) o.fechaEntrega = deMs(it.fechaEntrega);
  if (it.criterio) o.criterio = it.criterio;
  if (it.categoria) o.categoria = it.categoria;
  if (it.rubrica?.length) o.rubrica = it.rubrica.map((r) => (r.clase ? { criterio: r.c, clase: true } : { criterio: r.c, puntos: r.p, ...(r.peso != null ? { peso: r.peso } : {}), ...(r.autoria ? { autoria: true } : {}), ...(r.niveles ? { niveles: r.niveles } : {}) }));
  if (it.tipo === 'pregunta' && it.opciones?.length) o.opciones = it.opciones;
  if (it.contenido) o.contenido = it.contenido;
  if (it.tipo === 'examen') {
    const x = examen || it.examen || {};
    o.examen = { abre: deMs(x.desde), cierra: deMs(x.hasta), limiteMin: x.limiteMin ?? null, barajar: x.barajar !== false, pantallaCompleta: !!x.pantallaCompleta };
    const k = claves || {};
    o.preguntas = (preguntas || []).map((q) => exportarPregunta(q, k[q.id]));
  }
  if (it.nota) o.nota = it.nota;
  return o;
}
// Pregunta (examenes + clave) → JSON (las de tipos nuevos guardan en la clave cómo deshacer el barajado)
export function exportarPregunta(q, k) {
  const T = TIPOS_PREGUNTA[q.tipo];
  const base = { id: q.id, tipo: q.tipo, enunciado: q.enunciado, puntos: q.puntos ?? 1, ...(q.criterio ? { criterio: q.criterio } : {}) };
  return T?.exportar ? { ...base, ...T.exportar(q, k) } : base;
}
