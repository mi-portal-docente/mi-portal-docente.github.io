// Utilidades comunes de los motores de contenido (validación con errores en castellano).
export const esTexto = (x) => typeof x === 'string';
export const corto = (x, n) => String(x ?? '').slice(0, n);
export function texto(v, ruta, err, { max = 5000, obligatorio = false, nombre = ruta } = {}) {
  if (v == null || v === '') { if (obligatorio) err(ruta, `Falta «${nombre}».`); return ''; }
  if (!esTexto(v)) { err(ruta, `«${nombre}» tiene que ser un texto.`); return ''; }
  if (v.length > max) err(ruta, `«${nombre}» es demasiado largo (máx. ${max} caracteres).`);
  return v.slice(0, max);
}
export function lista(v, ruta, err, { min = 0, max = 50, nombre = ruta } = {}) {
  if (v == null) { if (min) err(ruta, `Falta «${nombre}» (una lista).`); return []; }
  if (!Array.isArray(v)) { err(ruta, `«${nombre}» tiene que ser una lista [ … ].`); return []; }
  if (v.length < min) err(ruta, `«${nombre}» necesita al menos ${min} elemento${min === 1 ? '' : 's'}.`);
  if (v.length > max) err(ruta, `«${nombre}» admite como mucho ${max} elementos.`);
  return v.slice(0, max);
}
export function numero(v, ruta, err, { min = -Infinity, max = Infinity, entero = false, obligatorio = false, nombre = ruta, defecto = null } = {}) {
  if (v == null || v === '') { if (obligatorio) err(ruta, `Falta «${nombre}» (un número).`); return defecto; }
  const n = Number(v);
  if (!Number.isFinite(n) || (entero && !Number.isInteger(n)) || n < min || n > max) { err(ruta, `«${nombre}» tiene que ser un número${entero ? ' entero' : ''}${Number.isFinite(min) ? ` desde ${min}` : ''}${Number.isFinite(max) ? ` hasta ${max}` : ''}.`); return defecto; }
  return n;
}
// Imagen: ruta del portal (img/…, materiales/…) o https://
export function imagen(v, ruta, err) {
  if (v == null || v === '') return '';
  if (!esTexto(v) || !(/^(img|materiales|assets)\/[\w./-]+\.(png|jpe?g|webp|gif|svg)$/i.test(v) || /^https:\/\/[^\s"'<>]+$/i.test(v))) { err(ruta, '«imagen» tiene que ser una ruta del portal (img/… o materiales/…) o un enlace https://'); return ''; }
  return v;
}
// Vídeo: YouTube o Vimeo (se incrusta sin cookies) o un .mp4/.webm del portal → { tipo, src }
export function video(v, ruta, err) {
  if (v == null || v === '') return null;
  const s = esTexto(v) ? v.trim() : v && typeof v === 'object' && esTexto(v.src) ? v.src.trim() : ''; // también el formato exportado {tipo, src}
  let m = s.match(/^https:\/\/(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
  if (m) return { tipo: 'iframe', src: `https://www.youtube-nocookie.com/embed/${m[1]}` };
  m = s.match(/^https:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d{4,12})/);
  if (m) return { tipo: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` };
  if (/^(materiales|assets)\/[\w./-]+\.(mp4|webm)$/i.test(s)) return { tipo: 'archivo', src: s };
  err(ruta, '«video» tiene que ser un enlace de YouTube o Vimeo, o un .mp4 del portal (materiales/…).'); return null;
}
// Laboratorio del portal que se puede incrustar: rutas internas «#…» (p. ej. #eee/circuitos)
export const LAB_RE = /^#(eee\/(circuitos|vivienda|esp32)|p\d{1,2}|[a-z0-9]{2,8}\/[a-z0-9_-]{2,40}(\/[a-z0-9_-]{1,40})?)$/;
export function lab(v, ruta, err) {
  if (v == null || v === '') return '';
  if (!esTexto(v) || !LAB_RE.test(v) || /^#(panel|trabajo|asig|inicio|biblioteca)\b/.test(v)) { err(ruta, '«lab» tiene que ser un laboratorio del portal, p. ej. "#eee/circuitos", "#eee/vivienda" o "#cdpc1/p5".'); return ''; }
  return v;
}
// Firestore no admite listas dentro de listas: comprobación para las pruebas.
export const anidada = (v) => (Array.isArray(v) ? v.some((x) => Array.isArray(x) || anidada(x)) : v && typeof v === 'object' ? Object.values(v).some(anidada) : false);
