// Motor «Laboratorio p5.js» (CDPC): retos con enunciado, código inicial, pistas y comprobaciones
// sobre el código, sobre variables y sobre píxeles del lienzo. Lógica pura: validar, traducir los
// errores de JavaScript al castellano y evaluar las comprobaciones (las de variables y píxeles las mide
// el lienzo aislado y aquí solo se comparan).
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';

export const ID_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;
const NOMBRE_VAR = /^[A-Za-z_$][\w$]{0,40}$/;
const COLOR = /^#[0-9a-f]{6}$/i;

export function validarComprobacion(c, ruta, err) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) { err(ruta, 'Cada comprobación es un objeto { "tipo": "codigo" | "variable" | "pixel", … }.'); return null; }
  const mensaje = texto(c.mensaje, ruta + '.mensaje', err, { max: 300, nombre: 'mensaje' });
  if (c.tipo === 'codigo') {
    const o = { tipo: 'codigo', mensaje };
    if (esTexto(c.contiene)) o.contiene = c.contiene.slice(0, 200);
    if (esTexto(c.noContiene)) o.noContiene = c.noContiene.slice(0, 200);
    if (esTexto(c.regex)) { try { new RegExp(c.regex); o.regex = c.regex.slice(0, 300); } catch (e) { err(ruta + '.regex', '«regex» no es una expresión regular válida.'); return null; } }
    if (!o.contiene && !o.noContiene && !o.regex) { err(ruta, 'La comprobación de código necesita «contiene», «noContiene» o «regex».'); return null; }
    return o;
  }
  if (c.tipo === 'variable') {
    if (!esTexto(c.nombre) || !NOMBRE_VAR.test(c.nombre)) { err(ruta + '.nombre', '«nombre» tiene que ser el nombre de una variable (letras, números y _ ).'); return null; }
    const o = { tipo: 'variable', nombre: c.nombre, mensaje };
    if (c.igual !== undefined) { if (!['number', 'string', 'boolean'].includes(typeof c.igual)) { err(ruta + '.igual', '«igual» tiene que ser un número, un texto o true/false.'); return null; } o.igual = c.igual; }
    const mn = numero(c.min, ruta + '.min', err, { nombre: 'min' }); if (mn != null) o.min = mn;
    const mx = numero(c.max, ruta + '.max', err, { nombre: 'max' }); if (mx != null) o.max = mx;
    return o;
  }
  if (c.tipo === 'pixel') {
    const x = numero(c.x, ruta + '.x', err, { min: 0, max: 2000, entero: true, obligatorio: true, nombre: 'x' });
    const y = numero(c.y, ruta + '.y', err, { min: 0, max: 2000, entero: true, obligatorio: true, nombre: 'y' });
    const o = { tipo: 'pixel', x, y, mensaje, tolerancia: numero(c.tolerancia, ruta + '.tolerancia', err, { min: 0, max: 255, nombre: 'tolerancia', defecto: 40 }) };
    if (esTexto(c.color) && COLOR.test(c.color)) o.color = c.color.toLowerCase();
    else if (esTexto(c.distinto) && COLOR.test(c.distinto)) o.distinto = c.distinto.toLowerCase();
    else { err(ruta, 'La comprobación de píxel necesita «color» o «distinto» en formato "#rrggbb".'); return null; }
    return o;
  }
  err(ruta + '.tipo', 'El tipo de comprobación tiene que ser "codigo", "variable" o "pixel".'); return null;
}

export function validarReto(r, ruta, err) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) { err(ruta, 'Cada reto es un objeto { "titulo", "enunciado", "codigo", … }.'); return null; }
  const id = esTexto(r.id) && ID_RE.test(r.id) ? r.id : null;
  if (r.id != null && !id) err(ruta + '.id', '«id» solo con minúsculas, números, «-» o «_».');
  return {
    id: id || '',
    titulo: texto(r.titulo, ruta + '.titulo', err, { max: 150, obligatorio: true, nombre: 'titulo' }),
    enunciado: texto(r.enunciado, ruta + '.enunciado', err, { max: 3000, obligatorio: true, nombre: 'enunciado' }),
    codigo: texto(r.codigo, ruta + '.codigo', err, { max: 20000, nombre: 'codigo' }) || 'function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(220);\n}\n',
    pistas: lista(r.pistas, ruta + '.pistas', err, { max: 10, nombre: 'pistas' }).map((p, i) => texto(p, `${ruta}.pistas[${i}]`, err, { max: 500, nombre: 'pista' })).filter(Boolean),
    comprobaciones: lista(r.comprobaciones, ruta + '.comprobaciones', err, { max: 20, nombre: 'comprobaciones' }).map((c, i) => validarComprobacion(c, `${ruta}.comprobaciones[${i}]`, err)).filter(Boolean),
  };
}

export function validarP5(c, err) {
  const R = lista(c.retos, 'retos', err, { min: 1, max: 20, nombre: 'retos' }).map((r, i) => validarReto(r, `retos[${i}]`, err)).filter(Boolean);
  R.forEach((r, i) => { if (!r.id) r.id = 'r' + (i + 1); });
  return { retos: R };
}

// ---------------------------------------------------------------- comprobaciones
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const dist = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
// medidas: { variables: {nombre: {existe, v}}, pixeles: {"x,y": [r,g,b]}, errores: n }
export function evaluarComprobacion(c, codigo, medidas = {}) {
  if (c.tipo === 'codigo') {
    let ok = true;
    if (c.contiene) ok = ok && codigo.includes(c.contiene);
    if (c.noContiene) ok = ok && !codigo.includes(c.noContiene);
    if (c.regex) ok = ok && new RegExp(c.regex).test(codigo);
    return ok;
  }
  if (c.tipo === 'variable') {
    const m = medidas.variables?.[c.nombre]; if (!m || !m.existe) return false;
    if (c.igual !== undefined && m.v !== c.igual) return false;
    if (c.min != null && !(Number(m.v) >= c.min)) return false;
    if (c.max != null && !(Number(m.v) <= c.max)) return false;
    return true;
  }
  if (c.tipo === 'pixel') {
    const p = medidas.pixeles?.[`${c.x},${c.y}`]; if (!Array.isArray(p)) return false;
    if (c.color) return dist(p, hex(c.color)) <= c.tolerancia;
    return dist(p, hex(c.distinto)) > c.tolerancia;
  }
  return false;
}
export const textoComprobacion = (c) => c.mensaje || (c.tipo === 'codigo' ? (c.contiene ? `El código usa «${c.contiene}»` : c.noContiene ? `El código no usa «${c.noContiene}»` : 'El código cumple el patrón')
  : c.tipo === 'variable' ? `La variable «${c.nombre}»${c.igual !== undefined ? ` vale ${JSON.stringify(c.igual)}` : c.min != null || c.max != null ? ` está entre ${c.min ?? '−∞'} y ${c.max ?? '∞'}` : ' existe'}`
    : `El píxel (${c.x}, ${c.y}) ${c.color ? `es de color ${c.color}` : `no es del color ${c.distinto}`}`);

// ---------------------------------------------------------------- errores en castellano
const REGLAS = [
  [/^(?:Uncaught )?ReferenceError: (\S+) is not defined/, (m) => `«${m[1]}» no existe. Revisa cómo está escrito (las mayúsculas cuentan) o créalo antes con «let ${m[1]} = …».`],
  [/Cannot access '(.+)' before initialization/, (m) => `Usas «${m[1]}» antes de crearlo: pon el «let ${m[1]}» más arriba.`],
  [/(\S+) is not a function/, (m) => `«${m[1]}» no es una función. Revisa el nombre (p. ej. ellipse, rect, fill, background) y los paréntesis.`],
  [/Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '(.+)'\))?/, (m) => `Intentas usar ${m[2] ? `«${m[2]}» de ` : ''}algo que no existe (${m[1] === 'null' ? 'null' : 'undefined'}).`],
  [/Cannot set propert(?:y|ies) of (undefined|null)/, () => 'Intentas cambiar algo que no existe (undefined).'],
  [/missing \) after argument list/, () => 'Falta cerrar un paréntesis «)» en una llamada a una función.'],
  [/Unexpected end of input/, () => 'Falta cerrar algo: cada «{» necesita su «}» y cada «(» su «)».'],
  [/Unexpected token '?([^']+)'?/, (m) => `Hay algo mal escrito cerca de «${m[1]}»: revisa paréntesis, llaves, comas y puntos y coma.`],
  [/Unexpected identifier '?([^']*)'?/, (m) => `Falta algo antes de «${m[1]}» (¿una coma, un paréntesis o un punto y coma?).`],
  [/Unexpected string/, () => 'Hay un texto entre comillas donde no toca: ¿falta una coma o un «+»?'],
  [/Unexpected number/, () => 'Hay un número donde no toca: ¿falta una coma o un operador?'],
  [/Invalid or unexpected token/, () => 'Hay un carácter que no vale (¿comillas «curvas» copiadas de un documento?).'],
  [/Identifier '(.+)' has already been declared/, (m) => `«${m[1]}» ya existe: no repitas «let ${m[1]}»; para cambiarlo escribe solo «${m[1]} = …».`],
  [/Assignment to constant variable/, () => 'No se puede cambiar una constante (const). Usa «let» si va a cambiar.'],
  [/Maximum call stack size exceeded/, () => 'Una función se llama a sí misma sin parar.'],
  [/Invalid left-hand side in assignment/, () => 'Asignación mal escrita: para comparar usa «===», para asignar «variable = valor».'],
];
export function traducirError(msg) {
  const s = String(msg || '').replace(/^Uncaught\s+/, '');
  for (const [re, f] of REGLAS) { const m = s.match(re); if (m) return f(m); }
  return 'Error: ' + s;
}

registrarMotor('p5', {
  nombre: 'Laboratorio p5.js',
  validar: validarP5,
  resumen: (c) => `${c.retos.length} reto${c.retos.length === 1 ? '' : 's'} p5.js · ${c.retos.reduce((a, r) => a + r.comprobaciones.length, 0)} comprobaciones`,
  entregable: true,
  ejemplo: {
    retos: [{
      id: 'circulo', titulo: 'Un círculo', enunciado: 'Dibuja un círculo en el centro del lienzo.',
      codigo: 'function setup() {\n  createCanvas(200, 200);\n}\n\nfunction draw() {\n  background(220);\n  // dibuja aquí\n}\n',
      pistas: ['La función circle(x, y, d) dibuja un círculo.'],
      comprobaciones: [{ tipo: 'codigo', regex: 'circle\\s*\\(|ellipse\\s*\\(', mensaje: 'Usas circle() o ellipse()' }, { tipo: 'pixel', x: 100, y: 100, distinto: '#dcdcdc', mensaje: 'El centro del lienzo no es del color del fondo' }],
    }],
  },
});
