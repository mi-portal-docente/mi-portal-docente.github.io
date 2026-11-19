// v5 · Las dos caras de cada elemento: el PDF oficial (visor de solo lectura del portal) y, si existe, la
// versión interactiva (explicación, cuestionario, laboratorio, editor p5.js…). Lógica pura: web y pruebas.
//  · pdf: { archivo: 'archivos/<id>', nombre, descarga }  → se abre con «#archivo/<id>» (o «…/descarga»).
//    Sin «pdf», vale el primer adjunto PDF del elemento (los elementos de antes no cambian).
//  · interactivo: { tipo, ref }  ref = id de otro elemento del aula o enlace interno del portal («#eee/circuitos/c3»).
//  · origen (solo profesor, en origenes/{id}): { drive, ruta, version }. Nunca se abre Drive desde el portal.
export const TIPOS_INTERACTIVO = { explicacion: 'Explicación interactiva', interactiva: 'Actividad interactiva', cuestionario: 'Cuestionario', laboratorio: 'Laboratorio', p5: 'Editor p5.js', web: 'Editor web', bloques: 'Retos por bloques', hoja: 'Hoja de cálculo', otro: 'Versión interactiva' };
const RE_ARCH = /^#archivo\/([A-Za-z0-9]{6,40})(\/descarga)?$/;
export const RE_PDF_ARCHIVO = /^archivos\/[A-Za-z0-9]{6,40}$/;
const esPdfNombre = (t) => /\.pdf$/i.test(String(t || '').trim());

export function pdfDe(it) {
  if (!it) return null;
  if (it.pdf?.archivo && RE_PDF_ARCHIVO.test(it.pdf.archivo)) {
    const id = it.pdf.archivo.slice(9);
    return { href: `#archivo/${id}${it.pdf.descarga ? '/descarga' : ''}`, titulo: it.pdf.nombre || it.titulo || 'PDF', id, descarga: !!it.pdf.descarga, oficial: true };
  }
  for (const e of it.enlaces || []) {
    const u = String(e?.u || ''); const m = u.match(RE_ARCH);
    if (m && esPdfNombre(e.t)) return { href: u, titulo: e.t, id: m[1], descarga: !!m[2], oficial: false };
    if (/^materiales\/[\w\-./]+\.pdf$/i.test(u) && !u.includes('..')) return { href: u, titulo: e.t || u.split('/').pop(), id: null, descarga: false, oficial: false };
  }
  return null;
}
export function interactivoDe(it) {
  const x = it?.interactivo; if (!x || !x.tipo) return null;
  const ref = String(x.ref || '').trim();
  const href = /^#[\w\-/]+$/.test(ref) ? ref : /^[A-Za-z0-9]{6,30}$/.test(ref) ? '#trabajo/' + ref : null;
  if (!href) return null;
  return { href, tipo: x.tipo, nombre: TIPOS_INTERACTIVO[x.tipo] || TIPOS_INTERACTIVO.otro };
}

// Validación del importador (devuelve el valor limpio o llama a err(ruta, texto))
export function validarPdf(p, err) {
  if (p == null) return null;
  if (typeof p !== 'object' || Array.isArray(p)) { err('pdf', '«pdf» tiene que ser { "archivo": "archivos/…", "nombre": "….pdf", "descarga": false }.'); return null; }
  const archivo = String(p.archivo || '');
  if (!RE_PDF_ARCHIVO.test(archivo)) { err('pdf.archivo', '«pdf.archivo» tiene que ser un archivo subido al portal: "archivos/<id>" (sin enlaces de Drive).'); return null; }
  if (p.nombre != null && (typeof p.nombre !== 'string' || p.nombre.length > 150)) { err('pdf.nombre', '«pdf.nombre» tiene que ser un texto de 150 letras como mucho.'); return null; }
  if (p.descarga != null && typeof p.descarga !== 'boolean') { err('pdf.descarga', '«pdf.descarga» tiene que ser true o false.'); return null; }
  return { archivo, nombre: String(p.nombre || '').trim(), descarga: p.descarga === true };
}
export function validarInteractivo(x, err) {
  if (x == null) return null;
  if (typeof x !== 'object' || Array.isArray(x)) { err('interactivo', '«interactivo» tiene que ser { "tipo": "explicacion", "ref": "…" }.'); return null; }
  const tipo = String(x.tipo || '');
  if (!TIPOS_INTERACTIVO[tipo]) { err('interactivo.tipo', `Tipo de versión interactiva «${tipo}» desconocido. Puede ser: ${Object.keys(TIPOS_INTERACTIVO).join(', ')}.`); return null; }
  const ref = String(x.ref ?? '').trim();
  if (ref.length > 300 || !(/^#[\w\-/]+$/.test(ref) || /^[A-Za-z0-9]{6,30}$/.test(ref))) { err('interactivo.ref', '«interactivo.ref» tiene que ser el id de otro elemento del aula o un enlace interno del portal que empiece por «#».'); return null; }
  return { tipo, ref };
}
export function validarOrigen(o, err) {
  if (o == null) return null;
  if (typeof o !== 'object' || Array.isArray(o)) { err('origen', '«origen» tiene que ser { "drive": "…", "ruta": "…", "version": "v3" }.'); return null; }
  const r = {};
  for (const [k, n] of [['drive', 120], ['ruta', 300], ['version', 30]]) {
    if (o[k] == null || o[k] === '') continue;
    if (typeof o[k] !== 'string' || o[k].length > n) { err('origen.' + k, `«origen.${k}» tiene que ser un texto de ${n} letras como mucho.`); return null; }
    r[k] = o[k].trim();
  }
  return Object.keys(r).length ? r : null;
}
