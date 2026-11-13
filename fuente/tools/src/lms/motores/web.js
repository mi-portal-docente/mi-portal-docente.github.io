// Motor «Editor web en vivo» (TIC): retos de HTML y CSS con vista previa aislada y comprobaciones sobre
// el documento resultante (selectores, textos y estilos calculados) o sobre el código.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';
import { ID_RE } from './p5.js';

export function validarComprobacionWeb(c, ruta, err) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) { err(ruta, 'Cada comprobación es un objeto { "tipo": "selector" | "estilo" | "codigo", … }.'); return null; }
  const mensaje = texto(c.mensaje, ruta + '.mensaje', err, { max: 300, nombre: 'mensaje' });
  const selector = () => { if (!esTexto(c.selector) || !c.selector.trim() || c.selector.length > 200) { err(ruta + '.selector', 'Falta «selector» (un selector CSS, p. ej. "h1" o "nav a").'); return null; } return c.selector.trim(); };
  if (c.tipo === 'selector') {
    const s = selector(); if (!s) return null;
    const o = { tipo: 'selector', selector: s, mensaje, min: numero(c.min, ruta + '.min', err, { min: 0, max: 100, entero: true, nombre: 'min', defecto: 1 }) };
    if (esTexto(c.texto) && c.texto) o.texto = c.texto.slice(0, 200);
    return o;
  }
  if (c.tipo === 'estilo') {
    const s = selector(); if (!s) return null;
    if (!esTexto(c.propiedad) || !/^-?[a-z][a-z-]{1,40}$/.test(c.propiedad)) { err(ruta + '.propiedad', '«propiedad» tiene que ser una propiedad CSS (p. ej. "color" o "font-size").'); return null; }
    if (!esTexto(c.valor) || !c.valor.trim()) { err(ruta + '.valor', 'Falta «valor» (p. ej. "#ff0000", "center" o "24px").'); return null; }
    return { tipo: 'estilo', selector: s, propiedad: c.propiedad, valor: c.valor.trim().slice(0, 100), mensaje };
  }
  if (c.tipo === 'codigo') {
    const en = c.en === 'css' ? 'css' : 'html'; const o = { tipo: 'codigo', en, mensaje };
    if (esTexto(c.contiene) && c.contiene) o.contiene = c.contiene.slice(0, 200);
    if (esTexto(c.regex) && c.regex) { try { new RegExp(c.regex, 'i'); o.regex = c.regex.slice(0, 300); } catch (e) { err(ruta + '.regex', '«regex» no es una expresión regular válida.'); return null; } }
    if (!o.contiene && !o.regex) { err(ruta, 'La comprobación de código necesita «contiene» o «regex».'); return null; }
    return o;
  }
  err(ruta + '.tipo', 'El tipo de comprobación tiene que ser "selector", "estilo" o "codigo".'); return null;
}
export function validarWeb(c, err) {
  const R = lista(c.retos, 'retos', err, { min: 1, max: 20, nombre: 'retos' }).map((r, i) => {
    const ruta = `retos[${i}]`; if (!r || typeof r !== 'object' || Array.isArray(r)) { err(ruta, 'Cada reto es un objeto { "titulo", "enunciado", "html", "css", … }.'); return null; }
    if (r.id != null && !(esTexto(r.id) && ID_RE.test(r.id))) err(ruta + '.id', '«id» solo con minúsculas, números, «-» o «_».');
    return { id: esTexto(r.id) && ID_RE.test(r.id) ? r.id : 'r' + (i + 1),
      titulo: texto(r.titulo, ruta + '.titulo', err, { max: 150, obligatorio: true, nombre: 'titulo' }),
      enunciado: texto(r.enunciado, ruta + '.enunciado', err, { max: 3000, obligatorio: true, nombre: 'enunciado' }),
      html: texto(r.html, ruta + '.html', err, { max: 20000, nombre: 'html' }), css: texto(r.css, ruta + '.css', err, { max: 20000, nombre: 'css' }),
      pistas: lista(r.pistas, ruta + '.pistas', err, { max: 10, nombre: 'pistas' }).map((p, k) => texto(p, `${ruta}.pistas[${k}]`, err, { max: 500, nombre: 'pista' })).filter(Boolean),
      comprobaciones: lista(r.comprobaciones, ruta + '.comprobaciones', err, { min: 1, max: 20, nombre: 'comprobaciones' }).map((x, k) => validarComprobacionWeb(x, `${ruta}.comprobaciones[${k}]`, err)).filter(Boolean) };
  }).filter(Boolean);
  return { retos: R };
}
// medidas (las toma la vista previa): { 'i': {n, textos:[…], valor} } por índice de comprobación
export function evaluarWeb(c, codigo, m) {
  if (c.tipo === 'codigo') { const t = codigo[c.en] || ''; return (!c.contiene || t.toLowerCase().includes(c.contiene.toLowerCase())) && (!c.regex || new RegExp(c.regex, 'i').test(t)); }
  if (!m) return false;
  if (c.tipo === 'selector') return m.n >= c.min && (!c.texto || (m.textos || []).some((x) => x.toLowerCase().includes(c.texto.toLowerCase())));
  if (c.tipo === 'estilo') return m.n > 0 && !!m.coincide;
  return false;
}
export const textoComprobacionWeb = (c) => c.mensaje || (c.tipo === 'selector' ? `Hay ${c.min > 1 ? `al menos ${c.min} elementos` : 'un elemento'} «${c.selector}»${c.texto ? ` con el texto «${c.texto}»` : ''}`
  : c.tipo === 'estilo' ? `«${c.selector}» tiene ${c.propiedad}: ${c.valor}` : `El ${c.en.toUpperCase()} ${c.contiene ? `usa «${c.contiene}»` : 'cumple el patrón'}`);

registrarMotor('web', {
  nombre: 'Editor web en vivo', validar: validarWeb, entregable: true,
  resumen: (c) => `${c.retos.length} reto${c.retos.length === 1 ? '' : 's'} web · ${c.retos.reduce((a, r) => a + r.comprobaciones.length, 0)} comprobaciones`,
  ejemplo: { retos: [{ id: 'titulo', titulo: 'Un título rojo', enunciado: 'Añade un título <h1> con el texto «Mi web» y ponlo de color rojo.',
    html: '<!-- escribe aquí -->\n', css: '/* estilos */\n', pistas: ['El título principal se escribe <h1>…</h1>.'],
    comprobaciones: [{ tipo: 'selector', selector: 'h1', texto: 'Mi web' }, { tipo: 'estilo', selector: 'h1', propiedad: 'color', valor: '#ff0000' }] }] },
});
