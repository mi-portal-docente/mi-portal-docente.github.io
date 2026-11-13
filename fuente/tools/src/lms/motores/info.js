// Motor «Representación de la información» (TIC): conversiones entre sistemas (decimal, binario,
// hexadecimal, ASCII) y cálculo de tamaños de archivo, con la respuesta calculada automáticamente.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';

export const SISTEMAS = { dec: 'decimal', bin: 'binario', hex: 'hexadecimal', ascii: 'texto ASCII' };
export const UNIDADES = ['bit', 'B', 'KB', 'MB', 'GB'];
const VALOR_OK = { dec: /^\d{1,12}$/, bin: /^[01]{1,48}$/, hex: /^[0-9a-f]{1,12}$/i, ascii: /^[\x20-\x7e]{1,16}$/ };
// ---------------------------------------------------------------- conversiones
export function aNumero(v, de) { const s = String(v).trim().replace(/\s+/g, ''); if (!VALOR_OK[de]?.test(s)) return null; return de === 'dec' ? Number(s) : de === 'bin' ? parseInt(s, 2) : de === 'hex' ? parseInt(s, 16) : null; }
export function convertir(v, de, a) {
  if (de === 'ascii') { const s = String(v); if (!VALOR_OK.ascii.test(s)) return null; const cod = [...s].map((c) => c.charCodeAt(0)); return a === 'dec' ? cod.join(' ') : a === 'bin' ? cod.map((n) => n.toString(2).padStart(8, '0')).join(' ') : a === 'hex' ? cod.map((n) => n.toString(16).toUpperCase().padStart(2, '0')).join(' ') : s; }
  if (a === 'ascii') { const L = String(v).trim().split(/\s+/).map((x) => aNumero(x, de)); if (L.some((n) => n == null || n < 32 || n > 126)) return null; return L.map((n) => String.fromCharCode(n)).join(''); }
  const n = aNumero(v, de); if (n == null) return null;
  return a === 'dec' ? String(n) : a === 'bin' ? n.toString(2) : n.toString(16).toUpperCase();
}
// Compara respuestas: binario sin ceros a la izquierda, hex sin mayúsculas, ASCII por códigos separados por espacios
export function respuestaCorrecta(resp, ok, a) {
  const norm = (x) => String(x ?? '').trim().replace(/\s+/g, ' ').split(' ').map((t) => (a === 'bin' ? t.replace(/^0+(?=.)/, '') : a === 'hex' ? t.toUpperCase().replace(/^0+(?=.)/, '') : t)).join(' ');
  return ok != null && norm(resp) === norm(ok);
}
// ---------------------------------------------------------------- tamaños de archivo
const FACTOR = { bit: 1 / 8, B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
export function bitsDe(t) {
  if (t.tipo === 'imagen') return t.ancho * t.alto * t.bits;
  if (t.tipo === 'audio') return t.segundos * t.hz * t.bits * t.canales;
  if (t.tipo === 'texto') return t.caracteres * t.bits;
  if (t.tipo === 'video') return t.ancho * t.alto * t.bits * t.fps * t.segundos;
  return 0;
}
export const enUnidad = (bits, u, base = 1024) => (bits / 8) / (u === 'bit' ? 1 / 8 : u === 'B' ? 1 : base ** (UNIDADES.indexOf(u) - 1));
export function tamanoCorrecto(resp, t) { const ok = enUnidad(bitsDe(t.archivo), t.unidad, t.base); const r = Number(String(resp).replace(',', '.')); return Number.isFinite(r) && Math.abs(r - ok) <= Math.max(ok * (t.tolerancia ?? 1) / 100, 1e-9); }
void FACTOR;
// ---------------------------------------------------------------- validación
const N = (v, ruta, err, nombre, o = {}) => numero(v, `${ruta}.${nombre}`, err, { min: 1, max: 1e9, obligatorio: true, nombre, ...o });
export function validarPreguntaInfo(p, ruta, err) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) { err(ruta, 'Cada pregunta es un objeto { "tipo": "conversion" | "tamano", … }.'); return null; }
  const enunciado = texto(p.enunciado, ruta + '.enunciado', err, { max: 1000, nombre: 'enunciado' });
  const explicacion = texto(p.explicacion, ruta + '.explicacion', err, { max: 1000, nombre: 'explicacion' });
  if (p.tipo === 'conversion') {
    if (!SISTEMAS[p.de] || !SISTEMAS[p.a] || p.de === p.a) { err(ruta, '«de» y «a» tienen que ser dos de "dec", "bin", "hex" o "ascii".'); return null; }
    const valor = String(p.valor ?? '');
    if (convertir(valor, p.de, p.a) == null) { err(ruta + '.valor', `«valor» no es un número ${SISTEMAS[p.de]} válido (o no se puede pasar a ${SISTEMAS[p.a]}).`); return null; }
    return { tipo: 'conversion', de: p.de, a: p.a, valor, enunciado, explicacion };
  }
  if (p.tipo === 'tamano') {
    const t = p.archivo || {}; const r = ruta + '.archivo';
    if (!['imagen', 'audio', 'texto', 'video'].includes(t.tipo)) { err(r + '.tipo', '«archivo.tipo» tiene que ser "imagen", "audio", "texto" o "video".'); return null; }
    const a = { tipo: t.tipo };
    if (t.tipo === 'imagen' || t.tipo === 'video') { a.ancho = N(t.ancho, r, err, 'ancho'); a.alto = N(t.alto, r, err, 'alto'); a.bits = N(t.bits, r, err, 'bits', { max: 64 }); }
    if (t.tipo === 'video') { a.fps = N(t.fps, r, err, 'fps', { max: 240 }); a.segundos = N(t.segundos, r, err, 'segundos'); }
    if (t.tipo === 'audio') { a.segundos = N(t.segundos, r, err, 'segundos'); a.hz = N(t.hz, r, err, 'hz', { max: 400000 }); a.bits = N(t.bits, r, err, 'bits', { max: 64 }); a.canales = N(t.canales, r, err, 'canales', { max: 16, defecto: 1, obligatorio: false }) || 1; }
    if (t.tipo === 'texto') { a.caracteres = N(t.caracteres, r, err, 'caracteres'); a.bits = N(t.bits, r, err, 'bits', { max: 64, defecto: 8, obligatorio: false }) || 8; }
    if (!UNIDADES.includes(p.unidad)) { err(ruta + '.unidad', '«unidad» tiene que ser "bit", "B", "KB", "MB" o "GB".'); return null; }
    const base = p.base === 1000 ? 1000 : 1024;
    return { tipo: 'tamano', archivo: a, unidad: p.unidad, base, tolerancia: numero(p.tolerancia, ruta + '.tolerancia', err, { min: 0, max: 50, nombre: 'tolerancia', defecto: 1 }), enunciado, explicacion };
  }
  err(ruta + '.tipo', 'El tipo de pregunta tiene que ser "conversion" o "tamano".'); return null;
}
export function validarInfo(c, err) {
  return { preguntas: lista(c.preguntas, 'preguntas', err, { min: 1, max: 40, nombre: 'preguntas' }).map((p, i) => validarPreguntaInfo(p, `preguntas[${i}]`, err)).filter(Boolean) };
}
export function enunciadoInfo(p) {
  if (p.enunciado) return p.enunciado;
  if (p.tipo === 'conversion') return `Pasa ${p.de === 'ascii' ? `el texto «${p.valor}»` : `el número ${SISTEMAS[p.de]} ${p.valor}`} a ${SISTEMAS[p.a]}.`;
  const a = p.archivo; const u = `${p.unidad}${p.base === 1000 ? ' (1 K = 1000)' : ''}`;
  if (a.tipo === 'imagen') return `¿Cuánto ocupa una imagen sin comprimir de ${a.ancho} × ${a.alto} píxeles a ${a.bits} bits por píxel? Respuesta en ${u}.`;
  if (a.tipo === 'audio') return `¿Cuánto ocupa un audio sin comprimir de ${a.segundos} s a ${a.hz} Hz, ${a.bits} bits y ${a.canales} canal${a.canales > 1 ? 'es' : ''}? Respuesta en ${u}.`;
  if (a.tipo === 'texto') return `¿Cuánto ocupa un texto de ${a.caracteres} caracteres a ${a.bits} bits por carácter? Respuesta en ${u}.`;
  return `¿Cuánto ocupa un vídeo sin comprimir de ${a.ancho} × ${a.alto} a ${a.bits} bits, ${a.fps} fps y ${a.segundos} s? Respuesta en ${u}.`;
}
export function solucionInfo(p) {
  if (p.tipo === 'conversion') return convertir(p.valor, p.de, p.a);
  const v = enUnidad(bitsDe(p.archivo), p.unidad, p.base); return `${String(Math.round(v * 1000) / 1000).replace('.', ',')} ${p.unidad}`;
}
export const correctaInfo = (p, resp) => (p.tipo === 'conversion' ? respuestaCorrecta(resp, convertir(p.valor, p.de, p.a), p.a) : tamanoCorrecto(resp, p));

registrarMotor('info', {
  nombre: 'Representación de la información', validar: validarInfo, entregable: true,
  resumen: (c) => `${c.preguntas.length} pregunta${c.preguntas.length === 1 ? '' : 's'} · ${c.preguntas.filter((p) => p.tipo === 'conversion').length} de conversión, ${c.preguntas.filter((p) => p.tipo === 'tamano').length} de tamaño`,
  ejemplo: { preguntas: [{ tipo: 'conversion', de: 'dec', a: 'bin', valor: '13' }, { tipo: 'tamano', archivo: { tipo: 'imagen', ancho: 800, alto: 600, bits: 24 }, unidad: 'KB' }] },
});
