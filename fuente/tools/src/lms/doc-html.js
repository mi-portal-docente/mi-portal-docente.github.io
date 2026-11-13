// Fase 11 · Documento del alumno: HTML limitado (títulos, negrita, cursiva, listas, tablas, enlaces,
// imágenes y bloques de código). Se limpia SIEMPRE con una lista blanca antes de guardarlo y antes de
// mostrarlo (al profesor y al alumno): nada de scripts, estilos, eventos ni enlaces «javascript:».
// Funciona sin DOM (también en Node, para las pruebas y el .docx).
export const MAX_IMAGENES = 3;
export const MAX_IMG_BYTES = 300 * 1024;          // ~300 KB por imagen (comprimida en el navegador)
export const MAX_IMG_DATAURL = Math.ceil(MAX_IMG_BYTES * 4 / 3) + 64;
export const MAX_DOC = 300000;                     // caracteres de HTML del documento
export const PEGADO_GRANDE = 200;                  // caracteres a partir de los que se anota un pegado

const PERMITIDAS = new Set(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img', 'pre', 'code', 'blockquote', 'br']);
const ALIAS = { b: 'strong', i: 'em', h1: 'h2', h5: 'h4', h6: 'h4', div: 'p', strike: 's', del: 's', tt: 'code', kbd: 'code' };
const VACIAS = new Set(['br', 'img']);
const FUERA = new Set(['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math', 'head', 'title', 'textarea', 'select', 'button']);
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

export const escHTML = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function decodificar(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''; }
    return ENT[e.toLowerCase()] ?? m;
  });
}
function atributos(txt) {
  const a = {}; const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g; let m;
  while ((m = re.exec(txt))) a[m[1].toLowerCase()] = decodificar(m[2] ?? m[3] ?? m[4] ?? '');
  return a;
}
export const urlDocValida = (u) => /^https?:\/\/[^\s<>"']+$/i.test(String(u || '').trim());
export const dataImagenValida = (u) => /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(String(u || ''));

/** Árbol: { t: 'etiqueta', a: {attrs}, c: [hijos] } o { x: 'texto' }. Ya filtrado con la lista blanca. */
export function parsear(html, { plantilla = false } = {}) {
  const raiz = { t: '#', a: {}, c: [] }; const pila = [raiz]; let saltar = null;
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!(?:[^>]*)>|<\?[^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)|</g;
  let m; const s = String(html || '').slice(0, MAX_DOC * 2);
  while ((m = re.exec(s))) {
    if (m[2]) {
      let tag = m[2].toLowerCase(); const cierre = !!m[1];
      if (saltar) { if (cierre && tag === saltar) saltar = null; continue; }
      if (FUERA.has(tag)) { if (!cierre && !/\/\s*$/.test(m[3])) saltar = tag; continue; }
      tag = ALIAS[tag] || tag;
      if (!PERMITIDAS.has(tag)) continue; // se queda el contenido (span, font…)
      if (cierre) { for (let i = pila.length - 1; i > 0; i--) if (pila[i].t === tag) { pila.length = i; break; } continue; }
      const at = atributos(m[3]); const a = {};
      if (tag === 'a') { if (urlDocValida(at.href)) a.href = at.href.trim(); else { /* enlace no válido: solo el texto */ continue; } }
      if (tag === 'img') {
        if (/^img[1-3]$/.test(at['data-img'] || '')) a['data-img'] = at['data-img'];
        else if (urlDocValida(at.src)) a.src = at.src.trim();
        else if (plantilla && dataImagenValida(at.src) && at.src.length <= MAX_IMG_DATAURL) a.src = at.src;
        else continue;
        if (at.alt) a.alt = at.alt.slice(0, 200);
      }
      if ((tag === 'td' || tag === 'th') && /^[1-9]$/.test(at.colspan || '')) a.colspan = at.colspan;
      const nodo = { t: tag, a, c: [] };
      pila[pila.length - 1].c.push(nodo);
      if (!VACIAS.has(tag)) pila.push(nodo);
    } else if (m[4] != null) { if (!saltar) pila[pila.length - 1].c.push({ x: decodificar(m[4]) }); }
  }
  return raiz;
}
export function serializar(n) {
  if (n.x != null) return escHTML(n.x).replace(/\u00a0/g, '&nbsp;');
  const hijos = (n.c || []).map(serializar).join('');
  if (n.t === '#') return hijos;
  const at = Object.entries(n.a || {}).map(([k, v]) => ` ${k}="${escHTML(v)}"`).join('');
  return VACIAS.has(n.t) ? `<${n.t}${at}>` : `<${n.t}${at}>${hijos}</${n.t}>`;
}
/** HTML limpio (lista blanca). plantilla: el profesor puede incrustar imágenes pequeñas (data:). */
export const limpiarDoc = (html, op) => serializar(parsear(html, op)).slice(0, MAX_DOC);

export function textoDeDoc(html) {
  const out = []; const bloque = new Set(['p', 'h2', 'h3', 'h4', 'li', 'tr', 'pre', 'blockquote', 'br', 'table', 'ul', 'ol']);
  (function rec(n) { if (n.x != null) { out.push(n.x); return; } if (n.t === 'ul' || n.t === 'ol' || n.t === 'table') out.push('\n'); (n.c || []).forEach(rec); if (bloque.has(n.t)) out.push('\n'); if (n.t === 'td' || n.t === 'th') out.push('\t'); })(parsear(html));
  return out.join('').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
export const contarPalabras = (html) => { const t = textoDeDoc(html).trim(); return t ? t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0; };
export const imagenesDe = (html) => [...String(html || '').matchAll(/data-img="(img[1-3])"/g)].map((m) => m[1]);
export const docVacio = (html) => !textoDeDoc(html) && !imagenesDe(html).length;
